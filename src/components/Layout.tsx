import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Icon } from "./Icon";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { to: "/", label: "Jogos" },
  { to: "/criar", label: "Como criar" },
  { to: "/sobre", label: "Sobre" },
];

function navClass({ isActive }: { isActive: boolean }) {
  return [
    "rounded-lg px-3 py-2 text-sm font-medium transition",
    isActive
      ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white",
  ].join(" ");
}

export function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/85 backdrop-blur-md dark:border-gray-800/80 dark:bg-gray-950/85">
      <div className="container-page flex h-16 items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-3" aria-label="Jogos VR, ir para o início">
          <img
            src="/logos/logo_escola-96.png"
            alt=""
            width={40}
            height={40}
            decoding="async"
            className="h-10 w-10 rounded-xl object-contain"
          />
          <span className="leading-tight">
            <span className="block text-base font-bold tracking-tight text-gray-900 dark:text-white">
              Jogos VR
            </span>
            <span className="block text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Vicente Rijo
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navegação principal">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === "/"} className={navClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            className="btn btn-ghost h-10 w-10 p-0 md:hidden"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-gray-200 bg-white px-4 py-3 md:hidden dark:border-gray-800 dark:bg-gray-950">
          <nav id="mobile-nav" className="flex flex-col gap-1" aria-label="Navegação principal">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === "/"} className={navClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/40">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <div className="flex items-center gap-3">
            <img
              src="/logos/logo_escola-96.png"
              alt=""
              width={44}
              height={44}
              decoding="async"
              className="h-11 w-11 rounded-xl object-contain"
            />
            <div>
              <p className="font-bold text-gray-900 dark:text-white">Jogos VR</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Colégio Estadual Vicente Rijo
              </p>
            </div>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            Jogos educativos feitos por estudantes, para estudantes. Jogue no navegador,
            sem cadastro e sem instalar nada.
          </p>
        </div>

        <div>
          <p className="label">Navegar</p>
          <ul className="mt-4 space-y-2 text-sm">
            {links.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-gray-600 transition hover:text-blue-700 dark:text-gray-400 dark:hover:text-blue-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="label">Contato</p>
          <a
            href="mailto:bruno.barros.carvalho@escola.pr.gov.br"
            className="mt-4 inline-flex items-center gap-2 text-sm text-gray-600 transition hover:text-blue-700 dark:text-gray-400 dark:hover:text-blue-300"
          >
            <Icon name="mail" size={16} />
            Professor responsável
          </a>
          <p className="mt-4 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
            Nenhum dado pessoal é coletado. O site não usa login nem cookies de
            rastreamento.
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200 py-5 dark:border-gray-800">
        <div className="container-page flex flex-col items-center justify-between gap-2 text-xs text-gray-500 sm:flex-row dark:text-gray-400">
          <p>© {new Date().getFullYear()} Jogos VR · Projeto educacional</p>
          <p className="inline-flex items-center gap-1.5">
            Feito com <Icon name="heart" size={14} className="text-rose-500" /> no Vicente Rijo
          </p>
        </div>
      </div>
    </footer>
  );
}

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-blue-700 focus:shadow-lg dark:focus:bg-gray-900 dark:focus:text-blue-300"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
