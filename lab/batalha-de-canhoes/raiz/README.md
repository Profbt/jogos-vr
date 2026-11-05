# Batalha de Canhões

Remake educativo inspirado no clássico "Bang! Bang!" (Windows 3.x, anos 90).
Duelo de artilharia em turnos com física de projétil, vento dinâmico e
terreno destrutível. O gancho educativo: a cada turno o jogador resolve uma
operação matemática (adição, subtração, multiplicação ou divisão) e, se
acertar, dispara com dano em dobro.

## Como jogar

1. Abra `index.html` no navegador (celular ou computador).
2. Escolha o modo: **Dois jogadores** (mesma tela) ou **Contra o computador**.
3. A cada turno:
   - Responda à conta no tempo limite — acerto dá **dano em dobro** no tiro.
   - Ajuste o **ângulo** (5° a 85°) e a **força** (20 a 100) do canhão.
   - Aperte **Fogo!**. O **vento** muda a cada turno e empurra o projétil.
4. O terreno é destruído pelas explosões. Reduza os 100 pontos de vida do
   rival a zero para vencer. Se o tempo de mira esgotar, o tiro sai sozinho
   com os valores atuais.

## O que este jogo ensina

- **Operações fundamentais** com números naturais (o desafio de cada turno).
- **Estimativa e modelagem**: a trajetória é uma parábola; o jogador ajusta
  ângulo e força e percebe o efeito do vento (aceleração horizontal).
- **Pensamento estratégico** e tomada de decisão sob tempo limitado.

## Estrutura

- `index.html` — página e painéis (HUD, pergunta, controles).
- `style.css` — visual, tema claro/escuro.
- `game.js` — física, IA, terreno destrutível, desafios e contrato do portal.
- `cover.svg` — capa 16:9 exibida no portal.
- `manifest.json` — metadados do jogo no portal.

## Contrato do portal (não remover)

- `window.parent.postMessage({ type: "vrgame:ready" }, "*")` ao carregar.
- `window.parent.postMessage({ type: "vrgame:finish", score, maxScore, timeMs }, "*")` no fim da partida.
- Sem links externos, bibliotecas da internet ou coleta de dados.

## Ideias para versões futuras

- Armas especiais e power-ups (raio de explosão maior, tiro triplo).
- Dificuldade da IA e níveis de conteúdo (frações, equações).
- Temas de terreno (deserto, neve) e placar de vitórias salvo localmente.
