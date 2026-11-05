# Forca com Dicas — níveis, repertório maior e versão em inglês

## Objetivo

Transformar a partida única em uma campanha de três níveis, com dificuldade crescente, banco maior de palavras e escolha de idioma na entrada do jogo.

## Regras

- O banco tem 180 palavras por idioma, 60 por nível.
- Nível 1 (Fácil/Easy): 5 palavras sorteadas, 6 vidas por palavra.
- Nível 2 (Médio/Medium): 5 palavras sorteadas, 5 vidas por palavra.
- Nível 3 (Difícil/Hard): 5 palavras sorteadas, 4 vidas por palavra.
- Cada palavra vale 20 pontos, menos 4 por erro. A campanha vale até 300 pontos.
- Perder uma palavra não bloqueia o nível: o jogador avança e perde os pontos daquela palavra.
- Ao fim de cada nível, aparece um resumo com as 5 palavras, o desempenho no nível e o placar parcial.
- Ao fim do nível 3, aparece o resultado da campanha com o total e o desempenho por nível.
- O cronômetro começa na primeira letra, pausa nos resumos e retoma na letra seguinte.
- O portal recebe `vrgame:finish` apenas no fim da campanha.
- Reiniciar volta ao nível 1. Não há progresso salvo, porque o portal bloqueia armazenamento no iframe.

## Tela

- A entrada do jogo (`index.html`) mostra a escolha de idioma: Português ou English. O idioma não muda durante a partida.
- HUD com nível atual, nome do nível, palavra atual, pontos totais, sequência, vidas e tempo.
- Botões de passagem: "Próxima palavra / Next word", "Concluir nível / Finish level", "Próximo nível / Next level" e "Jogar de novo / Play again".
- A tela de resumo do nível reutiliza a sobreposição de resultado, com a lista das 5 palavras.
- A tela final mostra uma linha por nível, com palavras completadas e pontos.

## Técnico

- `LEVELS` no topo de `pt/game.js` e `en/game.js` guarda nome, vidas e palavras de cada nível.
- O relógio acumula tempo entre níveis e para nos resumos.
- `vrgame:finish` envia `score`, `maxScore` 300, `timeMs` e `detail.levels`.
- A home envia `vrgame:ready` e `vrgame:resize` e acompanha `vrgame:theme`, para funcionar dentro do iframe do portal.
- Manifest, capa e README atualizados para 3 níveis, dois idiomas e 8 minutos.
