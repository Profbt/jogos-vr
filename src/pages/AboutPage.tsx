import { Link } from "react-router-dom";
import { Icon, type IconName } from "../components/Icon";
import { usePageMeta } from "../lib/usePageMeta";

const principles: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "gamepad",
    title: "Aberto para jogar",
    text: "Sem cadastro, sem senha e sem instalar. Qualquer pessoa com o link entra e joga.",
  },
  {
    icon: "graduation",
    title: "Autoral de verdade",
    text: "Cada jogo tem nome, turma e disciplina. O crédito é de quem criou, não do site.",
  },
  {
    icon: "shield",
    title: "Seguro por padrão",
    text: "Jogos rodam isolados, sem acesso à conta de quem joga. Nada é publicado sem revisão.",
  },
];

const faq = [
  {
    question: "Preciso criar conta para jogar?",
    answer:
      "Não. O catálogo e os jogos são abertos. A única coisa que o site guarda no seu navegador é a preferência de tema claro ou escuro.",
  },
  {
    question: "Quem pode publicar um jogo?",
    answer:
      "Somente o professor responsável. Os estudantes criam e entregam a pasta; a publicação passa por revisão técnica e pedagógica.",
  },
  {
    question: "Meu jogo pode usar imagens e sons?",
    answer:
      "Pode, desde que os arquivos estejam dentro da pasta do jogo e você tenha direito de usar. Nada de carregar arquivos da internet.",
  },
  {
    question: "O site coleta dados dos alunos?",
    answer:
      "Não. Não há login, banco de dados, formulário ou analytics. Os jogos não recebem nome, e-mail ou turma de quem joga.",
  },
  {
    question: "Posso usar o nome de um jogo que já existe?",
    answer:
      "Evite. Use um nome próprio para o seu jogo. Ideias e mecânicas podem ser inspiradas, mas marcas e nomes registrados não.",
  },
];

export function AboutPage() {
  usePageMeta(
    "Sobre o projeto — Jogos VR",
    "Conheça o arcade educativo do Colégio Estadual Vicente Rijo: jogos feitos por estudantes, sem login e sem coleta de dados."
  );
  return (
    <div className="container-page py-10 sm:py-14">
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300">
          <Icon name="sparkles" size={14} />
          Sobre o projeto
        </span>
        <h1 className="mt-5 text-balance text-4xl font-black tracking-tight text-gray-900 sm:text-5xl dark:text-white">
          Um arcade feito pela escola, para a escola
        </h1>
        <p className="mt-4 text-balance text-base leading-relaxed text-gray-600 sm:text-lg dark:text-gray-300">
          O Jogos VR nasceu para dar um destino real aos projetos das aulas de tecnologia:
          em vez de um arquivo esquecido no Drive, o jogo entra no navegador e a turma
          inteira pode jogar. É também um convite para quem nunca programou: comece
          pequeno, publique e melhore na próxima versão.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {principles.map((item) => (
          <div key={item.title} className="card p-6">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
              <Icon name={item.icon} size={20} />
            </span>
            <h2 className="mt-4 text-base font-bold text-gray-900 dark:text-white">
              {item.title}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {item.text}
            </p>
          </div>
        ))}
      </div>

      <section className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="card p-6 sm:p-8">
          <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Como o site funciona
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            <p>
              O site é estático: não existe servidor, banco de dados nem login. O catálogo é
              gerado a partir dos arquivos <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs dark:bg-gray-800">manifest.json</code>{" "}
              de cada jogo. Quando o professor adiciona uma pasta e publica, o jogo aparece
              no catálogo.
            </p>
            <p>
              Cada jogo roda em um iframe isolado, com uma política de segurança que bloqueia
              conexões externas. A comunicação com o portal é feita apenas por mensagens:
              “carreguei” e “terminei, esta foi a pontuação”.
            </p>
            <p>
              O visual segue a identidade do Portal do Aluno: cinza, azul, dark mode e o
              brasão do Colégio Estadual Vicente Rijo.
            </p>
          </div>
        </div>

        <div className="card p-6 sm:p-8">
          <h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            Privacidade em uma frase
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            O site não coleta dados pessoais, não usa cookies de rastreamento e não pede
            login. A única informação guardada é a sua escolha de tema, no próprio
            navegador.
          </p>
          <div className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm leading-relaxed text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-200">
            <strong>Para professores:</strong> a publicação é manual e revisada. Não há
            upload aberto nem área de comentários.
          </div>
        </div>
      </section>

      <section className="mt-14">
        <div className="max-w-2xl">
          <p className="label">Dúvidas</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Perguntas frequentes
          </h2>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {faq.map((item) => (
            <details key={item.question} className="card group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-gray-900 dark:text-white">
                {item.question}
                <Icon
                  name="chevron-down"
                  size={16}
                  className="shrink-0 text-gray-400 transition group-open:rotate-180"
                />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-6 sm:grid-cols-2">
        <div className="card p-6">
          <p className="label">Tecnologia</p>
          <h2 className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
            Simples de manter
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>React + TypeScript + Vite</li>
            <li>Tailwind CSS com dark mode</li>
            <li>Jogos em HTML, CSS e JavaScript puro</li>
            <li>Deploy estático na Vercel</li>
          </ul>
        </div>

        <div className="card p-6">
          <p className="label">Créditos</p>
          <h2 className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
            Quem faz acontecer
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            Projeto e curadoria do professor Bruno Tadeu Barros de Carvalho, com os
            estudantes do Colégio Estadual Vicente Rijo. Os jogos pertencem a quem os criou.
          </p>
          <a
            href="mailto:bruno.barros.carvalho@escola.pr.gov.br"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
          >
            <Icon name="mail" size={16} />
            Falar com o responsável
          </a>
        </div>
      </section>

      <div className="mt-14 flex flex-col items-start justify-between gap-4 rounded-2xl bg-gray-900 p-6 sm:flex-row sm:items-center dark:bg-gray-900">
        <div>
          <h2 className="text-lg font-bold text-white">A próxima fase pode ser sua</h2>
          <p className="mt-1 text-sm text-gray-400">
            Baixe o modelo, crie um jogo e entregue para o professor.
          </p>
        </div>
        <Link to="/criar" className="btn shrink-0 bg-white text-gray-900 hover:bg-gray-100">
          Começar agora
          <Icon name="arrow-right" size={16} />
        </Link>
      </div>
    </div>
  );
}
