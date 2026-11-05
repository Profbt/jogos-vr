# Tecla Certa — plano de implementação

> **Nota histórica:** este plano descreve a versão inicial, com 4 temas e 3 níveis. O jogo hoje tem 10 temas, 4 níveis e até 12 estrelas. Consulte `docs/superpowers/specs/2026-11-03-tecla-certa-ux-repertorio.md` para a versão atual.

> **Para quem executa:** este plano é auto-suficiente. Leia a especificação em `docs/superpowers/specs/2026-11-03-tecla-certa-design.md` antes de começar. Não há repositório Git neste projeto; ignore passos de commit.

**Objetivo:** publicar um jogo de digitação estático com quatro temas, três níveis e integração completa com o portal Jogos VR.

**Arquitetura:** uma pasta de jogo em `public/games/tecla-certa/` com HTML, CSS e JS puro. O portal React não muda: o `sync-games.mjs` lê o manifest e inclui o jogo no catálogo. A comunicação usa apenas `postMessage`.

**Stack:** HTML, CSS e JavaScript (IIFE, sem dependências), Vite para o portal, Node para o script de catálogo.

**Spec:** `docs/superpowers/specs/2026-11-03-tecla-certa-design.md`

## Restrições globais

- Sem bibliotecas, fontes ou imagens externas.
- Sem `eval` e sem script inline.
- Funciona dentro de `iframe sandbox="allow-scripts"`.
- `localStorage` é opcional e sempre dentro de `try/catch`.
- Letras comparadas sem diferenciar maiúsculas; acentos, ç, espaço e pontuação exatos.
- Layout sem rolagem horizontal em 320 px.
- Contraste mínimo AA e foco visível.
- Respeitar `prefers-reduced-motion`.
- O jogo precisa enviar `vrgame:ready`, `vrgame:resize` e `vrgame:finish`.
- Não há Git; não criar commits.

## Estrutura de arquivos

```
public/games/tecla-certa/
  index.html      telas, campo oculto, regiões acessíveis
  style.css       identidade de máquina de escrever, teclado, responsivo, temas
  game.js         dados, estado, entrada, métricas, pontuação, postMessage
  manifest.json   catálogo do portal
  cover.svg       capa 16:9
```

Também serão alterados:

- `README.md` — incluir `tecla-certa/` na árvore de jogos.
- `src/data/games.generated.json` — gerado pelo `npm run sync`, não editar à mão.

---

## Task 1: Criar a pasta, o manifest e a capa

**Arquivos:**
- Criar: `public/games/tecla-certa/manifest.json`
- Criar: `public/games/tecla-certa/cover.svg`
- Modificar: `README.md`

**Interfaces:**
- Produz: slug `tecla-certa` e capa `cover.svg` usados pelo catálogo.

- [ ] **Step 1: Criar o manifest**

```json
{
  "slug": "tecla-certa",
  "title": "Tecla Certa",
  "author": "Equipe Jogos VR",
  "authorClass": "Projeto de exemplo",
  "discipline": "Interdisciplinar",
  "grades": ["6º", "7º", "8º", "9º"],
  "tags": ["digitação", "teclado", "velocidade", "precisão", "português"],
  "description": "Pratique digitação com palavras e frases de quatro disciplinas, em três níveis de dificuldade.",
  "instructions": "Escolha um tema e digite o texto na tela. As cores do teclado mostram qual dedo usar. Nos níveis 1 e 2, corrija a letra errada para avançar; no nível 3, o erro conta na precisão.",
  "duration": 5,
  "version": "1.0.0",
  "entry": "index.html",
  "cover": "cover.svg",
  "featured": true,
  "order": 3,
  "createdAt": "2026-11-03"
}
```

- [ ] **Step 2: Criar a capa SVG**

Usar 1280×720, fundo papel `#f7f1e3`, máquina escura `#1f2937`, folha `#fffdf7`, fita vermelha `#b91c1c` e teclas coloridas. Título “TECLA CERTA” em fonte serifada do sistema. A capa precisa continuar legível em 320×180.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" role="img" aria-labelledby="title desc">
  <title id="title">Tecla Certa</title>
  <desc id="desc">Máquina de escrever sobre papel, com teclas coloridas e o nome Tecla Certa.</desc>
  <defs>
    <linearGradient id="paper" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fbf6ea"/>
      <stop offset="1" stop-color="#efe4cc"/>
    </linearGradient>
    <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#334155"/>
      <stop offset="1" stop-color="#111827"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="#f7f1e3"/>
  <g opacity=".25" stroke="#d8cdb8" stroke-width="2">
    <path d="M0 90h1280M0 180h1280M0 270h1280M0 360h1280M0 450h1280M0 540h1280M0 630h1280"/>
  </g>
  <g transform="rotate(-2 640 360)">
    <rect x="300" y="80" width="680" height="340" rx="12" fill="url(#paper)" stroke="#d8cdb8" stroke-width="4"/>
    <text x="640" y="215" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="76" font-weight="700" fill="#1f2937" letter-spacing="4">TECLA</text>
    <text x="640" y="300" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="76" font-weight="700" fill="#b91c1c" letter-spacing="4">CERTA</text>
    <text x="640" y="355" text-anchor="middle" font-family="Consolas, 'Courier New', monospace" font-size="24" fill="#6b7280" letter-spacing="3">JOGOS VR · DIGITAÇÃO</text>
  </g>
  <g>
    <rect x="240" y="430" width="800" height="210" rx="28" fill="url(#body)"/>
    <rect x="285" y="455" width="710" height="56" rx="10" fill="#0f172a"/>
    <g fill="#f7f1e3">
      <rect x="310" y="530" width="54" height="46" rx="8"/>
      <rect x="374" y="530" width="54" height="46" rx="8"/>
      <rect x="438" y="530" width="54" height="46" rx="8"/>
      <rect x="502" y="530" width="54" height="46" rx="8"/>
      <rect x="566" y="530" width="54" height="46" rx="8"/>
      <rect x="630" y="530" width="54" height="46" rx="8"/>
      <rect x="694" y="530" width="54" height="46" rx="8"/>
      <rect x="758" y="530" width="54" height="46" rx="8"/>
      <rect x="822" y="530" width="54" height="46" rx="8"/>
      <rect x="886" y="530" width="54" height="46" rx="8"/>
    </g>
    <g>
      <rect x="330" y="588" width="54" height="40" rx="7" fill="#f59e0b"/>
      <rect x="394" y="588" width="54" height="40" rx="7" fill="#10b981"/>
      <rect x="458" y="588" width="54" height="40" rx="7" fill="#3b82f6"/>
      <rect x="522" y="588" width="54" height="40" rx="7" fill="#8b5cf6"/>
      <rect x="586" y="588" width="300" height="40" rx="7" fill="#e5e7eb"/>
      <rect x="896" y="588" width="54" height="40" rx="7" fill="#ec4899"/>
    </g>
    <rect x="240" y="640" width="800" height="14" rx="7" fill="#0f172a" opacity=".55"/>
  </g>
  <g font-family="Consolas, 'Courier New', monospace" font-size="30" fill="#b91c1c" opacity=".8">
    <text x="120" y="200">A</text>
    <text x="1090" y="170">Ç</text>
    <text x="160" y="380">Ã</text>
    <text x="1090" y="390">É</text>
  </g>
</svg>
```

- [ ] **Step 3: Atualizar o README**

Na árvore de `public/games/`, adicionar:

```text
    tecla-certa/       jogo publicado
