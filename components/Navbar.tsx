import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";
import { Icon } from "@/components/Icon";
import { DEFAULT_SEARCH, type SearchCriteria } from "@/lib/types";

export function Navbar({
  initialSearch = DEFAULT_SEARCH,
  onHomeTextChange,
  preserveQuery = "",
}: {
  initialSearch?: SearchCriteria;
  onHomeTextChange?: (text: string) => void;
  preserveQuery?: string;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-white/95 backdrop-blur">
      <nav aria-label="Navegación principal" className="mx-auto flex min-h-20 max-w-7xl items-center gap-4 px-5 md:gap-8 md:px-8">
        <Link aria-label="Estancias, inicio" className="flex shrink-0 items-center gap-2 text-xl font-bold tracking-tight text-[var(--accent)]" href="/">
          <span className="grid size-9 place-items-center rounded-full bg-[var(--accent)] text-white">e</span>
          <span className="hidden md:inline">Estancias</span>
        </Link>
        <SearchBar initialSearch={initialSearch} onHomeTextChange={onHomeTextChange} preserveQuery={preserveQuery} />
        <details className="group relative shrink-0">
          <summary aria-label="Menú de usuario" className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-full border border-[var(--line)] p-1.5 pl-3 hover:shadow-md">
            <Icon name="menu" size={18} />
            <span className="grid size-8 place-items-center rounded-full bg-[var(--surface)] text-[var(--muted)]"><Icon name="user" size={17} /></span>
          </summary>
          <div className="soft-shadow absolute right-0 top-14 grid min-w-48 gap-1 rounded-2xl border border-[var(--line)] bg-white p-2">
            <Link className="rounded-xl px-3 py-2 text-sm hover:bg-[var(--surface)]" href="/">Inicio</Link>
            <Link className="rounded-xl px-3 py-2 text-sm hover:bg-[var(--surface)]" href="/search">Explorar alojamientos</Link>
          </div>
        </details>
      </nav>
    </header>
  );
}