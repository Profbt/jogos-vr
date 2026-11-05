import { Link } from "react-router-dom";
import { CodeBlock } from "../components/CodeBlock";
import { Icon, type IconName } from "../components/Icon";
import { usePageMeta } from "../lib/usePageMeta";

const folderTree = `public/games/meu-jogo/
├── index.html      ← a página do jogo
├── style.css       ← o visual
├── game.js         ← a lógica
├── cover.svg       ← a capa do card (16:9)
└── manifest.json   ← os dados que aparecem no catálogo`;

const manifestExample = `{
  "slug": "meu-jogo",
  "title": "Nome do jogo",
  "author": "Seu nome",
  "authorClass": "2º B",
  "discipline": "Matemática",
  "grades": ["6º", "7º"],
  "tags": ["frações", "quiz"],
  "description": "Uma frase que explica o jogo.",
  "instructions": "Como jogar, em uma ou duas frases.",
  "duration": 5,
  "version": "1.0.0",
  "entry": "index.html",
  "cover": "cover.svg",
  "createdAt": "2026-11-02"
}`;

const contractExample = `// 1. avise que o jogo carregou
window.parent.postMessage({ type: "vrgame:ready" }, "*");

// 2. quando a partida terminar, envie o resultado
window.parent.postMessage(
  {
    type: "vrgame:finish",
    score: 8,
    maxScore: 10,
    timeMs: 95000
  },
  "*"
);

// 3. o portal avisa se o tema é claro ou escuro
window.addEventListener("message", (event) => {
  if (event.data?.type === "vrgame:theme") {
    document.documentElement.dataset.theme = event.data.theme;
  }
});`;

const steps: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "download",
    title: "Baixe e abra",
    text: "Extraia a pasta-modelo e abra o index.html no navegador. Ela já tem um jogo funcionando.",
  },
  {
    icon: "code",
    title: "Troque o conteúdo",
    text: "Comece pelas perguntas, palavras e cores. Depois mude as regras e o visual.",
  },
  {
    icon: "check",
    title: "Teste de verdade",
    text: "Jogue no celular e no computador, com teclado e com toque. Peça para alguém testar.",
  },
  {
    icon: "upload",
    title: "Entregue a pasta",
    text: "Compacte em .zip e envie pelo Classroom ou Drive. O professor revisa e publica.",
  },
];

const technicalChecks = [
  "O jogo abre sozinho, sem erro no console (F12).",
  "Funciona no celular e no computador.",
  "Dá para jogar só com o teclado.",
  "Não usa internet, login ou biblioteca externa.",
  "Avisa quando carrega e quando termina (vrgame:ready / vrgame:finish).",
  "A capa está em 16:9 e o manifest está preenchido.",
];

const pedagogicalChecks = [
  "O conteúdo está correto e adequado à série.",
  "A regra é clara em uma frase.",
  "O jogo ensina algo, não só testa memória.",
  "O erro explica o porquê, em vez de só punir.",
  "O tempo de partida fica entre 3 e 8 minutos.",
  "Créditos e nome do autor estão corretos.",
];