```

- [ ] **Step 4: Gerar o catálogo**

Run:

```powershell
npm run sync
```

Expected: `[sync-games] 3 jogo(s) no catálogo.` e `tecla-certa` presente em `src/data/games.generated.json`.

- [ ] **Step 5: Conferir o cartão**

Run `npm run dev` e abrir `/`. Expected: o cartão “Tecla Certa” aparece com a capa e a disciplina “Interdisciplinar”.

---

## Task 2: Montar as telas em HTML

**Arquivos:**
- Criar: `public/games/tecla-certa/index.html`

**Interfaces:**
- Produz: IDs consumidos por `game.js`: `screen-start`, `screen-intro`, `screen-play`, `screen-level-result`, `screen-final`, `theme-grid`, `intro-theme`, `intro-level`, `intro-help`, `intro-goals`, `intro-start`, `intro-back`, `play-theme`, `play-level`, `hud-ppm`, `hud-accuracy`, `hud-time`, `progress-bar`, `progress-text`, `text-display`, `sr-text`, `next-key`, `finger-legend`, `keyboard`, `play-hint`, `pause-overlay`, `resume`, `level-result-title`, `level-result-stars`, `level-result-metrics`, `level-next`, `final-stars`, `final-table`, `final-again`, `final-theme`, `typing-input`, `live`, `mobile-note`, `mobile-note-close`, `topbar-status`.

- [ ] **Step 1: Escrever a estrutura**

```html
<!doctype html>
<html lang="pt-BR" data-theme="light">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light dark" />
    <title>Tecla Certa — Jogos VR</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <div class="app" id="app">
      <header class="topbar">
        <div class="brand">
          <span class="brand-key" aria-hidden="true">A</span>
          <div>
            <p class="brand-kicker">Jogos VR</p>
            <p class="brand-name">Tecla Certa</p>
          </div>
        </div>
        <p class="topbar-status" id="topbar-status">4 temas · 3 níveis</p>
      </header>

      <div class="mobile-note" id="mobile-note" hidden>
        <p>No celular, use o teclado do aparelho. A experiência completa é no computador.</p>
        <button type="button" id="mobile-note-close" class="btn btn-ghost btn-small">Fechar</button>
      </div>

      <main>
        <section class="screen" id="screen-start" aria-labelledby="start-title">
          <div class="start-hero">
            <p class="eyebrow">Digitação para o dia a dia</p>
            <h1 id="start-title">Aprenda a digitar<br /><em>sem olhar para as teclas.</em></h1>
            <p class="lead">Escolha um tema, acompanhe as cores dos dedos e complete três níveis. Leva de 3 a 5 minutos.</p>
          </div>
          <div class="theme-grid" id="theme-grid"></div>
          <details class="how">
            <summary>Como jogar</summary>
            <div class="how-body">
              <p>Digite o texto que aparece na tela. A tecla destacada é a próxima, e a cor mostra qual dedo usar.</p>
              <p>Nos níveis 1 e 2, a letra errada fica sublinhada até você acertar. No nível 3, o erro conta na precisão e o texto segue.</p>
              <p>Você não precisa apertar Shift: letras maiúsculas e minúsculas valem igual. Acentos, ç e pontuação contam.</p>
            </div>
          </details>
        </section>

        <section class="screen" id="screen-intro" aria-labelledby="intro-theme" hidden>
          <button type="button" class="link-back" id="intro-back">← Trocar tema</button>
          <div class="intro-card">
            <p class="eyebrow" id="intro-discipline">Geografia</p>
            <h2 id="intro-theme">Biomas do Brasil</h2>
            <p class="intro-level" id="intro-level">Nível 1 de 3</p>
            <p class="intro-help" id="intro-help">Palavras curtas, sem acento.</p>
            <p class="intro-goals" id="intro-goals">3 estrelas: 95% de precisão</p>
            <div class="intro-preview" id="intro-preview" aria-hidden="true"></div>
            <button type="button" class="btn btn-primary" id="intro-start">Começar nível</button>
          </div>
        </section>

        <section class="screen" id="screen-play" aria-labelledby="play-theme" hidden>
          <div class="play-head">
            <div>
              <p class="eyebrow" id="play-level">Nível 1 de 3</p>
              <h2 id="play-theme">Biomas do Brasil</h2>
            </div>
            <div class="hud" aria-label="Placar">
              <div class="hud-item"><span id="hud-ppm">0</span><small>PPM</small></div>
              <div class="hud-item"><span id="hud-accuracy">100%</span><small>Precisão</small></div>
              <div class="hud-item"><span id="hud-time">00:00</span><small>Tempo</small></div>
            </div>
          </div>

          <div class="progress" aria-hidden="true">
            <div class="progress-bar" id="progress-bar"></div>
          </div>
          <p class="progress-text" id="progress-text">0 de 0 caracteres</p>

          <div class="play-stage" id="play-stage">
            <div class="text-panel" id="text-panel">
              <p class="text-display" id="text-display" aria-hidden="true"></p>
              <p class="sr-only" id="sr-text"></p>
            </div>
            <div class="pause-overlay" id="pause-overlay" hidden>
              <p>Digitação pausada.</p>
              <button type="button" class="btn btn-primary" id="resume">Continuar digitando</button>
            </div>
          </div>

          <div class="next-key" id="next-key" aria-live="polite"></div>
          <div class="finger-legend" id="finger-legend" aria-hidden="true"></div>
          <div class="keyboard" id="keyboard" aria-hidden="true"></div>
          <p class="play-hint" id="play-hint">A tecla destacada é a próxima. A cor indica o dedo.</p>
        </section>

        <section class="screen" id="screen-level-result" aria-labelledby="level-result-title" hidden>
          <div class="result-card">
            <p class="eyebrow">Nível concluído</p>
            <h2 id="level-result-title">Muito bem!</h2>
            <div class="stars" id="level-result-stars" aria-label="Estrelas do nível"></div>
            <p class="result-metrics" id="level-result-metrics"></p>
            <button type="button" class="btn btn-primary" id="level-next">Próximo nível</button>
          </div>
        </section>

        <section class="screen" id="screen-final" aria-labelledby="final-title" hidden>
          <div class="result-card final-card">
            <p class="eyebrow">Partida concluída</p>
            <h2 id="final-title">Seu resultado</h2>
            <div class="stars stars-big" id="final-stars" aria-label="Total de estrelas"></div>
            <table class="final-table" id="final-table">
              <thead><tr><th>Nível</th><th>Estrelas</th><th>PPM</th><th>Precisão</th></tr></thead>
              <tbody></tbody>
            </table>
            <div class="result-actions">
              <button type="button" class="btn btn-primary" id="final-again">Jogar de novo</button>
              <button type="button" class="btn" id="final-theme">Trocar tema</button>
            </div>
          </div>
        </section>
      </main>

      <footer class="foot">
        <p>Jogos VR · Colégio Estadual Vicente Rijo</p>
        <p>Sem login. Sem coleta de dados.</p>
      </footer>
    </div>

    <input
      id="typing-input"
      class="typing-input"
      type="text"
      inputmode="text"
      autocomplete="off"
      autocapitalize="off"
      autocorrect="off"
      spellcheck="false"
      aria-label="Digite o texto"
    />
    <p class="sr-only" id="live" aria-live="polite"></p>
    <script src="game.js"></script>
  </body>
</html>
```

- [ ] **Step 2: Conferir a estrutura**

Run `npm run build`. Expected: build conclui; o HTML é copiado para `dist/games/tecla-certa/index.html`.

- [ ] **Step 3: Abrir no navegador**

Run `npm run dev` e abrir `http://localhost:5173/jogo/tecla-certa`.

