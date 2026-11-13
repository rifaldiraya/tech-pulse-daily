---
title: "Microsoft 365 Outage Rolls Into a Second Day as Recovery Inches Forward"
slug: "microsoft-365-outage-november-2026"
description: "Outlook, Teams, SharePoint and Copilot are still coming back after a global Microsoft 365 disruption that began on Thursday. The cause was capacity, not traffic — and that distinction matters."
category: "Cloud Computing"
tags:
  - Microsoft 365
  - Outlook
  - Microsoft Teams
  - Cloud Reliability
  - Incident Response
author: "TechPulse Admin"
publishedAt: "2026-11-13"
updatedAt: "2026-11-13"
featured: true
coverImage: "/images/articles/microsoft-365-outage-november-2026-cover.png"
coverImageAlt: "Cracked cloud illustration with falling debris, printed in navy and orange on paper"
readingTime: 7
draft: false
schemaType: NewsArticle
---

# Microsoft 365 Outage Rolls Into a Second Day as Recovery Inches Forward

Microsoft spent Friday morning nursing its productivity cloud back to health after an outage that knocked out Outlook, Teams, SharePoint, Copilot and Defender XDR for users around the world. The disruption began on Thursday afternoon in the United States and, by the time Microsoft published its 8:05 AM ET update on Friday, services were improving — but not fixed.

"We're seeing encouraging recovery progress, with service availability and email delivery performance improving across a growing portion of affected Microsoft 365 infrastructure," the company said in its status update, while warning that "some users may still experience intermittent issues as recovery actions continue."

That is a careful way of saying the incident is still open, roughly nineteen hours after Microsoft first acknowledged it.

## What went down

Microsoft's advisory, tracked as incident **MO1550821**, listed connectivity failures across a broad slice of the suite:

| Service | Reported impact |
| --- | --- |
| Exchange Online | Mailbox connectivity failures, delayed delivery |
| Microsoft Teams | Sign-in and messaging problems |
| SharePoint Online | Access and loading failures |
| Microsoft 365 Copilot | Unavailable or degraded responses |
| Microsoft Defender XDR | Portal and telemetry access issues |

Downdetector also recorded spikes for Azure, OneDrive and the Microsoft Store, although Microsoft's public advisory focused on the collaboration and security products. Users in every region were eventually affected; the incident started with mailbox reports in the Americas and widened from there.

The timing was punishing. Thursday's outage landed in the middle of the working day for North America and the evening for Europe and Asia, so the first wave of complaints arrived from businesses, schools and public agencies at once. Reuters reported that the disruption spread across companies and government services globally.

## A capacity problem, not a traffic problem

The most interesting part of this incident is the diagnosis.

Microsoft's first explanation was elevated infrastructure load across multiple regions. A few hours later the company corrected itself: the load was not caused by more people using the service. It was caused by servers disappearing.

"We determined the elevated load isn't driven by an increase in traffic, but by a number of servers being unexpectedly unavailable; straining the remaining infrastructure," Microsoft said.

In other words, demand stayed roughly flat while supply fell. The remaining machines absorbed the work, their core processes became overwhelmed, and capacity dropped further. Microsoft paused all deployments, shifted traffic to alternate routes, restarted affected servers and weighed reverting a small number of recent configuration changes to speed things up.

For anyone who runs distributed systems, that sequence is familiar and unpleasant. Losing capacity is harder to manage than a traffic spike, because the usual levers — rate limiting, shedding load, scaling out — assume there is somewhere healthy to scale to. When nodes vanish in bulk, the control plane that is supposed to replace them may be the thing that is struggling.

Email made it worse. Exchange queues messages when a mailbox server is unreachable, and those queues grow faster than they drain. To avoid throwing away mail during the backlog, Microsoft extended its delivery timeout window to 48 hours. Users reported previously delayed messages arriving hours late, in bursts.

## The timeline so far

- **Thursday, 9:45 AM ET** — A separate Teams incident (TM1550488) disrupts messaging in North and South America; Microsoft attributes it to resource contention and resolves it by 10:53 AM ET.
- **Thursday, 1:26 PM ET** — Microsoft 365 incident MO1550821 begins. Outlook, Teams, SharePoint, Copilot and Defender XDR report connectivity failures.
- **Thursday evening** — Microsoft traces the problem to unexpectedly unavailable servers, pauses deployments and starts returning machines to service.
- **Friday, 8:05 AM ET** — Microsoft reports "encouraging recovery progress" but says intermittent issues remain and email backlogs are still draining.

Microsoft has not said whether the two Thursday incidents share a cause. That question is worth watching: two independent failures on the same day is bad luck, while a shared dependency is an architectural finding.

## Why this keeps happening to productivity clouds

Large SaaS outages are rarely caused by one broken feature. They are caused by shared dependencies — identity, storage, networking, deployment pipelines — and by the fact that recovery actions themselves consume capacity.

Three patterns recur in incidents like this one:

1. **The blast radius is the product.** Microsoft 365 is not one service. It is dozens of services sharing authentication, directory and storage layers. When those layers wobble, customers experience it as "everything is down."
2. **Recovery is load.** Restarting thousands of servers, replaying queues and reconnecting clients all create work. Systems that fail under load often fail again during the fix.
3. **Status pages live in the same cloud.** The place customers go to learn what is broken can be affected by the outage it is describing. Organisations that rely only on a vendor's status page for situational awareness are exposed.

## What teams should do while it is still degrading

If your organisation is still seeing intermittent failures, resist the urge to change things quickly. A few practical steps:

- **Leave retry logic alone.** Client retries multiply pressure on a recovering service. If you have a retry storm configured, now is the moment to confirm backoff and jitter are actually working.
- **Do not flush local mail queues.** Queues are preserving messages. Manually purging them destroys the evidence and the mail.
- **Watch the dependencies you forgot.** Conditional Access, Defender telemetry, Copilot connectors and third-party backup tools all authenticate against the same tenant. Degraded security telemetry during an outage is a risk in its own right.
- **Communicate outside the affected stack.** Use your own channels for internal updates. If your incident comms run on Teams, they are part of the outage.
- **Write the timeline now.** Times, symptoms, affected services and the decisions you made. Memory of an incident decays within a day.

## What is still unresolved

Microsoft has not published a root cause, and it has not explained what made the servers unavailable in the first place — hardware, a bad configuration push, a control-plane fault or something else. The company also has not confirmed when full service will be restored, only that recovery is gradual.

Until then, the honest summary is this: Microsoft's cloud is coming back, slowly, and the interesting engineering question is not why it broke but why losing a set of servers was enough to strain the rest of the fleet.
