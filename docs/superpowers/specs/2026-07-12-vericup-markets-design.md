# VeriCup Markets Design

## Purpose

VeriCup Markets is a new hackathon project for the TxODDS Prediction Markets and Settlement track. It demonstrates a complete prediction-market lifecycle on Solana devnet: market creation, demo-token positions, TxLINE-backed result validation, deterministic settlement, and winner claims.

The project is separate from `brazil-world-cup-squad-optimizer` because the hackathon requires a new build created specifically for the event. It uses no real-money assets and does not provide gambling or financial services.

## Product Positioning

The product is a verifiable settlement engine presented through an approachable World Cup prediction-market interface. Its primary demonstration is:

```text
TxLINE result -> on-chain validation CPI -> market resolution -> claim -> Explorer receipt
```

TxLINE is essential to the resolution path rather than an optional data display. The product prioritizes a working, inspectable settlement flow over a complex exchange or forecasting model.

## Scope

### Required MVP

- Next.js interface with Solana wallet support.
- Anchor program deployable to Solana devnet.
- Match-result markets with `HOME`, `DRAW`, and `AWAY` outcomes.
- SPL demo token named `PLAY`, with no monetary value.
- PDA-controlled market vault.
- Market lifecycle: `OPEN`, `LOCKED`, and `RESOLVED`.
- TxLINE fixtures, StablePrice, scores, and validation data as primary inputs.
- Keeper that consumes TxLINE data and triggers lifecycle transitions.
- Resolution through CPI into the applicable TxLINE validation instruction.
- Proportional pari-mutuel claims by winning positions.
- Refund path when a resolved market has no deposits on the winning outcome.
- Verifiable receipt containing fixture, result, validation reference, slot, and Solana transaction links.
- Clearly labeled replay flow for judges when no match is live.
- Public technical documentation, automated tests, and a reproducible demo path.

### Deferred Until the MVP Is Verified

- Automatic creation for the complete tournament schedule.
- Historical StablePrice charts.
- Expanded settlement safety visualizations.
- Additional markets such as totals, first scorer, or props.
- AMM curves, order books, real assets, fees, governance, and production custody.
- Forecasting or player-optimization models from the earlier repository.

## Architecture

```text
Next.js application
  |-- wallet connection and demo-token flow
  |-- fixtures, StablePrice, pools, and market state
  |-- proof receipt and Explorer links
  `-- server-only TxLINE proxy for protected credentials
              |
              v
Anchor program on Solana devnet
  |-- market and position accounts
  |-- PDA vault authority
  |-- create, position, lock, resolve, and claim instructions
  `-- CPI to the TxLINE validation program
              ^
              |
TypeScript keeper
  |-- fixture snapshot ingestion
  |-- SSE score and odds ingestion
  |-- reconnect, credential renewal, and deduplication
  |-- lock and resolution transaction submission
  `-- explicit historical replay mode
```

The repository will use one TypeScript/Anchor workspace:

```text
vericup-markets/
|-- app/                 # Next.js frontend and server-only TxLINE routes
|-- keeper/              # TxLINE ingestion and lifecycle automation
|-- programs/vericup/    # Anchor settlement program
|-- tests/               # Anchor, integration, and end-to-end tests
`-- docs/                # Architecture, API usage, testing, and demo material
```

## On-Chain Model

### Market Account

Each market records:

- creator and market PDA bump;
- TxLINE `fixture_id`;
- home and away display identifiers;
- scheduled kickoff timestamp;
- market state;
- aggregate deposits for `HOME`, `DRAW`, and `AWAY`;
- demo-token mint and vault;
- resolved outcome, if present;
- validation receipt reference and resolution slot;
- total claimed amount.

### Position Account

Each wallet has at most one position account per market and outcome. A position records the owner, market, outcome, deposited amount, and whether it has been claimed. Additional deposits into the same outcome accumulate in the same account.

### Instructions

1. `create_market` initializes a market for a unique TxLINE fixture and kickoff time.
2. `take_position` transfers PLAY into the vault while the market is open and before kickoff.
3. `lock_market` moves an eligible market to `LOCKED`. `take_position` also independently enforces the kickoff timestamp, so a missing keeper call cannot permit late deposits.
4. `resolve_with_txline` validates the submitted result through a CPI to the TxLINE program and writes the immutable outcome and receipt reference.
5. `claim` pays a winning wallet its proportional share and marks the position claimed.
6. `refund` returns a participant's deposit if the resolved outcome has no winning deposits.

Payouts use checked integer arithmetic. Each normal claim is:

```text
position_on_winner * total_market_pool / total_winner_pool
```

Integer division rounds down. Any final remainder stays in the vault until the last eligible claim, which receives the remainder so funds are not stranded.

## Data Flow

