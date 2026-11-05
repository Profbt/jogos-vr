# Batalha de Canhões v2.0

Remake modernizado do clássico "Bang! Bang!" (anos 90), agora com **armas
especiais desbloqueáveis**, **três níveis de dificuldade**, **sistema de
pontuação com estrelas** e **visual cartoon vibrante**. Duelo de artilharia
em turnos com física de projétil, vento dinâmico e terreno destrutível.

## Novidades da versão 2.0

### 🎨 Visual cartoon moderno
- Canhões com carinha expressiva, olhos que seguem o turno, sobrancelhas e sorriso
- Céu com gradiente, sol animado com raios (ou lua na fase noturna)
- Montanhas ao fundo, árvores decorativas no terreno (pinheiros e copas)
- Animações: flash de tiro, tremor de tela ao explodir, bandeira que ondula
- HP pisca em vermelho quando está abaixo de 30%

### 🚀 Armas especiais (liberadas por sequência de acertos)
| Arma        | Liberação   | Efeito                                                   |
|-------------|-------------|----------------------------------------------------------|
| 💣 Canhão    | inicial     | Bola padrão, dano normal                                 |
| 🧨 Pesado    | 2 acertos   | Explosão maior, menos afetada pelo vento                 |
| 🎆 Cluster   | 3 acertos   | Explode no ar em 3 fragmentos que cobrem uma área        |
| 🔱 Triplo    | 4 acertos   | Dispara 3 projéteis em leque simultaneamente             |
| 🚀 Míssil    | 5 acertos   | Teleguiado: curva suavemente em direção ao alvo          |
| 🛡️ Escudo    | 3 acertos   | Defensivo: bloqueia totalmente o próximo tiro inimigo    |

Errou a conta? A sequência zera e as armas ficam bloqueadas de novo.

### ⚙️ Três níveis de dificuldade
- **Fácil** 😌 — IA 50% de acerto, vento fraco, 25s por turno, 120 HP
- **Médio** 🎯 — IA 75% de acerto, vento médio, 20s por turno, 100 HP (padrão)
- **Difícil** 😎 — IA 90% de acerto, vento forte, 15s por turno, 80 HP

### 🏆 Sistema de pontuação
- +10 pontos por conta certa
- +dano causado (×2 se o tiro foi com bônus)
- +50 pontos por acerto direto no canhão
- +200 pontos por vitória
- +HP restante do vencedor
- **Estrelas (0–3):** 1 estrela por vitória, 2 se acerto ≥ 60%, 3 se acerto ≥ 80% e HP ≥ 30

### 📱 Controles mobile-first
- **Arraste do canhão** no canvas para mirar (ângulo + força)
- Ou use os **sliders** para ajuste fino
- **Atalhos de teclado** (desktop): setas ↑↓ para ângulo, ←→ para força, Espaço/Enter para disparar
- Botão de fogo grande, com efeito 3D de "pressionar"
- Painéis responsivos que se adaptam a qualquer tela

### 🎵 Áudio enriquecido
- Tons distintos para tiro, explosão, acerto, erro, desbloqueio, vitória, derrota, estrelas
- Ruído branco filtrado para explosões mais realistas
- Botão para ligar/desligar o som no canto superior direito

## Como jogar

1. Abra `index.html` no navegador (celular ou computador).
2. Escolha o modo: **2 Jogadores** (mesma tela) ou **Vs Computador**.
3. Selecione a dificuldade (Fácil, Médio ou Difícil).
4. A cada turno:
   - Responda à conta no tempo limite. Acerto = **dano em dobro** + 1 na sequência.
   - Sequência libera armas especiais. Selecione no painel.
   - Ajuste o **ângulo** (5° a 85°) e a **força** (20 a 100) ou arraste no canvas.
   - Aperte **FOGO!**. O **vento** muda a cada turno e empurra o projétil.
5. Reduza os pontos de vida do rival a zero para vencer. Se o tempo esgotar,
   o tiro sai sozinho com os valores atuais.

## O que este jogo ensina

- **Operações fundamentais** com números naturais (o desafio de cada turno).
- **Estimativa e modelagem**: a trajetória é uma parábola; o jogador ajusta
  ângulo e força e percebe o efeito do vento (aceleração horizontal).
- **Pensamento estratégico** e tomada de decisão sob tempo limitado.
- **Consequência de erros**: errar a conta zera a sequência e perde o acesso
  às armas especiais, criando um ciclo de recompensa pelo aprendizado.

## Estrutura

- `index.html` — página e painéis (HUD, pergunta, controles, modais).
- `style.css` — visual cartoon, mobile-first, tema claro/escuro.
- `game.js` — física, IA, terreno destrutível, armas, dificuldades, pontuação, contrato do portal.
- `cover.svg` — capa 16:9 exibida no portal (vetorial, leve).
- `manifest.json` — metadados do jogo no portal.
- `README.md` — esta documentação.

## Contrato do portal (não remover)

- `window.parent.postMessage({ type: "vrgame:ready" }, "*")` ao carregar.
- `window.parent.postMessage({ type: "vrgame:finish", score, maxScore, timeMs }, "*")` no fim da partida.
- `window.parent.postMessage({ type: "vrgame:resize", height }, "*")` quando o layout muda.
- Sem links externos, bibliotecas da internet ou coleta de dados.
- Suporte a tema claro/escuro via `localStorage("bc-theme")`, query string `?theme=dark` ou mensagem `vrgame:theme`.

## Detalhes técnicos

- **Sem dependências externas** — HTML, CSS e JavaScript puros.
- **Canvas 960×540** com escala responsiva (mantém 16:9).
- **Pointer events** unificam mouse e toque para arrastar-mirar.
- **Web Audio API** para todos os efeitos sonoros (sem arquivos MP3).
- Compatível com iOS Safari, Android Chrome e navegadores desktop modernos.

## Ideias para versões futuras

- Modo campanha com chefes e fases temáticas (deserto, neve, vulcão).
- Conquistas persistentes (10 acertos seguidos, vitória sem dano, etc.).
- Mais tipos de contas: frações, equações de 1º grau, porcentagens.
- Replay dos melhores tiros.
