(function () {
  "use strict";

  var MAX_TRIES = 6;
  var LENGTH = 5;
  var EPOCH = Date.UTC(2026, 0, 1);
  var STATS_KEY = "vr-palavra-stats";

  var RAW_WORDS =
    "ABETO ABRIR ACASO ACENO ACESO ACHAR ACIDO ACIMA ADEGA ADEUS AGORA AGUDO " +
    "AJUDA ALADO ALBUM ALGUM ALIAR ALUNO AMADO AMIGO AMORA ANDAR ANEXO ANTES " +
    "ANUAL APOIO ARAME ARCAR AREIA ARROZ ASSAR ATLAS ATIVO ATRAS AUTOR AVISO " +
    "AZEDO BAGRE BAILE BAIXO BANCO BANHO BARCO BARRO BATOM BEBER BEIJO BICHO " +
    "BLOCO BOCAL BOLSA BOMBA BONDE BORDA BORRA BOTAO BRACO BRASA BRAVO BREVE " +
    "BRIGA BRISA BROTO BURRO BUSCA CABRA CACAU CACTO CAIXA CALDO CALMA CALMO " +
    "CALOR CAMPO CANAL CANOA CANTO CAPIM CARGA CARNE CARRO CARTA CASAL CASCA " +
    "CAUSA CEDRO CENSO CERCA CERTO CESTA CHAMA CHAVE CHEIO CHORO CHUVA CICLO " +
    "CINCO CINTO CINZA CIRCO CLARO CLIMA COBRA COFRE COISA COLAR COMER CONDE " +
    "CONTA CONTO COPIA CORAL CORDA CORPO CORVO CORTE COURO COUVE CRAVO CRIAR " +
    "CRIME CRUEL CULPA CUPIM CURSO CUSTO DANCA DENTE DESCE DEVER DIABO DIETA " +
    "DISCO DIZER DOBRA DOMAR DORSO DRAMA DUPLA ECOAR ELITE ENFIM ETAPA EXAME " +
    "EXATO EXPOR EXTRA FACHO FALAR FALSO FALTA FANGO FARDO FAROL FARTA FAVOR " +
    "FAZER FEBRE FEIRA FELIZ FENDA FERIR FERRO FERVA FESTA FIBRA FICAR FILME " +
    "FINAL FIRME FLAMA FLOCO FLUIR FOCAR FOGAO FOLHA FONTE FORCA FORMA FORNO " +
    "FORRO FORTE FOSSO FRACO FRADE FRASE FREIO FREVO FRITO FROTA FRUTA FRUTO " +
    "FUGIR FUMAR FUNDO FURTO GALHO GARFO GAROA GANHO GARRA GEADA GEMER GENIO " +
    "GENTE GERAL GERAR GESTO GESSO GIRAR GIRIA GLOBO GOLPE GORDO GORRO GRACA " +
    "GRADE GRAMA GRATO GRAVE GRILO GRITO GRUDE GRUPO HABIL HARPA HEROI HOMEM " +
    "HONRA HORTA HOTEL HUMOR IDADE IDEIA IGUAL IMPAR IMPOR IRMAO JARRO JAZER " +
    "JEITO JOGAR JOVEM JUNTO JURAR JUSTO LABIO LAGOA LANCE LAPIS LARGO LARVA " +
    "LASER LAZER LEGAL LEIGO LEITE LENTO LEQUE LESTE LETRA LEVAR LICAO LIDER " +
    "LIDAR LIGAR LIMPO LINDO LINHA LIRIO LISTA LIVRO LOIRA LOMBO LONGE LONGO " +
    "LOUCO LOURO LUCRO LUGAR LUNAR LUTAR MACIO MAGIA MAGRO MAIOR MALHA MAMAE " +
    "MANCO MANGA MANHA MANSO MARCA MARCO MASSA MATAR MEIGO MELRO MENOR MENTA " +
    "MENTE MESMO METAL METER METRO MILHO MINHA MIOLO MIRAR MISSA MISTO MOCHO " +
    "MOEDA MOLDE MOLHO MONTE MORAR MORRO MOTEL MOTOR MUDAR MUGIR MULTA MUNDO " +
    "MURAL MUSEU MUSGO MUITO NACAO NADAR NARIZ NASCE NATAL NAVAL NAVIO NEGAR " +
    "NEGRO NERVO NEVAR NINAR NINFA NINHO NOBRE NOITE NOIVO NORMA NORTE NOTAR " +
    "NUVEM NUNCA OBESO OBTER OESTE OLHAR OLIVA ONTEM OPCAO OPERA ORDEM ORFAO " +
    "ORGAO OUSAR OUTRO OUVIR PADRE PALCO PALHA PAPAI PAPEL PARAR PARTE PASSE " +
    "PASSO PASTA PAUSA PAVIO PEDRA PEITO PEIXE PENAL PENTE PERCA PERDA PERNA " +
    "PERTO PESCA PIADA PIANO PICAR PILAR PILHA PINGO PINHA PINTA PIQUE PISTA " +
    "PLACA PLANO POBRE PODER POEMA POLVO POMBO PONTA PONTE PONTO PORCO PORTA " +
    "PORTE POSSE POSTE POTRO POUCO PRACA PRAIA PRATA PRATO PRAXE PRAZO PRECO " +
    "PREGA PRESO PRETO PRIMA PROSA PROVA PUDIM PUDOR PULAR PULSO PUNHO PUXAR " +
    "QUASE QUERO QUILO QUINA QUOTA RAIVA RAMPA RAPAZ RASGO RAZAO RECUO REFEM " +
    "REGAR REGRA REINO RELER RELVA REMAR RENDA RESTO REZAR RIFLE RIGOR RITMO " +
    "RIVAL ROCHA RODAR RONCO RONDA ROSCA ROSTO ROUPA RUBRO RUGIR RUIDO RUINA " +
    "RURAL SABER SABIA SABOR SAFRA SAGAZ SAIDA SALAO SALMO SALTO SALVO SANTO " +
    "SAQUE SARAU SAUNA SAUDE SECAR SEIVA SELVA SENHA SENSO SERIE SERIO SERRA " +
    "SERVO SETOR SEXTO SIGLA SILVO SINAL SISMO SITIO SOBRA SOLDA SOMAR SONHO " +
    "SORTE SUAVE SUBIR SULCO SUMIR SURDO SURFE SUSTO TABUA TALCO TAMPA TANTO " +
    "TECLA TELHA TEMOR TEMPO TENDA TENOR TERMO TERNO TERRA TESTA TESTE TEXTO " +
    "TIGRE TINTA TINIR TIRAR TOMBO TOMAR TONEL TONTO TOQUE TORNO TORPE TORRE " +
    "TOSSE TOTAL TRACA TRAGO TRAJE TRAMA TRAPO TREMA TRENO TREVO TRIGO TRIBO " +
    "TRIPE TROCA TROPA TROVA TRUPE TUNEL TURBO TURMA TURNO TUTOR UIVAR UMIDO " +
    "UNIAO UNICO URUBU USADO USINA VAGAO VAGAR VAGEM VALOR VALSA VAPOR VARAL " +
    "VASTO VAZIO VEADO VELHO VELOZ VENDA VENTO VERBO VERDE VERSO VESPA VETOR " +
    "VIOLA VIGOR VINHO VIRAR VIRIL VISAO VISTA VIVER VIVAZ VULGO XAMPU XEQUE " +
    "ZEBRA ZELAR ZINCO ABRIL ACUSA AFETO AGUDA AGUIA ALGAS ALUNA AMPLA AMPLO " +
    "ANEIS ANOTA APAGA APELO APOIA ARARA ARDOR ARENA ARMAR ASILO ASTRO ATACA " +
    "ATIVA ATRIZ AUDIO AVIDO AXILA AZEDA BALAO BALDE BAMBU BANAL BANCA BANDA " +
    "BANHA BANJO BARBA BARCA BARRA BASTA BATEM BATER BEATA BEBIA BEBEM BEIRA " +
    "BENTO BERCO BERRO BESTA BILHA BINGO BIOMA BISPO BLEFE BOATO BODAS BOINA " +
    "BOLHA BOLOS BOTAR BOTES BRAVA BREJO BRITA BROCA BRUTO BRUMA BRUXA BUCHA " +
    "BURLA BUSTO CABEM CABER CABIA CACOS CAIDA CAIDO CALCA CALDA CALEM CALOU " +
    "CAMAS CANJA CANSO CAPAS CAPUZ CARPA CASCO CASEM CASTA CATAR CAUDA CAVOU " +
    "CEDEU CEGAR CEGOS CERCO CERNE CETIM CHAPA CHECA CHEFE CHITA CHOCA CHOPE " +
    "CHOVE CIFRA CINTA CISTO CITAR CIVIL CLARA CLAVA CLERO CLUBE COALA COBRE " +
    "COICE COLHE COMAM COMBO COMIA COMUM CONES COPAS CORAR CORES CORTA CORTO " +
    "COSMO COVAS CREME CREPE CRIAM CRIAS CRISE CROMO CRUZA CRUZE CUBOS CUECA " +
    "CULTO CUNHA CUPOM CURAS CURTA CURTO CURVA CUSPE CUSPO DANCO DARDO DATAS " +
    "DEITA DEITE DEPOR DEREM DESCI DETEM DICAS DIGNO DIQUE DITAR DITAS DOCAS " +
    "DOCES DOBRO DOIDO DORES DOSES DRENA DRENO DUETO DUELO DUPLO DURAS DUTOS " +
    "DUZIA EBANO EDEMA EIXOS ELEVA EMANA EMITA EMITE ENCHE ENFIA ENJOO ENVIO " +
    "EPICA EPICO EPOCA ERETO ERRAM ERRAR ERVAS ESPIA ESPIE ETICA ETICO EVITA " +
    "EVITE EXATA EXIBE EXIJA EXIJO EXODO EXITO EXPOE FACAS FACAO FACIL FALAS " +
    "FALHA FALHE FALHO FALIR FARDA FARRA FARSA FARTO FATAL FATIA FATOS FATOR " +
    "FEDEM FEDOR FEIAS FEIOS FEITO FEMEA FERAS FEREM FERIU FEROZ FERVE FETAL " +
    "FETOS FEUDO FICAS FIEIS FIGOS FILAS FILHA FILHO FILMA FINAS FINOS FIRMA " +
    "FIXAR FIXAS FIXOS FLORA FLUXO FOBIA FOCAS FOICE FOGEM FOGOS FOLGA FONES " +
    "FORJA FOSSA FRACA FREAR FREIA FRETE FRIAS FRIOS FRITA FRITE FUGAS FUGAZ " +
    "FUNGO FUNIL FURAO FURAR FURIA FUROU FUSCA FUSAO FUTIL FUZIL GABAR GAITA " +
    "GALAO GALOS GAMBA GANHA GANHE GARCA GASTO GATAS GATOS GEMEA GEMEO GEMAS " +
    "GERAM GERIR GEROU GIRAM GIROS GOELA GORDA GOSMA GOSTO GRAAL GRAOS GRATA " +
    "GRAVA GRAVO GRIPE GRUTA GUETO GUIAR GUIAS GUIOU GURIA HASTE HIDRA HIENA " +
    "HINOS HORDA HURRA ICONE IDEAL IDOSA IDOSO ILESA ILESO ILHAS IMUNE IMITA " +
    "IMPOS INATO INCHA INDUZ ITENS JANTA JANTE JARRA JATOS JEJUM JOGAM JOGOS " +
    "JULGA JULGO JUNCO JUNHO JUNTA JUNTE JUROS JURAS JURAM LACOS LACRE LADRA " +
    "LAGOS LAPSO LARES LASCA LATAO LATAS LATEM LATIM LAUDO LAVAM LAVAR LAVEM " +
    "LAVOU LEBRE LEIAM LEITO LENCO LENHA LENTA LENTE LEOES LERAM LERDA LERDO " +
    "LESAO LESMA LETAL LEVAM LEVAS LEVEM LICOR LIDAM LIDOS LIGAM LIGAS LILAS " +
    "LIMBO LINCE LINHO LIRAS LITIO LITRO LIVRA LIXAR LIXOS LOBOS LOJAS LONGA " +
    "LUCRA LULAS LUTAM LUTAS LUXOS MACAS MACHO MACIA MADRE MAGMA MAGNA MAGNO " +
    "MAGOS MAGRA MALAS MALES MAMAO MAMAR MAMBA MAMBO MANCA MANIA MANJA MANOS " +
    "MANTO MAPAS MATAM MATAS MATEM MEDIA MEDIR MEDOS MEIGA MEIOS MELAO MENUS " +
    "MERAS MEROS METAM METAS METEM MEXEM MEXIA MICRO MIDIA MIOPE MIRAM MIRRA " +
    "MISTA MITOS MOCAO MOCOS MODAS MODOS MOGNO MOIDO MOITA MOLAS MOLES MOLHA " +
    "MOLHE MONGE MONTA MONTO MORAM MORDE MORNA MORNO MOROU MORSA MORTE MOSCA " +
    "MOTIM MOTOS MOURO MOVEL MOVEM MOVER MUDAM MUDAS MUDOS MULAS MUMIA MURRO " +
    "MUTUA MUTUO NABOS NADOU NAIPE NARRA NASAL NAVES NEGAM NEGOU NENEM NETAS " +
    "NETOS NEVOA NOCAO NOIVA NOTAM NOTEM NOTOU NOZES OBITO OBRAS OBVIO OCUPA " +
    "OCUPE OGIVA OGROS OLEOS ONCAS OPTAR OPTOU ORAIS ORCAS OSSEA OSSEO OUSAM " +
    "OUSOU OUVEM OUVES OUVIU OVULO PACAS PAGAM PAGAS PAGOS PAIRA PALMA PALMO " +
    "PANCA PANDA PANOS PAPAS PAPAL PARAM PARAS PARES PARIR PARTO PASMA PASMO " +
    "PASTO PATAS PATIO PATOS PAVAO PAVOR PAZES PECAM PECAR PECOU PEDAL PEDEM " +
    "PEGAM PEGAS PEGOU PELES PENAS PERAS PERCO PERDE PERSA PESAM PESAR PESCO " +
    "PESOU PESTE PICAM PICOS PILAS PINGA PINHO PINOS PINTE PIPAS PIRAR PIROU " +
    "PISAM PISAR PISCA PISOS PIZZA PLANA PLENA PLENO POCAO POCOS PODAR PODIO " +
    "POETA POLCA POLEN POLIA POLIR POLPA POMAR POMBA POMOS PONHO PORCA POROS " +
    "POSAR POSOU POSTA POTES POUCA POUPA POVOS PRAGA PRECE PREGO PREVE PREVI " +
    "PRIMO PROLE PULAM PULGA PULOS PULOU PUNHA PUNIR PURAS PUROS PUSER PUXAM " +
    "PUXAO PUXEI PUXEM QUEDA RACAO RACAS RACHA RADAR RALAR RALEI RAMAL RANGO " +
    "RAPEL RAPTO RARAS RAROS RASAS RASGA RASOS RASPA RASPE RASTO RATOS REAGE " +
    "REAGI REAJA RECAI RECUA REDEA REDES REDUZ REFIL REFEZ REGUA REINA RELAX " +
    "RELES REMOS RENAS REPOR RETAS RETEM RETOS REUNA REVES REVER REZAM REZEM " +
    "RIMAR RIMAS RIMEL RIRAM RIRIA RISCA RISCO RISOS RITOS RODEI RODAM RODAS " +
    "RODOU ROLAM ROLHA ROLOS ROMPA ROMPE RONCA ROSAS ROSNA ROTAS ROUBA ROUCA " +
    "ROUCO RUBOR RUDES RUGAS RUIVA RUIVO RUMOS RUNAS SABAO SABEM SABES SABIO " +
    "SACAR SACOS SACOU SADIA SADIO SAFOU SAIAS SALAS SALDO SALTE SALVA SAMBA " +
    "SAPOS SARAR SARNA SARRO SECAM SECAS SECOS SEDAS SEDUZ SEITA SELAR SELAS " +
    "SELOS SENIL SEPTO SEQUE SETAS SIDRA SIGNO SILOS SIMIO SINOS SIRVA SIRVO " +
    "SOCAR SOCIA SOCIO SOCOS SODIO SOFAS SOFRE SOFRI SOFRO SOLAR SOLDO SOLOS " +
    "SOMAM SOMAS SOMEM SONAR SONHA SONHE SOPAS SOPRE SOPRO SORRI SOSIA SOTAO " +
    "SUADA SUADO SUBAM SUBIA SUCOS SUGAM SUGOU SUJAM SUJAR SUJAS SUJEI SUJOS " +
    "SUMAM SUMIA SUPOR SUPOS SURDA SURFA SURJA SURTA SURTE SUTIL SUTIS TALAO " +
    "TANGO TAPAR TAPAS TARDE TARJA TAXAS TECER TEDIO TEIAS TELAO TELAS TEMAM " +
    "TEMEM TEMIA TENAZ TENRA TENSO TENUE TERCO TEREM TERNA TIARA TINTO TITIO " +
    "TOCAM TOCAS TOCAR TOLAS TOLOS TOMAM TOMEM TONTA TOPAR TOPEI TOPOU TORAX " +
    "TORCA TORCE TORCI TORCO TORTA TORTO TOSCA TOSCO TOUCA TOURO TRACO TRAEM " +
    "TRAIA TRAIU TRAVE TREME TREMO TREPA TRETA TREZE TRIPA TRONO TRUFA TRUTA " +
    "TUBOS TUFAO TUMBA TURBA TURCA TURCO TURVA UMIDA UNCAO UNHAS UNIDA UNIDO " +
    "USADA USUAL UTEIS UTERO VACAS VADIO VAGAM VAGAS VAGOU VAIAS VALAS VALEM " +
    "VALES VALHA VALIA VARAS VARRA VARRE VASOS VAZIA VAZOU VEIAS VELAS VELHA " +
    "VENCE VENCI VENCO VERAS VERBA VESGA VESGO VESTI VETAR VETOU VIAJA VIAJE " +
    "VIAJO VIBRA VICIA VICIO VIGAS VIGIA VIGIE VILAO VINDE VINGA VINIL VIRAM " +
    "VIRES VIRIA VISCO VISOR VISTE VITAL VIVAM VIVAS VIVEU VIVIA VOGAL VOTAM " +
    "VOTAR VOTEM VOTOU VOVOS VOZES XISTO ZANGA ZERAR ZEROS ZOMBA ZUMBI ";

  var RAW_GUESSES =
    "AINDA CASAS DADOS DESDE DEDOS ENTRE FOSSE HORAS LUVAS MARES MENOS MESAS " +
    "NOMES NOSSO ONDAS OLHOS RAMOS SOBRE TODOS VAMOS ACHAM ACHOU AONDE CERTA " +
    "DELAS DELES DESTA DESTE DISSO DISSE DISTO ESTAO ESTAS ESTES FACAM FALAM " +
    "FALOU FICAM FICOU FORAM HAVIA HOUVE NESTA NESTE NESSA NESSE NISSO NISTO " +
    "OUTRA PELAS PELOS PODEM PODIA POSSA POSSO SERIA SINTO TENHA TENHO TINHA " +
    "TODAS VENHA VEZES VINDO VOCES VOLTA TERIA VERIA BOLAS CASOS AMAVA TOMEI " +
    "VIROU ";

  function parseWords(raw) {
    return raw.trim().split(/\s+/).filter(function (word) {
      return /^[A-Z]{5}$/.test(word);
    });
  }

  var WORDS = Array.from(new Set(parseWords(RAW_WORDS)));
  var WORD_SET = new Set(WORDS.concat(parseWords(RAW_GUESSES)));
  var KEY_ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
  var RANK = { absent: 0, present: 1, correct: 2 };

  var state = {
    answer: "",
    guesses: [],
    current: "",
    finished: false,
    won: false,
    free: false,
    dayIndex: 0,
    startedAt: null,
    status: {},
    statsSaved: false,
  };

  var els = {
    board: document.getElementById("board"),
    keyboard: document.getElementById("keyboard"),
    message: document.getElementById("message"),
    modeBtn: document.getElementById("mode-btn"),
    helpBtn: document.getElementById("help-btn"),
    shareBtn: document.getElementById("share-btn"),
    resultBtn: document.getElementById("result-btn"),
    result: document.getElementById("result"),
    resultIcon: document.getElementById("result-icon"),
    resultTitle: document.getElementById("result-title"),
    resultText: document.getElementById("result-text"),
    statPlayed: document.getElementById("stat-played"),
    statWin: document.getElementById("stat-win"),
    statStreak: document.getElementById("stat-streak"),
    resultShare: document.getElementById("result-share"),
    resultFree: document.getElementById("result-free"),
    resultClose: document.getElementById("result-close"),
    shareOutput: document.getElementById("share-output"),
    help: document.getElementById("help"),
    helpClose: document.getElementById("help-close"),
  };

  var tileEls = [];
  var keyEls = {};

  function getDayIndex() {
    var now = new Date();
    var today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.max(0, Math.floor((today - EPOCH) / 86400000));
  }

  function storageKey() {
    return "vr-palavra-" + state.dayIndex;
  }

  function scoreGuess(guess, answer) {
    var result = new Array(LENGTH).fill("absent");
    var remaining = {};

    for (var i = 0; i < LENGTH; i++) {
      if (guess[i] === answer[i]) {
        result[i] = "correct";
      } else {
        remaining[answer[i]] = (remaining[answer[i]] || 0) + 1;
      }
    }

    for (var j = 0; j < LENGTH; j++) {
      if (result[j] === "correct") continue;
      var letter = guess[j];
      if (remaining[letter] > 0) {
        result[j] = "present";
        remaining[letter] -= 1;
      }
    }

    return result;
  }

  function labelFor(mark) {
    if (mark === "correct") return "posição certa";
    if (mark === "present") return "existe em outra posição";
    return "não existe";
  }

  function setMessage(text) {
    els.message.textContent = text || "Digite uma palavra de 5 letras.";
  }

  function buildBoard() {
    els.board.innerHTML = "";
    tileEls = [];

    for (var r = 0; r < MAX_TRIES; r++) {
      var row = document.createElement("div");
      row.className = "row";
      row.setAttribute("role", "row");
      var rowTiles = [];

      for (var c = 0; c < LENGTH; c++) {
        var tile = document.createElement("div");
        tile.className = "tile";
        tile.setAttribute("role", "gridcell");
        tile.setAttribute(
          "aria-label",
          "Linha " + (r + 1) + ", coluna " + (c + 1) + ", vazia"
        );
        row.appendChild(tile);
        rowTiles.push(tile);
      }

      els.board.appendChild(row);
      tileEls.push(rowTiles);
    }
  }

  function buildKeyboard() {
    els.keyboard.innerHTML = "";
    keyEls = {};

    var rows = [
      KEY_ROWS[0].split("").concat(["BACKSPACE"]),
      KEY_ROWS[1].split("").concat(["ENTER"]),
      KEY_ROWS[2].split(""),
    ];

    for (var r = 0; r < rows.length; r++) {
      var rowEl = document.createElement("div");
      rowEl.className = "key-row";

      for (var i = 0; i < rows[r].length; i++) {
        var key = rows[r][i];
        var button = document.createElement("button");
        button.type = "button";
        button.className = "key" + (key.length > 1 ? " wide" : "");
        button.dataset.key = key;
        button.textContent = key === "BACKSPACE" ? "⌫" : key === "ENTER" ? "Enter" : key;
        button.setAttribute(
          "aria-label",
          key === "BACKSPACE" ? "Apagar letra" : key === "ENTER" ? "Enviar palavra" : "Letra " + key
        );
        button.addEventListener("click", makeKeyHandler(key));
        rowEl.appendChild(button);
        keyEls[key] = button;
      }

      els.keyboard.appendChild(rowEl);
    }
  }

  function makeKeyHandler(key) {
    return function () {
      handleKey(key);
    };
  }

  function paintCurrentRow() {
    var row = state.guesses.length;
    if (row >= MAX_TRIES) return;

    for (var c = 0; c < LENGTH; c++) {
      var tile = tileEls[row][c];
      var letter = state.current[c] || "";
      tile.textContent = letter;
      tile.classList.toggle("filled", Boolean(letter));
      tile.classList.remove("correct", "present", "absent", "reveal");
      tile.style.animationDelay = "";
      tile.setAttribute(
        "aria-label",
        "Linha " + (row + 1) + ", coluna " + (c + 1) + ": " + (letter || "vazia")
      );
    }
  }

  function paintAll() {
    for (var r = 0; r < MAX_TRIES; r++) {
      for (var c = 0; c < LENGTH; c++) {
        var tile = tileEls[r][c];
        tile.className = "tile";
        tile.style.animationDelay = "";
        tile.textContent = "";
        tile.setAttribute(
          "aria-label",
          "Linha " + (r + 1) + ", coluna " + (c + 1) + ", vazia"
        );
      }

      var guess = state.guesses[r];
      if (!guess) continue;

      for (var k = 0; k < LENGTH; k++) {
        var cell = tileEls[r][k];
        cell.textContent = guess.word[k];
        cell.classList.add("filled", guess.marks[k]);
        cell.setAttribute(
          "aria-label",
          "Linha " +
            (r + 1) +
            ", coluna " +
            (k + 1) +
            ": " +
            guess.word[k] +
            ", " +
            labelFor(guess.marks[k])
        );
      }
    }

    if (!state.finished) paintCurrentRow();
  }

  function paintGuessRow(rowIndex, animate) {
    var guess = state.guesses[rowIndex];

    for (var c = 0; c < LENGTH; c++) {
      var tile = tileEls[rowIndex][c];
      tile.textContent = guess.word[c];
      tile.className = "tile filled " + guess.marks[c];
      tile.setAttribute(
        "aria-label",
        "Linha " +
          (rowIndex + 1) +
          ", coluna " +
          (c + 1) +
          ": " +
          guess.word[c] +
          ", " +
          labelFor(guess.marks[c])
      );

      if (animate) {
        tile.classList.add("reveal");
        tile.style.animationDelay = c * 90 + "ms";
      }
    }
  }

  function paintKeyboard() {
    Object.keys(keyEls).forEach(function (key) {
      if (key.length !== 1) return;
      var el = keyEls[key];
      el.classList.remove("correct", "present", "absent");
      if (state.status[key]) el.classList.add(state.status[key]);
    });
  }

  function updateKeyboard(word, marks) {
    for (var i = 0; i < LENGTH; i++) {
      var letter = word[i];
      var current = state.status[letter];
      if (current === "correct") continue;
      if (!current || RANK[marks[i]] > RANK[current]) {
        state.status[letter] = marks[i];
      }
    }
    paintKeyboard();
  }

  function shakeCurrentRow() {
    var row = els.board.children[state.guesses.length];
    if (!row) return;
    row.classList.remove("shake");
    void row.offsetWidth;
    row.classList.add("shake");
  }

  var memoryStats = { played: 0, wins: 0, streak: 0, best: 0 };

  function loadStats() {
    try {
      var saved = JSON.parse(window.localStorage.getItem(STATS_KEY));
      if (saved && typeof saved.played === "number") return saved;
    } catch (error) {
      // armazenamento bloqueado: usa as estatísticas desta sessão
    }
    return {
      played: memoryStats.played,
      wins: memoryStats.wins,
      streak: memoryStats.streak,
      best: memoryStats.best,
    };
  }

  function saveStats(stats) {
    memoryStats = stats;
    try {
      window.localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch (error) {
      // sem persistência: segue o jogo
    }
  }

  function updateStats(won) {
    if (state.statsSaved) return;
    state.statsSaved = true;

    var stats = loadStats();
    stats.played += 1;

    if (won) {
      stats.wins += 1;
      stats.streak += 1;
      stats.best = Math.max(stats.best || 0, state.guesses.length);
    } else {
      stats.streak = 0;
    }

    saveStats(stats);
  }

  function save() {
    if (state.free) return;
    try {
      window.localStorage.setItem(
        storageKey(),
        JSON.stringify({
          guesses: state.guesses.map(function (guess) {
            return guess.word;
          }),
          finished: state.finished,
        })
      );
    } catch (error) {
      // armazenamento bloqueado: o jogo continua sem salvar
    }
  }

  function loadSaved() {
    if (state.free) return null;
    try {
      var raw = window.localStorage.getItem(storageKey());
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.guesses)) return null;
      return parsed.guesses
        .filter(function (word) {
          return typeof word === "string" && WORD_SET.has(word);
        })
        .slice(0, MAX_TRIES);
    } catch (error) {
      return null;
    }
  }

  function showResult(won) {
    els.result.hidden = false;
    els.resultIcon.textContent = won ? "🏆" : "💡";
    els.resultTitle.textContent = won ? "Você acertou!" : "Quase lá!";

    if (won) {
      els.resultText.textContent =
        "A palavra era " +
        state.answer +
        ". Você usou " +
        state.guesses.length +
        " de " +
        MAX_TRIES +
        " tentativas.";
    } else {
      els.resultText.textContent =
        "A palavra era " +
        state.answer +
        ". Volte amanhã ou jogue no modo livre.";
    }

    var stats = loadStats();
    els.statPlayed.textContent = String(stats.played);
    els.statWin.textContent = stats.played
      ? Math.round((stats.wins / stats.played) * 100) + "%"
      : "0%";
    els.statStreak.textContent = String(stats.streak);

    els.shareOutput.hidden = true;
    els.shareOutput.textContent = "";
    els.resultClose.focus();
  }

  function finish(won) {
    state.finished = true;
    state.won = won;
    var timeMs = state.startedAt ? Date.now() - state.startedAt : 0;

    setMessage(won ? "Você acertou!" : "A palavra era " + state.answer + ".");
    els.resultBtn.hidden = false;

    if (!state.free) {
      updateStats(won);
      save();
    }

    window.parent.postMessage(
      {
        type: "vrgame:finish",
        score: won ? 1 : 0,
        maxScore: 1,
        timeMs: timeMs,
        detail: {
          attempts: state.guesses.length,
          won: won,
          word: state.answer,
          mode: state.free ? "free" : "daily",
        },
      },
      "*"
    );

    window.setTimeout(function () {
      showResult(won);
    }, 900);
  }

  function submit() {
    if (state.finished) return;

    if (state.current.length !== LENGTH) {
      setMessage("A palavra precisa ter 5 letras.");
      shakeCurrentRow();
      return;
    }

    if (!WORD_SET.has(state.current)) {
      setMessage("Essa palavra não está na lista. Tente outra.");
      shakeCurrentRow();
      return;
    }

    if (!state.startedAt) state.startedAt = Date.now();

    var word = state.current;
    var marks = scoreGuess(word, state.answer);
    state.guesses.push({ word: word, marks: marks });
    state.current = "";

    paintGuessRow(state.guesses.length - 1, true);
    updateKeyboard(word, marks);
    save();

    if (word === state.answer) {
      finish(true);
      return;
    }

    if (state.guesses.length >= MAX_TRIES) {
      finish(false);
      return;
    }

    var left = MAX_TRIES - state.guesses.length;
    setMessage(left === 1 ? "Última tentativa." : left + " tentativas restantes.");
  }

  function handleKey(key) {
    if (!els.result.hidden || !els.help.hidden) return;

    if (state.finished) {
      if (key === "ENTER") showResult(state.won);
      return;
    }

    if (key === "ENTER") {
      submit();
      return;
    }

    if (key === "BACKSPACE") {
      state.current = state.current.slice(0, -1);
      paintCurrentRow();
      return;
    }

    if (/^[A-Z]$/.test(key) && state.current.length < LENGTH) {
      if (!state.startedAt) state.startedAt = Date.now();
      state.current += key;
      paintCurrentRow();
      setMessage("");
    }
  }

  function shareGrid() {
    var label = state.free
      ? "Palavra do Dia VR · modo livre"
      : "Palavra do Dia VR #" + (state.dayIndex + 1);
    var score = state.won ? state.guesses.length + "/" + MAX_TRIES : "X/" + MAX_TRIES;

    var grid = state.guesses
      .map(function (guess) {
        return guess.marks
          .map(function (mark) {
            if (mark === "correct") return "🟩";
            if (mark === "present") return "🟨";
            return "⬛";
          })
          .join("");
      })
      .join("\n");

    return label + " " + score + "\n" + grid;
  }

  function fallbackCopy(text) {
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "-1000px";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();

    var ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (error) {
      ok = false;
    }

    document.body.removeChild(area);
    return ok;
  }

  function copyShare() {
    var text = shareGrid();

    function done(ok) {
      if (ok) {
        setMessage("Resultado copiado!");
      } else {
        els.result.hidden = false;
        els.shareOutput.hidden = false;
        els.shareOutput.textContent = text;
      }
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(function () {
          done(true);
        })
        .catch(function () {
          done(fallbackCopy(text));
        });
    } else {
      done(fallbackCopy(text));
    }
  }

  function resetRound() {
    state.guesses = [];
    state.current = "";
    state.finished = false;
    state.won = false;
    state.startedAt = null;
    state.status = {};
    state.statsSaved = false;

    els.result.hidden = true;
    els.resultBtn.hidden = true;
    els.shareOutput.hidden = true;
    els.shareOutput.textContent = "";

    paintAll();
    paintKeyboard();
  }

  function restore() {
    var saved = loadSaved();

    if (!saved || saved.length === 0) {
      setMessage("Digite uma palavra de 5 letras.");
      return;
    }

    state.guesses = saved.map(function (word) {
      return { word: word, marks: scoreGuess(word, state.answer) };
    });

    state.guesses.forEach(function (guess) {
      updateKeyboard(guess.word, guess.marks);
    });

    state.finished =
      state.guesses.some(function (guess) {
        return guess.word === state.answer;
      }) || state.guesses.length >= MAX_TRIES;

    state.won = state.guesses.some(function (guess) {
      return guess.word === state.answer;
    });

    paintAll();
    paintKeyboard();

    if (state.finished) {
      els.resultBtn.hidden = false;
      setMessage(
        state.won
          ? "Você já acertou hoje. Volte amanhã!"
          : "Você já jogou hoje. A palavra era " + state.answer + "."
      );
    } else {
      setMessage(MAX_TRIES - state.guesses.length + " tentativas restantes.");
    }
  }

  function randomWord() {
    var word = state.answer;
    while (word === state.answer) {
      word = WORDS[Math.floor(Math.random() * WORDS.length)];
    }
    return word;
  }

  function notifyRestart() {
    window.parent.postMessage({ type: "vrgame:restart" }, "*");
  }

  function startFree() {
    notifyRestart();
    state.free = true;
    state.answer = randomWord();
    resetRound();
    els.modeBtn.textContent = "Voltar ao diário";
    setMessage("Modo livre: uma palavra aleatória.");
  }

  function startDaily() {
    notifyRestart();
    state.free = false;
    state.dayIndex = getDayIndex();
    state.answer = WORDS[state.dayIndex % WORDS.length];
    resetRound();
    els.modeBtn.textContent = "Modo livre";
    restore();
  }

  function onKeyDown(event) {
    if (!els.result.hidden || !els.help.hidden) {
      if (event.key === "Escape") {
        els.result.hidden = true;
        els.help.hidden = true;
      }
      return;
    }

    if (event.ctrlKey || event.metaKey || event.altKey) return;

    var target = event.target;
    if (
      target &&
      target.tagName === "BUTTON" &&
      (event.key === "Enter" || event.key === " ")
    ) {
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      handleKey("ENTER");
      return;
    }

    if (event.key === "Backspace") {
      event.preventDefault();
      handleKey("BACKSPACE");
      return;
    }

    if (/^[a-zA-Z]$/.test(event.key)) {
      event.preventDefault();
      handleKey(event.key.toUpperCase());
    }
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

  var lastHeight = 0;

  function reportHeight() {
    var height = Math.ceil(document.body.getBoundingClientRect().height);
    if (Math.abs(height - lastHeight) < 4) return;
    lastHeight = height;
    window.parent.postMessage({ type: "vrgame:resize", height: height }, "*");
  }

  function init() {
    buildBoard();
    buildKeyboard();

    state.dayIndex = getDayIndex();
    state.answer = WORDS[state.dayIndex % WORDS.length];
    restore();

    els.modeBtn.addEventListener("click", function () {
      if (state.free) startDaily();
      else startFree();
    });

    els.helpBtn.addEventListener("click", function () {
      els.help.hidden = false;
      els.helpClose.focus();
    });

    els.helpClose.addEventListener("click", function () {
      els.help.hidden = true;
      els.helpBtn.focus();
    });

    els.shareBtn.addEventListener("click", function () {
      if (!state.finished) {
        setMessage("Termine a partida para compartilhar.");
        return;
      }
      copyShare();
    });

    els.resultBtn.addEventListener("click", function () {
      showResult(state.won);
    });

    els.resultShare.addEventListener("click", copyShare);

    els.resultFree.addEventListener("click", function () {
      startFree();
    });

    els.resultClose.addEventListener("click", function () {
      els.result.hidden = true;
      els.shareBtn.focus();
    });

    els.result.addEventListener("click", function (event) {
      if (event.target === els.result) els.result.hidden = true;
    });

    els.help.addEventListener("click", function (event) {
      if (event.target === els.help) els.help.hidden = true;
    });

    document.addEventListener("keydown", onKeyDown);

    applyTheme(preferredTheme());

    if (window.self === window.top) {
      document.documentElement.classList.add("is-standalone");
    }

    window.addEventListener("storage", function (event) {
      if (event.key === "theme") applyTheme(event.newValue);
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
      }
    });

    window.addEventListener("resize", reportHeight);
    if ("ResizeObserver" in window) {
      new ResizeObserver(reportHeight).observe(document.body);
    }
    window.requestAnimationFrame(reportHeight);

    window.parent.postMessage({ type: "vrgame:ready" }, "*");
  }

  init();
})();
