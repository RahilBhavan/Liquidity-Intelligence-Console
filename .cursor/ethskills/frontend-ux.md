---
name: frontend-ux
description: Frontend UX rules for Ethereum dApps that prevent the most common AI agent UI bugs. Mandatory patterns for onchain buttons, token approval flows, address display, USD values, RPC configuration, and pre-publish metadata. Built around Scaffold-ETH 2 but the patterns apply to any Ethereum frontend. Use when building any dApp frontend.
---

# Frontend UX Rules

## What You Probably Got Wrong

**"The button works."** Working is not the standard. Does it disable during the transaction? Does it show a spinner? Does it stay disabled until the chain confirms? Does it show an error if the user rejects? AI agents skip all of this, every time.

**"I used wagmi hooks."** Wrong hooks. Scaffold-ETH 2 wraps wagmi with `useTransactor` which **waits for transaction confirmation** — not just wallet signing. Raw wagmi's `writeContractAsync` resolves the moment the user clicks Confirm in MetaMask, BEFORE the tx is mined. Your button re-enables while the transaction is still pending.

**"I showed the address."** As raw hex? That's not showing it. Use a proper Address component: ENS resolution, blockie avatars, copy-to-clipboard, and block explorer links. Raw `0x1234...5678` is unacceptable.

---

## Rule 1: Every Onchain Button — Loader + Disable

> ⚠️ **THIS IS THE #1 BUG AI AGENTS SHIP.** The user clicks Approve, signs in their wallet, comes back to the app, and the Approve button is clickable again — so they click it again, send a duplicate transaction. **The button MUST be disabled and show a spinner from the moment they click until the transaction confirms onchain.** Not until the wallet closes. Until the BLOCK CONFIRMS.

ANY button that triggers a blockchain transaction MUST:
1. **Disable immediately** on click
2. **Show a spinner** ("Approving...", "Staking...", etc.)
3. **Stay disabled** until the state update confirms the action completed
4. **Show success/error feedback** when done

**❌ NEVER use a single shared `isLoading` for multiple buttons.** Each button gets its own loading state.

---

## Rule 2: Four-State Flow — Connect → Network → Approve → Action

When a user needs to interact, show exactly ONE big, obvious button at a time:

```
1. Not connected?       → Big "Connect Wallet" button (NOT text saying "connect your wallet to play")
2. Wrong network?       → Big "Switch to Base" button
3. Not enough approved? → "Approve" button (with loader per Rule 1)
4. Enough approved?     → "Stake" / "Deposit" / action button
```

**NEVER show a text prompt like "Connect your wallet to play".** Show a button. Wrong network check comes FIRST — if the user clicks Approve on the wrong network, everything breaks.

---

## Rule 3: Address Display

**EVERY time you display an Ethereum address**, use a proper Address component: ENS resolution, blockie/avatar, copy-to-clipboard, truncation, block explorer links. Raw hex is unacceptable.

**EVERY time the user needs to enter an address**, use an AddressInput-style component with ENS resolution (e.g. "vitalik.eth" → resolves), validation, and paste handling.

**Show your contract address** at the bottom of the main page so users can verify on a block explorer.

---

## Rule 4: USD Values Everywhere

**EVERY token or ETH amount displayed should include its USD value.**
**EVERY token or ETH input should show a live USD preview.**

Where to get prices: native currency hooks, DexScreener API, onchain Uniswap quoter, or Chainlink oracle.

---

## Rule 5: RPC Configuration

**NEVER use public RPCs** in production — they rate-limit and cause random failures. Use env-based RPC overrides (e.g. `NEXT_PUBLIC_BASE_RPC`). Keep API keys in `.env.local`. Set a sensible `pollingInterval` (e.g. 3000 ms). Remove bare `http()` fallbacks so only configured RPCs are used.

---

## Rule 6: Contract Error Translation

When a contract reverts, the user must see a human-readable explanation. Not a hex selector. Not a silent button reset. Map your contract's custom errors (and inherited ones like OpenZeppelin) to plain English and display inline below the button that triggered it.

---

## Rule 7: Pre-Publish Checklist

Before deploying frontend to production:
- Open Graph / Twitter Cards with absolute live URLs (not localhost)
- Remove all template/default branding (README, footer, favicon, tab title)
- RPC overrides set; no public RPCs; no bare `http()` in fallback
- Every address display uses an Address component; every onchain button has its own loader + disabled state
- No hardcoded dark backgrounds that break theme toggles — use semantic tokens (e.g. `bg-base-200 text-base-content`)

---

## Human-Readable Amounts

Always convert between contract units and display units: `formatEther` / `formatUnits` (contract → display), `parseEther` / `parseUnits` (display → contract). Never show raw wei to users.

---

*Source: [ethskills.com/frontend-ux](https://ethskills.com/frontend-ux/SKILL.md)*
