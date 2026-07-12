# VeriCup Markets

Prediction markets da Copa na Solana, liquidados por provas de placar da TxLINE. O backend observa eventos, mas não escolhe o vencedor: o programa Anchor valida `validateStatV2` por CPI e deriva HOME, DRAW ou AWAY dos dois valores comprovados.

## Por que esta submissão é diferente

- prova TxLINE verificada pelo programa oficial `6pW64gN1s2uqjHkn1unFeEjAwJkPGHoppGvS715wyP2J`;
- fixture, chaves de stat `1` e `2`, ordem e período final `100` validados on-chain;
- keeper SSE idempotente, com recuperação de JWT e replay claramente rotulado;
- payouts proporcionais determinísticos, resto para o último vencedor e refund sem vencedores;
- PLAY é um token de demonstração sem valor real, distribuído uma vez por carteira.

## Arquitetura

```text
TxLINE snapshot/SSE -> keeper -> lock_market
TxLINE stat-validation -> resolve_with_txline -> CPI validateStatV2
Market PDA vault -> claim_payout ou refund_position
```

## Desenvolvimento

Requisitos: Node 24, pnpm 11.7, Rust, Solana 2.3 e Anchor 0.32.1.

```bash
pnpm install
pnpm test
pnpm typecheck
pnpm build
anchor build
anchor test
```

Copie `.env.example` para `.env.local`. Tokens TxLINE ficam somente no servidor e nunca usam prefixo `NEXT_PUBLIC_`.

## Endpoints TxLINE

- `POST /auth/guest/start`
- `POST /api/token/activate`
- `GET /api/scores/snapshot/{fixtureId}`
- `GET /api/scores/stat-validation?fixtureId=...&seq=...&statKeys=1,2`
- `GET /api/scores/stream`

## Endereços

- VeriCup program: `BgJSdxW7zKzg5r5sctQoxEbc73pEeiaFGj3ebqvR8gnd`
- TxLINE devnet oracle: `6pW64gN1s2uqjHkn1unFeEjAwJkPGHoppGvS715wyP2J`
- Cluster planejado: Solana devnet

O programa VeriCup ainda não foi publicado externamente por este fluxo. Deploy, assinatura de carteira e ativação TxLINE exigem aprovação e credenciais do mantenedor.

## Caminho do jurado

1. Abra a UI e selecione HOME, DRAW ou AWAY.
2. Observe o keeper travar o mercado no kickoff.
3. Execute um replay histórico rotulado ou aguarde o evento final live.
4. Confira fixture, score, slot e proof hash.
5. Faça claim proporcional ou refund.

Veja [integração TxLINE](docs/txline-integration.md) e [roteiro de demo](docs/demo-script.md).
