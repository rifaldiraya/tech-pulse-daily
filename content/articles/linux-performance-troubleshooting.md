---
title: "Linux Performance Troubleshooting with the Right Tools"
slug: "linux-performance-troubleshooting"
description: "A calm, systematic approach to diagnosing slow Linux systems using load average, pressure stalls, per-process metrics, and targeted tracing."
category: "Linux"
tags:
  - Linux
  - Performance
  - Troubleshooting
  - Observability
author: "TechPulse Admin"
publishedAt: "2026-10-27"
updatedAt: "2026-10-28"
coverImage: "/images/articles/linux-performance-troubleshooting.png"
coverImageAlt: "Terminal showing system performance metrics"
readingTime: 8
draft: false
---

# Linux Performance Troubleshooting with the Right Tools

Performance incidents reward restraint. The instinct is to open a profiler and stare at a flame graph, but most slow systems are limited by something far less exotic: a full disk, a memory leak, a noisy neighbour, or a service waiting on a dependency.

A systematic method beats tool fluency. The USE method — utilisation, saturation, errors — gives you one.

## Start with the shape of the problem

Ask three questions before running anything:

1. Is the whole system slow, or one workload?
2. Did it start at a specific time, or degrade gradually?
3. Is it CPU, memory, disk, or network bound?

`uptime` and `vmstat` provide a quick orientation.

```bash
uptime
vmstat 1 5
```

Load average counts runnable and uninterruptible tasks. A load of 8 on a four-core machine may be fine if it is short-lived, and alarming if it persists. Uninterruptible tasks often indicate disk or network waits, not CPU demand.

## Check pressure, not just utilisation

Utilisation tells you how busy a resource is. Pressure tells you whether tasks are actually stalling. Linux exposes pressure stall information (PSI):

```bash
cat /proc/pressure/cpu
cat /proc/pressure/memory
cat /proc/pressure/io
```

The `some avg10` line shows the percentage of time at least one task was stalled. A CPU at 90% with low pressure can be healthy. A disk at 40% utilisation with high I/O pressure is not.

> High utilisation is a fact. High pressure is a symptom.

## Memory: separate caching from leaking

Linux uses free memory for page cache, which is why `free -h` showing little "free" memory is normal. Look at `available` instead.

```bash
free -h
cat /proc/meminfo | grep -E "MemAvailable|Dirty|Writeback"
```

If available memory is shrinking and swap activity is rising, find the consumer:

```bash
ps -eo pid,comm,rss,pmem --sort=-rss | head -15
```

RSS can overstate shared memory, so confirm with `smem` if it is installed. For a suspected leak, sample over time rather than trusting one snapshot.

## Disk and filesystem

I/O problems often look like application problems. Check latency and queue depth:

```bash
iostat -xz 1 5
df -h
df -i
```

Key columns are `r_await`, `w_await`, and `aqu-sz`. Rising await with a full queue points to a saturated device. Also check inode exhaustion: a filesystem can have free space and no free inodes.

If a process is writing far more than expected, inspect open files:

```bash
lsof -p <pid> | sort -k7 -n | tail
```

## Network

Start with socket states and interface errors:

```bash
ss -s
ip -s link
ss -tanp | awk 'NR>1 {print $1}' | sort | uniq -c
```

A large `TIME_WAIT` count is usually normal for a busy web server. A growing `CLOSE_WAIT` count often means the application is not closing sockets. Packet loss and retransmits are visible in `nstat` or `ss -ti`.

For DNS issues, measure resolution time separately. A slow resolver can make every upstream call look slow.

## CPU: find the actual consumer

```bash
top -H -b -n 1 | head -30
pidstat -u -p ALL 1 5
```

Thread-level view matters for runtimes with worker pools. If one thread is pegged and others are idle, you may have a blocked event loop or a lock contention issue rather than insufficient capacity.

For short-lived spikes, use `perf top` or a sampling profiler. For production, prefer continuous profilers with low overhead over ad-hoc debugging.

## Trace the boundary you suspect

When system metrics look healthy but requests are slow, trace the application. OpenTelemetry spans reveal whether time is spent in the database, an external API, or your own code.

```bash
strace -f -c -p <pid>
```

`strace` is powerful and invasive; use it briefly and never as a permanent production habit. Attach with a timeout and capture the summary, then detach.

## A troubleshooting checklist

| Layer | First check | Escalate to |
| --- | --- | --- |
| CPU | `vmstat`, PSI | `perf`, profiler |
| Memory | `free`, `ps` RSS | heap dump, `smem` |
| Disk | `iostat`, `df -i` | `lsof`, filesystem trace |
| Network | `ss`, `nstat` | packet capture, DNS timing |
| Application | logs, traces | profiler, debugger |

## Fix the cause, then the monitoring gap

After the incident, ask why the signal was not obvious sooner. Add the missing metric, alert on pressure rather than raw utilisation, and document the diagnostic path. The best troubleshooting tool is a system you can observe before it fails.

Linux gives you extraordinary visibility. The discipline is choosing the smallest set of tools that answers the question in front of you.
