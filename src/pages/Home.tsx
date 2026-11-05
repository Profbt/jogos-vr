import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { GameCard } from "../components/GameCard";
import { Icon, type IconName } from "../components/Icon";
import { disciplines, games, grades } from "../lib/games";
import { usePageMeta } from "../lib/usePageMeta";

const upcoming: { title: string; area: string; text: string; icon: IconName }[] = [
  {
    title: "Jogo da Memória",
    area: "Ciências e Idiomas",
    text: "Pares de conceito e definição para fixar vocabulário e processos.",
    icon: "gamepad",
  },
  {
    title: "Linha do Tempo",
    area: "História e Literatura",
    text: "Ordene eventos e obras antes que o tempo acabe.",
    icon: "clock",
  },
  {
    title: "Laboratório de Frações",
    area: "Matemática",
    text: "Compare, some e equivalha frações com barras e pizzas.",
    icon: "bulb",
  },
  {
    title: "Caça ao Bug",
    area: "Técnico e Lógica",
    text: "Encontre o erro no algoritmo e conserte o código.",
    icon: "code",
  },
];

const steps = [
  {
    icon: "download" as IconName,
    title: "Baixe o modelo",
    text: "Uma pasta com HTML, CSS e JavaScript já funcionando. Sem instalar nada.",
  },
  {
    icon: "code" as IconName,
    title: "Crie o seu jogo",
    text: "Troque o conteúdo, mude as regras e teste no navegador com o botão de recarregar.",
  },
  {
    icon: "upload" as IconName,
    title: "Entregue ao professor",
    text: "Envie a pasta pelo Classroom ou Drive. O professor revisa e publica aqui.",
  },
];

