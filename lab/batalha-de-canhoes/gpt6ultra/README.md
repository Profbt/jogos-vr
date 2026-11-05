# Batalha de Canhões 3.0

Um duelo de artilharia educativo para um ou dois jogadores, sem instalação de bibliotecas e sem recursos externos.

## Abrir e instalar

1. Extraia o ZIP. Não abra o jogo diretamente de dentro do arquivo compactado.
2. Abra `batalha-de-canhoes/index.html` em um navegador atualizado.
3. No portal Jogos VR, faça uma cópia de segurança da pasta atual e copie **todos os arquivos** desta nova pasta para `public/games/batalha-de-canhoes/`.
4. Mantenha os nomes `index.html`, `engine.js`, `game.js`, `style.css`, `cover.svg` e `manifest.json`.
5. Se o portal mostrar a versão antiga, recarregue a página ignorando o cache.

O ZIP original recebido foi preservado. Esta entrega é uma nova cópia.

## O que mudou

- Visual ilustrado em tons de creme e verde, arena com montanhas e terreno em camadas.
- Interface lateral no computador e comandos abaixo do campo em telas menores.
- Mira por arraste, ajustes finos por botões e teclado e marca do último impacto.
- Três dificuldades da batalha: Explorador, Estrategista e Comandante.
- Nível das contas independente do adversário e escolha de operação.
- Treino sem cronômetro e previsão completa no nível Explorador.
- Tutorial de quatro passos, pausa manual e pausa ao mudar de aba.
- Explicação da conta após cada resposta; o jogador avança quando terminar de ler.
- Vida inicial de 150 pontos, bônus de dano de 50% e custos distintos para as armas.
- Resultado por jogador humano, com acertos separados por operação. A IA não entra na nota educativa.
- Física independente da taxa de atualização da tela. Mira, IA e tiro usam a mesma simulação.
- Cenário estático em camadas reutilizadas e busca de mira da IA em duas etapas.
- Som opcional e efeitos reduzidos; preferências ficam somente no próprio navegador.

## Como jogar

No menu, escolha um adversário ou dois jogadores no mesmo aparelho, a dificuldade da batalha, o nível das contas e as operações. Desmarque **Jogar com tempo** se preferir. **Treinar sem pressa** usa a dificuldade Explorador sem cronômetro e mantém o modo e o conteúdo selecionados.

1. Responda à operação. Acertar dá **+50% de dano no próximo tiro** e **1 energia**, até o máximo de 2.
2. Leia a explicação e clique em **Preparar tiro**. Errar não impede o disparo.
3. Mire arrastando pelo campo: a direção determina o ângulo, e a distância determina a força. Também é possível usar os controles.
4. Selecione a munição e clique em **Disparar**. A direção do vento aparece acima da arena.
5. Reduza os 150 pontos de vida do rival a zero. Explosões próximas também causam dano, inclusive ao próprio canhão.

| Munição | Custo | Uso |
|---|---:|---|
| Normal | Grátis | Um projétil, ideal para ajustar a pontaria. |
| Triplo | 1 energia | Três projéteis em leque. |
| Mega | 2 energias | Explosão de maior alcance e cratera maior. |

O cronômetro da pergunta é de 30, 22 ou 16 segundos, conforme a dificuldade da batalha. A mira tem 35, 30 ou 25 segundos. Ao esgotar a pergunta, aparece a explicação e o tiro fica sem bônus. Ao esgotar a mira, o canhão dispara com os valores atuais. A leitura da explicação não tem prazo.

## Atalhos

- Setas para cima/baixo: ângulo; esquerda/direita: força. Shift faz ajustes de 5 unidades.
- Espaço: disparar durante a mira; sobre um botão, mantém a ação nativa do botão.
- 1, 2 e 3: Normal, Triplo e Mega.
- M: som. P ou Escape: pausa. Escape também fecha o tutorial.
- Enter no campo da resposta: conferir a conta.
- Tab: percorrer controles. As janelas mantêm a navegação do teclado dentro delas.

Os atalhos de partida não interferem na digitação da resposta nem na escolha dos menus.

## Portal Jogos VR

Mantidos os eventos `vrgame:ready`, `vrgame:resize` e `vrgame:finish`. O jogo recebe `vrgame:theme` e `vrgame:fullscreen` da janela pai. O endereço também aceita `?theme=dark`.

No modo contra o computador, `score` e `maxScore` consideram somente o aluno. No modo com duas pessoas, somam os dois jogadores e incluem o detalhamento individual em `detail.players`. `timeMs` representa o tempo ativo de partida, excluindo pausas e tutorial. O encerramento é enviado uma única vez por partida.

## Validação

Consulte `VALIDACAO.md`. Foram verificadas regras e partidas completas em simulação automatizada. A aparência e o desempenho em aparelhos reais ainda precisam de conferência no navegador.

## Ajustes de ritmo (2026-11-03)

Para aproximar o ritmo do claude sem perder as regras da versão 3.0:

- Depois de responder, a mira começa automaticamente em **0,9 s**. A explicação continua visível no painel de mira, e o botão **Preparar tiro** permite adiantar.
- Tempos artificiais reduzidos: resposta da IA de 1,2 s para 0,75 s; feedback da IA de 0,85 s para 0,5 s; mira da IA de 1,0 s para 0,7 s; preparação do tiro da IA de 0,55 s para 0,35 s.
- Impacto de 1,0 s para 0,6 s e encerramento de 0,65 s para 0,4 s.
- Regras preservadas: 150 pontos de vida, três dificuldades, três munições e explicação após cada conta.
- O tempo de partida ainda pode ser um pouco maior que o do claude por causa dos 150 pontos de vida e da leitura da explicação.
