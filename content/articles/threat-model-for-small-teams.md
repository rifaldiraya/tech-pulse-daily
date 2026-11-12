---
title: "A Threat Model for Small Engineering Teams"
slug: "threat-model-for-small-teams"
description: "A lightweight, repeatable threat modelling process for teams without a dedicated security department — with a worked example and a one-page template."
category: "Cybersecurity"
tags:
  - Threat Modeling
  - AppSec
  - STRIDE
  - Risk
author: "TechPulse Admin"
publishedAt: "2026-10-06"
updatedAt: "2026-10-07"
coverImage: "/images/articles/threat-model-for-small-teams.png"
coverImageAlt: "Whiteboard threat model with assets, actors, and mitigations"
readingTime: 7
draft: false
---

# A Threat Model for Small Engineering Teams

Threat modelling has a reputation for being heavyweight: weeks of workshops, a giant diagram, and a document nobody reads again. Small teams cannot afford that, and they do not need it.

A useful threat model can be built in ninety minutes and reviewed every quarter. Its purpose is not to enumerate every possible attack. It is to make the team's security assumptions explicit.

## Define the system in one page

Start with a simple diagram: users, entry points, services, data stores, and external dependencies. Include trust boundaries — places where data or control crosses from one party to another.

For each element, note:

- What it does.
- Who can reach it.
- What data it handles.
- What happens if it fails.

Keep the diagram honest. If a service has an admin endpoint exposed to the internet, draw it.

## Ask the four questions

The classic framework is still the best starting point:

1. What are we building?
2. What can go wrong?
3. What are we going to do about it?
4. Did we do a good job?

The second question is where structured prompts help. STRIDE is a practical checklist:

| Threat | Question | Example |
| --- | --- | --- |
| Spoofing | Can someone pretend to be another identity? | Stolen session cookie |
| Tampering | Can data be changed in transit or at rest? | Unsigned webhook payload |
| Repudiation | Can an action be denied later? | Missing audit log |
| Information disclosure | Can data leak? | Verbose error messages |
| Denial of service | Can availability be degraded? | Unbounded query endpoint |
| Elevation of privilege | Can a user gain more access? | Missing authorisation check |

Not every category applies to every component. The value is in the conversation, not the table.

## Worked example: a file upload feature

**Assets:** user files, malware scanning results, storage credentials, file metadata.

**Actors:** authenticated users, anonymous visitors, administrators, external scanner service.

**Trust boundaries:** browser to API, API to object storage, API to scanner, scanner to API callback.

Threats and mitigations:

1. **Malicious file upload.** Validate content type, limit size, scan asynchronously, store outside the web root, serve with `Content-Disposition: attachment` where appropriate.
2. **Path traversal.** Never build storage keys from user input; use generated identifiers.
3. **Unauthorised access.** Check ownership on every download, not just in the UI.
4. **Scanner callback spoofing.** Sign callbacks and verify signatures with a rotating secret.
5. **Storage exhaustion.** Enforce per-user quotas and retention policies.
6. **Metadata leakage.** Strip EXIF data unless there is a product reason to keep it.

Each mitigation should have an owner and a test. "Validate content type" is not done until there is a test that proves it.

> A threat model without tests is a wish list with better formatting.

## Prioritise with likelihood and impact

A simple 3×3 matrix is enough for most teams. Score each threat qualitatively, then choose a response:

- **Mitigate:** reduce likelihood or impact.
- **Transfer:** insurance or a third-party control.
- **Avoid:** remove the feature or the exposure.
- **Accept:** document the risk and revisit it.

Acceptance is legitimate, but it must be explicit. An undocumented accepted risk is indistinguishable from an oversight.

## Review triggers, not just dates

Quarterly reviews are useful, but certain changes should trigger a review immediately:

- A new public endpoint.
- A new third-party integration.
- A change to authentication or authorisation.
- A new data category, especially personal or payment data.
- An architecture change that moves a trust boundary.

Add these triggers to the pull request template. Security review becomes part of delivery rather than a separate ceremony.

## Keep the artefact alive

Store the threat model next to the code, in Markdown, and link it from the service README. Update it when the design changes.

A minimal template:

```markdown
# Threat model: <service>

## Purpose
## Data handled
## Trust boundaries
## Threats
| Threat | Likelihood | Impact | Mitigation | Owner | Test |
## Accepted risks
## Review history
```

The table should be short enough to read in five minutes. If it grows beyond that, split it by component.

## Measure whether it helps

Track the number of threats with a verified mitigation, the time from identification to fix, and the share of changes that triggered a review. These are more meaningful than the number of workshops held.

Threat modelling is not a security team deliverable. It is a design habit: understand what you are building, ask what could go wrong, and prove that your response works. Small teams can do that well precisely because their systems are small enough to describe honestly.
