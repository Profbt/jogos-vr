/* Batalha de Canhões 3.0 — deterministic, dependency-free game rules. */
(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.CannonEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var W = 1200, H = 600, STEP = 1 / 120, TERRAIN_STEP = 4;
  var GRAVITY = 620, WIND_ACCELERATION = 18;
  var DIFFICULTIES = {
    easy: { label: 'Explorador', wind: 3, questionTime: 30, aimTime: 35, aiError: 6 },
    normal: { label: 'Estrategista', wind: 7, questionTime: 22, aimTime: 30, aiError: 3 },
    hard: { label: 'Comandante', wind: 11, questionTime: 16, aimTime: 25, aiError: 1 }
  };
  var WEAPONS = {
    normal: { label: 'Normal', cost: 0, radius: 30, damage: 38, blast: 105, offsets: [0] },
    triple: { label: 'Triplo', cost: 1, radius: 24, damage: 20, blast: 85, offsets: [-5, 0, 5] },
    mega: { label: 'Mega', cost: 2, radius: 54, damage: 60, blast: 150, offsets: [0] }
  };

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function randomInt(rng, min, max) { return min + Math.floor(clamp(rng(), 0, 0.999999999999) * (max - min + 1)); }

  function generateTerrain(rng) {
    rng = rng || Math.random;
    var result = [], a = rng() * Math.PI * 2, b = rng() * Math.PI * 2;
    for (var i = 0; i <= W / TERRAIN_STEP; i++) {
      var x = i * TERRAIN_STEP;
      result.push(H * 0.69 + Math.sin(x * 0.006 + a) * 34 + Math.sin(x * 0.016 + b) * 17 + Math.sin(x * 0.037 + a) * 4);
    }
    [140, W - 140].forEach(function (center) {
      var y = result[Math.round(center / TERRAIN_STEP)];
      for (var j = Math.floor((center - 64) / TERRAIN_STEP); j <= Math.ceil((center + 64) / TERRAIN_STEP); j++) {
        var blend = clamp((64 - Math.abs(j * TERRAIN_STEP - center)) / 24, 0, 1);
        result[j] = result[j] * (1 - blend) + y * blend;
      }
    });
    return result;
  }

  function terrainY(terrain, x) {
    if (x < 0 || x > W || !terrain || !terrain.length) return H;
    var index = x / TERRAIN_STEP, left = Math.floor(index), fraction = index - left;
    if (left >= terrain.length - 1) return terrain[terrain.length - 1];
    return terrain[left] * (1 - fraction) + terrain[left + 1] * fraction;
  }

  function crater(terrain, x, y, radius) {
    var first = Math.max(0, Math.floor((x - radius) / TERRAIN_STEP));
    var last = Math.min(terrain.length - 1, Math.ceil((x + radius) / TERRAIN_STEP));
    for (var i = first; i <= last; i++) {
      var dx = i * TERRAIN_STEP - x;
      if (Math.abs(dx) > radius) continue;
      var bottom = y + Math.sqrt(Math.max(0, radius * radius - dx * dx));
      terrain[i] = Math.min(H - 12, Math.max(terrain[i], bottom));
    }
  }

  function speedOf(power) { return 280 + (clamp(power, 20, 100) - 20) / 80 * 720; }
  function muzzle(player, angle) {
    var radians = angle * Math.PI / 180;
    return { x: player.x + Math.cos(radians) * 42 * player.f, y: player.y - 28 - Math.sin(radians) * 42 };
  }

  function createProjectile(player, angle, power, weapon, offset) {
    var actualAngle = angle + (offset || 0), radians = actualAngle * Math.PI / 180;
    var start = muzzle(player, actualAngle), speed = speedOf(power);
    return { x: start.x, y: start.y, vx: Math.cos(radians) * speed * player.f,
      vy: -Math.sin(radians) * speed, age: 0, weapon: weapon || 'normal', impact: null };
  }

  /* Both prediction and live shots enter here with exactly the same time step.
     Subsampling the travelled segment also prevents fast shots crossing terrain. */
  function stepProjectile(projectile, wind, terrain, players, dt) {
    dt = dt === undefined ? STEP : dt;
    if (projectile.impact) return projectile.impact;
    if (!Number.isFinite(dt) || dt <= 0) return null;
    var oldX = projectile.x, oldY = projectile.y;
    projectile.vx += wind * WIND_ACCELERATION * dt;
    projectile.vy += GRAVITY * dt;
    var newX = oldX + projectile.vx * dt, newY = oldY + projectile.vy * dt;
    projectile.age += dt;
    var samples = Math.max(1, Math.ceil(Math.hypot(newX - oldX, newY - oldY) / 3));
    var hit = null;
    for (var s = 1; s <= samples && !hit; s++) {
      var fraction = s / samples, x = oldX + (newX - oldX) * fraction, y = oldY + (newY - oldY) * fraction;
      for (var i = 0; i < (players || []).length; i++) {
        var player = players[i];
        if (player.hp !== undefined && player.hp <= 0) continue;
        if (Math.hypot(player.x - x, player.y - 21 - y) <= 23) {
          hit = { type: 'tank', x: x, y: y, playerIndex: i };
          break;
        }
      }
      if (!hit && x >= 0 && x <= W && y >= terrainY(terrain, x)) hit = { type: 'terrain', x: x, y: y };
    }
    if (!hit && (newX < -160 || newX > W + 160 || newY > H + 100 || projectile.age >= 10)) {
      hit = { type: 'miss', x: newX, y: newY };
    }
    projectile.x = hit ? hit.x : newX;
    projectile.y = hit ? hit.y : newY;
    projectile.impact = hit;
    return hit;
  }

  function simulate(player, angle, power, wind, terrain, players, options) {
    options = options || {};
    var projectile = createProjectile(player, angle, power, options.weapon || 'normal', options.offset || 0);
    var points = [{ x: projectile.x, y: projectile.y }], impact = null;
    var maxTime = options.maxTime === undefined ? 8 : clamp(options.maxTime, 0, 10);
    var steps = Math.floor(maxTime / STEP + 1e-9), sampleEvery = Math.max(1, options.sampleEvery || 8);
    for (var i = 0; i < steps; i++) {
      impact = stepProjectile(projectile, wind, terrain, players, STEP);
      if ((i + 1) % sampleEvery === 0 || impact || i === steps - 1) points.push({ x: projectile.x, y: projectile.y });
      if (impact) break;
    }
    return { points: points, impact: impact, time: projectile.age };
  }

  function findAim(player, target, wind, terrain, players, rng, aiError) {
    rng = rng || Math.random;
    aiError = aiError === undefined ? 2 : aiError;
    var best = { angle: 45, power: 70 }, bestScore = Infinity;
    function consider(angle, power) {
      var path = simulate(player, angle, power, wind, terrain, players, { sampleEvery: 10000 });
      var point = path.impact || path.points[path.points.length - 1];
      var score = Math.hypot(point.x - target.x, point.y - (target.y - 21));
      if (path.impact && path.impact.type === 'tank' && players[path.impact.playerIndex] === player) score += 1000;
      if (!path.impact || path.impact.type === 'miss') score += 120;
      if (score < bestScore) { bestScore = score; best = { angle: angle, power: power }; }
    }
    for (var angle = 15; angle <= 85; angle += 10) {
      for (var power = 30; power <= 100; power += 10) consider(angle, power);
    }
    var center = { angle: best.angle, power: best.power };
    for (angle = Math.max(5, center.angle - 10); angle <= Math.min(85, center.angle + 10); angle += 2) {
      for (power = Math.max(20, center.power - 10); power <= Math.min(100, center.power + 10); power += 2) consider(angle, power);
    }
    return { angle: Math.round(clamp(best.angle + (rng() * 2 - 1) * aiError, 5, 85)),
      power: Math.round(clamp(best.power + (rng() * 2 - 1) * aiError, 20, 100)) };
  }

  function makeQuestion(level, operation, rng) {
    level = DIFFICULTIES[level] ? level : 'normal';
    rng = rng || Math.random;
    var operations = ['add', 'sub', 'mul', 'div'];
    operation = operations.indexOf(operation) >= 0 ? operation : operations[randomInt(rng, 0, 3)];
    var a, b, answer, text, explanation;
    if (operation === 'add') {
      var max = level === 'easy' ? 20 : level === 'hard' ? 199 : 79;
      a = randomInt(rng, 3, max); b = randomInt(rng, 2, max); answer = a + b;
      text = a + ' + ' + b;
      var tens = Math.floor(b / 10) * 10, units = b % 10;
      explanation = tens && units ? a + ' + ' + tens + ' = ' + (a + tens) + '; depois + ' + units + ' = ' + answer + '.' : a + ' + ' + b + ' = ' + answer + '.';
    } else if (operation === 'sub') {
      a = randomInt(rng, level === 'easy' ? 8 : 25, level === 'easy' ? 25 : level === 'hard' ? 199 : 99);
      b = randomInt(rng, 2, a - 1); answer = a - b; text = a + ' − ' + b;
      explanation = 'Confira pela adição: ' + b + ' + ' + answer + ' = ' + a + '.';
    } else if (operation === 'mul') {
      a = randomInt(rng, 2, level === 'easy' ? 5 : level === 'hard' ? 15 : 9);
      b = randomInt(rng, 2, level === 'easy' ? 5 : level === 'hard' ? 12 : 9);
      answer = a * b; text = a + ' × ' + b;
      var half = Math.floor(b / 2), other = b - half;
      explanation = b >= 4 ? a + ' × ' + half + ' + ' + a + ' × ' + other + ' = ' + (a * half) + ' + ' + (a * other) + ' = ' + answer + '.' : 'Some ' + a + ', ' + b + ' vezes: ' + Array(b).fill(a).join(' + ') + ' = ' + answer + '.';
    } else {
      b = randomInt(rng, 2, level === 'easy' ? 5 : level === 'hard' ? 12 : 9);
      answer = randomInt(rng, 2, level === 'easy' ? 5 : level === 'hard' ? 15 : 10);
      a = b * answer; text = a + ' ÷ ' + b;
      explanation = 'Pense na multiplicação: ' + b + ' × ' + answer + ' = ' + a + '. Então ' + a + ' ÷ ' + b + ' = ' + answer + '.';
    }
    return { text: text, answer: answer, explanation: explanation, operation: operation };
  }

  function isCorrectAnswer(raw, answer) {
    if (raw === null || raw === undefined || (typeof raw !== 'number' && typeof raw !== 'string')) return false;
    if (typeof raw === 'string' && !/^[+-]?\d+(?:[.,]\d+)?$/.test(raw.trim())) return false;
    var value = Number(typeof raw === 'string' ? raw.trim().replace(',', '.') : raw);
    return Number.isFinite(value) && Number.isInteger(value) && value === answer;
  }

  function createStepper(step) {
    step = Number.isFinite(step) && step > 0 ? step : STEP;
    var accumulator = 0;
    return {
      advance: function (dt, callback) {
        if (!Number.isFinite(dt) || dt <= 0) return 0;
        accumulator += Math.min(dt, 0.25);
        var count = 0;
        while (accumulator + 1e-10 >= step) {
          accumulator = Math.max(0, accumulator - step);
          callback(step);
          count++;
        }
        return count;
      },
      reset: function () { accumulator = 0; }
    };
  }

  return { W: W, H: H, STEP: STEP, TERRAIN_STEP: TERRAIN_STEP, DIFFICULTIES: DIFFICULTIES,
    WEAPONS: WEAPONS, GRAVITY: GRAVITY, WIND_ACCELERATION: WIND_ACCELERATION,
    clamp: clamp, generateTerrain: generateTerrain, terrainY: terrainY, crater: crater,
    speedOf: speedOf, muzzle: muzzle, createProjectile: createProjectile, stepProjectile: stepProjectile,
    simulate: simulate, findAim: findAim, makeQuestion: makeQuestion, isCorrectAnswer: isCorrectAnswer,
    createStepper: createStepper };
});
