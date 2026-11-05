/*
 * MODELO DE JOGO — Jogos VR
 * -------------------------
 * Este arquivo é seu. Troque a lógica, o placar e as regras.
 * O que NÃO deve mudar é o contrato com o portal, explicado abaixo.
 */
(function () {
  "use strict";

  // 1. Configuração: mude à vontade.
  var CONFIG = {
    rounds: 10,
    title: "Clique no Alvo",
  };

  var state = {
    score: 0,
    round: 0,
    startedAt: null,
    finished: false,
    timerId: null,
  };

  var els = {
    board: document.getElementById("board"),
    score: document.getElementById("score"),
    total: document.getElementById("total"),
    timer: document.getElementById("timer"),
    hint: document.getElementById("start-hint"),
    restart: document.getElementById("restart"),
    result: document.getElementById("result"),
    resultText: document.getElementById("result-text"),
    playAgain: document.getElementById("play-again"),
  };

  // 2. Avisa o portal que o jogo carregou.
  window.parent.postMessage({ type: "vrgame:ready" }, "*");

  function formatTime(ms) {
    return (ms / 1000).toFixed(1).replace(".", ",") + "s";
  }

  function startTimer() {
    if (state.startedAt) return;
    state.startedAt = Date.now();
    state.timerId = window.setInterval(function () {
      els.timer.textContent = formatTime(Date.now() - state.startedAt);
    }, 100);
  }

  function stopTimer() {
    if (state.timerId) {
      window.clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  function spawnTarget() {
    var old = els.board.querySelector(".target");
    if (old) old.remove();

    var size = 64;
    var maxX = Math.max(0, els.board.clientWidth - size - 8);
    var maxY = Math.max(0, els.board.clientHeight - size - 8);

    var button = document.createElement("button");
    button.type = "button";
    button.className = "target";
    button.setAttribute("aria-label", "Alvo " + (state.round + 1));
    button.style.left = 4 + Math.random() * maxX + "px";
    button.style.top = 4 + Math.random() * maxY + "px";
    button.addEventListener("click", hitTarget);
    els.board.appendChild(button);
    button.focus();
  }

  function hitTarget() {
    if (state.finished) return;
    startTimer();

    state.score += 1;
    state.round += 1;
    els.score.textContent = String(state.score);

    if (state.round >= CONFIG.rounds) {
      finish();
      return;
    }

    spawnTarget();
  }

  function finish() {
    state.finished = true;
    stopTimer();
    var timeMs = state.startedAt ? Date.now() - state.startedAt : 0;

    els.result.hidden = false;
    els.resultText.textContent =
      "Você acertou " +
      state.score +
      " de " +
      CONFIG.rounds +
      " alvos em " +
      formatTime(timeMs) +
      ".";

    // 3. Avisa o portal que a partida terminou e envia o resultado.
    window.parent.postMessage(
      {
        type: "vrgame:finish",
        score: state.score,
        maxScore: CONFIG.rounds,
        timeMs: timeMs,
        detail: { mode: "template" },
      },
      "*"
    );
  }

  function reset() {
    stopTimer();
    state.score = 0;
    state.round = 0;
    state.startedAt = null;
    state.finished = false;
    els.score.textContent = "0";
    els.timer.textContent = "0,0s";
    els.result.hidden = true;
    els.hint.hidden = false;
    els.total.textContent = String(CONFIG.rounds);

    var old = els.board.querySelector(".target");
    if (old) old.remove();
  }

  // 4. O portal avisa se o tema é claro ou escuro.
  function applyTheme(theme) {
    if (theme === "dark" || theme === "light") {
      document.documentElement.dataset.theme = theme;
    }
  }

  // Na nova aba não existe portal: ?theme= > localStorage > preferência do sistema.
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

  var lastHeight = 0;

  function reportHeight() {
    var height = Math.ceil(document.body.getBoundingClientRect().height);
    if (Math.abs(height - lastHeight) < 4) return;
    lastHeight = height;
    window.parent.postMessage({ type: "vrgame:resize", height: height }, "*");
  }

  window.addEventListener("message", function (event) {
    if (!event.data) return;

    if (event.data.type === "vrgame:theme") {
      applyTheme(event.data.theme);
    }

    if (event.data.type === "vrgame:fullscreen") {
      document.documentElement.classList.toggle(
        "is-fullscreen",
        Boolean(event.data.fullscreen)
      );
    }
  });

  els.board.addEventListener("pointerdown", function () {
    if (state.round === 0 && !state.finished) {
      els.hint.hidden = true;
      spawnTarget();
    }
  });

  els.restart.addEventListener("click", reset);
  els.playAgain.addEventListener("click", reset);

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

  els.total.textContent = String(CONFIG.rounds);
  document.getElementById("title").textContent = CONFIG.title;
})();
