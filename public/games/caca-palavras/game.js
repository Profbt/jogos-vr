(function () {
  "use strict";

  var MIN_SIZE = 12;
  var MAX_SIZE = 15;
  var COLORS = ["#2563eb", "#059669", "#d97706", "#db2777", "#7c3aed", "#0891b2"];

  var PUZZLES = [
    {
      id: "biomas",
      title: "Biomas do Brasil",
      subtitle: "Geografia · 6º e 7º ano",
      words: [
        { word: "AMAZONIA", clue: "Maior floresta tropical do mundo." },
        { word: "CERRADO", clue: "Savana brasileira, berço das águas." },
        { word: "CAATINGA", clue: "Bioma exclusivamente brasileiro, no semiárido." },
        { word: "PANTANAL", clue: "Maior planície alagável do planeta." },
        { word: "MATAATLANTICA", clue: "Bioma costeiro com grande diversidade, muito devastado pela ocupação." },
        { word: "PAMPA", clue: "Campo do Sul do Brasil, marcado pela pecuária." },
      ],
    },
    {
      id: "corpo-humano",
      title: "Corpo Humano",
      subtitle: "Ciências · 6º ao 9º ano",
      words: [
        { word: "CORACAO", clue: "Bombeia o sangue para todo o corpo." },
        { word: "PULMAO", clue: "Órgão da respiração, em par no tórax." },
        { word: "FIGADO", clue: "Filtra o sangue e produz a bile." },
        { word: "CEREBRO", clue: "Centro do sistema nervoso." },
        { word: "ESTOMAGO", clue: "Mistura o alimento com o suco gástrico." },
        { word: "INTESTINO", clue: "Absorve os nutrientes da digestão." },
        { word: "ARTERIA", clue: "Vaso que leva o sangue do coração aos tecidos." },
        { word: "PANCREAS", clue: "Produz insulina e enzimas digestivas." },
        { word: "ESQUELETO", clue: "Conjunto de ossos que sustenta o corpo." },
      ],
    },
    {
      id: "sistema-solar",
      title: "Sistema Solar",
      subtitle: "Ciências · 6º ao 9º ano",
      words: [
        { word: "PLANETA", clue: "Corpo que orbita uma estrela." },
        { word: "ESTRELA", clue: "O Sol é uma delas." },
        { word: "COMETA", clue: "Tem cauda de poeira e gelo." },
        { word: "GALAXIA", clue: "Conjunto de estrelas, gás e poeira." },
        { word: "SATELITE", clue: "Corpo que orbita um planeta." },
        { word: "ORBITA", clue: "Caminho que um corpo percorre no espaço." },
        { word: "METEORO", clue: "Fragmento que atravessa a atmosfera." },
        { word: "ASTEROIDE", clue: "Corpo rochoso do cinturão entre Marte e Júpiter." },
        { word: "ECLIPSE", clue: "Quando um astro esconde outro da nossa visão." },
      ],
    },
    {
      id: "ingles",
      title: "English Basics",
      subtitle: "Inglês · 6º ao 9º ano",
      words: [
        { word: "SCHOOL", clue: "Lugar onde estudamos." },
        { word: "TEACHER", clue: "Pessoa que ensina." },
        { word: "FRIEND", clue: "Amigo ou amiga." },
        { word: "BOOK", clue: "Objeto com páginas para ler." },
        { word: "WATER", clue: "Líquido essencial à vida." },
        { word: "HAPPY", clue: "Sentimento de alegria." },
        { word: "MUSIC", clue: "Arte dos sons." },
        { word: "FAMILY", clue: "Grupo de pessoas ligadas por parentesco." },
        { word: "WINDOW", clue: "Abertura com vidro para ver o lado de fora." },
      ],
    },
    {
      id: "historia-brasil",
      title: "História do Brasil",
      subtitle: "História · 7º ao 9º ano",
      words: [
        {
          word: "EMANCIPACAO",
          clue: "Processo de libertação colonial, como o de 1822.",
        },
        { word: "REPUBLICA", clue: "Forma de governo proclamada em 1889." },
        { word: "IMPERIO", clue: "Período de governo de D. Pedro I e D. Pedro II." },
        { word: "COLONIA", clue: "Território controlado por outra nação." },
        { word: "ABOLICAO", clue: "Fim oficial da escravidão no Brasil, em 1888." },
        { word: "TIRADENTES", clue: "Líder da Inconfidência Mineira." },
        { word: "CARAVELA", clue: "Embarcação usada nas grandes navegações." },
        { word: "MONARQUIA", clue: "Sistema em que um rei ou imperador governa." },
      ],
    },
    {
      id: "matematica",
      title: "Matemática",
      subtitle: "Matemática · 6º ao 9º ano",
      words: [
        { word: "ADICAO", clue: "Operação que junta quantidades." },
        { word: "SUBTRACAO", clue: "Operação que retira uma quantidade de outra." },
        { word: "DIVISAO", clue: "Operação que reparte em partes iguais." },
        { word: "FRACAO", clue: "Parte de um todo com numerador e denominador." },
        { word: "DECIMAL", clue: "Número escrito com vírgula." },
        { word: "EQUACAO", clue: "Igualdade com uma incógnita." },
        { word: "ANGULO", clue: "Abertura entre duas semirretas." },
        { word: "GEOMETRIA", clue: "Ramo que estuda formas e medidas." },
      ],
    },
    {
      id: "meio-ambiente",
      title: "Meio Ambiente",
      subtitle: "Ciências e Geografia · 6º ao 9º ano",
      words: [
        { word: "RECICLAGEM", clue: "Transformação de resíduos em novos produtos." },
        { word: "POLUICAO", clue: "Contaminação do ar, da água ou do solo." },
        { word: "SUSTENTAVEL", clue: "Atende às necessidades sem esgotar recursos." },
        { word: "DESMATAMENTO", clue: "Retirada da vegetação nativa de uma área." },
        { word: "FLORESTA", clue: "Grande área coberta por árvores." },
        { word: "CLIMA", clue: "Padrão do tempo em uma região ao longo dos anos." },
        { word: "RESIDUOS", clue: "Materiais descartados após o uso." },
        { word: "ECOLOGIA", clue: "Ciência que estuda os seres vivos e o ambiente." },
      ],
    },
    {
      id: "portugues",
      title: "Língua Portuguesa",
      subtitle: "Português · 6º ao 9º ano",
      words: [
        { word: "SUBSTANTIVO", clue: "Classe que nomeia seres, lugares e coisas." },
        { word: "ADJETIVO", clue: "Classe que caracteriza o substantivo." },
        { word: "VERBO", clue: "Classe que indica ação, estado ou fenômeno." },
        { word: "PRONOME", clue: "Palavra que substitui ou acompanha o substantivo." },
        { word: "ARTIGO", clue: "Palavra que define ou indetermina o substantivo." },
        { word: "ORACAO", clue: "Enunciado organizado em torno de um verbo." },
        { word: "SILABA", clue: "Unidade sonora de uma palavra." },
        { word: "METAFORA", clue: "Comparação implícita entre dois termos." },
      ],
    },
    {
      id: "geografia-geral",
      title: "Geografia Geral",
      subtitle: "Geografia · 6º ao 9º ano",
      words: [
        { word: "CONTINENTE", clue: "Grande extensão de terra cercada por oceanos." },
        { word: "OCEANO", clue: "Grande massa de água salgada." },
        { word: "CAPITAL", clue: "Cidade onde fica a sede do governo." },
        { word: "FRONTEIRA", clue: "Limite entre dois países ou territórios." },
        { word: "LATITUDE", clue: "Distância de um ponto ao Equador." },
        { word: "LONGITUDE", clue: "Distância de um ponto ao Meridiano de Greenwich." },
        { word: "RELEVO", clue: "Conjunto de formas da superfície terrestre." },
        { word: "POPULACAO", clue: "Conjunto de habitantes de um lugar." },
      ],
    },
    {
      id: "ciencias",
      title: "Ciências",
      subtitle: "Ciências · 6º ao 9º ano",
      words: [
        { word: "CIENCIA", clue: "Conhecimento obtido por observação, estudo e experimentação." },
        { word: "EXPERIMENTO", clue: "Procedimento controlado para testar uma hipótese." },
        { word: "LABORATORIO", clue: "Espaço equipado para pesquisas e análises científicas." },
        { word: "MOLECULA", clue: "Menor parte de uma substância que mantém suas propriedades." },
        { word: "ENERGIA", clue: "Capacidade de realizar trabalho ou provocar transformações." },
        { word: "MATERIA", clue: "Tudo o que tem massa e ocupa lugar no espaço." },
        { word: "ATOMO", clue: "Menor unidade de um elemento químico." },
        { word: "CELULA", clue: "Menor unidade viva dos seres vivos." },
        { word: "GRAVIDADE", clue: "Força que atrai os corpos para o centro da Terra." },
        { word: "TEMPERATURA", clue: "Medida do grau de agitação das partículas." },
      ],
    },
    {
      id: "biologia",
      title: "Biologia",
      subtitle: "Biologia · 6º ao 9º ano",
      words: [
        { word: "CELULA", clue: "Unidade básica de todos os seres vivos." },
        { word: "GENETICA", clue: "Ramo da biologia que estuda a herança dos caracteres." },
        { word: "EVOLUCAO", clue: "Transformação das espécies ao longo do tempo." },
        { word: "ECOSSISTEMA", clue: "Conjunto de seres vivos e o ambiente em que vivem." },
        { word: "BACTERIA", clue: "Ser microscópico unicelular, sem núcleo definido." },
        { word: "VIRUS", clue: "Agente infeccioso que só se reproduz dentro de células." },
        { word: "HORMONIO", clue: "Substância que regula funções do organismo." },
        { word: "ENZIMA", clue: "Proteína que acelera reações químicas no corpo." },
        { word: "MEMBRANA", clue: "Camada que envolve e protege a célula." },
        { word: "FOTOSSINTESE", clue: "Processo em que plantas produzem alimento usando a luz." },
      ],
    },
    {
      id: "fisica",
      title: "Física",
      subtitle: "Física · 8º e 9º ano",
      words: [
        { word: "FORCA", clue: "Interação capaz de alterar o movimento de um corpo." },
        { word: "MOVIMENTO", clue: "Mudança de posição de um corpo ao longo do tempo." },
        { word: "VELOCIDADE", clue: "Distância percorrida por unidade de tempo." },
        { word: "ACELERACAO", clue: "Variação da velocidade em um intervalo de tempo." },
        { word: "GRAVIDADE", clue: "Atração que a Terra exerce sobre os corpos." },
        { word: "ATRITO", clue: "Força que se opõe ao deslizamento entre superfícies." },
        { word: "MASSA", clue: "Quantidade de matéria de um corpo." },
        { word: "ALAVANCA", clue: "Máquina simples usada para multiplicar forças." },
        { word: "MAGNETISMO", clue: "Fenômeno de atração ou repulsão entre ímãs." },
        { word: "ELETRICIDADE", clue: "Conjunto de fenômenos ligados às cargas elétricas." },
      ],
    },
    {
      id: "quimica",
      title: "Química",
      subtitle: "Química · 8º e 9º ano",
      words: [
        { word: "ATOMO", clue: "Menor unidade de um elemento químico." },
        { word: "MOLECULA", clue: "Agrupamento de átomos unidos por ligações químicas." },
        { word: "ELEMENTO", clue: "Substância formada por um único tipo de átomo." },
        { word: "REACAO", clue: "Transformação em que substâncias se combinam ou se separam." },
        { word: "ACIDO", clue: "Substância que libera íons H+ em solução." },
        { word: "SOLUCAO", clue: "Mistura homogênea de soluto e solvente." },
        { word: "MISTURA", clue: "União de duas ou mais substâncias sem reação química." },
        { word: "SUBSTANCIA", clue: "Matéria com composição e propriedades definidas." },
        { word: "OXIGENIO", clue: "Elemento essencial à respiração e à combustão." },
        { word: "HIDROGENIO", clue: "Elemento mais leve da tabela periódica." },
      ],
    },
    {
      id: "historia-geral",
      title: "História Geral",
      subtitle: "História · 7º ao 9º ano",
      words: [
        { word: "REVOLUCAO", clue: "Mudança profunda na política, na economia ou na sociedade." },
        { word: "RENASCIMENTO", clue: "Movimento cultural europeu dos séculos XIV a XVI." },
        { word: "ILUMINISMO", clue: "Movimento intelectual que valorizou a razão." },
        { word: "FEUDALISMO", clue: "Sistema social e econômico da Idade Média." },
        { word: "CRUZADAS", clue: "Expedições militares religiosas medievais." },
        { word: "DEMOCRACIA", clue: "Governo em que o povo participa das decisões." },
        { word: "COLONIZACAO", clue: "Ocupação e exploração de um território por outro povo." },
        { word: "INDUSTRIAL", clue: "Relativo à produção em fábricas e com máquinas." },
        { word: "GUERRA", clue: "Conflito armado entre grupos ou nações." },
        { word: "TRATADO", clue: "Acordo formal entre países." },
      ],
    },
    {
      id: "empreendedorismo",
      title: "Empreendedorismo",
      subtitle: "Projeto de vida e negócios · 8º e 9º ano",
      words: [
        { word: "EMPREENDER", clue: "Criar e conduzir um projeto ou negócio." },
        { word: "NEGOCIO", clue: "Atividade que oferece produtos ou serviços." },
        { word: "CLIENTE", clue: "Pessoa que compra ou utiliza um produto ou serviço." },
        { word: "PRODUTO", clue: "Bem ou serviço oferecido ao mercado." },
        { word: "MERCADO", clue: "Conjunto de compradores e vendedores." },
        { word: "LUCRO", clue: "Ganho obtido quando a receita supera os custos." },
        { word: "INVESTIR", clue: "Aplicar recursos esperando retorno futuro." },
        { word: "INOVACAO", clue: "Criação ou melhoria de produtos e processos." },
        { word: "GESTAO", clue: "Administração de recursos e pessoas." },
        { word: "STARTUP", clue: "Empresa jovem com modelo de negócio inovador." },
      ],
    },
    {
      id: "educacao-financeira",
      title: "Educação Financeira",
      subtitle: "Matemática e projeto de vida · 8º e 9º ano",
      words: [
        { word: "DINHEIRO", clue: "Meio usado para pagar bens e serviços." },
        { word: "ORCAMENTO", clue: "Planejamento de receitas e despesas." },
        { word: "POUPANCA", clue: "Reserva de dinheiro para uso futuro." },
        { word: "INVESTIMENTO", clue: "Aplicação de recursos com expectativa de retorno." },
        { word: "JUROS", clue: "Valor pago pelo uso do dinheiro ao longo do tempo." },
        { word: "TAXAS", clue: "Percentuais cobrados em operações financeiras." },
        { word: "CONSUMO", clue: "Uso de bens e serviços para satisfazer necessidades." },
        { word: "RECEITA", clue: "Dinheiro que entra no orçamento." },
        { word: "DESPESA", clue: "Dinheiro que sai do orçamento." },
        { word: "ECONOMIA", clue: "Administração de recursos e produção de riqueza." },
      ],
    },
    {
      id: "programacao",
      title: "Programação",
      subtitle: "Tecnologia · 8º e 9º ano",
      words: [
        { word: "PROGRAMA", clue: "Sequência de instruções executada por um computador." },
        { word: "CODIGO", clue: "Conjunto de instruções escritas em linguagem de programação." },
        { word: "ALGORITMO", clue: "Sequência finita de passos para resolver um problema." },
        { word: "VARIAVEL", clue: "Espaço que guarda um valor na memória." },
        { word: "FUNCAO", clue: "Bloco de código reutilizável que executa uma tarefa." },
        { word: "CONDICAO", clue: "Estrutura que decide qual caminho o programa segue." },
        { word: "TESTE", clue: "Verificação para confirmar se o código funciona." },
        { word: "DEPURAR", clue: "Encontrar e corrigir erros no código." },
        { word: "COMPILAR", clue: "Traduzir o código para linguagem de máquina." },
        { word: "INTERFACE", clue: "Parte do sistema com a qual o usuário interage." },
      ],
    },
    {
      id: "robotica",
      title: "Robótica",
      subtitle: "Tecnologia · 6º ao 9º ano",
      words: [
        { word: "ROBOTICA", clue: "Área que cria máquinas capazes de executar tarefas." },
        { word: "SENSOR", clue: "Dispositivo que detecta luz, calor, distância ou movimento." },
        { word: "MOTOR", clue: "Componente que gera movimento." },
        { word: "CIRCUITO", clue: "Caminho por onde passa a corrente elétrica." },
        { word: "ARDUINO", clue: "Placa programável usada em projetos de automação." },
        { word: "AUTOMACAO", clue: "Uso de máquinas para executar tarefas sem intervenção humana." },
        { word: "ENGRENAGEM", clue: "Roda dentada que transmite movimento." },
        { word: "PROTOTIPO", clue: "Primeiro modelo de um produto em desenvolvimento." },
        { word: "ATUADOR", clue: "Componente que transforma energia em movimento." },
        { word: "ELETRONICA", clue: "Área que estuda circuitos e componentes elétricos." },
      ],
    },
    {
      id: "tecnologia",
      title: "Tecnologia",
      subtitle: "Tecnologia · 6º ao 9º ano",
      words: [
        { word: "INTERNET", clue: "Rede mundial de computadores conectados." },
        { word: "COMPUTADOR", clue: "Máquina que processa dados e executa programas." },
        { word: "TECNOLOGIA", clue: "Conjunto de conhecimentos aplicados à produção." },
        { word: "DADOS", clue: "Informações registradas e processadas por sistemas." },
        { word: "PRIVACIDADE", clue: "Proteção das informações pessoais." },
        { word: "SEGURANCA", clue: "Conjunto de medidas que protegem sistemas e pessoas." },
        { word: "USUARIO", clue: "Pessoa que utiliza um sistema ou serviço." },
        { word: "APLICATIVO", clue: "Programa instalado em celular ou computador." },
        { word: "DIGITAL", clue: "Relativo a dados representados por números." },
        { word: "CONEXAO", clue: "Ligação entre dispositivos ou redes." },
      ],
    },
    {
      id: "artes",
      title: "Artes",
      subtitle: "Artes · 6º ao 9º ano",
      words: [
        { word: "PINTURA", clue: "Obra feita com tintas sobre uma superfície." },
        { word: "ESCULTURA", clue: "Obra tridimensional modelada ou esculpida." },
        { word: "DESENHO", clue: "Representação gráfica feita com linhas e traços." },
        { word: "MUSICA", clue: "Arte organizada por sons e ritmos." },
        { word: "TEATRO", clue: "Arte de representar histórias para um público." },
        { word: "DANCA", clue: "Arte de expressar-se por movimentos do corpo." },
        { word: "POESIA", clue: "Texto artístico organizado em versos." },
        { word: "PINCEL", clue: "Ferramenta usada para aplicar tinta." },
        { word: "PALETA", clue: "Superfície onde o pintor mistura tintas." },
        { word: "GALERIA", clue: "Espaço que expõe obras de arte." },
      ],
    },
    {
      id: "musica",
      title: "Música",
      subtitle: "Artes · 6º ao 9º ano",
      words: [
        { word: "MELODIA", clue: "Sequência de notas que forma uma ideia musical." },
        { word: "HARMONIA", clue: "Combinação de sons simultâneos." },
        { word: "RITMO", clue: "Organização dos sons no tempo." },
        { word: "COMPASSO", clue: "Divisão do tempo musical em partes iguais." },
        { word: "INSTRUMENTO", clue: "Objeto usado para produzir som musical." },
        { word: "VIOLAO", clue: "Instrumento de cordas muito usado no Brasil." },
        { word: "BATERIA", clue: "Conjunto de tambores e pratos." },
        { word: "FLAUTA", clue: "Instrumento de sopro com tubo e orifícios." },
        { word: "PARTITURA", clue: "Escrita que representa os sons de uma música." },
        { word: "ACORDE", clue: "Conjunto de três ou mais notas tocadas juntas." },
      ],
    },
    {
      id: "literatura",
      title: "Literatura",
      subtitle: "Português · 6º ao 9º ano",
      words: [
        { word: "ROMANCE", clue: "Narrativa longa com personagens e enredo." },
        { word: "POEMA", clue: "Texto organizado em versos." },
        { word: "CONTO", clue: "Narrativa curta com poucos personagens." },
        { word: "CRONICA", clue: "Texto curto sobre fatos do cotidiano." },
        { word: "PERSONAGEM", clue: "Ser que age na narrativa." },
        { word: "NARRADOR", clue: "Voz que conta a história." },
        { word: "ENREDO", clue: "Sequência de acontecimentos de uma narrativa." },
        { word: "ESTROFE", clue: "Conjunto de versos de um poema." },
        { word: "FABULA", clue: "Narrativa curta com animais e moral." },
        { word: "LENDA", clue: "História tradicional transmitida oralmente." },
      ],
    },
    {
      id: "projeto-de-vida",
      title: "Projeto de Vida",
      subtitle: "Projeto de vida · 6º ao 9º ano",
      words: [
        { word: "SONHO", clue: "Desejo que orienta escolhas e planos." },
        { word: "OBJETIVO", clue: "Resultado que se pretende alcançar." },
        { word: "METAS", clue: "Etapas concretas para alcançar um objetivo." },
        { word: "FUTURO", clue: "Tempo que ainda está por vir." },
        { word: "CARREIRA", clue: "Trajetória profissional de uma pessoa." },
        { word: "ESCOLHA", clue: "Decisão entre possibilidades." },
        { word: "DECISAO", clue: "Ato de escolher um caminho." },
        { word: "CAMINHO", clue: "Percurso seguido para alcançar um objetivo." },
        { word: "VALORES", clue: "Princípios que orientam a conduta." },
        { word: "PROPOSITO", clue: "Razão que dá sentido às escolhas." },
        { word: "PROTAGONISMO", clue: "Atitude de ser autor da própria história." },
      ],
    },
    {
      id: "cidadania",
      title: "Cidadania",
      subtitle: "História e projeto de vida · 6º ao 9º ano",
      words: [
        { word: "CIDADANIA", clue: "Exercício de direitos e deveres na sociedade." },
        { word: "DIREITOS", clue: "Garantias reconhecidas às pessoas." },
        { word: "DEVERES", clue: "Obrigações de cada pessoa na sociedade." },
        { word: "VOTAR", clue: "Escolher representantes por meio de eleição." },
        { word: "DEMOCRACIA", clue: "Governo em que o povo participa das decisões." },
        { word: "IGUALDADE", clue: "Tratamento justo entre todas as pessoas." },
        { word: "RESPEITO", clue: "Consideração pelas diferenças e pelos direitos dos outros." },
        { word: "SOLIDARIEDADE", clue: "Apoio às pessoas em situação de necessidade." },
        { word: "PARTICIPACAO", clue: "Envolvimento nas decisões da comunidade." },
        { word: "COMUNIDADE", clue: "Grupo de pessoas que convivem em um mesmo lugar." },
      ],
    },
    {
      id: "saude-bem-estar",
      title: "Saúde e Bem-Estar",
      subtitle: "Ciências e projeto de vida · 6º ao 9º ano",
      words: [
        { word: "SAUDE", clue: "Estado de equilíbrio físico, mental e social." },
        { word: "HIGIENE", clue: "Cuidados que previnem doenças." },
        { word: "VACINA", clue: "Substância que estimula a imunidade." },
        { word: "EXERCICIO", clue: "Atividade física praticada regularmente." },
        { word: "ALIMENTACAO", clue: "Conjunto de alimentos consumidos diariamente." },
        { word: "DORMIR", clue: "Repouso necessário para recuperar as energias." },
        { word: "NUTRICAO", clue: "Processo de obtenção de nutrientes pelo corpo." },
        { word: "PREVENCAO", clue: "Medidas para evitar doenças." },
        { word: "BEMESTAR", clue: "Estado de conforto físico e emocional." },
        { word: "EQUILIBRIO", clue: "Harmonia entre corpo, mente e rotina." },
      ],
    },
    {
      id: "povos-indigenas",
      title: "Povos Indígenas",
      subtitle: "História e geografia · 6º ao 9º ano",
      words: [
        { word: "INDIGENA", clue: "Pessoa pertencente aos povos originários do Brasil." },
        { word: "ALDEIA", clue: "Comunidade indígena tradicional." },
        { word: "CULTURA", clue: "Conjunto de costumes, saberes e expressões de um povo." },
        { word: "TERRITORIO", clue: "Área ocupada e utilizada por um povo." },
        { word: "LINGUA", clue: "Sistema de comunicação de um povo." },
        { word: "ARTESANATO", clue: "Produção manual de objetos tradicionais." },
        { word: "RITUAL", clue: "Cerimônia com significado cultural." },
        { word: "ANCESTRAL", clue: "Relativo aos antepassados de um povo." },
        { word: "SABEDORIA", clue: "Conhecimento acumulado e transmitido pela tradição." },
        { word: "FLORESTA", clue: "Ambiente essencial para muitos povos indígenas." },
      ],
    },
    {
      id: "folclore",
      title: "Folclore Brasileiro",
      subtitle: "Artes e cultura · 6º ao 9º ano",
      words: [
        { word: "FOLCLORE", clue: "Conjunto de lendas, festas e saberes populares." },
        { word: "CURUPIRA", clue: "Personagem que protege a floresta." },
        { word: "BOITATA", clue: "Serpente de fogo do folclore." },
        { word: "LOBISOMEM", clue: "Homem que se transforma em lobo nas noites de lua cheia." },
        { word: "LENDA", clue: "História tradicional contada de geração em geração." },
        { word: "FESTA", clue: "Celebração popular com música, dança e comida." },
        { word: "PERSONAGEM", clue: "Ser que protagoniza uma lenda." },
        { word: "ENCANTADO", clue: "Ser mágico que habita as histórias populares." },
        { word: "TRADICAO", clue: "Costume transmitido entre gerações." },
        { word: "BRINCADEIRA", clue: "Atividade lúdica tradicional da infância." },
      ],
    },
    {
      id: "esportes",
      title: "Esportes",
      subtitle: "Educação física · 6º ao 9º ano",
      words: [
        { word: "ESPORTE", clue: "Atividade física com regras e competição." },
        { word: "FUTEBOL", clue: "Esporte mais popular do Brasil." },
        { word: "VOLEI", clue: "Esporte jogado com bola e rede." },
        { word: "BASQUETE", clue: "Esporte em que se arremessa a bola na cesta." },
        { word: "ATLETISMO", clue: "Conjunto de provas de corrida, salto e arremesso." },
        { word: "NATACAO", clue: "Esporte praticado na água." },
        { word: "GINASTICA", clue: "Esporte com movimentos corporais e acrobacias." },
        { word: "TREINO", clue: "Preparação física para melhorar o desempenho." },
        { word: "EQUIPE", clue: "Grupo que joga junto em busca de um objetivo." },
        { word: "DISCIPLINA", clue: "Compromisso e constância nos treinos." },
      ],
    },
    {
      id: "energias-renovaveis",
      title: "Energias Renováveis",
      subtitle: "Ciências e geografia · 7º ao 9º ano",
      words: [
        { word: "SOLAR", clue: "Energia obtida da luz do Sol." },
        { word: "EOLICA", clue: "Energia gerada pelo vento." },
        { word: "HIDRELETRICA", clue: "Energia gerada pela força da água." },
        { word: "BIOMASSA", clue: "Energia obtida de matéria orgânica." },
        { word: "RENOVAVEL", clue: "Fonte que se repõe naturalmente." },
        { word: "SUSTENTAVEL", clue: "Que atende às necessidades sem esgotar recursos." },
        { word: "TURBINA", clue: "Equipamento que gera energia a partir de vento ou água." },
        { word: "PAINEL", clue: "Placa que capta a luz solar." },
        { word: "NATUREZA", clue: "Conjunto de recursos e seres do ambiente." },
        { word: "RECICLAR", clue: "Reaproveitar materiais para novos produtos." },
      ],
    },
    {
      id: "alimentacao-saudavel",
      title: "Alimentação Saudável",
      subtitle: "Ciências e saúde · 6º ao 9º ano",
      words: [
        { word: "FRUTA", clue: "Alimento natural rico em vitaminas." },
        { word: "LEGUME", clue: "Vegetal usado em saladas e cozidos." },
        { word: "VERDURA", clue: "Folhas e hortaliças consumidas na alimentação." },
        { word: "PROTEINA", clue: "Nutriente que ajuda na construção dos músculos." },
        { word: "VITAMINA", clue: "Nutriente essencial para a saúde." },
        { word: "CARBOIDRATO", clue: "Nutriente que fornece energia ao corpo." },
        { word: "FIBRA", clue: "Parte vegetal que auxilia a digestão." },
        { word: "NUTRICAO", clue: "Processo de obtenção de nutrientes." },
        { word: "SAUDAVEL", clue: "Que faz bem à saúde." },
        { word: "EQUILIBRIO", clue: "Harmonia entre os diferentes alimentos." },
      ],
    },
  ];

  var DIRS = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
    [0, -1],
    [-1, 0],
    [-1, -1],
    [-1, 1],
  ];

  var DIAGONAL_DIRS = DIRS.filter(function (dir) {
    return dir[0] !== 0 && dir[1] !== 0;
  });

  var STRAIGHT_DIRS = DIRS.filter(function (dir) {
    return dir[0] === 0 || dir[1] === 0;
  });

  var state = {
    puzzleIndex: 0,
    size: MIN_SIZE,
    grid: [],
    placed: [],
    found: new Set(),
    anchor: null,
    preview: [],
    dragging: false,
    startedAt: null,
    timerId: null,
    finished: false,
  };

  var els = {
    title: document.getElementById("puzzle-title"),
    subtitle: document.getElementById("puzzle-subtitle"),
    select: document.getElementById("puzzle-select"),
    restart: document.getElementById("restart"),
    grid: document.getElementById("grid"),
    progress: document.getElementById("progress"),
    timer: document.getElementById("timer"),
    wordList: document.getElementById("word-list"),
    cluesCount: document.getElementById("clues-count"),
    win: document.getElementById("win"),
    winText: document.getElementById("win-text"),
    winTime: document.getElementById("win-time"),
    winWords: document.getElementById("win-words"),
    playAgain: document.getElementById("play-again"),
    nextTheme: document.getElementById("next-theme"),
  };

  function normalize(word) {
    return word
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^A-Za-z]/g, "")
      .toUpperCase();
  }

  function gridSize(words) {
    var longest = 0;
    for (var i = 0; i < words.length; i++) {
      longest = Math.max(longest, normalize(words[i].word).length);
    }
    return Math.min(MAX_SIZE, Math.max(MIN_SIZE, longest + 1));
  }

  function shuffle(items) {
    var copy = items.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = copy[i];
      copy[i] = copy[j];
      copy[j] = temp;
    }
    return copy;
  }

  function findSpot(grid, word, preferDiagonal, size) {
    var positions = [];
    for (var r = 0; r < size; r++) {
      for (var c = 0; c < size; c++) positions.push([r, c]);
    }
    var shuffledPositions = shuffle(positions);
    var shuffledDirs = preferDiagonal
      ? shuffle(DIAGONAL_DIRS).concat(shuffle(STRAIGHT_DIRS))
      : shuffle(DIRS);

    for (var p = 0; p < shuffledPositions.length; p++) {
      for (var d = 0; d < shuffledDirs.length; d++) {
        var dr = shuffledDirs[d][0];
        var dc = shuffledDirs[d][1];
        var endR = shuffledPositions[p][0] + dr * (word.length - 1);
        var endC = shuffledPositions[p][1] + dc * (word.length - 1);
        if (endR < 0 || endR >= size || endC < 0 || endC >= size) continue;

        var cells = [];
        var fits = true;
        var fresh = 0;

        for (var i = 0; i < word.length; i++) {
          var rr = shuffledPositions[p][0] + dr * i;
          var cc = shuffledPositions[p][1] + dc * i;
          var current = grid[rr][cc];
          if (current && current !== word[i]) {
            fits = false;
            break;
          }
          if (!current) fresh++;
          cells.push([rr, cc]);
        }

        if (fits && fresh >= Math.ceil(word.length * 0.6)) {
          return { cells: cells };
        }
      }
    }

    return null;
  }

  function makeGrid(words, size) {
    for (var attempt = 0; attempt < 120; attempt++) {
      var grid = [];
      for (var r = 0; r < size; r++) {
        grid.push(new Array(size).fill(""));
      }

      var ordered = words.slice().sort(function (a, b) {
        return normalize(b.word).length - normalize(a.word).length;
      });

      var placed = [];
      var ok = true;

      for (var i = 0; i < ordered.length; i++) {
        var item = ordered[i];
        var word = normalize(item.word);
        var spot = findSpot(grid, word, i % 2 === 0, size);

        if (!spot) {
          ok = false;
          break;
        }

        var diagonal =
          spot.cells[0][0] !== spot.cells[1][0] &&
          spot.cells[0][1] !== spot.cells[1][1];

        for (var k = 0; k < spot.cells.length; k++) {
          grid[spot.cells[k][0]][spot.cells[k][1]] = word[k];
        }

        placed.push({
          word: word,
          clue: item.clue,
          cells: spot.cells,
          color: i % COLORS.length,
          diagonal: diagonal,
        });
      }

      if (ok) {
        var diagonalCount = 0;
        for (var j = 0; j < placed.length; j++) {
          if (placed[j].diagonal) diagonalCount++;
        }

        if (diagonalCount < Math.min(3, Math.ceil(ordered.length / 3))) {
          continue;
        }

        var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (var row = 0; row < size; row++) {
          for (var col = 0; col < size; col++) {
            if (!grid[row][col]) {
              grid[row][col] = alphabet[Math.floor(Math.random() * alphabet.length)];
            }
          }
        }
        return { grid: grid, placed: placed };
      }
    }

    return null;
  }

  function cellEl(pos) {
    return els.grid.querySelector(
      '.cell[data-r="' + pos[0] + '"][data-c="' + pos[1] + '"]'
    );
  }

  function same(a, b) {
    return a && b && a[0] === b[0] && a[1] === b[1];
  }

  function lineBetween(a, b) {
    var dr = b[0] - a[0];
    var dc = b[1] - a[1];
    var adr = Math.abs(dr);
    var adc = Math.abs(dc);

    if (!(dr === 0 || dc === 0 || adr === adc)) return [];

    var steps = Math.max(adr, adc);
    var sr = Math.sign(dr);
    var sc = Math.sign(dc);
    var cells = [];

    for (var i = 0; i <= steps; i++) {
      cells.push([a[0] + sr * i, a[1] + sc * i]);
    }

    return cells;
  }

  function clearPreview() {
    for (var i = 0; i < state.preview.length; i++) {
      var el = cellEl(state.preview[i]);
      if (el) el.classList.remove("is-preview");
    }
  }

  function setPreview(cells) {
    clearPreview();
    state.preview = cells;
    for (var i = 0; i < cells.length; i++) {
      var el = cellEl(cells[i]);
      if (el) el.classList.add("is-preview");
    }
  }

  function clearSelection() {
    clearPreview();
    state.preview = [];
    state.anchor = null;
  }

  function flashWrong(cells) {
    for (var i = 0; i < cells.length; i++) {
      var el = cellEl(cells[i]);
      if (!el) continue;
      el.classList.add("is-wrong");
      window.setTimeout(
        (function (node) {
          return function () {
            node.classList.remove("is-wrong");
          };
        })(el),
        420
      );
    }
  }

  function updateHud() {
    var total = state.placed.length;
    var found = state.found.size;
    els.progress.textContent = found + " de " + total + " palavras";
    els.cluesCount.textContent = found + "/" + total;
  }

  function formatTime(ms) {
    var total = Math.floor(ms / 1000);
    var minutes = Math.floor(total / 60);
    var seconds = total % 60;
    return (
      (minutes < 10 ? "0" : "") +
      minutes +
      ":" +
      (seconds < 10 ? "0" : "") +
      seconds
    );
  }

  function elapsed() {
    return state.startedAt ? Date.now() - state.startedAt : 0;
  }

  function startTimer() {
    if (state.startedAt || state.finished) return;
    state.startedAt = Date.now();
    state.timerId = window.setInterval(function () {
      els.timer.textContent = formatTime(elapsed());
    }, 250);
  }

  function stopTimer() {
    if (state.timerId) {
      window.clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  function markFound(item) {
    var color = COLORS[item.color % COLORS.length];
    for (var i = 0; i < item.cells.length; i++) {
      var el = cellEl(item.cells[i]);
      if (!el) continue;
      el.classList.add("is-found");
      el.style.setProperty("--found-color", color);
    }

    var wordEl = els.wordList.querySelector('[data-word="' + item.word + '"]');
    if (wordEl) {
      wordEl.classList.add("is-found");
      wordEl.style.setProperty("--found-color", color);
    }
  }

  function commitSelection() {
    var cells = state.preview.slice();
    if (cells.length < 2) return;

    var text = cells
      .map(function (pos) {
        return state.grid[pos[0]][pos[1]];
      })
      .join("");

    var reversed = text.split("").reverse().join("");
    var match = null;

    for (var i = 0; i < state.placed.length; i++) {
      var item = state.placed[i];
      if (!state.found.has(item.word) && (item.word === text || item.word === reversed)) {
        match = item;
        break;
      }
    }

    if (match) {
      state.found.add(match.word);
      markFound(match);
      updateHud();
      clearSelection();

      if (state.found.size === state.placed.length) {
        finish();
      }
    } else {
      flashWrong(cells);
      clearSelection();
    }
  }

  function finish() {
    state.finished = true;
    stopTimer();
    var timeMs = elapsed();

    els.winTime.textContent = formatTime(timeMs);
    els.winWords.textContent = String(state.placed.length);
    els.winText.textContent =
      "Você encontrou as " + state.placed.length + " palavras do tema.";
    els.win.hidden = false;
    els.playAgain.focus();

    window.parent.postMessage(
      {
        type: "vrgame:finish",
        score: state.found.size,
        maxScore: state.placed.length,
        timeMs: timeMs,
        detail: { puzzle: PUZZLES[state.puzzleIndex].id },
      },
      "*"
    );
  }

  function renderGrid() {
    els.grid.innerHTML = "";
    els.grid.style.setProperty("--grid-size", String(state.size));
    var fragment = document.createDocumentFragment();

    for (var r = 0; r < state.size; r++) {
      for (var c = 0; c < state.size; c++) {
        var button = document.createElement("button");
        button.type = "button";
        button.className = "cell";
        button.dataset.r = String(r);
        button.dataset.c = String(c);
        button.textContent = state.grid[r][c];
        button.setAttribute(
          "aria-label",
          "Linha " + (r + 1) + ", coluna " + (c + 1) + ": " + state.grid[r][c]
        );
        fragment.appendChild(button);
      }
    }

    els.grid.appendChild(fragment);
  }

  function renderWords() {
    els.wordList.innerHTML = "";
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < state.placed.length; i++) {
      var item = state.placed[i];
      var li = document.createElement("li");
      li.className = "word";
      li.dataset.word = item.word;
      li.dataset.diagonal = item.diagonal ? "true" : "false";

      var text = document.createElement("span");
      text.className = "word-text";
      text.textContent = item.word;

      var clue = document.createElement("span");
      clue.className = "word-clue";
      clue.textContent = item.clue;

      li.appendChild(text);
      li.appendChild(clue);
      fragment.appendChild(li);
    }

    els.wordList.appendChild(fragment);
  }

  function hideWin() {
    els.win.hidden = true;
  }

  var lastHeight = 0;

  function reportHeight() {
    var height = Math.ceil(document.body.getBoundingClientRect().height);
    if (Math.abs(height - lastHeight) < 4) return;
    lastHeight = height;
    window.parent.postMessage({ type: "vrgame:resize", height: height }, "*");
  }

  function loadPuzzle(index) {
    stopTimer();
    state.puzzleIndex = index;
    state.found = new Set();
    state.anchor = null;
    state.preview = [];
    state.dragging = false;
    state.startedAt = null;
    state.finished = false;
    els.timer.textContent = "00:00";
    hideWin();

    var puzzle = PUZZLES[index];
    var size = gridSize(puzzle.words);
    var built = makeGrid(puzzle.words, size);

    if (!built) {
      els.title.textContent = "Não foi possível montar a grade";
      els.subtitle.textContent = "Recarregue a página para tentar novamente.";
      return;
    }

    state.size = size;
    state.grid = built.grid;
    state.placed = built.placed;

    els.title.textContent = puzzle.title;
    els.subtitle.textContent = puzzle.subtitle;
    els.select.value = String(index);

    renderGrid();
    renderWords();
    updateHud();
    window.requestAnimationFrame(reportHeight);
  }

  function cellFromEvent(event) {
    var target = event.target;
    if (!target || !target.closest) return null;
    var cell = target.closest(".cell");
    if (!cell) return null;
    return [Number(cell.dataset.r), Number(cell.dataset.c)];
  }

  function cellFromPoint(x, y) {
    var el = document.elementFromPoint(x, y);
    if (!el || !el.closest) return null;
    var cell = el.closest(".cell");
    if (!cell) return null;
    return [Number(cell.dataset.r), Number(cell.dataset.c)];
  }

  function handlePick(pos) {
    if (state.finished) return;
    startTimer();

    if (!state.anchor) {
      state.anchor = pos;
      setPreview([pos]);
      return;
    }

    if (same(state.anchor, pos)) {
      clearSelection();
      return;
    }

    var line = lineBetween(state.anchor, pos);
    if (line.length === 0) {
      state.anchor = pos;
      setPreview([pos]);
      return;
    }

    setPreview(line);
    commitSelection();
  }

  function onPointerDown(event) {
    if (state.finished) return;
    var pos = cellFromEvent(event);
    if (!pos) return;

    event.preventDefault();
    startTimer();

    if (!state.anchor) {
      state.anchor = pos;
      state.dragging = true;
      setPreview([pos]);
      return;
    }

    if (same(state.anchor, pos)) {
      clearSelection();
      return;
    }

    state.dragging = true;
    var line = lineBetween(state.anchor, pos);
    if (line.length === 0) {
      state.anchor = pos;
      setPreview([pos]);
      return;
    }

    setPreview(line);
  }

  function onPointerMove(event) {
    if (!state.dragging || !state.anchor) return;
    var pos = cellFromPoint(event.clientX, event.clientY);
    if (!pos) return;
    var line = lineBetween(state.anchor, pos);
    if (line.length > 0) setPreview(line);
  }

  function onPointerUp() {
    if (!state.dragging) return;
    state.dragging = false;
    if (state.preview.length >= 2) commitSelection();
  }

  function onGridClick(event) {
    // Teclado (Enter/Espaço) dispara click com detail 0.
    if (event.detail !== 0) return;
    var pos = cellFromEvent(event);
    if (!pos) return;
    handlePick(pos);
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

  function notifyRestart() {
    window.parent.postMessage({ type: "vrgame:restart" }, "*");
  }

  function init() {
    var options = document.createDocumentFragment();
    for (var i = 0; i < PUZZLES.length; i++) {
      var option = document.createElement("option");
      option.value = String(i);
      option.textContent = PUZZLES[i].title;
      options.appendChild(option);
    }
    els.select.appendChild(options);

    els.grid.addEventListener("pointerdown", onPointerDown);
    els.grid.addEventListener("pointermove", onPointerMove);
    els.grid.addEventListener("click", onGridClick);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    els.select.addEventListener("change", function () {
      notifyRestart();
      loadPuzzle(Number(els.select.value));
    });

    els.restart.addEventListener("click", function () {
      notifyRestart();
      loadPuzzle(state.puzzleIndex);
    });

    els.playAgain.addEventListener("click", function () {
      notifyRestart();
      loadPuzzle(state.puzzleIndex);
    });

    els.nextTheme.addEventListener("click", function () {
      notifyRestart();
      loadPuzzle((state.puzzleIndex + 1) % PUZZLES.length);
    });

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

    loadPuzzle(0);
    window.addEventListener("resize", reportHeight);
    if ("ResizeObserver" in window) {
      new ResizeObserver(reportHeight).observe(document.body);
    }
    window.parent.postMessage({ type: "vrgame:ready" }, "*");
  }

  init();
})();
