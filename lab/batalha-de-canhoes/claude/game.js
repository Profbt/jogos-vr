/*
 * BATALHA DE CANHÕES 2.0 — Jogos VR
 * Duelo de artilharia por turnos com matemática, vento, terreno destrutível,
 * armas especiais (Triplo e Mega), efeitos visuais e sons gerados no código.
 * Contrato do portal (não remover): vrgame:ready, vrgame:finish, vrgame:resize.
 */
(function () {
  "use strict";
  var C = { W: 960, H: 540, g: 900, vmin: 260, vmax: 880, wind: 14, wacc: 24, hp: 100, turn: 20, qtime: 12, aiHit: 0.75, aiErr: 3, S: 4 };
  var W = C.W, H = C.H, S = C.S;
  var $ = function (i) { return document.getElementById(i); };
  var cv = $("board"), ctx = cv.getContext("2d");
  var WP = {
    normal: { r: 30, dmg: 45, blast: 140, cost: 0, off: [0] },
    triple: { r: 22, dmg: 28, blast: 105, cost: 1, off: [-6, 0, 6] },
    mega: { r: 56, dmg: 60, blast: 190, cost: 1, off: [0] },
  };
  var st = { ph: "menu", mode: "pvp", pl: [], turn: 0, wind: 0, q: null, qEnd: 0, tEnd: 0, bonus: false, wp: "normal", shots: 0, t0: 0, shake: 0, flash: 0, tok: 0, over: false };
  var ter = [], clouds = [], stars = [], pr = [], pa = [], fl = [], rings = [], streaks = [];
  var T = 0;
  var rnd = function (a, b) { return a + Math.floor(Math.random() * (b - a + 1)); };

  // ---------- Áudio (sem arquivos externos) ----------
  var ac = null, muted = false, nt = 0, ms = 0, mi = null;
  function ctxA() {
    if (!ac) { var A = window.AudioContext || window.webkitAudioContext; if (!A) return null; ac = new A(); }
    if (ac.state === "suspended") ac.resume();
    return ac;
  }
  function tone(f, d, ty, v, to, at) {
    try {
      var a = ctxA(); if (!a || muted) return;
      var t = at || a.currentTime, o = a.createOscillator(), g = a.createGain();
      o.type = ty || "sine"; o.frequency.setValueAtTime(f, t);
      if (to) o.frequency.exponentialRampToValueAtTime(to, t + d);
      g.gain.setValueAtTime(v || 0.12, t); g.gain.exponentialRampToValueAtTime(0.001, t + d);
      o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + d);
    } catch (e) { /* sem áudio */ }
  }
  function noise(d, v, fq) {
    try {
      var a = ctxA(); if (!a || muted) return;
      var n = Math.floor(a.sampleRate * d), b = a.createBuffer(1, n, a.sampleRate), x = b.getChannelData(0);
      for (var i = 0; i < n; i++) x[i] = (Math.random() * 2 - 1) * (1 - i / n);
      var s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
      f.type = "lowpass"; f.frequency.value = fq || 900; g.gain.value = v;
      s.buffer = b; s.connect(f); f.connect(g); g.connect(a.destination); s.start();
    } catch (e) { /* sem áudio */ }
  }
  var BASS = [110, 110, 131, 98], ARP = [220, 262, 294, 330, 392, 330, 294, 262];
  function music() {
    if (!ac || muted) return;
    if (nt < ac.currentTime) nt = ac.currentTime + 0.05;
    while (nt < ac.currentTime + 0.5) {
      var b = Math.floor(ms / 8) % 4, i = ms % 8;
      if (i % 4 === 0) tone(BASS[b], 0.6, "triangle", 0.07, 0, nt);
      tone(ARP[(i * 3 + b) % 8], 0.18, "square", 0.016, 0, nt);
      nt += 0.2; ms++;
    }
  }
  function startMusic() { ctxA(); if (!mi) mi = setInterval(music, 150); }
  function toggleMute() { muted = !muted; $("mute").textContent = muted ? "🔇" : "🔊"; if (!muted) startMusic(); }
  var sfx = {
    fire: function () { tone(220, 0.2, "sawtooth", 0.14, 70); noise(0.15, 0.2, 1500); },
    boom: function (big) { noise(big ? 0.9 : 0.55, 0.5, big ? 500 : 800); tone(120, 0.4, "sine", 0.3, 35); },
    ok: function () { tone(660, 0.09, "sine", 0.12); setTimeout(function () { tone(990, 0.14, "sine", 0.12); }, 90); },
    bad: function () { tone(180, 0.28, "square", 0.1, 100); },
    hit: function () { tone(90, 0.2, "square", 0.15, 50); },
    win: function () { [523, 659, 784, 1047].forEach(function (f, i) { setTimeout(function () { tone(f, 0.25, "triangle", 0.15); }, i * 130); }); },
  };

  // ---------- Terreno ----------
  function genTerrain() {
    ter = [];
    var n = Math.ceil(W / S) + 1, base = H * 0.64, a = Math.random() * 6.28, b = Math.random() * 6.28, c = Math.random() * 6.28;
    for (var i = 0; i < n; i++) {
      var x = i * S;
      ter.push(base + Math.sin(x * 0.008 + a) * 34 + Math.sin(x * 0.021 + b) * 15 + Math.sin(x * 0.047 + c) * 7);
    }
    flat(80, 150); flat(W - 150, W - 80);
  }
  function flat(x0, x1) {
    var i0 = Math.floor(x0 / S), i1 = Math.ceil(x1 / S), m = ter[Math.floor((i0 + i1) / 2)];
    for (var i = i0; i <= i1; i++) { var t = Math.min(1, Math.abs(i - (i0 + i1) / 2) / 6); ter[i] = m * (1 - t) + ter[i] * t; }
  }
  function gy(x) { var i = Math.round(x / S); return i < 0 || i >= ter.length ? H : ter[i]; }
  function crater(cx, cy, r) {
    var i0 = Math.max(0, Math.floor((cx - r) / S)), i1 = Math.min(ter.length - 1, Math.ceil((cx + r) / S));
    for (var i = i0; i <= i1; i++) {
      var dx = i * S - cx, dy = Math.sqrt(Math.max(0, r * r - dx * dx));
      ter[i] = Math.min(H, Math.max(ter[i], cy + dy));
    }
  }
  function initScenery() {
    clouds = []; stars = []; streaks = [];
    for (var i = 0; i < 5; i++) clouds.push({ x: Math.random() * W, y: 40 + Math.random() * 130, s: 0.7 + Math.random(), v: 4 + Math.random() * 8 });
    for (i = 0; i < 70; i++) stars.push({ x: Math.random() * W, y: Math.random() * H * 0.45, r: Math.random() * 1.4 + 0.3 });
    for (i = 0; i < 28; i++) streaks.push({ x: Math.random() * W, y: Math.random() * H * 0.7, l: 10 + Math.random() * 18 });
  }

  // ---------- Jogadores ----------
  function mk(n, col, dk, ai, f, x) {
    return { name: n, color: col, dark: dk, isAI: ai, f: f, x: x, y: gy(x), hp: C.hp, disp: C.hp, angle: 45, power: 60, q: 0, ok: 0, ch: 0, rec: 0, hit: 0 };
  }
  function cur() { return st.pl[st.turn]; }
  function pivot(p) { return { x: p.x, y: p.y - 20 }; }
  function muzzle(p, ang) {
    var pv = pivot(p), a = ((ang === undefined ? p.angle : ang) * Math.PI) / 180;
    return { x: pv.x + Math.cos(a) * 34 * p.f, y: pv.y - Math.sin(a) * 34 };
  }
  function speedOf(pw) { return C.vmin + ((pw - 20) / 80) * (C.vmax - C.vmin); }

  // ---------- Desafio de matemática ----------
  function genQ() {
    var k = rnd(0, 3), a, b;
    if (k === 0) { a = rnd(11, 99); b = rnd(11, 99); return { t: a + " + " + b, a: a + b }; }
    if (k === 1) { a = rnd(21, 99); b = rnd(10, a - 1); return { t: a + " − " + b, a: a - b }; }
    if (k === 2) { a = rnd(3, 12); b = rnd(2, 9); return { t: a + " × " + b, a: a * b }; }
    b = rnd(2, 9); var q = rnd(2, 10); return { t: b * q + " ÷ " + b, a: q };
  }

  // ---------- Fluxo ----------
  function newGame(mode) {
    startMusic();
    st.mode = mode; st.turn = 0; st.shots = 0; st.t0 = Date.now(); st.over = false;
    pr = []; pa = []; fl = []; rings = [];
    genTerrain(); initScenery();
    st.pl = [mk("Jogador 1", "#38bdf8", "#0369a1", false, 1, 110), mk(mode === "ai" ? "Computador" : "Jogador 2", "#fb923c", "#c2410c", mode === "ai", -1, W - 110)];
    $("menu").hidden = true; $("result").hidden = true;
    $("name-p1").textContent = st.pl[0].name; $("name-p2").textContent = st.pl[1].name;
    startTurn();
  }
  function startTurn() {
    var p = cur(); st.tok++;
    var tok = st.tok;
    st.wind = rnd(-C.wind, C.wind); st.q = genQ(); st.bonus = false; st.wp = "normal"; st.ph = "question";
    st.qEnd = Date.now() + C.qtime * 1000;
    $("question-text").textContent = st.q.t; $("question-answer").value = "";
    $("question-feedback").hidden = true; $("question-box").hidden = p.isAI; $("controls").hidden = true;
    if (!p.isAI) setTimeout(function () { $("question-answer").focus(); }, 50);
    else setTimeout(function () { if (tok === st.tok) submit(Math.random() < C.aiHit ? st.q.a : -1); }, 1400);
    hud();
  }
  function submit(ans) {
    if (st.ph !== "question") return;
    var p = cur(), tok = st.tok, ok = ans === st.q.a;
    p.q++;
    if (ok) { p.ok++; p.ch = Math.min(2, p.ch + 1); st.bonus = true; sfx.ok(); } else sfx.bad();
    var f = $("question-feedback");
    f.hidden = false; f.className = "panel-feedback " + (ok ? "ok" : "bad");
    f.textContent = ok ? "Acertou! Dano em dobro e +1 carga ⚡" : "Resposta certa: " + st.q.a + ". Tiro normal.";
    if (p.isAI) text(p.x, p.y - 70, ok ? "Acertou a conta! ×2" : "Errou a conta", ok ? "#86efac" : "#fca5a5");
    st.ph = "feedback";
    setTimeout(function () { if (tok === st.tok) beginAim(); }, 900);
  }
  function beginAim() {
    var p = cur(), tok = st.tok;
    st.ph = "aim"; st.tEnd = Date.now() + C.turn * 1000;
    $("question-box").hidden = true; $("controls").hidden = p.isAI;
    sync(); hud();
    if (p.isAI) setTimeout(function () { if (tok === st.tok) aiShot(); }, 900);
  }
  function sync() {
    var p = cur();
    $("angle").value = p.angle; $("power").value = p.power;
    $("angle-val").textContent = p.angle + "°"; $("power-val").textContent = p.power;
    var bs = document.querySelectorAll(".wbtn");
    for (var i = 0; i < bs.length; i++) {
      var w = bs[i].getAttribute("data-w");
      bs[i].disabled = WP[w].cost > p.ch;
      bs[i].classList.toggle("on", w === st.wp);
    }
  }
  function setWp(w) { var p = cur(); if (st.ph !== "aim" || p.isAI || WP[w].cost > p.ch) return; st.wp = w; sync(); tone(500, 0.06, "square", 0.06); }
  function fire() {
    if (st.ph !== "aim") return;
    var p = cur(), w = WP[st.wp];
    if (w.cost > p.ch) st.wp = "normal", w = WP.normal;
    p.ch -= w.cost; st.ph = "flying"; st.shots++; $("controls").hidden = true;
    w.off.forEach(function (o) {
      var a = ((p.angle + o) * Math.PI) / 180, m = muzzle(p, p.angle + o), v = speedOf(p.power);
      pr.push({ x: m.x, y: m.y, vx: Math.cos(a) * v * p.f, vy: -Math.sin(a) * v, w: st.wp, trail: [] });
    });
    p.rec = 1; st.shake = 4; sfx.fire();
    var mz = muzzle(p);
    for (var i = 0; i < 10; i++) burst(mz.x, mz.y, "#e2e8f0", 60, 0.5, 4, -20);
    hud();
  }
  function stepProj(h) {
    for (var i = pr.length - 1; i >= 0; i--) {
      var q = pr[i];
      q.vx += st.wind * C.wacc * h; q.vy += C.g * h; q.x += q.vx * h; q.y += q.vy * h;
      if (Math.random() < 0.6) q.trail.push({ x: q.x, y: q.y, a: 1 });
      var hitP = st.pl.some(function (p) { return Math.hypot(p.x - q.x, p.y - 12 - q.y) < 20; });
      if ((q.x >= 0 && q.x <= W && q.y >= gy(q.x)) || hitP) { pr.splice(i, 1); boom(q.x, q.y, q.w); }
      else if (q.x < -60 || q.x > W + 60 || q.y > H + 50) pr.splice(i, 1);
    }
  }
  function boom(x, y, wk) {
    var w = WP[wk], big = wk === "mega";
    crater(x, y, w.r); st.shake = big ? 16 : 9; st.flash = big ? 0.5 : 0.25; sfx.boom(big);
    var k = big ? 2 : 1;
    for (var i = 0; i < 26 * k; i++) burst(x, y, i % 2 ? "#fbbf24" : "#f97316", 260 * k, 0.7, 5, 120);
    for (i = 0; i < 14 * k; i++) burst(x, y, "#475569", 90, 1.3, 9, -30);
    for (i = 0; i < 12; i++) burst(x, y, "#92400e", 220, 1.0, 3, 500);
    rings.push({ x: x, y: y, r: 6, max: w.blast * 0.8, a: 0.8 });
    st.pl.forEach(function (p) {
      var d = Math.hypot(p.x - x, p.y - 12 - y);
      if (d < w.blast) {
        var dm = Math.max(1, Math.round(w.dmg * (1 - d / w.blast) * (st.bonus ? 2 : 1)));
        p.hp = Math.max(0, p.hp - dm); p.hit = 1; sfx.hit();
        text(p.x, p.y - 45, "-" + dm + (st.bonus ? " ×2" : ""), "#fecaca");
      }
    });
  }
  function resolveCheck() {
    if (st.ph !== "flying" || pr.length) return;
    st.ph = "wait"; var tok = st.tok;
    setTimeout(function () {
      if (tok !== st.tok) return;
      if (st.pl[0].hp <= 0 || st.pl[1].hp <= 0) return endGame();
      st.turn = 1 - st.turn; startTurn();
    }, 1000);
  }
  function endGame() {
    st.ph = "end"; st.tok++;
    var a = st.pl[0], b = st.pl[1], win = a.hp <= 0 && b.hp <= 0 ? null : a.hp > b.hp ? a : b;
    st.pl.forEach(function (p) { if (p.hp <= 0) { boom(p.x, p.y - 12, "mega"); } });
    var tc = a.ok + b.ok, tq = Math.max(1, a.q + b.q), tm = Date.now() - st.t0;
    setTimeout(function () {
      sfx.win();
      $("result-icon").textContent = win ? "🏆" : "🤝";
      $("result-title").textContent = win ? win.name + " venceu!" : "Empate!";
      $("result-text").textContent = (win ? win.name + " destruiu o canhão adversário. " : "Os dois canhões caíram juntos. ") + "Acertos nas contas: " + tc + " de " + tq + " • Tiros disparados: " + st.shots + ".";
      $("result").hidden = false;
      window.parent.postMessage({ type: "vrgame:finish", score: tc, maxScore: tq, timeMs: tm, detail: { mode: st.mode, winner: win ? win.name : "empate", shots: st.shots, correctP1: a.ok, correctP2: b.ok } }, "*");
    }, 1500);
  }

  // ---------- IA ----------
  function simulate(p, ang, pw) {
    var m = muzzle(p, ang), a = (ang * Math.PI) / 180, v = speedOf(pw);
    var x = m.x, y = m.y, vx = Math.cos(a) * v * p.f, vy = -Math.sin(a) * v, h = 1 / 60;
    for (var i = 0; i < 400; i++) {
      vx += st.wind * C.wacc * h; vy += C.g * h; x += vx * h; y += vy * h;
      if (x < 0 || x > W || y > H) return { x: x, y: y };
      if (y >= gy(x) && i > 3) return { x: x, y: y };
    }
    return { x: x, y: y };
  }
  function aiShot() {
    var p = cur(), e = st.pl[1 - st.turn], best = null, bd = 1e9;
    for (var an = 15; an <= 80; an += 2) for (var pw = 30; pw <= 100; pw += 2) {
      var r = simulate(p, an, pw), d = Math.hypot(r.x - e.x, r.y - (e.y - 10));
      if (d < bd) { bd = d; best = { a: an, p: pw }; }
    }
    p.angle = Math.max(5, Math.min(85, best.a + rnd(-C.aiErr, C.aiErr)));
    p.power = Math.max(20, Math.min(100, best.p + rnd(-C.aiErr, C.aiErr)));
    if (p.ch > 0) st.wp = bd < 40 && Math.random() < 0.5 ? "mega" : "triple";
    var tok = st.tok; setTimeout(function () { if (tok === st.tok) fire(); }, 700);
  }

  // ---------- Efeitos ----------
  function burst(x, y, c, sp, life, r, g) {
    var a = Math.random() * 6.28, s = Math.random() * sp;
    pa.push({ x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - sp * 0.2, life: life * (0.5 + Math.random() * 0.5), max: life, r: r * (0.5 + Math.random() * 0.7), c: c, g: g });
  }
  function text(x, y, t, c) { fl.push({ x: x, y: y, t: t, c: c, life: 1.4 }); }
  function stepFx(dt) {
    for (var i = pa.length - 1; i >= 0; i--) {
      var p = pa[i]; p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
      if (p.life <= 0) pa.splice(i, 1);
    }
    for (i = fl.length - 1; i >= 0; i--) { fl[i].y -= 28 * dt; fl[i].life -= dt; if (fl[i].life <= 0) fl.splice(i, 1); }
    for (i = rings.length - 1; i >= 0; i--) { var r = rings[i]; r.r += 380 * dt; r.a -= 1.8 * dt; if (r.a <= 0 || r.r > r.max) rings.splice(i, 1); }
    pr.forEach(function (q) { for (var j = q.trail.length - 1; j >= 0; j--) { q.trail[j].a -= dt * 2.4; if (q.trail[j].a <= 0) q.trail.splice(j, 1); } });
    clouds.forEach(function (c) { c.x += c.v * dt; if (c.x > W + 80) c.x = -80; });
    streaks.forEach(function (s) { s.x += st.wind * 14 * dt; if (s.x > W + 30) s.x = -30; if (s.x < -30) s.x = W + 30; });
    st.pl.forEach(function (p) {
      var g = gy(p.x); p.y += Math.max(-300 * dt, Math.min(300 * dt, g - p.y));
      p.rec = Math.max(0, p.rec - dt * 4); p.hit = Math.max(0, p.hit - dt * 3);
      p.disp += (p.hp - p.disp) * 0.12;
    });
    st.shake = Math.max(0, st.shake - dt * 30); st.flash = Math.max(0, st.flash - dt * 1.5);
  }

  // ---------- Desenho ----------
  function drawSky() {
    var g = ctx.createLinearGradient(0, 0, 0, H * 0.75);
    g.addColorStop(0, "#0f0a33"); g.addColorStop(0.5, "#5b21b6"); g.addColorStop(1, "#fb923c");
    ctx.fillStyle = g; ctx.fillRect(-20, -20, W + 40, H + 40);
    stars.forEach(function (s, i) { ctx.globalAlpha = 0.3 + 0.5 * Math.abs(Math.sin(T * 1.5 + i)); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.28); ctx.fill(); });
    ctx.globalAlpha = 1;
    var sg = ctx.createRadialGradient(W / 2, H * 0.6, 10, W / 2, H * 0.6, 150);
    sg.addColorStop(0, "rgba(254,240,138,.95)"); sg.addColorStop(0.3, "rgba(251,146,60,.5)"); sg.addColorStop(1, "rgba(251,146,60,0)");
    ctx.fillStyle = sg; ctx.fillRect(W / 2 - 160, H * 0.6 - 160, 320, 320);
    [["#3b1d6e", 0.5, 70, 0.006], ["#2a1250", 0.58, 50, 0.011]].forEach(function (m) {
      ctx.fillStyle = m[0]; ctx.beginPath(); ctx.moveTo(0, H);
      for (var x = 0; x <= W; x += 16) ctx.lineTo(x, H * m[1] + Math.sin(x * m[3] + m[2]) * 34 + Math.sin(x * m[3] * 2.7) * 12);
      ctx.lineTo(W, H); ctx.fill();
    });
    ctx.fillStyle = "rgba(255,255,255,.12)";
    clouds.forEach(function (c) { ctx.beginPath(); ctx.ellipse(c.x, c.y, 50 * c.s, 14 * c.s, 0, 0, 6.28); ctx.ellipse(c.x + 28 * c.s, c.y - 8 * c.s, 30 * c.s, 12 * c.s, 0, 0, 6.28); ctx.fill(); });
    ctx.strokeStyle = "rgba(255,255,255,.22)"; ctx.lineWidth = 1.5;
    streaks.forEach(function (s) { ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x + Math.sign(st.wind) * s.l * Math.min(1, Math.abs(st.wind) / 6), s.y); ctx.stroke(); });
  }
  function drawTerrain() {
    var g = ctx.createLinearGradient(0, H * 0.5, 0, H);
    g.addColorStop(0, "#8b5a2b"); g.addColorStop(1, "#2b1a10");
    ctx.beginPath(); ctx.moveTo(0, H);
    for (var i = 0; i < ter.length; i++) ctx.lineTo(i * S, ter[i]);
    ctx.lineTo(W, H); ctx.closePath(); ctx.fillStyle = g; ctx.fill();
    ctx.beginPath(); for (i = 0; i < ter.length; i++) (i ? ctx.lineTo(i * S, ter[i]) : ctx.moveTo(0, ter[0]));
    ctx.strokeStyle = "#4ade80"; ctx.lineWidth = 5; ctx.lineJoin = "round"; ctx.stroke();
    ctx.strokeStyle = "rgba(0,0,0,.18)"; ctx.lineWidth = 2; ctx.translate(0, 7); ctx.stroke(); ctx.translate(0, -7);
  }
  function drawTank(p, active) {
    ctx.save(); ctx.translate(p.x, p.y);
    ctx.fillStyle = "rgba(0,0,0,.3)"; ctx.beginPath(); ctx.ellipse(0, 1, 28, 5, 0, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#111827"; ctx.beginPath(); ctx.roundRect(-24, -10, 48, 11, 5); ctx.fill();
    ctx.fillStyle = "#475569"; for (var i = -16; i <= 16; i += 11) { ctx.beginPath(); ctx.arc(i, -4.5, 4, 0, 6.28); ctx.fill(); }
    ctx.fillStyle = p.hit > 0 ? "#fff" : p.color; ctx.beginPath(); ctx.roundRect(-19, -20, 38, 12, 4); ctx.fill();
    ctx.save(); ctx.translate(0, -20); ctx.scale(p.f, 1); ctx.rotate((-p.angle * Math.PI) / 180);
    ctx.fillStyle = "#cbd5e1"; ctx.fillRect(-p.rec * 6, -3.5, 30, 7); ctx.fillStyle = "#64748b"; ctx.fillRect(24 - p.rec * 6, -4.5, 7, 9);
    ctx.restore();
    ctx.fillStyle = p.dark; ctx.beginPath(); ctx.arc(0, -20, 10, Math.PI, 0); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.beginPath(); ctx.arc(-3, -24, 3, 0, 6.28); ctx.fill();
    if (active) { var b = Math.sin(T * 6) * 3; ctx.fillStyle = p.color; ctx.beginPath(); ctx.moveTo(0, -50 + b); ctx.lineTo(-8, -64 + b); ctx.lineTo(8, -64 + b); ctx.fill(); }
    if (p.ch > 0) { ctx.font = "bold 13px system-ui"; ctx.textAlign = "center"; ctx.fillText("⚡".repeat(p.ch), 0, -36); }
    ctx.restore();
  }
  function drawAim(p) {
    var m = muzzle(p), a = (p.angle * Math.PI) / 180, v = speedOf(p.power), x = m.x, y = m.y, vx = Math.cos(a) * v * p.f, vy = -Math.sin(a) * v, h = 0.045;
    for (var i = 0; i < 12; i++) {
      vx += st.wind * C.wacc * h; vy += C.g * h; x += vx * h; y += vy * h;
      ctx.globalAlpha = 0.8 - i * 0.065; ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(x, y, 3, 0, 6.28); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  function draw() {
    ctx.save();
    if (st.shake > 0) ctx.translate((Math.random() - 0.5) * st.shake, (Math.random() - 0.5) * st.shake);
    drawSky(); drawTerrain();
    st.pl.forEach(function (p, i) { if (p.hp > 0 || st.ph !== "end") drawTank(p, st.ph !== "end" && i === st.turn); });
    if (st.ph === "aim" && !cur().isAI) drawAim(cur());
    pr.forEach(function (q) {
      q.trail.forEach(function (t) { ctx.globalAlpha = t.a * 0.7; ctx.fillStyle = "#fde68a"; ctx.beginPath(); ctx.arc(t.x, t.y, 3 * t.a + 1, 0, 6.28); ctx.fill(); });
      ctx.globalAlpha = 1; var gl = ctx.createRadialGradient(q.x, q.y, 1, q.x, q.y, 14);
      gl.addColorStop(0, "#fff"); gl.addColorStop(0.4, "rgba(253,224,71,.8)"); gl.addColorStop(1, "rgba(253,224,71,0)");
      ctx.fillStyle = gl; ctx.fillRect(q.x - 14, q.y - 14, 28, 28);
    });
    rings.forEach(function (r) { ctx.globalAlpha = Math.max(0, r.a); ctx.strokeStyle = "#fde68a"; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, 6.28); ctx.stroke(); });
    pa.forEach(function (p) { ctx.globalAlpha = Math.max(0, p.life / p.max); ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.28); ctx.fill(); });
    ctx.globalAlpha = 1; ctx.font = "bold 20px system-ui"; ctx.textAlign = "center";
    fl.forEach(function (f) { ctx.globalAlpha = Math.min(1, f.life); ctx.lineWidth = 4; ctx.strokeStyle = "rgba(0,0,0,.6)"; ctx.strokeText(f.t, f.x, f.y); ctx.fillStyle = f.c; ctx.fillText(f.t, f.x, f.y); });
    ctx.globalAlpha = 1; ctx.restore();
    if (st.flash > 0) { ctx.fillStyle = "rgba(255,240,200," + st.flash + ")"; ctx.fillRect(0, 0, W, H); }
    var vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.5, W / 2, H / 2, W * 0.7);
    vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,.4)"); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  }

  // ---------- HUD ----------
  var lastHud = "";
  function hud() {
    var p = cur(), w = st.wind;
    $("wind").textContent = "Vento: " + (w === 0 ? "calmo" : (w < 0 ? "◀ " : "▶ ") + Math.abs(w));
    $("turn-label").textContent = p ? p.name + (p.ch ? " ⚡" + p.ch : "") : "—";
  }
  function hudBars() {
    if (!st.pl.length) return;
    var k = st.pl.map(function (p) { return Math.round(p.disp); }).join();
    if (k === lastHud) return; lastHud = k;
    ["p1", "p2"].forEach(function (id, i) {
      var p = st.pl[i], pc = Math.max(0, p.disp);
      $("hp-" + id).style.width = pc + "%"; $("hp-" + id).classList.toggle("low", pc < 30);
      $("hpnum-" + id).textContent = Math.round(pc);
    });
  }
  function timers() {
    var now = Date.now(), p = cur();
    if (st.ph === "question") {
      var r = Math.max(0, st.qEnd - now);
      $("question-timerbar").style.width = (r / (C.qtime * 10)) + "%"; $("timer").textContent = p.isAI ? "IA" : Math.ceil(r / 1000) + "s";
      if (r <= 0 && !p.isAI) submit(null);
    } else if (st.ph === "aim") {
      var t = Math.max(0, st.tEnd - now); $("timer").textContent = p.isAI ? "IA" : Math.ceil(t / 1000) + "s";
      if (t <= 0 && !p.isAI) fire();
    } else if (st.ph === "menu" || st.ph === "end") $("timer").textContent = "—";
  }

  // ---------- Loop ----------
  var last = performance.now();
  function frame(now) {
    var dt = Math.min(0.05, (now - last) / 1000); last = now; T += dt;
    if (st.ph === "flying") { var n = Math.max(1, Math.round(dt * 120)); for (var i = 0; i < n; i++) stepProj(1 / 120); resolveCheck(); }
    stepFx(dt); timers(); hudBars(); draw();
    requestAnimationFrame(frame);
  }

  // ---------- Portal e tema (não remover) ----------
  window.parent.postMessage({ type: "vrgame:ready" }, "*");
  function applyTheme(t) { if (t === "dark" || t === "light") document.documentElement.dataset.theme = t; }
  var lastH = 0;
  function reportHeight() {
    var h = Math.ceil(document.body.getBoundingClientRect().height);
    if (Math.abs(h - lastH) < 4) return; lastH = h;
    window.parent.postMessage({ type: "vrgame:resize", height: h }, "*");
  }
  window.addEventListener("message", function (e) {
    if (!e.data) return;
    if (e.data.type === "vrgame:theme") applyTheme(e.data.theme);
    if (e.data.type === "vrgame:fullscreen") document.documentElement.classList.toggle("is-fullscreen", Boolean(e.data.fullscreen));
  });
  window.addEventListener("resize", reportHeight);
  if ("ResizeObserver" in window) new ResizeObserver(reportHeight).observe(document.body);
  if (window.self === window.top) document.documentElement.classList.add("is-standalone");

  // ---------- Eventos ----------
  function toMenu() {
    st.tok++; st.ph = "menu"; st.pl = []; pr = []; pa = []; fl = []; rings = []; lastHud = "";
    genTerrain(); initScenery();
    $("result").hidden = true; $("menu").hidden = false; $("question-box").hidden = true; $("controls").hidden = true;
    $("hp-p1").style.width = $("hp-p2").style.width = "100%"; $("hpnum-p1").textContent = $("hpnum-p2").textContent = "100"; hud();
  }
  $("mode-pvp").addEventListener("click", function () { newGame("pvp"); });
  $("mode-ai").addEventListener("click", function () { newGame("ai"); });
  $("play-again").addEventListener("click", toMenu);
  $("restart").addEventListener("click", toMenu);
  $("mute").addEventListener("click", toggleMute);
  $("question-submit").addEventListener("click", function () { var v = $("question-answer").value; submit(v === "" ? null : parseInt(v, 10)); });
  $("question-answer").addEventListener("keydown", function (e) { if (e.key === "Enter") $("question-submit").click(); });
  $("angle").addEventListener("input", function () { var p = cur(); if (p && !p.isAI) { p.angle = parseInt($("angle").value, 10); $("angle-val").textContent = p.angle + "°"; } });
  $("power").addEventListener("input", function () { var p = cur(); if (p && !p.isAI) { p.power = parseInt($("power").value, 10); $("power-val").textContent = p.power; } });
  $("fire").addEventListener("click", fire);
  document.querySelectorAll(".wbtn").forEach(function (b) { b.addEventListener("click", function () { setWp(b.getAttribute("data-w")); }); });
  window.addEventListener("keydown", function (e) {
    var typing = document.activeElement && document.activeElement.id === "question-answer";
    if ((e.key === "m" || e.key === "M") && !typing) return toggleMute();
    var p = cur();
    if (st.ph !== "aim" || !p || p.isAI) return;
    var k = e.key, d = e.shiftKey ? 5 : 1;
    if (k === "ArrowUp") p.angle = Math.min(85, p.angle + d);
    else if (k === "ArrowDown") p.angle = Math.max(5, p.angle - d);
    else if (k === "ArrowRight") p.power = Math.min(100, p.power + d);
    else if (k === "ArrowLeft") p.power = Math.max(20, p.power - d);
    else if (k === " " || k === "Enter") fire();
    else if (k === "1") setWp("normal"); else if (k === "2") setWp("triple"); else if (k === "3") setWp("mega");
    else return;
    e.preventDefault(); sync();
  });

  applyTheme(new URLSearchParams(window.location.search).get("theme"));
  genTerrain(); initScenery(); hud();
  requestAnimationFrame(function (t) { last = t; requestAnimationFrame(frame); });
  window.requestAnimationFrame(reportHeight);
})();
