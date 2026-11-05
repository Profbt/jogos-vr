# Forca com Dicas / Hangman with Hints

Jogo de forca (português e inglês) para o portal Jogos VR. A campanha tem três níveis de dificuldade, com dicas de classe gramatical e significado.

## Estrutura

- `index.html` — tela inicial de escolha de idioma (Português / English).
- `pt/` — versão em português.
- `en/` — versão em inglês.

## Regras

- Nível 1 (Fácil/Easy): 5 palavras sorteadas de 60, 6 vidas por palavra.
- Nível 2 (Médio/Medium): 5 palavras sorteadas de 60, 5 vidas por palavra.
- Nível 3 (Difícil/Hard): 5 palavras sorteadas de 60, 4 vidas por palavra.
- Cada palavra vale 20 pontos, menos 4 por erro. A campanha vale até 300 pontos.
- Perder uma palavra não trava o nível; o jogador avança e perde os pontos daquela palavra.
- No fim, o jogo envia `vrgame:finish` com a pontuação e o detalhamento por nível.
- O botão "Jogar de novo / Play again" reinicia a campanha no nível 1.

## Edição

- O banco de palavras fica em `pt/game.js` e `en/game.js`, no array `LEVELS`.
- Cada item tem `word`, `hint` (classe gramatical / part of speech) e `meaning`.
- Palavras em maiúsculas, sem espaços, no máximo 12 letras, sem duplicatas.
- Versão PT: letras acentuadas contam como a letra-base (C revela Ç).
