/*
 * BATALHA DE CANHÕES — versão 2.0 (modernizada)
 * ---------------------------------------------
 * Remake educativo inspirado no clássico "Bang! Bang!" (anos 90).
 * Duelo de artilharia em turnos com armas especiais, três dificuldades,
 * sistema de pontuação e visual cartoon moderno.
 *
 * Contrato com o portal (não remover):
 *   - postMessage { type: "vrgame:ready" } ao carregar.
 *   - postMessage { type: "vrgame:finish", score, maxScore, timeMs } no fim.
 *   - Sem links externos, bibliotecas da internet ou coleta de dados.
 */
(function () {
  "use strict";

  // ============================================================
  // 1. CONFIGURAÇÃO E CONSTANTES
  // ============================================================
  var W = 960, H = 540, COL_STEP = 4;

  var BASE_CONFIG = {
    width: 960,
    height: 540,
    gravity: 900,
    powerMin: 20,
    powerMax: 100,
    speedMin: 260,
    speedMax: 880,
    windAccel: 24,
    hp: 100,
    craterRadius: 30,
    blastRadius: 140,
    blastDamage: 45,
    dt: 1 / 60,
  };

  // Definição das dificuldades (sobrepõe BASE_CONFIG).
  var DIFFICULTIES = {
    easy:   { name: "Fácil",   hp: 120, windMax: 8,  turnTime: 25, questionTime: 15, aiHitChance: 0.50, aiError: 8 },
    medium: { name: "Médio",   hp: 100, windMax: 14, turnTime: 20, questionTime: 12, aiHitChance: 0.75, aiError: 4 },
    hard:   { name: "Difícil", hp: 80,  windMax: 18, turnTime: 15, questionTime: 9,  aiHitChance: 0.90, aiError: 2 },
  };

  // Definição das armas especiais.
  // unlockStreak = quantos acertos consecutivos para liberar.
  var WEAPONS = {
    cannon: {
      id: "cannon", name: "Canhão", icon: "💣", unlockStreak: 0,
      desc: "Bola de canhão padrão. Dano normal.",
      color: "#1f2937", trail: "#94a3b8",
      blastRadius: 140, blastDamage: 45, craterRadius: 30,
      speedMult: 1.0, windMult: 1.0, split: 1, homing: 0, shield: false,
    },
    heavy: {
      id: "heavy", name: "Pesado", icon: "🧨", unlockStreak: 2,
      desc: "Carga pesada. Explosão maior, menos afetada pelo vento.",
      color: "#7f1d1d", trail: "#dc2626",
      blastRadius: 200, blastDamage: 55, craterRadius: 42,
      speedMult: 0.9, windMult: 0.55, split: 1, homing: 0, shield: false,
    },
    cluster: {
      id: "cluster", name: "Cluster", icon: "🎆", unlockStreak: 3,
      desc: "Explode no ar em 3 fragmentos que cobrem uma área.",
      color: "#a16207", trail: "#fbbf24",
      blastRadius: 110, blastDamage: 30, craterRadius: 22,
      speedMult: 1.0, windMult: 1.0, split: 3, splitAt: 0.55, homing: 0, shield: false,
    },
    triple: {
      id: "triple", name: "Triplo", icon: "🔱", unlockStreak: 4,
      desc: "Dispara 3 projéteis em leque. Cada um causa menos dano.",
      color: "#1e40af", trail: "#60a5fa",
      blastRadius: 100, blastDamage: 28, craterRadius: 22,
      speedMult: 1.05, windMult: 1.0, split: 3, fan: true, homing: 0, shield: false,
    },
    homing: {
      id: "homing", name: "Míssil", icon: "🚀", unlockStreak: 5,
      desc: "Míssil teleguiado: curva suavemente em direção ao alvo.",
      color: "#0f766e", trail: "#2dd4bf",
      blastRadius: 130, blastDamage: 50, craterRadius: 28,
      speedMult: 1.1, windMult: 0.4, split: 1, homing: 0.6, shield: false,
    },
    shield: {
      id: "shield", name: "Escudo", icon: "🛡️", unlockStreak: 3,
      desc: "Defensivo: bloqueia totalmente o próximo tiro inimigo.",
      color: "#0891b2", trail: "#67e8f9",
      blastRadius: 0, blastDamage: 0, craterRadius: 0,
      speedMult: 0, windMult: 0, split: 0, homing: 0, shield: true,
    },
  };

  var canvas = document.getElementById("board");
  var ctx = canvas.getContext("2d");

  if (ctx && typeof ctx.roundRect !== "function") {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
      r = Math.min(r, w / 2, h / 2);
      this.moveTo(x + r, y);
      this.arcTo(x + w, y, x + w, y + h, r);
      this.arcTo(x + w, y + h, x, y + h, r);
      this.arcTo(x, y + h, x, y, r);
      this.arcTo(x, y, x + w, y, r);
      this.closePath();
      return this;
    };
  }

  // ============================================================
  // 2. ELEMENTOS DA INTERFACE
  // ============================================================
  var els = {
    hpP1: document.getElementById("hp-p1"),
    hpP2: document.getElementById("hp-p2"),
    hpNumP1: document.getElementById("hpnum-p1"),
    hpNumP2: document.getElementById("hpnum-p2"),
    streakP1: document.getElementById("streak-p1"),
    streakP2: document.getElementById("streak-p2"),
    nameP1: document.getElementById("name-p1"),
    nameP2: document.getElementById("name-p2"),
    score: document.getElementById("score"),
    wind: document.getElementById("wind"),
    windPill: document.getElementById("wind-pill"),
    turnLabel: document.getElementById("turn-label"),
    timer: document.getElementById("timer"),
    questionBox: document.getElementById("question-box"),
    questionText: document.getElementById("question-text"),
    questionAnswer: document.getElementById("question-answer"),
    questionSubmit: document.getElementById("question-submit"),
    questionFeedback: document.getElementById("question-feedback"),
    questionTimerBar: document.getElementById("question-timerbar"),
    controls: document.getElementById("controls"),
    angle: document.getElementById("angle"),
    power: document.getElementById("power"),
    angleVal: document.getElementById("angle-val"),
    powerVal: document.getElementById("power-val"),
    fire: document.getElementById("fire"),
    weaponBar: document.getElementById("weapon-bar"),
    weaponList: document.getElementById("weapon-list"),
    weaponInfo: document.getElementById("weapon-info"),
    weaponName: document.getElementById("weapon-name"),
    weaponDesc: document.getElementById("weapon-desc"),
    menu: document.getElementById("menu"),
    modePvp: document.getElementById("mode-pvp"),
    modeAi: document.getElementById("mode-ai"),
    result: document.getElementById("result"),
    resultIcon: document.getElementById("result-icon"),
    resultTitle: document.getElementById("result-title"),
    resultText: document.getElementById("result-text"),
    resultStars: document.getElementById("result-stars"),
    statScore: document.getElementById("stat-score"),
    statAcc: document.getElementById("stat-acc"),
    statShots: document.getElementById("stat-shots"),
    statTime: document.getElementById("stat-time"),
    playAgain: document.getElementById("play-again"),
    restart: document.getElementById("restart"),
    soundToggle: document.getElementById("sound-toggle"),
    themeToggle: document.getElementById("theme-toggle"),
    diffButtons: document.querySelectorAll(".diff-btn"),
    dragHint: document.getElementById("drag-hint"),
    boardHint: document.getElementById("board-hint"),
  };

  // ============================================================
  // 3. ESTADO GLOBAL
  // ============================================================
  var state = {
    phase: "menu",         // menu | question | aim | flying | end
    mode: null,            // pvp | ai
    difficulty: "medium",  // easy | medium | hard
    players: [],
    turn: 0,
    wind: 0,
    question: null,
    qDeadline: 0,
    turnDeadline: 0,
    tickId: null,
    startedAt: null,
    shots: 0,
    hits: 0,
    directHits: 0,
    score: 0,
    shotBonus: false,
    aiThinking: false,
    soundOn: true,
    aimDrag: null,         // { startX, startY } quando arrastando no canvas
    pendingProjectiles: [],// projéteis a disparar (cluster/triple)
    nextSplit: null,       // { atX, atY, vx, vy, shooter, bonus, weapon } para cluster
  };

  var terrain = [];
  var clouds = [];
  var mountains = [];
  var trees = [];
  var projectile = null;     // projétil atual em voo
  var extraProjectiles = []; // projéteis adicionais (cluster/triple em voo simultâneo)
  var particles = [];
  var floaters = [];
  var muzzleFlash = 0;       // tempo restante do flash
  var screenShake = 0;       // intensidade do tremor
  var shieldFx = [0, 0];     // tempo de animação dos escudos [p1, p2]

  // ============================================================
  // 4. ÁUDIO (Web Audio API, sem arquivos externos)
  // ============================================================
  var audioCtx = null;

  function tone(freq, dur, type, vol, slideTo, delay) {
    if (!state.soundOn) return;
    try {
      if (!audioCtx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        audioCtx = new AC();
      }
      if (audioCtx.state === "suspended") audioCtx.resume();
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      var now = audioCtx.currentTime + (delay || 0);
      osc.type = type || "sine";
      osc.frequency.setValueAtTime(freq, now);
      if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(1, slideTo), now + dur);
      gain.gain.setValueAtTime(vol || 0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + dur);
    } catch (err) { /* sem áudio */ }
  }

  function noise(dur, vol, filterFreq) {
    if (!state.soundOn) return;
    try {
      if (!audioCtx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        audioCtx = new AC();
      }
      var bufSize = Math.floor(audioCtx.sampleRate * dur);
      var buf = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
      var data = buf.getChannelData(0);
      for (var i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      var src = audioCtx.createBufferSource();
      src.buffer = buf;
      var filter = audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = filterFreq || 1000;
      var gain = audioCtx.createGain();
      var now = audioCtx.currentTime;
      gain.gain.setValueAtTime(vol || 0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
      src.connect(filter); filter.connect(gain); gain.connect(audioCtx.destination);
      src.start(now);
      src.stop(now + dur);
    } catch (err) { /* silencioso */ }
  }

  function soundFire() { tone(220, 0.18, "square", 0.12, 70); noise(0.15, 0.1, 800); }
  function soundBoom() { tone(120, 0.4, "sawtooth", 0.18, 35); noise(0.35, 0.18, 600); }
  function soundOk() { tone(660, 0.09, "sine", 0.12); setTimeout(function () { tone(880, 0.12, "sine", 0.12); }, 90); }
  function soundBad() { tone(180, 0.22, "square", 0.1, 110); }
  function soundClick() { tone(500, 0.05, "square", 0.06); }
  function soundUnlock() { tone(523, 0.08, "sine", 0.1); setTimeout(function(){ tone(659, 0.08, "sine", 0.1); }, 80); setTimeout(function(){ tone(784, 0.12, "sine", 0.1); }, 160); }
  function soundShield() { tone(440, 0.25, "triangle", 0.1, 880); }
  function soundWin() { tone(523, 0.12, "sine", 0.14); setTimeout(function(){ tone(659, 0.12, "sine", 0.14); }, 120); setTimeout(function(){ tone(784, 0.18, "sine", 0.14); }, 240); setTimeout(function(){ tone(1047, 0.3, "sine", 0.14); }, 360); }
  function soundLose() { tone(440, 0.18, "sawtooth", 0.14, 220); setTimeout(function(){ tone(330, 0.18, "sawtooth", 0.14, 165); }, 180); setTimeout(function(){ tone(220, 0.4, "sawtooth", 0.14, 110); }, 360); }
  function soundStar() { tone(880, 0.08, "sine", 0.12); setTimeout(function(){ tone(1100, 0.12, "sine", 0.12); }, 100); }

  // ============================================================
  // 5. TERRENO DESTRUTÍVEL + DECORAÇÃO
  // ============================================================
  function genTerrain() {
    terrain = [];
    var cols = Math.ceil(W / COL_STEP) + 1;
    var base = H * 0.62;
    var p1 = Math.random() * Math.PI * 2;
    var p2 = Math.random() * Math.PI * 2;
    var p3 = Math.random() * Math.PI * 2;
    var amp1 = 30 + Math.random() * 15;
    var amp2 = 12 + Math.random() * 8;
    for (var i = 0; i < cols; i++) {
      var x = i * COL_STEP;
      var y =
        base +
        Math.sin(x * 0.008 + p1) * amp1 +
        Math.sin(x * 0.021 + p2) * amp2 +
        Math.sin(x * 0.047 + p3) * 7;
      terrain.push(y);
    }
    flatten(70, 160);
    flatten(W - 160, W - 70);

    // Decoração de fundo: montanhas e árvores
    mountains = [];
    for (var m = 0; m < 6; m++) {
      mountains.push({
        x: (m * W) / 6 + (Math.random() - 0.5) * 60,
        h: 80 + Math.random() * 80,
        w: 140 + Math.random() * 80,
      });
    }
    trees = [];
    var nTrees = 8;
    for (var t = 0; t < nTrees; t++) {
      var tx = 180 + Math.random() * (W - 360);
      if (Math.abs(tx - 110) < 60 || Math.abs(tx - (W - 110)) < 60) continue;
      var ty = groundYAt(tx);
      trees.push({ x: tx, y: ty, s: 0.7 + Math.random() * 0.6, type: Math.random() < 0.5 ? 0 : 1 });
    }
  }

  function flatten(x0, x1) {
    var i0 = Math.max(0, Math.floor(x0 / COL_STEP));
    var i1 = Math.min(terrain.length - 1, Math.ceil(x1 / COL_STEP));
    var midY = terrain[Math.floor((i0 + i1) / 2)];
    for (var i = i0; i <= i1; i++) {
      var t = Math.min(1, Math.abs(i - (i0 + i1) / 2) / 6);
      terrain[i] = midY * (1 - t) + terrain[i] * t;
    }
  }

  function groundYAt(x) {
    var i = Math.round(x / COL_STEP);
    if (i < 0 || i >= terrain.length) return H;
    return terrain[i];
  }

  function makeCrater(cx, cy, r) {
    var i0 = Math.max(0, Math.floor((cx - r) / COL_STEP));
    var i1 = Math.min(terrain.length - 1, Math.ceil((cx + r) / COL_STEP));
    for (var i = i0; i <= i1; i++) {
      var dx = i * COL_STEP - cx;
      var dy = Math.sqrt(Math.max(0, r * r - dx * dx));
      terrain[i] = Math.max(terrain[i], cy + dy);
      terrain[i] = Math.min(terrain[i], H);
    }
    // Remover árvores atingidas
    for (var t = trees.length - 1; t >= 0; t--) {
      if (Math.hypot(trees[t].x - cx, trees[t].y - cy) < r * 1.4) trees.splice(t, 1);
    }
  }

  function initClouds() {
    clouds = [];
    for (var i = 0; i < 5; i++) {
      clouds.push({
        x: Math.random() * W,
        y: 30 + Math.random() * 120,
        s: 0.6 + Math.random() * 0.8,
        v: 4 + Math.random() * 8,
      });
    }
  }

  // ============================================================
  // 6. JOGADORES E CANHÕES
  // ============================================================
  function makePlayers(mode) {
    return [
      {
        name: "Jogador 1",
        color: "#2563eb",
        dark: "#1e40af",
        light: "#bfdbfe",
        isAI: false,
        facing: 1,
        x: 110,
        hp: 0,
        angle: 45,
        power: 60,
        questions: 0,
        correct: 0,
        streak: 0,
        maxStreak: 0,
        selectedWeapon: "cannon",
        shielded: false,
        flash: 0,
        hitFlash: 0,
      },
      {
        name: mode === "ai" ? "Computador" : "Jogador 2",
        color: "#ea580c",
        dark: "#9a3412",
        light: "#fed7aa",
        isAI: mode === "ai",
        facing: -1,
        x: W - 110,
        hp: 0,
        angle: 45,
        power: 60,
        questions: 0,
        correct: 0,
        streak: 0,
        maxStreak: 0,
        selectedWeapon: "cannon",
        shielded: false,
        flash: 0,
        hitFlash: 0,
      },
    ];
  }

  function pivotOf(p) { return { x: p.x, y: groundYAt(p.x) - 14 }; }

  function muzzleOf(p) {
    var piv = pivotOf(p);
    var a = (p.angle * Math.PI) / 180;
    return {
      x: piv.x + Math.cos(a) * 30 * p.facing,
      y: piv.y - Math.sin(a) * 30,
    };
  }

  function powerToSpeed(power) {
    var t = (power - BASE_CONFIG.powerMin) / (BASE_CONFIG.powerMax - BASE_CONFIG.powerMin);
    return BASE_CONFIG.speedMin + t * (BASE_CONFIG.speedMax - BASE_CONFIG.speedMin);
  }

  function diffCfg() { return DIFFICULTIES[state.difficulty]; }

  // ============================================================
  // 7. DESAFIO DE MATEMÁTICA
  // ============================================================
  function genQuestion() {
    var kind = Math.floor(Math.random() * 4);
    var a, b, text, answer;
    if (kind === 0) {
      a = 11 + Math.floor(Math.random() * 89);
      b = 11 + Math.floor(Math.random() * 89);
      text = a + " + " + b;
      answer = a + b;
    } else if (kind === 1) {
      a = 21 + Math.floor(Math.random() * 79);
      b = 10 + Math.floor(Math.random() * (a - 10));
      text = a + " − " + b;
      answer = a - b;
    } else if (kind === 2) {
      a = 3 + Math.floor(Math.random() * 10);
      b = 2 + Math.floor(Math.random() * 8);
      text = a + " × " + b;
      answer = a * b;
    } else {
      b = 2 + Math.floor(Math.random() * 8);
      var q = 2 + Math.floor(Math.random() * 9);
      a = b * q;
      text = a + " ÷ " + b;
      answer = q;
    }
    return { text: text, answer: answer };
  }

  // ============================================================
  // 8. FLUXO DA PARTIDA
  // ============================================================
  function newGame(mode) {
    stopTick();
    state.mode = mode;
    var cfg = diffCfg();
    state.players = makePlayers(mode);
    state.players[0].hp = cfg.hp;
    state.players[1].hp = cfg.hp;
    state.turn = 0;
    state.shots = 0;
    state.hits = 0;
    state.directHits = 0;
    state.score = 0;
    state.startedAt = Date.now();
    state.shotBonus = false;
    state.aiThinking = false;
    projectile = null;
    extraProjectiles = [];
    particles = [];
    floaters = [];
    shieldFx = [0, 0];
    muzzleFlash = 0;
    screenShake = 0;
    genTerrain();
    initClouds();
    els.menu.hidden = true;
    els.result.hidden = true;
    els.nameP1.textContent = state.players[0].name;
    els.nameP2.textContent = state.players[1].name;
    updateHUD();
    startTurn();
  }

  function current() { return state.players[state.turn]; }

  function startTurn() {
    var p = current();
    state.wind = Math.round((Math.random() * 2 - 1) * diffCfg().windMax);
    state.question = genQuestion();
    state.shotBonus = false;
    state.phase = "question";
    state.aiThinking = false;

    els.questionText.textContent = state.question.text;
    els.questionAnswer.value = "";
    els.questionAnswer.classList.remove("shake");
    els.questionFeedback.hidden = true;
    els.questionFeedback.className = "panel-feedback";
    els.questionBox.hidden = p.isAI;
    els.controls.hidden = true;
    els.fire.disabled = false;
    els.dragHint.classList.remove("hidden");

    state.qDeadline = Date.now() + diffCfg().questionTime * 1000;
    startTick();

    if (p.isAI) {
      setTimeout(function () {
        if (state.phase !== "question") return;
        var hit = Math.random() < diffCfg().aiHitChance;
        p.questions += 1;
        if (hit) { p.correct += 1; p.streak += 1; }
        else { p.streak = 0; }
        p.maxStreak = Math.max(p.maxStreak, p.streak);
        state.shotBonus = hit;
        showFeedback(hit, true);
        if (hit) soundOk(); else soundBad();
        // IA escolhe arma destravada de maior prioridade
        p.selectedWeapon = pickAIWeapon(p);
        setTimeout(beginAim, 1100);
      }, 1400);
    } else {
      els.questionAnswer.focus();
    }
    updateHUD();
  }

  function pickAIWeapon(p) {
    // Escolhe a melhor arma destravada conforme a situação
    var unlocked = unlockedWeapons(p);
    // Se está com escudo ativo do turno anterior (já gasto), prioriza defesa às vezes
    if (!p.shielded && Math.random() < 0.18 && unlocked.indexOf("shield") >= 0 && p.streak >= 1) {
      return "shield";
    }
    // Preferência por homing > cluster > triple > heavy > cannon
    if (unlocked.indexOf("homing") >= 0 && Math.random() < 0.6) return "homing";
    if (unlocked.indexOf("cluster") >= 0 && Math.random() < 0.5) return "cluster";
    if (unlocked.indexOf("triple") >= 0 && Math.random() < 0.4) return "triple";
    if (unlocked.indexOf("heavy") >= 0 && Math.random() < 0.5) return "heavy";
    return "cannon";
  }

  function unlockedWeapons(p) {
    var list = [];
    for (var k in WEAPONS) {
      if (WEAPONS[k].unlockStreak <= p.streak) list.push(k);
    }
    return list;
  }

  function showFeedback(ok, isAI) {
    var fb = els.questionFeedback;
    fb.hidden = false;
    fb.className = "panel-feedback " + (ok ? "ok" : "bad");
    if (isAI) {
      fb.textContent = ok
        ? "O computador acertou a conta: tiro com dano em dobro!"
        : "O computador errou a conta: tiro normal.";
    } else {
      fb.textContent = ok
        ? "✔ Resposta certa! Dano em dobro +1 na sequência."
        : "✘ Resposta errada. O tiro será normal.";
    }
  }

  function submitAnswer() {
    if (state.phase !== "question") return;
    var p = current();
    if (p.isAI) return;
    var raw = els.questionAnswer.value.trim();
    var ok = raw !== "" && parseInt(raw, 10) === state.question.answer;
    p.questions += 1;
    if (ok) {
      p.correct += 1;
      p.streak += 1;
      p.maxStreak = Math.max(p.maxStreak, p.streak);
      state.score += 10;
      // Som de desbloqueio se alcançou nova arma
      var newlyUnlocked = false;
      for (var k in WEAPONS) {
        if (WEAPONS[k].unlockStreak === p.streak) { newlyUnlocked = true; break; }
      }
      if (newlyUnlocked) {
        soundUnlock();
        showBoardHint("🆕 Nova arma desbloqueada!");
      } else {
        soundOk();
      }
    } else {
      p.streak = 0;
      if (raw !== "") {
        els.questionAnswer.classList.add("shake");
        setTimeout(function () { els.questionAnswer.classList.remove("shake"); }, 400);
      }
      soundBad();
    }
    state.shotBonus = ok;
    showFeedback(ok, false);
    state.phase = "aim-pending";
    setTimeout(beginAim, 900);
  }

  function beginAim() {
    if (state.phase === "end" || state.phase === "flying") return;
    var p = current();
    state.phase = "aim";
    els.questionBox.hidden = true;
    els.controls.hidden = p.isAI;
    renderWeaponList(p);
    syncSliders();
    state.turnDeadline = Date.now() + diffCfg().turnTime * 1000;
    updateHUD();

    if (p.isAI) {
      state.aiThinking = true;
      setTimeout(function () {
        if (state.phase !== "aim") return;
        var shot = aiComputeShot(p);
        p.angle = shot.angle;
        p.power = shot.power;
        syncSliders();
        updateHUD();
        setTimeout(fire, 500);
      }, 900);
    }
  }

  function renderWeaponList(p) {
    els.weaponList.innerHTML = "";
    for (var k in WEAPONS) {
      var w = WEAPONS[k];
      var locked = w.unlockStreak > p.streak;
      var btn = document.createElement("button");
      btn.className = "weapon-btn" + (p.selectedWeapon === k ? " active" : "");
      btn.type = "button";
      btn.disabled = locked || p.isAI;
      btn.innerHTML =
        '<span class="w-icon">' + w.icon + '</span>' +
        '<span class="w-name">' + w.name + '</span>' +
        (locked ? '<span class="w-lock">🔥' + w.unlockStreak + '</span>' : '');
      (function (key) {
        btn.addEventListener("click", function () {
          if (btn.disabled) return;
          p.selectedWeapon = key;
          renderWeaponList(p);
          showWeaponInfo(key);
          soundClick();
        });
      })(k);
      els.weaponList.appendChild(btn);
    }
    showWeaponInfo(p.selectedWeapon);
  }

  function showWeaponInfo(key) {
    var w = WEAPONS[key];
    if (!w) { els.weaponInfo.hidden = true; return; }
    els.weaponInfo.hidden = false;
    els.weaponName.textContent = w.icon + " " + w.name;
    els.weaponDesc.textContent = w.desc;
  }

  function syncSliders() {
    var p = current();
    els.angle.value = String(p.angle);
    els.power.value = String(p.power);
    els.angleVal.textContent = p.angle + "°";
    els.powerVal.textContent = String(p.power);
  }

  function fire() {
    if (state.phase !== "aim") return;
    var p = current();
    var weapon = WEAPONS[p.selectedWeapon] || WEAPONS.cannon;

    // Escudo é defensivo: ativa e passa a vez
    if (weapon.shield) {
      p.shielded = true;
      shieldFx[state.turn] = 1.0;
      soundShield();
      showBoardHint("🛡️ Escudo ativado!");
      state.shots += 1;
      state.phase = "flying";
      els.controls.hidden = true;
      els.fire.disabled = true;
      updateHUD();
      setTimeout(function () {
        if (state.players[0].hp <= 0 || state.players[1].hp <= 0) endGame();
        else nextTurn();
      }, 800);
      return;
    }

    var m = muzzleOf(p);
    var speed = powerToSpeed(p.power) * weapon.speedMult;
    var a = (p.angle * Math.PI) / 180;

    muzzleFlash = 0.18;
    soundFire();

    if (weapon.fan) {
      // Tiro triplo em leque
      for (var i = -1; i <= 1; i++) {
        var af = a + i * 0.12;
        extraProjectiles.push({
          x: m.x, y: m.y,
          vx: Math.cos(af) * speed * p.facing,
          vy: -Math.sin(af) * speed,
          trail: [], shooter: state.turn, bonus: state.shotBonus,
          weapon: weapon, color: weapon.color, trailColor: weapon.trail,
          age: 0, splitPending: false, homing: 0,
        });
      }
      projectile = extraProjectiles.shift();
    } else {
      projectile = {
        x: m.x, y: m.y,
        vx: Math.cos(a) * speed * p.facing,
        vy: -Math.sin(a) * speed,
        trail: [], shooter: state.turn, bonus: state.shotBonus,
        weapon: weapon, color: weapon.color, trailColor: weapon.trail,
        age: 0,
        splitPending: weapon.split > 1 && !weapon.fan,
        homing: weapon.homing,
      };
    }

    state.shots += 1;
    state.phase = "flying";
    els.controls.hidden = true;
    els.fire.disabled = true;
    els.dragHint.classList.add("hidden");
    updateHUD();
  }

  function explode(x, y, weapon, shooterIdx, bonus) {
    weapon = weapon || WEAPONS.cannon;
    if (weapon.blastRadius > 0) {
      makeCrater(x, y, weapon.craterRadius);
      spawnExplosion(x, y, weapon);
      soundBoom();
      screenShake = Math.min(18, screenShake + 8);
    }

    var dmgDealt = false;
    for (var i = 0; i < state.players.length; i++) {
      if (i === shooterIdx) continue; // não atinge o atirador
      var piv = pivotOf(state.players[i]);
      var d = Math.hypot(x - piv.x, y - piv.y);
      if (d < weapon.blastRadius) {
        var dmg = Math.round((1 - d / weapon.blastRadius) * weapon.blastDamage);
        if (bonus) dmg *= 2;
        dmg = Math.max(0, dmg);
        if (dmg > 0) {
          // Escudo bloqueia
          if (state.players[i].shielded) {
            state.players[i].shielded = false;
            shieldFx[i] = 1.0;
            floaters.push({ x: piv.x, y: piv.y - 44, txt: "BLOQUEADO", color: "#0891b2", life: 1.6, big: true });
            soundShield();
          } else {
            state.players[i].hp = Math.max(0, state.players[i].hp - dmg);
            state.players[i].hitFlash = 0.4;
            floaters.push({ x: piv.x, y: piv.y - 34, txt: "-" + dmg, color: "#dc2626", life: 1.4 });
            var shooter = state.players[shooterIdx];
            if (shooter) {
              // Pontuação só conta para o Jogador 1 (humano).
              if (shooterIdx === 0) {
                state.score += dmg * (bonus ? 2 : 1);
                state.hits += 1;
                if (d < 22) {
                  state.directHits += 1;
                  state.score += 50;
                  floaters.push({ x: piv.x, y: piv.y - 60, txt: "DIRETO!", color: "#fbbf24", life: 1.6, big: true });
                }
              }
            }
            dmgDealt = true;
          }
        }
      }
    }

    projectile = null;
    updateHUD();

    // Aguardar até todos os projéteis (cluster/triple) terminarem
    if (extraProjectiles.length === 0) {
      if (state.players[0].hp <= 0 || state.players[1].hp <= 0) {
        setTimeout(endGame, 900);
      } else {
        setTimeout(nextTurn, 900);
      }
    }
  }

  function nextTurn() {
    if (state.phase === "end") return;
    state.turn = 1 - state.turn;
    startTurn();
  }

  function endGame() {
    state.phase = "end";
    stopTick();
    els.controls.hidden = true;
    els.questionBox.hidden = true;

    var a = state.players[0];
    var b = state.players[1];
    var winner;
    if (a.hp <= 0 && b.hp <= 0) winner = null;
    else winner = a.hp > b.hp ? a : b;

    // Estatísticas de acerto: apenas do Jogador 1 (humano) para o placar final.
    var totalCorrect = a.correct;
    var totalQuestions = Math.max(1, a.questions);
    var timeMs = state.startedAt ? Date.now() - state.startedAt : 0;
    var acc = Math.round((totalCorrect / totalQuestions) * 100);
    // total de perguntas para o contrato do portal
    var portalTotal = Math.max(1, a.questions + b.questions);

    // Bônus de vitória: só atribui pontos ao Jogador 1 humano.
    if (winner) {
      var playerWon = (winner === a);
      if (playerWon) {
        state.score += 200;
        state.score += Math.round(winner.hp); // bônus por HP restante
      }
    }

    // Cálculo de estrelas (0-3) — baseado no desempenho do Jogador 1.
    var stars = 0;
    var p1CorrectRatio = a.questions > 0 ? a.correct / a.questions : 0;
    var playerWon = winner === a;
    if (winner) {
      if (playerWon) {
        stars = 1;
        if (p1CorrectRatio >= 0.6) stars = 2;
        if (p1CorrectRatio >= 0.8 && a.hp >= 30) stars = 3;
      } else {
        // Jogador perdeu — 1 estrela se teve bom desempenho nas contas
        stars = p1CorrectRatio >= 0.5 ? 1 : 0;
      }
    } else {
      stars = p1CorrectRatio >= 0.5 ? 1 : 0;
    }

    // Estrelas animadas
    els.resultStars.innerHTML = "";
    for (var s = 0; s < 3; s++) {
      var star = document.createElement("span");
      star.textContent = "⭐";
      star.className = s < stars ? "star-fill" : "star-empty";
      star.style.animationDelay = (s * 0.18) + "s";
      els.resultStars.appendChild(star);
    }

    els.resultIcon.textContent = winner ? "🏆" : "🤝";
    els.resultTitle.textContent = winner ? winner.name + " venceu!" : "Empate!";
    els.resultText.textContent =
      (winner ? winner.name + " destruiu o canhão adversário." : "Os dois canhões caíram juntos.") +
      " Veja suas estatísticas:";

    els.statScore.textContent = String(state.score);
    els.statAcc.textContent = acc + "%";
    els.statShots.textContent = String(state.shots);
    els.statTime.textContent = Math.round(timeMs / 1000) + "s";
    els.result.hidden = false;

    if (winner && !winner.isAI) soundWin();
    else if (winner && winner.isAI) soundLose();
    else soundStar();

    // Tocar som das estrelas em sequência
    for (var si = 0; si < stars; si++) {
      setTimeout(soundStar, 400 + si * 200);
    }

    window.parent.postMessage(
      {
        type: "vrgame:finish",
        score: state.score,
        maxScore: portalTotal * 50 + 500,
        timeMs: timeMs,
        detail: {
          mode: state.mode,
          difficulty: state.difficulty,
          stars: stars,
          winner: winner ? winner.name : "empate",
          shots: state.shots,
          hits: state.hits,
          directHits: state.directHits,
          accuracy: acc,
          correctP1: a.correct,
          correctP2: b.correct,
          maxStreakP1: a.maxStreak,
          maxStreakP2: b.maxStreak,
        },
      },
      "*"
    );
  }

  // ============================================================
  // 9. IA: testa combinações de ângulo/força e escolhe a melhor
  // ============================================================
  function simulateShot(p, angle, power, weapon) {
    weapon = weapon || WEAPONS.cannon;
    var m = muzzleOf(p);
    var enemy = state.players[1 - state.players.indexOf(p)];
    var target = pivotOf(enemy);
    var speed = powerToSpeed(power) * weapon.speedMult;
    var a = (angle * Math.PI) / 180;
    var x = m.x, y = m.y;
    var vx = Math.cos(a) * speed * p.facing;
    var vy = -Math.sin(a) * speed;
    var best = { x: x, y: y, d: Math.hypot(x - target.x, y - target.y) };
    var dt = BASE_CONFIG.dt;
    for (var s = 0; s < 800; s++) {
      vx += state.wind * BASE_CONFIG.windAccel * weapon.windMult * dt;
      vy += BASE_CONFIG.gravity * dt;
      x += vx * dt;
      y += vy * dt;
      if (x < 0 || x > W || y > H) break;
      var d = Math.hypot(x - target.x, y - target.y);
      if (d < best.d) best = { x: x, y: y, d: d };
      if (y >= groundYAt(x)) break;
    }
    return best;
  }

  function aiComputeShot(p) {
    var weapon = WEAPONS[p.selectedWeapon] || WEAPONS.cannon;
    var best = null;
    var angle, power, res;
    for (angle = 15; angle <= 80; angle += 5) {
      for (power = BASE_CONFIG.powerMin; power <= BASE_CONFIG.powerMax; power += 5) {
        res = simulateShot(p, angle, power, weapon);
        if (!best || res.d < best.d) best = { angle: angle, power: power, d: res.d };
      }
    }
    var a0 = Math.max(5, best.angle - 4);
    var a1 = Math.min(85, best.angle + 4);
    var p0 = Math.max(BASE_CONFIG.powerMin, best.power - 6);
    var p1 = Math.min(BASE_CONFIG.powerMax, best.power + 6);
    for (angle = a0; angle <= a1; angle += 1) {
      for (power = p0; power <= p1; power += 1) {
        res = simulateShot(p, angle, power, weapon);
        if (res.d < best.d) best = { angle: angle, power: power, d: res.d };
      }
    }
    var err = diffCfg().aiError;
    best.angle = Math.max(5, Math.min(85, best.angle + Math.round((Math.random() * 2 - 1) * err)));
    best.power = Math.max(BASE_CONFIG.powerMin, Math.min(BASE_CONFIG.powerMax, best.power + Math.round((Math.random() * 2 - 1) * err)));
    return best;
  }

  // ============================================================
  // 10. FÍSICA E ANIMAÇÃO
  // ============================================================
  function stepProjectile(pr) {
    if (!pr) return;
    pr.trail.push({ x: pr.x, y: pr.y });
    if (pr.trail.length > 28) pr.trail.shift();

    pr.age += BASE_CONFIG.dt;

    // Míssil teleguiado: curva suave em direção ao inimigo
    if (pr.homing && pr.homing > 0 && pr.age > 0.3) {
      var enemyIdx = 1 - pr.shooter;
      var enemyPiv = pivotOf(state.players[enemyIdx]);
      var dx = enemyPiv.x - pr.x;
      var dy = enemyPiv.y - pr.y;
      var len = Math.hypot(dx, dy) || 1;
      var targetVx = (dx / len) * Math.hypot(pr.vx, pr.vy);
      var targetVy = (dy / len) * Math.hypot(pr.vx, pr.vy);
      pr.vx += (targetVx - pr.vx) * pr.homing * BASE_CONFIG.dt;
      pr.vy += (targetVy - pr.vy) * pr.homing * BASE_CONFIG.dt;
    }

    pr.vx += state.wind * BASE_CONFIG.windAccel * pr.weapon.windMult * BASE_CONFIG.dt;
    pr.vy += BASE_CONFIG.gravity * BASE_CONFIG.dt;
    pr.x += pr.vx * BASE_CONFIG.dt;
    pr.y += pr.vy * BASE_CONFIG.dt;

    // Cluster: splita em 3 após certo tempo
    if (pr.splitPending && pr.age > (pr.weapon.splitAt || 0.5) * 1.0) {
      pr.splitPending = false;
      for (var s = -1; s <= 1; s++) {
        extraProjectiles.push({
          x: pr.x, y: pr.y,
          vx: pr.vx + s * 60,
          vy: pr.vy - 80,
          trail: [], shooter: pr.shooter, bonus: pr.bonus,
          weapon: WEAPONS.cannon, color: pr.weapon.color, trailColor: pr.weapon.trail,
          age: 0, splitPending: false, homing: 0,
        });
      }
      // Remove o projétil atual
      pr.dead = true;
      return;
    }

    // Acertou algum canhão?
    for (var i = 0; i < state.players.length; i++) {
      var piv = pivotOf(state.players[i]);
      if (Math.hypot(pr.x - piv.x, pr.y - piv.y) < 20) {
        explode(pr.x, pr.y, pr.weapon, pr.shooter, pr.bonus);
        pr.dead = true;
        return;
      }
    }

    if (pr.y >= groundYAt(pr.x)) {
      explode(pr.x, groundYAt(pr.x), pr.weapon, pr.shooter, pr.bonus);
      pr.dead = true;
      return;
    }
    if (pr.x < -40 || pr.x > W + 40 || pr.y > H + 40) {
      pr.dead = true;
    }
  }

  function spawnExplosion(x, y, weapon) {
    var n = 36;
    for (var i = 0; i < n; i++) {
      var ang = Math.random() * Math.PI * 2;
      var sp = 80 + Math.random() * 280;
      particles.push({
        x: x, y: y,
        vx: Math.cos(ang) * sp,
        vy: Math.sin(ang) * sp - 100,
        r: 2 + Math.random() * 5,
        life: 0.6 + Math.random() * 0.7,
        color: Math.random() < 0.4 ? "#fbbf24" : (Math.random() < 0.5 ? "#ef4444" : "#1f2937"),
        kind: Math.random() < 0.7 ? "spark" : "smoke",
      });
    }
    // Anel de choque
    particles.push({ x: x, y: y, vx: 0, vy: 0, r: 5, life: 0.3, color: "#fff", kind: "ring", maxR: weapon.blastRadius });
  }

  function stepEffects(dt) {
    for (var i = particles.length - 1; i >= 0; i--) {
      var pt = particles[i];
      if (pt.kind === "ring") {
        pt.r += dt * 400;
        pt.life -= dt;
      } else {
        pt.vy += (pt.kind === "smoke" ? 100 : 500) * dt;
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.life -= dt;
        if (pt.kind === "smoke") pt.r += dt * 8;
      }
      if (pt.life <= 0) particles.splice(i, 1);
    }
    for (var j = floaters.length - 1; j >= 0; j--) {
      floaters[j].y -= 30 * dt;
      floaters[j].life -= dt;
      if (floaters[j].life <= 0) floaters.splice(j, 1);
    }
    for (var c = 0; c < clouds.length; c++) {
      clouds[c].x += clouds[c].v * dt;
      if (clouds[c].x > W + 90) clouds[c].x = -90;
    }
    if (muzzleFlash > 0) muzzleFlash -= dt;
    if (screenShake > 0) screenShake = Math.max(0, screenShake - dt * 30);
    for (var pi = 0; pi < state.players.length; pi++) {
      if (state.players[pi].flash > 0) state.players[pi].flash -= dt;
      if (state.players[pi].hitFlash > 0) state.players[pi].hitFlash -= dt;
    }
    if (shieldFx[0] > 0) shieldFx[0] = Math.max(0, shieldFx[0] - dt * 0.8);
    if (shieldFx[1] > 0) shieldFx[1] = Math.max(0, shieldFx[1] - dt * 0.8);
  }

  // ============================================================
  // 11. DESENHO
  // ============================================================
  function isDarkTheme() {
    return document.documentElement.dataset.theme === "dark";
  }

  function drawSky() {
    var dark = isDarkTheme();
    var g = ctx.createLinearGradient(0, 0, 0, H);
    if (dark) {
      g.addColorStop(0, "#0c0f1d");
      g.addColorStop(0.5, "#1e1b4b");
      g.addColorStop(1, "#312e81");
    } else {
      g.addColorStop(0, "#38bdf8");
      g.addColorStop(0.55, "#7dd3fc");
      g.addColorStop(1, "#fde68a");
    }
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // sol / lua
    var sx = W - 130, sy = 90;
    if (!dark) {
      // raios
      ctx.save();
      ctx.translate(sx, sy);
      ctx.strokeStyle = "rgba(254, 240, 138, 0.6)";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      var rayPhase = (Date.now() % 6000) / 6000 * Math.PI * 2;
      for (var i = 0; i < 8; i++) {
        var a = i * Math.PI / 4 + rayPhase * 0.1;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 42, Math.sin(a) * 42);
        ctx.lineTo(Math.cos(a) * 56, Math.sin(a) * 56);
        ctx.stroke();
      }
      ctx.restore();
      var sg = ctx.createRadialGradient(sx - 6, sy - 6, 6, sx, sy, 36);
      sg.addColorStop(0, "#fef3c7");
      sg.addColorStop(1, "#fbbf24");
      ctx.fillStyle = sg;
      ctx.beginPath();
      ctx.arc(sx, sy, 32, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = "#e2e8f0";
      ctx.beginPath();
      ctx.arc(sx, sy, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#0c0f1d";
      ctx.beginPath();
      ctx.arc(sx + 10, sy - 6, 26, 0, Math.PI * 2);
      ctx.fill();
    }

    // montanhas de fundo (parallax sutil)
    for (var m = 0; m < mountains.length; m++) {
      var mt = mountains[m];
      ctx.fillStyle = dark ? "#1e293b" : "#86efac";
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.moveTo(mt.x - mt.w / 2, H * 0.62);
      ctx.lineTo(mt.x, H * 0.62 - mt.h);
      ctx.lineTo(mt.x + mt.w / 2, H * 0.62);
      ctx.closePath();
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // nuvens
    ctx.fillStyle = dark ? "rgba(148,163,184,0.35)" : "rgba(255,255,255,0.92)";
    for (var ci = 0; ci < clouds.length; ci++) {
      var c = clouds[ci];
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, 42 * c.s, 16 * c.s, 0, 0, Math.PI * 2);
      ctx.ellipse(c.x + 26 * c.s, c.y + 5 * c.s, 30 * c.s, 12 * c.s, 0, 0, Math.PI * 2);
      ctx.ellipse(c.x - 28 * c.s, c.y + 6 * c.s, 28 * c.s, 11 * c.s, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawTerrain() {
    var dark = isDarkTheme();
    // Camada de fundo (terra escura)
    ctx.beginPath();
    ctx.moveTo(0, terrain[0]);
    for (var i = 1; i < terrain.length; i++) ctx.lineTo(i * COL_STEP, terrain[i]);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    var g = ctx.createLinearGradient(0, H * 0.5, 0, H);
    if (dark) {
      g.addColorStop(0, "#365314");
      g.addColorStop(0.4, "#1a2e05");
      g.addColorStop(1, "#0a1900");
    } else {
      g.addColorStop(0, "#4d7c0f");
      g.addColorStop(0.5, "#3f6212");
      g.addColorStop(1, "#1a2e05");
    }
    ctx.fillStyle = g;
    ctx.fill();

    // Grama no topo
    ctx.beginPath();
    ctx.moveTo(0, terrain[0]);
    for (var j = 1; j < terrain.length; j++) ctx.lineTo(j * COL_STEP, terrain[j]);
    ctx.strokeStyle = dark ? "#65a30d" : "#84cc16";
    ctx.lineWidth = 5;
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.strokeStyle = dark ? "#4d7c0f" : "#a3e635";
    ctx.stroke();

    // Textura sutil de terra (pontos)
    ctx.fillStyle = dark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.15)";
    for (var t = 0; t < trees.length; t++) {
      drawTree(trees[t]);
    }
  }

  function drawTree(tree) {
    var dark = isDarkTheme();
    var x = tree.x, y = tree.y, s = tree.s;
    // tronco
    ctx.fillStyle = dark ? "#3f2a0e" : "#78350f";
    ctx.fillRect(x - 5 * s, y - 28 * s, 10 * s, 28 * s);
    // copa
    if (tree.type === 0) {
      ctx.fillStyle = dark ? "#14532d" : "#15803d";
      ctx.beginPath();
      ctx.arc(x, y - 36 * s, 22 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = dark ? "#166534" : "#16a34a";
      ctx.beginPath();
      ctx.arc(x - 14 * s, y - 26 * s, 15 * s, 0, Math.PI * 2);
      ctx.arc(x + 14 * s, y - 26 * s, 15 * s, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // pinheiro
      ctx.fillStyle = dark ? "#14532d" : "#166534";
      ctx.beginPath();
      ctx.moveTo(x, y - 60 * s);
      ctx.lineTo(x + 18 * s, y - 30 * s);
      ctx.lineTo(x - 18 * s, y - 30 * s);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x, y - 45 * s);
      ctx.lineTo(x + 22 * s, y - 20 * s);
      ctx.lineTo(x - 22 * s, y - 20 * s);
      ctx.closePath();
      ctx.fill();
    }
  }

  function drawCannon(p, active) {
    var piv = pivotOf(p);
    var groundY = groundYAt(p.x);
    var bob = active ? Math.sin(Date.now() / 200) * 1.5 : 0;
    var flash = p.hitFlash > 0 ? 1 : 0;

    // sombra
    ctx.beginPath();
    ctx.ellipse(p.x, groundY - 2, 28, 8, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,0,0,0.28)";
    ctx.fill();

    // rodas
    ctx.fillStyle = "#1f2937";
    ctx.beginPath();
    ctx.arc(p.x - 14, groundY - 7, 9, 0, Math.PI * 2);
    ctx.arc(p.x + 14, groundY - 7, 9, 0, Math.PI * 2);
    ctx.fill();
    // raios das rodas
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1.5;
    for (var wi = 0; wi < 4; wi++) {
      var wa = wi * Math.PI / 4 + (active ? Date.now() / 600 : 0);
      ctx.beginPath();
      ctx.moveTo(p.x - 14 + Math.cos(wa) * 5, groundY - 7 + Math.sin(wa) * 5);
      ctx.lineTo(p.x - 14 - Math.cos(wa) * 5, groundY - 7 - Math.sin(wa) * 5);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(p.x + 14 + Math.cos(wa) * 5, groundY - 7 + Math.sin(wa) * 5);
      ctx.lineTo(p.x + 14 - Math.cos(wa) * 5, groundY - 7 - Math.sin(wa) * 5);
      ctx.stroke();
    }

    // corpo
    var bx = p.x, by = piv.y - 2 + bob;
    var bodyGrad = ctx.createRadialGradient(bx - 8, by - 8, 4, bx, by, 24);
    bodyGrad.addColorStop(0, p.light);
    bodyGrad.addColorStop(0.6, p.color);
    bodyGrad.addColorStop(1, p.dark);
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.roundRect(bx - 20, by - 12, 40, 24, 10);
    ctx.fill();
    if (flash > 0) {
      ctx.fillStyle = "rgba(255,255,255," + (p.hitFlash * 0.7) + ")";
      ctx.beginPath();
      ctx.roundRect(bx - 20, by - 12, 40, 24, 10);
      ctx.fill();
    }
    // brilho
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.beginPath();
    ctx.ellipse(bx - 8, by - 4, 10, 4, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // olhos (carinha cartoon)
    var eyeY = by - 2;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(bx - 7, eyeY, 3.5, 0, Math.PI * 2);
    ctx.arc(bx + 7, eyeY, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#0f172a";
    var lookOffset = active ? 1 : 0;
    ctx.beginPath();
    ctx.arc(bx - 7 + lookOffset * p.facing, eyeY, 1.8, 0, Math.PI * 2);
    ctx.arc(bx + 7 + lookOffset * p.facing, eyeY, 1.8, 0, Math.PI * 2);
    ctx.fill();
    // sobrancelha
    ctx.strokeStyle = p.dark;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bx - 10, eyeY - 5);
    ctx.lineTo(bx - 4, eyeY - 4);
    ctx.moveTo(bx + 4, eyeY - 4);
    ctx.lineTo(bx + 10, eyeY - 5);
    ctx.stroke();
    // sorriso
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(bx, eyeY + 6, 5, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();

    // cano
    ctx.save();
    ctx.translate(piv.x, piv.y + bob);
    ctx.rotate(-p.angle * (Math.PI / 180) * p.facing);
    // base do cano
    ctx.fillStyle = p.dark;
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();
    // cano em si
    var barrelGrad = ctx.createLinearGradient(0, -7, 0, 7);
    barrelGrad.addColorStop(0, p.light);
    barrelGrad.addColorStop(0.5, p.color);
    barrelGrad.addColorStop(1, p.dark);
    ctx.fillStyle = barrelGrad;
    ctx.beginPath();
    ctx.roundRect(0, -7, 36, 14, 6);
    ctx.fill();
    // boca do cano
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.roundRect(30, -8, 8, 16, 3);
    ctx.fill();
    // flash do tiro
    if (muzzleFlash > 0 && active) {
      var fr = 14 * (muzzleFlash / 0.18);
      ctx.fillStyle = "rgba(255, 220, 100, " + (muzzleFlash * 4) + ")";
      ctx.beginPath();
      ctx.arc(40, 0, fr, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255, 140, 0, " + (muzzleFlash * 3) + ")";
      ctx.beginPath();
      ctx.arc(40, 0, fr * 0.6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // bandeira do jogador da vez
    if (active) {
      var fx = p.x + 22 * p.facing;
      var fy = groundY - 50;
      ctx.strokeStyle = p.dark;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(fx, groundY - 4);
      ctx.lineTo(fx, fy);
      ctx.stroke();
      var wave = Math.sin(Date.now() / 150) * 2;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(fx + 18 * p.facing, fy + 6 + wave);
      ctx.lineTo(fx, fy + 12);
      ctx.closePath();
      ctx.fill();
    }

    // Escudo
    if (p.shielded || shieldFx[state.players.indexOf(p)] > 0) {
      var sIdx = state.players.indexOf(p);
      var sAlpha = p.shielded ? 0.5 + Math.sin(Date.now() / 200) * 0.1 : shieldFx[sIdx] * 0.6;
      ctx.strokeStyle = "rgba(34, 211, 238, " + sAlpha + ")";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(p.x, piv.y - 4, 36, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = "rgba(125, 211, 252, " + (sAlpha * 0.6) + ")";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(p.x, piv.y - 4, 32, 0, Math.PI * 2);
      ctx.stroke();
    }

    // nome
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.strokeStyle = "rgba(0,0,0,0.5)";
    ctx.lineWidth = 3;
    ctx.font = "bold 11px ui-sans-serif, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.strokeText(p.name, p.x, groundY - 58);
    ctx.fillText(p.name, p.x, groundY - 58);

    // Indicador de arma selecionada
    var w = WEAPONS[p.selectedWeapon] || WEAPONS.cannon;
    ctx.font = "16px ui-sans-serif, sans-serif";
    ctx.fillText(w.icon, p.x, groundY - 72);
  }

  function drawProjectile() {
    var all = [projectile].concat(extraProjectiles);
    for (var pi = 0; pi < all.length; pi++) {
      var pr = all[pi];
      if (!pr || pr.dead) continue;
      // trilha
      for (var i = 0; i < pr.trail.length; i++) {
        var t = pr.trail[i];
        var alpha = (i / pr.trail.length) * 0.6;
        var r = 2 + (i / pr.trail.length) * 4;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(t.x, t.y, r, 0, Math.PI * 2);
        ctx.fillStyle = pr.trailColor;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      // projétil
      ctx.beginPath();
      ctx.arc(pr.x, pr.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = pr.color;
      ctx.fill();
      // brilho
      ctx.beginPath();
      ctx.arc(pr.x - 2, pr.y - 2, 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.fill();
      // faísca para o míssil
      if (pr.homing > 0) {
        var angle = Math.atan2(pr.vy, pr.vx) + Math.PI;
        ctx.fillStyle = "#fbbf24";
        for (var s = 0; s < 3; s++) {
          var off = (Math.random() - 0.5) * 0.4;
          ctx.beginPath();
          ctx.arc(pr.x + Math.cos(angle + off) * (4 + Math.random() * 4), pr.y + Math.sin(angle + off) * (4 + Math.random() * 4), 1.5 + Math.random(), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  function drawEffects() {
    for (var i = 0; i < particles.length; i++) {
      var pt = particles[i];
      ctx.globalAlpha = Math.max(0, pt.life);
      if (pt.kind === "ring") {
        ctx.strokeStyle = pt.color;
        ctx.lineWidth = 4 * (pt.life / 0.3);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.stroke();
      } else if (pt.kind === "smoke") {
        ctx.globalAlpha = Math.max(0, pt.life * 0.5);
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fillStyle = pt.color;
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;

    ctx.textAlign = "center";
    for (var j = 0; j < floaters.length; j++) {
      var f = floaters[j];
      ctx.globalAlpha = Math.min(1, f.life);
      ctx.fillStyle = f.color;
      ctx.font = (f.big ? "900 22px" : "900 18px") + " ui-sans-serif, system-ui, sans-serif";
      ctx.strokeStyle = "rgba(0,0,0,0.55)";
      ctx.lineWidth = 3;
      ctx.strokeText(f.txt, f.x, f.y);
      ctx.fillText(f.txt, f.x, f.y);
    }
    ctx.globalAlpha = 1;
  }

  function drawWindArrow() {
    if (state.phase === "menu") return;
    var cx = W / 2;
    var cy = 36;
    ctx.font = "bold 12px ui-sans-serif, system-ui, sans-serif";
    ctx.textAlign = "center";
    var label = state.wind === 0 ? "Sem vento" : "Vento " + Math.abs(state.wind * 5) + " km/h";
    // pano de fundo
    var w = ctx.measureText(label).width + 30;
    ctx.fillStyle = "rgba(15, 23, 42, 0.4)";
    ctx.beginPath();
    ctx.roundRect(cx - w / 2, cy - 14, w, 24, 12);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.fillText(label, cx, cy + 1);
    if (state.wind !== 0) {
      var len = 14 + Math.abs(state.wind) * 2.5;
      var dir = state.wind > 0 ? 1 : -1;
      var ax = cx - 5 * dir;
      ctx.strokeStyle = "#fff";
      ctx.fillStyle = "#fff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(ax - (len / 2) * dir, cy + 18);
      ctx.lineTo(ax + (len / 2) * dir, cy + 18);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(ax + (len / 2) * dir + 7 * dir, cy + 18);
      ctx.lineTo(ax + (len / 2 - 7) * dir, cy + 13);
      ctx.lineTo(ax + (len / 2 - 7) * dir, cy + 23);
      ctx.closePath();
      ctx.fill();
    }
  }

  function drawAimGuide() {
    if (state.phase !== "aim") return;
    var p = current();
    if (!p || p.isAI) return;
    // Linha tracejada da mira
    var m = muzzleOf(p);
    var a = (p.angle * Math.PI) / 180;
    var speed = powerToSpeed(p.power);
    var x = m.x, y = m.y;
    var vx = Math.cos(a) * speed * p.facing;
    var vy = -Math.sin(a) * speed;
    var weapon = WEAPONS[p.selectedWeapon] || WEAPONS.cannon;
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.moveTo(x, y);
    var dt = BASE_CONFIG.dt;
    for (var s = 0; s < 40; s++) {
      vx += state.wind * BASE_CONFIG.windAccel * weapon.windMult * dt;
      vy += BASE_CONFIG.gravity * dt;
      x += vx * dt;
      y += vy * dt;
      if (x < 0 || x > W || y > H) break;
      if (y >= groundYAt(x)) break;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function draw() {
    ctx.save();
    if (screenShake > 0) {
      ctx.translate((Math.random() - 0.5) * screenShake, (Math.random() - 0.5) * screenShake);
    }
    drawSky();
    drawTerrain();
    if (state.players.length === 2) {
      drawCannon(state.players[0], state.turn === 0 && state.phase !== "menu" && state.phase !== "end");
      drawCannon(state.players[1], state.turn === 1 && state.phase !== "menu" && state.phase !== "end");
    }
    drawAimGuide();
    drawProjectile();
    drawEffects();
    drawWindArrow();
    ctx.restore();
  }

  // ============================================================
  // 12. CRONÔMETROS E HUD
  // ============================================================
  function startTick() {
    stopTick();
    state.tickId = window.setInterval(tick, 100);
  }

  function stopTick() {
    if (state.tickId) {
      window.clearInterval(state.tickId);
      state.tickId = null;
    }
  }

  function fmtTime(sec) {
    return Math.max(0, sec).toFixed(1).replace(".", ",") + "s";
  }

  function tick() {
    var now = Date.now();
    if (state.phase === "question" && !current().isAI) {
      var qLeft = (state.qDeadline - now) / 1000;
      els.questionTimerBar.style.width = Math.max(0, (qLeft / diffCfg().questionTime) * 100) + "%";
      if (qLeft <= 0) {
        var p = current();
        p.questions += 1;
        p.streak = 0;
        state.shotBonus = false;
        showFeedback(false, false);
        soundBad();
        state.phase = "aim-pending";
        setTimeout(beginAim, 900);
      }
    }
    if (state.phase === "aim") {
      var left = (state.turnDeadline - now) / 1000;
      els.timer.textContent = fmtTime(left);
      if (left < 5) {
        document.querySelector(".timer-pill").classList.add("urgent");
      } else {
        document.querySelector(".timer-pill").classList.remove("urgent");
      }
      if (left <= 0) {
        if (current().isAI) return;
        fire();
      }
    } else if (state.phase !== "end") {
      els.timer.textContent = "—";
      document.querySelector(".timer-pill").classList.remove("urgent");
    }
  }

  function updateHUD() {
    if (state.players.length !== 2) return;
    var a = state.players[0];
    var b = state.players[1];
    els.hpP1.style.width = Math.max(0, a.hp / diffCfg().hp * 100) + "%";
    els.hpP2.style.width = Math.max(0, b.hp / diffCfg().hp * 100) + "%";
    els.hpNumP1.textContent = String(Math.max(0, a.hp));
    els.hpNumP2.textContent = String(Math.max(0, b.hp));
    els.hpP1.classList.toggle("low", a.hp / diffCfg().hp < 0.3);
    els.hpP2.classList.toggle("low", b.hp / diffCfg().hp < 0.3);
    els.score.textContent = String(state.score);

    // Sequências (streak)
    if (a.streak >= 2) { els.streakP1.hidden = false; els.streakP1.textContent = "🔥 " + a.streak; }
    else els.streakP1.hidden = true;
    if (b.streak >= 2) { els.streakP2.hidden = false; els.streakP2.textContent = "🔥 " + b.streak; }
    else els.streakP2.hidden = true;

    if (state.phase === "menu") {
      els.wind.textContent = "Vento: —";
      els.turnLabel.textContent = "Escolha o modo";
      els.timer.textContent = "—";
      return;
    }

    var windKmh = Math.abs(state.wind * 5);
    els.wind.textContent = state.wind === 0
      ? "Vento: calmo"
      : "Vento: " + windKmh + " km/h " + (state.wind > 0 ? "→" : "←");

    var p = current();
    var phaseTxt =
      state.phase === "question"
        ? (p.isAI ? "🤖 Calculando…" : "📋 Responda à conta!")
        : state.phase === "aim"
        ? (p.isAI ? "🤖 Mirando…" : "🎯 Vez de " + p.name)
        : state.phase === "flying"
        ? "💥 Projétil a caminho!"
        : "—";
    els.turnLabel.textContent = phaseTxt;
  }

  function showBoardHint(text) {
    els.boardHint.textContent = text;
    els.boardHint.hidden = false;
    clearTimeout(showBoardHint._t);
    showBoardHint._t = setTimeout(function () { els.boardHint.hidden = true; }, 2000);
  }

  // ============================================================
  // 13. CONTRATO COM O PORTAL
  // ============================================================
  window.parent.postMessage({ type: "vrgame:ready" }, "*");

  function applyTheme(theme) {
    if (theme === "dark" || theme === "light") {
      document.documentElement.dataset.theme = theme;
      updateThemeIcon();
    }
  }

  function updateThemeIcon() {
    var dark = document.documentElement.dataset.theme === "dark";
    if (els.themeToggle) {
      els.themeToggle.querySelector(".icon-theme").textContent = dark ? "☀️" : "🌙";
    }
  }

  function preferredTheme() {
    try {
      var fromQuery = new URLSearchParams(window.location.search).get("theme");
      if (fromQuery === "dark" || fromQuery === "light") return fromQuery;
    } catch (e) {}
    try {
      var saved = window.localStorage.getItem("bc-theme");
      if (saved === "dark" || saved === "light") return saved;
    } catch (e) {}
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  var lastHeight = 0;
  function reportHeight() {
    var height = Math.ceil(document.body.getBoundingClientRect().height);
    if (Math.abs(height - lastHeight) < 4) return;
    lastHeight = height;
    window.parent.postMessage({ type: "vrgame:resize", height: height }, "*");
  }

  window.addEventListener("message", function (event) {
    if (!event.data) return;
    if (event.data.type === "vrgame:theme") applyTheme(event.data.theme);
    if (event.data.type === "vrgame:fullscreen") {
      document.documentElement.classList.toggle("is-fullscreen", Boolean(event.data.fullscreen));
    }
  });

  // ============================================================
  // 14. EVENTOS DE INTERFACE
  // ============================================================
  // Dificuldade
  els.diffButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      els.diffButtons.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      state.difficulty = btn.dataset.diff;
      soundClick();
    });
  });

  els.modePvp.addEventListener("click", function () { soundClick(); newGame("pvp"); });
  els.modeAi.addEventListener("click", function () { soundClick(); newGame("ai"); });

  els.playAgain.addEventListener("click", function () {
    soundClick();
    els.result.hidden = true;
    els.menu.hidden = false;
    state.phase = "menu";
    updateHUD();
  });

  els.restart.addEventListener("click", function () {
    soundClick();
    stopTick();
    state.phase = "menu";
    state.players = [];
    projectile = null;
    extraProjectiles = [];
    particles = [];
    floaters = [];
    genTerrain();
    initClouds();
    els.result.hidden = true;
    els.menu.hidden = false;
    els.questionBox.hidden = true;
    els.controls.hidden = true;
    updateHUD();
  });

  els.soundToggle.addEventListener("click", function () {
    state.soundOn = !state.soundOn;
    els.soundToggle.classList.toggle("muted", !state.soundOn);
    els.soundToggle.querySelector(".icon-on").textContent = state.soundOn ? "🔊" : "🔇";
    if (state.soundOn) soundClick();
  });

  els.themeToggle.addEventListener("click", function () {
    var newT = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(newT);
    try { window.localStorage.setItem("bc-theme", newT); } catch (e) {}
    soundClick();
  });

  els.questionSubmit.addEventListener("click", submitAnswer);
  els.questionAnswer.addEventListener("keydown", function (e) {
    if (e.key === "Enter") submitAnswer();
  });

  els.angle.addEventListener("input", function () {
    var p = current();
    if (!p || p.isAI) return;
    p.angle = parseInt(els.angle.value, 10);
    els.angleVal.textContent = p.angle + "°";
  });
  els.power.addEventListener("input", function () {
    var p = current();
    if (!p || p.isAI) return;
    p.power = parseInt(els.power.value, 10);
    els.powerVal.textContent = String(p.power);
  });
  els.fire.addEventListener("click", fire);

  // ============================================================
  // 15. CONTROLE POR TOQUE/ARASTAR NO CANVAS (mobile-first)
  // ============================================================
  function getCanvasPos(clientX, clientY) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  function onPointerDown(e) {
    if (state.phase !== "aim") return;
    var p = current();
    if (!p || p.isAI) return;
    var pos = getCanvasPos(e.clientX, e.clientY);
    var piv = pivotOf(p);
    // Aceita toque em qualquer lugar do canhão
    if (Math.hypot(pos.x - piv.x, pos.y - piv.y) < 80) {
      state.aimDrag = { startX: pos.x, startY: pos.y, active: true };
      els.dragHint.classList.add("hidden");
      canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId);
      e.preventDefault();
    }
  }

  function onPointerMove(e) {
    if (!state.aimDrag || !state.aimDrag.active) return;
    var p = current();
    if (!p) return;
    var pos = getCanvasPos(e.clientX, e.clientY);
    var piv = pivotOf(p);
    var dx = pos.x - piv.x;
    var dy = piv.y - pos.y;
    // Ângulo em graus, 5-85
    var angle = Math.atan2(dy, Math.abs(dx)) * 180 / Math.PI;
    angle = Math.max(5, Math.min(85, Math.round(angle)));
    // Força baseada na distância
    var dist = Math.hypot(dx, dy);
    var power = Math.round((dist - 40) / 4);
    power = Math.max(BASE_CONFIG.powerMin, Math.min(BASE_CONFIG.powerMax, power));
    p.angle = angle;
    p.power = power;
    syncSliders();
    e.preventDefault();
  }

  function onPointerUp(e) {
    if (state.aimDrag && state.aimDrag.active) {
      state.aimDrag.active = false;
      state.aimDrag = null;
      canvas.releasePointerCapture && e.pointerId && canvas.releasePointerCapture(e.pointerId);
    }
  }

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);

  // Atalhos de teclado (desktop)
  window.addEventListener("keydown", function (e) {
    if (state.phase === "question" && !current().isAI && document.activeElement !== els.questionAnswer) {
      els.questionAnswer.focus();
    }
    if (state.phase === "aim") {
      var p = current();
      if (!p || p.isAI) return;
      if (e.key === "ArrowUp") { p.angle = Math.min(85, p.angle + 1); syncSliders(); e.preventDefault(); }
      else if (e.key === "ArrowDown") { p.angle = Math.max(5, p.angle - 1); syncSliders(); e.preventDefault(); }
      else if (e.key === "ArrowRight") { p.power = Math.min(100, p.power + 2); syncSliders(); e.preventDefault(); }
      else if (e.key === "ArrowLeft") { p.power = Math.max(20, p.power - 2); syncSliders(); e.preventDefault(); }
      else if (e.key === " " || e.key === "Enter") { fire(); e.preventDefault(); }
    }
  });

  // ============================================================
  // 16. ARRANQUE
  // ============================================================
  applyTheme(preferredTheme());
  if (window.self === window.top) {
    document.documentElement.classList.add("is-standalone");
  }
  window.addEventListener("storage", function (event) {
    if (event.key === "bc-theme") applyTheme(event.newValue);
  });
  window.addEventListener("resize", reportHeight);
  if ("ResizeObserver" in window) {
    new ResizeObserver(reportHeight).observe(document.body);
  }
  window.requestAnimationFrame(reportHeight);

  document.getElementById("title").textContent = "Batalha de Canhões";
  genTerrain();
  initClouds();
  updateHUD();

  // Loop principal
  function frame() {
    if (state.phase === "flying") {
      // Projétil principal
      if (projectile && !projectile.dead) {
        stepProjectile(projectile);
        if (projectile && projectile.dead) projectile = null;
      } else if (!projectile && extraProjectiles.length > 0) {
        projectile = extraProjectiles.shift();
      }
      // Projéteis extras simultâneos (triple em voo ao mesmo tempo)
      for (var ei = extraProjectiles.length - 1; ei >= 0; ei--) {
        stepProjectile(extraProjectiles[ei]);
        if (extraProjectiles[ei].dead) extraProjectiles.splice(ei, 1);
      }
      // Se não há mais projéteis e a fase continua flying, encerra o turno
      if (!projectile && extraProjectiles.length === 0 && state.phase === "flying") {
        // Estado de espera: dar um pequeno delay para próximo turno
        if (!state._flyEndScheduled) {
          state._flyEndScheduled = true;
          setTimeout(function () {
            state._flyEndScheduled = false;
            if (state.phase === "flying" && !projectile && extraProjectiles.length === 0) {
              if (state.players[0].hp <= 0 || state.players[1].hp <= 0) endGame();
              else nextTurn();
            }
          }, 700);
        }
      }
    }
    stepEffects(BASE_CONFIG.dt * 2);
    draw();
    window.requestAnimationFrame(frame);
  }
  window.requestAnimationFrame(frame);
})();
