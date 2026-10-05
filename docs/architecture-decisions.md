# Architecture Decisions

Lightweight ADR format: Context / Decision / Alternative / Trade-off. These
decisions were proposed during the Kiro-assisted design phase and approved by
the project owner before implementation (see
[kiro-workflow.md](./kiro-workflow.md) for how that approval flow worked).

## 1. S3 private vs S3 Static Website Hosting

**Context**: S3 can serve static content directly (Static Website Hosting
endpoint, HTTP only, no custom TLS) or purely as a private object store
behind another distribution service.

**Decision**: Private bucket, Block Public Access enabled on all four
settings, Static Website Hosting never enabled.

**Alternative**: S3 Static Website Hosting, pointed at directly or fronted by
CloudFront with a website-endpoint origin.

**Trade-off**: Static Website Hosting is simpler to stand up and doesn't
require OAC configuration, but it only supports HTTP, can't enforce
origin-level access control, and would require a public bucket. Giving that
up means slightly more setup (OAC, bucket policy with a `SourceArn`
condition) in exchange for a bucket that is never reachable from the public
internet.

## 2. CloudFront as the only public entry point

**Context**: The site needs a public HTTPS endpoint with low latency for
visitors in different regions.

**Decision**: CloudFront is the sole public-facing service; nothing else is
exposed to the internet.

**Alternative**: Expose S3 directly (ruled out by decision 1), or use a
Load Balancer in front of some compute layer (irrelevant without a backend).

**Trade-off**: CloudFront adds a layer of configuration (cache behaviors,
OAC, alternate domain names) compared to a bare static host, but it's the
only option that gives TLS termination, edge caching, and a controlled origin
access path in one managed service, at effectively no fixed cost for this
traffic profile.

## 3. OAC vs OAI (legacy)

**Context**: CloudFront needs a way to authenticate to the private S3
origin. AWS offers two mechanisms: the legacy Origin Access Identity (OAI)
and the newer Origin Access Control (OAC).

**Decision**: OAC, with SigV4 request signing.

**Alternative**: OAI.

**Trade-off**: OAI is simpler historically and still works, but it's a
legacy mechanism with narrower support (e.g. it doesn't support SSE-KMS
origins and has a less precise permission model). OAC is the AWS-recommended
replacement, with no practical downside for a new distribution — the only
"cost" is that it's slightly less documented in older tutorials.

## 4. Route 53 for DNS

**Context**: The domain needs DNS records pointing to CloudFront, including
at the zone apex, where a plain CNAME is not allowed by the DNS spec.

**Decision**: Route 53 hosted zone with Alias records (not CNAME) for both
the apex domain and `www`.

**Alternative**: Any third-party DNS provider using an ALIAS/ANAME-equivalent
record, or a CNAME flattening feature if the provider supports one.

**Trade-off**: Route 53 isn't the cheapest DNS provider on paper, but Alias
records to CloudFront are native, free of charge for the alias resolution
itself, and keep DNS and the registrar/infrastructure decisions inside the
same AWS account, which simplifies ACM DNS validation.

## 5. ACM (public, us-east-1, free)

**Context**: CloudFront requires a certificate for any custom domain used as
an alternate domain name, and that certificate must be requested in
`us-east-1` regardless of where other resources live.

**Decision**: Public ACM certificate for the apex domain and `www`, issued in
`us-east-1`, validated via DNS, auto-renewed by AWS.

**Alternative**: A certificate from a third-party CA, imported into ACM or
installed on a different TLS-terminating layer.

**Trade-off**: None of real weight here — ACM is free, auto-renews, and DNS
validation through Route 53 is a one-time setup. The only constraint worth
documenting is the hard `us-east-1` region requirement, which is easy to miss
if the rest of the infrastructure lives in a different region.

## 6. No WAF in the MVP

**Context**: AWS WAF can filter malicious requests (bot patterns, SQL
injection attempts, rate limiting) in front of CloudFront.

**Decision**: No WAF for this MVP.

**Alternative**: Attach a WAF web ACL to the CloudFront distribution with
managed rule groups.

**Trade-off**: WAF has a per-ACL and per-rule monthly cost plus request-based
pricing. For a static site with no forms, no login, and no write paths, the
attack surface WAF protects against (injection, credential stuffing,
account takeover) largely doesn't apply. The trade-off accepted is forgoing
layer-7 bot/scraping filtering in exchange for not paying for and operating a
service with little marginal benefit at this stage; it's a candidate to
revisit if the site gains dynamic behavior.

## 7. No backend (no API Gateway / Lambda)

