# Modelo de jogo

Esta pasta é o ponto de partida. Ela já tem um jogo funcionando: clique no alvo.

## Como usar

1. Copie esta pasta (`modelo-jogo`) para `public/games/` e renomeie com o nome do seu jogo.
   O nome da pasta deve ser igual ao `slug` do `manifest.json`.
2. Abra `index.html` no navegador para testar.
3. Edite `game.js` e `style.css` à vontade.
4. Troque a capa `cover.svg` por uma imagem 16:9 (pode ser `.png` ou `.jpg`).
5. Preencha o `manifest.json` com seus dados.
6. Teste no celular e no computador.
7. Compacte a pasta em `.zip` e entregue ao professor.

## O que não pode faltar

- `window.parent.postMessage({ type: "vrgame:ready" }, "*")` quando o jogo carregar.
- `window.parent.postMessage({ type: "vrgame:finish", score, maxScore, timeMs }, "*")` no final.
- Nada de link externo, biblioteca da internet ou coleta de dados.

O contrato completo está em `docs/CONTRATO.md`.