export function CreatePage() {
  usePageMeta(
    "Como criar um jogo — Jogos VR",
    "Baixe a pasta-modelo, crie um jogo em HTML, CSS e JavaScript e entregue para o professor revisar."
  );
  return (
    <div className="container-page py-10 sm:py-14">
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-200">
          <Icon name="bulb" size={14} />
          Trilha do criador
        </span>
        <h1 className="mt-5 text-balance text-4xl font-black tracking-tight text-gray-900 sm:text-5xl dark:text-white">
          Seu jogo pode entrar no catálogo
        </h1>
        <p className="mt-4 text-balance text-base leading-relaxed text-gray-600 sm:text-lg dark:text-gray-300">
          Você escreve HTML, CSS e JavaScript, testa no navegador e entrega a pasta. Sem
          login, sem servidor e sem framework. O professor revisa e publica.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <a href="/downloads/modelo-jogo.zip" download className="btn btn-primary">
            <Icon name="download" size={16} />
            Baixar pasta-modelo
          </a>
          <a href="#contrato" className="btn btn-secondary">
            Ver o contrato técnico
            <Icon name="arrow-right" size={16} />
          </a>
        </div>
      </div>

      <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <li key={step.title} className="card p-5">
            <div className="flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
                <Icon name={step.icon} size={19} />
              </span>
              <span className="font-mono text-xs font-bold text-gray-300 dark:text-gray-700">
                0{index + 1}
              </span>
            </div>
            <h2 className="mt-4 text-sm font-bold text-gray-900 dark:text-white">
              {step.title}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {step.text}
            </p>
          </li>
        ))}
      </ol>

      <section className="mt-14 grid gap-8 lg:grid-cols-2">
        <div>
          <p className="label">Estrutura</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Uma pasta, cinco arquivos
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            Cada jogo é uma pasta dentro de <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs dark:bg-gray-800">public/games/</code>.
            O nome da pasta precisa ser igual ao <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs dark:bg-gray-800">slug</code> do manifest.
          </p>
          <div className="mt-4">
            <CodeBlock code={folderTree} filename="estrutura" />
          </div>
        </div>

        <div>
          <p className="label">Catálogo</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            O manifest apresenta o jogo
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            É daqui que o site tira o título, a descrição, a capa e os filtros. Campos
            obrigatórios: slug, title, description, discipline, grades, instructions,
            duration e entry.
          </p>
          <div className="mt-4">
            <CodeBlock code={manifestExample} filename="manifest.json" />
          </div>
        </div>
      </section>

      <section id="contrato" className="mt-14 scroll-mt-24">
        <div className="max-w-2xl">
          <p className="label">Contrato</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Como o jogo conversa com o portal
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            O portal abre o jogo em um iframe isolado. A conversa é só por mensagens:
            nenhum acesso ao DOM, ao armazenamento ou à conta de quem joga.
          </p>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <CodeBlock code={contractExample} filename="game.js" />

          <div className="card p-6">
            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
              <Icon name="shield" size={17} className="text-emerald-600 dark:text-emerald-400" />
              Regras de segurança
            </h3>
            <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              <li>Sem link externo, formulário ou coleta de dados.</li>
              <li>Sem biblioteca carregada da internet.</li>
              <li>Sem acesso a cookies ou localStorage do portal.</li>
              <li>O jogo só é publicado depois da revisão do professor.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <div className="max-w-2xl">
          <p className="label">Antes de entregar</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Checklist de revisão
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            Use a mesma lista que o professor usa. Se algo falhar, corrija antes de enviar.
          </p>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div className="card p-6">
            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
              <Icon name="code" size={17} className="text-blue-600 dark:text-blue-400" />
              Técnico
            </h3>
            <ul className="mt-4 space-y-3">
              {technicalChecks.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  <Icon
                    name="check"
                    size={16}
                    className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-6">
            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
              <Icon name="graduation" size={17} className="text-amber-600 dark:text-amber-400" />
              Pedagógico
            </h3>
            <ul className="mt-4 space-y-3">
              {pedagogicalChecks.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  <Icon
                    name="check"
                    size={16}
                    className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="card p-6 sm:p-8">
          <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Como entregar (sem login)
          </h2>
          <ol className="mt-4 space-y-4">
            {[
              "Compacte a pasta do jogo em um arquivo .zip com o nome do jogo.",
              "Envie pelo Google Classroom, Google Drive ou entregue em um pendrive.",
              "O professor abre o jogo, testa e dá o retorno.",
              "Se aprovado, a pasta entra em public/games/ e o site é publicado.",
            ].map((item, index) => (
              <li key={item} className="flex gap-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {index + 1}
                </span>
                {item}
              </li>
            ))}
          </ol>
          <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm leading-relaxed text-amber-900 dark:bg-amber-400/10 dark:text-amber-200">
            <strong>Importante:</strong> o site não recebe arquivos. A entrega é feita pelo
            canal da turma, e só o professor publica. Assim ninguém consegue alterar o
            catálogo.
          </p>
        </div>

        <div className="card p-6 sm:p-8">
          <h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            Rubrica de avaliação
          </h2>
          <table className="mt-4 w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:text-gray-400">
                <th className="pb-2 font-semibold">Critério</th>
                <th className="pb-2 text-right font-semibold">Peso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {[
                ["Jogabilidade", "25%"],
                ["Correção do conteúdo", "25%"],
                ["Acessibilidade", "20%"],
                ["Qualidade do código", "15%"],
                ["Originalidade", "15%"],
              ].map(([criterion, weight]) => (
                <tr key={criterion}>
                  <td className="py-2.5 text-gray-600 dark:text-gray-400">{criterion}</td>
                  <td className="py-2.5 text-right font-semibold text-gray-900 dark:text-white">
                    {weight}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-14 flex flex-col items-start justify-between gap-4 rounded-2xl border border-blue-200 bg-blue-50 p-6 sm:flex-row sm:items-center dark:border-blue-500/30 dark:bg-blue-500/10">
        <div>
          <h2 className="text-lg font-bold text-blue-950 dark:text-blue-100">
            Já tem um jogo pronto?
          </h2>
          <p className="mt-1 text-sm text-blue-800 dark:text-blue-200">
            Confira o contrato, o checklist e envie para o professor responsável.
          </p>
        </div>
        <Link to="/" className="btn btn-primary shrink-0">
          Ver o catálogo
          <Icon name="arrow-right" size={16} />
        </Link>
      </div>
    </div>
  );
}
