# Kiro Workflow

This project was built using Kiro's spec-driven workflow:
**Requirements → Design → Tasks → Implementation → Verification → Deployment**.
Each stage produced an artifact under `.kiro/specs/professional-landing-page/`,
and each stage ended at a gate where the project owner reviewed and approved
before the next stage began.

A note on how to read this document: Kiro proposed, drafted, executed and
verified at every stage. Kiro did not make the decisions that mattered —
those were approval gates the project owner decided explicitly. Where this
document says "Kiro proposed X", it means exactly that: a draft or option
set was generated for a human decision, not that the decision itself was
automated.

## Requirements

`requirements.md` defines the problem (a Solution Architect / Cloud Architect
/ Technical Presales professional needing a credible digital presence),
a glossary of domain terms, and numbered requirements with EARS-style
acceptance criteria (`THE Landing_Page SHALL ...`). Kiro drafted this
structure and the acceptance criteria from a description of the problem;
the project owner reviewed and approved the requirements before design
started — including explicit scope boundaries (no backend, no database, no
CMS, no auth) that shaped every later decision.

## Design

`design.md` translates the approved requirements into a concrete
architecture: component structure, content/type model, the AWS deployment
target (S3 private + CloudFront + OAC + ACM + Route 53), caching strategy,
and testing strategy. Kiro proposed this design, including the rationale for
each architectural choice (documented further in
[architecture-decisions.md](./architecture-decisions.md)); the project owner
approved the design — including which AWS services to use and which to
explicitly exclude — before any task was broken down.

## Tasks

`tasks.md` breaks the approved design into sequential, scoped implementation
tasks (components, sections, content wiring, styling, accessibility,
deployment preparation). Kiro generated this breakdown from the design
document; the project owner could review and adjust task scope before
implementation of each task began.

## Implementation

Each task was implemented by Kiro against the project's steering files
(`.kiro/steering/professional-landing-*.md`), which encode the
already-approved technical, structural, security and product constraints as
continuous guardrails — for example, "no new dependency without a concrete
need" or "S3 must be private, never Static Website Hosting". Steering files
don't represent new decisions made during implementation; they're the
already-approved decisions from the design/requirements gates, kept
in front of every implementation task so they're consistently respected.

## Verification

No task was considered complete without verification: TypeScript type
checking (`npm run type-check`), linting (`npm run lint`), a successful
production build (`npm run build`), and structured manual testing
(navigation, external links, responsive behavior, basic accessibility).
Kiro ran these checks and reported results; the project owner reviewed the
output rather than taking "it built" on faith.

## Deployment

The deployment checklist (`AWS_DEPLOYMENT.md`, and this document's companion
[deployment.md](./deployment.md)) was prepared by Kiro as a precise,
placeholder-based sequence of steps. Every decision with real consequences —
choosing AWS CLI over the Console, approving the cost estimate, approving
each phase of the IAM/ACM/CloudFront/S3/Route 53 setup individually,
registering the domain, and the final go/no-go for production — was an
explicit approval gate decided by the project owner, not an outcome Kiro
arrived at on its own. Kiro's role at this stage was to execute the agreed
steps, verify their result, and stop at each gate until the next approval
was given.

## Why this matters for this portfolio

This workflow is the evidence this project is meant to show for responsible,
supervised use of AI agents in a real delivery process: Kiro accelerates
drafting, execution and verification, while every decision with security,
cost or architectural consequence remained a human approval gate.
