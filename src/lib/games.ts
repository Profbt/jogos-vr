import rawGames from "../data/games.generated.json";
import type { Game } from "./types";

export const games = rawGames as Game[];

export const disciplines = Array.from(
  new Set(games.map((game) => game.discipline))
).sort((a, b) => a.localeCompare(b, "pt-BR"));

export const grades = Array.from(new Set(games.flatMap((game) => game.grades))).sort(
  (a, b) => a.localeCompare(b, "pt-BR", { numeric: true })
);

export function getGame(slug: string | undefined): Game | undefined {
  if (!slug) return undefined;
  return games.find((game) => game.slug === slug);
}

export function getRelated(game: Game, limit = 3): Game[] {
  const sameDiscipline = games.filter(
    (item) => item.slug !== game.slug && item.discipline === game.discipline
  );
  const others = games.filter(
    (item) => item.slug !== game.slug && item.discipline !== game.discipline
  );
  return [...sameDiscipline, ...others].slice(0, limit);
}

export function formatDuration(minutes: number): string {
  return minutes === 1 ? "1 min" : `${minutes} min`;
}
