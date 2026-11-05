/* Qual é o País? — jogo estático para o portal Jogos VR.
   Contrato do portal: vrgame:ready, vrgame:resize, vrgame:finish,
   vrgame:theme, vrgame:fullscreen e vrgame:restart. */
(function () {
  "use strict";

  var DATA = window.WORLD_DATA;
  var COUNTRIES = [];
  var BY_CODE = {};
  var SEARCH = [];
  var COUNTRY_POLYS = [];
  var LAND_POLYS = [];
  var DEG = Math.PI / 180;
  var R_EARTH = 6371;
  var TEMPS = [
    { max: 500, label: "Fervendo", color: "#b91c1c", globe: "#ef4444" },
    { max: 1500, label: "Quente", color: "#c2410c", globe: "#f97316" },
    { max: 3000, label: "Morno", color: "#a16207", globe: "#eab308" },
    { max: 5000, label: "Frio", color: "#4d7c0f", globe: "#84cc16" },
    { max: 8000, label: "Gelado", color: "#0f766e", globe: "#14b8a6" },
    { max: Infinity, label: "Congelado", color: "#1d4ed8", globe: "#60a5fa" }
  ];

  var state = {
    screen: "start",
    mode: "free",
    target: null,
    lastTarget: null,
    guesses: [],
    guessByCode: {},
    won: false,
    finished: false,
    finishSent: false,
    countedPlay: false,
    hintLevel: 0,
    startedAt: 0,
    lastGuess: null,
    resultTimer: 0,
    rotationY: 0.35,
    rotationX: 0.18,
    zoom: 1,
    cosY: 1,
    sinY: 0,
    cosX: 1,
    sinX: 0,
    cw: 0,
    ch: 0,
    dpr: 1,
    dragging: false,
    dragX: 0,
    dragY: 0,
    activeSuggestion: -1,
    suggestions: [],
    drawPending: false,
    reportPending: false,
    lastHeight: 0,
    themeLocked: false,
    announceTimer: 0
  };

  var els = {
    screens: document.querySelectorAll(".screen"),
    screenStart: document.getElementById("screen-start"),
    screenGame: document.getElementById("screen-game"),
    screenResult: document.getElementById("screen-result"),
    topbarStatus: document.getElementById("topbar-status"),
    playDaily: document.getElementById("play-daily"),
    playFree: document.getElementById("play-free"),
    statsLine: document.getElementById("stats-line"),
    modeLabel: document.getElementById("mode-label"),
    giveUp: document.getElementById("give-up"),
    back: document.getElementById("back"),
    globeWrap: document.querySelector(".globe-wrap"),
    canvas: document.getElementById("globe"),
    zoomOut: document.getElementById("zoom-out"),
    zoomIn: document.getElementById("zoom-in"),
    focusLast: document.getElementById("focus-last"),
    guessInput: document.getElementById("guess-input"),
    guessSubmit: document.getElementById("guess-submit"),
    suggestions: document.getElementById("suggestions"),
    feedback: document.getElementById("feedback"),
    guessCount: document.getElementById("guess-count"),
    guessList: document.getElementById("guess-list"),
    emptyList: document.getElementById("empty-list"),
    targetHint: document.getElementById("target-hint"),
    targetName: document.getElementById("target-name"),
    targetFact: document.getElementById("target-fact"),
    resultEyebrow: document.getElementById("result-eyebrow"),
    resultTitle: document.getElementById("result-title"),
    resultStars: document.getElementById("result-stars"),
    resultText: document.getElementById("result-text"),
    playAgain: document.getElementById("play-again"),
    resultMenu: document.getElementById("result-menu"),
    live: document.getElementById("live")
  };

  els.targetEyebrow = els.targetHint
    ? els.targetHint.querySelector(".eyebrow")
    : null;
  els.lead = document.querySelector(".lead");

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function pad2(value) {
    return value < 10 ? "0" + value : String(value);
  }

  function norm(value) {
    var text = String(value == null ? "" : value);
    if (text.normalize) {
      text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function formatNumber(value) {
    var number = Math.round(Number(value) || 0);
    return String(number).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function formatKm(value) {
    return formatNumber(value) + " km";
  }

  function formatArea(value) {
    if (!Number.isFinite(Number(value)) || Number(value) <= 0) {
      return "área desconhecida";
    }
    return formatNumber(value) + " km²";
  }

  function dateKey() {
    var now = new Date();
    return (
      now.getFullYear() +
      "-" +
      pad2(now.getMonth() + 1) +
      "-" +
      pad2(now.getDate())
    );
  }

  function shortDate() {
    var now = new Date();
    return pad2(now.getDate()) + "/" + pad2(now.getMonth() + 1);
  }

  function hashString(text) {
    var hash = 2166136261;
    for (var i = 0; i < text.length; i++) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function haversine(lat1, lon1, lat2, lon2) {
    var dLat = (lat2 - lat1) * DEG;
    var dLon = (lon2 - lon1) * DEG;
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * DEG) *
        Math.cos(lat2 * DEG) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    return 2 * R_EARTH * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function tempFor(km) {
    for (var i = 0; i < TEMPS.length; i++) {
      if (km <= TEMPS[i].max) return TEMPS[i];
    }
    return TEMPS[TEMPS.length - 1];
  }

  function prepareRing(ring) {
    var points = [];
    var previousLon = null;
    for (var i = 0; i + 1 < ring.length; i += 2) {
      var lat = Number(ring[i]);
      var lon = Number(ring[i + 1]);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
      if (previousLon !== null) {
        while (lon - previousLon > 180) lon -= 360;
        while (lon - previousLon < -180) lon += 360;
      }
      previousLon = lon;
      var phi = lat * DEG;
      var lambda = lon * DEG;
      var cosPhi = Math.cos(phi);
      points.push({
        x: cosPhi * Math.sin(lambda),
        y: Math.sin(phi),
        z: cosPhi * Math.cos(lambda)
      });
    }
    return points;
  }

  function buildGeoData() {
    COUNTRIES = DATA.countries.filter(function (country) {
      return (
        country &&
        country.c &&
        country.n &&
        Number.isFinite(Number(country.lat)) &&
        Number.isFinite(Number(country.lon)) &&
        (country.pt === 1 || Array.isArray(country.p))
      );
    });

    COUNTRIES.forEach(function (country) {
      BY_CODE[country.c] = country;
      country.lat = Number(country.lat);
      country.lon = Number(country.lon);
      country.al = Array.isArray(country.al) ? country.al : [];

      var normalized = [];
      var seen = {};
      [country.n].concat(country.al).forEach(function (alias) {
        var key = norm(alias);
        if (key && !seen[key]) {
          seen[key] = true;
          normalized.push(key);
        }
      });
      SEARCH.push({
        country: country,
        name: norm(country.n),
        aliases: normalized
      });

      if (Array.isArray(country.p)) {
        country.p.forEach(function (polygon) {
          var rings = [];
          polygon.forEach(function (ring) {
            if (Array.isArray(ring) && ring.length >= 6) {
              var points = prepareRing(ring);
              if (points.length >= 3) rings.push(points);
            }
          });
          if (rings.length) {
            COUNTRY_POLYS.push({
              code: country.c,
              country: country,
              rings: rings
            });
          }
        });
      }
    });

    (DATA.land || []).forEach(function (feature) {
      if (!Array.isArray(feature) || !feature.length) return;
      var polygons = feature;
      if (Array.isArray(feature[0]) && typeof feature[0][0] === "number") {
        polygons = [feature];
      }
      polygons.forEach(function (polygon) {
        if (!Array.isArray(polygon)) return;
        var rings = [];
        polygon.forEach(function (ring) {
          if (Array.isArray(ring) && ring.length >= 6) {
            var points = prepareRing(ring);
            if (points.length >= 3) rings.push(points);
          }
        });
        if (rings.length) LAND_POLYS.push({ rings: rings });
      });
    });
  }

  function findExact(query) {
    var key = norm(query);
    if (!key) return null;
    var nameMatch = null;
    var aliasMatches = [];
    for (var i = 0; i < SEARCH.length; i++) {
      var item = SEARCH[i];
      if (item.name === key) {
        nameMatch = item.country;
        break;
      }
      for (var j = 0; j < item.aliases.length; j++) {
        if (item.aliases[j] === key) {
          aliasMatches.push(item.country);
          break;
        }
      }
    }
    if (nameMatch) return nameMatch;
    if (aliasMatches.length === 1) return aliasMatches[0];
    return null;
  }

  function searchCountries(query) {
    var key = norm(query);
    if (!key) return [];
    var matches = [];
    for (var i = 0; i < SEARCH.length; i++) {
      var item = SEARCH[i];
      var rank = 99;
      if (item.name.indexOf(key) === 0) {
        rank = 0;
      } else {
        for (var j = 0; j < item.aliases.length; j++) {
          if (item.aliases[j].indexOf(key) === 0) {
            rank = 1;
            break;
          }
        }
      }
      if (rank === 99 && item.name.indexOf(key) !== -1) {
        rank = 2;
      }
      if (rank === 99) {
        for (var k = 0; k < item.aliases.length; k++) {
          if (item.aliases[k].indexOf(key) !== -1) {
            rank = 3;
            break;
          }
        }
      }
      if (rank !== 99) {
        matches.push({ country: item.country, rank: rank });
      }
    }
    matches.sort(function (a, b) {
      if (a.rank !== b.rank) return a.rank - b.rank;
      return a.country.n.localeCompare(b.country.n, "pt-BR");
    });
    return matches.slice(0, 10).map(function (item) {
      return item.country;
    });
  }

  function updateTrig() {
    state.cosY = Math.cos(state.rotationY);
    state.sinY = Math.sin(state.rotationY);
    state.cosX = Math.cos(state.rotationX);
    state.sinX = Math.sin(state.rotationX);
  }

  function rotatePoint(point) {
    var x1 = point.x * state.cosY + point.z * state.sinY;
    var z1 = -point.x * state.sinY + point.z * state.cosY;
    var y2 = point.y * state.cosX - z1 * state.sinX;
    var z2 = point.y * state.sinX + z1 * state.cosX;
    return { x: x1, y: y2, z: z2 };
  }

  function project(lat, lon, cx, cy, radius) {
    var phi = lat * DEG;
    var lambda = lon * DEG;
    var cosPhi = Math.cos(phi);
    var point = {
      x: cosPhi * Math.sin(lambda),
      y: Math.sin(phi),
      z: cosPhi * Math.cos(lambda)
    };
    var rotated = rotatePoint(point);
    return {
      x: cx + radius * rotated.x,
      y: cy - radius * rotated.y,
      z: rotated.z
    };
  }

  function globeRadius() {
    var base = Math.min(state.cw, state.ch) / 2 - 6;
    return base * state.zoom;
  }

  function isVisible(lat, lon) {
    if (!state.cw) return true;
    updateTrig();
    var radius = globeRadius();
    var point = project(lat, lon, state.cw / 2, state.ch / 2, radius);
    return point.z > 0.015;
  }

  function centerOn(country) {
    if (!country) return;
    state.rotationY = -country.lon * DEG;
    state.rotationX = clamp(country.lat * DEG, -1.45, 1.45);
    requestDraw();
  }

  function setZoom(value) {
    state.zoom = clamp(value, 0.75, 1.8);
    requestDraw();
  }

  function requestDraw() {
    if (state.drawPending) return;
    state.drawPending = true;
    window.requestAnimationFrame(function () {
      state.drawPending = false;
      drawGlobe();
    });
  }

  function resizeCanvas() {
    if (!els.canvas) return;
    var rect = els.canvas.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var width = Math.round(rect.width * dpr);
    var height = Math.round(rect.height * dpr);
    if (els.canvas.width !== width || els.canvas.height !== height) {
      els.canvas.width = width;
      els.canvas.height = height;
    }
    state.cw = rect.width;
    state.ch = rect.height;
    state.dpr = dpr;
  }

  function insertHorizonArcs(points, cx, cy, radius) {
    if (points.length < 2) return points;
    var out = [];
    for (var i = 0; i < points.length; i++) {
      var a = points[i];
      var b = points[(i + 1) % points.length];
      out.push(a);
      if (a.horizon && b.horizon) {
        var start = Math.atan2(a.y - cy, a.x - cx);
        var end = Math.atan2(b.y - cy, b.x - cx);
        var delta = end - start;
        while (delta > Math.PI) delta -= Math.PI * 2;
        while (delta < -Math.PI) delta += Math.PI * 2;
        var steps = Math.max(
          2,
          Math.min(18, Math.ceil(Math.abs(delta) / (Math.PI / 18)))
        );
        for (var step = 1; step < steps; step++) {
          var angle = start + delta * (step / steps);
          out.push({
            x: cx + radius * Math.cos(angle),
            y: cy + radius * Math.sin(angle),
            horizon: true
          });
        }
      }
    }
    return out;
  }

  function projectPolygon(polygon, cx, cy, radius) {
    var screenRings = [];
    var sum = 0;
    var count = 0;
    var crossed = false;
    for (var r = 0; r < polygon.rings.length; r++) {
      var points = polygon.rings[r];
      var rotated = [];
      for (var i = 0; i < points.length; i++) {
        var point = rotatePoint(points[i]);
        rotated.push(point);
        sum += point.z;
        count++;
      }
      var total = rotated.length;
      if (!total) continue;
      var screen = [];
      for (var j = 0; j < total; j++) {
        var a = rotated[j];
        var b = rotated[(j + 1) % total];
        var aIn = a.z >= 0;
        var bIn = b.z >= 0;
        if (aIn) {
          screen.push({
            x: cx + radius * a.x,
            y: cy - radius * a.y,
            horizon: false
          });
        }
        if (aIn !== bIn) {
          crossed = true;
          var t = a.z / (a.z - b.z);
          var ix = a.x + (b.x - a.x) * t;
          var iy = a.y + (b.y - a.y) * t;
          screen.push({
            x: cx + radius * ix,
            y: cy - radius * iy,
            horizon: true
          });
        }
      }
      if (screen.length >= 3) {
        screenRings.push(insertHorizonArcs(screen, cx, cy, radius));
      }
    }
    return {
      rings: screenRings,
      avg: count ? sum / count : -1,
      hasFront: screenRings.length > 0,
      crossed: crossed
    };
  }

  function buildProjectedPath(ctx, rings) {
    for (var r = 0; r < rings.length; r++) {
      var ring = rings[r];
      if (!ring.length) continue;
      ctx.moveTo(ring[0].x, ring[0].y);
      for (var i = 1; i < ring.length; i++) {
        ctx.lineTo(ring[i].x, ring[i].y);
      }
      ctx.closePath();
    }
  }

  function drawGlobe() {
    var ctx = state.ctx;
    if (!ctx || !state.cw || !state.ch || state.screen !== "game") return;
    updateTrig();

    var dpr = state.dpr || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, state.cw, state.ch);

    var cx = state.cw / 2;
    var cy = state.ch / 2;
    var radius = globeRadius();
    var clipRadius = Math.min(state.cw, state.ch) / 2 - 2;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, clipRadius, 0, Math.PI * 2);
    ctx.clip();

    var ocean = ctx.createRadialGradient(
      cx - radius * 0.28,
      cy - radius * 0.32,
      Math.max(1, radius * 0.08),
      cx,
      cy,
      Math.max(2, radius * 1.08)
    );
    ocean.addColorStop(0, "#1f7fa4");
    ocean.addColorStop(0.55, "#0b4c6e");
    ocean.addColorStop(1, "#041a2b");
    ctx.fillStyle = ocean;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    var glint = ctx.createRadialGradient(
      cx - radius * 0.34,
      cy - radius * 0.38,
      0,
      cx - radius * 0.34,
      cy - radius * 0.38,
      radius * 0.9
    );
    glint.addColorStop(0, "rgba(255, 255, 255, 0.16)");
    glint.addColorStop(0.4, "rgba(255, 255, 255, 0.045)");
    glint.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = glint;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    drawGraticule(ctx, cx, cy, radius);
    drawLand(ctx, cx, cy, radius);
    drawCountries(ctx, cx, cy, radius);
    drawShading(ctx, cx, cy, radius);
    drawPointCountries(ctx, cx, cy, radius);
    drawMarkers(ctx, cx, cy, radius);

    ctx.restore();

    var edge = Math.min(radius, clipRadius);
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, edge, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(120, 220, 255, 0.34)";
    ctx.lineWidth = 2;
    ctx.shadowColor = "rgba(80, 200, 255, 0.55)";
    ctx.shadowBlur = 18;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, edge + 5, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(120, 220, 255, 0.10)";
    ctx.lineWidth = 10;
    ctx.stroke();
    ctx.restore();
  }

  function createLandGradient(ctx, cx, cy, radius) {
    var gradient = ctx.createLinearGradient(
      0,
      cy - radius,
      0,
      cy + radius
    );
    gradient.addColorStop(0, "#a7c2a1");
    gradient.addColorStop(0.42, "#6b9c77");
    gradient.addColorStop(0.72, "#4a7d60");
    gradient.addColorStop(1, "#315b49");
    return gradient;
  }

  function drawShading(ctx, cx, cy, radius) {
    var shade = ctx.createRadialGradient(
      cx - radius * 0.32,
      cy - radius * 0.38,
      Math.max(1, radius * 0.15),
      cx,
      cy,
      Math.max(2, radius * 1.02)
    );
    shade.addColorStop(0, "rgba(255, 255, 255, 0.045)");
    shade.addColorStop(0.55, "rgba(0, 0, 0, 0)");
    shade.addColorStop(1, "rgba(0, 0, 0, 0.22)");
    ctx.fillStyle = shade;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawGraticule(ctx, cx, cy, radius) {
    ctx.save();
    ctx.strokeStyle = "rgba(190, 235, 255, 0.11)";
    ctx.lineWidth = 1;
    ctx.lineCap = "round";

    var lon;
    var lat;
    var point;
    var started;

    for (lon = -180; lon < 180; lon += 30) {
      ctx.beginPath();
      started = false;
      for (lat = -90; lat <= 90; lat += 3) {
        point = project(lat, lon, cx, cy, radius);
        if (point.z >= 0) {
          if (!started) {
            ctx.moveTo(point.x, point.y);
            started = true;
          } else {
            ctx.lineTo(point.x, point.y);
          }
        } else {
          started = false;
        }
      }
      ctx.stroke();
    }

    for (lat = -60; lat <= 60; lat += 30) {
      ctx.beginPath();
      started = false;
      for (lon = -180; lon <= 180; lon += 3) {
        point = project(lat, lon, cx, cy, radius);
        if (point.z >= 0) {
          if (!started) {
            ctx.moveTo(point.x, point.y);
            started = true;
          } else {
            ctx.lineTo(point.x, point.y);
          }
        } else {
          started = false;
        }
      }
      ctx.stroke();
    }

    ctx.strokeStyle = "rgba(190, 235, 255, 0.17)";
    ctx.beginPath();
    started = false;
    for (lon = -180; lon <= 180; lon += 2) {
      point = project(0, lon, cx, cy, radius);
      if (point.z >= 0) {
        if (!started) {
          ctx.moveTo(point.x, point.y);
          started = true;
        } else {
          ctx.lineTo(point.x, point.y);
        }
      } else {
        started = false;
      }
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawLand(ctx, cx, cy, radius) {
    ctx.save();
    ctx.fillStyle = createLandGradient(ctx, cx, cy, radius);
    ctx.strokeStyle = "rgba(30, 70, 52, 0.40)";
    ctx.lineWidth = 0.8;
    ctx.lineJoin = "round";
    for (var i = 0; i < LAND_POLYS.length; i++) {
      var polygon = LAND_POLYS[i];
      var projected = projectPolygon(polygon, cx, cy, radius);
      if (!projected.hasFront) continue;
      ctx.beginPath();
      buildProjectedPath(ctx, projected.rings);
      ctx.fill("evenodd");
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawCountries(ctx, cx, cy, radius) {
    var landGradient = createLandGradient(ctx, cx, cy, radius);
    var drawable = [];
    var i;
    for (i = 0; i < COUNTRY_POLYS.length; i++) {
      var polygon = COUNTRY_POLYS[i];
      var projected = projectPolygon(polygon, cx, cy, radius);
      if (projected.hasFront) {
        drawable.push({ polygon: polygon, projected: projected, z: projected.avg });
      }
    }
    drawable.sort(function (a, b) {
      return a.z - b.z;
    });

    for (i = 0; i < drawable.length; i++) {
      var item = drawable[i];
      var poly = item.polygon;
      var guess = state.guessByCode[poly.code];
      ctx.beginPath();
      buildProjectedPath(ctx, item.projected.rings);
      if (guess) {
        ctx.save();
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = guess.temp.globe || guess.temp.color;
        ctx.shadowColor = guess.temp.globe || guess.temp.color;
        ctx.shadowBlur = 18;
        ctx.fill("evenodd");
        ctx.restore();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.92)";
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        ctx.fillStyle = landGradient;
        ctx.fill("evenodd");
        ctx.strokeStyle = "rgba(235, 250, 245, 0.42)";
        ctx.lineWidth = 0.9;
        ctx.stroke();
      }
    }
  }

  function drawPointCountries(ctx, cx, cy, radius) {
    ctx.save();
    ctx.fillStyle = "rgba(64, 142, 106, 0.95)";
    ctx.strokeStyle = "rgba(220, 245, 235, 0.55)";
    ctx.lineWidth = 0.7;
    for (var i = 0; i < COUNTRIES.length; i++) {
      var country = COUNTRIES[i];
      if (!country.pt) continue;
      var point = project(country.lat, country.lon, cx, cy, radius);
      if (point.z <= 0.015) continue;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawMarkers(ctx, cx, cy, radius) {
    ctx.save();
    for (var i = 0; i < state.guesses.length; i++) {
      var guess = state.guesses[i];
      var country = guess.country;
      var point = project(country.lat, country.lon, cx, cy, radius);
      if (point.z <= 0.01) continue;
      var isLast = Boolean(state.lastGuess) && country.c === state.lastGuess.c;
      var globeColor = guess.temp.globe || guess.temp.color;
      ctx.beginPath();
      ctx.arc(point.x, point.y, isLast ? 11 : 7, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(point.x, point.y, isLast ? 8 : 5, 0, Math.PI * 2);
      ctx.strokeStyle = globeColor;
      ctx.lineWidth = 3;
      ctx.shadowColor = globeColor;
      ctx.shadowBlur = isLast ? 16 : 8;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(point.x, point.y, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
    }
    ctx.restore();
  }

  function setFeedback(text, kind) {
    if (!els.feedback) return;
    els.feedback.textContent = text || "";
    els.feedback.className = "feedback" + (kind ? " " + kind : "");
  }

  function announce(text) {
    if (!els.live) return;
    els.live.textContent = "";
    window.clearTimeout(state.announceTimer);
    state.announceTimer = window.setTimeout(function () {
      els.live.textContent = text;
    }, 40);
  }

  function hideSuggestions() {
    if (!els.suggestions) return;
    els.suggestions.hidden = true;
    els.suggestions.innerHTML = "";
    els.guessInput.setAttribute("aria-expanded", "false");
    els.guessInput.removeAttribute("aria-activedescendant");
    state.suggestions = [];
    state.activeSuggestion = -1;
  }

  function setActiveSuggestion(index) {
    var items = els.suggestions.querySelectorAll("li");
    if (!items.length) return;
    var next = ((index % items.length) + items.length) % items.length;
    state.activeSuggestion = next;
    for (var i = 0; i < items.length; i++) {
      var active = i === next;
      items[i].setAttribute("aria-selected", active ? "true" : "false");
    }
    els.guessInput.setAttribute(
      "aria-activedescendant",
      items[next].id
    );
    items[next].scrollIntoView({ block: "nearest" });
  }

  function renderSuggestions() {
    if (!state.suggestions.length) {
      hideSuggestions();
      return;
    }
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < state.suggestions.length; i++) {
      var country = state.suggestions[i];
      var item = document.createElement("li");
      item.id = "sug-" + country.c;
      item.setAttribute("role", "option");
      item.setAttribute("aria-selected", "false");
      var name = document.createElement("span");
      name.textContent = country.n;
      var region = document.createElement("small");
      region.textContent = country.r || "mundo";
      item.appendChild(name);
      item.appendChild(region);
      item.addEventListener("pointerdown", function (event) {
        event.preventDefault();
        var code = this.id.replace(/^sug-/, "");
        var chosen = BY_CODE[code];
        if (chosen) {
          els.guessInput.value = chosen.n;
          hideSuggestions();
          submitGuess();
        }
      });
      fragment.appendChild(item);
    }
    els.suggestions.innerHTML = "";
    els.suggestions.appendChild(fragment);
    els.suggestions.hidden = false;
    els.guessInput.setAttribute("aria-expanded", "true");
    state.activeSuggestion = -1;
    els.guessInput.removeAttribute("aria-activedescendant");
  }

  function updateSuggestions() {
    if (!els.guessInput) return;
    var query = els.guessInput.value;
    if (!query.trim()) {
      hideSuggestions();
      return;
    }
    state.suggestions = searchCountries(query);
    renderSuggestions();
  }

  function showHint(level) {
    if (!state.target) return;
    state.hintLevel = level;
    els.targetEyebrow.textContent = "Pista do país secreto";
    els.targetName.textContent = "Região: " + (state.target.r || "mundo");
    if (level === 1) {
      els.targetFact.textContent =
        "O país ocupa " + formatArea(state.target.a) + ".";
    } else {
      var words = state.target.n.split(/\s+/);
      var lastWord = words[words.length - 1] || state.target.n;
      var first = lastWord.charAt(0).toUpperCase();
      els.targetFact.textContent =
        "A última palavra do nome começa com “" +
        first +
        "” e o país ocupa " +
        formatArea(state.target.a) +
        ".";
    }
    els.targetHint.hidden = false;
    announce(
      "Pista disponível. " +
        els.targetName.textContent +
        ". " +
        els.targetFact.textContent
    );
  }

  function renderStars(container, count) {
    if (!container) return;
    container.innerHTML = "";
    for (var i = 0; i < 3; i++) {
      var star = document.createElement("span");
      star.className = "star" + (i < count ? " is-on" : "");
      star.textContent = "★";
      star.setAttribute("aria-hidden", "true");
      container.appendChild(star);
    }
    container.setAttribute("aria-label", count + " de 3 estrelas");
  }

  function renderGuessList() {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < state.guesses.length; i++) {
      var guess = state.guesses[i];
      var item = document.createElement("li");
      item.className = "guess-item";
      item.style.setProperty("--c", guess.temp.color);
      item.setAttribute(
        "aria-label",
        guess.country.n +
          ", " +
          formatKm(guess.km) +
          " do país secreto, " +
          guess.temp.label
      );

      var swatch = document.createElement("span");
      swatch.className = "guess-swatch";
      swatch.setAttribute("aria-hidden", "true");

      var main = document.createElement("span");
      main.className = "guess-main";
      var name = document.createElement("span");
      name.className = "guess-name";
      name.textContent = guess.country.n;
      var distance = document.createElement("span");
      distance.className = "guess-distance";
      distance.textContent = "a " + formatKm(guess.km) + " do alvo";
      main.appendChild(name);
      main.appendChild(distance);

      var badge = document.createElement("span");
      badge.className = "guess-temp";
      badge.textContent = guess.temp.label;

      item.appendChild(swatch);
      item.appendChild(main);
      item.appendChild(badge);
      fragment.appendChild(item);
    }

    els.guessList.innerHTML = "";
    els.guessList.appendChild(fragment);
    var total = state.guesses.length;
    els.guessCount.textContent = total + (total === 1 ? " chute" : " chutes");
    els.emptyList.hidden = total > 0;
    els.guessList.scrollTop = els.guessList.scrollHeight;
  }

  function readStats() {
    try {
      var raw = window.localStorage.getItem("qual-e-o-pais-stats");
      var stats = raw ? JSON.parse(raw) : null;
      if (!stats || typeof stats !== "object") {
        return { played: 0, wins: 0 };
      }
      return {
        played: Number(stats.played) || 0,
        wins: Number(stats.wins) || 0
      };
    } catch (error) {
      return null;
    }
  }

  function writeStats(stats) {
    try {
      window.localStorage.setItem(
        "qual-e-o-pais-stats",
        JSON.stringify(stats)
      );
    } catch (error) {
      // armazenamento bloqueado: o jogo segue sem estatísticas
    }
  }

  function bumpStats(field) {
    var stats = readStats();
    if (!stats) return;
    stats[field] = (stats[field] || 0) + 1;
    writeStats(stats);
    renderStats();
  }

  function renderStats() {
    if (!els.statsLine) return;
    var stats = readStats();
    if (!stats || !stats.played) {
      els.statsLine.hidden = true;
      return;
    }
    els.statsLine.textContent =
      "Partidas: " +
      formatNumber(stats.played) +
      " · Acertos: " +
      formatNumber(stats.wins);
    els.statsLine.hidden = false;
  }

  function notifyRestart() {
    window.parent.postMessage({ type: "vrgame:restart" }, "*");
  }

  function sendFinish(stars) {
    if (state.finishSent) return;
    state.finishSent = true;
    window.parent.postMessage(
      {
        type: "vrgame:finish",
        score: stars,
        maxScore: 3,
        timeMs: Math.max(0, Date.now() - state.startedAt),
        detail: {
          mode: state.mode,
          target: state.target.c,
          targetName: state.target.n,
          guesses: state.guesses.length,
          won: state.won,
          hintLevel: state.hintLevel
        }
      },
      "*"
    );
  }

  function scheduleReportHeight() {
    if (state.reportPending) return;
    state.reportPending = true;
    window.requestAnimationFrame(function () {
      state.reportPending = false;
      reportHeight();
    });
  }

  function reportHeight() {
    var height = Math.ceil(
      document.body.getBoundingClientRect().height ||
        document.body.scrollHeight ||
        0
    );
    if (Math.abs(height - state.lastHeight) < 4) return;
    state.lastHeight = height;
    window.parent.postMessage({ type: "vrgame:resize", height: height }, "*");
  }

  function showScreen(name, focusTarget) {
    state.screen = name;
    for (var i = 0; i < els.screens.length; i++) {
      els.screens[i].hidden =
        els.screens[i].id !== "screen-" + name;
    }
    window.scrollTo(0, 0);
    window.requestAnimationFrame(function () {
      if (name === "game") {
        resizeCanvas();
        requestDraw();
        if (els.guessInput) els.guessInput.focus();
      } else if (focusTarget && focusTarget.focus) {
        focusTarget.focus();
      }
      scheduleReportHeight();
    });
  }

  function pickCountry(mode) {
    if (mode === "daily") {
      var rng = mulberry32(hashString("qual-e-o-pais-" + dateKey()));
      return COUNTRIES[Math.floor(rng() * COUNTRIES.length)];
    }
    var pick = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
    if (state.lastTarget && COUNTRIES.length > 1) {
      var guard = 0;
      while (pick.c === state.lastTarget && guard < 20) {
        pick = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
        guard++;
      }
    }
    return pick;
  }

  function startGame(mode) {
    if (!COUNTRIES.length) return;
    window.clearTimeout(state.resultTimer);
    state.resultTimer = 0;
    notifyRestart();
    state.mode = mode === "daily" ? "daily" : "free";
    state.target = pickCountry(state.mode);
    state.lastTarget = state.target.c;
    state.guesses = [];
    state.guessByCode = {};
    state.won = false;
    state.finished = false;
    state.finishSent = false;
    state.countedPlay = false;
    state.hintLevel = 0;
    state.startedAt = Date.now();
    state.rotationY = 0.35;
    state.rotationX = 0.18;
    state.zoom = 1;

    els.modeLabel.textContent =
      state.mode === "daily"
        ? "País do dia · " + shortDate()
        : "Modo livre";
    els.guessInput.value = "";
    els.guessInput.disabled = false;
    els.guessSubmit.disabled = false;
    els.giveUp.disabled = false;
    setFeedback("", "");
    hideSuggestions();
    els.guessList.innerHTML = "";
    els.guessCount.textContent = "0 chutes";
    els.emptyList.hidden = false;
    els.targetHint.hidden = true;
    els.targetEyebrow.textContent = "Pista do país secreto";
    els.targetName.textContent = "";
    els.targetFact.textContent = "";

    showScreen("game");
    announce(
      state.mode === "daily"
        ? "País do dia. Digite um país para começar."
        : "Modo livre. Digite um país para começar."
    );
  }

  function submitGuess() {
    if (state.finished) return;
    var raw = els.guessInput.value.trim();
    if (!raw) {
      setFeedback("Digite o nome de um país.", "is-bad");
      els.guessInput.focus();
      return;
    }

    var country = findExact(raw);
    if (!country) {
      setFeedback(
        "País não encontrado. Escolha uma sugestão da lista.",
        "is-bad"
      );
      updateSuggestions();
      els.guessInput.focus();
      return;
    }

    if (state.guessByCode[country.c]) {
      setFeedback(
        "Você já chutou " + country.n + ". Tente outro país.",
        "is-bad"
      );
      els.guessInput.select();
      return;
    }

    var km = haversine(
      state.target.lat,
      state.target.lon,
      country.lat,
      country.lon
    );
    var temp = tempFor(km);
    var guess = { country: country, km: km, temp: temp };
    state.guesses.push(guess);
    state.guessByCode[country.c] = guess;
    state.lastGuess = country;
    if (!state.countedPlay) {
      state.countedPlay = true;
      bumpStats("played");
    }

    renderGuessList();
    els.guessInput.value = "";
    hideSuggestions();
    els.guessInput.focus();

    if (country.c === state.target.c) {
      state.won = true;
      state.finished = true;
      bumpStats("wins");
      setFeedback(
        "Acertou! O país secreto é " + country.n + ".",
        "is-good"
      );
      announce("Acertou! O país secreto é " + country.n + ".");
      centerOn(country);
      els.guessInput.disabled = true;
      els.guessSubmit.disabled = true;
      els.giveUp.disabled = true;
      state.resultTimer = window.setTimeout(function () {
        state.resultTimer = 0;
        if (state.screen === "game" && state.won && !state.finishSent) {
          showResult(true);
        }
      }, 900);
    } else {
      setFeedback(
        country.n +
          " está a " +
          formatKm(km) +
          " do país secreto. " +
          temp.label +
          ".",
        ""
      );
      announce(
        country.n +
          " está a " +
          formatKm(km) +
          " do país secreto."
      );
      centerOn(country);
      if (state.guesses.length >= 3 && state.hintLevel < 1) {
        showHint(1);
        setFeedback(
          country.n +
            " está a " +
            formatKm(km) +
            " do país secreto. Uma pista apareceu abaixo.",
          ""
        );
      } else if (state.guesses.length >= 5 && state.hintLevel < 2) {
        showHint(2);
      }
    }

    requestDraw();
  }

  function giveUp() {
    if (state.finished) return;
    state.won = false;
    state.finished = true;
    showResult(false);
  }

  function showResult(won) {
    if (state.finishSent) return;
    window.clearTimeout(state.resultTimer);
    state.resultTimer = 0;
    state.finished = true;
    var stars = won
      ? state.guesses.length <= 4
        ? 3
        : state.guesses.length <= 6
          ? 2
          : 1
      : 0;
    var target = state.target;
    var guessWord =
      state.guesses.length === 1 ? "chute" : "chutes";
    var outcome = won
      ? "Você acertou em " +
        state.guesses.length +
        " " +
        guessWord +
        "."
      : state.guesses.length === 0
        ? "Você desistiu sem chutar."
        : "Você desistiu depois de " +
          state.guesses.length +
          " " +
          guessWord +
          ".";

    els.resultEyebrow.textContent =
      state.mode === "daily" ? "País do dia" : "Partida concluída";
    els.resultTitle.textContent = won
      ? "Você acertou!"
      : "Não foi dessa vez.";
    els.resultText.textContent =
      "O país secreto era " +
      target.n +
      ". Fica na região " +
      (target.r || "mundo") +
      " e ocupa " +
      formatArea(target.a) +
      ". " +
      outcome +
      (state.mode === "daily"
        ? " Volte amanhã para outro país do dia."
        : " Jogue de novo para outro país.");
    els.resultTitle.setAttribute("tabindex", "-1");
    renderStars(els.resultStars, stars);
    els.playAgain.hidden = state.mode === "daily";
    showScreen("result", els.resultTitle);
    sendFinish(stars);
  }

  function replay() {
    if (state.mode === "daily") {
      startGame("daily");
    } else {
      startGame("free");
    }
  }

  function backToStart() {
    window.clearTimeout(state.resultTimer);
    state.resultTimer = 0;
    state.finished = true;
    hideSuggestions();
    notifyRestart();
    renderStats();
    showScreen("start", els.playDaily);
    announce("Escolha um modo para jogar.");
  }

  function onInputKeyDown(event) {
    var key = event.key;
    if (key === "ArrowDown") {
      event.preventDefault();
      if (els.suggestions.hidden) updateSuggestions();
      if (state.suggestions.length) {
        setActiveSuggestion(
          state.activeSuggestion < 0 ? 0 : state.activeSuggestion + 1
        );
      }
      return;
    }
    if (key === "ArrowUp") {
      event.preventDefault();
      if (els.suggestions.hidden) updateSuggestions();
      if (state.suggestions.length) {
        setActiveSuggestion(
          state.activeSuggestion < 0
            ? state.suggestions.length - 1
            : state.activeSuggestion - 1
        );
      }
      return;
    }
    if (key === "Enter") {
      if (!els.suggestions.hidden && state.activeSuggestion >= 0) {
        event.preventDefault();
        var active = state.suggestions[state.activeSuggestion];
        if (active) {
          els.guessInput.value = active.n;
          hideSuggestions();
          submitGuess();
        }
        return;
      }
      event.preventDefault();
      submitGuess();
      return;
    }
    if (key === "Escape") {
      hideSuggestions();
      return;
    }
  }

  function onPointerDown(event) {
    if (event.button !== undefined && event.button !== 0) return;
    state.dragging = true;
    state.dragX = event.clientX;
    state.dragY = event.clientY;
    if (els.canvas.setPointerCapture) {
      try {
        els.canvas.setPointerCapture(event.pointerId);
      } catch (error) {
        // ponteiro sem captura: o arraste continua enquanto estiver sobre o globo
      }
    }
    event.preventDefault();
  }

  function onPointerMove(event) {
    if (!state.dragging) return;
    var dx = event.clientX - state.dragX;
    var dy = event.clientY - state.dragY;
    state.dragX = event.clientX;
    state.dragY = event.clientY;
    state.rotationY += dx * 0.006;
    state.rotationX = clamp(state.rotationX + dy * 0.006, -1.45, 1.45);
    requestDraw();
    event.preventDefault();
  }

  function onPointerUp(event) {
    if (!state.dragging) return;
    state.dragging = false;
    if (els.canvas.releasePointerCapture) {
      try {
        els.canvas.releasePointerCapture(event.pointerId);
      } catch (error) {
        // ponteiro já liberado
      }
    }
  }

  function applyTheme(theme) {
    var next = theme;
    if (next !== "dark" && next !== "light") {
      next = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    document.documentElement.dataset.theme = next;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute(
        "content",
        next === "dark" ? "#08131f" : "#f6f0e4"
      );
    }
  }

  function preferredTheme() {
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
    if (event.source === window) return;
    if (!event.data || typeof event.data !== "object") return;
    if (event.data.type === "vrgame:theme") {
      state.themeLocked = true;
      applyTheme(event.data.theme);
    }
    if (event.data.type === "vrgame:fullscreen") {
      document.documentElement.classList.toggle(
        "is-fullscreen",
        Boolean(event.data.fullscreen)
      );
      scheduleReportHeight();
    }
    if (event.data.type === "vrgame:restart") {
      if (state.screen === "game" || state.screen === "result") {
        startGame(state.mode);
      }
    }
  }

  function bindEvents() {
    els.playDaily.addEventListener("click", function () {
      startGame("daily");
    });
    els.playFree.addEventListener("click", function () {
      startGame("free");
    });
    els.guessSubmit.addEventListener("click", submitGuess);
    els.guessInput.addEventListener("input", updateSuggestions);
    els.guessInput.addEventListener("keydown", onInputKeyDown);
    els.guessInput.addEventListener("blur", function () {
      window.setTimeout(hideSuggestions, 120);
    });
    els.giveUp.addEventListener("click", giveUp);
    els.back.addEventListener("click", backToStart);
    els.zoomIn.addEventListener("click", function () {
      setZoom(state.zoom * 1.15);
    });
    els.zoomOut.addEventListener("click", function () {
      setZoom(state.zoom / 1.15);
    });
    els.focusLast.addEventListener("click", function () {
      if (state.lastGuess) {
        centerOn(state.lastGuess);
      } else {
        setFeedback("Faça um chute para centralizar o globo nele.", "");
      }
    });

    els.canvas.addEventListener("pointerdown", onPointerDown);
    els.canvas.addEventListener("pointermove", onPointerMove);
    els.canvas.addEventListener("pointerup", onPointerUp);
    els.canvas.addEventListener("pointercancel", onPointerUp);

    document.addEventListener("pointerdown", function (event) {
      if (
        els.suggestions.contains(event.target) ||
        event.target === els.guessInput
      ) {
        return;
      }
      hideSuggestions();
    });

    els.playAgain.addEventListener("click", replay);
    els.resultMenu.addEventListener("click", backToStart);

    window.addEventListener("message", onMessage);
    window.addEventListener("resize", function () {
      resizeCanvas();
      requestDraw();
      scheduleReportHeight();
    });

    if ("ResizeObserver" in window) {
      new ResizeObserver(function () {
        resizeCanvas();
        requestDraw();
        scheduleReportHeight();
      }).observe(els.globeWrap);
      new ResizeObserver(scheduleReportHeight).observe(document.body);
    }

    var darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
    if (darkQuery.addEventListener) {
      darkQuery.addEventListener("change", function (event) {
        if (!state.themeLocked) {
          applyTheme(event.matches ? "dark" : "light");
        }
      });
    }
  }

  function init() {
    if (
      !DATA ||
      !Array.isArray(DATA.countries) ||
      DATA.countries.length === 0
    ) {
      if (els.lead) {
        els.lead.textContent =
          "Conteúdo indisponível. Tente recarregar a página.";
      }
      if (els.playDaily) els.playDaily.disabled = true;
      if (els.playFree) els.playFree.disabled = true;
      window.parent.postMessage({ type: "vrgame:ready" }, "*");
      window.requestAnimationFrame(scheduleReportHeight);
      return;
    }

    buildGeoData();
    state.ctx = els.canvas.getContext("2d");
    bindEvents();
    renderStats();
    applyTheme(preferredTheme());

    if (els.topbarStatus) {
      els.topbarStatus.textContent =
        "Geografia · " + COUNTRIES.length + " países";
    }

    try {
      if (window.self === window.top) {
        document.documentElement.classList.add("is-standalone");
      }
    } catch (error) {
      // iframe com origem diferente: segue normalmente
    }

    showScreen("start");
    window.parent.postMessage({ type: "vrgame:ready" }, "*");
    window.requestAnimationFrame(scheduleReportHeight);
  }

  init();
})();
