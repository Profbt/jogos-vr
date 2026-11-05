# Forca com Dicas — desenho

## Objetivo

Criar um jogo de forca curto (3 a 5 minutos) para o portal Jogos VR, com conteúdo de Português: classe gramatical e significado servem de dica para cada palavra.

## Regras

- Uma partida tem 5 palavras sorteadas de um banco de 18.
- Cada palavra mostra classe gramatical e significado.
- São 6 vidas por palavra. Cada letra errada apaga uma parte do boneco.
- Letra certa revela todas as ocorrências. `C` também revela `Ç`; `A` revela `Á`, `Ã` e `À`.
- Cada palavra vale 20 pontos, com desconto de 4 por erro. Palavra não concluída vale 0. Máximo de 100.
- Depois de cada palavra, o jogo mostra a resposta, o significado e os pontos antes de avançar.
- No fim, um resumo lista as cinco palavras com acerto ou erro.

## Tela

- Cabeçalho com título e botão Reiniciar.
- HUD com palavra atual, pontos e vidas (corações mais texto).
- Palco em duas colunas no desktop: forca em SVG inline à esquerda; dica e lacunas à direita. No celular, empilhado.
- Teclado virtual A–Z, com marca `✓` ou `✕` nas letras usadas.
- Teclado físico aceita letras, inclusive acentuadas (convertidas para a letra-base).
- Sobreposição de fim de palavra e sobreposição de resultado final.

## Acessibilidade

- Navegação completa por Tab e teclado físico.
- Foco visível e foco movido para o botão principal ao abrir cada sobreposição.
- Feedback em região `aria-live="polite"`.
- Vidas e letras não dependem só de cor: usam símbolos e texto.
- Contraste AA e respeito a `prefers-reduced-motion`.

## Técnico

- Pasta `public/games/forca-com-dicas`, sem dependências externas.
- Contrato do portal: `vrgame:ready`, `vrgame:finish`, `vrgame:restart`, `vrgame:resize`, `vrgame:theme` e `vrgame:fullscreen`.
- Capa `cover.svg` no mesmo estilo das capas existentes.
- Manifest com disciplina Português, séries 6º a 9º e duração de 4 minutos.
- Validação com `npm run sync` e `npm run build`.
