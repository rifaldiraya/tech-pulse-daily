---
title: "When Capacity Disappears: Designing Systems That Degrade Instead of Collapse"
slug: "cloud-capacity-failure-design"
description: "Microsoft's outage was a capacity problem, not a traffic problem. That distinction changes how you design load shedding, backpressure and recovery."
category: "DevOps"
tags:
  - Reliability
  - Capacity Planning
  - Incident Response
  - Graceful Degradation
  - SRE
author: "TechPulse Admin"
publishedAt: "2026-11-15"
featured: true
coverImage: "/images/articles/cloud-capacity-failure-design.png"
coverImageAlt: "Risograph illustration of a server rack shedding load, printed in navy and orange on cream paper"
readingTime: 9
draft: false
---

# When Capacity Disappears: Designing Systems That Degrade Instead of Collapse

On Thursday afternoon, Microsoft told customers its productivity cloud was under elevated load. Hours later the company corrected itself: the load was not more people, it was fewer servers. "The elevated load isn't driven by an increase in traffic, but by a number of servers being unexpectedly unavailable," the advisory said, straining the infrastructure that remained.

That revision deserves more attention than the outage timeline. A traffic spike and a capacity loss look identical from the outside — latency climbs, errors spread, queues grow — but they demand opposite responses. Traffic you can shed, because the capacity is still there, waiting. Capacity you cannot shed your way out of, because the thing you would shed onto is gone too.

Most systems are designed for the first case and quietly assume the second never happens.

## The assumption that breaks first

"Elastic" is the word the industry uses for cloud capacity, and it is accurate only under conditions nobody writes down:

- the control plane that launches replacements is healthy
- quota and address space are available in the target zone
- the machine image, package registry and secret store still answer
- the dependency graph behind the service is not degraded in the same way

When a slice of the fleet disappears at once, those conditions fail together. Autoscaling sends a request into the system that is already struggling. Replacement nodes boot, pull images, register with service discovery and warm their caches — which is work, not capacity. The fleet shrinks faster than it can heal, and every recovery action competes with the traffic it is trying to serve.

There is a second asymmetry. A traffic spike is bounded: the campaign ends, the game launches, the television ad finishes, and pressure falls. Capacity loss has no end date until someone finds the fault and reverses it. Systems tuned for short spikes are usually tuned to wait things out. That instinct is fatal here, because waiting is what drains the queues.

## Four ways capacity loss becomes an outage

| Failure mode | What it looks like | Why it compounds |
| --- | --- | --- |
| Quota exhaustion | New instances fail to schedule; `InsufficientCapacity` errors | The replacement path is blocked exactly when needed |
| Dependency saturation | Shared identity, storage or DNS layer slows for every caller | Blast radius grows beyond the failed component |
| Retry amplification | Error rates climb faster than actual failure | Clients multiply load by retrying in sync |
| Recovery debt | Queues, caches and connection pools all refill at once | The fix generates the next incident |

### Quota and control-plane exhaustion

Every cloud account has ceilings: vCPU quotas, IP addresses, disk IOPS, load balancer limits, API rate limits on the control plane itself. They are invisible until you need them at scale. An autoscaling group that must replace 40% of its capacity in ten minutes will discover every one of those ceilings at the same time.

The fix is boring and must happen in advance: pre-warm capacity, keep a headroom buffer sized to your worst single-zone loss, and raise quotas before the incident. Check them quarterly. A quota increase is a five-minute change on a quiet Tuesday and an impossible one during an outage.

### Dependency saturation

Large SaaS outages are rarely one broken feature. They are shared dependencies — identity, directory, storage, networking, deployment pipelines — behaving badly for everyone at once. Microsoft 365 is dozens of services authenticating against the same layers, which is why customers experience a partial failure as "everything is down."

Map the shared dependencies your own services inherit. If your incident tooling, your status page and your authentication all live behind the same provider, they are one dependency, not three.

### Retry amplification

Retries are the most common way a small capacity problem becomes a total one. A client with three retries and no jitter multiplies failing requests by four, in lockstep, at the precise moment the server has the least room to absorb them.

Retries are only safe when three things hold: the operation is idempotent, the retry budget is bounded, and the delay is jittered. If any of those is missing, retries are a load generator you shipped.

### Queue growth and recovery debt

Queues preserve work during a failure, which is why they are useful — and why they hide the size of the problem. Exchange kept accepting mail while mailbox servers were unreachable, extended its delivery timeout to 48 hours, and users eventually received delayed messages in bursts. The queue did its job. It also converted an availability incident into a multi-day backlog.

The arithmetic is unforgiving. If a queue grows at 1,000 messages per second and drains at 700, it is not "catching up slowly"; it is losing ground by 300 per second, and the drain rate falls further as the workers that process it compete with reconnecting clients.

## Give the system a behaviour at every capacity level

The organising principle is simple: your system should have a defined, deliberate behaviour at 100% of capacity, 60%, 30% — not just at "enough." Most teams have only designed the last one.

Start by naming tiers explicitly. A useful default:

| Tier | Examples | Behaviour when capacity is short |
| --- | --- | --- |
| Safety-critical | Authentication, payments, audit writes | Never shed; reserve capacity |
| Revenue | Checkout, search, core API reads | Degrade quality, keep serving |
| Interactive | Recommendations, avatars, activity feeds | Serve stale or omit |
| Background | Analytics, indexing, thumbnail generation | Pause entirely |

Write the table down, get the business to agree to it, and then make the code honour it. A tier document nobody implemented is a wish.