Expected: sem erro no console; o cabeçalho e a tela inicial aparecem, mesmo sem os cartões (o JS ainda não existe).

---

## Task 3: Criar a identidade visual e o responsivo

**Arquivos:**
- Criar: `public/games/tecla-certa/style.css`

**Interfaces:**
- Consome: classes e IDs da Task 2.
- Produz: classes `is-next`, `is-pressed`, `is-error`, `is-done`, `is-current`, `finger-*`, `is-fullscreen`.

- [ ] **Step 1: Definir os tokens**

```css
:root {
  --paper: #f7f1e3;
  --paper-2: #efe4cc;
  --panel: #fffdf7;
  --ink: #1f2937;
  --muted: #6b7280;
  --line: #d8cdb8;
  --red: #b91c1c;
  --blue: #1d4ed8;
  --amber: #b45309;
  --green: #15803d;
  --key: #fffaf0;
  --key-edge: #c9bda5;
  --key-ink: #1f2937;
  --key-pressed: #f3d9a4;
  --overlay: rgb(247 241 227 / 0.86);
  --shadow: 0 18px 40px rgb(31 41 55 / 0.14);
  --mono: "Cascadia Mono", Consolas, "Courier New", monospace;
  --serif: "Iowan Old Style", "Palatino Linotype", Georgia, serif;
  --sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
  --finger-lp: #c2410c;
  --finger-lr: #a16207;
  --finger-lm: #15803d;
  --finger-li: #1d4ed8;
  --finger-ri: #7e22ce;
  --finger-rm: #be185d;
  --finger-rr: #0e7490;
  --finger-rp: #b91c1c;
  --finger-th: #4b5563;
}

[data-theme="dark"] {
  --paper: #0f172a;
  --paper-2: #111827;
  --panel: #1f2937;
  --ink: #f3f4f6;
  --muted: #9ca3af;
  --line: #374151;
  --red: #f87171;
  --blue: #93c5fd;
  --amber: #fbbf24;
  --green: #4ade80;
  --key: #111827;
  --key-edge: #374151;
  --key-ink: #e5e7eb;
  --key-pressed: #4b3a1d;
  --overlay: rgb(15 23 42 / 0.86);
  --shadow: 0 18px 40px rgb(0 0 0 / 0.4);
}
```

- [ ] **Step 2: Aplicar base, papel e tipografia**

```css
* { box-sizing: border-box; }
html, body { margin: 0; }
[hidden] { display: none !important; }
body {
  background:
    repeating-linear-gradient(0deg, transparent 0 31px, rgb(120 100 70 / 0.08) 31px 32px),
    var(--paper);
  color: var(--ink);
  font-family: var(--sans);
  -webkit-font-smoothing: antialiased;
}
.app { width: min(1040px, 100%); margin: 0 auto; padding: clamp(16px, 3vw, 36px); }
.topbar { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 24px; }
.brand { display: flex; align-items: center; gap: 10px; }
.brand-key {
  display: grid; place-items: center; width: 38px; height: 38px;
  border: 2px solid var(--line); border-bottom-width: 5px; border-radius: 9px;
  background: var(--key); color: var(--red); font-family: var(--mono); font-weight: 700;
}
.brand-kicker, .eyebrow { margin: 0; font-size: 11px; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; color: var(--muted); }
.brand-name { margin: 0; font-family: var(--serif); font-size: 20px; font-weight: 700; }
.topbar-status { margin: 0; color: var(--muted); font-size: 12px; }
h1, h2 { font-family: var(--serif); line-height: 1.05; letter-spacing: -.02em; }
h1 { margin: 10px 0 0; font-size: clamp(2.2rem, 6vw, 4.4rem); }
h1 em { color: var(--red); font-style: normal; }
.lead { max-width: 56ch; margin: 18px 0 0; color: var(--muted); font-size: clamp(1rem, 2vw, 1.15rem); line-height: 1.6; }
```

- [ ] **Step 3: Estilizar cartões, telas e botões**

```css
.screen { animation: rise .25s ease both; }
@keyframes rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.theme-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; margin-top: 30px; }
.theme-card {
  display: block; width: 100%; text-align: left; cursor: pointer;
  padding: 20px; border: 1px solid var(--line); border-radius: 16px;
  background: var(--panel); color: var(--ink); box-shadow: 0 2px 0 var(--line);
  transition: transform .15s ease, box-shadow .15s ease;
}
.theme-card:hover { transform: translateY(-2px); box-shadow: var(--shadow); }
.theme-card:focus-visible, .btn:focus-visible, summary:focus-visible { outline: 3px solid var(--blue); outline-offset: 3px; }
.theme-card h3 { margin: 8px 0 4px; font-family: var(--serif); font-size: 24px; }
.theme-card p { margin: 0; color: var(--muted); font-size: 14px; line-height: 1.5; }
.theme-card .theme-discipline { font-size: 11px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; color: var(--red); }
.theme-card .theme-levels { margin-top: 12px; font-family: var(--mono); font-size: 12px; color: var(--muted); }
.how { margin-top: 22px; border: 1px solid var(--line); border-radius: 14px; background: var(--panel); padding: 16px 18px; }
.how summary { cursor: pointer; font-weight: 700; }
.how-body { color: var(--muted); font-size: 14px; line-height: 1.6; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 42px; padding: 0 18px; border: 1px solid var(--line); border-radius: 10px; background: var(--panel); color: var(--ink); font: inherit; font-weight: 700; cursor: pointer; text-decoration: none; }
.btn-primary { border-color: var(--ink); background: var(--ink); color: var(--paper); }
.btn-small { min-height: 32px; padding: 0 12px; font-size: 12px; }
.btn-ghost { background: transparent; }
.link-back { border: 0; background: none; color: var(--muted); font: inherit; cursor: pointer; padding: 0; margin-bottom: 16px; }
.intro-card, .result-card { max-width: 720px; margin: 8vh auto 0; padding: clamp(24px, 5vw, 44px); border: 1px solid var(--line); border-radius: 20px; background: var(--panel); box-shadow: var(--shadow); text-align: center; }
.intro-card h2, .result-card h2 { margin: 10px 0; font-size: clamp(2rem, 5vw, 3.4rem); }
.intro-level { margin: 0; font-family: var(--mono); color: var(--red); font-weight: 700; }
.intro-help { color: var(--muted); }
.intro-goals { display: inline-block; margin: 8px 0 0; padding: 6px 12px; border: 1px dashed var(--line); border-radius: 999px; font-size: 13px; color: var(--muted); }
.intro-preview { margin: 22px 0; padding: 18px; border-radius: 12px; background: var(--paper-2); font-family: var(--mono); font-size: clamp(1rem, 2.4vw, 1.3rem); line-height: 1.6; overflow-wrap: anywhere; }
```

- [ ] **Step 4: Estilizar a tela de jogo e o teclado**