function HeroBoard() {
  const rows = [
    { letters: ["J", "O", "G", "A", "R"], tone: "bg-emerald-500 border-emerald-500 text-white" },
    { letters: ["C", "R", "I", "A", "R"], tone: "bg-amber-400 border-amber-400 text-amber-950" },
    {
      letters: ["V", "I", "C", "E", "N"],
      tone: "bg-white border-gray-200 text-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300",
    },
  ];

  return (
    <div className="pointer-events-none absolute -right-4 top-20 hidden w-[320px] rotate-2 animate-float xl:block">
      <div className="card p-6 shadow-2xl shadow-blue-900/10 dark:shadow-black/40">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Palavra do Dia
          </p>
          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
            grátis
          </span>
        </div>
        <div className="mt-5 space-y-2">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-2">
              {row.letters.map((letter, index) => (
                <span
                  key={`${rowIndex}-${index}`}
                  className={`grid h-11 w-11 place-items-center rounded-lg border text-lg font-black ${row.tone}`}
                >
                  {letter}
                </span>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-5 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Icon name="sparkles" size={14} className="text-amber-500" />
          6 tentativas. Uma palavra nova por dia.
        </div>
      </div>
    </div>
  );
}

export function Home() {
  usePageMeta(
    "Jogos VR — Aprender jogando",
    "Jogos educativos criados por estudantes do Colégio Vicente Rijo. Jogue no navegador e aprenda criando."
  );
  const [query, setQuery] = useState("");
  const [discipline, setDiscipline] = useState("Todas");
  const [grade, setGrade] = useState("Todas");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();

    return games.filter((game) => {
      const matchesTerm =
        term.length === 0 ||
        [game.title, game.description, game.author, game.discipline, ...game.tags]
          .join(" ")
          .toLowerCase()
          .includes(term);
      const matchesDiscipline = discipline === "Todas" || game.discipline === discipline;
      const matchesGrade = grade === "Todas" || game.grades.includes(grade);
      return matchesTerm && matchesDiscipline && matchesGrade;
    });
  }, [query, discipline, grade]);

  return (
    <>
      <section className="relative overflow-hidden border-b border-gray-200 dark:border-gray-800">
        <div className="absolute inset-0 bg-grid opacity-70 [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]" />
        <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="container-page relative py-16 sm:py-24">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300">
              <Icon name="sparkles" size={14} />
              Feito por estudantes do Vicente Rijo
            </span>

            <h1 className="mt-5 text-balance text-4xl font-black tracking-tight text-gray-900 sm:text-5xl lg:text-6xl dark:text-white">
              Aprender jogando.{" "}
              <span className="text-blue-600 dark:text-blue-400">Criar ensinando.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-balance text-base leading-relaxed text-gray-600 sm:text-lg dark:text-gray-300">
              Um arcade educativo aberto, sem cadastro e sem instalar nada. Jogue os jogos
              da turma e publique o seu: a próxima fase pode ser sua.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#jogos" className="btn btn-primary">
                <Icon name="play" size={16} className="fill-current" />
                Explorar jogos
              </a>
              <Link to="/criar" className="btn btn-secondary">
                Quero criar um jogo
                <Icon name="arrow-right" size={16} />
              </Link>
            </div>

            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
              {[
                { value: games.length, label: "jogos no ar" },
                { value: disciplines.length, label: "disciplinas" },
                { value: "100%", label: "grátis e aberto" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="text-2xl font-black text-gray-900 dark:text-white">
                    {stat.value}
                  </dt>
                  <dd className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <HeroBoard />
        </div>
      </section>

      <section id="jogos" className="container-page scroll-mt-20 py-12 sm:py-16">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="label">Catálogo</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
              Jogos para jogar agora
            </h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400" aria-live="polite">
            {filtered.length} de {games.length} jogos
          </p>
        </div>

        <div className="card mt-6 p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Icon
                name="search"
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por jogo, disciplina ou palavra-chave"
                className="input pl-10"
                aria-label="Buscar jogos"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 lg:max-w-md">
              <button
                type="button"
                onClick={() => setDiscipline("Todas")}
                aria-pressed={discipline === "Todas"}
                className={`chip whitespace-nowrap ${
                  discipline === "Todas" ? "chip-active" : ""
                }`}
              >
                Todas
              </button>
              {disciplines.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setDiscipline(item)}
                  aria-pressed={discipline === item}
                  className={`chip whitespace-nowrap ${discipline === item ? "chip-active" : ""}`}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="relative">
              <select
                value={grade}
                onChange={(event) => setGrade(event.target.value)}
                className="input appearance-none pr-9 lg:w-40"
                aria-label="Filtrar por série"
              >
                <option value="Todas">Todas as séries</option>
                {grades.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <Icon
                name="chevron-down"
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((game) => (
              <GameCard key={game.slug} game={game} />
            ))}
          </div>
        ) : (
          <div className="card mt-6 flex flex-col items-center justify-center px-6 py-16 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
              <Icon name="search" size={24} />
            </span>
            <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
              Nenhum jogo encontrado
            </h3>
            <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
              Tente outra palavra ou limpe os filtros. E se o jogo que você quer ainda não
              existe, você pode criar.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setDiscipline("Todas");
                setGrade("Todas");
              }}
              className="btn btn-secondary mt-5"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </section>

      <section className="border-y border-gray-200 bg-white py-12 sm:py-16 dark:border-gray-800 dark:bg-gray-900/40">
        <div className="container-page">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="label">Em produção</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
                Próximos jogos
              </h2>
            </div>
            <Link
              to="/criar"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
            >
              Sugerir uma ideia
              <Icon name="arrow-right" size={15} />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {upcoming.map((item) => (
              <div key={item.title} className="card p-5">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300">
                  <Icon name={item.icon} size={19} />
                </span>
                <h3 className="mt-4 text-sm font-bold text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {item.area}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-12 sm:py-16">
        <div className="max-w-2xl">
          <p className="label">Como funciona</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
            Do caderno ao navegador em três passos
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            Você não precisa de conta, servidor nem framework. Só de uma ideia e vontade de
            testar.
          </p>
        </div>

        <ol className="mt-8 grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="card relative p-6">
              <span className="absolute right-5 top-5 text-4xl font-black text-gray-100 dark:text-gray-800">
                {index + 1}
              </span>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
                <Icon name={step.icon} size={20} />
              </span>
              <h3 className="mt-4 text-base font-bold text-gray-900 dark:text-white">
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-page pb-4">
        <div className="relative overflow-hidden rounded-3xl bg-blue-600 px-6 py-10 sm:px-10 sm:py-12">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-xl">
              <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                Tem uma ideia de jogo?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-blue-100 sm:text-base">
                Baixe a pasta-modelo, troque o conteúdo e entregue para o professor. Se
                funcionar no navegador, pode entrar no catálogo.
              </p>
            </div>
            <Link
              to="/criar"
              className="btn shrink-0 bg-white text-blue-700 hover:bg-blue-50"
            >
              Começar meu jogo
              <Icon name="arrow-right" size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
