# Como criar seu jogo

Este guia é para estudantes. A pasta-modelo já tem um jogo funcionando: você vai trocar o conteúdo e as regras.

## Antes de começar

Você precisa de:

- um navegador (Chrome, Edge ou Firefox);
- um editor de texto (VS Code, Notepad++ ou até o Bloco de Notas);
- a pasta-modelo baixada do site (`modelo-jogo.zip`).

Não precisa de conta, internet durante o jogo, servidor ou framework.

## 1. Copie a pasta

Renomeie a cópia com o nome do seu jogo, sem espaços e sem acentos. Exemplos:

- `caca-palavras-biomas`
- `quiz-fracoes`
- `memoria-corpo-humano`

O nome da pasta precisa ser igual ao campo `slug` do `manifest.json`.

## 2. Preencha o manifest

```json
{
  "slug": "meu-jogo",
  "title": "Nome do meu jogo",
  "author": "Seu nome",
  "authorClass": "Sua turma",
  "discipline": "Matemática",
  "grades": ["6º", "7º"],
  "tags": ["frações", "quiz"],
  "description": "Uma frase que explica o que o jogo ensina.",
  "instructions": "Como jogar, em uma ou duas frases.",
  "duration": 5,
  "version": "1.0.0",
  "entry": "index.html",
  "cover": "cover.svg",
  "createdAt": "2026-11-02"
}
```

Regras:

- `slug`: igual ao nome da pasta, em minúsculas e com hífen.
- `grades`: lista de séries, por exemplo `["6º", "7º"]`.
- `duration`: tempo médio em minutos.
- `cover`: imagem 16:9. Pode ser `.svg`, `.png` ou `.jpg`.
- `version`: comece em `1.0.0` e aumente a cada entrega.

## 3. Troque o conteúdo

Abra `game.js`. No topo existe um objeto `CONFIG` e, mais abaixo, os dados do jogo. Comece pelo mais fácil:

1. Troque o título.
2. Troque as perguntas, palavras ou alvos.
3. Troque as cores no `style.css`.
4. Só depois mude a regra (tempo, número de rodadas, dificuldade).

## 4. Comunique o resultado ao portal

O portal precisa saber duas coisas: que o jogo carregou e que a partida terminou.

```js
// ao carregar
window.parent.postMessage({ type: "vrgame:ready" }, "*");

// ao terminar
window.parent.postMessage(
  {
    type: "vrgame:finish",
    score: 8,
    maxScore: 10,
    timeMs: 95000
  },
  "*"
);
```

Se o seu jogo não envia `vrgame:finish`, o portal não mostra a pontuação.

## 5. Teste de verdade

- Abra o `index.html` no navegador.
- Abra o console (F12) e veja se aparece algum erro em vermelho.
- Jogue no celular.
- Jogue só com o teclado.
- Peça para um colega jogar sem explicar nada. Se ele travar, a instrução precisa melhorar.

## 6. Entregue

1. Compacte a pasta em `.zip`.
2. Envie pelo Google Classroom, Google Drive ou pendrive.
3. O professor revisa com o checklist e publica.
4. Se aprovado, o jogo aparece no catálogo com seu nome e sua turma.

## Checklist

Técnico:

- [ ] abre sem erro no console;
- [ ] funciona no celular e no computador;
- [ ] dá para jogar só com o teclado;
- [ ] não usa internet, login ou biblioteca externa;
- [ ] envia `vrgame:ready` e `vrgame:finish`;
- [ ] capa em 16:9 e manifest preenchido.

Pedagógico:

- [ ] o conteúdo está correto e adequado à série;
- [ ] a regra cabe em uma frase;
- [ ] o jogo ensina algo, não só testa memória;
- [ ] o erro explica o porquê;
- [ ] a partida dura entre 3 e 8 minutos;
- [ ] os créditos estão corretos.

## Ideias para começar

- Quiz de revisão com explicação depois de errar.
- Jogo da memória de conceitos e definições.
- Associação entre colunas (país e capital, órgão e função).
- Linha do tempo para ordenar eventos.
- Caça-palavras com dicas.
- Simulação simples de escolhas com consequências.

## Rubrica

| Critério | Peso |
| --- | --- |
| Jogabilidade | 25% |
| Correção do conteúdo | 25% |
| Acessibilidade | 20% |
| Qualidade do código | 15% |
| Originalidade | 15% |

## Problemas comuns

**O jogo não aparece no catálogo.**
Confira se o `slug` é igual ao nome da pasta e se o manifest não tem erro de vírgula.

**A pontuação não aparece no portal.**
Falta o `postMessage` de `vrgame:finish`.

**O jogo quebra no celular.**
Verifique larguras fixas em pixels e use `max-width: 100%`.

**O jogo ficou escuro sem eu pedir.**
O portal envia o tema por mensagem. Use as variáveis de cor do `style.css` em vez de cores fixas.
