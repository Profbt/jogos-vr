# Tecla Certa — especificação do jogo de digitação

Data: 2026-11-03
Status: aprovado para implementação

> **Nota histórica:** este documento descreve a versão inicial, com 3 níveis e 4 temas. O jogo hoje tem 10 temas, 4 níveis e até 12 estrelas. Consulte `2026-11-03-tecla-certa-ux-repertorio.md` para a versão atual.

## 1. Contexto

O portal Jogos VR tem dois jogos publicados: um caça-palavras e um clone de Wordle. Falta um jogo que ensine digitação, habilidade cobrada em avaliações e no uso cotidiano do computador.

A referência é o typing.com/br, mas o portal é aberto, sem login, sem banco de dados e com jogos estáticos dentro de um iframe `sandbox="allow-scripts"`. A proposta não copia a plataforma: aproveita a ideia de lição curta, feedback por tecla e métricas de precisão e velocidade.

## 2. Objetivos

- Ensinar a posição dos dedos e a digitar sem olhar para o teclado.
- Reforçar conteúdo escolar de quatro disciplinas.
- Oferecer uma partida curta, de 3 a 5 minutos, rejogável.
- Funcionar sem internet, sem biblioteca externa e sem armazenar dados pessoais.
- Reportar o resultado ao portal pelo contrato `vrgame:*`.

## 3. Fora do escopo

- Contas, login, ranking online e relatório para professor.
- Histórico entre visitas; `localStorage` é bloqueado pela sandbox.
- Teclado virtual clicável no celular.
- Competição entre alunos.
- Lições personalizadas pelo professor.

## 4. Público e uso

- Estudantes do 6º ao 9º ano.
- Uso principal no computador, com teclado físico.
- No celular, o jogo funciona com o teclado nativo e mostra um aviso curto recomendando o computador, sem bloquear.
- Uma partida = um tema + três níveis.

## 5. Fluxo

1. **Início.** Título, explicação em uma frase e quatro cartões de tema. Cada cartão mostra nome, disciplina e uma amostra do conteúdo.
2. **Preparação do nível.** Mostra tema, “Nível 1 de 3”, o que será digitado e as metas de estrelas. Botão “Começar nível”. Link “Trocar tema”.
3. **Jogo.** Texto para digitar, cursor, placar ao vivo e teclado virtual. O cronômetro começa na primeira tecla.
4. **Resultado do nível.** Estrelas, PPM, precisão e tempo. Botão “Próximo nível”. No nível 3, o botão é “Ver resultado”.
5. **Resultado final.** Total de estrelas (0–9), tabela com os três níveis e botões “Jogar de novo” (mesmo tema) e “Trocar tema”. Envia `vrgame:finish`.

O jogador não pode pular nível: só avança depois de concluir o texto.

## 6. Níveis e regras

| Nível | Texto | Ajuda visual | Comportamento do erro |
| --- | --- | --- | --- |
| 1 | Palavras curtas, sem acento | Teclado grande, próxima tecla e dedo destacados | Bloqueia: o cursor não avança até a tecla certa |
| 2 | Palavras médias com acento e ç | Teclado com próxima tecla; legenda de dedos menor | Bloqueia e conta o erro na precisão |
| 3 | Frase curta do tema | Apenas a próxima tecla | Marca o erro e avança, derrubando a precisão |

Regras gerais:

- Letras são comparadas sem diferenciar maiúsculas de minúsculas: `A` e `a` valem para `A`. O jogador não precisa usar Shift.
- Acentos, cedilha, espaço e pontuação são comparados exatamente.
- Backspace é desativado. No nível 3, não há correção.
- Teclas de controle (`Shift`, `Ctrl`, `Alt`, `Meta`, `Tab`, setas) não contam como erro.
- Acentos por tecla morta não contam como erro enquanto a composição não termina.
- Um erro no nível 1 ou 2 fica sublinhado até a tecla correta. No nível 3, a posição errada fica sublinhada e o cursor avança.
- Ao concluir a última letra, o nível termina imediatamente.

## 7. Métricas e pontuação

### 7.1 Precisão

`precisão = caracteres corretos ÷ tentativas × 100`, arredondada para inteiro.

- Tentativa = cada caractere processado, certo ou errado, incluindo espaço.
- Prefixo de acento (tecla morta) não conta como tentativa.
- Teclas de controle não contam.

