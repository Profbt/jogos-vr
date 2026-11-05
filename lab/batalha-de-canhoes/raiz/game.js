/*
 * BATALHA DE CANHÕES — Jogos VR
 * -----------------------------
 * Remake educativo inspirado no clássico "Bang! Bang!" (anos 90).
 * Duelo de artilharia em turnos: cada jogador resolve um desafio de
 * matemática para ganhar dano em dobro e depois ajusta ângulo e força
 * do canhão, com vento dinâmico e terreno destrutível.
 *
 * Contrato com o portal (não remover):
 *   - postMessage { type: "vrgame:ready" } ao carregar.
 *   - postMessage { type: "vrgame:finish", score, maxScore, timeMs } no fim.
 */
(function () {
  "use strict";

  // 1. Configuração do jogo.
  var CONFIG = {
    title: "Batalha de Canhões",
    width: 960,
    height: 540,
    gravity: 900,          // px/s²
    powerMin: 20,
    powerMax: 100,
    speedMin: 260,         // velocidade do projétil com força mínima
    speedMax: 880,         // velocidade do projétil com força máxima
    windMax: 14,           // vento máximo por turno (unidades de exibição)
    windAccel: 24,         // aceleração horizontal por unidade de vento
    hp: 100,
    craterRadius: 30,
    blastRadius: 140,      // raio de dano da explosão
    blastDamage: 45,       // dano máximo no centro
    turnTime: 20,          // segundos para mirar e atirar
    questionTime: 12,      // segundos para responder a conta
    aiHitChance: 0.75,     // chance de a IA acertar a conta
    aiError: 4,            // imprecisão de mira da IA (graus/força)
    dt: 1 / 60,
  };

  var canvas = document.getElementById("board");
  var ctx = canvas.getContext("2d");
  var W = CONFIG.width;
  var H = CONFIG.height;
  var COL_STEP = 4; // largura de cada coluna do terreno

  // Compatibilidade: roundRect em navegadores antigos.
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

  var els = {
    hpP1: document.getElementById("hp-p1"),
    hpP2: document.getElementById("hp-p2"),
    hpNumP1: document.getElementById("hpnum-p1"),
    hpNumP2: document.getElementById("hpnum-p2"),
    nameP1: document.getElementById("name-p1"),
    nameP2: document.getElementById("name-p2"),
    wind: document.getElementById("wind"),
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
    menu: document.getElementById("menu"),
    modePvp: document.getElementById("mode-pvp"),
    modeAi: document.getElementById("mode-ai"),
    result: document.getElementById("result"),
    resultIcon: document.getElementById("result-icon"),
    resultTitle: document.getElementById("result-title"),
    resultText: document.getElementById("result-text"),
    playAgain: document.getElementById("play-again"),
    restart: document.getElementById("restart"),
  };

  // 2. Estado global.
  var state = {
    phase: "menu", // menu | question | aim | flying | end
    mode: null,    // pvp | ai
    players: [],
    turn: 0,
    wind: 0,
    question: null,
    qDeadline: 0,
    turnDeadline: 0,
    tickId: null,
    startedAt: null,
    shots: 0,
    shotBonus: false, // dano em dobro no tiro atual
    aiThinking: false,
  };

  var terrain = [];
  var clouds = [];
  var projectile = null;
  var particles = [];
  var floaters = [];

  // 3. Áudio simples (sem arquivos externos).
  var audioCtx = null;

  function tone(freq, dur, type, vol, slideTo) {
    try {
      if (!audioCtx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        audioCtx = new AC();
      }
      if (audioCtx.state === "suspended") audioCtx.resume();
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      var now = audioCtx.currentTime;
      osc.type = type || "sine";
      osc.frequency.setValueAtTime(freq, now);
      if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, now + dur);
      gain.gain.setValueAtTime(vol || 0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + dur);
    } catch (err) {
      // sem áudio: o jogo continua normalmente
    }
  }

  function soundFire() { tone(280, 0.18, "square", 0.12, 90); }
  function soundBoom() { tone(130, 0.35, "sawtooth", 0.22, 40); }
  function soundOk() { tone(660, 0.09, "sine", 0.12); setTimeout(function () { tone(880, 0.12, "sine", 0.12); }, 90); }
  function soundBad() { tone(170, 0.22, "square", 0.1, 110); }

  // 4. Terreno destrutível (mapa de alturas).
  function genTerrain() {
    terrain = [];
    var cols = Math.ceil(W / COL_STEP) + 1;
    var base = H * 0.6;
    var p1 = Math.random() * Math.PI * 2;
    var p2 = Math.random() * Math.PI * 2;
    var p3 = Math.random() * Math.PI * 2;
    for (var i = 0; i < cols; i++) {
      var x = i * COL_STEP;
      var y =
        base +
        Math.sin(x * 0.008 + p1) * 34 +
        Math.sin(x * 0.021 + p2) * 15 +
        Math.sin(x * 0.047 + p3) * 7;
      terrain.push(y);
    }
    // Aplaina plataformas onde ficam os canhões.
    flatten(80, 150);
    flatten(W - 150, W - 80);
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

  // 5. Jogadores e canhões.
  function makePlayers(mode) {
    return [
      {
        name: "Jogador 1",
        color: "#2563eb",
        dark: "#1e40af",
        isAI: false,
        facing: 1,
        x: 110,
        hp: CONFIG.hp,
        angle: 45,
        power: 60,
        questions: 0,
        correct: 0,
      },
      {
        name: mode === "ai" ? "Computador" : "Jogador 2",
        color: "#ea580c",
        dark: "#c2410c",
        isAI: mode === "ai",
        facing: -1,
        x: W - 110,
        hp: CONFIG.hp,
        angle: 45,
        power: 60,
        questions: 0,
        correct: 0,
      },
    ];
  }

  function pivotOf(p) {
    return { x: p.x, y: groundYAt(p.x) - 14 };
  }

  function muzzleOf(p) {
    var piv = pivotOf(p);
    var a = (p.angle * Math.PI) / 180;
    return {
      x: piv.x + Math.cos(a) * 30 * p.facing,
      y: piv.y - Math.sin(a) * 30,
    };
  }

  function powerToSpeed(power) {
    var t = (power - CONFIG.powerMin) / (CONFIG.powerMax - CONFIG.powerMin);
    return CONFIG.speedMin + t * (CONFIG.speedMax - CONFIG.speedMin);
  }

  // 6. Desafio de matemática.
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

  // 7. Fluxo da partida.
  function newGame(mode) {
    stopTick();
    state.mode = mode;
    state.players = makePlayers(mode);
    state.turn = 0;
    state.shots = 0;
    state.startedAt = Date.now();
    state.shotBonus = false;
    state.aiThinking = false;
    projectile = null;
    particles = [];
    floaters = [];
    genTerrain();
    initClouds();
    els.menu.hidden = true;
    els.result.hidden = true;
    els.nameP1.textContent = state.players[0].name;
    els.nameP2.textContent = state.players[1].name;
    updateHUD();
    startTurn();
  }

  function current() {
    return state.players[state.turn];
  }

  function startTurn() {
    var p = current();
    state.wind = Math.round((Math.random() * 2 - 1) * CONFIG.windMax);
    state.question = genQuestion();
    state.shotBonus = false;
    state.phase = "question";
    state.aiThinking = false;

    // Mostra a pergunta. Contra a IA, a resposta do computador fica oculta.
    els.questionText.textContent = state.question.text;
    els.questionAnswer.value = "";
    els.questionFeedback.hidden = true;
    els.questionFeedback.className = "panel-feedback";
    els.questionBox.hidden = p.isAI;
    els.controls.hidden = true;
    els.fire.disabled = false;

    state.qDeadline = Date.now() + CONFIG.questionTime * 1000;
    startTick();

    if (p.isAI) {
      // A IA "pensa" na conta e depois atira sozinha.
      setTimeout(function () {
        if (state.phase !== "question") return;
        var hit = Math.random() < CONFIG.aiHitChance;
        p.questions += 1;
        if (hit) p.correct += 1;
        state.shotBonus = hit;
        showFeedback(hit, true);
        soundOk();
        setTimeout(beginAim, 1100);
      }, 1400);
    } else {
      els.questionAnswer.focus();
    }
    updateHUD();
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
        ? "✔ Resposta certa! Seu próximo tiro causa dano em dobro."
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
    if (ok) p.correct += 1;
    state.shotBonus = ok;
    showFeedback(ok, false);
    if (ok) soundOk(); else soundBad();
    state.phase = "aim-pending"; // trava novos envios
    setTimeout(beginAim, 900);
  }

  function beginAim() {
    if (state.phase === "end" || state.phase === "flying") return;
    var p = current();
    state.phase = "aim";
    els.questionBox.hidden = true;
    els.controls.hidden = p.isAI;
    syncSliders();
    state.turnDeadline = Date.now() + CONFIG.turnTime * 1000;
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
    var m = muzzleOf(p);
    var speed = powerToSpeed(p.power);
    var a = (p.angle * Math.PI) / 180;
    projectile = {
      x: m.x,
      y: m.y,
      vx: Math.cos(a) * speed * p.facing,
      vy: -Math.sin(a) * speed,
      trail: [],
      shooter: state.turn,
      bonus: state.shotBonus,
    };
    state.shots += 1;
    state.phase = "flying";
    els.controls.hidden = true;
    els.fire.disabled = true;
    soundFire();
    updateHUD();
  }

  function explode(x, y) {
    makeCrater(x, y, CONFIG.craterRadius);
    spawnExplosion(x, y);
    soundBoom();

    var shooter = projectile ? projectile.shooter : -1;
    var bonus = projectile ? projectile.bonus : false;

    for (var i = 0; i < state.players.length; i++) {
      var piv = pivotOf(state.players[i]);
      var d = Math.hypot(x - piv.x, y - piv.y);
      if (d < CONFIG.blastRadius) {
        var dmg = Math.round((1 - d / CONFIG.blastRadius) * CONFIG.blastDamage);
        if (i !== shooter && bonus) dmg *= 2; // dano em dobro só contra o rival
        dmg = Math.max(0, dmg);
        state.players[i].hp = Math.max(0, state.players[i].hp - dmg);
        floaters.push({
          x: piv.x,
          y: piv.y - 34,
          txt: "-" + dmg,
          color: dmg > 0 ? "#dc2626" : "#94a3b8",
          life: 1.4,
        });
      }
    }

    projectile = null;
    updateHUD();

    if (state.players[0].hp <= 0 || state.players[1].hp <= 0) {
      setTimeout(endGame, 900);
    } else {
      setTimeout(nextTurn, 900);
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

    var totalCorrect = a.correct + b.correct;
    var totalQuestions = Math.max(1, a.questions + b.questions);
    var timeMs = state.startedAt ? Date.now() - state.startedAt : 0;

    els.resultIcon.textContent = winner ? "🏆" : "🤝";
    els.resultTitle.textContent = winner ? winner.name + " venceu!" : "Empate!";
    els.resultText.textContent =
      (winner ? winner.name + " destruiu o canhão adversário. " : "Os dois canhões caíram juntos. ") +
      "Acertos nas contas: " + totalCorrect + " de " + totalQuestions +
      " • Tiros disparados: " + state.shots + ".";
    els.result.hidden = false;

    window.parent.postMessage(
      {
        type: "vrgame:finish",
        score: totalCorrect,
        maxScore: totalQuestions,
        timeMs: timeMs,
        detail: {
          mode: state.mode,
          winner: winner ? winner.name : "empate",
          shots: state.shots,
          correctP1: a.correct,
          correctP2: b.correct,
        },
      },
      "*"
    );
  }

  // 8. IA: testa combinações de ângulo/força e escolhe a melhor trajetória.
  function simulateShot(p, angle, power) {
    var m = muzzleOf(p);
    var enemy = state.players[1 - state.players.indexOf(p)];
    var target = pivotOf(enemy);
    var speed = powerToSpeed(power);
    var a = (angle * Math.PI) / 180;
    var x = m.x, y = m.y;
    var vx = Math.cos(a) * speed * p.facing;
    var vy = -Math.sin(a) * speed;
    var best = { x: x, y: y, d: Math.hypot(x - target.x, y - target.y) };
    for (var s = 0; s < 600; s++) {
      vx += state.wind * CONFIG.windAccel * CONFIG.dt;
      vy += CONFIG.gravity * CONFIG.dt;
      x += vx * CONFIG.dt;
      y += vy * CONFIG.dt;
      if (x < 0 || x > W || y > H) break;
      var d = Math.hypot(x - target.x, y - target.y);
      if (d < best.d) best = { x: x, y: y, d: d };
      if (y >= groundYAt(x)) break;
    }
    return best;
  }

  function aiComputeShot(p) {
    var best = null;
    var angle, power, res;
    for (angle = 15; angle <= 80; angle += 5) {
      for (power = CONFIG.powerMin; power <= CONFIG.powerMax; power += 5) {
        res = simulateShot(p, angle, power);
        if (!best || res.d < best.d) best = { angle: angle, power: power, d: res.d };
      }
    }
    // Refinamento em torno da melhor combinação.
    var a0 = Math.max(5, best.angle - 4);
    var a1 = Math.min(85, best.angle + 4);
    var p0 = Math.max(CONFIG.powerMin, best.power - 6);
    var p1 = Math.min(CONFIG.powerMax, best.power + 6);
    for (angle = a0; angle <= a1; angle += 1) {
      for (power = p0; power <= p1; power += 1) {
        res = simulateShot(p, angle, power);
        if (res.d < best.d) best = { angle: angle, power: power, d: res.d };
      }
    }
    // Imprecisão para a IA não ser perfeita.
    best.angle = Math.max(5, Math.min(85, best.angle + Math.round((Math.random() * 2 - 1) * CONFIG.aiError)));
    best.power = Math.max(CONFIG.powerMin, Math.min(CONFIG.powerMax, best.power + Math.round((Math.random() * 2 - 1) * CONFIG.aiError)));
    return best;
  }

  // 9. Física e animação.
  function stepProjectile() {
    if (!projectile) return;
    var pr = projectile;
    pr.trail.push({ x: pr.x, y: pr.y });
    if (pr.trail.length > 26) pr.trail.shift();

    pr.vx += state.wind * CONFIG.windAccel * CONFIG.dt;
    pr.vy += CONFIG.gravity * CONFIG.dt;
    pr.x += pr.vx * CONFIG.dt;
    pr.y += pr.vy * CONFIG.dt;

    // Acertou o canhão rival diretamente?
    for (var i = 0; i < state.players.length; i++) {
      var piv = pivotOf(state.players[i]);
      if (Math.hypot(pr.x - piv.x, pr.y - piv.y) < 18) {
        explode(pr.x, pr.y);
        return;
      }
    }

    if (pr.y >= groundYAt(pr.x)) {
      explode(pr.x, groundYAt(pr.x));
      return;
    }
    if (pr.x < -40 || pr.x > W + 40 || pr.y > H + 40) {
      projectile = null;
      setTimeout(nextTurn, 500);
    }
  }

  function spawnExplosion(x, y) {
    for (var i = 0; i < 30; i++) {
      var ang = Math.random() * Math.PI * 2;
      var sp = 60 + Math.random() * 240;
      particles.push({
        x: x,
        y: y,
        vx: Math.cos(ang) * sp,
        vy: Math.sin(ang) * sp - 80,
        r: 2 + Math.random() * 4,
        life: 0.6 + Math.random() * 0.6,
        color: Math.random() < 0.5 ? "#f59e0b" : "#ef4444",
      });
    }
  }

  function stepEffects(dt) {
    for (var i = particles.length - 1; i >= 0; i--) {
      var pt = particles[i];
      pt.vy += 500 * dt;
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      pt.life -= dt;
      if (pt.life <= 0) particles.splice(i, 1);
    }
    for (var j = floaters.length - 1; j >= 0; j--) {
      floaters[j].y -= 28 * dt;
      floaters[j].life -= dt;
      if (floaters[j].life <= 0) floaters.splice(j, 1);
    }
    for (var c = 0; c < clouds.length; c++) {
      clouds[c].x += clouds[c].v * dt;
      if (clouds[c].x > W + 90) clouds[c].x = -90;
    }
  }

  // 10. Desenho.
  function isDarkTheme() {
    return document.documentElement.dataset.theme === "dark";
  }

  function drawSky() {
    var dark = isDarkTheme();
    var g = ctx.createLinearGradient(0, 0, 0, H);
    if (dark) {
      g.addColorStop(0, "#0f172a");
      g.addColorStop(1, "#1e3a8a");
    } else {
      g.addColorStop(0, "#38bdf8");
      g.addColorStop(1, "#e0f2fe");
    }
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // sol / lua
    ctx.beginPath();
    ctx.arc(W - 120, 84, 34, 0, Math.PI * 2);
    ctx.fillStyle = dark ? "#e2e8f0" : "#fde047";
    ctx.fill();

    // nuvens
    ctx.fillStyle = dark ? "rgba(148,163,184,0.35)" : "rgba(255,255,255,0.85)";
    for (var i = 0; i < clouds.length; i++) {
      var c = clouds[i];
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, 42 * c.s, 16 * c.s, 0, 0, Math.PI * 2);
      ctx.ellipse(c.x + 26 * c.s, c.y + 5 * c.s, 30 * c.s, 12 * c.s, 0, 0, Math.PI * 2);
      ctx.ellipse(c.x - 28 * c.s, c.y + 6 * c.s, 28 * c.s, 11 * c.s, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawTerrain() {
    var dark = isDarkTheme();
    ctx.beginPath();
    ctx.moveTo(0, terrain[0]);
    for (var i = 1; i < terrain.length; i++) ctx.lineTo(i * COL_STEP, terrain[i]);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    var g = ctx.createLinearGradient(0, H * 0.5, 0, H);
    if (dark) {
      g.addColorStop(0, "#365314");
      g.addColorStop(1, "#1a2e05");
    } else {
      g.addColorStop(0, "#4d7c0f");
      g.addColorStop(1, "#3f6212");
    }
    ctx.fillStyle = g;
    ctx.fill();

    // linha do topo
    ctx.beginPath();
    ctx.moveTo(0, terrain[0]);
    for (var j = 1; j < terrain.length; j++) ctx.lineTo(j * COL_STEP, terrain[j]);
    ctx.strokeStyle = dark ? "#65a30d" : "#84cc16";
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  function drawCannon(p, active) {
    var piv = pivotOf(p);
    var groundY = groundYAt(p.x);

    // sombra
    ctx.beginPath();
    ctx.ellipse(p.x, groundY - 2, 26, 7, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fill();

    // corpo
    ctx.fillStyle = p.dark;
    ctx.beginPath();
    ctx.roundRect(p.x - 18, piv.y - 8, 36, 20, 6);
    ctx.fill();

    // rodas
    ctx.fillStyle = "#334155";
    ctx.beginPath();
    ctx.arc(p.x - 12, groundY - 6, 8, 0, Math.PI * 2);
    ctx.arc(p.x + 12, groundY - 6, 8, 0, Math.PI * 2);
    ctx.fill();

    // cano
    ctx.save();
    ctx.translate(piv.x, piv.y);
    ctx.rotate(-p.angle * (Math.PI / 180) * p.facing);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.roundRect(0, -6, 34, 12, 5);
    ctx.fill();
    ctx.restore();

    // bandeira / marcador do jogador da vez
    if (active) {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(p.x + 20 * p.facing, groundY - 4);
      ctx.lineTo(p.x + 20 * p.facing, groundY - 44);
      ctx.stroke();
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(p.x + 20 * p.facing, groundY - 44);
      ctx.lineTo(p.x + 20 * p.facing + 16 * p.facing, groundY - 38);
      ctx.lineTo(p.x + 20 * p.facing, groundY - 32);
      ctx.closePath();
      ctx.fill();
    }

    // nome
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "bold 12px ui-sans-serif, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(p.name, p.x, groundY - 56);
  }

  function drawProjectile() {
    if (!projectile) return;
    var pr = projectile;
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    for (var i = 0; i < pr.trail.length; i++) {
      var t = pr.trail[i];
      var r = 2 + (i / pr.trail.length) * 3;
      ctx.beginPath();
      ctx.arc(t.x, t.y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(pr.x, pr.y, 7, 0, Math.PI * 2);
    ctx.fillStyle = "#1f2937";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(pr.x - 2, pr.y - 2, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = "#e2e8f0";
    ctx.fill();
  }

  function drawEffects() {
    for (var i = 0; i < particles.length; i++) {
      var pt = particles[i];
      ctx.globalAlpha = Math.max(0, pt.life);
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
      ctx.fillStyle = pt.color;
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    ctx.textAlign = "center";
    ctx.font = "900 20px ui-sans-serif, system-ui, sans-serif";
    for (var j = 0; j < floaters.length; j++) {
      var f = floaters[j];
      ctx.globalAlpha = Math.min(1, f.life);
      ctx.fillStyle = f.color;
      ctx.fillText(f.txt, f.x, f.y);
    }
    ctx.globalAlpha = 1;
  }

  function drawWindArrow() {
    if (state.phase === "menu") return;
    var cx = W / 2;
    var cy = 42;
    ctx.font = "bold 13px ui-sans-serif, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    var label = state.wind === 0 ? "sem vento" : "vento " + Math.abs(state.wind * 5) + " km/h";
    ctx.fillText(label, cx, cy - 14);
    if (state.wind !== 0) {
      var len = 18 + Math.abs(state.wind) * 3;
      var dir = state.wind > 0 ? 1 : -1;
      ctx.strokeStyle = "rgba(255,255,255,0.95)";
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx - (len / 2) * dir, cy);
      ctx.lineTo(cx + (len / 2) * dir, cy);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + (len / 2) * dir + 10 * dir, cy);
      ctx.lineTo(cx + (len / 2 - 9) * dir, cy - 8);
      ctx.lineTo(cx + (len / 2 - 9) * dir, cy + 8);
      ctx.closePath();
      ctx.fill();
    }
  }

  function draw() {
    drawSky();
    drawTerrain();
    if (state.players.length === 2) {
      drawCannon(state.players[0], state.turn === 0 && state.phase !== "menu" && state.phase !== "end");
      drawCannon(state.players[1], state.turn === 1 && state.phase !== "menu" && state.phase !== "end");
    }
    drawProjectile();
    drawEffects();
    drawWindArrow();
  }

  // 11. Cronômetros.
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
      els.questionTimerBar.style.width = Math.max(0, (qLeft / CONFIG.questionTime) * 100) + "%";
      if (qLeft <= 0) {
        // Tempo esgotado: conta como erro.
        var p = current();
        p.questions += 1;
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
      if (left <= 0) {
        // Tempo esgotado: dispara com os valores atuais.
        if (current().isAI) return;
        fire();
      }
    } else if (state.phase !== "end") {
      els.timer.textContent = "—";
    }
  }

  // 12. HUD.
  function updateHUD() {
    if (state.players.length !== 2) return;
    var a = state.players[0];
    var b = state.players[1];
    els.hpP1.style.width = a.hp + "%";
    els.hpP2.style.width = b.hp + "%";
    els.hpNumP1.textContent = String(a.hp);
    els.hpNumP2.textContent = String(b.hp);

    if (state.phase === "menu") {
      els.wind.textContent = "Vento: —";
      els.turnLabel.textContent = "Escolha o modo";
      els.timer.textContent = "—";
      return;
    }

    var windKmh = Math.abs(state.wind * 5);
    els.wind.textContent =
      state.wind === 0
        ? "Vento: calmo"
        : "Vento: " + windKmh + " km/h " + (state.wind > 0 ? "→" : "←");

    var p = current();
    var phaseTxt =
      state.phase === "question"
        ? (p.isAI ? "Computador calculando…" : "Responda à conta!")
        : state.phase === "aim"
        ? (p.isAI ? "Computador mirando…" : "Vez de " + p.name)
        : state.phase === "flying"
        ? "Projétil a caminho!"
        : "—";
    els.turnLabel.textContent = phaseTxt;
  }

  // 13. Contrato com o portal (não remover).
  window.parent.postMessage({ type: "vrgame:ready" }, "*");

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
      // segue para a próxima opção
    }
    try {
      var saved = window.localStorage.getItem("theme");
      if (saved === "dark" || saved === "light") return saved;
    } catch (error) {
      // usa a preferência do sistema
    }
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

  // 14. Eventos de interface.
  els.modePvp.addEventListener("click", function () { newGame("pvp"); });
  els.modeAi.addEventListener("click", function () { newGame("ai"); });
  els.playAgain.addEventListener("click", function () {
    els.result.hidden = true;
    els.menu.hidden = false;
    state.phase = "menu";
    updateHUD();
  });
  els.restart.addEventListener("click", function () {
    stopTick();
    state.phase = "menu";
    state.players = [];
    projectile = null;
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

  // 15. Arranque.
  applyTheme(preferredTheme());
  if (window.self === window.top) {
    document.documentElement.classList.add("is-standalone");
  }
  window.addEventListener("storage", function (event) {
    if (event.key === "theme") applyTheme(event.newValue);
  });
  window.addEventListener("resize", reportHeight);
  if ("ResizeObserver" in window) {
    new ResizeObserver(reportHeight).observe(document.body);
  }
  window.requestAnimationFrame(reportHeight);

  document.getElementById("title").textContent = CONFIG.title;

  genTerrain();
  initClouds();
  updateHUD();

  // Loop principal: física em passos fixos e desenho.
  function frame() {
    if (state.phase === "flying") {
      stepProjectile();
      stepProjectile(); // 2 subpassos para trajetória mais suave
    }
    stepEffects(CONFIG.dt * 2);
    draw();
    window.requestAnimationFrame(frame);
  }
  window.requestAnimationFrame(frame);
})();
