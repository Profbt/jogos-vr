/* Batalha de Canhões 3.0. Offline, sem dependências externas. */
(function () {
  'use strict';
  const E = window.CannonEngine, W = E.W, H = E.H, HP = 150;
  const $ = id => document.getElementById(id);
  const canvas = $('board'), ctx = canvas.getContext('2d');
  const sky = document.createElement('canvas'), ground = document.createElement('canvas');
  sky.width = ground.width = W; sky.height = ground.height = H;
  const sx = sky.getContext('2d'), gx = ground.getContext('2d');
  const stepper = E.createStepper();
  const colors = ['#25a8bc', '#ef775e'];
  const state = { phase: 'menu', players: [], turn: 0, wind: 0, q: null, bonus: false,
    weapon: 'normal', elapsed: 0, remaining: 0, shots: 0, round: 1, mode: 'ai',
    difficulty: 'normal', mathLevel: 'normal', operation: 'mixed', timed: true,
    paused: false, terrain: [], projectiles: [], particles: [], floaters: [], rings: [],
    shake: 0, clock: 0, tutorial: false, finishSent: false, pendingResult: false };
  let aimCache = null, lastFrame = null, lastPaint = 0, lastTimer = '', lastHeight = 0;
  let muted = true, reduced = false, audio = null, noiseBuffer = null, drag = null;
  let tutorialIndex = 0, returnFocus = null;
  let feedbackTimer = 0, lastFeedback = '';
  try {
    muted = localStorage.getItem('cannon-muted') !== 'false';
    reduced = localStorage.getItem('cannon-effects') === 'reduced' || matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (_) { /* O jogo também funciona sem armazenamento. */ }
  const isPlaying = () => !['menu', 'end'].includes(state.phase);
  const current = () => state.players[state.turn];
  const humanAim = () => state.phase === 'aim' && current() && !current().isAI && !state.paused && !state.tutorial;
  const randomInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  function post(data) { window.parent.postMessage(data, '*'); }
  function focus(id) { const el = $(id); if (el && !document.hidden) el.focus({ preventScroll: true }); }
  function setText(id, text) { if ($(id).textContent !== String(text)) $(id).textContent = text; }
  function show(id, visible) { $(id).hidden = !visible; }
  function clearFeedbackTimer() {
    if (feedbackTimer) { window.clearTimeout(feedbackTimer); feedbackTimer = 0; }
  }
  function armFeedbackTimer(delay) {
    clearFeedbackTimer();
    feedbackTimer = window.setTimeout(function () {
      feedbackTimer = 0;
      if (state.phase === 'feedback' && !state.paused && !state.tutorial) beginAim();
    }, delay);
  }
  function saveSetting(key, value) { try { localStorage.setItem(key, value); } catch (_) {} }

  function audioContext() {
    if (muted) return null;
    try {
      if (!audio) { const AC = window.AudioContext || window.webkitAudioContext; if (AC) audio = new AC(); }
      if (audio && audio.state === 'suspended') { const result = audio.resume(); if (result) result.catch(() => {}); }
    } catch (_) { return null; }
    return audio;
  }
  function tone(freq, duration, volume, type, end, delay) {
    const a = audioContext(); if (!a) return;
    const t = a.currentTime + (delay || 0), oscillator = a.createOscillator(), gain = a.createGain();
    oscillator.type = type || 'sine'; oscillator.frequency.setValueAtTime(freq, t);
    if (end) oscillator.frequency.exponentialRampToValueAtTime(end, t + duration);
    gain.gain.setValueAtTime(volume, t); gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    oscillator.connect(gain); gain.connect(a.destination); oscillator.start(t); oscillator.stop(t + duration);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
  }
  function sound(kind) {
    if (muted) return;
    if (kind === 'ok') { tone(523, .15, .09); tone(784, .25, .07, 'sine', null, .1); }
    else if (kind === 'bad') tone(220, .18, .04, 'triangle', 160);
    else if (kind === 'fire') tone(190, .2, .09, 'triangle', 45);
    else if (kind === 'win') [523, 659, 784, 1047].forEach((f, i) => tone(f, .3, .07, 'triangle', null, i * .13));
    else if (kind === 'boom') {
      tone(90, .35, .12, 'sine', 28);
      const a = audioContext(); if (!a) return;
      if (!noiseBuffer) {
        noiseBuffer = a.createBuffer(1, Math.floor(a.sampleRate * .5), a.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
      }
      const source = a.createBufferSource(), gain = a.createGain(), filter = a.createBiquadFilter();
      source.buffer = noiseBuffer; filter.type = 'lowpass'; filter.frequency.value = 700; gain.gain.value = .2;
      source.connect(filter); filter.connect(gain); gain.connect(a.destination); source.start();
      source.onended = () => { source.disconnect(); filter.disconnect(); gain.disconnect(); };
    }
  }
  function updateSettings() {
    $('mute').setAttribute('aria-label', muted ? 'Ativar som' : 'Desligar som'); $('mute').title = muted ? 'Som desligado (M)' : 'Som ligado (M)';
    $('mute').setAttribute('aria-pressed', String(!muted)); $('mute').classList.toggle('is-muted', muted);
    $('effects').setAttribute('aria-label', reduced ? 'Ativar efeitos completos' : 'Reduzir efeitos visuais');
    $('effects').title = reduced ? 'Efeitos leves' : 'Efeitos completos'; $('effects').setAttribute('aria-pressed', String(reduced));
    document.documentElement.classList.toggle('reduced-motion', reduced);
  }
  function player(name, index, ai) {
    const x = index ? W - 140 : 140;
    return { name, x, y: E.terrainY(state.terrain, x), f: index ? -1 : 1, color: colors[index],
      hp: HP, displayed: HP, isAI: ai, angle: 45, power: 65, charges: 0, correct: 0, questions: 0,
      stats: { add: { correct: 0, total: 0 }, sub: { correct: 0, total: 0 }, mul: { correct: 0, total: 0 }, div: { correct: 0, total: 0 } },
      recoil: 0, hit: 0, lastImpact: null };
  }
  function readOptions() {
    return { mode: $('mode').value, difficulty: $('difficulty').value, mathLevel: $('math-level').value,
      operation: $('operation').value, timed: $('timed').checked };
  }
  function resetEffects() { state.projectiles = []; state.particles = []; state.floaters = []; state.rings = []; state.shake = 0; }
  function startGame(options) {
    const o = options || readOptions();
    state.mode = o.mode === 'pvp' ? 'pvp' : 'ai';
    state.difficulty = E.DIFFICULTIES[o.difficulty] ? o.difficulty : 'normal';
    state.mathLevel = E.DIFFICULTIES[o.mathLevel] ? o.mathLevel : 'normal';
    state.operation = ['mixed', 'add', 'sub', 'mul', 'div'].includes(o.operation) ? o.operation : 'mixed';
    state.timed = o.timed !== false;
    state.terrain = E.generateTerrain();
    state.players = [player(state.mode === 'ai' ? 'Você' : 'Jogador 1', 0, false), player(state.mode === 'ai' ? 'Computador' : 'Jogador 2', 1, state.mode === 'ai')];
    state.turn = 0; state.shots = 0; state.round = 1; state.elapsed = 0; state.paused = false;
    state.tutorial = false; state.finishSent = false; state.pendingResult = false;
    resetEffects(); stepper.reset(); lastFrame = null; aimCache = null;
    clearFeedbackTimer(); lastFeedback = ''; show('answer-note', false);
    ['menu', 'result', 'pause-overlay', 'tutorial'].forEach(id => show(id, false));
    document.documentElement.classList.remove('is-paused');
    $('pause').disabled = false;
    drawGround(); audioContext(); startTurn();
  }
  function startTurn() {
    clearFeedbackTimer(); lastFeedback = ''; show('answer-note', false);
    const p = current(), d = E.DIFFICULTIES[state.difficulty];
    state.wind = randomInt(-d.wind, d.wind); state.bonus = false; state.weapon = 'normal';
    state.q = E.makeQuestion(state.mathLevel, state.operation); state.phase = 'question';
    state.remaining = p.isAI ? .75 : d.questionTime;
    state.round = Math.floor(state.shots / 2) + 1;
    setText('question-text', state.q.text + ' ='); $('question-answer').value = '';
    $('question-answer').disabled = false; $('question-submit').disabled = false;
    setText('question-submit', 'Conferir resposta'); show('question-feedback', false);
    show('question-answer', true); aimCache = null;
    updateUI(); if (!p.isAI) focus('question-answer');
  }
  function answer(raw) {
    if (state.paused || state.tutorial) return;
    if (state.phase === 'feedback') { if (!current().isAI) beginAim(); return; }
    if (state.phase !== 'question') return;
    const p = current(), ok = E.isCorrectAnswer(raw, state.q.answer);
    p.questions++; p.stats[state.q.operation].total++;
    if (ok) { p.correct++; p.stats[state.q.operation].correct++; p.charges = Math.min(2, p.charges + 1); }
    state.bonus = ok; state.phase = 'feedback'; state.remaining = p.isAI ? .5 : 0;
    $('question-answer').disabled = true;
    const feedback = $('question-feedback'); feedback.className = 'question-feedback panel-feedback ' + (ok ? 'ok' : 'bad');
    feedback.textContent = (ok ? 'Muito bem! +50% de dano e +1 energia. ' : 'Vamos conferir: a resposta é ' + state.q.answer + '. ') + state.q.explanation;
    show('question-feedback', true); setText('question-submit', 'Preparar tiro →');
    lastFeedback = (ok ? '' : 'Resposta correta: ' + state.q.answer + '. ') + state.q.explanation;
    if (!p.isAI) armFeedbackTimer(900);
    sound(ok ? 'ok' : 'bad'); updateUI(); if (!p.isAI) focus('question-submit');
  }
  function beginAim() {
    clearFeedbackTimer();
    state.phase = 'aim'; state.remaining = current().isAI ? .7 : E.DIFFICULTIES[state.difficulty].aimTime;
    state.aiPrepared = false; aimCache = null; syncControls(); updateUI();
    if (!current().isAI) {
      if (lastFeedback) { setText('answer-note', lastFeedback); show('answer-note', true); }
      focus('angle');
    } else {
      show('answer-note', false);
    }
  }
  function setAim(angle, power) {
    if (!humanAim()) return;
    current().angle = Math.round(E.clamp(Number(angle) || 45, 5, 85));
    current().power = Math.round(E.clamp(Number(power) || 65, 20, 100));
    aimCache = null; syncControls();
  }
  function setWeapon(key) {
    if (!humanAim() || !E.WEAPONS[key] || E.WEAPONS[key].cost > current().charges) return;
    state.weapon = key; aimCache = null; syncControls();
  }
  function syncControls() {
    const p = current(); if (!p) return;
    $('angle').value = p.angle; $('power').value = p.power;
    setText('angle-val', p.angle + '°'); setText('power-val', p.power + '%');
    document.querySelectorAll('.wbtn').forEach(button => {
      const key = button.getAttribute('data-w');
      button.disabled = E.WEAPONS[key].cost > p.charges;
      button.classList.remove('selected');
      button.classList.toggle('on', key === state.weapon);
      button.setAttribute('aria-pressed', String(key === state.weapon));
    });
    const descriptions = { normal: 'Normal · preciso e sem custo de energia.', triple: 'Triplo · 3 projéteis em leque · custa 1 energia.', mega: 'Mega · explosão ampla · custa 2 energias.' };
    setText('weapon-hint', descriptions[state.weapon]);
    setText('bonus-label', state.bonus ? 'Tiro reforçado · +50% de dano' : 'Tiro padrão · capriche na mira');
    $('bonus-label').classList.toggle('boosted', state.bonus);
    setText('shot-hint', p.lastImpact ? 'O pequeno alvo marca seu último impacto. Ajuste a partir dele.' : 'Arraste no campo para mirar. Use os controles para ajustar.');
  }
  function fire() {
    if (state.phase !== 'aim' || state.paused || state.tutorial) return;
    const p = current(); let weapon = E.WEAPONS[state.weapon];
    if (weapon.cost > p.charges) { state.weapon = 'normal'; weapon = E.WEAPONS.normal; }
    p.charges -= weapon.cost; p.recoil = 1;
    state.projectiles = weapon.offsets.map(offset => Object.assign(E.createProjectile(p, p.angle, p.power, state.weapon, offset), { trail: [], trailTick: 0 }));
    state.phase = 'flying'; state.shots++; stepper.reset(); state.shake = reduced ? 0 : 2;
    const muzzle = E.muzzle(p, p.angle); particles(muzzle.x, muzzle.y, '#fff0cf', 12, 85);
    sound('fire'); updateUI();
  }
  function particles(x, y, color, count, speed) {
    count = reduced ? Math.ceil(count / 4) : count;
    for (let i = 0; i < count && state.particles.length < 180; i++) {
      const a = Math.random() * Math.PI * 2, v = speed * (.2 + Math.random() * .8);
      state.particles.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 30, life: .5 + Math.random() * .55, color, r: 2 + Math.random() * 5 });
    }
  }
  function explode(hit, projectile) {
    const weapon = E.WEAPONS[projectile.weapon];
    E.crater(state.terrain, hit.x, hit.y, weapon.radius); drawGround(); aimCache = null;
    current().lastImpact = { x: hit.x, y: hit.y };
    state.shake = reduced ? 0 : (projectile.weapon === 'mega' ? 7 : 3);
    particles(hit.x, hit.y, '#ffb54b', 28, 170); particles(hit.x, hit.y, '#f2714c', 20, 130);
    particles(hit.x, hit.y, '#866147', 15, 200);
    state.rings.push({ x: hit.x, y: hit.y, radius: 8, life: .5 }); sound('boom');
    state.players.forEach(p => {
      const distance = Math.hypot(p.x - hit.x, p.y - 21 - hit.y);
      if (distance < weapon.blast && p.hp > 0) {
        const damage = Math.max(1, Math.round(weapon.damage * (1 - distance / weapon.blast) * (state.bonus ? 1.5 : 1)));
        p.hp = Math.max(0, p.hp - damage); p.hit = .3;
        state.floaters.push({ x: p.x, y: p.y - 85, text: '−' + damage, color: '#9e352b', life: 1.5 });
      }
    });
  }
  function settlePlayers() {
    state.players.forEach(p => { p.y = E.terrainY(state.terrain, p.x); });
  }
  function finishGame() {
    if (state.finishSent) return;
    state.phase = 'end'; state.finishSent = true; $('pause').disabled = true;
    const alive = state.players.filter(p => p.hp > 0), winner = alive.length === 1 ? alive[0] : null;
    setText('result-title', winner ? (winner.name === 'Você' ? 'Vitória! Belo trabalho.' : winner.name + ' venceu!') : 'Um duelo empatado!');
    setText('result-text', state.shots + ' tiros · ' + formatTime(state.elapsed) + ' · ' + E.DIFFICULTIES[state.difficulty].label);
    const statsRoot = $('result-stats'); statsRoot.replaceChildren();
    const humans = state.players.filter(p => !p.isAI);
    humans.forEach(p => {
      const card = document.createElement('div'); card.className = 'result-player';
      const title = document.createElement('h3'); title.textContent = p.name + ' · ' + p.correct + '/' + p.questions + ' acertos'; card.appendChild(title);
      const names = { add: 'Adição', sub: 'Subtração', mul: 'Multiplicação', div: 'Divisão' };
      Object.keys(p.stats).forEach(key => {
        const stat = p.stats[key]; if (!stat.total) return;
        const row = document.createElement('p'); row.textContent = names[key] + ': ' + stat.correct + ' de ' + stat.total; card.appendChild(row);
      });
      statsRoot.appendChild(card);
    });
    show('result', true); updateUI(); focus('play-again'); sound('win');
    post({ type: 'vrgame:finish', score: humans.reduce((n, p) => n + p.correct, 0),
      maxScore: humans.reduce((n, p) => n + p.questions, 0), timeMs: Math.round(state.elapsed * 1000),
      detail: { mode: state.mode, difficulty: state.difficulty, mathLevel: state.mathLevel, operation: state.operation,
        winner: winner ? winner.name : 'empate', shots: state.shots,
        correctP1: state.players[0].correct, correctP2: state.players[1].isAI ? null : state.players[1].correct,
        players: humans.map(p => ({ name: p.name, correct: p.correct, questions: p.questions, operations: p.stats })) } });
  }
  function formatTime(seconds) { const n = Math.floor(seconds); return Math.floor(n / 60) + 'min ' + String(n % 60).padStart(2, '0') + 's'; }
  function pause() {
    if (!isPlaying() || state.paused || state.tutorial) return;
    clearFeedbackTimer();
    state.paused = true; drag = null; returnFocus = document.activeElement;
    show('pause-overlay', true); document.documentElement.classList.add('is-paused'); focus('resume');
    if (audio && audio.state === 'running') audio.suspend().catch(() => {});
  }
  function resume() {
    if (!state.paused || state.tutorial) return;
    state.paused = false; lastFrame = null; show('pause-overlay', false);
    document.documentElement.classList.remove('is-paused'); audioContext();
    if (state.phase === 'feedback' && current() && !current().isAI) armFeedbackTimer(600);
    if (returnFocus && returnFocus.focus) returnFocus.focus({ preventScroll: true });
  }
  function toMenu() {
    clearFeedbackTimer(); lastFeedback = '';
    state.phase = 'menu'; state.paused = false; state.tutorial = false; state.players = []; state.wind = 0; state.round = 1;
    resetEffects(); stepper.reset(); aimCache = null; drag = null; state.pendingResult = false;
    state.terrain = E.generateTerrain(); drawGround();
    ['result', 'pause-overlay', 'tutorial', 'question-box', 'controls', 'status-box', 'answer-note'].forEach(id => show(id, false));
    show('menu', true); $('pause').disabled = true;
    document.documentElement.classList.remove('is-paused'); updateUI(); focus('start-game');
  }
  const lessons = [
    ['01 / 04 · A conta prepara o disparo', 'Resolva a operação. Acertar dá +50% de dano e 1 energia, até o máximo de 2. Se errar, veja a explicação e continue: você ainda pode atirar.'],
    ['02 / 04 · Encontre sua trajetória', 'Arraste pelo campo para apontar o canhão: a direção ajusta o ângulo e a distância ajusta a força. Os controles e as setas do teclado permitem ajustes finos.'],
    ['03 / 04 · Leia o vento', 'A seta do vento mostra para onde ele empurra o tiro. No nível Explorador, a linha pontilhada mostra o caminho completo. O alvo pequeno marca seu último impacto.'],
    ['04 / 04 · Escolha seu momento', 'Normal não gasta energia; Triplo custa 1; Mega custa 2. Vença reduzindo a vida rival a zero. Você pode pausar a qualquer momento. No treino não há cronômetro.']
  ];
  function openTutorial() {
    if (state.tutorial) return;
    returnFocus = document.activeElement; state.tutorial = true; tutorialIndex = 0;
    show('tutorial', true); renderTutorial(); focus('tutorial-next');
  }
  function renderTutorial() {
    setText('tutorial-step', (tutorialIndex + 1) + ' de ' + lessons.length);
    setText('tutorial-title', lessons[tutorialIndex][0]); setText('tutorial-text', lessons[tutorialIndex][1]);
    setText('tutorial-next', tutorialIndex === lessons.length - 1 ? 'Entendi, vamos lá!' : 'Próximo →');
  }
  function closeTutorial() {
    state.tutorial = false; lastFrame = null; show('tutorial', false);
    if (state.phase === 'feedback' && current() && !current().isAI) armFeedbackTimer(600);
    if (returnFocus && returnFocus.focus) returnFocus.focus({ preventScroll: true });
    if (document.hidden && isPlaying() && !state.paused) pause();
  }
  function updateUI() {
    const p = current(), ai = p && p.isAI;
    show('question-box', !!p && !ai && ['question', 'feedback'].includes(state.phase));
    show('controls', !!p && !ai && state.phase === 'aim');
    const statusVisible = !!p && (ai || ['flying', 'settle', 'ending'].includes(state.phase));
    show('status-box', statusVisible);
    const statuses = {
      question: ['O computador está pensando', 'Ele também precisa resolver uma conta para carregar o canhão.'],
      feedback: [state.bonus ? 'O computador acertou a conta' : 'O computador errou a conta', state.bonus ? 'Próximo tiro com +50% de dano.' : 'Próximo tiro com dano padrão.'],
      aim: ['Calculando a trajetória…', 'Observe o vento e prepare sua estratégia.'],
      flying: ['Tiro a caminho!', 'Ângulo, força e vento trabalhando juntos.'],
      settle: ['Conferindo o impacto', 'O alvo no terreno guarda a posição do último tiro.'],
      ending: ['Fim do duelo', 'Vamos conferir o que você aprendeu.']
    };
    if (statuses[state.phase]) { setText('status-title', statuses[state.phase][0]); setText('status-text', statuses[state.phase][1]); }
    const labels = { menu: 'Pronto para jogar', question: '1 · Resolva', feedback: 'Confira e aprenda', aim: '2 · Mire e dispare', flying: '3 · Observe', settle: 'Impacto', ending: 'Duelo concluído', end: 'Duelo concluído' };
    setText('phase-label', labels[state.phase] || ''); setText('turn-label', p ? (p.name === 'Você' ? 'Sua vez' : 'Vez de ' + p.name) : 'Uma conta. Uma estratégia.');
    setText('round-label', 'Rodada ' + state.round);
    setText('wind', state.wind === 0 ? 'Vento calmo' : (state.wind > 0 ? '→ ' : '← ') + Math.abs(state.wind) + ' · vento');
    for (let i = 0; i < 2; i++) {
      const suffix = 'p' + (i + 1), pl = state.players[i];
      setText('name-' + suffix, pl ? pl.name : 'Jogador ' + (i + 1));
      setText('charge-' + suffix, pl ? pl.charges + ' / 2' : '0 / 2');
      const card = $('card-' + suffix); if (card) card.classList.toggle('is-active', !!pl && state.turn === i && isPlaying());
      if (!pl) { $('hp-' + suffix).style.width = '100%'; $('hp-' + suffix).classList.remove('low'); setText('hpnum-' + suffix, HP); }
    }
    canvas.classList.toggle('can-aim', humanAim());
    canvas.setAttribute('aria-label', 'Campo de batalha. ' + (humanAim() ? 'Arraste para mirar ou use os controles abaixo.' : 'Acompanhe a trajetória dos disparos.'));
    updateTimer(); reportHeight();
  }
  function updateTimer() {
    let label = '—';
    if (current() && current().isAI && ['question', 'feedback', 'aim'].includes(state.phase)) label = 'IA';
    else if (['question', 'aim'].includes(state.phase)) label = state.timed ? Math.ceil(Math.max(0, state.remaining)) + 's' : 'Sem pressa';
    if (label !== lastTimer) { setText('timer', label); lastTimer = label; }
    if (state.phase === 'question') {
      const fraction = state.timed ? E.clamp(state.remaining / E.DIFFICULTIES[state.difficulty].questionTime, 0, 1) : 1;
      $('question-timerbar').style.transform = 'scaleX(' + fraction.toFixed(3) + ')';
    }
  }
  function advance(dt) {
    if (!isPlaying() || state.paused || state.tutorial) return;
    state.elapsed += dt;
    const p = current();
    if (state.phase === 'flying') {
      stepper.advance(dt, step => {
        for (let i = state.projectiles.length - 1; i >= 0; i--) {
          const q = state.projectiles[i], hit = E.stepProjectile(q, state.wind, state.terrain, state.players, step);
          if (++q.trailTick % 4 === 0) { q.trail.push({ x: q.x, y: q.y }); if (q.trail.length > 26) q.trail.shift(); }
          if (hit) { if (hit.type !== 'miss') explode(hit, q); state.projectiles.splice(i, 1); }
        }
      });
      if (!state.projectiles.length) { state.phase = 'settle'; state.remaining = .6; updateUI(); }
    } else if (['settle', 'ending'].includes(state.phase)) {
      state.remaining -= dt;
      if (state.remaining <= 0) {
        settlePlayers();
        if (state.phase === 'ending') finishGame();
        else if (state.players.some(pl => pl.hp <= 0)) { state.phase = 'ending'; state.remaining = .4; updateUI(); }
        else { state.turn = 1 - state.turn; startTurn(); }
      }
    } else if (p.isAI) {
      state.remaining -= dt;
      if (state.remaining <= 0) {
        if (state.phase === 'question') answer(Math.random() < ({ easy: .55, normal: .75, hard: .9 }[state.difficulty]) ? state.q.answer : null);
        else if (state.phase === 'feedback') beginAim();
        else if (state.phase === 'aim' && !state.aiPrepared) {
          const aim = E.findAim(p, state.players[1 - state.turn], state.wind, state.terrain, state.players, Math.random, E.DIFFICULTIES[state.difficulty].aiError);
          p.angle = aim.angle; p.power = aim.power; state.weapon = p.charges >= 2 ? 'mega' : p.charges >= 1 ? 'triple' : 'normal';
          state.aiPrepared = true; state.remaining = .35;
        } else if (state.phase === 'aim') fire();
      }
    } else if (state.timed && ['question', 'aim'].includes(state.phase)) {
      state.remaining = Math.max(0, state.remaining - dt);
      if (state.remaining === 0) { if (state.phase === 'question') answer(null); else fire(); }
    }
    updateTimer();
  }

  // Static scenery and ground are cached; only craters rebuild the terrain layer.
  function mountain(c, base, amp, color, shift) {
    c.fillStyle = color; c.beginPath(); c.moveTo(0, H);
    for (let x = 0; x <= W; x += 10) c.lineTo(x, base + Math.sin(x * .007 + shift) * amp + Math.sin(x * .018 + shift) * amp * .28);
    c.lineTo(W, H); c.closePath(); c.fill();
  }
  function drawSky() {
    const gradient = sx.createLinearGradient(0, 0, 0, H);
    gradient.addColorStop(0, '#c1e3e2'); gradient.addColorStop(.65, '#f6edcb'); gradient.addColorStop(1, '#ecd2a3');
    sx.fillStyle = gradient; sx.fillRect(0, 0, W, H);
    sx.fillStyle = '#fff5d5'; sx.beginPath(); sx.arc(850, 120, 61, 0, Math.PI * 2); sx.fill();
    sx.strokeStyle = 'rgba(255,250,220,.45)'; sx.lineWidth = 18; sx.beginPath(); sx.arc(850, 120, 80, 0, Math.PI * 2); sx.stroke();
    mountain(sx, 288, 53, '#acc5bd', .8); mountain(sx, 344, 40, '#7ea99d', 2.1);
    for (let x = 0; x < W; x += 37) {
      const y = 337 + Math.sin(x * .007 + 2.1) * 40 + Math.sin(x * .018 + 2.1) * 11;
      sx.fillStyle = '#6e9b8d'; sx.beginPath(); sx.moveTo(x, y - 23); sx.lineTo(x - 10, y + 8); sx.lineTo(x + 10, y + 8); sx.fill();
    }
    sx.fillStyle = 'rgba(255,255,255,.38)';
    [[170, 89, 1], [465, 140, .6], [1070, 70, .8]].forEach(([x, y, scale]) => {
      sx.beginPath(); sx.ellipse(x, y, 70 * scale, 13 * scale, 0, 0, Math.PI * 2); sx.ellipse(x + 20, y - 12, 35 * scale, 17 * scale, 0, 0, Math.PI * 2); sx.fill();
    });
  }
  function groundPath(c) {
    c.beginPath(); c.moveTo(0, H);
    state.terrain.forEach((y, i) => c.lineTo(i * E.TERRAIN_STEP, y));
    c.lineTo(W, H); c.closePath();
  }
  function drawGround() {
    gx.clearRect(0, 0, W, H); gx.save(); groundPath(gx); gx.clip();
    const gradient = gx.createLinearGradient(0, 330, 0, H);
    gradient.addColorStop(0, '#c4925e'); gradient.addColorStop(1, '#76523f');
    gx.fillStyle = gradient; gx.fillRect(0, 0, W, H);
    mountain(gx, 486, 12, 'rgba(105,67,47,.18)', 0); mountain(gx, 550, 17, 'rgba(66,49,41,.14)', 3);
    for (let i = 0; i < 180; i++) {
      const x = (i * 137.51) % W, y = 370 + (i * 57.73) % 230;
      gx.fillStyle = i % 3 ? 'rgba(56,45,36,.14)' : 'rgba(255,230,186,.3)';
      gx.beginPath(); gx.ellipse(x, y, 2 + i % 5, 1 + i % 3, (i % 5) * .4, 0, Math.PI * 2); gx.fill();
    }
    gx.restore(); gx.beginPath();
    state.terrain.forEach((y, i) => i ? gx.lineTo(i * E.TERRAIN_STEP, y) : gx.moveTo(0, y));
    gx.lineJoin = 'round'; gx.strokeStyle = '#325e46'; gx.lineWidth = 13; gx.stroke();
    gx.strokeStyle = '#8dac53'; gx.lineWidth = 6; gx.stroke();
    for (let x = 12; x < W; x += 29) {
      const y = E.terrainY(state.terrain, x); if (y > H - 35) continue;
      gx.strokeStyle = '#76954a'; gx.lineWidth = 2; gx.beginPath(); gx.moveTo(x - 3, y - 2); gx.lineTo(x - 6, y - 9); gx.moveTo(x, y); gx.lineTo(x + 2, y - 11); gx.stroke();
    }
  }
  function rounded(c, x, y, width, height, radius, fill, stroke) {
    c.beginPath();
    if (c.roundRect) c.roundRect(x, y, width, height, radius);
    else c.rect(x, y, width, height);
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = 2; c.stroke(); }
  }
  function drawCannon(p, active) {
    ctx.save(); ctx.translate(p.x, p.y);
    ctx.fillStyle = 'rgba(33,48,39,.22)'; ctx.beginPath(); ctx.ellipse(0, 1, 44, 8, 0, 0, Math.PI * 2); ctx.fill();
    rounded(ctx, -35, -20, 70, 16, 7, '#25484a');
    [-24, 24].forEach(x => {
      ctx.fillStyle = '#253d41'; ctx.beginPath(); ctx.arc(x, -8, 13, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#d1d7c7'; ctx.beginPath(); ctx.arc(x, -8, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#517071'; ctx.beginPath(); ctx.arc(x, -8, 3, 0, Math.PI * 2); ctx.fill();
    });
    rounded(ctx, -26, -33, 52, 20, 8, p.hit > 0 ? '#fff5cf' : p.color, '#244b50');
    ctx.save(); ctx.translate(0, -28); ctx.scale(p.f, 1); ctx.rotate(-p.angle * Math.PI / 180);
    rounded(ctx, -8 - p.recoil * 7, -9, 50, 18, 5, '#365c63', '#24464b');
    rounded(ctx, 3 - p.recoil * 7, -7, 33, 5, 2, '#7ca5a6');
    rounded(ctx, 35 - p.recoil * 7, -11, 10, 22, 3, '#24464b'); ctx.restore();
    ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(0, -28, 15, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#244b50'; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.fillStyle = '#fcf4d8'; ctx.beginPath(); ctx.arc(0, -28, 5, 0, Math.PI * 2); ctx.fill();
    if (active) {
      const bounce = reduced ? 0 : Math.sin(state.clock * 4) * 3;
      ctx.fillStyle = p.color; ctx.beginPath(); ctx.moveTo(0, -75 + bounce); ctx.lineTo(-7, -86 + bounce); ctx.lineTo(7, -86 + bounce); ctx.fill();
      if (state.bonus) { ctx.strokeStyle = '#f6c363'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, -25, 48, Math.PI, 0); ctx.stroke(); }
    }
    ctx.restore();
  }
  function getAimPath() {
    if (!aimCache) aimCache = E.simulate(current(), current().angle, current().power, state.wind, state.terrain, state.players,
      { maxTime: state.difficulty === 'easy' ? 8 : state.difficulty === 'hard' ? .45 : .9 });
    return aimCache;
  }
  function drawMarker(x, y, color, label) {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.globalAlpha = .75;
    ctx.beginPath(); ctx.ellipse(x, y - 2, 13, 5, 0, 0, Math.PI * 2); ctx.moveTo(x, y - 15); ctx.lineTo(x, y + 6); ctx.moveTo(x - 18, y - 2); ctx.lineTo(x + 18, y - 2); ctx.stroke();
    if (label) { ctx.fillStyle = color; ctx.font = '600 12px system-ui'; ctx.textAlign = 'center'; ctx.fillText(label, x, y - 20); }
    ctx.restore();
  }
  function draw() {
    ctx.clearRect(0, 0, W, H); ctx.save();
    if (state.shake && !reduced) ctx.translate((Math.random() - .5) * state.shake, (Math.random() - .5) * state.shake);
    ctx.drawImage(sky, 0, 0);
    if (state.wind && isPlaying() && !reduced) {
      ctx.strokeStyle = 'rgba(255,255,255,.48)'; ctx.lineWidth = 2;
      for (let i = 0; i < 10; i++) { const x = ((i * 157 + state.clock * state.wind * 14) % (W + 60) + W + 60) % (W + 60) - 30, y = 66 + (i * 59) % 230;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.sign(state.wind) * 24, y); ctx.stroke(); }
    }
    ctx.drawImage(ground, 0, 0);
    if (state.players.length) {
      state.players.forEach((p, i) => {
        if (p.lastImpact) drawMarker(p.lastImpact.x, E.terrainY(state.terrain, p.lastImpact.x), p.color, null);
        drawCannon(p, i === state.turn && isPlaying());
      });
    } else {
      [0, 1].forEach(i => drawCannon(player('', i, false), false));
    }
    if (state.phase === 'aim' && current() && !current().isAI) {
      const path = getAimPath(); ctx.fillStyle = current().color;
      path.points.forEach((point, i) => {
        ctx.globalAlpha = state.difficulty === 'easy' ? .65 : Math.max(.1, 1 - i / path.points.length);
        ctx.beginPath(); ctx.arc(point.x, point.y, i % 3 === 0 ? 3 : 2, 0, Math.PI * 2); ctx.fill();
      }); ctx.globalAlpha = 1;
      if (path.impact && path.impact.type !== 'miss') drawMarker(path.impact.x, path.impact.y, current().color, 'prévia');
    }
    state.projectiles.forEach(q => {
      q.trail.forEach((point, i) => { ctx.globalAlpha = i / q.trail.length * .6; ctx.fillStyle = '#fff5db'; ctx.beginPath(); ctx.arc(point.x, point.y, 1 + i / q.trail.length * 3, 0, Math.PI * 2); ctx.fill(); });
      ctx.globalAlpha = 1; ctx.fillStyle = q.weapon === 'mega' ? '#ef775e' : '#ffcb66'; ctx.beginPath(); ctx.arc(q.x, q.y, q.weapon === 'mega' ? 8 : 5, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#593e35'; ctx.lineWidth = 2; ctx.stroke();
      if (q.y < 15) {
        const x = E.clamp(q.x, 45, W - 45);
        rounded(ctx, x - 35, 10, 70, 26, 13, '#21484b'); ctx.fillStyle = '#fff2d3'; ctx.font = 'bold 13px system-ui'; ctx.textAlign = 'center'; ctx.fillText('↑ TIRO', x, 28);
      }
    });
    state.rings.forEach(r => { ctx.globalAlpha = r.life * 1.3; ctx.strokeStyle = '#fff2b0'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2); ctx.stroke(); });
    state.particles.forEach(p => { ctx.globalAlpha = Math.min(1, p.life * 2); ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); });
    state.floaters.forEach(f => { ctx.globalAlpha = Math.min(1, f.life); ctx.font = '900 30px system-ui'; ctx.textAlign = 'center'; ctx.strokeStyle = '#fff4d8'; ctx.lineWidth = 5; ctx.strokeText(f.text, f.x, f.y); ctx.fillStyle = f.color; ctx.fillText(f.text, f.x, f.y); });
    ctx.globalAlpha = 1; ctx.restore();
    // Scale labels stay inside the artwork, even on a small screen.
    rounded(ctx, 20, H - 40, 191, 24, 12, 'rgba(36,62,53,.7)');
    ctx.fillStyle = '#f4e9c9'; ctx.font = '600 12px system-ui'; ctx.textAlign = 'left'; ctx.fillText('VALE DOS VENTOS  /  ARENA 01', 32, H - 24);
  }
  function animate(dt) {
    state.clock += dt;
    state.particles = state.particles.filter(p => { p.life -= dt; p.vy += 230 * dt; p.x += p.vx * dt; p.y += p.vy * dt; return p.life > 0; });
    state.rings = state.rings.filter(r => { r.life -= dt; r.radius += 200 * dt; return r.life > 0; });
    state.floaters = state.floaters.filter(f => { f.life -= dt; f.y -= 28 * dt; return f.life > 0; });
    state.shake = Math.max(0, state.shake - dt * 35);
    state.players.forEach((p, i) => {
      // Keep collisions and forecasts identical while shots are in flight.
      if (state.phase !== 'flying') p.y += E.clamp(E.terrainY(state.terrain, p.x) - p.y, -180 * dt, 180 * dt);
      p.recoil = Math.max(0, p.recoil - dt * 5); p.hit = Math.max(0, p.hit - dt);
      p.displayed += (p.hp - p.displayed) * (1 - Math.exp(-10 * dt));
      const id = 'p' + (i + 1), width = (p.displayed / HP * 100).toFixed(2) + '%';
      if (p.lastBar !== width) { $('hp-' + id).style.width = width; p.lastBar = width; }
      $('hp-' + id).classList.toggle('low', p.hp < HP * .3); setText('hpnum-' + id, Math.round(p.displayed));
    });
  }
  function frame(timestamp) {
    const dt = lastFrame === null ? 0 : Math.min(.25, Math.max(0, (timestamp - lastFrame) / 1000)); lastFrame = timestamp;
    if (!state.paused && !state.tutorial && !document.hidden) { advance(dt); animate(dt); }
    const idle = state.phase === 'menu' || state.phase === 'end' || state.paused || state.tutorial;
    if (!document.hidden && (!idle || timestamp - lastPaint >= 100)) { draw(); lastPaint = timestamp; }
    if (!window.__CANNON_TEST__) requestAnimationFrame(frame);
  }
  function reportHeight() {
    const height = Math.ceil(document.body.getBoundingClientRect().height);
    if (Math.abs(height - lastHeight) >= 4) { lastHeight = height; post({ type: 'vrgame:resize', height }); }
  }

  // Pointer aiming: drag direction sets angle; distance sets power. Sliders remain available.
  function aimFromPointer(event) {
    const rect = canvas.getBoundingClientRect(), p = current();
    const x = (event.clientX - rect.left) / rect.width * W, y = (event.clientY - rect.top) / rect.height * H;
    const dx = (x - p.x) * p.f, dy = p.y - 28 - y;
    const angle = Math.atan2(Math.max(5, dy), Math.max(5, dx)) * 180 / Math.PI;
    const power = 20 + E.clamp(Math.hypot(dx, dy) / 480, 0, 1) * 80;
    setAim(angle, power);
  }
  canvas.addEventListener('pointerdown', event => {
    if (!humanAim() || (event.button !== undefined && event.button !== 0)) return;
    drag = event.pointerId; canvas.setPointerCapture(event.pointerId); aimFromPointer(event); event.preventDefault();
  });
  canvas.addEventListener('pointermove', event => { if (drag === event.pointerId && humanAim()) { aimFromPointer(event); event.preventDefault(); } });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(name => canvas.addEventListener(name, () => { drag = null; }));
  $('start-game').addEventListener('click', () => startGame());
  $('training').addEventListener('click', () => startGame(Object.assign(readOptions(), { difficulty: 'easy', timed: false })));
  $('question-submit').addEventListener('click', () => answer($('question-answer').value));
  $('question-answer').addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); event.stopPropagation(); answer(event.target.value); } });
  $('fire').addEventListener('click', fire);
  $('angle').addEventListener('input', () => setAim($('angle').value, current().power));
  $('power').addEventListener('input', () => setAim(current().angle, $('power').value));
  ['angle', 'power'].forEach(key => ['minus', 'plus'].forEach(sign => $(key + '-' + sign).addEventListener('click', () => {
    if (!humanAim()) return; const p = current(), delta = sign === 'minus' ? -1 : 1;
    setAim(p.angle + (key === 'angle' ? delta : 0), p.power + (key === 'power' ? delta : 0));
  })));
  document.querySelectorAll('.wbtn').forEach(button => button.addEventListener('click', () => setWeapon(button.getAttribute('data-w'))));
  $('pause').addEventListener('click', pause); $('resume').addEventListener('click', resume);
  $('restart').addEventListener('click', () => { if (isPlaying()) pause(); else toMenu(); });
  $('exit-game').addEventListener('click', toMenu); $('menu-button').addEventListener('click', toMenu);
  $('play-again').addEventListener('click', () => startGame({ mode: state.mode, difficulty: state.difficulty, mathLevel: state.mathLevel, operation: state.operation, timed: state.timed }));
  $('help').addEventListener('click', openTutorial); $('tutorial-start').addEventListener('click', openTutorial);
  $('tutorial-close').addEventListener('click', closeTutorial);
  $('tutorial-next').addEventListener('click', () => { if (++tutorialIndex >= lessons.length) closeTutorial(); else renderTutorial(); });
  $('mute').addEventListener('click', () => { muted = !muted; saveSetting('cannon-muted', String(muted)); updateSettings(); if (!muted) sound('ok'); });
  $('effects').addEventListener('click', () => { reduced = !reduced; saveSetting('cannon-effects', reduced ? 'reduced' : 'full'); updateSettings(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); lastFrame = null; });
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') { if (state.tutorial) closeTutorial(); else if (state.paused) resume(); else pause(); return; }
    const target = event.target, tag = target && target.tagName;
    if (['SELECT', 'TEXTAREA'].includes(tag) || (tag === 'INPUT' && target.type !== 'range')) return;
    if (event.key.toLowerCase() === 'm') { $('mute').click(); return; }
    if (event.key.toLowerCase() === 'p') { if (state.paused) resume(); else pause(); return; }
    if (!humanAim()) return;
    const p = current(), delta = event.shiftKey ? 5 : 1;
    if (event.key === 'ArrowUp') setAim(p.angle + delta, p.power);
    else if (event.key === 'ArrowDown') setAim(p.angle - delta, p.power);
    else if (event.key === 'ArrowLeft') setAim(p.angle, p.power - delta);
    else if (event.key === 'ArrowRight') setAim(p.angle, p.power + delta);
    else if (event.key === ' ' && tag !== 'BUTTON') fire();
    else if (['1', '2', '3'].includes(event.key)) setWeapon(['normal', 'triple', 'mega'][Number(event.key) - 1]);
    else return;
    event.preventDefault();
  });
  // Keep keyboard navigation within the topmost open dialog.
  document.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const overlay = ['tutorial', 'pause-overlay', 'result', 'menu'].map($).find(el => !el.hidden);
    if (!overlay) return;
    const nodes = Array.from(overlay.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex="0"]')).filter(el => !el.hidden);
    if (!nodes.length) return;
    const first = nodes[0], last = nodes[nodes.length - 1];
    if (event.shiftKey && (document.activeElement === first || !overlay.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && (document.activeElement === last || !overlay.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
  });
  function applyTheme(theme) { if (theme === 'light' || theme === 'dark') document.documentElement.dataset.theme = theme; }
  window.addEventListener('message', event => {
    if (event.source !== window.parent || !event.data) return;
    if (event.data.type === 'vrgame:theme') applyTheme(event.data.theme);
    if (event.data.type === 'vrgame:fullscreen') { document.documentElement.classList.toggle('is-fullscreen', Boolean(event.data.fullscreen)); reportHeight(); }
  });
  window.addEventListener('resize', reportHeight);
  if (window.ResizeObserver) new ResizeObserver(reportHeight).observe(document.body);
  if (window.self === window.top) document.documentElement.classList.add('is-standalone');
  applyTheme(new URLSearchParams(window.location.search).get('theme'));
  state.terrain = E.generateTerrain(); drawSky(); drawGround(); updateSettings(); updateUI(); $('pause').disabled = true;
  post({ type: 'vrgame:ready' }); reportHeight();
  if (window.__CANNON_TEST__) window.__cannonGame = { getState: () => state, startGame, answer, fire, pause, resume, toMenu, frame, setAim, setWeapon };
  else { requestAnimationFrame(frame); focus('start-game'); }
})();