### 7.2 PPM

`PPM = (caracteres corretos ÷ 5) ÷ (tempo do nível em minutos)`, arredondado para inteiro.

- O tempo do nível vai da primeira tecla até a conclusão.
- O tempo é pausado quando o campo de digitação perde o foco.
- Para o cálculo, o tempo mínimo considerado é 1 segundo.

### 7.3 Estrelas por nível

| Nível | 3 estrelas | 2 estrelas | 1 estrela |
| --- | --- | --- | --- |
| 1 | precisão ≥ 95% | precisão ≥ 85% | concluir |
| 2 | precisão ≥ 92% e PPM ≥ 10 | precisão ≥ 80% e PPM ≥ 7 | concluir |
| 3 | precisão ≥ 90% e PPM ≥ 15 | precisão ≥ 80% e PPM ≥ 10 | concluir |

Concluir o nível garante pelo menos 1 estrela. As metas ficam visíveis antes de cada nível.

### 7.4 Resultado para o portal

```js
window.parent.postMessage(
  {
    type: "vrgame:finish",
    score: totalEstrelas,      // 3 a 9
    maxScore: 9,
    timeMs: somaDosTempos,     // tempo ativo dos três níveis
    detail: {
      theme: "biomas",
      ppm: 14,
      accuracy: 94,
      levels: [
        { level: 1, stars: 3, ppm: 12, accuracy: 97, timeMs: 41000 },
        { level: 2, stars: 2, ppm: 11, accuracy: 88, timeMs: 52000 },
        { level: 3, stars: 3, ppm: 16, accuracy: 93, timeMs: 38000 }
      ]
    }
  },
  "*"
);
```

## 8. Conteúdo

Cada tema tem três níveis. O nível 1 usa palavras curtas sem acento; o nível 2, palavras médias com acento e/ou ç; o nível 3, uma frase curta.

### 8.1 Biomas do Brasil — Geografia

- Nível 1: `MATA CAMPO LAGO SERRA DUNAS RIO`
- Nível 2: `CERRADO CAATINGA PANTANAL AMAZÔNIA PAMPA MATA ATLÂNTICA`
- Nível 3: `O CERRADO É O BERÇO DAS ÁGUAS DO BRASIL.`

### 8.2 Corpo Humano — Ciências

- Nível 1: `OSSO PELE SANGUE NARIZ OUVIDO OLHO`
- Nível 2: `CORAÇÃO PULMÃO FÍGADO CÉREBRO ESTÔMAGO INTESTINO`
- Nível 3: `O CORAÇÃO BOMBEIA O SANGUE PARA TODO O CORPO.`

### 8.3 História do Brasil — História

- Nível 1: `REI LEI OURO NAVIO CARTA POVO`
- Nível 2: `COLÔNIA IMPÉRIO ABOLIÇÃO REPÚBLICA CARAVELA MONARQUIA`
- Nível 3: `A ABOLIÇÃO ACONTECEU EM 1888.`

### 8.4 Língua Portuguesa — Português

- Nível 1: `SALA LIVRO CARTA TEXTO FRASE CONTO`
- Nível 2: `ACENTUAÇÃO ORTOGRAFIA PONTUAÇÃO SÍLABA PARÁGRAFO CRASE`
- Nível 3: `A ACENTUAÇÃO MUDA O SENTIDO DAS PALAVRAS.`

## 9. Interface

### 9.1 Identidade visual

- Tema de máquina de escrever: papel, tinta, teclas e fita vermelha.
- Cores claras: papel `#f7f1e3`, tinta `#1f2937`, destaque `#b91c1c`, apoio `#1d4ed8`.
- Tema escuro: fundo `#111827`, papel `#1f2937`, texto `#f3f4f6`, mesmos destaques ajustados para contraste.
- Tipografia sem arquivos externos: serifada do sistema para títulos e monoespaçada para o texto digitado.
- Nenhuma imagem externa. A capa é um SVG local.

### 9.2 Tela de jogo

