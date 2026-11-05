/*
 * FORCA COM DICAS — Jogos VR
 * --------------------------
 * Campanha de 3 níveis, 5 palavras por nível. Cada palavra mostra classe
 * gramatical e significado. As vidas caem de 6 para 5 e 4.
 * O contrato com o portal está no fim do arquivo.
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
    "name": "Fácil",
    "lives": 6,
    "words": [
      {
        "word": "PORÉM",
        "hint": "conjunção",
        "meaning": "liga duas ideias que se opõem; equivale a \"mas\"."
      },
      {
        "word": "CHAPÉU",
        "hint": "substantivo concreto",
        "meaning": "peça de roupa que cobre a cabeça."
      },
      {
        "word": "SAUDADE",
        "hint": "substantivo abstrato",
        "meaning": "sentimento de falta de algo ou de alguém."
      },
      {
        "word": "CORAGEM",
        "hint": "substantivo abstrato",
        "meaning": "força para enfrentar o medo."
      },
      {
        "word": "HONESTO",
        "hint": "adjetivo",
        "meaning": "que age com verdade e justiça."
      },
      {
        "word": "EFÊMERO",
        "hint": "adjetivo",
        "meaning": "que dura por pouco tempo."
      },
      {
        "word": "ESCOLA",
        "hint": "substantivo concreto",
        "meaning": "lugar onde se estuda."
      },
      {
        "word": "CIDADE",
        "hint": "substantivo concreto",
        "meaning": "aglomerado urbano onde vivem pessoas."
      },
      {
        "word": "JANELA",
        "hint": "substantivo concreto",
        "meaning": "abertura na parede que deixa entrar luz e ar."
      },
      {
        "word": "FAMÍLIA",
        "hint": "substantivo coletivo",
        "meaning": "conjunto de pessoas ligadas por parentesco."
      },
      {
        "word": "CANTAR",
        "hint": "verbo",
        "meaning": "produzir música com a voz."
      },
      {
        "word": "FELIZ",
        "hint": "adjetivo",
        "meaning": "que sente alegria."
      },
      {
        "word": "DEVAGAR",
        "hint": "advérbio",
        "meaning": "de modo lento."
      },
      {
        "word": "SEMPRE",
        "hint": "advérbio",
        "meaning": "em todo tempo; nunca deixa de ser."
      },
      {
        "word": "MUITO",
        "hint": "advérbio",
        "meaning": "em grande quantidade."
      },
      {
        "word": "VERÃO",
        "hint": "substantivo concreto",
        "meaning": "estação mais quente do ano."
      },
      {
        "word": "NUVEM",
        "hint": "substantivo concreto",
        "meaning": "massa de vapor de água no céu."
      },
      {
        "word": "TERRA",
        "hint": "substantivo concreto",
        "meaning": "planeta em que vivemos."
      },
      {
        "word": "PEDRA",
        "hint": "substantivo concreto",
        "meaning": "matéria mineral dura."
      },
      {
        "word": "AMIZADE",
        "hint": "substantivo abstrato",
        "meaning": "sentimento de afeto entre pessoas."
      },
      {
        "word": "LIVRO",
        "hint": "substantivo concreto",
        "meaning": "objeto com páginas para ler."
      },
      {
        "word": "CADEIRA",
        "hint": "substantivo concreto",
        "meaning": "móvel para sentar."
      },
      {
        "word": "MESA",
        "hint": "substantivo concreto",
        "meaning": "superfície para apoiar coisas."
      },
      {
        "word": "PORTA",
        "hint": "substantivo concreto",
        "meaning": "entrada de cômodos."
      },
      {
        "word": "QUARTO",
        "hint": "substantivo concreto",
        "meaning": "cômodo para dormir."
      },
      {
        "word": "COZINHA",
        "hint": "substantivo concreto",
        "meaning": "cômodo onde se cozinha."
      },
      {
        "word": "BANHEIRO",
        "hint": "substantivo concreto",
        "meaning": "cômodo com chuveiro e vaso."
      },
      {
        "word": "JARDIM",
        "hint": "substantivo concreto",
        "meaning": "área com plantas."
      },
      {
        "word": "QUINTAL",
        "hint": "substantivo concreto",
        "meaning": "área externa da casa."
      },
      {
        "word": "RUA",
        "hint": "substantivo concreto",
        "meaning": "caminho urbano."
      },
      {
        "word": "PRAÇA",
        "hint": "substantivo concreto",
        "meaning": "espaço público aberto."
      },
      {
        "word": "PARQUE",
        "hint": "substantivo concreto",
        "meaning": "área verde de lazer."
      },
      {
        "word": "IGREJA",
        "hint": "substantivo concreto",
        "meaning": "templo cristão."
      },
      {
        "word": "HOSPITAL",
        "hint": "substantivo concreto",
        "meaning": "lugar de cuidar da saúde."
      },
      {
        "word": "MERCADO",
        "hint": "substantivo concreto",
        "meaning": "lugar de comprar alimentos."
      },
      {
        "word": "LOJA",
        "hint": "substantivo concreto",
        "meaning": "estabelecimento comercial."
      },
      {
        "word": "BANCO",
        "hint": "substantivo concreto",
        "meaning": "instituição financeira ou assento."
      },
      {
        "word": "CORREIO",
        "hint": "substantivo concreto",
        "meaning": "serviço de cartas."
      },
      {
        "word": "TELEFONE",
        "hint": "substantivo concreto",
        "meaning": "aparelho de comunicação."
      },
      {
        "word": "CELULAR",
        "hint": "substantivo concreto",
        "meaning": "telefone portátil."
      },
      {
        "word": "GELADEIRA",
        "hint": "substantivo concreto",
        "meaning": "eletrodoméstico que resfria."
      },
      {
        "word": "FOGÃO",
        "hint": "substantivo concreto",
        "meaning": "eletrodoméstico para cozinhar."
      },
      {
        "word": "VENTILADOR",
        "hint": "substantivo concreto",
        "meaning": "aparelho que ventila."
      },
      {
        "word": "LÂMPADA",
        "hint": "substantivo concreto",
        "meaning": "fonte de luz artificial."
      },
      {
        "word": "SOFÁ",
        "hint": "substantivo concreto",
        "meaning": "móvel para sentar várias pessoas."
      },
      {
        "word": "ARMÁRIO",
        "hint": "substantivo concreto",
        "meaning": "móvel para guardar roupas."
      },
      {
        "word": "ESTANTE",
        "hint": "substantivo concreto",
        "meaning": "móvel com prateleiras."
      },
      {
        "word": "GAVETA",
        "hint": "substantivo concreto",
        "meaning": "compartimento deslizante."
      },
      {
        "word": "CHAVE",
        "hint": "substantivo concreto",
        "meaning": "objeto para abrir fechaduras."
      },
      {
        "word": "SAPATO",
        "hint": "substantivo concreto",
        "meaning": "calçado."
      },
      {
        "word": "MEIA",
        "hint": "substantivo concreto",
        "meaning": "peça de roupa para os pés."
      },
      {
        "word": "CAMISA",
        "hint": "substantivo concreto",
        "meaning": "peça de roupa para o tronco."
      },
      {
        "word": "CALÇA",
        "hint": "substantivo concreto",
        "meaning": "peça de roupa para as pernas."
      },
      {
        "word": "VESTIDO",
        "hint": "substantivo concreto",
        "meaning": "peça de roupa feminina."
      },
      {
        "word": "CASACO",
        "hint": "substantivo concreto",
        "meaning": "peça de roupa para o frio."
      },
      {
        "word": "GORRO",
        "hint": "substantivo concreto",
        "meaning": "peça de roupa para a cabeça."
      },
      {
        "word": "LUVAS",
        "hint": "substantivo concreto",
        "meaning": "peça de roupa para as mãos."
      },
      {
        "word": "CACHECOL",
        "hint": "substantivo concreto",
        "meaning": "peça de roupa para o pescoço."
      },
      {
        "word": "GUARDA",
        "hint": "substantivo concreto",
        "meaning": "pessoa que vigia e protege."
      },
      {
        "word": "BONECA",
        "hint": "substantivo concreto",
        "meaning": "brinquedo infantil."
      }
    ]
  },
  {
    "name": "Médio",
    "lives": 5,
    "words": [
      {
        "word": "GIRASSOL",
        "hint": "substantivo concreto",
        "meaning": "flor amarela que se volta para o sol."
      },
      {
        "word": "INVENTAR",
        "hint": "verbo",
        "meaning": "criar algo que ainda não existia."
      },
      {
        "word": "FLORESTA",
        "hint": "substantivo coletivo",
        "meaning": "conjunto grande de árvores."
      },
      {
        "word": "MURMURAR",
        "hint": "verbo",
        "meaning": "falar em voz baixa."
      },
      {
        "word": "LIBERDADE",
        "hint": "substantivo abstrato",
        "meaning": "direito de agir e pensar sem prisão."
      },
      {
        "word": "CUIDADOSO",
        "hint": "adjetivo",
        "meaning": "que age com atenção e cuidado."
      },
      {
        "word": "PRIMAVERA",
        "hint": "substantivo concreto",
        "meaning": "estação do ano marcada pelas flores."
      },
      {
        "word": "SUBLINHAR",
        "hint": "verbo",
        "meaning": "passar uma linha embaixo de uma palavra ou frase."
      },
      {
        "word": "PLANETA",
        "hint": "substantivo concreto",
        "meaning": "astro que gira ao redor do Sol."
      },
      {
        "word": "REBANHO",
        "hint": "substantivo coletivo",
        "meaning": "conjunto de animais criados juntos."
      },
      {
        "word": "CARDUME",
        "hint": "substantivo coletivo",
        "meaning": "conjunto de peixes."
      },
      {
        "word": "SEMENTE",
        "hint": "substantivo concreto",
        "meaning": "parte da planta que origina outra planta."
      },
      {
        "word": "ORVALHO",
        "hint": "substantivo concreto",
        "meaning": "gotas de água que se formam de madrugada."
      },
      {
        "word": "SILÊNCIO",
        "hint": "substantivo abstrato",
        "meaning": "ausência de som."
      },
      {
        "word": "TRISTEZA",
        "hint": "substantivo abstrato",
        "meaning": "sentimento de falta de alegria."
      },
      {
        "word": "ALEGRIA",
        "hint": "substantivo abstrato",
        "meaning": "sentimento de contentamento."
      },
      {
        "word": "CURIOSO",
        "hint": "adjetivo",
        "meaning": "que quer saber ou aprender mais."
      },
      {
        "word": "EXPLICAR",
        "hint": "verbo",
        "meaning": "tornar claro; fazer entender."
      },
      {
        "word": "IMAGINAR",
        "hint": "verbo",
        "meaning": "criar uma imagem na mente."
      },
      {
        "word": "PALAVRA",
        "hint": "substantivo concreto",
        "meaning": "conjunto de letras com significado."
      },
      {
        "word": "BORBOLETA",
        "hint": "substantivo concreto",
        "meaning": "inseto com asas coloridas."
      },
      {
        "word": "CACHORRO",
        "hint": "substantivo concreto",
        "meaning": "animal doméstico fiel."
      },
      {
        "word": "ELEFANTE",
        "hint": "substantivo concreto",
        "meaning": "maior animal terrestre."
      },
      {
        "word": "GIRAFA",
        "hint": "substantivo concreto",
        "meaning": "animal de pescoço longo."
      },
      {
        "word": "CROCODILO",
        "hint": "substantivo concreto",
        "meaning": "réptil dos rios."
      },
      {
        "word": "PINGUIM",
        "hint": "substantivo concreto",
        "meaning": "ave do polo sul."
      },
      {
        "word": "GOLFINHO",
        "hint": "substantivo concreto",
        "meaning": "mamífero marinho."
      },
      {
        "word": "BALEIA",
        "hint": "substantivo concreto",
        "meaning": "maior animal marinho."
      },
      {
        "word": "TUBARÃO",
        "hint": "substantivo concreto",
        "meaning": "peixe predador."
      },
      {
        "word": "ÁGUIA",
        "hint": "substantivo concreto",
        "meaning": "ave de rapina."
      },
      {
        "word": "FALCÃO",
        "hint": "substantivo concreto",
        "meaning": "ave de rapina veloz."
      },
      {
        "word": "CORUJA",
        "hint": "substantivo concreto",
        "meaning": "ave noturna."
      },
      {
        "word": "PAPAGAIO",
        "hint": "substantivo concreto",
        "meaning": "ave que imita sons."
      },
      {
        "word": "ARARA",
        "hint": "substantivo concreto",
        "meaning": "ave tropical colorida."
      },
      {
        "word": "TUCANO",
        "hint": "substantivo concreto",
        "meaning": "ave de bico grande."
      },
      {
        "word": "FLAMINGO",
        "hint": "substantivo concreto",
        "meaning": "ave rosa."
      },
      {
        "word": "PELICANO",
        "hint": "substantivo concreto",
        "meaning": "ave aquática de bico grande."
      },
      {
        "word": "AVESTRUZ",
        "hint": "substantivo concreto",
        "meaning": "maior ave."
      },
      {
        "word": "PAVÃO",
        "hint": "substantivo concreto",
        "meaning": "ave de cauda colorida."
      },
      {
        "word": "CISNE",
        "hint": "substantivo concreto",
        "meaning": "ave aquática elegante."
      },
      {
        "word": "TARTARUGA",
        "hint": "substantivo concreto",
        "meaning": "réptil de casco."
      },
      {
        "word": "LAGARTO",
        "hint": "substantivo concreto",
        "meaning": "réptil de cauda longa."
      },
      {
        "word": "COBRA",
        "hint": "substantivo concreto",
        "meaning": "réptil sem pernas."
      },
      {
        "word": "IGUANA",
        "hint": "substantivo concreto",
        "meaning": "réptil tropical."
      },
      {
        "word": "SAPO",
        "hint": "substantivo concreto",
        "meaning": "anfíbio de pele rugosa."
      },
      {
        "word": "SALAMANDRA",
        "hint": "substantivo concreto",
        "meaning": "anfíbio de cauda longa."
      },
      {
        "word": "GAFANHOTO",
        "hint": "substantivo concreto",
        "meaning": "inseto que salta."
      },
      {
        "word": "BESOURO",
        "hint": "substantivo concreto",
        "meaning": "inseto de casca dura."
      },
      {
        "word": "JOANINHA",
        "hint": "substantivo concreto",
        "meaning": "inseto vermelho com pintas."
      },
      {
        "word": "FORMIGA",
        "hint": "substantivo concreto",
        "meaning": "inseto social."
      },
      {
        "word": "ABELHA",
        "hint": "substantivo concreto",
        "meaning": "inseto que produz mel."
      },
      {
        "word": "VESPA",
        "hint": "substantivo concreto",
        "meaning": "inseto com ferrão."
      },
      {
        "word": "MOSQUITO",
        "hint": "substantivo concreto",
        "meaning": "inseto que pica."
      },
      {
        "word": "MARIPOSA",
        "hint": "substantivo concreto",
        "meaning": "inseto noturno."
      },
      {
        "word": "LIBÉLULA",
        "hint": "substantivo concreto",
        "meaning": "inseto de asas transparentes."
      },
      {
        "word": "ESCORPIÃO",
        "hint": "substantivo concreto",
        "meaning": "aracnídeo com ferrão."
      },
      {
        "word": "ARANHA",
        "hint": "substantivo concreto",
        "meaning": "aracnídeo que tece teia."
      },
      {
        "word": "CENTOPEIA",
        "hint": "substantivo concreto",
        "meaning": "miriápode de muitas pernas."
      },
      {
        "word": "MINHOCA",
        "hint": "substantivo concreto",
        "meaning": "anelídeo do solo."
      },
      {
        "word": "ONÇA",
        "hint": "substantivo concreto",
        "meaning": "felino selvagem."
      }
    ]
  },
  {
    "name": "Difícil",
    "lives": 4,
    "words": [
      {
        "word": "BIBLIOTECA",
        "hint": "substantivo concreto",
        "meaning": "lugar onde se guardam e se emprestam livros."
      },
      {
        "word": "RAPIDAMENTE",
        "hint": "advérbio",
        "meaning": "de modo rápido, com velocidade."
      },
      {
        "word": "ENTRETANTO",
        "hint": "conjunção",
        "meaning": "marca uma oposição entre duas ideias."
      },
      {
        "word": "SUAVEMENTE",
        "hint": "advérbio",
        "meaning": "de modo leve e tranquilo."
      },
      {
        "word": "MISTERIOSO",
        "hint": "adjetivo",
        "meaning": "que envolve segredo ou algo difícil de explicar."
      },
      {
        "word": "PERSEVERANÇA",
        "hint": "substantivo abstrato",
        "meaning": "insistência para alcançar um objetivo."
      },
      {
        "word": "CONHECIMENTO",
        "hint": "substantivo abstrato",
        "meaning": "ato de saber e compreender."
      },
      {
        "word": "RESPONSÁVEL",
        "hint": "adjetivo",
        "meaning": "que cumpre seus deveres."
      },
      {
        "word": "DIFICULDADE",
        "hint": "substantivo abstrato",
        "meaning": "obstáculo que torna algo difícil."
      },
      {
        "word": "OPORTUNIDADE",
        "hint": "substantivo abstrato",
        "meaning": "ocasião favorável para fazer algo."
      },
      {
        "word": "NECESSIDADE",
        "hint": "substantivo abstrato",
        "meaning": "aquilo de que se precisa."
      },
      {
        "word": "CURIOSIDADE",
        "hint": "substantivo abstrato",
        "meaning": "vontade de saber ou conhecer."
      },
      {
        "word": "IMAGINAÇÃO",
        "hint": "substantivo abstrato",
        "meaning": "capacidade de criar imagens na mente."
      },
      {
        "word": "COMPREENSÃO",
        "hint": "substantivo abstrato",
        "meaning": "ato de entender."
      },
      {
        "word": "APRENDIZAGEM",
        "hint": "substantivo abstrato",
        "meaning": "processo de aprender."
      },
      {
        "word": "CONCENTRAÇÃO",
        "hint": "substantivo abstrato",
        "meaning": "foco da atenção."
      },
      {
        "word": "COLABORAÇÃO",
        "hint": "substantivo abstrato",
        "meaning": "trabalho feito em conjunto."
      },
      {
        "word": "COMUNICAÇÃO",
        "hint": "substantivo abstrato",
        "meaning": "ato de transmitir informação."
      },
      {
        "word": "ECOSSISTEMA",
        "hint": "substantivo coletivo",
        "meaning": "conjunto de seres vivos e o ambiente em que vivem."
      },
      {
        "word": "FOTOSSÍNTESE",
        "hint": "substantivo abstrato",
        "meaning": "processo pelo qual as plantas produzem alimento usando a luz."
      },
      {
        "word": "DEMOCRACIA",
        "hint": "substantivo abstrato",
        "meaning": "sistema de governo pelo povo."
      },
      {
        "word": "REPÚBLICA",
        "hint": "substantivo abstrato",
        "meaning": "forma de governo sem rei."
      },
      {
        "word": "MONARQUIA",
        "hint": "substantivo abstrato",
        "meaning": "governo de um rei."
      },
      {
        "word": "DITADURA",
        "hint": "substantivo abstrato",
        "meaning": "governo autoritário."
      },
      {
        "word": "ANARQUIA",
        "hint": "substantivo abstrato",
        "meaning": "ausência de governo."
      },
      {
        "word": "CAPITALISMO",
        "hint": "substantivo abstrato",
        "meaning": "sistema econômico de mercado."
      },
      {
        "word": "SOCIALISMO",
        "hint": "substantivo abstrato",
        "meaning": "sistema econômico coletivo."
      },
      {
        "word": "COMUNISMO",
        "hint": "substantivo abstrato",
        "meaning": "sistema sem classes sociais."
      },
      {
        "word": "GLOBALIZAR",
        "hint": "verbo",
        "meaning": "tornar mundial."
      },
      {
        "word": "INDUSTRIAL",
        "hint": "adjetivo",
        "meaning": "relativo à indústria."
      },
      {
        "word": "URBANIZAÇÃO",
        "hint": "substantivo abstrato",
        "meaning": "crescimento das cidades."
      },
      {
        "word": "MODERNIZAÇÃO",
        "hint": "substantivo abstrato",
        "meaning": "tornar moderno."
      },
      {
        "word": "DIGITALIZAR",
        "hint": "verbo",
        "meaning": "converter para o formato digital."
      },
      {
        "word": "AUTOMAÇÃO",
        "hint": "substantivo abstrato",
        "meaning": "uso de máquinas automáticas."
      },
      {
        "word": "INOVAÇÃO",
        "hint": "substantivo abstrato",
        "meaning": "criação de algo novo."
      },
      {
        "word": "TECNOLOGIA",
        "hint": "substantivo abstrato",
        "meaning": "aplicação da ciência."
      },
      {
        "word": "INFORMÁTICA",
        "hint": "substantivo abstrato",
        "meaning": "ciência da informação."
      },
      {
        "word": "MENSAGEM",
        "hint": "substantivo abstrato",
        "meaning": "texto transmitido a alguém."
      },
      {
        "word": "GENÉTICA",
        "hint": "substantivo abstrato",
        "meaning": "ciência dos genes."
      },
      {
        "word": "BIOLOGIA",
        "hint": "substantivo abstrato",
        "meaning": "ciência da vida."
      },
      {
        "word": "QUÍMICA",
        "hint": "substantivo abstrato",
        "meaning": "ciência da matéria."
      },
      {
        "word": "FÍSICA",
        "hint": "substantivo abstrato",
        "meaning": "ciência da natureza."
      },
      {
        "word": "MATEMÁTICA",
        "hint": "substantivo abstrato",
        "meaning": "ciência dos números."
      },
      {
        "word": "ASTRONOMIA",
        "hint": "substantivo abstrato",
        "meaning": "ciência dos astros."
      },
      {
        "word": "GEOLOGIA",
        "hint": "substantivo abstrato",
        "meaning": "ciência da Terra."
      },
      {
        "word": "METEOROLOGIA",
        "hint": "substantivo abstrato",
        "meaning": "ciência do tempo."
      },
      {
        "word": "ECOLOGIA",
        "hint": "substantivo abstrato",
        "meaning": "ciência do ambiente."
      },
      {
        "word": "SUSTENTÁVEL",
        "hint": "adjetivo",
        "meaning": "que pode se manter por muito tempo."
      },
      {
        "word": "ECOLÓGICO",
        "hint": "adjetivo",
        "meaning": "relativo à ecologia."
      },
      {
        "word": "DESMATAMENTO",
        "hint": "substantivo abstrato",
        "meaning": "retirada de florestas."
      },
      {
        "word": "POLUIÇÃO",
        "hint": "substantivo abstrato",
        "meaning": "contaminação ambiental."
      },
      {
        "word": "AQUECIMENTO",
        "hint": "substantivo abstrato",
        "meaning": "aumento da temperatura."
      },
      {
        "word": "EXTINÇÃO",
        "hint": "substantivo abstrato",
        "meaning": "fim de uma espécie."
      },
      {
        "word": "PRESERVAÇÃO",
        "hint": "substantivo abstrato",
        "meaning": "ato de preservar."
      },
      {
        "word": "CONSERVAÇÃO",
        "hint": "substantivo abstrato",
        "meaning": "ato de conservar."
      },
      {
        "word": "RECICLAGEM",
        "hint": "substantivo abstrato",
        "meaning": "reaproveitamento de materiais."
      },
      {
        "word": "INDÚSTRIA",
        "hint": "substantivo concreto",
        "meaning": "conjunto de fábricas."
      },
      {
        "word": "OCEANO",
        "hint": "substantivo concreto",
        "meaning": "grande massa de água salgada."
      },
      {
        "word": "AMBIENTE",
        "hint": "substantivo concreto",
        "meaning": "meio em que se vive."
      },
      {
        "word": "DESERTO",
        "hint": "substantivo concreto",
        "meaning": "região muito seca."
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
    audio.on = window.localStorage.getItem("forca-som") !== "off";
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

  /* ---------------------------- utilidades ---------------------------- */

  // Converte "Ç" em "C", "Á" em "A" etc., para comparar letras.
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

  /* ------------------------------ relógio ----------------------------- */

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

  /* ------------------------------ desenho ----------------------------- */

  function buildKeyboard() {
    LETTERS.forEach(function (letter) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "key";
      button.dataset.letter = letter;
      button.textContent = letter;
      button.setAttribute("aria-label", "Letra " + letter);
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
      revealedCount + " de " + state.word.length + " letras reveladas"
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
    // A figura sempre se completa na última vida, em qualquer nível.
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
      key.setAttribute("aria-label", "Letra " + key.dataset.letter);
    });
  }

  function markKey(letter, result) {
    var key = els.keyboard.querySelector('[data-letter="' + letter + '"]');
    if (!key) return;
    key.dataset.state = result;
    key.setAttribute("aria-disabled", "true");
    key.setAttribute(
      "aria-label",
      "Letra " + letter + (result === "correct" ? ", certa" : ", errada")
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

  /* ------------------------------ campanha ---------------------------- */

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
    els.status.textContent = "Escolha uma letra para começar.";

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
          ? "Você acertou! A letra " + letter + " está na palavra."
          : "Você acertou! A letra " +
            letter +
            " aparece " +
            hits +
            " vezes.";

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
        "Você perdeu essa palavra. A resposta era " + state.word + ".";
      lockBoard();
      window.setTimeout(function () {
        completeWord(false);
      }, 520);
      return;
    }

    els.status.textContent =
      "A letra " +
      letter +
      " não está na palavra. " +
      state.lives +
      " " +
      plural(state.lives, "vida restante", "vidas restantes") +
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
    els.roundTitle.textContent = completed ? "Acertou!" : "Quase!";
    els.roundWord.textContent = state.word;
    els.roundDetail.textContent =
      "Classe: " + state.hint + ". Significado: " + state.meaning;

    if (completed) {
      els.roundPoints.textContent =
        "+" +
        points +
        " " +
        plural(points, "ponto", "pontos") +
        (errors === 0
          ? " · sem erros"
          : " · " + errors + " " + plural(errors, "erro", "erros"));
    } else {
      els.roundPoints.textContent =
        "0 pontos nesta palavra. Tente guardar o significado da dica.";
    }

    els.nextWord.textContent = !isLastWord
      ? "Próxima palavra"
      : isLastLevel
        ? "Ver resultado final"
        : "Concluir nível";

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
      hidden.textContent = item.completed ? "Acertou. " : "Errou. ";

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
      title.textContent = "Nível " + (index + 1) + " · " + stats.name;

      var detail = document.createElement("span");
      detail.className = "meaning";
      detail.textContent =
        stats.completed +
        " de " +
        stats.total +
        " palavras · " +
        stats.points +
        " pontos";

      var hidden = document.createElement("span");
      hidden.className = "sr-only";
      hidden.textContent =
        "Nível " +
        (index + 1) +
        ": " +
        stats.completed +
        " de " +
        stats.total +
        " palavras, " +
        stats.points +
        " pontos. ";

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
      ? "Campanha concluída"
      : "Nível " + (state.levelIndex + 1) + " concluído";
    els.resultList.textContent = "";

    if (last) {
      var allCompleted = state.results.filter(function (item) {
        return item.completed;
      }).length;

      els.resultText.textContent =
        "Você completou " +
        allCompleted +
        " de " +
        state.results.length +
        " palavras e fez " +
        state.score +
        " de " +
        maxTotal +
        " pontos em " +
        formatTime(state.elapsedMs) +
        ".";

      renderLevelBreakdown();
      els.playAgain.textContent = "Jogar de novo";
      state.summaryMode = "final";
      state.finished = true;
      postFinish(maxTotal);
    } else {
      els.resultText.textContent =
        "Você completou " +
        completed +
        " de " +
        state.levelResults.length +
        " palavras e fez " +
        state.levelScore +
        " pontos neste nível. Placar geral: " +
        state.score +
        " de " +
        maxTotal +
        ".";

      renderWords(state.levelResults);
      els.playAgain.textContent = "Próximo nível";
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

  /* ------------------------------- tema ------------------------------- */

  function applyTheme(theme) {
    if (theme === "dark" || theme === "light") {
      document.documentElement.dataset.theme = theme;
    }
  }

  // Na nova aba não existe portal: ?theme= > localStorage > sistema.
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

  /* ------------------------- altura para o portal --------------------- */

  var lastHeight = 0;

  function reportHeight() {
    // Em tela cheia a altura é a do monitor; o portal deve manter a altura normal.
    if (document.documentElement.classList.contains("is-fullscreen")) return;
    var height = Math.ceil(document.body.getBoundingClientRect().height);
    if (Math.abs(height - lastHeight) < 4) return;
    lastHeight = height;
    window.parent.postMessage({ type: "vrgame:resize", height: height }, "*");
  }

  /* ------------------------------ eventos ----------------------------- */

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
      els.status.textContent = "Falta só uma letra. Complete a palavra!";
      return;
    }
    state.hintUsed = true;
    els.extraHint.disabled = true;
    state.roundPoints = Math.max(0, state.roundPoints - CONFIG.penaltyPerError);
    sfx.hint();
    guess(pending[Math.floor(Math.random() * pending.length)]);
    els.status.textContent = "Letra revelada. Essa ajuda custou " + CONFIG.penaltyPerError + " pontos.";
  }

  function renderMute() {
    els.mute.textContent = audio.on ? "🔊 Som" : "🔇 Mudo";
    els.mute.setAttribute("aria-pressed", String(!audio.on));
  }

  els.extraHint.addEventListener("click", useExtraHint);
  els.mute.addEventListener("click", function () {
    audio.on = !audio.on;
    try { window.localStorage.setItem("forca-som", audio.on ? "on" : "off"); } catch (e) {}
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

  /* ------------------------------- início ----------------------------- */

  applyTheme(preferredTheme());

  if (window.self === window.top) {
    document.documentElement.classList.add("is-standalone");
  }

  buildKeyboard();
  startCampaign();

  window.parent.postMessage({ type: "vrgame:ready" }, "*");
  window.requestAnimationFrame(reportHeight);
})();