1. The keeper obtains current fixtures from TxLINE.
2. A fixture becomes a market with its immutable TxLINE identifier and kickoff.
3. The application displays server-fetched TxLINE StablePrice data and current on-chain pool totals.
4. A user connects a devnet wallet, obtains PLAY, and takes a position.
5. At kickoff, the keeper locks the market; the program timestamp also blocks late deposits.
6. The keeper receives a final score through the TxLINE stream and obtains its validation material.
7. The keeper submits `resolve_with_txline` with the required TxLINE accounts and proof data.
8. The VeriCup program performs the validation CPI and resolves only after successful validation.
9. Winners claim from the PDA vault.
10. The UI displays an auditable receipt and Explorer links.

## Replay Mode

Replay mode exists because judges may review the submission when no match is live. It uses a completed fixture and the same market, validation, resolution, and claim code paths as normal operation. The interface labels replay data prominently and never represents historical events as live.

If TxLINE's devnet examples require a specific fixture or validation primitive, the replay fixture and instruction arguments will follow the official matching IDL and example. A local mock validation program may be used only in automated local tests; the submitted devnet demonstration must use the real TxLINE program.

## Failure Handling

- An unavailable feed displays the last successful update and its age.
- Expired guest JWTs are renewed on the matching TxLINE network.
- SSE reconnects with bounded backoff and deduplicates already processed events.
- A mismatched fixture, non-final result, invalid validation input, wrong program, or failed CPI leaves the market unresolved.
- Duplicate resolution and duplicate claims fail on-chain.
- Insufficient token balance is reported before transaction submission and remains enforced by the token program.
- Frontend and keeper errors retain transaction signatures and actionable messages without exposing credentials.
- API credentials and activated tokens remain server-side.

## Security Boundaries

- TxLINE's internal credit token is never transferred, pooled, or used as a user asset.
- PLAY is a clearly labeled devnet-only demo token with no monetary value.
- The frontend and keeper cannot bypass on-chain timestamps or validation.
- The fixture identity registered at market creation is immutable.
- Vault transfers require the expected PDA seeds and program ownership.
- Resolution is immutable after a successful TxLINE validation.
- Checked arithmetic prevents overflow and explicit last-claim handling prevents stranded rounding dust.
- No private keys or API credentials are committed to the repository.

## User Experience

The main screen prioritizes three connected views:

1. **Market:** fixture, kickoff, pool distribution, StablePrice, wallet balance, and position action.
2. **Live data:** current TxLINE score/feed status and timestamp.
3. **Proof receipt:** validation status, final score, TxLINE program, slot, market transaction, claim transaction, and Explorer links.

The core judge journey is: connect a devnet wallet, obtain PLAY, take a position, run or observe a verified replay, claim, and inspect the receipt.

## Testing Strategy

Development follows test-driven RED-GREEN-REFACTOR cycles.

### Anchor and Rust

- market initialization and unique fixture identity;
- deposits into every outcome;
- timestamp and lifecycle enforcement;
- vault balances and PDA authority;
- valid and invalid resolution paths;
- fixture mismatch, duplicate resolution, and duplicate claim rejection;
- proportional payout, integer rounding, last-claim remainder, and refund behavior.

### TypeScript and Keeper

- fixture, StablePrice, score, and proof normalization;
- credential renewal and network consistency;
- SSE reconnection and event deduplication;
- deterministic lock and resolution decisions;
- replay classification and serialization.

### Integration and End-to-End

- complete lifecycle on a local validator with a compatible mock validation program;
- real TxLINE validation on devnet as the submission gate;
- wallet, position, receipt, resolution, and claim flow in Playwright;
- responsive and accessible critical states.

New code targets at least 80% automated coverage. Completion requires fresh evidence for tests, lint, type checks, builds, dependency audits, secret scans, devnet validation, and the documented judge journey.

## Submission Deliverables

- deployed devnet program and recorded program ID;
- deployed web application;
- public GitHub repository created for this hackathon;
- demo video no longer than five minutes;
- concise README with setup, architecture, TxLINE endpoints/instructions, program IDs, test commands, and judge walkthrough;
- honest TxLINE integration feedback;
- global Prediction Markets and Settlement submission;
- duplicate Superteam Brasil submission before July 18, 2026 at 23:59.

## Demo Narrative

1. Explain the trust problem in sports-market settlement.
2. Show a VeriCup market powered by TxLINE fixtures and StablePrice.
3. Connect a wallet and deposit PLAY on an outcome.
4. Run a verified historical replay.
5. Show the TxLINE validation CPI resolving the market.
6. Claim the payout.
7. Open the proof receipt and Solana Explorer transaction.
8. Briefly show architecture, automated test evidence, and specific TxLINE feedback.

## Success Criteria

A judge with a devnet wallet can use the deployed application to obtain PLAY, take a position, observe or trigger a TxLINE-validated resolution, claim the correct amount, inspect the on-chain receipt, and repeat the flow using the README without access to private credentials.
