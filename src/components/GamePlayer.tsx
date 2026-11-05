import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import { useTheme } from "../lib/theme";
import type { Game, GameResult } from "../lib/types";

type Status = "loading" | "ready" | "done" | "error";

function formatTime(ms?: number): string | null {
  if (!ms || ms < 0) return null;
  const total = Math.round(ms / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function maxFrameHeight(): number {
  if (typeof window === "undefined") return 2200;
  return window.innerWidth < 640 ? 3600 : 2200;
}

export function GamePlayer({ game }: { game: Game }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [result, setResult] = useState<GameResult | null>(null);
  const [frameHeight, setFrameHeight] = useState(560);
  const [runId, setRunId] = useState(0);
  const { theme } = useTheme();

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.source !== iframeRef.current?.contentWindow) return;
      const data = event.data as
        | ({ type?: string; height?: number } & Partial<GameResult>)
        | undefined;
      if (!data || typeof data !== "object") return;

      if (data.type === "vrgame:ready") {
        setStatus((current) => (current === "done" ? current : "ready"));
        iframeRef.current?.contentWindow?.postMessage(
          {
            type: "vrgame:fullscreen",
            fullscreen: Boolean(document.fullscreenElement),
          },
          "*"
        );
      }

      if (data.type === "vrgame:resize") {
        const height = Number(data.height);
        if (Number.isFinite(height)) {
          setFrameHeight(Math.max(460, Math.min(maxFrameHeight(), Math.round(height))));
        }
      }

      if (data.type === "vrgame:finish") {
        setStatus("done");
        setResult({
          score: Number(data.score) || 0,
          maxScore: Number(data.maxScore) || 0,
          timeMs: Number(data.timeMs) || 0,
          detail: data.detail,
        });
      }

      if (data.type === "vrgame:restart") {
        setResult(null);
        setStatus("ready");
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [runId]);

  useEffect(() => {
    if (status !== "loading") return;
    const timer = window.setTimeout(() => setStatus("error"), 12000);
    return () => window.clearTimeout(timer);
  }, [status, runId]);

  useEffect(() => {
    const target = iframeRef.current?.contentWindow;
    target?.postMessage({ type: "vrgame:theme", theme }, "*");
  }, [theme, status, runId]);

  useEffect(() => {
    function onFullscreenChange() {
      iframeRef.current?.contentWindow?.postMessage(
        {
          type: "vrgame:fullscreen",
          fullscreen: Boolean(document.fullscreenElement),
        },
        "*"
      );
    }

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  function restart() {
    setResult(null);
    setStatus("loading");
    setRunId((value) => value + 1);
  }

  function goFullscreen() {
    iframeRef.current?.requestFullscreen?.().catch(() => {
      // navegador bloqueou a tela cheia; o jogo continua disponível na página
    });
  }

  const time = formatTime(result?.timeMs);
  const gaveUp = result?.detail?.won === false;
  const statusLabel =
    status === "done"
      ? "Partida concluída"
      : status === "error"
        ? "Não carregou"
        : status === "ready"
          ? "Jogo carregado"
          : "Carregando";
  const statusDot =
    status === "done"
      ? "bg-emerald-500"
      : status === "error"
        ? "bg-rose-500"
        : status === "ready"
          ? "bg-emerald-400"
          : "bg-amber-400";

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 bg-gray-50 px-4 py-2.5 dark:border-gray-800 dark:bg-gray-900">
        <div
          className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400"
          role="status"
          aria-live="polite"
        >
          <span className="relative flex h-2 w-2">
            <span
              className={`absolute inline-flex h-full w-full rounded-full ${statusDot}`}
            />
          </span>
          {statusLabel}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={restart}
            className="btn btn-ghost h-8 gap-1.5 px-2.5 text-xs"
            title="Reiniciar o jogo"
          >
            <Icon name="refresh" size={14} />
            Reiniciar
          </button>
          <button
            type="button"
            onClick={goFullscreen}
            className="btn btn-ghost h-8 gap-1.5 px-2.5 text-xs"
            title="Tela cheia"
          >
            <Icon name="maximize" size={14} />
            Tela cheia
          </button>
        </div>
      </div>

      {result && (
        <div
          className={`flex flex-wrap items-center gap-x-4 gap-y-1 border-b px-4 py-3 text-sm ${
            gaveUp
              ? "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-200"
              : "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200"
          }`}
          role="status"
          aria-live="polite"
        >
          <span className="inline-flex items-center gap-1.5 font-semibold">
            <Icon name={gaveUp ? "close" : "trophy"} size={16} />
            {gaveUp ? "Partida encerrada" : "Você concluiu!"}
          </span>
          <span>
            Pontuação: <strong>{result.score}</strong>
            {result.maxScore > 0 ? ` de ${result.maxScore}` : ""}
          </span>
          {time && <span>Tempo: {time}</span>}
          <button
            type="button"
            onClick={restart}
            className="ml-auto text-xs font-semibold underline underline-offset-2 hover:no-underline"
          >
            Jogar de novo
          </button>
        </div>
      )}

      <div className="relative bg-gray-100 dark:bg-gray-950" aria-busy={status === "loading"}>
        {status === "loading" && (
          <div className="absolute inset-0 z-10 grid place-items-center bg-gray-100/80 backdrop-blur-sm dark:bg-gray-950/80">
            <div className="flex flex-col items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-400" />
              Preparando o jogo…
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="absolute inset-0 z-10 grid place-items-center bg-gray-100/90 p-6 text-center backdrop-blur-sm dark:bg-gray-950/90">
            <div className="max-w-sm">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Não foi possível carregar o jogo.
              </p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Verifique a conexão ou abra em uma nova aba.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button type="button" onClick={restart} className="btn btn-primary h-10">
                  Tentar de novo
                </button>
                <a
                  href={`${game.entryUrl}?theme=${theme}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary h-10"
                >
                  Abrir em nova aba
                </a>
              </div>
            </div>
          </div>
        )}

        <iframe
          key={runId}
          ref={iframeRef}
          src={game.entryUrl}
          title={`Jogo: ${game.title}`}
          sandbox="allow-scripts"
          allow="fullscreen"
          style={{ height: frameHeight }}
          className="block w-full border-0 bg-white"
          onLoad={() => {
            iframeRef.current?.contentWindow?.postMessage(
              { type: "vrgame:theme", theme },
              "*"
            );
          }}
        />
      </div>
    </div>
  );
}
