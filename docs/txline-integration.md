# Integração TxLINE

IDL oficial 1.5.6 obtida em 12 de julho de 2026 de `txodds/tx-on-chain`, arquivo `examples/devnet/idl/txoracle.json`. Endereço verificado: `6pW64gN1s2uqjHkn1unFeEjAwJkPGHoppGvS715wyP2J`.

O `TxlineClient` normaliza casing, aceita somente `game_finalised` com status e período 100, exige hashes de 32 bytes e preserva a ordem entre stats e provas. O keeper busca `statKeys=1,2`.

No programa, `resolve_with_txline`:

1. exige mercado LOCKED e fixture correspondente;
2. exige exatamente as chaves 1 e 2, nessa ordem, no período 100;
3. cria dois predicados `EqualTo` a partir dos próprios valores das folhas;
4. chama `validateStatV2` no endereço oficial;
5. valida program ID, retorno Borsh booleano e resultado verdadeiro;
6. deriva o outcome e grava hash Keccak, slot e estado RESOLVED.

O mock local compartilha o discriminator e o formato de argumentos, mas só é carregado por `[[test.genesis]]`. Ele não é aceito como programa alternativo em devnet.

## Evidência devnet pendente

Preencher após ativação autorizada: fixture, seq, market PDA, assinatura de resolução, assinatura de claim e links do Explorer. Nenhuma assinatura fictícia é registrada.
