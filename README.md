# VeriCup Markets

Prediction markets da Copa com entrada sem carteira para torcedores e settlement verificável por TxLINE. O caminho principal registra palpites convidados com PLAY virtual; a camada Solana fica como prova opcional para demonstrar que o resultado foi derivado de dados TxLINE, não escolhido pelo backend.

## Por que esta submissão é diferente

- UX principal sem wallet, adequada para judges testarem em segundos;
- score final consumido via TxLINE snapshot/SSE e normalizado pelo keeper;
- prova opcional validada pelo programa oficial `6pW64gN1s2uqjHkn1unFeEjAwJkPGHoppGvS715wyP2J`;
- fixture, chaves de stat `1` e `2`, ordem e período final `100` validados on-chain no modo de prova;
- keeper idempotente, com recuperação de JWT e replay claramente rotulado;
- PLAY é pontuação virtual de demonstração, sem valor real.

## Arquitetura

```text
Fan UI sem carteira -> guest prediction -> PLAY virtual
TxLINE snapshot/SSE -> keeper -> resultado determinístico
TxLINE stat-validation -> resolve_with_txline -> CPI validateStatV2 opcional
Anchor vault -> claim_payout ou refund_position no modo de prova
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

## Carteiras e endereços

- Usuário final: nenhuma carteira necessária no fluxo principal.
- Operador: uma carteira Solana é necessária para assinar a ativação TxLINE e para publicar/rodar a prova on-chain.
- VeriCup program: `BgJSdxW7zKzg5r5sctQoxEbc73pEeiaFGj3ebqvR8gnd`
- TxLINE devnet oracle: `6pW64gN1s2uqjHkn1unFeEjAwJkPGHoppGvS715wyP2J`
- Cluster planejado para prova: Solana devnet

O programa VeriCup ainda não foi publicado externamente por este fluxo. Deploy, assinatura de carteira e ativação TxLINE exigem aprovação e credenciais do mantenedor.

## Caminho do jurado

1. Abra a UI e registre um palpite HOME, DRAW ou AWAY sem conectar carteira.
2. Observe o keeper travar o mercado no kickoff.
3. Execute um replay histórico rotulado ou aguarde o evento final live.
4. Confira fixture, score, ambiente e proof hash no recibo.
5. Para avaliação técnica, rode a prova Anchor local ou em devnet com a carteira operacional.

Veja [integração TxLINE](docs/txline-integration.md) e [roteiro de demo](docs/demo-script.md).
