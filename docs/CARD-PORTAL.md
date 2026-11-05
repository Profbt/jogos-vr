# Card no Portal do Aluno

O portal de jogos é um site separado e aberto. O card no Portal do Aluno é só um link: não precisa compartilhar login nem Firebase.

## Antes de começar

Publique o portal de jogos e copie a URL final. Exemplo:

```
https://jogos-portalvr.vercel.app
```

Substitua `https://jogos-portalvr.vercel.app` pela URL real nos exemplos abaixo.

## Opção 1: card em React + Tailwind

O Portal do Aluno usa React, Tailwind e dark mode por classe. Este card segue a mesma linguagem visual.

```tsx
export function CardJogos() {
  return (
    <a
      href="https://jogos-portalvr.vercel.app"
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-700"
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-blue-600 text-2xl text-white">
        🎮
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
          Jogos Educativos
        </span>
        <span className="block text-xs text-gray-600 dark:text-gray-400">
          Jogue e crie jogos feitos por estudantes do Vicente Rijo
        </span>
      </span>

      <span
        aria-hidden="true"
        className="text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-400"
      >
        →
      </span>
    </a>
  );
}
```

## Opção 2: card em HTML puro

Se o painel administrativo permitir inserir HTML:

```html
<a
  href="https://jogos-portalvr.vercel.app"
  target="_blank"
  rel="noopener noreferrer"
  style="display:flex;align-items:center;gap:16px;padding:16px;border:1px solid #e5e7eb;border-radius:12px;background:#fff;text-decoration:none;color:#111827;box-shadow:0 1px 2px rgba(0,0,0,.05)"
>
  <span style="display:grid;place-items:center;width:48px;height:48px;border-radius:10px;background:#2563eb;color:#fff;font-size:24px">🎮</span>
  <span style="flex:1">
    <strong style="display:block;font-size:14px">Jogos Educativos</strong>
    <span style="display:block;font-size:12px;color:#6b7280">Jogue e crie jogos feitos por estudantes</span>
  </span>
  <span style="color:#9ca3af">→</span>
</a>
```

## Opção 3: botão configurável do painel

O painel atual já cadastra botões com título, texto e URL. Se preferir, cadastre:

| Campo | Valor |
| --- | --- |
| Título | Jogos Educativos |
| Texto do botão | Jogar agora |
| URL | `https://jogos-portalvr.vercel.app` |

Marque para abrir em nova aba.

## Onde colocar

- Home do portal, na área de cards principais.
- Menu lateral, abaixo de "Conteúdos".
- Destaque da semana, quando houver jogo novo.

## Checklist

- [ ] URL publicada e testada no celular.
- [ ] Card abre em nova aba (`target="_blank"` + `rel="noopener noreferrer"`).
- [ ] Texto deixa claro que é aberto e sem login.
- [ ] Card some ou muda o texto se o portal de jogos estiver em manutenção.
