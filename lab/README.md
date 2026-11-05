# Laboratório de jogos

Esta pasta guarda versões em avaliação, variantes e arquivos que **não** devem ir para o site publicado.

## Batalha de Canhões

Quatro versões em avaliação, mantidas fora de `public/games` para não entrarem no catálogo nem no deploy:

| Pasta | Origem | Versão |
| --- | --- | --- |
| `raiz/` | versão que estava em `public/games/batalha-de-canhoes` | 1.0.0 |
| `claude/` | variante `batalha-de-canhoes (claude)` | — |
| `gpt6ultra/` | variante `batalha-de-canhoes-gpt6ultra` | 3.0.0 |
| `v2glm/` | variante `batalha-de-canhoes-v2glm` | 2.0.0 |

Os `.zip` originais estão em `zips/`.

Quando uma versão for escolhida e revisada, copie a pasta para `public/games/batalha-de-canhoes`, preencha `author` e `authorClass` no `manifest.json` e rode `npm run sync`.
