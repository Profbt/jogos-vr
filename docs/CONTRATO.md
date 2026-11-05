# Contrato técnico dos jogos

O portal abre cada jogo em um `<iframe sandbox="allow-scripts">`. Isso significa que o jogo roda em uma origem opaca: ele não acessa o DOM do portal, cookies, `localStorage` do site ou a sessão de quem joga.

A comunicação é feita apenas por `postMessage`.

## Mensagens do jogo para o portal

### `vrgame:ready`

Enviada quando o jogo termina de carregar.

```js
window.parent.postMessage({ type: "vrgame:ready" }, "*");
```

### `vrgame:finish`

Enviada quando a partida termina.

```js
window.parent.postMessage(
  {
    type: "vrgame:finish",
    score: 8,
    maxScore: 10,
    timeMs: 95000,
    detail: { level: 2 }
  },
  "*"
);
```

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `type` | string | sim | `"vrgame:finish"` |
| `score` | number | sim | Pontuação obtida |
| `maxScore` | number | sim | Pontuação máxima possível |
| `timeMs` | number | não | Duração da partida em milissegundos |
| `detail` | object | não | Dados livres para depuração |

### `vrgame:restart`

Opcional. Avisa o portal que o jogo recomeçou internamente (por exemplo, no botão “Jogar de novo”). O portal limpa a barra de resultado anterior.

```js
window.parent.postMessage({ type: "vrgame:restart" }, "*");
```

### `vrgame:resize`

Opcional. Avisa o portal qual é a altura real do jogo, para o iframe se ajustar sem barras de rolagem internas.

```js
window.parent.postMessage(
  { type: "vrgame:resize", height: document.body.getBoundingClientRect().height },
  "*"
);
```

Envie depois de renderizar a tela e quando o layout mudar (troca de fase, teclado na tela, etc.). O portal limita a altura entre 460 e 2200 pixels no desktop e 3600 pixels em telas estreitas.

## Mensagens do portal para o jogo

### `vrgame:theme`

Enviada ao carregar e quando o usuário troca o tema.

```js
window.addEventListener("message", (event) => {
  if (event.data?.type === "vrgame:theme") {
    document.documentElement.dataset.theme = event.data.theme; // "light" | "dark"
  }
});
```

### `vrgame:fullscreen`

Enviada quando o jogo entra ou sai da tela cheia. Use para aumentar fontes, grade ou teclado e aproveitar melhor o espaço.

```js
window.addEventListener("message", (event) => {
  if (event.data?.type === "vrgame:fullscreen") {
    document.documentElement.classList.toggle(
      "is-fullscreen",
      Boolean(event.data.fullscreen)
    );
  }
});
```

## Manifest

Arquivo `manifest.json` na raiz da pasta do jogo.

| Campo | Tipo | Obrigatório | Regra |
| --- | --- | --- | --- |
| `slug` | string | sim | Igual ao nome da pasta, minúsculo com hífen |
| `title` | string | sim | Até 60 caracteres |
| `author` | string | recomendado | Nome do estudante ou equipe |
| `authorClass` | string | recomendado | Turma |
| `discipline` | string | sim | Uma disciplina ou `Interdisciplinar` |
| `grades` | string[] | sim | Pelo menos uma série |
| `tags` | string[] | não | Até 6 palavras-chave |
| `description` | string | sim | Uma frase, até 160 caracteres |
| `instructions` | string | sim | Como jogar, até 240 caracteres |
| `duration` | number | sim | Minutos |
| `version` | string | recomendado | Semver, ex.: `1.0.0` |
| `entry` | string | sim | Normalmente `index.html` |
| `cover` | string | não | Padrão `cover.svg`, proporção 16:9 |
| `featured` | boolean | não | Destaque no catálogo |
| `order` | number | não | Ordem entre os destaques |
| `createdAt` | string | não | `AAAA-MM-DD` |
| `status` | string | não | `draft` esconde do catálogo |

## Segurança

- iframe com `sandbox="allow-scripts"`, sem `allow-same-origin`.
- CSP em `/games/*`: `default-src 'self'`, `connect-src 'none'`, `form-action 'none'`.
- Sem `eval`, sem script inline, sem recurso externo.
- Nenhum dado pessoal de quem joga é coletado.
- Publicação somente após revisão do professor.

## Limites

- Um jogo por pasta.
- Arquivos servidos estaticamente; não há backend.
- `localStorage` pode estar bloqueado pela sandbox. Use `try/catch` e trate como opcional.
- O jogo deve funcionar sem internet depois de carregado.
- Tamanho recomendado da pasta: até 10 MB.

## Acessibilidade

- Navegação completa por teclado.
- Foco visível.
- Contraste mínimo AA.
- Não depender só de cor para transmitir informação.
- Textos alternativos em imagens.
- Respeitar `prefers-reduced-motion`.