```css
.play-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; }
.play-head h2 { margin: 4px 0 0; font-size: clamp(1.6rem, 3vw, 2.2rem); }
.hud { display: flex; gap: 18px; }
.hud-item { display: flex; flex-direction: column; align-items: flex-end; }
.hud-item span { font-family: var(--mono); font-size: 22px; font-weight: 700; }
.hud-item small { color: var(--muted); font-size: 10px; letter-spacing: .14em; text-transform: uppercase; }
.progress { height: 8px; margin-top: 18px; border-radius: 999px; background: var(--paper-2); overflow: hidden; }
.progress-bar { width: 0; height: 100%; background: var(--red); transition: width .12s linear; }
.progress-text { margin: 6px 0 0; color: var(--muted); font-size: 12px; text-align: right; }
.play-stage { position: relative; margin-top: 14px; }
.text-panel { min-height: 190px; display: grid; place-items: center; padding: clamp(20px, 4vw, 38px); border: 1px solid var(--line); border-radius: 18px; background: var(--panel); box-shadow: inset 0 1px 0 rgb(255 255 255 / .6); }
.text-display { margin: 0; font-family: var(--mono); font-size: clamp(1.55rem, 4.2vw, 2.9rem); line-height: 1.55; letter-spacing: .04em; text-align: center; }
.word { display: inline-block; white-space: pre; }
.char { position: relative; color: var(--muted); }
.char.is-done { color: var(--blue); }
.char.is-current { color: var(--ink); }
.char.is-current::after { content: ""; position: absolute; left: -1px; right: -1px; bottom: 2px; height: 3px; background: var(--red); animation: blink 1s steps(2) infinite; }
.char.is-error { color: var(--red); text-decoration: underline wavy var(--red) 2px; text-underline-offset: .18em; }
.char.space { display: inline-block; min-width: .55em; }
.char.space.is-error { background: rgb(185 28 28 / .18); }
@keyframes blink { 50% { opacity: 0; } }
.pause-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; border-radius: 18px; background: var(--overlay); backdrop-filter: blur(4px); }
.next-key { display: none; margin-top: 12px; padding: 10px 14px; border: 1px solid var(--line); border-radius: 999px; background: var(--panel); font: 700 14px var(--mono); text-align: center; }
.finger-legend { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px 12px; margin-top: 14px; color: var(--muted); font-size: 11px; }
.finger-item { display: inline-flex; align-items: center; gap: 5px; }
.finger-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--finger, var(--muted)); }
.keyboard { display: flex; flex-direction: column; gap: 7px; margin-top: 14px; padding: 14px; border: 1px solid var(--line); border-radius: 16px; background: var(--paper-2); }
.key-row { display: flex; justify-content: center; gap: 7px; }
.key {
  position: relative; display: grid; place-items: center;
  min-width: clamp(30px, 4.4vw, 46px); height: clamp(34px, 4.8vw, 46px); padding: 0 6px;
  border: 1px solid var(--key-edge); border-bottom-width: 4px; border-radius: 8px;
  background: var(--key); color: var(--key-ink);
  font: 700 clamp(12px, 1.5vw, 16px) var(--mono);
  box-shadow: 0 1px 0 rgb(0 0 0 / .12);
  transition: transform .08s ease, background .08s ease;
}
.key::after { content: ""; position: absolute; left: 6px; right: 6px; bottom: 3px; height: 3px; border-radius: 2px; background: var(--finger, transparent); opacity: .85; }
.key.is-next { outline: 3px solid var(--red); outline-offset: 1px; animation: pulse 1.1s ease-in-out infinite; }
.key.is-pressed { transform: translateY(2px); background: var(--key-pressed); }
.key-accent-badge { position: absolute; top: -7px; right: -5px; min-width: 18px; padding: 0 4px; border-radius: 999px; background: var(--red); color: #fff; font: 700 10px/18px var(--sans); }
.key-space { width: min(320px, 42vw); }
@keyframes pulse { 50% { outline-color: transparent; } }
.play-hint { margin: 12px 0 0; color: var(--muted); font-size: 12px; text-align: center; }
```

- [ ] **Step 5: Estilizar resultado, responsivo, tela cheia e movimento reduzido**

