# Security Model

This document describes the actual security posture of the production
deployment. Only generic AWS service and IAM action names are used — no
account IDs, ARNs, hosted zone IDs, distribution IDs, OAC IDs or bucket
names appear anywhere in this repository.

## S3 bucket

- **Private by design**: Block Public Access is enabled on all four
  settings (block new public ACLs, block any public ACLs, block new public
  bucket policies, block any public bucket policies). Static Website
  Hosting is never enabled — enabling it would make the bucket servable
  directly over its own public HTTP endpoint, which contradicts the whole
  model below.
- **Bucket policy scoped to one distribution**: the policy grants
  `s3:GetObject` only to the `cloudfront.amazonaws.com` service principal,
  and only when the request's `AWS:SourceArn` condition matches this
  specific CloudFront distribution's ARN. There is no `Principal: "*"`
  anywhere in the policy, and no other distribution or account can satisfy
  the condition.
- **Encryption at rest**: SSE-S3 (server-side encryption managed by S3).
- **Expected behavior**: a direct request to the bucket's own endpoint (or
  to an individual object URL) returns `403 Access Denied`. The bucket is
  never reachable from the internet except indirectly, through CloudFront.

## CloudFront

- **Single public entry point**: CloudFront is the only service exposed to
  the internet for this site.
- **Origin Access Control (OAC)**, not the legacy Origin Access Identity
  (OAI): every origin request to S3 is signed with SigV4, which the bucket
  policy's `SourceArn` condition then validates.
- **HTTPS enforced**: viewer protocol policy is "Redirect HTTP to HTTPS" —
  no content is ever served over plain HTTP.
- **TLS 1.2 minimum**: the distribution's minimum supported TLS protocol
  version is 1.2.
- **ACM certificate** for both the apex domain and `www`, attached to the
  distribution.

## TLS / certificates

- Certificate issued by **AWS Certificate Manager**, in `us-east-1` (a hard
  CloudFront requirement for any custom-domain certificate, regardless of
  where other resources live).
- Validated via DNS, renewed automatically by AWS with no manual
  intervention.

## IAM (deployment identity)

- The deployment identity (an IAM role, assumed via a dedicated AWS CLI
  profile, see [architecture-decisions.md](./architecture-decisions.md#12-dedicated-least-privilege-iam-role-for-deployment))
  follows least privilege:
  - S3 object-level actions scoped to the specific bucket (no
    `s3:PutObjectAcl` — object access is governed entirely by Block Public
    Access, the bucket policy and OAC, never by per-object ACLs).
  - CloudFront invalidation scoped to the specific distribution.
  - CloudFront resource-creation actions use `Resource: "*"` only where the
    service genuinely doesn't support resource-level permissions for that
    action (an AWS/IAM limitation, not a deliberate broadening); everything
    else is scoped to specific ARNs.
  - No IAM permissions granted to the deployment role itself (it cannot
    create, modify or escalate IAM policies, including its own).
  - No administrator-level or account-wide permissions.

## Domain registration

- WHOIS privacy is enabled on the domain registration, so registrant
  contact details are not published in public WHOIS lookups.
- Transfer lock is enabled, preventing unauthorized domain transfers.

## Frontend

- No secrets, API keys, or credentials of any kind are embedded in the
  frontend bundle — there is nothing to embed, since the site has no backend
  to authenticate against.
- External links (LinkedIn, project links) use
  `rel="noopener noreferrer" target="_blank"` to prevent `window.opener`
  hijacking and unnecessary referrer leakage.
- No forms, no cookies, no analytics, no third-party scripts.

## What's intentionally out of scope for this MVP

- **WAF**: not attached to the distribution. Rationale and trade-off in
  [architecture-decisions.md](./architecture-decisions.md#6-no-waf-in-the-mvp).
- **Security headers** (HSTS, `X-Content-Type-Options`, etc.) beyond what
  CloudFront/HTTPS enforce by default: evaluated as a future candidate, not
  a requirement for this MVP.
