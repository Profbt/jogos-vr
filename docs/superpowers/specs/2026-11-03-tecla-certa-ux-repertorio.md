# Tecla Certa — UX da escolha de temas e ampliação do repertório

**Data:** 2026-11-03
**Status:** Aprovado para implementação
**Jogo:** `public/games/tecla-certa/`

> **Atualização posterior:** o jogo passou a ter **4 níveis** e pontuação máxima de **12 estrelas**. A regra do nível 4 é “erro conta e o texto segue”, sem dicas de dedo. O nível 1 passou a aceitar acentuação básica para não ensinar grafias erradas.

## 1. Objetivo
Melhorar a apresentação visual da tela de escolha de temas e da seção “Como jogar”, e ampliar o repertório do jogo com novos temas e textos, sem alterar a jogabilidade aprovada.

## 2. Escopo
- 10 temas (4 atuais + 6 novos), agrupados por área do conhecimento.
- 4 níveis por tema (o quarto com duas frases).
- 2 textos alternativos por nível em todos os temas.
- Nova apresentação dos cards de tema, com selo SVG e cor própria.
- Nova seção “Como jogar” com 3 passos e mini teclado colorido.
- Nenhuma alteração em pontuação, teclado virtual, acentos, eventos ao portal ou fluxo de níveis.

## 3. Temas e grupos

| Grupo | Temas |
|---|---|
| Linguagens | Língua Portuguesa · Arte e Cultura · Inglês |
| Ciências da Natureza | Corpo Humano · Sistema Solar |
| Ciências Humanas | Biomas do Brasil · História do Brasil · Geografia do Mundo |
| Matemática e Tecnologia | Matemática · Tecnologia |

### 3.1 Temas e textos

Formato: `N1` (palavras curtas, sem acento), `N2` (palavras médias com acento/ç), `N3` (frase completa).

**Biomas do Brasil** (Geografia)
- N1: `MATA CAMPO LAGO SERRA DUNAS RIO` / `FLORA FAUNA RIO MAR SERRA DUNA`
- N2: `CERRADO CAATINGA PANTANAL AMAZÔNIA PAMPA MATA ATLÂNTICA` / `CAATINGA CERRADO PANTANAL PAMPA FLORESTA MANGUEZAL`
- N3: `O CERRADO É O BERÇO DAS ÁGUAS DO BRASIL.` / `A AMAZÔNIA É A MAIOR FLORESTA TROPICAL.`

**Corpo Humano** (Ciências)
- N1: `OSSO PELE SANGUE NARIZ OUVIDO OLHO` / `DENTE UNHA PELE OLHO BOCA OSSO`
- N2: `CORAÇÃO PULMÃO FÍGADO CÉREBRO ESTÔMAGO INTESTINO` / `RIM BAÇO PÂNCREAS ESÔFAGO TRAQUEIA VEIA`
- N3: `O CORAÇÃO BOMBEIA O SANGUE PARA TODO O CORPO.` / `OS PULMÕES TROCAM OXIGÊNIO POR GÁS CARBÔNICO.`

**História do Brasil** (História)
- N1: `REI LEI OURO NAVIO CARTA POVO` / `BRASIL PAIS REI OURO LEI NAVIO`
- N2: `COLÔNIA IMPÉRIO ABOLIÇÃO REPÚBLICA CARAVELA MONARQUIA` / `CABRAL BRASIL COLÔNIA INDEPENDÊNCIA IMPÉRIO REPÚBLICA`
- N3: `A ABOLIÇÃO ACONTECEU EM 1888.` / `O BRASIL FOI COLONIZADO POR PORTUGAL.`

**Língua Portuguesa** (Português)
- N1: `SALA LIVRO CARTA TEXTO FRASE CONTO` / `PENA LAPIS TINTA PAPEL LIVRO TEXTO`
- N2: `ACENTUAÇÃO ORTOGRAFIA PONTUAÇÃO SÍLABA PARÁGRAFO CRASE` / `SUBSTANTIVO VERBO ADJETIVO CONCORDÂNCIA REGÊNCIA CRASE`
- N3: `A ACENTUAÇÃO MUDA O SENTIDO DAS PALAVRAS.` / `A PONTUAÇÃO ORGANIZA AS IDEIAS DO TEXTO.`

**Sistema Solar** (Ciências)
- N1: `SOL LUA MARTE TERRA COMETA ORBITA` / `VENUS JUPITER SATURNO NETUNO URANO`
- N2: `JÚPITER SATURNO MERCÚRIO VÊNUS NETUNO ASTEROIDE` / `GALÁXIA CONSTELAÇÃO METEORO GRAVIDADE ECLIPSE ÓRBITA`
- N3: `A TERRA GIRA EM TORNO DO SOL.` / `O SOL É A ESTRELA MAIS PRÓXIMA DA TERRA.`