```css
.stars { display: flex; justify-content: center; gap: 8px; font-size: 34px; color: var(--line); }
.stars .star.is-on { color: var(--amber); }
.result-metrics { color: var(--muted); font-family: var(--mono); }
.final-table { width: 100%; margin: 22px 0; border-collapse: collapse; font-size: 14px; }
.final-table th, .final-table td { padding: 10px 8px; border-bottom: 1px solid var(--line); text-align: center; }
.final-table th { color: var(--muted); font-size: 11px; letter-spacing: .1em; text-transform: uppercase; }
.result-actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
.foot { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px; margin-top: 34px; padding-top: 14px; border-top: 1px solid var(--line); color: var(--muted); font-size: 11px; }
.typing-input { position: fixed; top: 50%; left: 50%; width: 1px; height: 1px; padding: 0; border: 0; opacity: 0; font-size: 16px; pointer-events: none; }
.sr-only { position: absolute !important; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
.mobile-note { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 16px; padding: 10px 14px; border: 1px dashed var(--line); border-radius: 12px; background: var(--panel); color: var(--muted); font-size: 13px; }
.mobile-note p { margin: 0; }
@media (max-width: 720px) {
  .theme-grid { grid-template-columns: 1fr; }
  .play-head { align-items: flex-start; flex-direction: column; }
  .hud { width: 100%; justify-content: space-between; }
  .hud-item { align-items: flex-start; }
  .keyboard, .finger-legend { display: none; }
  .next-key { display: block; }
  .text-panel { min-height: 160px; }
  .intro-card, .result-card { margin-top: 3vh; }
  .topbar-status { display: none; }
}
@media (max-width: 380px) {
  .app { padding: 12px; }
  .text-display { font-size: 1.35rem; }
}
html.is-fullscreen .app { width: min(1400px, 100%); }
html.is-fullscreen .text-display { font-size: clamp(2rem, 4.6vw, 3.6rem); }
html.is-fullscreen .key { min-width: 52px; height: 56px; }
html.is-fullscreen .foot, html.is-fullscreen .brand-kicker { display: none; }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

- [ ] **Step 6: Conferir o visual**

Run `npm run dev`, abrir `/jogo/tecla-certa` e verificar:

- 1280 px: papel, tipografia e cartões legíveis.
- 375 px: sem rolagem horizontal; teclado oculto; aviso visível.
- Tema escuro: alternar no portal e conferir contraste.
- `prefers-reduced-motion`: sem pulsação.

---

## Task 4: Implementar dados, teclado e renderização

**Arquivos:**
- Criar: `public/games/tecla-certa/game.js`

**Interfaces:**
- Consome: IDs da Task 2 e classes da Task 3.
- Produz: `THEMES`, `LEVEL_META`, `FINGER_MAP`, `ACCENT_MAP`, `state`, `showScreen(name)`, `renderThemes()`, `buildKeyboard()`, `renderText()`, `updateHud()`, `highlightNext()`.

- [ ] **Step 1: Criar os dados**

```js
(function () {
  "use strict";

  var THEMES = [
    {
      id: "biomas",
      title: "Biomas do Brasil",
      discipline: "Geografia",
      blurb: "Paisagens, climas e águas do país.",
      levels: [
        "MATA CAMPO LAGO SERRA DUNAS RIO",
        "CERRADO CAATINGA PANTANAL AMAZÔNIA PAMPA MATA ATLÂNTICA",
        "O CERRADO É O BERÇO DAS ÁGUAS DO BRASIL."
      ]
    },
    {
      id: "corpo-humano",
      title: "Corpo Humano",
      discipline: "Ciências",
      blurb: "Órgãos, sistemas e funções do corpo.",
      levels: [
        "OSSO PELE SANGUE NARIZ OUVIDO OLHO",
        "CORAÇÃO PULMÃO FÍGADO CÉREBRO ESTÔMAGO INTESTINO",
        "O CORAÇÃO BOMBEIA O SANGUE PARA TODO O CORPO."
      ]
    },
    {
      id: "historia-brasil",
      title: "História do Brasil",
      discipline: "História",
      blurb: "Colônia, império e república.",
      levels: [
        "REI LEI OURO NAVIO CARTA POVO",
        "COLÔNIA IMPÉRIO ABOLIÇÃO REPÚBLICA CARAVELA MONARQUIA",
        "A ABOLIÇÃO ACONTECEU EM 1888."
      ]
    },
    {
      id: "lingua-portuguesa",
      title: "Língua Portuguesa",
      discipline: "Português",
      blurb: "Acentuação, ortografia e pontuação.",
      levels: [
        "SALA LIVRO CARTA TEXTO FRASE CONTO",
        "ACENTUAÇÃO ORTOGRAFIA PONTUAÇÃO SÍLABA PARÁGRAFO CRASE",
        "A ACENTUAÇÃO MUDA O SENTIDO DAS PALAVRAS."
      ]
    }
  ];

  var LEVEL_META = [
    {
      label: "Nível 1 de 3",
      title: "Aquecimento",
      help: "Palavras curtas, sem acento. A letra errada não avança.",
      goals: "3 estrelas: 95% de precisão · 2 estrelas: 85%",
      errorMode: "block",
      showFingers: true
    },
    {
      label: "Nível 2 de 3",
      title: "Acentos e ç",
      help: "Palavras médias com acento e ç. A letra errada não avança.",
      goals: "3 estrelas: 92% + 10 PPM · 2 estrelas: 80% + 7 PPM",
      errorMode: "block",
      showFingers: true
    },
    {
      label: "Nível 3 de 3",
      title: "Frase completa",
      help: "Uma frase do tema. O erro conta e o texto segue.",
      goals: "3 estrelas: 90% + 15 PPM · 2 estrelas: 80% + 10 PPM",
      errorMode: "advance",
      showFingers: false
    }
  ];
```

- [ ] **Step 2: Criar mapas de dedos e acentos**

```js
  var FINGER_NAMES = {
    lp: "mindinho esquerdo",
    lr: "anelar esquerdo",
    lm: "médio esquerdo",
    li: "indicador esquerdo",
    ri: "indicador direito",
    rm: "médio direito",
    rr: "anelar direito",
    rp: "mindinho direito",
    th: "polegar"
  };

  var FINGER_MAP = {
    Q: "lp", A: "lp", Z: "lp",
    W: "lr", S: "lr", X: "lr",
    E: "lm", D: "lm", C: "lm",
    R: "li", F: "li", V: "li", T: "li", G: "li", B: "li",
    Y: "ri", H: "ri", N: "ri", U: "ri", J: "ri", M: "ri",
    I: "rm", K: "rm", ",": "rm",
    O: "rr", L: "rr", ".": "rr",
    P: "rp", "Ç": "rp", "´": "rp", "`": "rp", "^": "rp", "~": "rp", "¨": "rp",
    " ": "th"
  };

  var ACCENT_MAP = {
    "Á": { base: "A", mark: "´" }, "À": { base: "A", mark: "`" }, "Â": { base: "A", mark: "^" }, "Ã": { base: "A", mark: "~" }, "Ä": { base: "A", mark: "¨" },
    "É": { base: "E", mark: "´" }, "È": { base: "E", mark: "`" }, "Ê": { base: "E", mark: "^" }, "Ë": { base: "E", mark: "¨" },
    "Í": { base: "I", mark: "´" }, "Ì": { base: "I", mark: "`" }, "Î": { base: "I", mark: "^" }, "Ï": { base: "I", mark: "¨" },
    "Ó": { base: "O", mark: "´" }, "Ò": { base: "O", mark: "`" }, "Ô": { base: "O", mark: "^" }, "Õ": { base: "O", mark: "~" }, "Ö": { base: "O", mark: "¨" },
    "Ú": { base: "U", mark: "´" }, "Ù": { base: "U", mark: "`" }, "Û": { base: "U", mark: "^" }, "Ü": { base: "U", mark: "¨" },
    "Ç": { base: "Ç", mark: null }
  };
```

- [ ] **Step 3: Criar o estado e as referências de DOM**

```js
  var state = {
    screen: "start",
    themeIndex: 0,
    levelIndex: 0,
    target: "",
    position: 0,
    correct: 0,
    attempts: 0,
    startedAt: 0,
    accumulatedMs: 0,
    running: false,
    composing: false,
    levelActive: false,
    mobileDismissed: false,
    paused: false,
    wrongCurrent: false,
    errorPositions: [],
    levelResults: [],
    sentFinish: false,
    timerId: 0,
    lastHeight: 0
  };

  var els = {
    app: document.getElementById("app"),
    topbarStatus: document.getElementById("topbar-status"),
    mobileNote: document.getElementById("mobile-note"),
    mobileNoteClose: document.getElementById("mobile-note-close"),
    themeGrid: document.getElementById("theme-grid"),
    introDiscipline: document.getElementById("intro-discipline"),
    introTheme: document.getElementById("intro-theme"),
    introLevel: document.getElementById("intro-level"),
    introHelp: document.getElementById("intro-help"),
    introGoals: document.getElementById("intro-goals"),
    introPreview: document.getElementById("intro-preview"),
    introStart: document.getElementById("intro-start"),
    introBack: document.getElementById("intro-back"),
    playLevel: document.getElementById("play-level"),
    playTheme: document.getElementById("play-theme"),
    hudPpm: document.getElementById("hud-ppm"),
    hudAccuracy: document.getElementById("hud-accuracy"),
    hudTime: document.getElementById("hud-time"),
    progressBar: document.getElementById("progress-bar"),
    progressText: document.getElementById("progress-text"),
    textPanel: document.getElementById("text-panel"),
    textDisplay: document.getElementById("text-display"),
    srText: document.getElementById("sr-text"),
    nextKey: document.getElementById("next-key"),
    fingerLegend: document.getElementById("finger-legend"),
    keyboard: document.getElementById("keyboard"),
    pauseOverlay: document.getElementById("pause-overlay"),
    resume: document.getElementById("resume"),
    levelResultTitle: document.getElementById("level-result-title"),
    levelResultStars: document.getElementById("level-result-stars"),
    levelResultMetrics: document.getElementById("level-result-metrics"),
    levelNext: document.getElementById("level-next"),
    finalStars: document.getElementById("final-stars"),
    finalTable: document.getElementById("final-table"),
    finalAgain: document.getElementById("final-again"),
    finalTheme: document.getElementById("final-theme"),
    input: document.getElementById("typing-input"),
    live: document.getElementById("live")
  };
```

- [ ] **Step 4: Implementar utilidades, telas e cartões**

```js
  function formatTime(ms) {
    var total = Math.max(0, Math.floor(ms / 1000));
    var m = Math.floor(total / 60);
    var s = total % 60;
    return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
  }

  function announce(message) {
    els.live.textContent = "";
    window.setTimeout(function () {
      els.live.textContent = message;
    }, 30);
  }

  function showScreen(name) {
    var screens = document.querySelectorAll(".screen");
    for (var i = 0; i < screens.length; i++) {
      screens[i].hidden = screens[i].id !== "screen-" + name;
    }
    state.screen = name;
    els.topbarStatus.textContent =
      name === "start" ? "4 temas · 3 níveis" : "Digitação";
    window.requestAnimationFrame(reportHeight);
  }

  function themeCard(theme, index) {
    var card = document.createElement("button");
    card.type = "button";
    card.className = "theme-card";
    card.setAttribute("data-theme-index", String(index));
    card.innerHTML =
      '<span class="theme-discipline"></span>' +
      '<h3></h3>' +
      '<p></p>' +
      '<span class="theme-levels">Nível 1 · palavras curtas &nbsp; Nível 2 · acentos &nbsp; Nível 3 · frase</span>';
    card.querySelector(".theme-discipline").textContent = theme.discipline;
    card.querySelector("h3").textContent = theme.title;
    card.querySelector("p").textContent = theme.blurb;
    card.addEventListener("click", function () {
      selectTheme(index);
    });
    return card;
  }

  function renderThemes() {
    els.themeGrid.innerHTML = "";
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < THEMES.length; i++) {
      fragment.appendChild(themeCard(THEMES[i], i));
    }
    els.themeGrid.appendChild(fragment);
  }

  function selectTheme(index) {
    state.themeIndex = index;
    state.levelIndex = 0;
    state.levelResults = [];
    state.sentFinish = false;
    state.errorPositions = [];
    showLevelIntro();
  }
```

- [ ] **Step 5: Implementar o teclado e o texto**

```js
  function buildKeyboard() {
    var rows = [
      ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
      ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ç"],
      ["Z", "X", "C", "V", "B", "N", "M", ".", ","],
      ["´", "`", "^", "~", "¨", " "]
    ];
    els.keyboard.innerHTML = "";
    for (var r = 0; r < rows.length; r++) {
      var row = document.createElement("div");
      row.className = "key-row";
      for (var k = 0; k < rows[r].length; k++) {
        var ch = rows[r][k];
        var key = document.createElement("span");
        key.className = "key" + (ch === " " ? " key-space" : "");
        key.setAttribute("data-key", ch);
        key.style.setProperty("--finger", "var(--finger-" + (FINGER_MAP[ch] || "th") + ")");
        key.textContent = ch === " " ? "espaço" : ch;
        row.appendChild(key);
      }
      els.keyboard.appendChild(row);
    }
    var fragment = document.createDocumentFragment();
    var order = ["lp", "lr", "lm", "li", "ri", "rm", "rr", "rp", "th"];
    for (var i = 0; i < order.length; i++) {
      var item = document.createElement("span");
      item.className = "finger-item";
      var dot = document.createElement("span");
      dot.className = "finger-dot";
      dot.style.setProperty("--finger", "var(--finger-" + order[i] + ")");
      item.appendChild(dot);
      item.appendChild(document.createTextNode(FINGER_NAMES[order[i]]));
      fragment.appendChild(item);
    }
    els.fingerLegend.innerHTML = "";
    els.fingerLegend.appendChild(fragment);
  }

  function keyElement(ch) {
    return els.keyboard.querySelector('[data-key="' + ch + '"]');
  }

  function clearKeyboardState() {
    var keys = els.keyboard.querySelectorAll(".key");
    for (var i = 0; i < keys.length; i++) {
      keys[i].classList.remove("is-next", "is-pressed");
      var badge = keys[i].querySelector(".key-accent-badge");
      if (badge) badge.remove();
    }
  }

  function highlightNext() {
    clearKeyboardState();
    if (state.position >= state.target.length) {
      els.nextKey.textContent = "Texto concluído.";
      return;
    }
    var expected = state.target.charAt(state.position);
    var accent = ACCENT_MAP[expected];
    var base = accent ? accent.base : expected;
    var key = keyElement(base);
    var label = base === " " ? "espaço" : base;
    if (key) {
      key.classList.add("is-next");
      if (accent && accent.mark) {
        var badge = document.createElement("span");
        badge.className = "key-accent-badge";
        badge.textContent = accent.mark;
        key.appendChild(badge);
        var deadKey = keyElement(accent.mark);
        if (deadKey) deadKey.classList.add("is-next");
        label = accent.mark + " + " + base;
      }
    }
    var finger = FINGER_MAP[base] || "th";
    var fingerText = LEVEL_META[state.levelIndex].showFingers
      ? " — " + FINGER_NAMES[finger]
      : "";
    els.nextKey.textContent = "Próxima tecla: " + label + fingerText;
    els.fingerLegend.hidden = !LEVEL_META[state.levelIndex].showFingers;
  }

  function renderText() {
    els.textDisplay.innerHTML = "";
    var fragment = document.createDocumentFragment();
    var word = null;
    for (var i = 0; i < state.target.length; i++) {
      var ch = state.target.charAt(i);
      if (ch === " ") {
        word = null;
        var space = document.createElement("span");
        space.className = "char space";
        space.textContent = "\u00a0";
        fragment.appendChild(space);
        continue;
      }
      if (!word) {
        word = document.createElement("span");
        word.className = "word";
        fragment.appendChild(word);
      }
      var span = document.createElement("span");
      span.className = "char";
      span.textContent = ch;
      if (i < state.position) span.classList.add("is-done");
      if (i === state.position) span.classList.add("is-current");
      if (state.errorPositions.indexOf(i) !== -1) span.classList.add("is-error");
      if (i === state.position && state.wrongCurrent) span.classList.add("is-error");
      word.appendChild(span);
    }
    els.textDisplay.appendChild(fragment);
    els.srText.textContent = state.target;
  }

  function updateHud() {
    var ms = elapsed();
    var accuracy = state.attempts
      ? Math.round((state.correct / state.attempts) * 100)
      : 100;
    var ppm = ppmFor(state.correct, ms);
    els.hudPpm.textContent = String(ppm);
    els.hudAccuracy.textContent = accuracy + "%";
    els.hudTime.textContent = formatTime(ms);
    var pct = state.target.length
      ? Math.round((state.position / state.target.length) * 100)
      : 0;
    els.progressBar.style.width = pct + "%";
    els.progressText.textContent =
      state.position + " de " + state.target.length + " caracteres";
  }
```

- [ ] **Step 6: Verificar a sintaxe**

Run:

```powershell
node --check public/games/tecla-certa/game.js
```

Expected: sem saída e código de saída 0.

---

## Task 5: Implementar entrada, tempo, estrelas e fluxo

**Arquivos:**
- Modificar: `public/games/tecla-certa/game.js`

**Interfaces:**
- Consome: `state`, `els`, `THEMES`, `LEVEL_META`, `ACCENT_MAP`.
- Produz: `startLevel()`, `processText(text)`, `finishLevel()`, `nextLevel()`, `showFinal()`, `restartGame()`, `showLevelIntro()`.

- [ ] **Step 1: Implementar tempo e estrelas**

```js
  function elapsed() {
    return state.accumulatedMs + (state.running ? Date.now() - state.startedAt : 0);
  }

  function ppmFor(correct, ms) {
    var minutes = Math.max(ms, 1000) / 60000;
    return Math.round((correct / 5) / minutes);
  }

  function beginTimer() {
    if (state.running) return;
    state.running = true;
    state.startedAt = Date.now();
    state.timerId = window.setInterval(updateHud, 250);
    updateHud();
  }

  function pauseTimer() {
    if (!state.running) return;
    state.accumulatedMs += Date.now() - state.startedAt;
    state.running = false;
    state.startedAt = 0;
    if (state.timerId) {
      window.clearInterval(state.timerId);
      state.timerId = 0;
    }
  }

  function resetTimer() {
    pauseTimer();
    state.accumulatedMs = 0;
    state.startedAt = 0;
    state.running = false;
  }

  function starsFor(levelIndex, accuracy, ppm) {
    if (levelIndex === 0) {
      if (accuracy >= 95) return 3;
      if (accuracy >= 85) return 2;
      return 1;
    }
    if (levelIndex === 1) {
      if (accuracy >= 92 && ppm >= 10) return 3;
      if (accuracy >= 80 && ppm >= 7) return 2;
      return 1;
    }
    if (accuracy >= 90 && ppm >= 15) return 3;
    if (accuracy >= 80 && ppm >= 10) return 2;
    return 1;
  }
```

- [ ] **Step 2: Implementar o fluxo de telas**

```js
  function showLevelIntro() {
    var theme = THEMES[state.themeIndex];
    var meta = LEVEL_META[state.levelIndex];
    els.introDiscipline.textContent = theme.discipline;
    els.introTheme.textContent = theme.title;
    els.introLevel.textContent = meta.label;
    els.introHelp.textContent = meta.help;
    els.introGoals.textContent = meta.goals;
    els.introPreview.textContent = theme.levels[state.levelIndex];
    showScreen("intro");
    els.introStart.focus();
    announce(meta.label + ". " + theme.title + ". " + meta.help);
  }

  function startLevel() {
    var theme = THEMES[state.themeIndex];
    var meta = LEVEL_META[state.levelIndex];
    state.target = theme.levels[state.levelIndex];
    state.position = 0;
    state.correct = 0;
    state.attempts = 0;
    state.wrongCurrent = false;
    state.errorPositions = [];
    state.levelActive = true;
    resetTimer();
    els.playLevel.textContent = meta.label;
    els.playTheme.textContent = theme.title;
    els.hudPpm.textContent = "0";
    els.hudAccuracy.textContent = "100%";
    els.hudTime.textContent = "00:00";
    els.progressBar.style.width = "0%";
    els.pauseOverlay.hidden = true;
    renderText();
    showScreen("play");
    highlightNext();
    updateHud();
    focusInput();
    announce(meta.label + ". Digite: " + state.target);
  }

  function finishLevel() {
    state.levelActive = false;
    pauseTimer();
    var timeMs = elapsed();
    var accuracy = state.attempts
      ? Math.round((state.correct / state.attempts) * 100)
      : 100;
    var ppm = ppmFor(state.correct, timeMs);
    var stars = starsFor(state.levelIndex, accuracy, ppm);
    state.levelResults[state.levelIndex] = {
      level: state.levelIndex + 1,
      stars: stars,
      ppm: ppm,
      accuracy: accuracy,
      timeMs: timeMs
    };
    renderStars(els.levelResultStars, stars, 3);
    els.levelResultTitle.textContent =
      stars === 3 ? "Nível perfeito!" : stars === 2 ? "Bom trabalho!" : "Nível concluído!";
    els.levelResultMetrics.textContent =
      ppm + " PPM · " + accuracy + "% de precisão · " + formatTime(timeMs);
    els.levelNext.textContent =
      state.levelIndex < 2 ? "Próximo nível" : "Ver resultado";
    showScreen("level-result");
    els.levelNext.focus();
    announce(
      "Nível concluído. " + stars + " de 3 estrelas. Precisão de " +
      accuracy + " por cento. " + ppm + " palavras por minuto."
    );
  }

  function nextLevel() {
    if (state.levelIndex < 2) {
      state.levelIndex++;
      showLevelIntro();
    } else {
      showFinal();
    }
  }

  function renderStars(container, count, max) {
    container.innerHTML = "";
    container.setAttribute("aria-label", count + " de " + max + " estrelas");
    for (var i = 0; i < max; i++) {
      var star = document.createElement("span");
      star.className = "star" + (i < count ? " is-on" : "");
      star.textContent = i < count ? "★" : "☆";
      container.appendChild(star);
    }
  }

  function showFinal() {
    var total = 0;
    var body = els.finalTable.querySelector("tbody");
    body.innerHTML = "";
    for (var i = 0; i < state.levelResults.length; i++) {
      var result = state.levelResults[i];
      total += result.stars;
      var row = document.createElement("tr");
      row.innerHTML = "<td></td><td></td><td></td><td></td>";
      row.children[0].textContent = "Nível " + result.level;
      row.children[1].textContent = result.stars + " ★";
      row.children[2].textContent = result.ppm;
      row.children[3].textContent = result.accuracy + "%";
      body.appendChild(row);
    }
    renderStars(els.finalStars, total, 9);
    showScreen("final");
    els.finalAgain.focus();
    announce("Partida concluída. " + total + " de 9 estrelas.");
    sendFinish(total);
  }

  function restartGame() {
    state.levelIndex = 0;
    state.levelResults = [];
    state.sentFinish = false;
    showLevelIntro();
  }
```

- [ ] **Step 3: Implementar a entrada e a comparação**

```js
  function sameChar(typed, expected) {
    var a = typed;
    var b = expected;
    if (/[A-Za-zÀ-ÖØ-öø-ÿ]/.test(a) && /[A-Za-zÀ-ÖØ-öø-ÿ]/.test(b)) {
      return a.toUpperCase() === b.toUpperCase();
    }
    return a === b;
  }

  function isDeadKey(ch) {
    return "´`^~¨".indexOf(ch) !== -1;
  }

  function isAccentPrefix(ch, expected) {
    var accent = ACCENT_MAP[expected];
    return Boolean(accent && accent.mark && accent.mark === ch);
  }

  function processText(text) {
    if (state.screen !== "play" || !state.levelActive) return;
    if (!state.running) beginTimer();
    for (var i = 0; i < text.length; i++) {
      if (state.position >= state.target.length) break;
      var typed = text.charAt(i);
      var expected = state.target.charAt(state.position);
      if (isDeadKey(typed) && isAccentPrefix(typed, expected)) {
        els.nextKey.textContent = "Acento " + typed + " aguardando a letra.";
        continue;
      }
      state.attempts++;
      if (sameChar(typed, expected)) {
        state.correct++;
        state.position++;
        state.wrongCurrent = false;
      } else if (LEVEL_META[state.levelIndex].errorMode === "advance") {
        state.errorPositions.push(state.position);
        state.position++;
        state.wrongCurrent = false;
      } else {
        state.wrongCurrent = true;
      }
      pulseKey(typed);
      renderText();
      highlightNext();
      updateHud();
      if (state.position >= state.target.length) {
        finishLevel();
        return;
      }
    }
  }

  function pulseKey(ch) {
    var base = ch;
    if (/[a-z]/.test(base)) base = base.toUpperCase();
    var accent = ACCENT_MAP[base];
    if (accent) base = accent.base;
    var key = keyElement(base) || keyElement(ch);
    if (!key) return;
    key.classList.add("is-pressed");
    window.setTimeout(function () {
      key.classList.remove("is-pressed");
    }, 120);
  }

  function onInput() {
    if (state.composing) return;
    var value = els.input.value;
    els.input.value = "";
    if (value) processText(value);
  }

  function onCompositionStart() {
    state.composing = true;
  }

  function onCompositionEnd() {
    state.composing = false;
    window.setTimeout(function () {
      var value = els.input.value;
      els.input.value = "";
      if (value) processText(value);
    }, 0);
  }
```

- [ ] **Step 4: Implementar foco, pausa e eventos**

```js
  function focusInput() {
    try {
      els.input.focus({ preventScroll: true });
    } catch (error) {
      els.input.focus();
    }
  }

  function onInputBlur() {
    if (state.screen !== "play" || !state.levelActive) return;
    if (!state.running && state.accumulatedMs === 0) return;
    pauseTimer();
    state.paused = true;
    els.pauseOverlay.hidden = false;
    announce("Digitação pausada. Use o botão continuar para retomar.");
  }

  function resumeTyping() {
    state.paused = false;
    els.pauseOverlay.hidden = true;
    focusInput();
  }

  function bindEvents() {
    els.introStart.addEventListener("click", startLevel);
    els.introBack.addEventListener("click", function () {
      state.levelResults = [];
      showScreen("start");
    });
    els.levelNext.addEventListener("click", nextLevel);
    els.finalAgain.addEventListener("click", restartGame);
    els.finalTheme.addEventListener("click", function () {
      state.levelResults = [];
      state.sentFinish = false;
      showScreen("start");
    });
    els.resume.addEventListener("click", resumeTyping);
    els.textPanel.addEventListener("click", focusInput);
    els.mobileNoteClose.addEventListener("click", function () {
      state.mobileDismissed = true;
      els.mobileNote.hidden = true;
      reportHeight();
    });
    els.input.addEventListener("input", onInput);
    els.input.addEventListener("compositionstart", onCompositionStart);
    els.input.addEventListener("compositionend", onCompositionEnd);
    els.input.addEventListener("blur", onInputBlur);
    document.addEventListener("keydown", function (event) {
      if (state.screen === "play" && event.key === "Backspace") {
        event.preventDefault();
      }
    });
    window.addEventListener("resize", reportHeight);
    if ("ResizeObserver" in window) {
      new ResizeObserver(reportHeight).observe(document.body);
    }
  }
```

- [ ] **Step 5: Testar o nível 1**

Run `npm run dev`, abrir `/jogo/tecla-certa`, escolher Biomas e digitar `MATA CAMPO LAGO SERRA DUNAS RIO`.

Expected:
- O cronômetro começa na primeira letra.
- A tecla destacada muda a cada caractere.
- Ao terminar, a tela de resultado mostra pelo menos 1 estrela.
- “Próximo nível” leva ao nível 2.

- [ ] **Step 6: Testar erro e acento**

No nível 1, apertar `X` no lugar de `M`.

Expected: o cursor não avança e aparece sublinhado; ao apertar `M`, continua.

No nível 2 de Biomas, digitar `AMAZÔNIA` com acento.

Expected: o teclado destaca `´` + `A`; a composição aceita `Ô`; a precisão não cai por causa do acento.

---

## Task 6: Integrar com o portal e finalizar

**Arquivos:**
- Modificar: `public/games/tecla-certa/game.js`
- Modificar: `README.md`

**Interfaces:**
- Consome: `state`, `els`.
- Produz: `sendFinish(total)`, `reportHeight()`, `applyTheme(theme)`, `preferredTheme()`, `init()`.

- [ ] **Step 1: Implementar as mensagens do portal**

```js
  function sendFinish(totalStars) {
    if (state.sentFinish) return;
    state.sentFinish = true;
    var totalTime = 0;
    for (var i = 0; i < state.levelResults.length; i++) {
      totalTime += state.levelResults[i].timeMs;
    }
    window.parent.postMessage(
      {
        type: "vrgame:finish",
        score: totalStars,
        maxScore: 9,
        timeMs: totalTime,
        detail: {
          theme: THEMES[state.themeIndex].id,
          levels: state.levelResults
        }
      },
      "*"
    );
  }

  function reportHeight() {
    var height = Math.ceil(document.body.getBoundingClientRect().height);
    if (Math.abs(height - state.lastHeight) < 4) return;
    state.lastHeight = height;
    window.parent.postMessage({ type: "vrgame:resize", height: height }, "*");
  }

  function applyTheme(theme) {
    if (theme === "dark" || theme === "light") {
      document.documentElement.dataset.theme = theme;
    }
  }

  function preferredTheme() {
    try {
      var fromQuery = new URLSearchParams(window.location.search).get("theme");
      if (fromQuery === "dark" || fromQuery === "light") return fromQuery;
    } catch (error) {}
    try {
      var saved = window.localStorage.getItem("theme");
      if (saved === "dark" || saved === "light") return saved;
    } catch (error) {}
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function onMessage(event) {
    if (!event.data) return;
    if (event.data.type === "vrgame:theme") {
      applyTheme(event.data.theme);
    }
    if (event.data.type === "vrgame:fullscreen") {
      document.documentElement.classList.toggle(
        "is-fullscreen",
        Boolean(event.data.fullscreen)
      );
      window.requestAnimationFrame(reportHeight);
    }
  }

  var mobileQuery = window.matchMedia("(max-width: 720px)");

  function syncMobileNote() {
    els.mobileNote.hidden = state.mobileDismissed || !mobileQuery.matches;
  }

  function init() {
    if (THEMES.length !== 4 || THEMES.some(function (theme) {
      return !theme.levels || theme.levels.length !== 3;
    })) {
      els.themeGrid.textContent = "Conteúdo indisponível.";
      return;
    }
    renderThemes();
    buildKeyboard();
    bindEvents();
    applyTheme(preferredTheme());
    if (window.self === window.top) {
      document.documentElement.classList.add("is-standalone");
    }
    syncMobileNote();
    if (mobileQuery.addEventListener) {
      mobileQuery.addEventListener("change", syncMobileNote);
    }
    window.addEventListener("message", onMessage);
    showScreen("start");
    window.parent.postMessage({ type: "vrgame:ready" }, "*");
    window.requestAnimationFrame(reportHeight);
  }

  init();
})();
```

- [ ] **Step 2: Conferir a sintaxe e o build**

Run:

```powershell
node --check public/games/tecla-certa/game.js
npm run build
```

Expected: sem erro; `[sync-games] 3 jogo(s) no catálogo.` e build do Vite concluído.

- [ ] **Step 3: Testar a partida completa no navegador**

Subir o servidor em segundo plano:

```powershell
npm run dev
```

Usar a skill `agent-browser` para abrir `http://localhost:5173/jogo/tecla-certa` e:

