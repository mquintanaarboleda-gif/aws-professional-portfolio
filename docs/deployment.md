# Deployment

## Process

The first production deployment was performed **manually via AWS CLI**, not
the AWS Console — a deliberate choice to script and verify each step
precisely, using a dedicated least-privilege IAM role (see
[architecture-decisions.md](./architecture-decisions.md#12-dedicated-least-privilege-iam-role-for-deployment)).
Infrastructure as Code was deliberately deferred for this first pass (see
[architecture-decisions.md](./architecture-decisions.md#9-no-iac-for-the-first-deployment)).
A detailed, placeholder-based checklist of this process lives in
[`AWS_DEPLOYMENT.md`](../AWS_DEPLOYMENT.md) at the project root; this
document summarizes the order of operations and the caching strategy.

### Order of operations

1. **Build**: `npm run build` (`tsc -b && vite build`) generates the static
   output in `dist/` — HTML, CSS and JS ready to upload with no further
   transformation.
2. **S3 bucket**: create a general-purpose bucket; no Static Website
   Hosting.
3. **Block Public Access**: enable all four settings on the bucket.
4. **Origin Access Control (OAC)**: create the OAC that CloudFront will use
   to sign requests to this bucket.
5. **ACM certificate**: request a public certificate in `us-east-1` for the
   apex domain and `www`, and complete DNS validation (temporary validation
   records in Route 53) until the certificate reaches `Issued`.
6. **CloudFront distribution**: create it with the S3 bucket as origin,
   origin access via the OAC from step 4, the ACM certificate from step 5
   attached, both the apex domain and `www` as alternate domain names,
   `index.html` as the default root object, and "Redirect HTTP to HTTPS" as
   the viewer protocol policy.
7. **Bucket policy**: apply the restrictive policy that only allows
   `s3:GetObject` from the `cloudfront.amazonaws.com` service principal when
   `AWS:SourceArn` matches this distribution (template in
   [security.md](./security.md)).
8. **Upload**: sync the contents of `dist/` to the bucket with
   differentiated `Cache-Control` metadata (table below).
9. **Route 53**: create Alias records (apex and `www`) pointing at the
   CloudFront distribution.
10. **Validation**: confirm HTTP → HTTPS redirect works, TLS certificate is
    valid for both hosts, direct S3 access returns `403`, and cached assets
    behave as expected.

## Cache-Control strategy

| File group | Cache-Control | Reason |
|---|---|---|
| `assets/*.js`, `assets/*.css` (content-hashed by Vite) | `max-age=31536000, immutable` | The filename changes whenever the content changes, so a new deploy never overwrites a cached URL — caching aggressively is safe. |
| `index.html` | `max-age=0, must-revalidate` | It's the only file that references the hashed asset names; it must always be revalidated so it never points at assets from a previous deploy. |
| `favicon.svg` | short/medium cache (not content-hashed) | Changes rarely, but isn't critical path for content freshness. |

CloudFront invalidation rules follow the same logic: hashed assets normally
don't need invalidation (a new deploy produces new filenames), `index.html`
can be invalidated individually when needed, and a full `/*` invalidation is
reserved for exceptional cases rather than routine deploys.

## Build process

`npm run build` runs `tsc -b` (type checking) followed by `vite build`
(bundling and optimization). The output in `dist/` is self-contained static
content — no server-side rendering, no build-time secrets, nothing beyond
HTML/CSS/JS and static assets.

## Updates

Subsequent deploys repeat steps 1 and 8–10 only: build, sync to S3 with the
same Cache-Control metadata, invalidate `index.html` if its content changed,
update DNS only if the architecture itself changes (it normally doesn't).