### Load shedding by tier

Shedding has to happen at the edge and per tier, not from a shared pool where an analytics job can starve checkout. Concurrency limits per route are the cheapest control you have:

```nginx
# Ingress: protect checkout even when the fleet is smaller than usual
limit_conn_zone $binary_remote_addr zone=per_client:10m;
limit_req_zone  $binary_remote_addr zone=per_client_rps:10m rate=20r/s;

server {
    location /api/checkout {
        limit_conn per_client 8;
        limit_req  zone=per_client_rps burst=40 nodelay;
        limit_req_status 429;

        proxy_read_timeout 15s;
        proxy_next_upstream error timeout http_502 http_503;
        proxy_next_upstream_tries 2;   # bounded retries, never a storm
        proxy_pass http://checkout_upstream;
    }
}
```

Return `429` with `Retry-After` and jittered delay hints. A fast, honest rejection is kinder than a request that occupies a worker for thirty seconds before timing out, and it gives the client something to obey.

### Backpressure, not unbounded buffering

Every queue needs a maximum, and every producer needs to feel it. A queue with no bound is not a buffer; it is an outage scheduled for later, with interest.

- Set a queue depth limit derived from drain time, not from available memory.
- Reject at the producer when the limit is reached, and let the caller decide.
- Alert on drain-time estimate, not depth alone.

Keep the arithmetic visible. Depth divided by drain rate is the only number that answers "when will this be healthy again":

```bash
depth=$(redis-cli LLEN jobs:default)
rate=$(redis-cli --raw GET metrics:jobs:drained_per_minute)
awk -v d="$depth" -v r="$rate" \
  'BEGIN { printf "%.0f minutes to drain\n", (r > 0 ? d / r : -1) }'
```

### Bulkheads

Isolate pools per dependency and per tenant class, so one saturated dependency cannot consume every worker thread. This is the difference between a feature getting slower and the product going down. Worker pools for the payments path should not share a thread pool with thumbnail generation, and a noisy tenant should hit a per-tenant limit before it hits everyone else's latency.

### Degraded modes

Some of the most valuable functionality is optional, and saying so out loud is a design decision:

- serve cached reads while writes are unavailable
- skip recommendation and personalisation enrichment
- drop non-essential telemetry and analytics
- disable search facets, keeping core results

Build these as flags you can flip in seconds, and test them on a schedule. A degraded mode that has never been exercised in a year is a hypothesis, not a control.

## Recovery is a load event

The half of the problem most teams under-plan is the way back. Restarting servers, replaying queues, reconnecting clients and refilling caches all generate work. Systems that fail under load routinely fail again on the way up.

Ramp deliberately:

| Minute | Ingress | Action |
| --- | --- | --- |
| 0–4 | 10% | Confirm error rate and saturation are flat at low load |
| 5–9 | 25% | Watch p99 latency and queue drain rate |
| 10–19 | 50% | Pre-warm caches; keep background jobs paused |
| 20–29 | 75% | Enable one background class at a time |
| 30+ | 100% | Resume scheduled work, then close the incident |

Two rules make the ramp safe. First, hold each step long enough to observe a trend rather than a single sample. Second, define the abort condition in advance — for example, "return to 25% if p99 exceeds 800 ms for two minutes" — so the decision is not made by an exhausted on-call engineer at 4 a.m.

Clients deserve the same guidance. Publish backoff expectations, keep the jitter, and do not let a mobile app's launch sequence stampede the API the moment it reconnects.

## Measure headroom, not uptime

Uptime dashboards are the last things to change and the least useful during a capacity incident. By the time availability falls, the useful signal is already minutes old. Track the numbers that describe how close you are to the edge:

| Signal | Question it answers | Warning sign |
| --- | --- | --- |
| Hottest dependency saturation | Which layer is closest to its limit? | Sustained above 70% |
| Capacity headroom | Can we lose a zone and keep serving? | Below one zone's worth |
| Node replacement time | How fast does the fleet heal? | Longer than your error budget |
| Queue drain estimate | Are we catching up or falling behind? | Trend rising for 10 minutes |
| Quota usage | What blocks scale-out? | Above 80% of any ceiling |
| Retry ratio | Are clients amplifying failures? | Above 1.2× request volume |

One further metric is worth building even though it looks like documentation: a blast-radius map. For each critical dependency, write down what stops working when it fails, and who owns the fallback. You will discover overlaps you did not know existed — and that is the point.

## Practise losing capacity

Chaos experiments that kill one pod teach you that Kubernetes restarts pods. They do not teach you what happens when a third of the fleet is unavailable for six hours. Remove capacity, not instances:

- take an entire zone out of service during business hours
- throttle a dependency to 30% of normal throughput
- block the image registry for ten minutes and observe the rollout path
- induce a retry storm deliberately, with a client you control

Run these with a stop condition and a hypothesis. "The checkout tier should stay under 500 ms p99 while recommendations disappear" is a testable claim. "Let's see what happens" is not.

## What to take from this week

Microsoft's outage is still being explained, and the root cause may turn out to be something nobody modelled. The lesson stands regardless: losing servers is harder to manage than gaining users, because the usual levers assume a healthy place to scale into.

Treat capacity as a property of the architecture rather than a line on an invoice. Decide what your system does when it has half the machines it expected. Write the tiers down, bound the queues, cap the retries, and rehearse the ramp back. Cloud is not an infinite supply of machines; it is a supply of machines you have not accounted for yet. The teams that stay online are the ones that planned for the day the supply stops.
