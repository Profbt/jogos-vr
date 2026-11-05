import { Link } from "react-router-dom";
import { formatDuration } from "../lib/games";
import type { Game } from "../lib/types";
import { Icon } from "./Icon";

export function GameCard({ game }: { game: Game }) {
  return (
    <Link
      to={`/jogo/${game.slug}`}
      className="card group flex flex-col overflow-hidden transition duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-600/5 dark:hover:border-blue-800"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={game.coverUrl}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-gray-700 backdrop-blur dark:bg-gray-950/80 dark:text-gray-200">
          {game.discipline}
        </span>
        <span className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-900/20 transition group-hover:scale-110">
          <Icon name="play" size={16} className="translate-x-[1px] fill-current" />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold leading-snug text-gray-900 dark:text-white">
          {game.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {game.description}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-4 text-xs text-gray-500 dark:text-gray-400">
          <span className="inline-flex items-center gap-1">
            <Icon name="user" size={13} />
            {game.author}
            {game.authorClass ? ` · ${game.authorClass}` : ""}
          </span>
          <span className="inline-flex items-center gap-1">
            <Icon name="clock" size={13} />
            {formatDuration(game.duration)}
          </span>
        </div>
      </div>
    </Link>
  );
}
