---
title: "Smart Contract Security: The Bugs That Keep Repeating"
slug: "smart-contract-security-recurring-bugs"
description: "Reentrancy, broken access control, oracle assumptions, and upgrade traps — the recurring failure patterns behind smart contract losses, and how to design against them."
category: "Blockchain"
tags:
  - Smart Contracts
  - Solidity
  - Security
  - Auditing
author: "TechPulse Admin"
publishedAt: "2026-10-12"
updatedAt: "2026-10-13"
coverImage: "/images/articles/smart-contract-security-recurring-bugs.png"
coverImageAlt: "Smart contract code with security review annotations"
readingTime: 8
draft: false
---

# Smart Contract Security: The Bugs That Keep Repeating

Smart contract incidents are often described as novel exploits. In practice, most losses trace back to a small set of patterns that have been documented for years: reentrancy, missing access control, unsafe external calls, oracle manipulation, and upgrade mistakes.

The technology is new; the failure modes are not.

## Reentrancy is still with us

Reentrancy occurs when a contract calls an external address before finishing its own state updates. The external contract calls back in and observes an inconsistent state.

The classic fix is checks-effects-interactions: update your own state before making external calls.

```solidity
function withdraw(uint256 amount) external {
    uint256 balance = balances[msg.sender];
    require(balance >= amount, "insufficient balance");

    // Effect first
    balances[msg.sender] = balance - amount;

    // Interaction last
    (bool ok, ) = msg.sender.call{value: amount}("");
    require(ok, "transfer failed");
}
```

Reentrancy guards help, but they are not a substitute for correct ordering. Cross-function and read-only reentrancy can bypass naive guards, especially when a contract exposes view functions that other protocols rely on.

## Access control is a design problem

Many incidents come from a privileged function with no modifier, a role that is too broad, or an initializer that anyone can call.

Checklist:

- Every state-changing function has an explicit authorisation model.
- Roles follow least privilege and are documented.
- Initializers are protected and can run only once.
- Ownership transfers are two-step.
- Emergency powers are time-locked or multisig-controlled.

```solidity
modifier onlyRole(bytes32 role) {
    require(hasRole(role, msg.sender), "unauthorised");
    _;
}

function setFee(uint256 newFee) external onlyRole(FEE_ADMIN) {
    require(newFee <= MAX_FEE, "fee too high");
    fee = newFee;
}
```

A modifier is not enough if the role can be granted by a compromised key. Key management is part of the security model.

## Oracle assumptions are protocol assumptions

If a contract trusts a price feed, it inherits that feed's failure modes: stale data, manipulation, decimal mismatches, and market gaps.

Ask:

1. How is the price sourced and aggregated?
2. How fresh is it, and what happens when it is stale?
3. Can a single venue manipulate it within one transaction?
4. Are decimals normalised correctly?
5. Is there a circuit breaker for extreme moves?

A lending protocol that liquidates on a manipulated price is not experiencing an oracle bug. It is experiencing a design assumption that was never validated.

> "Trusted" is not a security property. It is a description of what you have chosen to depend on.

## Arithmetic and precision

Solidity 0.8+ checked arithmetic removes silent overflow, but precision loss remains. Division before multiplication, rounding in the wrong direction, and mismatched decimals create slow leaks and exploitable accounting errors.

Use explicit rounding rules and test with extreme values. For financial code, property-based tests and invariant checks catch more than example-based tests.

## Upgrades are a backdoor by design

Proxy upgrades allow fixes, but they also allow catastrophic changes. Protect them accordingly.

- Store implementation addresses behind a timelock.
- Require multisig approval for upgrades.
- Verify storage layout compatibility.
- Test the upgrade path on a fork with real state.
- Publish upgrade intent before execution.

An upgrade key that can change balances is equivalent to a central bank with no oversight. Users should know that before depositing funds.

## Testing beyond unit tests

Smart contract security needs several layers:

| Layer | Catches |
| --- | --- |
| Unit tests | Basic logic and access control |
| Fuzz tests | Unexpected inputs and boundaries |
| Invariant tests | Broken accounting across sequences |
| Fork tests | Integration with real protocols |
| Formal verification | Specific properties, expensive but precise |
| External audit | Assumptions the team stopped seeing |

No single layer is sufficient. The goal is independent ways of being wrong.

## A pre-deployment checklist

1. Enumerate every external call and its trust assumptions.
2. Verify state updates precede interactions.
3. Confirm every privileged function has a role and a delay.
4. Test oracle failure and stale-price behaviour.
5. Run invariant tests over long sequences.
6. Simulate upgrades against real state.
7. Prepare a monitored pause or circuit breaker.
8. Publish the audit and the residual risks.

## Security is a maintenance property

Deployment is the beginning of the attack surface, not the end. Monitor events, track admin actions, and rehearse incident response. The recurring bugs persist because teams treat security as a pre-launch checkbox. The teams that avoid them treat it as an ongoing engineering practice.
