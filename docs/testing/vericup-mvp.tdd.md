# Evidência TDD do VeriCup MVP

| Limite | RED | GREEN |
|---|---|---|
| TxLINE | módulo ausente | 13 testes, cobertura de linhas 89,58% |
| Keeper | comportamento ausente | 9 testes, workspace 87,5% linhas |
| Mercado Anchor | 3 instruções ausentes | 3 passing |
| Resolução CPI | 6 falhas em `lockMarket` | 9 passing acumulados |
| Settlement | 3 instruções ausentes | 12 passing acumulados |
| UI | 2 componentes ausentes | 2 passing |
| Replay | módulo ausente | 2 passing |

Cobertura final TypeScript: 86,08% statements, 83,17% branches, 96,55% funções e 87,37% linhas.

Checkpoints RED e GREEN permanecem separados no histórico Git. Os testes Anchor rodam em ledger novo com mock TxLINE carregado no endereço oficial exclusivamente no genesis local.

Gap conhecido: publicação devnet, ativação de token TxLINE e teste com o oracle remoto dependem de carteira, fundos devnet e credenciais do mantenedor. Não foram simulados como evidência real.

Supply chain: `pnpm audit --audit-level low` passa. Os testes Anchor usam helpers locais para SPL Token, evitando a dependência JavaScript `@solana/spl-token` e removendo a vulnerabilidade transitiva `bigint-buffer@1.1.5`.