- Cabeçalho compacto com marca, tema e “Nível 1 de 3”.
- Placar: PPM, precisão, tempo e barra de progresso.
- Texto em fonte monoespaçada grande, com no máximo três linhas no desktop.
- Letras concluídas em tinta; posição atual com cursor; erro sublinhado.
- Teclado virtual ABNT2 simplificado, com letras, ç, espaço e teclas de acento.
- Cada dedo tem uma cor. Nos níveis 1 e 2, a próxima tecla pulsa e mostra o nome do dedo; no nível 3, apenas destaca a tecla.
- A tecla pressionada acende por 120 ms.
- Legenda de dedos visível no nível 1, reduzida no nível 2 e oculta no nível 3.

### 9.3 Responsivo

- Acima de 720 px: teclado virtual completo.
- Até 720 px: teclado virtual oculto e chip “Próxima tecla: A — indicador esquerdo”.
- Aviso de celular: “No celular, use o teclado do aparelho. A experiência completa é no computador.”, com botão de fechar.
- O jogo não deve criar rolagem horizontal em 320 px.

### 9.4 Tela cheia

- Ao receber `vrgame:fullscreen`, aumenta o texto e o teclado, reduz margens e esconde elementos decorativos.
- Respeita `prefers-reduced-motion` para desligar pulso do teclado, tremor de erro e transições.

## 10. Acessibilidade

- Todos os controles são botões ou links reais, com foco visível.
- O jogo é 100% jogável pelo teclado físico.
- O texto-alvo também existe em um parágrafo visualmente oculto para leitores de tela.
- Uma região `aria-live="polite"` anuncia o início do nível e o resultado, sem anunciar cada letra.
- O teclado virtual é decorativo (`aria-hidden="true"`).
- Erro não depende só de cor: usa sublinhado e o texto “erro” no anúncio.
- Contraste mínimo AA em texto, botões e teclas.
- O campo oculto tem rótulo acessível “Digite o texto”.
- Se o campo perder o foco, aparece uma camada “Clique para continuar” e o tempo pausa.

## 11. Arquitetura técnica

### 11.1 Arquivos

```
public/games/tecla-certa/
  index.html
  style.css
  game.js
  manifest.json
  cover.svg
```

Nenhuma alteração no código React do portal. O `scripts/sync-games.mjs` inclui o jogo no catálogo ao ler o manifest.

### 11.2 HTML

- Uma única página com telas em seções alternadas por `hidden`.
- `index.html` contém a estrutura das telas, o teclado virtual é montado por JS.
- Campo de digitação oculto:

```html
<input
  id="typing-input"
  class="typing-input"
  type="text"
  inputmode="text"
  autocomplete="off"
  autocapitalize="off"
  autocorrect="off"
  spellcheck="false"
  aria-label="Digite o texto"
/>
```

- O campo fica visível para leitores de tela e focado no início do nível. No CSS, usa opacidade zero e 1 px, sem `display: none`.

### 11.3 JavaScript

- IIFE em modo estrito, sem dependências, no padrão dos jogos existentes.
- Dados no topo: `THEMES`, `LEVELS`, `FINGER_MAP`, `STAR_RULES`.
- Estado único: tema atual, nível, posição, acertos, tentativas, tempo acumulado, pausa e resultados.
- Entrada por eventos `input` e `compositionstart`/`compositionend`.
  - Enquanto `isComposing` for verdadeiro, nada é contado.
  - Ao final da composição, o texto final é processado de uma vez.
  - O valor do campo é limpo depois de cada processamento.
- Comparação:
  - letras: `char.toUpperCase()`;
  - demais caracteres: igualdade exata.
- Acentos: mapear `á à â ã ä é è ê ë í ì î ï ó ò ô õ ö ú ù û ü ç` para a letra-base e o acento. Se o próximo alvo for acentuado, destacar a tecla-base com um selo do acento e a tecla morta correspondente.
- Cronômetro:
  - inicia na primeira tecla do nível;
  - pausa em `blur` e retoma em `focus`;
  - atualiza o placar a cada 250 ms.
- Ao concluir um nível, calcular estrelas e guardar o resultado.
- Ao concluir o nível 3, montar o `vrgame:finish`.
- Teclas de controle e atalhos do navegador não são interceptados, exceto Backspace durante o jogo.

### 11.4 Integração com o portal

