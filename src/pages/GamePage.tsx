import { Link, useParams } from "react-router-dom";
import { GameCard } from "../components/GameCard";
import { GamePlayer } from "../components/GamePlayer";
import { Icon } from "../components/Icon";
import { formatDuration, getGame, getRelated } from "../lib/games";
import { useTheme } from "../lib/theme";
import { usePageMeta } from "../lib/usePageMeta";
import { NotFound } from "./NotFound";

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function GamePage() {
  const { slug } = useParams();
  const { theme } = useTheme();
  const game = getGame(slug);

  usePageMeta(
    game ? `${game.title} — Jogos VR` : "Jogo não encontrado — Jogos VR",
    game?.description
  );

  if (!game) return <NotFound />;

  const related = getRelated(game);

  return (
    <div className="container-page py-8 sm:py-10">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-blue-700 dark:text-gray-400 dark:hover:text-blue-300"
      >
        <Icon name="arrow-left" size={16} />
        Todos os jogos
      </Link>

      <header className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
              {game.discipline}
            </span>
            {game.grades.map((grade) => (
              <span
                key={grade}
                className="rounded-full border border-gray-200 px-2.5 py-1 text-[11px] font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400"
              >
                {grade}
              </span>
            ))}
          </div>

          <h1 className="mt-3 text-balance text-3xl font-black tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            {game.title}
          </h1>
          <p className="mt-2 text-balance text-sm leading-relaxed text-gray-600 sm:text-base dark:text-gray-300">
            {game.description}
          </p>
        </div>

        <a
          href={`${game.entryUrl}?theme=${theme}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary shrink-0"
        >
          <Icon name="external" size={16} />
          Abrir em nova aba
        </a>
      </header>

      <div className="mt-6">
        <GamePlayer game={game} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="card p-5 sm:p-6 md:col-span-2">
          <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
            <Icon name="book" size={17} className="text-blue-600 dark:text-blue-400" />
            Como jogar
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {game.instructions}
          </p>

          {game.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {game.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="card p-5 sm:p-6">
          <p className="label">Ficha do jogo</p>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-gray-500 dark:text-gray-400">Disciplina</dt>
              <dd className="font-semibold text-gray-900 dark:text-white">
                {game.discipline}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-gray-500 dark:text-gray-400">Séries</dt>
              <dd className="text-right font-semibold text-gray-900 dark:text-white">
                {game.grades.join(", ")}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-gray-500 dark:text-gray-400">Duração</dt>
              <dd className="font-semibold text-gray-900 dark:text-white">
                {formatDuration(game.duration)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-gray-500 dark:text-gray-400">Versão</dt>
              <dd className="font-mono text-xs font-semibold text-gray-900 dark:text-white">
                {game.version}
              </dd>
            </div>
          </dl>
        </div>

        <div className="card p-5 sm:p-6">
          <p className="label">Criado por</p>
          <div className="mt-4 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-blue-600 text-sm font-bold text-white">
              {initials(game.author)}
            </span>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {game.author}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {game.authorClass || "Estudante do Vicente Rijo"}
              </p>
            </div>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-gray-500 dark:text-gray-500">
            Jogo revisado pelo professor responsável antes da publicação.
          </p>
        </div>

        <div className="card p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
            <Icon name="shield" size={17} className="text-emerald-600 dark:text-emerald-400" />
            Jogo isolado
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            O jogo roda em uma área isolada do site. Ele não acessa seus dados, sua conta
            ou outras abas do navegador.
          </p>
        </div>

        <div className="card p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
            <Icon name="maximize" size={17} className="text-blue-600 dark:text-blue-400" />
            Tela cheia
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            Use o botão de tela cheia para jogar sem distração. Para sair, pressione
            <kbd className="mx-1 rounded border border-gray-300 px-1.5 py-0.5 font-mono text-[11px] dark:border-gray-600">
              Esc
            </kbd>
            .
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="label">Continue jogando</p>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Outros jogos do arcade
              </h2>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
            >
              Ver todos
              <Icon name="arrow-right" size={15} />
            </Link>
          </div>
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <GameCard key={item.slug} game={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