1. Escolher “Biomas do Brasil”.
2. Digitar o nível 1 completo.
3. Avançar e digitar o nível 2, incluindo `AMAZÔNIA` e `MATA ATLÂNTICA`.
4. Avançar e digitar o nível 3, incluindo `É` e o ponto final.
5. Conferir a tela final com 3 linhas e 9 estrelas possíveis.

Expected: a barra do portal mostra “Partida concluída” e a pontuação.

- [ ] **Step 4: Verificar o `vrgame:finish`**

No console do navegador, antes de concluir, adicionar um listener:

```js
window.addEventListener("message", function (event) {
  if (event.data && event.data.type === "vrgame:finish") {
    console.log("FINISH", JSON.stringify(event.data));
  }
});
```

Expected: um objeto com `score` entre 3 e 9, `maxScore: 9`, `timeMs` maior que zero e `detail.levels` com três itens.

- [ ] **Step 5: Testar responsivo, tema e acessibilidade**

- Viewport 375×667: aviso de celular visível, teclado virtual oculto, chip da próxima tecla visível, sem rolagem horizontal.
- Tema escuro pelo botão do portal: contraste mantido.
- Tela cheia: texto e teclado maiores.
- Navegação só com Tab e Enter: todos os botões alcançáveis.
- Perder o foco durante o nível: camada de pausa aparece e o tempo para.
- `prefers-reduced-motion`: sem pulsação no teclado.

- [ ] **Step 6: Atualizar o README**

Na seção “Estrutura”, garantir:

```text
    caca-palavras/     jogo publicado
    palavra-do-dia/    jogo publicado
    tecla-certa/       jogo publicado
    _template/         pasta-modelo para os estudantes
```

- [ ] **Step 7: Build final**

Run:

```powershell
npm run build
```

Expected: catálogo com 3 jogos e `dist/games/tecla-certa/` presente.

---

## Autoverificação do plano

- Cobertura da spec: identidade, níveis, conteúdo, teclado, métricas, estrelas, acessibilidade, responsivo, integração e testes estão nas Tasks 1–6.
- Sem placeholders: todos os dados, limiares e nomes de funções estão definidos.
- Consistência: `state`, `els`, `THEMES`, `LEVEL_META`, `FINGER_MAP`, `ACCENT_MAP`, `starsFor`, `ppmFor`, `sendFinish` são usados com os mesmos nomes nas tarefas seguintes.