- `vrgame:ready` ao carregar.
- `vrgame:resize` com `ResizeObserver` e após cada troca de tela.
- `vrgame:theme` e `vrgame:fullscreen` escutados.
- Tema inicial: `?theme=` na URL, preferência do sistema ou `localStorage` quando disponível (dentro de `try/catch`).
- Modo autônomo: se `window.self === window.top`, adicionar a classe `is-standalone` para ajustar o layout.

### 11.5 Manifest

```json
{
  "slug": "tecla-certa",
  "title": "Tecla Certa",
  "author": "Equipe Jogos VR",
  "authorClass": "Projeto de exemplo",
  "discipline": "Interdisciplinar",
  "grades": ["6º", "7º", "8º", "9º"],
  "tags": ["digitação", "teclado", "velocidade", "precisão", "português"],
  "description": "Pratique digitação com palavras e frases de quatro disciplinas, em três níveis de dificuldade.",
  "instructions": "Escolha um tema e digite o texto na tela. As cores do teclado mostram qual dedo usar. Nos níveis 1 e 2, corrija a letra errada para avançar; no nível 3, o erro conta na precisão.",
  "duration": 5,
  "version": "1.0.0",
  "entry": "index.html",
  "cover": "cover.svg",
  "featured": true,
  "order": 3,
  "createdAt": "2026-11-03"
}
```

## 12. Capa

- SVG 16:9, sem texto rasterizado.
- Máquina de escrever estilizada, folha de papel com “TECLA CERTA” e teclas coloridas.
- Paleta igual à do jogo.
- Versão legível em miniatura no cartão do catálogo.

## 13. Tratamento de erros e casos-limite

- **Sem teclado físico:** o campo oculto abre o teclado nativo no celular. O aviso explica a limitação.
- **Acento não suportado:** se o navegador entregar a letra sem acento, o caractere não é aceito; a dica mostra o acento esperado.
- **Foco perdido:** pausa e camada de retomada.
- **Mudança de tema do portal:** aplica na hora, sem reiniciar a partida.
- **Tela cheia:** re-renderiza o layout e reporta a altura.
- **Redimensionamento:** recalcula o número de linhas do texto e reporta a altura.
- **Erro de dados:** se um tema não tiver os três níveis, o jogo mostra “Conteúdo indisponível” e não envia `finish`.
- **Sem `window.parent`:** o jogo funciona normalmente em nova aba; as mensagens são ignoradas.

## 14. Testes

### 14.1 Automatizados

- `npm run build` sem erro de TypeScript e com o novo jogo no catálogo.
- Abrir `/jogo/tecla-certa` com navegador automatizado.
- Selecionar cada tema e concluir os três níveis digitando o texto correto.
- Verificar `vrgame:finish` com `score` entre 3 e 9, `maxScore` 9 e `detail.levels` com três itens.
- Testar erro no nível 1 (cursor não avança) e no nível 3 (cursor avança e precisão cai).
- Testar acentos: `AMAZÔNIA`, `CORAÇÃO`, `ABOLIÇÃO`, `ACENTUAÇÃO`.
- Testar viewport 375×667: aviso visível, teclado virtual oculto, chip da próxima tecla visível.
- Testar tema escuro pelo portal.
- Verificar console sem erros.

### 14.2 Manual

- Jogar uma partida completa no computador.
- Jogar no celular com teclado nativo.
- Perder o foco no meio do nível e retomar.
- Reiniciar pelo botão do portal.
- Alternar tela cheia.
- Navegar só com Tab e Enter.
- Ativar `prefers-reduced-motion` e confirmar que não há pulsação.

## 15. Critérios de aceite

- [ ] O jogo aparece no catálogo e abre no iframe do portal.
- [ ] Os quatro temas têm três níveis completos.
- [ ] Letras maiúsculas podem ser digitadas sem Shift.
- [ ] Acentos e ç funcionam no teclado ABNT2 e no teclado nativo do celular.
- [ ] O erro bloqueia nos níveis 1 e 2 e avança no nível 3.
- [ ] As estrelas seguem as metas da seção 7.
- [ ] O resultado enviado ao portal tem `score`, `maxScore`, `timeMs` e `detail`.
- [ ] O jogo funciona no celular com aviso e sem rolagem horizontal.
- [ ] Tema claro, escuro e tela cheia funcionam.
- [ ] Nenhum erro no console e nenhuma dependência externa.
- [ ] Navegação por teclado e foco visível em todos os controles.
