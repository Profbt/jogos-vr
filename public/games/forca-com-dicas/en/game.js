/*
 * HANGMAN WITH HINTS — VR Games
 * ----------------------------
 * Campaign of 3 levels, 5 words per level. Each word shows part of speech
 * and meaning. Lives drop from 6 to 5 and 4.
 * The portal contract is at the end of the file.
 */
(function () {
  "use strict";

  var CONFIG = {
    wordsPerLevel: 5,
    pointsPerWord: 20,
    penaltyPerError: 4,
  };

  var LEVELS = [
  {
    "name": "Easy",
    "lives": 6,
    "words": [
      {
        "word": "APPLE",
        "hint": "noun",
        "meaning": "red or green fruit."
      },
      {
        "word": "BANANA",
        "hint": "noun",
        "meaning": "long yellow fruit."
      },
      {
        "word": "ORANGE",
        "hint": "noun",
        "meaning": "citrus fruit."
      },
      {
        "word": "GRAPE",
        "hint": "noun",
        "meaning": "small round fruit."
      },
      {
        "word": "LEMON",
        "hint": "noun",
        "meaning": "sour yellow citrus."
      },
      {
        "word": "PEACH",
        "hint": "noun",
        "meaning": "soft fuzzy fruit."
      },
      {
        "word": "MELON",
        "hint": "noun",
        "meaning": "large sweet fruit."
      },
      {
        "word": "CHERRY",
        "hint": "noun",
        "meaning": "small red fruit."
      },
      {
        "word": "BERRY",
        "hint": "noun",
        "meaning": "small juicy fruit."
      },
      {
        "word": "MANGO",
        "hint": "noun",
        "meaning": "tropical sweet fruit."
      },
      {
        "word": "CAR",
        "hint": "noun",
        "meaning": "four-wheeled vehicle."
      },
      {
        "word": "BUS",
        "hint": "noun",
        "meaning": "public transport vehicle."
      },
      {
        "word": "TRAIN",
        "hint": "noun",
        "meaning": "rail transport."
      },
      {
        "word": "PLANE",
        "hint": "noun",
        "meaning": "flying vehicle."
      },
      {
        "word": "BOAT",
        "hint": "noun",
        "meaning": "water vehicle."
      },
      {
        "word": "BIKE",
        "hint": "noun",
        "meaning": "two-wheeled vehicle."
      },
      {
        "word": "TRUCK",
        "hint": "noun",
        "meaning": "large cargo vehicle."
      },
      {
        "word": "TAXI",
        "hint": "noun",
        "meaning": "hired car."
      },
      {
        "word": "METRO",
        "hint": "noun",
        "meaning": "underground train."
      },
      {
        "word": "FERRY",
        "hint": "noun",
        "meaning": "boat for crossing."
      },
      {
        "word": "DOG",
        "hint": "noun",
        "meaning": "loyal pet animal."
      },
      {
        "word": "CAT",
        "hint": "noun",
        "meaning": "small furry pet."
      },
      {
        "word": "BIRD",
        "hint": "noun",
        "meaning": "winged animal."
      },
      {
        "word": "FISH",
        "hint": "noun",
        "meaning": "aquatic animal."
      },
      {
        "word": "HORSE",
        "hint": "noun",
        "meaning": "riding animal."
      },
      {
        "word": "COW",
        "hint": "noun",
        "meaning": "milk-producing animal."
      },
      {
        "word": "PIG",
        "hint": "noun",
        "meaning": "farm animal."
      },
      {
        "word": "SHEEP",
        "hint": "noun",
        "meaning": "wool-producing animal."
      },
      {
        "word": "GOAT",
        "hint": "noun",
        "meaning": "horned farm animal."
      },
      {
        "word": "DUCK",
        "hint": "noun",
        "meaning": "water bird."
      },
      {
        "word": "TREE",
        "hint": "noun",
        "meaning": "tall plant with trunk."
      },
      {
        "word": "FLOWER",
        "hint": "noun",
        "meaning": "colorful plant part."
      },
      {
        "word": "GRASS",
        "hint": "noun",
        "meaning": "green ground plant."
      },
      {
        "word": "LEAF",
        "hint": "noun",
        "meaning": "flat green plant part."
      },
      {
        "word": "BRANCH",
        "hint": "noun",
        "meaning": "tree arm."
      },
      {
        "word": "ROOT",
        "hint": "noun",
        "meaning": "plant anchor."
      },
      {
        "word": "TRUNK",
        "hint": "noun",
        "meaning": "tree main stem."
      },
      {
        "word": "FOREST",
        "hint": "noun",
        "meaning": "dense tree area."
      },
      {
        "word": "GARDEN",
        "hint": "noun",
        "meaning": "cultivated plant area."
      },
      {
        "word": "PARK",
        "hint": "noun",
        "meaning": "public green space."
      },
      {
        "word": "HOUSE",
        "hint": "noun",
        "meaning": "place to live."
      },
      {
        "word": "DOOR",
        "hint": "noun",
        "meaning": "entry opening."
      },
      {
        "word": "WINDOW",
        "hint": "noun",
        "meaning": "glass wall opening."
      },
      {
        "word": "ROOF",
        "hint": "noun",
        "meaning": "top cover of house."
      },
      {
        "word": "WALL",
        "hint": "noun",
        "meaning": "vertical barrier."
      },
      {
        "word": "FLOOR",
        "hint": "noun",
        "meaning": "ground surface."
      },
      {
        "word": "ROOM",
        "hint": "noun",
        "meaning": "walled space."
      },
      {
        "word": "KITCHEN",
        "hint": "noun",
        "meaning": "cooking room."
      },
      {
        "word": "BEDROOM",
        "hint": "noun",
        "meaning": "sleeping room."
      },
      {
        "word": "BATHROOM",
        "hint": "noun",
        "meaning": "washing room."
      },
      {
        "word": "BOOK",
        "hint": "noun",
        "meaning": "printed pages."
      },
      {
        "word": "PEN",
        "hint": "noun",
        "meaning": "writing tool."
      },
      {
        "word": "PENCIL",
        "hint": "noun",
        "meaning": "graphite writing tool."
      },
      {
        "word": "PAPER",
        "hint": "noun",
        "meaning": "writing surface."
      },
      {
        "word": "DESK",
        "hint": "noun",
        "meaning": "work table."
      },
      {
        "word": "CHAIR",
        "hint": "noun",
        "meaning": "sitting furniture."
      },
      {
        "word": "TABLE",
        "hint": "noun",
        "meaning": "flat surface furniture."
      },
      {
        "word": "LAMP",
        "hint": "noun",
        "meaning": "light source."
      },
      {
        "word": "CLOCK",
        "hint": "noun",
        "meaning": "time device."
      },
      {
        "word": "PHONE",
        "hint": "noun",
        "meaning": "communication device."
      }
    ]
  },
  {
    "name": "Medium",
    "lives": 5,
    "words": [
      {
        "word": "ANIMAL",
        "hint": "noun",
        "meaning": "living creature."
      },
      {
        "word": "PLANET",
        "hint": "noun",
        "meaning": "celestial body."
      },
      {
        "word": "GALAXY",
        "hint": "noun",
        "meaning": "star system."
      },
      {
        "word": "UNIVERSE",
        "hint": "noun",
        "meaning": "all that exists."
      },
      {
        "word": "COMET",
        "hint": "noun",
        "meaning": "icy space body."
      },
      {
        "word": "ASTEROID",
        "hint": "noun",
        "meaning": "rocky space body."
      },
      {
        "word": "ORBIT",
        "hint": "noun",
        "meaning": "curved path in space."
      },
      {
        "word": "GRAVITY",
        "hint": "noun",
        "meaning": "pulling force."
      },
      {
        "word": "ENERGY",
        "hint": "noun",
        "meaning": "power to do work."
      },
      {
        "word": "MATTER",
        "hint": "noun",
        "meaning": "physical substance."
      },
      {
        "word": "SCIENCE",
        "hint": "noun",
        "meaning": "study of nature."
      },
      {
        "word": "BIOLOGY",
        "hint": "noun",
        "meaning": "study of life."
      },
      {
        "word": "CHEMISTRY",
        "hint": "noun",
        "meaning": "study of matter."
      },
      {
        "word": "PHYSICS",
        "hint": "noun",
        "meaning": "study of forces."
      },
      {
        "word": "GEOLOGY",
        "hint": "noun",
        "meaning": "study of Earth."
      },
      {
        "word": "ASTRONOMY",
        "hint": "noun",
        "meaning": "study of stars."
      },
      {
        "word": "ECOLOGY",
        "hint": "noun",
        "meaning": "study of environment."
      },
      {
        "word": "GENETICS",
        "hint": "noun",
        "meaning": "study of genes."
      },
      {
        "word": "ROBOTICS",
        "hint": "noun",
        "meaning": "study of robots."
      },
      {
        "word": "INFORMATICS",
        "hint": "noun",
        "meaning": "study of information."
      },
      {
        "word": "HISTORY",
        "hint": "noun",
        "meaning": "study of past."
      },
      {
        "word": "GEOGRAPHY",
        "hint": "noun",
        "meaning": "study of places."
      },
      {
        "word": "MATHEMATICS",
        "hint": "noun",
        "meaning": "study of numbers."
      },
      {
        "word": "LITERATURE",
        "hint": "noun",
        "meaning": "written works."
      },
      {
        "word": "GRAMMAR",
        "hint": "noun",
        "meaning": "language rules."
      },
      {
        "word": "VOCABULARY",
        "hint": "noun",
        "meaning": "word set."
      },
      {
        "word": "ALPHABET",
        "hint": "noun",
        "meaning": "letter set."
      },
      {
        "word": "SYLLABLE",
        "hint": "noun",
        "meaning": "sound unit."
      },
      {
        "word": "SENTENCE",
        "hint": "noun",
        "meaning": "word group."
      },
      {
        "word": "PARAGRAPH",
        "hint": "noun",
        "meaning": "text block."
      },
      {
        "word": "DEMOCRACY",
        "hint": "noun",
        "meaning": "rule by people."
      },
      {
        "word": "REPUBLIC",
        "hint": "noun",
        "meaning": "state without king."
      },
      {
        "word": "MONARCHY",
        "hint": "noun",
        "meaning": "rule by king."
      },
      {
        "word": "DICTATORSHIP",
        "hint": "noun",
        "meaning": "rule by dictator."
      },
      {
        "word": "ANARCHY",
        "hint": "noun",
        "meaning": "no government."
      },
      {
        "word": "CAPITALISM",
        "hint": "noun",
        "meaning": "market economy."
      },
      {
        "word": "SOCIALISM",
        "hint": "noun",
        "meaning": "collective economy."
      },
      {
        "word": "COMMUNISM",
        "hint": "noun",
        "meaning": "classless society."
      },
      {
        "word": "GOVERNMENT",
        "hint": "noun",
        "meaning": "ruling body."
      },
      {
        "word": "PARLIAMENT",
        "hint": "noun",
        "meaning": "legislative body."
      },
      {
        "word": "INDUSTRY",
        "hint": "noun",
        "meaning": "manufacturing sector."
      },
      {
        "word": "FACTORY",
        "hint": "noun",
        "meaning": "production plant."
      },
      {
        "word": "MACHINE",
        "hint": "noun",
        "meaning": "mechanical device."
      },
      {
        "word": "ENGINE",
        "hint": "noun",
        "meaning": "power device."
      },
      {
        "word": "MOTOR",
        "hint": "noun",
        "meaning": "motion device."
      },
      {
        "word": "ELECTRICITY",
        "hint": "noun",
        "meaning": "electric power."
      },
      {
        "word": "MAGNETISM",
        "hint": "noun",
        "meaning": "magnetic force."
      },
      {
        "word": "CIRCUIT",
        "hint": "noun",
        "meaning": "electric path."
      },
      {
        "word": "BATTERY",
        "hint": "noun",
        "meaning": "power storage."
      },
      {
        "word": "VOLTAGE",
        "hint": "noun",
        "meaning": "electric potential."
      },
      {
        "word": "OCEAN",
        "hint": "noun",
        "meaning": "large salt water."
      },
      {
        "word": "CONTINENT",
        "hint": "noun",
        "meaning": "large land mass."
      },
      {
        "word": "MOUNTAIN",
        "hint": "noun",
        "meaning": "high landform."
      },
      {
        "word": "VALLEY",
        "hint": "noun",
        "meaning": "low landform."
      },
      {
        "word": "DESERT",
        "hint": "noun",
        "meaning": "dry region."
      },
      {
        "word": "TUNDRA",
        "hint": "noun",
        "meaning": "cold treeless plain."
      },
      {
        "word": "JUNGLE",
        "hint": "noun",
        "meaning": "tropical forest."
      },
      {
        "word": "ISLAND",
        "hint": "noun",
        "meaning": "land in water."
      },
      {
        "word": "PENINSULA",
        "hint": "noun",
        "meaning": "land by water."
      },
      {
        "word": "VOLCANO",
        "hint": "noun",
        "meaning": "erupting mountain."
      }
    ]
  },
  {
    "name": "Hard",
    "lives": 4,
    "words": [
      {
        "word": "HYPOTHESIS",
        "hint": "noun",
        "meaning": "proposed explanation."
      },
      {
        "word": "EXPERIMENT",
        "hint": "noun",
        "meaning": "controlled test."
      },
      {
        "word": "OBSERVATION",
        "hint": "noun",
        "meaning": "careful watching."
      },
      {
        "word": "CONCLUSION",
        "hint": "noun",
        "meaning": "final result."
      },
      {
        "word": "ANALYSIS",
        "hint": "noun",
        "meaning": "detailed study."
      },
      {
        "word": "SYNTHESIS",
        "hint": "noun",
        "meaning": "combining parts."
      },
      {
        "word": "THEORY",
        "hint": "noun",
        "meaning": "well-tested idea."
      },
      {
        "word": "EVIDENCE",
        "hint": "noun",
        "meaning": "supporting proof."
      },
      {
        "word": "RESEARCH",
        "hint": "noun",
        "meaning": "systematic study."
      },
      {
        "word": "METHODOLOGY",
        "hint": "noun",
        "meaning": "study method."
      },
      {
        "word": "PHILOSOPHY",
        "hint": "noun",
        "meaning": "study of knowledge."
      },
      {
        "word": "ETHICS",
        "hint": "noun",
        "meaning": "moral principles."
      },
      {
        "word": "LOGIC",
        "hint": "noun",
        "meaning": "reasoning study."
      },
      {
        "word": "METAPHYSICS",
        "hint": "noun",
        "meaning": "beyond physics."
      },
      {
        "word": "EPISTEMOLOGY",
        "hint": "noun",
        "meaning": "theory of knowledge."
      },
      {
        "word": "ONTOLOGY",
        "hint": "noun",
        "meaning": "study of being."
      },
      {
        "word": "AESTHETICS",
        "hint": "noun",
        "meaning": "study of beauty."
      },
      {
        "word": "RHETORIC",
        "hint": "noun",
        "meaning": "art of speaking."
      },
      {
        "word": "DIALECTIC",
        "hint": "noun",
        "meaning": "logical debate."
      },
      {
        "word": "SEMANTICS",
        "hint": "noun",
        "meaning": "meaning study."
      },
      {
        "word": "OPTICS",
        "hint": "noun",
        "meaning": "study of light."
      },
      {
        "word": "ACOUSTICS",
        "hint": "noun",
        "meaning": "study of sound."
      },
      {
        "word": "MECHANICS",
        "hint": "noun",
        "meaning": "study of motion."
      },
      {
        "word": "RELATIVITY",
        "hint": "noun",
        "meaning": "Einstein theory."
      },
      {
        "word": "QUANTUM",
        "hint": "noun",
        "meaning": "smallest amount of energy."
      },
      {
        "word": "ENTROPY",
        "hint": "noun",
        "meaning": "measure of disorder."
      },
      {
        "word": "MAGNET",
        "hint": "noun",
        "meaning": "attracts iron."
      },
      {
        "word": "FLUID",
        "hint": "noun",
        "meaning": "liquid or gas."
      },
      {
        "word": "RENEWABLE",
        "hint": "adjective",
        "meaning": "can be naturally replaced."
      },
      {
        "word": "LOGGING",
        "hint": "noun",
        "meaning": "cutting trees."
      },
      {
        "word": "DIGITAL",
        "hint": "adjective",
        "meaning": "computer-based."
      },
      {
        "word": "GLOBAL",
        "hint": "adjective",
        "meaning": "worldwide."
      },
      {
        "word": "MANUFACTURE",
        "hint": "verb",
        "meaning": "make goods."
      },
      {
        "word": "MODERN",
        "hint": "adjective",
        "meaning": "current era."
      },
      {
        "word": "VOTING",
        "hint": "noun",
        "meaning": "choosing leaders."
      },
      {
        "word": "EVOLUTION",
        "hint": "noun",
        "meaning": "species change."
      },
      {
        "word": "HABITAT",
        "hint": "noun",
        "meaning": "natural home."
      },
      {
        "word": "MUTATION",
        "hint": "noun",
        "meaning": "gene change."
      },
      {
        "word": "ADAPTATION",
        "hint": "noun",
        "meaning": "fitting environment."
      },
      {
        "word": "SELECTION",
        "hint": "noun",
        "meaning": "natural selection."
      },
      {
        "word": "SPECIATION",
        "hint": "noun",
        "meaning": "new species."
      },
      {
        "word": "POLITICS",
        "hint": "noun",
        "meaning": "governance art."
      },
      {
        "word": "SOVEREIGNTY",
        "hint": "noun",
        "meaning": "supreme power."
      },
      {
        "word": "CONSTITUTION",
        "hint": "noun",
        "meaning": "fundamental law."
      },
      {
        "word": "LEGISLATURE",
        "hint": "noun",
        "meaning": "law-making body."
      },
      {
        "word": "POLLUTION",
        "hint": "noun",
        "meaning": "environment harm."
      },
      {
        "word": "WARMING",
        "hint": "noun",
        "meaning": "temperature rise."
      },
      {
        "word": "EXTINCTION",
        "hint": "noun",
        "meaning": "species end."
      },
      {
        "word": "PRESERVATION",
        "hint": "noun",
        "meaning": "keeping safe."
      },
      {
        "word": "CONSERVATION",
        "hint": "noun",
        "meaning": "resource care."
      },
      {
        "word": "RECYCLING",
        "hint": "noun",
        "meaning": "material reuse."
      },
      {
        "word": "ENVIRONMENT",
        "hint": "noun",
        "meaning": "surroundings."
      },
      {
        "word": "ATMOSPHERE",
        "hint": "noun",
        "meaning": "air layer."
      },
      {
        "word": "ECOSYSTEM",
        "hint": "noun",
        "meaning": "living community."
      },
      {
        "word": "AUTOMATION",
        "hint": "noun",
        "meaning": "machine control."
      },
      {
        "word": "INNOVATION",
        "hint": "noun",
        "meaning": "new creation."
      },
      {
        "word": "TECHNOLOGY",
        "hint": "noun",
        "meaning": "applied science."
      },
      {
        "word": "ASTROPHYSICS",
        "hint": "noun",
        "meaning": "star physics."
      },
      {
        "word": "BIOPHYSICS",
        "hint": "noun",
        "meaning": "life physics."
      },
      {
        "word": "BIODIVERSITY",
        "hint": "noun",
        "meaning": "life variety."
      }
    ]
  }
];


  var state = {
    levelIndex: 0,
    queue: [],
    index: 0,
    word: "",
    hint: "",
    meaning: "",
    revealed: [],
    guessed: {},
    wrong: 0,
    lives: LEVELS[0].lives,
    roundPoints: CONFIG.pointsPerWord,
    score: 0,
    levelScore: 0,
    results: [],
    levelResults: [],
    elapsedMs: 0,
    startedAt: null,
    timerId: null,
    finished: false,
    busy: false,
    summaryMode: "level",
  };

  var els = {
    app: document.querySelector(".app"),
    level: document.getElementById("level"),
    levelTotal: document.getElementById("level-total"),
    levelName: document.getElementById("level-name"),
    round: document.getElementById("round"),
    total: document.getElementById("total"),
    score: document.getElementById("score"),
    maxScore: document.getElementById("max-score"),
    lives: document.getElementById("lives"),
    timer: document.getElementById("timer"),
    hearts: document.getElementById("hearts"),
    hintClass: document.getElementById("hint-class"),
    hintMeaning: document.getElementById("hint-meaning"),
    word: document.getElementById("word"),
    status: document.getElementById("status"),
    keyboard: document.getElementById("keyboard"),
    gallowsParts: document.querySelectorAll(".gallows .part"),
    gallowsSvg: document.querySelector(".gallows svg"),
    restart: document.getElementById("restart"),
    roundOverlay: document.getElementById("round-overlay"),
    roundIcon: document.getElementById("round-icon"),
    roundTitle: document.getElementById("round-title"),
    roundWord: document.getElementById("round-word"),
    roundDetail: document.getElementById("round-detail"),
    roundPoints: document.getElementById("round-points"),
    nextWord: document.getElementById("next-word"),
    resultOverlay: document.getElementById("result-overlay"),
    resultIcon: document.getElementById("result-icon"),
    resultTitle: document.getElementById("result-title"),
    resultText: document.getElementById("result-text"),
    resultList: document.getElementById("result-list"),
    playAgain: document.getElementById("play-again"),
    mute: document.getElementById("mute"),
    extraHint: document.getElementById("extra-hint"),
    streak: document.getElementById("streak"),
    streakPill: document.getElementById("streak-pill"),
    confetti: document.getElementById("confetti"),
  };

  /* ------------------------- sons e efeitos -------------------------- */

  var audio = { ctx: null, on: true };
  try {
    audio.on = window.localStorage.getItem("hangman-sound") !== "off";
  } catch (e) {}

  function tone(freq, dur, type, delay, vol) {
    if (!audio.on) return;
    try {
      audio.ctx = audio.ctx || new (window.AudioContext || window.webkitAudioContext)();
      var c = audio.ctx;
      var o = c.createOscillator();
      var g = c.createGain();
      var t = c.currentTime + (delay || 0);
      o.type = type || "sine";
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol || 0.12, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g);
      g.connect(c.destination);
      o.start(t);
      o.stop(t + dur + 0.03);
    } catch (e) {}
  }

  function melody(notes, step, type) {
    notes.forEach(function (n, i) {
      tone(n, 0.22, type || "triangle", i * step, 0.13);
    });
  }

  var sfx = {
    ok: function () { tone(660, 0.12, "triangle"); tone(880, 0.16, "triangle", 0.08); },
    bad: function () { tone(190, 0.22, "sawtooth", 0, 0.07); tone(140, 0.28, "sawtooth", 0.1, 0.07); },
    hint: function () { tone(520, 0.1, "sine"); tone(780, 0.1, "sine", 0.09); },
    win: function () { melody([523, 659, 784, 1047], 0.09); },
    lose: function () { melody([392, 349, 294, 262], 0.13, "sine"); },
  };

  function reducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function popTiles(letter) {
    var tiles = els.word.children;
    for (var i = 0; i < tiles.length; i += 1) {
      if (baseLetter(state.word.charAt(i)) === letter) {
        tiles[i].classList.add("pop");
      }
    }
  }

  function shake() {
    var stage = document.querySelector(".stage");
    stage.classList.remove("shake");
    void stage.offsetWidth;
    stage.classList.add("shake");
  }

  function burst() {
    if (reducedMotion()) return;
    var colors = ["#f59e0b", "#2dd4bf", "#f472b6", "#60a5fa", "#a3e635"];
    els.confetti.textContent = "";
    for (var i = 0; i < 36; i += 1) {
      var bit = document.createElement("i");
      bit.style.left = 20 + Math.random() * 60 + "%";
      bit.style.background = colors[i % colors.length];
      bit.style.setProperty("--dx", Math.round((Math.random() - 0.5) * 360) + "px");
      bit.style.setProperty("--rot", Math.round(Math.random() * 720) + "deg");
      bit.style.animationDelay = Math.random() * 0.15 + "s";
      els.confetti.appendChild(bit);
    }
    window.setTimeout(function () { els.confetti.textContent = ""; }, 1600);
  }

  function renderStreak() {
    var n = state.streak || 0;
    els.streak.textContent = String(n);
    els.streakPill.classList.toggle("is-hot", n >= 3);
  }

  var LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  /* ------------------------------ helpers ----------------------------- */

  // Turns "Ç" into "C", "Á" into "A" and so on, to compare letters.
  function baseLetter(char) {
    var text = String(char);
    if (text.normalize) text = text.normalize("NFD");
    return text
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[Çç]/g, "C")
      .toUpperCase();
  }

  function shuffle(list) {
    var copy = list.slice();
    for (var i = copy.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = copy[i];
      copy[i] = copy[j];
      copy[j] = temp;
    }
    return copy;
  }

  function formatTime(ms) {
    var totalSeconds = Math.floor(ms / 1000);
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }

  function plural(count, singular, pluralWord) {
    return count === 1 ? singular : pluralWord;
  }

  function maxTotalScore() {
    return LEVELS.length * CONFIG.wordsPerLevel * CONFIG.pointsPerWord;
  }

  /* ------------------------------- clock ------------------------------ */

  function currentElapsed() {
    return (
      state.elapsedMs +
      (state.startedAt ? Date.now() - state.startedAt : 0)
    );
  }

  function tickClock() {
    els.timer.textContent = formatTime(currentElapsed());
  }

  function startClock() {
    if (state.startedAt || state.finished) return;
    state.startedAt = Date.now();
    state.timerId = window.setInterval(tickClock, 250);
    tickClock();
  }

  function stopClock() {
    if (state.startedAt) {
      state.elapsedMs += Date.now() - state.startedAt;
      state.startedAt = null;
    }
    if (state.timerId) {
      window.clearInterval(state.timerId);
      state.timerId = null;
    }
    els.timer.textContent = formatTime(state.elapsedMs);
  }

  /* ------------------------------ drawing ----------------------------- */

  function buildKeyboard() {
    LETTERS.forEach(function (letter) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "key";
      button.dataset.letter = letter;
      button.textContent = letter;
      button.setAttribute("aria-label", "Letter " + letter);
      button.addEventListener("click", function () {
        guess(letter);
      });
      els.keyboard.appendChild(button);
    });
  }

  function buildHearts(count) {
    els.hearts.textContent = "";
    for (var i = 0; i < count; i += 1) {
      var heart = document.createElement("span");
      heart.className = "heart";
      heart.textContent = "♥";
      els.hearts.appendChild(heart);
    }
  }

  function renderWord() {
    els.word.textContent = "";
    var revealedCount = 0;

    state.word.split("").forEach(function (char, index) {
      var tile = document.createElement("span");
      tile.className = "letter";

      if (state.revealed[index]) {
        tile.classList.add("is-revealed");
        tile.textContent = char;
        revealedCount += 1;
      }

      tile.setAttribute("aria-hidden", "true");
      els.word.appendChild(tile);
    });

    els.word.setAttribute(
      "aria-label",
      revealedCount + " of " + state.word.length + " letters revealed"
    );
  }

  function renderHud() {
    var level = LEVELS[state.levelIndex];
    els.level.textContent = String(state.levelIndex + 1);
    els.levelName.textContent = level.name;
    els.round.textContent = String(state.index + 1);
    els.score.textContent = String(state.score);
    els.lives.textContent = String(state.lives);

    var hearts = els.hearts.children;
    for (var i = 0; i < hearts.length; i += 1) {
      hearts[i].classList.toggle("is-lost", i >= state.lives);
    }
  }

  function renderGallows() {
    // The drawing always completes on the last life, in every level.
    var total = LEVELS[state.levelIndex].lives;
    var shown = state.wrong > 0 ? Math.min(6, Math.ceil((state.wrong * 6) / total)) : 0;
    els.gallowsParts.forEach(function (part, index) {
      part.classList.toggle("is-on", index < shown);
    });
    els.gallowsSvg.dataset.stage = String(shown);
    els.gallowsSvg.dataset.result = "";
  }

  function resetKeys() {
    var keys = els.keyboard.querySelectorAll(".key");
    keys.forEach(function (key) {
      key.removeAttribute("data-state");
      key.removeAttribute("aria-disabled");
      key.setAttribute("aria-label", "Letter " + key.dataset.letter);
    });
  }

  function markKey(letter, result) {
    var key = els.keyboard.querySelector('[data-letter="' + letter + '"]');
    if (!key) return;
    key.dataset.state = result;
    key.setAttribute("aria-disabled", "true");
    key.setAttribute(
      "aria-label",
      "Letter " + letter + (result === "correct" ? ", correct" : ", wrong")
    );
  }

  function lockBoard() {
    state.busy = true;
    els.keyboard.classList.add("is-locked");
    els.keyboard.setAttribute("aria-busy", "true");
  }

  function unlockBoard() {
    state.busy = false;
    els.keyboard.classList.remove("is-locked");
    els.keyboard.removeAttribute("aria-busy");
  }

  function showOverlay(overlay, focusTarget) {
    overlay.hidden = false;
    els.app.inert = true;
    window.requestAnimationFrame(function () {
      focusTarget.focus();
      reportHeight();
    });
  }

  /* ------------------------------ campaign ---------------------------- */

  function pickWords(level) {
    var pool = shuffle(level.words);
    return pool.slice(0, Math.min(CONFIG.wordsPerLevel, pool.length));
  }

  function startCampaign() {
    state.streak = 0;
    renderStreak();
    stopClock();
    els.roundOverlay.hidden = true;
    els.resultOverlay.hidden = true;
    els.app.inert = false;

    state.levelIndex = 0;
    state.score = 0;
    state.elapsedMs = 0;
    state.results = [];
    state.startedAt = null;
    state.timerId = null;
    state.finished = false;
    state.summaryMode = "level";

    els.score.textContent = "0";
    els.timer.textContent = "0:00";
    els.levelTotal.textContent = String(LEVELS.length);
    els.maxScore.textContent = String(maxTotalScore());

    loadLevel(0);
    reportHeight();
  }

  function loadLevel(index) {
    var level = LEVELS[index];

    state.levelIndex = index;
    state.queue = pickWords(level);
    state.index = 0;
    state.levelScore = 0;
    state.levelResults = [];
    state.word = "";
    state.hint = "";
    state.meaning = "";
    state.revealed = [];
    state.guessed = {};
    state.wrong = 0;
    state.lives = level.lives;

    els.levelTotal.textContent = String(LEVELS.length);
    els.total.textContent = String(state.queue.length);
    buildHearts(level.lives);
    loadWord(false);
  }

  function loadWord(shouldFocus) {
    state.hintUsed = false;
    els.extraHint.disabled = false;
    var level = LEVELS[state.levelIndex];
    var item = state.queue[state.index];

    state.word = item.word;
    state.hint = item.hint;
    state.meaning = item.meaning;
    state.revealed = item.word.split("").map(function () {
      return false;
    });
    state.guessed = {};
    state.wrong = 0;
    state.lives = level.lives;
    state.roundPoints = CONFIG.pointsPerWord;

    unlockBoard();
    resetKeys();

    els.hintClass.textContent = item.hint;
    els.hintMeaning.textContent = item.meaning;
    els.status.textContent = "Choose a letter to start.";

    renderWord();
    renderHud();
    renderGallows();
    reportHeight();

    if (shouldFocus) {
      var firstKey = els.keyboard.querySelector(".key:not([data-state])");
      if (firstKey) firstKey.focus();
    }
  }

  function guess(letter) {
    if (state.finished || state.busy || state.guessed[letter]) return;

    startClock();
    state.guessed[letter] = true;

    var hits = 0;
    state.word.split("").forEach(function (char, index) {
      if (baseLetter(char) === letter && !state.revealed[index]) {
        state.revealed[index] = true;
        hits += 1;
      }
    });

    if (hits > 0) {
      markKey(letter, "correct");
      renderWord();
      popTiles(letter);
      sfx.ok();

      els.status.textContent =
        hits === 1
          ? "You got it! The letter " + letter + " is in the word."
          : "You got it! The letter " +
            letter +
             " appears " +
            hits +
            " times.";

      if (state.revealed.every(Boolean)) {
        lockBoard();
        window.setTimeout(function () {
          completeWord(true);
        }, 420);
      }
      return;
    }

    state.wrong += 1;
    state.lives -= 1;
    state.roundPoints = Math.max(
      0,
      state.roundPoints - CONFIG.penaltyPerError
    );

    markKey(letter, "wrong");
    sfx.bad();
    shake();
    renderHud();
    renderGallows();

    if (state.lives === 0) {
      els.status.textContent =
        "You lost this word. The answer was " + state.word + ".";
      lockBoard();
      window.setTimeout(function () {
        completeWord(false);
      }, 520);
      return;
    }

    els.status.textContent =
      "The letter " +
      letter +
      " is not in the word. " +
      state.lives +
      " " +
      plural(state.lives, "life left", "lives left") +
      ".";
  }

  function completeWord(completed) {
    stopClock();
    els.gallowsSvg.dataset.result = completed ? "win" : "lose";
    state.streak = completed ? (state.streak || 0) + 1 : 0;
    renderStreak();
    els.extraHint.disabled = true;
    if (completed) {
      sfx.win();
      burst();
    } else {
      sfx.lose();
    }
    var points = completed ? state.roundPoints : 0;
    state.score += points;
    state.levelScore += points;
    els.score.textContent = String(state.score);

    var result = {
      level: state.levelIndex,
      word: state.word,
      hint: state.hint,
      meaning: state.meaning,
      completed: completed,
      points: points,
    };

    state.results.push(result);
    state.levelResults.push(result);

    var isLastWord = state.index >= state.queue.length - 1;
    var isLastLevel = state.levelIndex >= LEVELS.length - 1;
    var errors = state.wrong;

    els.roundIcon.textContent = completed ? "✓" : "✕";
    els.roundIcon.className = "modal-icon" + (completed ? "" : " is-no");
    els.roundTitle.textContent = completed ? "Correct!" : "Almost!";
    els.roundWord.textContent = state.word;
    els.roundDetail.textContent =
      "Part of speech: " + state.hint + ". Meaning: " + state.meaning;

    if (completed) {
      els.roundPoints.textContent =
        "+" +
        points +
        " " +
        plural(points, "point", "points") +
        (errors === 0
          ? " · no mistakes"
          : " · " + errors + " " + plural(errors, "mistake", "mistakes"));
    } else {
      els.roundPoints.textContent =
        "0 points on this word. Try to remember the meaning from the hint.";
    }

    els.nextWord.textContent = !isLastWord
      ? "Next word"
      : isLastLevel
        ? "See final results"
        : "Finish level";

    showOverlay(els.roundOverlay, els.nextWord);
  }

  function nextWord() {
    els.roundOverlay.hidden = true;
    els.app.inert = false;

    if (state.index >= state.queue.length - 1) {
      finishLevel();
      return;
    }

    state.index += 1;
    loadWord(true);
  }

  function levelStats() {
    return LEVELS.map(function (level, index) {
      var rows = state.results.filter(function (item) {
        return item.level === index;
      });
      var completed = rows.filter(function (item) {
        return item.completed;
      }).length;
      var points = rows.reduce(function (sum, item) {
        return sum + item.points;
      }, 0);

      return {
        name: level.name,
        completed: completed,
        total: rows.length,
        points: points,
      };
    });
  }

  function renderWords(list) {
    els.resultList.textContent = "";

    list.forEach(function (item) {
      var row = document.createElement("li");

      var mark = document.createElement("span");
      mark.className = "mark " + (item.completed ? "ok" : "no");
      mark.setAttribute("aria-hidden", "true");
      mark.textContent = item.completed ? "✓" : "✕";

      var body = document.createElement("span");

      var word = document.createElement("strong");
      word.textContent = item.word;

      var meaning = document.createElement("span");
      meaning.className = "meaning";
      meaning.textContent = item.hint + " — " + item.meaning;

      var hidden = document.createElement("span");
      hidden.className = "sr-only";
      hidden.textContent = item.completed ? "Correct. " : "Wrong. ";

      body.appendChild(word);
      body.appendChild(meaning);
      row.appendChild(mark);
      row.appendChild(hidden);
      row.appendChild(body);
      els.resultList.appendChild(row);
    });
  }

  function renderLevelBreakdown() {
    els.resultList.textContent = "";

    levelStats().forEach(function (stats, index) {
      var row = document.createElement("li");

      var mark = document.createElement("span");
      var complete = stats.completed === stats.total;
      mark.className = "mark " + (complete ? "ok" : "partial");
      mark.setAttribute("aria-hidden", "true");
      mark.textContent = complete ? "✓" : "•";

      var body = document.createElement("span");

      var title = document.createElement("strong");
      title.textContent = "Level " + (index + 1) + " · " + stats.name;

      var detail = document.createElement("span");
      detail.className = "meaning";
      detail.textContent =
        stats.completed +
        " of " +
        stats.total +
        " words · " +
        stats.points +
        " points";

      var hidden = document.createElement("span");
      hidden.className = "sr-only";
      hidden.textContent =
        "Level " +
        (index + 1) +
        ": " +
        stats.completed +
        " of " +
        stats.total +
        " words, " +
        stats.points +
        " points. ";

      body.appendChild(title);
      body.appendChild(detail);
      row.appendChild(mark);
      row.appendChild(hidden);
      row.appendChild(body);
      els.resultList.appendChild(row);
    });
  }

  function postFinish(maxTotal) {
    window.parent.postMessage(
      {
        type: "vrgame:finish",
        score: state.score,
        maxScore: maxTotal,
        timeMs: state.elapsedMs,
        detail: { levels: levelStats() },
      },
      "*"
    );
  }

  function finishLevel() {
    stopClock();
    state.busy = true;

    var last = state.levelIndex >= LEVELS.length - 1;
    var maxTotal = maxTotalScore();
    var completed = state.levelResults.filter(function (item) {
      return item.completed;
    }).length;

    els.resultIcon.textContent = last ? "🏆" : "🏁";
    els.resultTitle.textContent = last
      ? "Campaign finished"
      : "Level " + (state.levelIndex + 1) + " completed";
    els.resultList.textContent = "";

    if (last) {
      var allCompleted = state.results.filter(function (item) {
        return item.completed;
      }).length;

      els.resultText.textContent =
        "You completed " +
        allCompleted +
        " of " +
        state.results.length +
        " words and scored " +
        state.score +
        " of " +
        maxTotal +
        " points in " +
        formatTime(state.elapsedMs) +
        ".";

      renderLevelBreakdown();
      els.playAgain.textContent = "Play again";
      state.summaryMode = "final";
      state.finished = true;
      postFinish(maxTotal);
    } else {
      els.resultText.textContent =
        "You completed " +
        completed +
        " of " +
        state.levelResults.length +
        " words and scored " +
        state.levelScore +
        " points in this level. Overall score: " +
        state.score +
        " of " +
        maxTotal +
        ".";

      renderWords(state.levelResults);
      els.playAgain.textContent = "Next level";
      state.summaryMode = "level";
    }

    showOverlay(els.resultOverlay, els.playAgain);
  }

  function handleSummaryButton() {
    if (state.summaryMode === "final") {
      restart();
      return;
    }

    els.resultOverlay.hidden = true;
    els.app.inert = false;
    loadLevel(state.levelIndex + 1);

    var firstKey = els.keyboard.querySelector(".key:not([data-state])");
    if (firstKey) firstKey.focus();
    reportHeight();
  }

  function restart() {
    window.parent.postMessage({ type: "vrgame:restart" }, "*");
    startCampaign();
  }

  /* ------------------------------- theme ------------------------------ */

  function applyTheme(theme) {
    if (theme === "dark" || theme === "light") {
      document.documentElement.dataset.theme = theme;
    }
  }

  // Standalone tab has no portal: ?theme= > localStorage > system.
  function preferredTheme() {
    try {
      var fromQuery = new URLSearchParams(window.location.search).get("theme");
      if (fromQuery === "dark" || fromQuery === "light") return fromQuery;
    } catch (error) {
      // URLSearchParams unavailable: try the next option
    }

    try {
      var saved = window.localStorage.getItem("theme");
      if (saved === "dark" || saved === "light") return saved;
    } catch (error) {
      // storage blocked: use the system preference
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  /* ---------------------------- portal height ------------------------- */

  var lastHeight = 0;

  function reportHeight() {
    // In fullscreen the height is the monitor's; the portal keeps the normal height.
    if (document.documentElement.classList.contains("is-fullscreen")) return;
    var height = Math.ceil(document.body.getBoundingClientRect().height);
    if (Math.abs(height - lastHeight) < 4) return;
    lastHeight = height;
    window.parent.postMessage({ type: "vrgame:resize", height: height }, "*");
  }

  /* ------------------------------ events ------------------------------ */

  document.addEventListener("keydown", function (event) {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (!els.roundOverlay.hidden || !els.resultOverlay.hidden) return;
    if (!event.key || event.key.length !== 1) return;

    var letter = baseLetter(event.key);
    if (!/^[A-Z]$/.test(letter)) return;

    event.preventDefault();
    guess(letter);
  });

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
      reportHeight();
    }
  });

  function useExtraHint() {
    if (state.finished || state.busy || state.hintUsed) return;
    var pending = [];
    state.word.split("").forEach(function (char, index) {
      if (!state.revealed[index]) pending.push(baseLetter(char));
    });
    if (pending.length < 2) {
      els.status.textContent = "Only one letter left. Finish the word!";
      return;
    }
    state.hintUsed = true;
    els.extraHint.disabled = true;
    state.roundPoints = Math.max(0, state.roundPoints - CONFIG.penaltyPerError);
    sfx.hint();
    guess(pending[Math.floor(Math.random() * pending.length)]);
    els.status.textContent = "Letter revealed. This hint cost " + CONFIG.penaltyPerError + " points.";
  }

  function renderMute() {
    els.mute.textContent = audio.on ? "🔊 Sound" : "🔇 Muted";
    els.mute.setAttribute("aria-pressed", String(!audio.on));
  }

  els.extraHint.addEventListener("click", useExtraHint);
  els.mute.addEventListener("click", function () {
    audio.on = !audio.on;
    try { window.localStorage.setItem("hangman-sound", audio.on ? "on" : "off"); } catch (e) {}
    renderMute();
    if (audio.on) sfx.ok();
  });
  renderMute();

  els.restart.addEventListener("click", restart);
  els.playAgain.addEventListener("click", handleSummaryButton);
  els.nextWord.addEventListener("click", nextWord);

  window.addEventListener("storage", function (event) {
    if (event.key === "theme") applyTheme(event.newValue);
  });

  window.addEventListener("resize", reportHeight);
  if ("ResizeObserver" in window) {
    new ResizeObserver(reportHeight).observe(document.body);
  }

  /* ------------------------------- start ------------------------------ */

  applyTheme(preferredTheme());

  if (window.self === window.top) {
    document.documentElement.classList.add("is-standalone");
  }

  buildKeyboard();
  startCampaign();

  window.parent.postMessage({ type: "vrgame:ready" }, "*");
  window.requestAnimationFrame(reportHeight);
})();
