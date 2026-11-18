---
title: "FBI Says Hackers Are Using AI to Cut Breaches Down to Three Hours"
slug: "fbi-artex-ai-cyberattack-speed"
description: "An FBI flash advisory names ARTEX, an open-source agent framework that moved attackers from target selection to privileged access in under three hours — behind a 2,250-tenant ConnectWise spill and breaches at South Korean banks."
category: "Cybersecurity"
tags:
  - FBI
  - ARTEX
  - AI Agents
  - Cyberattack
  - ConnectWise
  - Incident Response
author: "TechPulse Admin"
publishedAt: "2026-11-18"
updatedAt: "2026-11-18"
featured: true
popular: false
coverImage: "/images/articles/fbi-artex-ai-cyberattack-speed.png"
coverImageAlt: "Technical diagram of an AI-agent intrusion timeline running from target selection to domain administrator in under three hours, with ARTEX planner and worker stages"
readingTime: 9
draft: false
schemaType: NewsArticle
---

# FBI Says Hackers Are Using AI to Cut Breaches Down to Three Hours

The most important number in the FBI's new cyber advisory is not a victim count. It is a duration: **under three hours**.

That is how quickly the bureau says some intrusions moved from picking a target to holding privileged access inside it, using an open-source AI agent framework called ARTEX. The advisory, published on Friday 13 November as a flash bulletin through the IC3 portal, describes campaigns against banks, government agencies, technology companies, defence contractors, telecoms and law firms. It reached a much wider audience this week, after a weekend of speculation that tied the attacks to the Microsoft 365 outage, the FAA ground stop and a Chase banking disruption. The FBI says there is no evidence of that connection.

The distinction matters. This is not a story about AI breaking encryption or inventing a new class of vulnerability. It is a story about the economics of attack changing, because the boring parts — scanning, enumerating, trying credentials, moving sideways, packaging what was found — can now be done by software that does not sleep, does not get bored and does not bill by the hour.

## What the FBI actually published

The bulletin is a flash advisory, the bureau's format for time-sensitive threat information that defenders need before a full report exists. It lists the sectors hit since at least August and names the tooling involved, including ARTEX but not exclusively. The headline finding is behavioural rather than technical:

> In some cases, Artex-linked attacks can move from targeting a system to active compromise in under three hours.

Three named incidents anchor the warning:

| Incident | Documented scale |
| --- | --- |
| South Korean banks | ~67,000 records exposed |
| ConnectWise customers | 2,250+ Microsoft 365 tenants |
| Barracuda | 44 hours, ~10 cloud accounts |

Every one of them started with a credential that was valid, exposed or weakly protected — not with a zero-day.

The bureau's recommendations are unglamorous and familiar: limit access to sensitive systems, review what third-party software is permitted to do, replace credentials that may have been exposed, and watch for unusual account activity or large data transfers. Nothing on that list requires an AI budget. All of it requires knowing what is connected to what.

## ARTEX is a planner and a workforce

ARTEX was released in July 2026 as an open-source, AI-driven penetration-testing framework. Its architecture is the part worth understanding, because it explains the speed.

A "planner" agent decides the next step. "Worker" agents run conventional security tools, and everything they learn is written into a shared map of the target. The planner reads that map, picks the next most promising lead, and dispatches more work. Point it at hosted frontier models from Anthropic or OpenAI, or at open-weight models, and the loop runs itself.

That design produces two effects. The first is parallelism: instead of one tester working through a checklist, dozens of attempts run at once against different services, credentials and endpoints. The second is persistence: a dead end becomes a data point, not a stopping condition.

It also produces noise. The FBI notes that ARTEX intrusions can be loud, generating the kind of traffic that should trip alerts. The problem is not that defenders cannot see the attack. It is that they cannot triage it fast enough, and that the attacker does not need to be subtle when it can afford to be fast.

ARTEX's developer removed the original repository in October and moved the project away from open source after reports of abuse. The FBI says the earlier version still circulates and remains widely accessible.

## Three intrusions, one pattern

**South Korea.** Attacks on financial institutions exposed the personal data of about 67,000 people, with weak security controls and missing multi-factor authentication cited as major contributors. An exposed ARTEX instance was later linked to the campaign, which is its own warning about how these tools are operated.

**ConnectWise.** Microsoft attributed a campaign it calls Storm-0940 — likely Chinese state-aligned actors — to the abuse of stolen ConnectWise backup credentials, which let attackers reach the Microsoft 365 environments of at least 2,250 customers without signing in as an individual user. The FBI confirmed that finding. ConnectWise told TechCrunch it does not have the visibility to confirm the number, which is a fair statement about a supply chain and also a reminder that the victim count in any advisory is an estimate, not an audit.