**Matemática** (Matemática)
- N1: `SOMA DOIS METADE METRO RETO EIXO` / `MAIS MENOS VEZES DIVIDE QUARTO CUBO`
- N2: `FRAÇÃO ÂNGULO PERÍMETRO EQUAÇÃO VÉRTICE DIAGONAL` / `RETÂNGULO TRIÂNGULO CÍRCULO QUADRADO PENTÁGONO HEXÁGONO`
- N3: `A SOMA DOS ÂNGULOS INTERNOS DO TRIÂNGULO É CONSTANTE.` / `A ÁREA DO RETÂNGULO É BASE VEZES ALTURA.`

**Geografia do Mundo** (Geografia)
- N1: `MAPA MAR POLO EIXO FUSO GLOBO` / `PAIS CIDADE RIO MAR SERRA LAGO`
- N2: `CONTINENTE OCEANO EUROPA ÁSIA ÁFRICA OCEANIA` / `AMÉRICA ANTÁRTIDA ATLÂNTICO PACÍFICO ÍNDICO MEDITERRÂNEO`
- N3: `O GLOBO TERRESTRE TEM CINCO OCEANOS.` / `A LINHA DO EQUADOR DIVIDE A TERRA EM DOIS HEMISFÉRIOS.`

**Tecnologia** (Tecnologia)
- N1: `DADO REDE SITE LOGIN SENHA NUVEM` / `MOUSE TECLA TELA CABO WIFI ROTEADOR`
- N2: `INTERNET COMPUTADOR SEGURANÇA ARQUIVO PROGRAMA BINÁRIO` / `ALGORITMO SOFTWARE HARDWARE NAVEGADOR SENHA CRIPTOGRAFIA`
- N3: `A SENHA FORTE PROTEGE SEUS DADOS PESSOAIS.` / `A INTERNET CONECTA PESSOAS EM TODO O MUNDO.`

**Arte e Cultura** (Arte)
- N1: `ARTE COR SOM PALCO RITMO CENA` / `PINTURA CANTO PALCO MUSEU FOTO VIDEO`
- N2: `PINTURA ESCULTURA MÚSICA TEATRO POESIA FOTOGRAFIA` / `BALLET CINEMA LITERATURA ARQUITETURA DANÇA ÓPERA`
- N3: `A ARTE TRANSFORMA O MUNDO EM IMAGEM.` / `A MÚSICA UNE PESSOAS DE DIFERENTES CULTURAS.`

**Inglês** (Inglês)
- N1: `BOOK HOUSE WATER MUSIC HAPPY NIGHT` / `FRIEND SCHOOL FAMILY COMPUTER COUNTRY SMILE`
- N2: `SCHOOL FAMILY FRIEND COMPUTER COUNTRY BEAUTIFUL` / `LANGUAGE STUDENT TEACHER LIBRARY QUESTION ANSWER`
- N3: `LEARNING A NEW LANGUAGE OPENS MANY DOORS.` / `PRACTICE MAKES PERFECT EVERY SINGLE DAY.`

## 4. Tela de temas
- Hero compacto; status do topo dinâmico: `10 temas · 4 níveis`.
- Grupos com título, linha e contagem.
- Cards em grade de 2 colunas no desktop e 1 no mobile.
- Cada card: selo circular SVG, disciplina, título, descrição, `N1 · N2 · N3 · N4` e seta “Jogar”.
- Em grupos com 3 cards, o terceiro card ocupa 2 colunas com layout horizontal.
- Cada tema tem cor de acento própria, aplicada ao selo e ao destaque do card.

## 5. Seção “Como jogar”
- Painel sempre visível, após os grupos de temas.
- Cabeçalho “Como jogar” com eyebrow “Manual rápido”.
- 3 passos numerados à esquerda.
- Mini teclado colorido à direita, com a tecla “F” acesa.
- Legenda: “A tecla acesa é a próxima. A cor mostra o dedo.”
- Em telas estreitas, passos empilham acima do mini teclado.

## 6. Comportamento
- `THEMES` passa a usar `levels: [textoA, textoB]` por nível.
- A escolha do texto ocorre em `showLevelIntro`, com troca automática para evitar repetição seguida do mesmo texto no mesmo tema/nível.
- O texto escolhido é exibido no preview da tela de intro.
- `startLevel` usa o índice sorteado.
- Validação de conteúdo atualizada para 10 temas e 4 níveis com 2 textos.

## 7. Acessibilidade
- Sem rolagem horizontal em 320 px.
- Foco visível e targets mínimos de 44 px.
- `prefers-reduced-motion` remove pulse e hover lift.
- Contrastes validados em modo claro e escuro.
- Mini teclado com `aria-hidden` e legenda textual.

## 8. Arquivos impactados
- `public/games/tecla-certa/index.html`
- `public/games/tecla-certa/style.css`
- `public/games/tecla-certa/game.js`

## 9. Critérios de aceite
- 10 temas aparecem agrupados corretamente.
- Cada tema tem 4 níveis e a partida vale até 12 estrelas.
- Cada partida sorteia um dos dois textos por nível, sem repetir imediatamente o mesmo texto no mesmo tema/nível.
- A tela de temas e “Como jogar” ficam visuais e responsivas em 320 px.
- A jogabilidade existente permanece inalterada.
- `npm run build` conclui com sucesso.