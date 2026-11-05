/*
 * TECLA CERTA — Jogos VR
 * ----------------------
 * Jogo de digitação com quatro temas e três níveis.
 * Sem bibliotecas, sem internet e sem coleta de dados.
 */
(function () {
  "use strict";

  var GROUPS = [
    { key: "linguagens", label: "Linguagens" },
    { key: "natureza", label: "Ciências da Natureza" },
    { key: "humanas", label: "Ciências Humanas" },
    { key: "exatas", label: "Matemática e Tecnologia" }
  ];

  var THEMES = [
    {
      id: "biomas",
      title: "Biomas do Brasil",
      discipline: "Geografia",
      group: "humanas",
      blurb: "Paisagens, climas e águas do país.",
      accent: "#15803d",
      accentDark: "#4ade80",
      tint: "#e8f5ec",
      tintDark: "#14311f",
      seal: "leaf",
      levels: [
        ["MATA CAMPO LAGO SERRA DUNAS RIO", "FLORA FAUNA RIO MAR SERRA DUNA"],
        ["CERRADO CAATINGA PANTANAL AMAZÔNIA PAMPA MATA ATLÂNTICA", "CAATINGA CERRADO PANTANAL PAMPA FLORESTA MANGUEZAL"],
        ["O CERRADO É O BERÇO DAS ÁGUAS DO BRASIL.", "A AMAZÔNIA É A MAIOR FLORESTA TROPICAL."],
        ["O CERRADO É O BERÇO DAS ÁGUAS. A AMAZÔNIA ABRIGA MILHÕES DE ESPÉCIES.", "A CAATINGA RESISTE À SECA. O PANTANAL É A MAIOR PLANÍCIE ALAGADA."]
      ]
    },
    {
      id: "corpo-humano",
      title: "Corpo Humano",
      discipline: "Ciências",
      group: "natureza",
      blurb: "Órgãos, sistemas e funções do corpo.",
      accent: "#b91c1c",
      accentDark: "#f87171",
      tint: "#fdeaea",
      tintDark: "#3a1a1a",
      seal: "heart",
      levels: [
        ["OSSO PELE SANGUE NARIZ OUVIDO OLHO", "DENTE UNHA PELE OLHO BOCA OSSO"],
        ["CORAÇÃO PULMÃO FÍGADO CÉREBRO ESTÔMAGO INTESTINO", "RIM BAÇO PÂNCREAS ESÔFAGO TRAQUEIA VEIA"],
        ["O CORAÇÃO BOMBEIA O SANGUE PARA TODO O CORPO.", "OS PULMÕES TROCAM OXIGÊNIO POR GÁS CARBÔNICO."],
        ["O CORAÇÃO BOMBEIA O SANGUE. OS PULMÕES TROCAM GASES COM O AR.", "O CÉREBRO CONTROLA O CORPO. O FÍGADO FILTRA O SANGUE."]
      ]
    },
    {
      id: "historia-brasil",
      title: "História do Brasil",
      discipline: "História",
      group: "humanas",
      blurb: "Colônia, império e república.",
      accent: "#b45309",
      accentDark: "#fbbf24",
      tint: "#fdf3e3",
      tintDark: "#3a2a14",
      seal: "crown",
      levels: [
        ["REI LEI OURO NAVIO CARTA POVO", "BRASIL PAÍS REI OURO LEI NAVIO"],
        ["COLÔNIA IMPÉRIO ABOLIÇÃO REPÚBLICA CARAVELA MONARQUIA", "CABRAL BRASIL COLÔNIA INDEPENDÊNCIA IMPÉRIO REPÚBLICA"],
        ["A ABOLIÇÃO ACONTECEU EM 1888.", "O BRASIL FOI COLONIZADO POR PORTUGAL."],
        ["A ABOLIÇÃO ACONTECEU EM 1888. A REPÚBLICA COMEÇOU EM 1889.", "O BRASIL FOI COLONIZADO POR PORTUGAL. A INDEPENDÊNCIA VEIO EM 1822."]
      ]
    },
    {
      id: "lingua-portuguesa",
      title: "Língua Portuguesa",
      discipline: "Português",
      group: "linguagens",
      blurb: "Acentuação, ortografia e pontuação.",
      accent: "#1d4ed8",
      accentDark: "#93c5fd",
      tint: "#e8effd",
      tintDark: "#1a2a4a",
      seal: "pen",
      levels: [
        ["SALA LIVRO CARTA TEXTO FRASE CONTO", "PENA LÁPIS TINTA PAPEL LIVRO TEXTO"],
        ["ACENTUAÇÃO ORTOGRAFIA PONTUAÇÃO SÍLABA PARÁGRAFO CRASE", "SUBSTANTIVO VERBO ADJETIVO CONCORDÂNCIA REGÊNCIA CRASE"],
        ["A ACENTUAÇÃO MUDA O SENTIDO DAS PALAVRAS.", "A PONTUAÇÃO ORGANIZA AS IDEIAS DO TEXTO."],
        ["A ACENTUAÇÃO MUDA O SENTIDO. A PONTUAÇÃO ORGANIZA AS IDEIAS.", "A CRASE INDICA FUSÃO DE PREPOSIÇÃO. A ORTOGRAFIA SEGUE REGRAS."]
      ]
    },
    {
      id: "sistema-solar",
      title: "Sistema Solar",
      discipline: "Ciências",
      group: "natureza",
      blurb: "Planetas, luas e estrelas do sistema solar.",
      accent: "#6d28d9",
      accentDark: "#c4b5fd",
      tint: "#efe9fd",
      tintDark: "#2a1f4a",
      seal: "solar",
      levels: [
        ["SOL LUA MARTE TERRA COMETA ÓRBITA", "VÊNUS JÚPITER SATURNO NETUNO URANO"],
        ["JÚPITER SATURNO MERCÚRIO VÊNUS NETUNO ASTEROIDE", "GALÁXIA CONSTELAÇÃO METEORO GRAVIDADE ECLIPSE ÓRBITA"],
        ["A TERRA GIRA EM TORNO DO SOL.", "O SOL É A ESTRELA MAIS PRÓXIMA DA TERRA."],
        ["A TERRA GIRA EM TORNO DO SOL. A LUA É O NOSSO SATÉLITE.", "O SOL É UMA ESTRELA. JÚPITER É O MAIOR PLANETA."]
      ]
    },
    {
      id: "matematica",
      title: "Matemática",
      discipline: "Matemática",
      group: "exatas",
      blurb: "Números, formas e operações básicas.",
      accent: "#0f766e",
      accentDark: "#5eead4",
      tint: "#e6f5f3",
      tintDark: "#14332f",
      seal: "math",
      levels: [
        ["SOMA DOIS METADE METRO RETO EIXO", "MAIS MENOS VEZES DIVIDE QUARTO CUBO"],
        ["FRAÇÃO ÂNGULO PERÍMETRO EQUAÇÃO VÉRTICE DIAGONAL", "RETÂNGULO TRIÂNGULO CÍRCULO QUADRADO PENTÁGONO HEXÁGONO"],
        ["A SOMA DOS ÂNGULOS INTERNOS DO TRIÂNGULO É CONSTANTE.", "A ÁREA DO RETÂNGULO É BASE VEZES ALTURA."],
        ["A SOMA DOS ÂNGULOS É 180 GRAUS. A ÁREA É BASE VEZES ALTURA.", "A FRAÇÃO REPRESENTA PARTES. O PERÍMETRO É A SOMA DOS LADOS."]
      ]
    },
    {
      id: "geografia-mundo",
      title: "Geografia do Mundo",
      discipline: "Geografia",
      group: "humanas",
      blurb: "Continentes, oceanos e países.",
      accent: "#0e7490",
      accentDark: "#67e8f9",
      tint: "#e5f5f8",
      tintDark: "#10303a",
      seal: "globe",
      levels: [
        ["MAPA MAR POLO EIXO FUSO GLOBO", "PAÍS CIDADE RIO MAR SERRA LAGO"],
        ["CONTINENTE OCEANO EUROPA ÁSIA ÁFRICA OCEANIA", "AMÉRICA ANTÁRTIDA ATLÂNTICO PACÍFICO ÍNDICO MEDITERRÂNEO"],
        ["O GLOBO TERRESTRE TEM CINCO OCEANOS.", "A LINHA DO EQUADOR DIVIDE A TERRA EM DOIS HEMISFÉRIOS."],
        ["O GLOBO TEM CINCO OCEANOS. A LINHA DO EQUADOR DIVIDE A TERRA.", "OS CONTINENTES SÃO SETE. O PACÍFICO É O MAIOR OCEANO."]
      ]
    },
    {
      id: "tecnologia",
      title: "Tecnologia",
      discipline: "Tecnologia",
      group: "exatas",
      blurb: "Computadores, internet e segurança digital.",
      accent: "#334155",
      accentDark: "#cbd5e1",
      tint: "#eef1f5",
      tintDark: "#1f2630",
      seal: "chip",
      levels: [
        ["DADO REDE SITE LOGIN SENHA NUVEM", "MOUSE TECLA TELA CABO WIFI ROTEADOR"],
        ["INTERNET COMPUTADOR SEGURANÇA ARQUIVO PROGRAMA BINÁRIO", "ALGORITMO SOFTWARE HARDWARE NAVEGADOR SENHA CRIPTOGRAFIA"],
        ["A SENHA FORTE PROTEGE SEUS DADOS PESSOAIS.", "A INTERNET CONECTA PESSOAS EM TODO O MUNDO."],
        ["A SENHA FORTE PROTEGE DADOS. A INTERNET CONECTA PESSOAS.", "O COMPUTADOR PROCESSA INFORMAÇÕES. A REDE LIGA MÁQUINAS."]
      ]
    },
    {
      id: "arte-cultura",
      title: "Arte e Cultura",
      discipline: "Arte",
      group: "linguagens",
      blurb: "Música, artes visuais e expressão.",
      accent: "#be185d",
      accentDark: "#f9a8d4",
      tint: "#fce8f0",
      tintDark: "#3a1a2a",
      seal: "palette",
      levels: [
        ["ARTE COR SOM PALCO RITMO CENA", "PINTURA CANTO PALCO MUSEU FOTO VÍDEO"],
        ["PINTURA ESCULTURA MÚSICA TEATRO POESIA FOTOGRAFIA", "BALLET CINEMA LITERATURA ARQUITETURA DANÇA ÓPERA"],
        ["A ARTE TRANSFORMA O MUNDO EM IMAGEM.", "A MÚSICA UNE PESSOAS DE DIFERENTES CULTURAS."],
        ["A ARTE TRANSFORMA O MUNDO. A MÚSICA UNE CULTURAS.", "A PINTURA EXPRESSA EMOÇÕES. O TEATRO CONTA HISTÓRIAS."]
      ]
    },
    {
      id: "ingles",
      title: "Inglês",
      discipline: "Inglês",
      group: "linguagens",
      blurb: "Vocabulário e frases em inglês.",
      accent: "#4338ca",
      accentDark: "#a5b4fc",
      tint: "#ebeafd",
      tintDark: "#201f4a",
      seal: "speech",
      levels: [
        ["BOOK HOUSE WATER MUSIC HAPPY NIGHT", "FRIEND SCHOOL FAMILY COMPUTER COUNTRY SMILE"],
        ["SCHOOL FAMILY FRIEND COMPUTER COUNTRY BEAUTIFUL", "LANGUAGE STUDENT TEACHER LIBRARY QUESTION ANSWER"],
        ["LEARNING A NEW LANGUAGE OPENS MANY DOORS.", "PRACTICE MAKES PERFECT EVERY SINGLE DAY."],
        ["LEARNING A NEW LANGUAGE OPENS DOORS. PRACTICE MAKES PERFECT.", "ENGLISH IS SPOKEN WORLDWIDE. READING IMPROVES VOCABULARY."]
      ]
    }
  ];

  var SEALS = {
    leaf: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M12 36 C12 20 22 10 36 8 C34 22 24 34 12 36 Z" fill="currentColor" opacity=".16"/><path d="M12 36 C12 20 22 10 36 8" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M16 32 C22 26 28 20 34 12" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>',
    heart: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 40 C10 30 8 18 14 14 C19 11 23 14 24 18 C25 14 29 11 34 14 C40 18 38 30 24 40 Z" fill="currentColor" opacity=".16"/><path d="M24 40 C10 30 8 18 14 14 C19 11 23 14 24 18 C25 14 29 11 34 14 C40 18 38 30 24 40 Z" stroke="currentColor" stroke-width="2.5" fill="none"/></svg>',
    crown: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 34 H38 M12 34 L16 18 L24 26 L32 18 L36 34" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linejoin="round"/><circle cx="16" cy="16" r="2" fill="currentColor"/><circle cx="24" cy="24" r="2" fill="currentColor"/><circle cx="32" cy="16" r="2" fill="currentColor"/></svg>',
    pen: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M14 34 L34 14 L38 18 L18 38 L14 34 Z" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linejoin="round"/><path d="M34 14 L38 10 L42 14 L38 18" stroke="currentColor" stroke-width="2.5" fill="none"/><path d="M14 34 L10 40 L18 38" stroke="currentColor" stroke-width="2.5" fill="none"/></svg>',
    solar: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="8" fill="currentColor" opacity=".16"/><circle cx="24" cy="24" r="8" stroke="currentColor" stroke-width="2.5" fill="none"/><ellipse cx="24" cy="24" rx="20" ry="8" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="40" cy="20" r="3" fill="currentColor"/></svg>',
    math: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="8" y="8" width="12" height="12" stroke="currentColor" stroke-width="2.5" fill="none"/><circle cx="34" cy="14" r="6" stroke="currentColor" stroke-width="2.5" fill="none"/><path d="M14 38 L24 24 L34 38 Z" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linejoin="round"/></svg>',
    globe: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="16" stroke="currentColor" stroke-width="2.5" fill="none"/><ellipse cx="24" cy="24" rx="8" ry="16" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M8 24 H40" stroke="currentColor" stroke-width="1.5"/><path d="M10 16 H38 M10 32 H38" stroke="currentColor" stroke-width="1" opacity=".6"/></svg>',
    chip: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="14" y="14" width="20" height="20" rx="3" stroke="currentColor" stroke-width="2.5" fill="none"/><rect x="18" y="18" width="12" height="12" fill="currentColor" opacity=".16"/><path d="M18 10 V14 M24 10 V14 M30 10 V14 M18 34 V38 M24 34 V38 M30 34 V38 M10 18 H14 M10 24 H14 M10 30 H14 M34 18 H38 M34 24 H38 M34 30 H38" stroke="currentColor" stroke-width="2"/></svg>',
    palette: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 8 C14 8 8 16 8 24 C8 32 14 38 22 38 C26 38 28 36 28 33 C28 30 26 29 24 29 C22 29 21 27 21 25 C21 22 24 20 28 20 C34 20 40 16 40 12 C40 9 32 8 24 8 Z" stroke="currentColor" stroke-width="2.5" fill="none"/><circle cx="16" cy="20" r="2" fill="currentColor"/><circle cx="22" cy="14" r="2" fill="currentColor"/><circle cx="30" cy="14" r="2" fill="currentColor"/><circle cx="34" cy="20" r="2" fill="currentColor"/></svg>',
    speech: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 12 H40 V30 H26 L20 38 V30 H8 Z" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linejoin="round"/><text x="24" y="25" text-anchor="middle" font-family="Georgia, serif" font-size="13" font-weight="700" fill="currentColor">EN</text></svg>'
  };

  var LEVEL_META = [
    {
      label: "Nível 1 de 4",
      title: "Aquecimento",
      help: "Palavras curtas, com acentuação básica. A letra errada não avança.",
      goals: "3 estrelas: 95% de precisão · 2 estrelas: 85%",
      errorMode: "block",
      showFingers: true
    },
    {
      label: "Nível 2 de 4",
      title: "Acentos e ç",
      help: "Palavras médias com acento e ç. A letra errada não avança.",
      goals: "3 estrelas: 92% + 10 PPM · 2 estrelas: 80% + 7 PPM",
      errorMode: "block",
      showFingers: true
    },
    {
      label: "Nível 3 de 4",
      title: "Frase completa",
      help: "Uma frase do tema. O erro conta e o texto segue.",
      goals: "3 estrelas: 90% + 15 PPM · 2 estrelas: 80% + 10 PPM",
      errorMode: "advance",
      showFingers: false
    },
    {
      label: "Nível 4 de 4",
      title: "Texto longo",
      help: "Duas frases do tema. O erro conta e o texto segue.",
      goals: "3 estrelas: 92% + 18 PPM · 2 estrelas: 82% + 12 PPM",
      errorMode: "advance",
      showFingers: false
    }
  ];

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
    "Á": { base: "A", mark: "´" },
    "À": { base: "A", mark: "`" },
    "Â": { base: "A", mark: "^" },
    "Ã": { base: "A", mark: "~" },
    "Ä": { base: "A", mark: "¨" },
    "É": { base: "E", mark: "´" },
    "È": { base: "E", mark: "`" },
    "Ê": { base: "E", mark: "^" },
    "Ë": { base: "E", mark: "¨" },
    "Í": { base: "I", mark: "´" },
    "Ì": { base: "I", mark: "`" },
    "Î": { base: "I", mark: "^" },
    "Ï": { base: "I", mark: "¨" },
    "Ó": { base: "O", mark: "´" },
    "Ò": { base: "O", mark: "`" },
    "Ô": { base: "O", mark: "^" },
    "Õ": { base: "O", mark: "~" },
    "Ö": { base: "O", mark: "¨" },
    "Ú": { base: "U", mark: "´" },
    "Ù": { base: "U", mark: "`" },
    "Û": { base: "U", mark: "^" },
    "Ü": { base: "U", mark: "¨" },
    "Ç": { base: "Ç", mark: null }
  };

  var state = {
    screen: "start",
    themeIndex: 0,
    levelIndex: 0,
    textIndex: 0,
    target: "",
    position: 0,
    correct: 0,
    attempts: 0,
    startedAt: 0,
    accumulatedMs: 0,
    running: false,
    composing: false,
    levelActive: false,
    paused: false,
    mobileDismissed: false,
    wrongCurrent: false,
    errorPositions: [],
    lastVariant: {},
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
    themeGroups: document.getElementById("theme-groups"),
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
    miniKeyboard: document.getElementById("mini-keyboard"),
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
      name === "start" ? "10 temas · 4 níveis" : "Digitação";
    window.requestAnimationFrame(reportHeight);
  }

  function themeCard(theme, index) {
    var card = document.createElement("button");
    card.type = "button";
    card.className = "theme-card";
    card.setAttribute("data-theme-index", String(index));
    card.style.setProperty("--accent", theme.accent);
    card.style.setProperty("--accent-dark", theme.accentDark);
    card.style.setProperty("--tint", theme.tint);
    card.style.setProperty("--tint-dark", theme.tintDark);
    card.innerHTML =
      '<span class="theme-emblem">' + (SEALS[theme.seal] || "") + "</span>" +
      '<span class="theme-copy">' +
      '<span class="theme-discipline"></span>' +
      '<span class="theme-title"></span>' +
      '<span class="theme-blurb"></span>' +
      "</span>" +
      '<span class="theme-meta">' +
      '<span class="theme-levels">N1 · N2 · N3 · N4</span>' +
      '<span class="theme-go">Jogar →</span>' +
      "</span>";
    card.querySelector(".theme-discipline").textContent = theme.discipline;
    card.querySelector(".theme-title").textContent = theme.title;
    card.querySelector(".theme-blurb").textContent = theme.blurb;
    card.addEventListener("click", function () {
      selectTheme(index);
    });
    return card;
  }

  function renderThemes() {
    els.themeGroups.innerHTML = "";
    var fragment = document.createDocumentFragment();
    for (var g = 0; g < GROUPS.length; g++) {
      var group = GROUPS[g];
      var groupThemes = THEMES.filter(function (theme) {
        return theme.group === group.key;
      });
      if (!groupThemes.length) continue;

      var section = document.createElement("section");
      section.className = "theme-group";
      section.setAttribute("aria-labelledby", "group-" + group.key);

      var head = document.createElement("div");
      head.className = "theme-group-head";
      var title = document.createElement("h3");
      title.id = "group-" + group.key;
      title.textContent = group.label;
      var count = document.createElement("span");
      count.className = "theme-group-count";
      count.textContent = groupThemes.length + " tema" + (groupThemes.length > 1 ? "s" : "");
      head.appendChild(title);
      head.appendChild(count);
      section.appendChild(head);

      var grid = document.createElement("div");
      grid.className = "theme-group-grid";
      for (var i = 0; i < groupThemes.length; i++) {
        var theme = groupThemes[i];
        var globalIndex = THEMES.indexOf(theme);
        grid.appendChild(themeCard(theme, globalIndex));
      }
      section.appendChild(grid);
      fragment.appendChild(section);
    }
    els.themeGroups.appendChild(fragment);
  }

  function selectTheme(index) {
    state.themeIndex = index;
    state.levelIndex = 0;
    state.levelResults = [];
    state.sentFinish = false;
    state.errorPositions = [];
    showLevelIntro();
  }

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
        key.style.setProperty(
          "--finger",
          "var(--finger-" + (FINGER_MAP[ch] || "th") + ")"
        );
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

  function buildMiniKeyboard() {
    if (!els.miniKeyboard) return;
    var rows = [
      ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
      ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
      ["Z", "X", "C", "V", "B", "N", "M"]
    ];
    els.miniKeyboard.innerHTML = "";
    for (var r = 0; r < rows.length; r++) {
      var row = document.createElement("div");
      row.className = "mini-row";
      for (var k = 0; k < rows[r].length; k++) {
        var ch = rows[r][k];
        var key = document.createElement("span");
        key.className = "mk mk-" + (FINGER_MAP[ch] || "th");
        if (ch === "F") key.classList.add("is-next");
        key.textContent = ch;
        row.appendChild(key);
      }
      els.miniKeyboard.appendChild(row);
    }
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
    els.fingerLegend.classList.toggle(
      "is-compact",
      state.levelIndex === 1
    );
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
        if (i < state.position) space.classList.add("is-done");
        if (i === state.position) space.classList.add("is-current");
        if (
          state.errorPositions.indexOf(i) !== -1 ||
          (i === state.position && state.wrongCurrent)
        ) {
          space.classList.add("is-error");
        }
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
      if (i === state.position && state.wrongCurrent) {
        span.classList.add("is-error");
      }
      word.appendChild(span);
    }

    els.textDisplay.appendChild(fragment);
    els.srText.textContent = state.target;
  }

  function elapsed() {
    return (
      state.accumulatedMs +
      (state.running ? Date.now() - state.startedAt : 0)
    );
  }

  function ppmFor(correct, ms) {
    var minutes = Math.max(ms, 1000) / 60000;
    return Math.round(correct / 5 / minutes);
  }

  function updateHud() {
    var ms = elapsed();
    var accuracy = state.attempts
      ? Math.round((state.correct / state.attempts) * 100)
      : 100;
    els.hudPpm.textContent = String(ppmFor(state.correct, ms));
    els.hudAccuracy.textContent = accuracy + "%";
    els.hudTime.textContent = formatTime(ms);

    var pct = state.target.length
      ? Math.round((state.position / state.target.length) * 100)
      : 0;
    els.progressBar.style.width = pct + "%";
    els.progressText.textContent =
      state.position + " de " + state.target.length + " caracteres";
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
    if (levelIndex === 2) {
      if (accuracy >= 90 && ppm >= 15) return 3;
      if (accuracy >= 80 && ppm >= 10) return 2;
      return 1;
    }
    if (accuracy >= 92 && ppm >= 18) return 3;
    if (accuracy >= 82 && ppm >= 12) return 2;
    return 1;
  }

  function showLevelIntro() {
    var theme = THEMES[state.themeIndex];
    var meta = LEVEL_META[state.levelIndex];
    var variants = theme.levels[state.levelIndex];
    var key = state.themeIndex + "_" + state.levelIndex;
    var previous = state.lastVariant[key];
    var nextIndex = 0;
    if (variants.length > 1) {
      nextIndex = Math.floor(Math.random() * variants.length);
      if (previous !== undefined && nextIndex === previous) {
        nextIndex = (nextIndex + 1) % variants.length;
      }
    }
    state.textIndex = nextIndex;
    state.lastVariant[key] = nextIndex;
    els.introDiscipline.textContent = theme.discipline;
    els.introTheme.textContent = theme.title;
    els.introLevel.textContent = meta.label + " · " + meta.title;
    els.introHelp.textContent = meta.help;
    els.introGoals.textContent = meta.goals;
    els.introPreview.textContent = variants[nextIndex];
    showScreen("intro");
    els.introStart.focus();
    announce(meta.label + ". " + theme.title + ". " + meta.help);
  }

  function startLevel() {
    var theme = THEMES[state.themeIndex];
    var meta = LEVEL_META[state.levelIndex];
    state.target = theme.levels[state.levelIndex][state.textIndex];
    state.position = 0;
    state.correct = 0;
    state.attempts = 0;
    state.wrongCurrent = false;
    state.errorPositions = [];
    state.levelActive = true;
    state.paused = false;
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
      timeMs: timeMs,
      correct: state.correct,
      attempts: state.attempts
    };

    renderStars(els.levelResultStars, stars, 3);
    els.levelResultTitle.textContent =
      stars === 3
        ? "Nível perfeito!"
        : stars === 2
          ? "Bom trabalho!"
          : "Nível concluído!";
    els.levelResultMetrics.textContent =
      ppm + " PPM · " + accuracy + "% de precisão · " + formatTime(timeMs);
    els.levelNext.textContent =
      state.levelIndex < 3 ? "Próximo nível" : "Ver resultado";
    showScreen("level-result");
    els.levelNext.focus();
    announce(
      "Nível concluído. " +
        stars +
        " de 3 estrelas. Precisão de " +
        accuracy +
        " por cento. " +
        ppm +
        " palavras por minuto."
    );
  }

  function nextLevel() {
    if (state.levelIndex < 3) {
      state.levelIndex++;
      showLevelIntro();
    } else {
      showFinal();
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
      row.children[2].textContent = String(result.ppm);
      row.children[3].textContent = result.accuracy + "%";
      body.appendChild(row);
    }

    renderStars(els.finalStars, total, 12);
    showScreen("final");
    els.finalAgain.focus();
    announce("Partida concluída. " + total + " de 12 estrelas.");
    sendFinish(total);
  }

  function restartGame() {
    state.levelIndex = 0;
    state.levelResults = [];
    state.sentFinish = false;
    notifyRestart();
    showLevelIntro();
  }

  function notifyRestart() {
    window.parent.postMessage({ type: "vrgame:restart" }, "*");
  }

  function sameChar(typed, expected) {
    var a = typed;
    var b = expected;
    if (
      /[A-Za-zÀ-ÖØ-öø-ÿ]/.test(a) &&
      /[A-Za-zÀ-ÖØ-öø-ÿ]/.test(b)
    ) {
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
        announce(
          "Erro. A tecla certa era " +
            (expected === " " ? "espaço" : expected) +
            "."
        );
      } else {
        state.wrongCurrent = true;
        announce(
          "Tecla errada. A tecla certa é " +
            (expected === " " ? "espaço" : expected) +
            "."
        );
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
    if (base.toUpperCase() !== base) base = base.toUpperCase();
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

  function focusInput() {
    try {
      els.input.focus({ preventScroll: true });
    } catch (error) {
      els.input.focus();
    }
  }

  function onInputBlur() {
    state.composing = false;
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
      notifyRestart();
      showScreen("start");
    });
    els.levelNext.addEventListener("click", nextLevel);
    els.finalAgain.addEventListener("click", restartGame);
    els.finalTheme.addEventListener("click", function () {
      state.levelResults = [];
      state.sentFinish = false;
      notifyRestart();
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
    els.input.addEventListener("paste", function (event) {
      event.preventDefault();
    });
    els.input.addEventListener("drop", function (event) {
      event.preventDefault();
    });

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

  function sendFinish(totalStars) {
    if (state.sentFinish) return;
    state.sentFinish = true;

    var totalTime = 0;
    var totalCorrect = 0;
    var totalAttempts = 0;
    for (var i = 0; i < state.levelResults.length; i++) {
      totalTime += state.levelResults[i].timeMs;
      totalCorrect += state.levelResults[i].correct;
      totalAttempts += state.levelResults[i].attempts;
    }

    var totalAccuracy = totalAttempts
      ? Math.round((totalCorrect / totalAttempts) * 100)
      : 100;

    window.parent.postMessage(
      {
        type: "vrgame:finish",
        score: totalStars,
        maxScore: 12,
        timeMs: totalTime,
        detail: {
          theme: THEMES[state.themeIndex].id,
          ppm: ppmFor(totalCorrect, totalTime),
          accuracy: totalAccuracy,
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
    } catch (error) {
      // URLSearchParams indisponível: segue para a próxima opção
    }

    try {
      var saved = window.localStorage.getItem("theme");
      if (saved === "dark" || saved === "light") return saved;
    } catch (error) {
      // armazenamento bloqueado: usa a preferência do sistema
    }

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
    if (
      THEMES.length !== 10 ||
      THEMES.some(function (theme) {
        return !theme.levels || theme.levels.length !== 4 || theme.levels.some(function (level) { return !Array.isArray(level) || level.length !== 2; });
      })
    ) {
      els.themeGroups.textContent = "Conteúdo indisponível.";
      showScreen("start");
      window.parent.postMessage({ type: "vrgame:ready" }, "*");
      window.requestAnimationFrame(reportHeight);
      return;
    }

    renderThemes();
    buildKeyboard();
    buildMiniKeyboard();
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