**Barracuda.** The security vendor published its own anatomy of a 44-hour intrusion that began on 1 November with a valid cloud access key issued to a third-party vendor and never revoked. Within a day the attacker had read stored secrets, moved into analytics, taken a source-code token, reached Kubernetes clusters and pushed short-lived branches designed to print build secrets into a job log. It deployed a read-only container that mounted the host filesystem to harvest credentials, tried to create an administrative cloud identity, and searched servers for wallet files, seed phrases and AI service keys. An engineer noticed unusual account activity on 4 November. By then, the attacker had already stopped.

Barracuda's conclusion is the sentence to keep: "Defenders who rely on spotting malicious activity and then responding to it will often arrive after the attacker has finished."

## Why speed changes the defence

Security programmes are built around a race that defenders have historically been able to win on time. Prevention buys you the first attempt. Detection buys you the second. Response buys you containment before the intruder reaches anything that matters. Every one of those assumptions has a human reaction time baked in — a queue checked, an alert triaged, a bridge call scheduled, a key rotated.

None of that is a technical flaw. It is an operating model, and the operating model assumes the attacker is moving at human tempo.

Three things break when the tempo changes. First, valid credentials leave no malware to signature and no exploit to patch; the login is legitimate, the token is real, and the only anomaly is behaviour. Second, alert volume becomes a weapon. A noisy agent that generates a hundred suspicious events can bury the one that matters in a queue sized for humans. Third, containment decisions get pushed to people who are not authorised to make them at 3 a.m., which is precisely when an intrusion that started at midnight is finishing.

The asymmetry is not that the attacker is smarter. It is that the attacker's marginal cost per attempt is close to zero, and the defender's cost per investigation is not.

## The tools are exposed, too

There is a second-order problem that defenders should not skip. On 6 November, researchers found hundreds of ARTEX systems reachable on the public internet without a password, apparently misconfigured — including the instance used against South Korea. The capability that worries defenders is also being left unlocked by the people using it.

AWS's threat intelligence team described a related pattern on 13 November: campaigns that steal credentials for AI services, then use that access to hunt for more credentials at someone else's expense. The researchers ran decoy systems posing as AI services and linked the activity to ARTEX with moderate confidence. In a separate incident, Railway reported that stolen customer AI keys were used to run up an estimated $740,000 in unauthorised compute, with the keys believed to have been resold for distillation.

AI credentials are now worth stealing on their own terms. That makes every integration token, service account and model API key part of the attack surface, not just the identity system.

## What actually reduces exposure

The advisory's advice is sound but abstract. Translated into work a team can schedule this quarter:

- **Retire third-party credentials on a calendar, not on memory.** Barracuda's breach started with a key that outlived the project it was issued for. Inventory vendor access, set expiry dates, and revoke on offboarding as a ticket with an owner.
- **Make MFA non-negotiable for finance, VPN, admin consoles and email.** The South Korean breaches leaned on its absence. Prefer phishing-resistant factors; an agent that can replay a one-time code will.
- **Stop shipping long-lived cloud keys.** Short-lived roles, workload identity and scoped tokens reduce what a leaked secret is worth. Decrypting infrastructure-as-code state should not hand over the estate.
- **Watch for machine patterns, not just bad signatures.** Sequential enumeration, uniform resource naming, many auth attempts across many accounts in a short window, secret-store reads by a principal that has never read secrets before. Those are detectable without knowing the tool.
- **Pre-authorise containment.** Decide in advance who can kill sessions, disable an identity and rotate a key at 3 a.m., and rehearse it. If the first time you make that call is during an intrusion measured in hours, you have already lost the window.
- **Keep logs detailed enough to answer "what did they touch?"** Barracuda could not rule out access because its logs were not granular enough, so it rotated every customer credential and assumed the worst. That is the expensive answer.
- **Treat pentest agents as dual-use software.** Know whether they run in your environment, restrict their egress, and require authentication on anything that can reach production.

For a broader reset on the assumptions underneath those controls, our guides to [zero trust as an architecture](/articles/zero-trust-is-an-architecture) and to [threat modelling for small teams](/articles/threat-model-for-small-teams) cover the groundwork that makes fast containment possible.

## What the advisory does not say

It does not say the attacks were fully autonomous. Reporting on the incidents describes human operators steering at key moments, with agents doing the labour in between. The honest framing is not "the machines are coming"; it is that a skilled operator now commands a workforce.

It also does not link ARTEX to the Microsoft 365 outage, the FAA ground stop or the Chase disruption. An FBI official told ABC News that the tool does not appear to be connected to those incidents, and the bureau publicly clarified on 17 November that the advisory was released the previous Friday and was not a new warning. The timing was coincidental; the trend is not.

## The bottom line

The uncomfortable part of this advisory is that nothing in it is novel. Default passwords, missing MFA, stale vendor keys, over-permissioned integrations and logs too thin for forensics are the same findings that have filled post-incident reports for a decade. What changed is the collection rate. The security debt that used to be paid down slowly, when someone got around to it, is now being collected in an afternoon.

Defenders spent twenty years optimising for a human adversary with limited attention. The advisory is a notice that the constraint has moved. Time is no longer on the defender's side by default — and the organisations that respond well will be the ones that decided what to do before they had three hours to decide it.
