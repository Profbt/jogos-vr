import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { usePageMeta } from "../lib/usePageMeta";

export function NotFound() {
  usePageMeta("Página não encontrada — Jogos VR", "O endereço pode estar errado ou o jogo ainda não foi publicado.");
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="font-mono text-6xl font-black text-blue-600 dark:text-blue-400">404</p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        Essa fase não existe
      </h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        O endereço pode estar errado ou o jogo ainda não foi publicado. Volte ao catálogo
        e escolha outra fase.
      </p>
      <Link to="/" className="btn btn-primary mt-6">
        <Icon name="arrow-left" size={16} />
        Voltar para os jogos
      </Link>
    </div>
  );
}