**Context**: The landing page could, in principle, support a contact form or
dynamic data via a serverless backend.

**Decision**: No backend of any kind. All contact actions (`mailto:`,
LinkedIn link) are initiated by the browser directly.

**Alternative**: API Gateway + Lambda for a contact form, or a Lambda@Edge /
CloudFront Function for request-time logic.

**Trade-off**: A backend would allow richer interactions (contact form with
validation, server-side logic) but adds infrastructure to maintain, secure,
and pay for, for a feature (contact) that `mailto:` and an external LinkedIn
link already satisfy. Simplicity won given the actual requirement.

## 8. No database

**Context**: All content is static and known at build time.

**Decision**: No database of any kind; content lives in versioned TypeScript
modules (`src/content/es.ts`) compiled into the build.

**Alternative**: A managed database (DynamoDB, RDS) backing a CMS or a
dynamic content API.

**Trade-off**: Updating content requires a code change and a rebuild instead
of an admin UI, which is a reasonable cost for a page whose content changes
infrequently and is maintained by the same person who can edit code.

## 9. No IaC for the first deployment

**Context**: The infrastructure could be defined in Terraform, AWS CDK, or
CloudFormation from day one.

**Decision**: The first deployment is manual, performed service by service
via AWS CLI, specifically to build hands-on understanding of each resource
and how they connect, before encoding that into IaC.

**Alternative**: Terraform or CDK from the start.

**Trade-off**: Manual deployment is not repeatable or easily version
-controlled, and re-running it correctly depends on following a documented
checklist (see [deployment.md](./deployment.md)). That cost was accepted
deliberately in exchange for a deeper understanding of IAM, OAC, bucket
policies and CloudFront configuration than wrapping them in a module would
have given on a first pass. IaC remains a reasonable next step once the
manual process is well understood.

## 10. No CloudFront Function for www redirection

**Context**: Many sites redirect either the apex domain to `www` or vice
versa, often implemented with a CloudFront Function or Lambda@Edge at the
viewer-request level.

**Decision**: No redirect function. Both the apex domain and `www` are
configured as alternate domain names (aliases) on the same CloudFront
distribution, and both serve the site directly with no redirection between
them.

**Alternative**: Add a CloudFront Function to redirect `www` to the apex (or
the reverse), enforcing a single canonical host.

**Trade-off**: Serving both hosts without a canonical redirect means the same
content is reachable at two URLs, which is a minor SEO/consistency
consideration (mitigated separately via the `canonical` link tag in the
page's HTML). The upside is one less moving part (no function to deploy,
version, or debug) for a site where this is a cosmetic concern rather than a
functional one.

## 11. Differentiated Cache-Control

**Context**: The build output mixes hashed, content-addressed assets
(`assets/*.js`, `assets/*.css` — Vite embeds a content hash in the filename)
with non-hashed files (`index.html`, `favicon.svg`).

**Decision**: Hashed assets get a long, immutable cache lifetime
(`max-age=31536000, immutable`); `index.html` gets a short cache lifetime with
mandatory revalidation (`max-age=0, must-revalidate`); `favicon.svg` gets a
short-to-medium cache lifetime. The full table and the reasoning behind each
value live in [deployment.md](./deployment.md), reusing the strategy already
documented in `AWS_DEPLOYMENT.md`.

**Alternative**: A single, uniform Cache-Control value for every file.

**Trade-off**: A uniform short cache would waste CloudFront cache efficiency
on assets that never change under their current URL; a uniform long cache
would risk visitors getting a stale `index.html` that references assets from
a previous deploy. Differentiating by file type gets both aggressive caching
and freshness, at the cost of one extra piece of deployment logic (setting
metadata per file group during upload instead of a single blanket setting).

## 12. Dedicated least-privilege IAM role for deployment

**Context**: The human identity used during initial exploration had
`AdministratorAccess` via a group membership, which is far broader than what
deployment operations actually require.

**Decision**: A dedicated IAM role, scoped to only the actions needed to
deploy (S3 object operations on the specific bucket, CloudFront invalidation
on the specific distribution, and the one-time resource-creation actions
needed during initial setup), assumed through a separate AWS CLI profile
rather than used directly from the broad-access identity.

**Alternative**: Keep using the administrator identity directly for
deployments.

**Trade-off**: A dedicated role adds setup overhead (defining the policy,
configuring the CLI profile, remembering to assume it) compared to just using
already-available broad credentials. That overhead is accepted because it
meaningfully reduces blast radius: a compromised or misused deployment
credential can only touch the specific S3 bucket and CloudFront distribution
it was scoped to, not the whole AWS account.
