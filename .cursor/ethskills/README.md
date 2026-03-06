# ETHSKILLS for Liquidity Intelligence Console

Local copies of [ethskills.com](https://ethskills.com/) skills used by this project. These support building the **Pred** (Base) and **Kash** indexers, normalization pipelines, and dashboard.

## Must-have (indexer + data pipeline)

| File | Use when |
|------|----------|
| [indexing.md](indexing.md) | Ingesting chain events, designing raw → normalized → aggregated pipeline, choosing indexer vs RPC vs The Graph |
| [l2s.md](l2s.md) | Working with Base (Pred), RPCs, finality, L2 gotchas |
| [addresses.md](addresses.md) | Configuring indexer contract addresses; never guess or hallucinate addresses |
| [tools.md](tools.md) | RPCs, block explorers, viem/ethers, MCP, Foundry |

## Recommended (design + frontend)

| File | Use when |
|------|----------|
| [concepts.md](concepts.md) | Designing idempotent ingestion, interpreting event flows, incentive design |
| [standards.md](standards.md) | Decoding events, ERC patterns, token/contract standards |
| [frontend-ux.md](frontend-ux.md) | Building Next.js dashboard that shows addresses, chain IDs, tx links, loaders |
| [ship.md](ship.md) | End-to-end planning; route to other skills by phase |

## How to use

- **Agents:** Read the relevant `.md` file (or its path) when working on indexers, L2/Base, contract addresses, tools, or dashboard UX.
- **Refresh:** Content is sourced from https://ethskills.com/; update local copies periodically (e.g. `curl -s https://ethskills.com/indexing/SKILL.md`).

See the project plan **ETHSKILLS for Liquidity Console** for the full mapping and optional skills.
