# Jogos VR

Portal de jogos educativos do Colégio Estadual Vicente Rijo. Site aberto, sem login e sem banco de dados: os jogos são arquivos estáticos e o catálogo é gerado a partir dos manifests de cada jogo.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra o endereço mostrado no terminal (normalmente `http://localhost:5173`).

## Build de produção

```bash
npm run build
npm run preview
```

O resultado fica em `dist/`.

## Como publicar um jogo

1. Copie `public/games/_template` para `public/games/<slug>`.
2. Edite `manifest.json`, `index.html`, `style.css` e `game.js`.
3. Rode `npm run dev` e teste em `/jogo/<slug>`.
4. Rode `npm run build` para confirmar que o catálogo foi gerado sem erros.
5. Faça commit e deploy.

O script `scripts/sync-games.mjs` lê todos os `public/games/*/manifest.json`, valida os campos obrigatórios e gera `src/data/games.generated.json`. Pastas que começam com `_` ficam fora do catálogo.

Variantes, testes e versões em avaliação ficam em `lab/`, fora de `public/`, para não entrarem no catálogo nem no deploy. O script valida entrada, capa, slug, séries e duração; no build, use `npm run build` (modo estrito).

### Atualizar o modelo para download

O arquivo `public/downloads/modelo-jogo.zip` é uma cópia de `public/games/_template`. Se você mudar o modelo, gere o zip de novo:

```powershell
$stage = Join-Path $env:TEMP "modelo-jogo"
Remove-Item $stage -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $stage | Out-Null
Copy-Item "public/games/_template/*" $stage -Recurse
Compress-Archive -Path $stage -DestinationPath "public/downloads/modelo-jogo.zip" -Force
```

## Estrutura

```
public/
  games/
    batalha-de-canhoes/  jogo publicado
    caca-palavras/     jogo publicado
    palavra-do-dia/    jogo publicado
    qual-e-o-pais/     jogo publicado
    tecla-certa/       jogo publicado
    _template/         pasta-modelo para os estudantes
  logos/               brasão da escola
  downloads/           modelo em .zip
src/
  components/          UI do portal
  data/                catálogo gerado (não editar à mão)
  lib/                 tipos, tema e consultas
  pages/               Home, jogo, como criar e sobre
docs/
  COMO-CRIAR.md        guia do estudante
  CONTRATO.md          contrato técnico dos jogos
  CARD-PORTAL.md       card para o Portal do Aluno
lab/                   variantes e experimentos fora do catálogo
```

## Deploy na Vercel

1. Suba o projeto para um repositório Git.
2. Importe na Vercel.
3. Framework: Vite. Build: `npm run build`. Output: `dist`.
4. Opcional: configure um domínio como `jogos-portalvr.vercel.app`.

O arquivo `vercel.json` já define o rewrite da SPA e os cabeçalhos de segurança dos jogos.

## Adicionar o card no Portal do Aluno

Veja `docs/CARD-PORTAL.md`. O card é um link simples; não é necessário compartilhar login, porque o portal de jogos é aberto.
