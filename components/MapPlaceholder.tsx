export function MapPlaceholder() {
  return (
    <div aria-label="Mapa" className="relative min-h-56 overflow-hidden rounded-2xl border border-[var(--line)] bg-[#e8eeea] md:sticky md:top-28 md:min-h-[calc(100vh-9rem)]" role="img">
      <div aria-hidden="true" className="absolute inset-0 opacity-70" style={{ backgroundImage: "linear-gradient(28deg, transparent 47%, #fff 48%, #fff 50%, transparent 51%), linear-gradient(112deg, transparent 44%, #fff 45%, #fff 47%, transparent 48%), linear-gradient(0deg, transparent 74%, #d2dfd7 75%, #d2dfd7 77%, transparent 78%)", backgroundSize: "180px 150px, 210px 180px, 100% 160px" }} />
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 px-5 py-3 text-sm font-semibold shadow-sm">Mapa</span>
    </div>
  );
}