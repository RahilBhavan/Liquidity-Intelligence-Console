---
name: ship
description: End-to-end guide for AI agents — from a dApp idea to deployed production app. Fetch this FIRST, it routes you through all other skills.
---

# Ship a dApp

## What You Probably Got Wrong

**You jump to code without a plan.** Before writing a single line of Solidity, you need to know: what goes onchain, what stays offchain, which chain, how many contracts, and who calls every function. Skip this and you'll rewrite everything.

**You over-engineer.** Most dApps need 0-2 contracts. A token launch is 1 contract. An NFT collection is 1 contract. A marketplace that uses existing DEX liquidity needs 0 contracts. Three contracts is the upper bound for an MVP.

**You put too much onchain.** Solidity is for ownership, transfers, and commitments. It's not a database. It's not an API. If it doesn't involve trustless value transfer or a permanent commitment, it doesn't belong in a smart contract.

**You skip chain selection.** Mainnet is cheaper than you think (~$0.004/transfer, ~$0.04/swap). L2s aren't just "cheaper Ethereum" — each has a unique superpower (Base: Coinbase distribution + smart wallets; Arbitrum: deepest DeFi liquidity; Optimism: retroPGF + Superchain). Choose deliberately. Fetch `l2s/SKILL.md` and `gas/SKILL.md` for the full picture.

**You forget nothing is automatic.** Smart contracts don't run themselves. Every state transition needs a caller who pays gas and a reason to do it. If you can't answer "who calls this and why?" for every function, your contract has dead code. Fetch `concepts/SKILL.md`.

---

## Phase 0 — Plan the Architecture

Do this BEFORE writing any code.

### The Onchain Litmus Test

**Put it onchain if it involves:** Trustless ownership; trustless exchange (swap, trade, lend, borrow); composability; censorship resistance; permanent commitments (votes, attestations, proofs).

**Keep it offchain if it involves:** User profiles, preferences, settings; search, filtering, sorting; images, metadata (store on IPFS, reference onchain); business logic that changes frequently; anything that doesn't involve value transfer or trust.

**Activity feeds** → offchain indexing of onchain events (fetch `indexing/SKILL.md`).

### MVP Contract Count

| What you're building   | Contracts | Pattern                    |
|------------------------|-----------|----------------------------|
| Token launch           | 1         | ERC-20 with custom logic   |
| NFT collection         | 1         | ERC-721 with mint/metadata |
| Simple marketplace     | 0-1       | Use existing DEX; maybe listing contract |
| Vault / yield          | 1         | ERC-4626 vault             |
| Lending protocol       | 1-2       | Pool + oracle              |
| AI agent service       | 0-1       | Maybe ERC-8004 registration |
| Prediction market      | 1-2       | Market + resolution oracle |

**If you need more than 3 contracts for an MVP, you're over-building.**

### State Transition Audit

For EVERY function: Who calls it? Why would they? What if nobody calls it? Does it need gas incentives? If "what if nobody calls it?" breaks your system, fix the design before writing code. See `concepts/SKILL.md`.

### Chain Selection (Quick Version)

| Chain            | Superpower                    | Build here if… |
|------------------|-------------------------------|----------------|
| Ethereum mainnet | Max decentralization, composability | DeFi, governance, identity, high-value transfers |
| Base             | Coinbase distribution, smart wallets, AA | Consumer apps, social, onboarding, micro-payments |
| Arbitrum         | Deepest L2 DeFi liquidity, Stylus | DeFi that composes with Arbitrum liquidity |
| Optimism         | RetroPGF, Superchain         | Public goods, OP Stack ecosystem |
| zkSync / Scroll  | ZK proofs, native AA         | Privacy, ZK-native apps |

**Don't pick an L2 because "mainnet is expensive." Pick an L2 because its superpower fits your app.**

---

## Phase 1 — Build Contracts

**Fetch:** `standards/SKILL.md`, `building-blocks/SKILL.md`, `addresses/SKILL.md`, `security/SKILL.md`

- Use OpenZeppelin as base. Use verified addresses from `addresses/SKILL.md` — never fabricate.
- Follow Checks-Effects-Interactions. Emit events for every state change. Use SafeERC20. Run the security checklist before Phase 2.

---

## Phase 2 — Test

**Fetch:** `testing/SKILL.md`

Unit test every custom function. Fuzz test math. Fork test integrations with external protocols. Run static analysis. For security review, fetch `audit/SKILL.md` and give it to a separate agent/fresh context.

---

## Phase 3 — Build Frontend

**Fetch:** `orchestration/SKILL.md`, `frontend-ux/SKILL.md`, `tools/SKILL.md`

Use framework hooks that wait for confirmation (not raw wagmi that resolves after signing). Implement Connect → Network → Approve → Action. Show loaders; display human-readable amounts; never infinite approvals.

---

## Phase 4 — Ship to Production

**Fetch:** `wallets/SKILL.md`, `frontend-playbook/SKILL.md`, `gas/SKILL.md`

Deploy and verify contracts; transfer ownership to multisig. Deploy frontend (IPFS or Vercel). Run pre-ship QA (fetch `qa/SKILL.md`, give to separate reviewer). Set up event monitoring (The Graph or Dune — fetch `indexing/SKILL.md`).

---

## Skill Routing Table

| Phase      | What you're doing   | Skills to fetch |
|-----------|---------------------|------------------|
| Plan      | Architecture, chain | `ship/`, `concepts/`, `l2s/`, `gas/`, `why/` |
| Contracts | Writing Solidity    | `standards/`, `building-blocks/`, `addresses/`, `security/` |
| Test      | Testing contracts   | `testing/` |
| Audit     | Security review     | `audit/` (fresh agent) |
| Frontend  | Building UI         | `orchestration/`, `frontend-ux/`, `tools/` |
| Production| Deploy, QA, monitor | `wallets/`, `frontend-playbook/`, `qa/`, `indexing/` |

**Base URLs:** All skills at `https://ethskills.com/<name>/SKILL.md`

---

*Source: [ethskills.com/ship](https://ethskills.com/ship/SKILL.md)*
