import { SITE } from "@/lib/site";

const ICONS: Record<string, JSX.Element> = {
  catalog: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M7 7h18v18H7z" />
      <path d="M11 12h10M11 17h10M11 22h6" strokeLinecap="round" />
    </svg>
  ),
  wholesale: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M6 11h20v15H6z" />
      <path d="M9 11V7h14v4" />
      <path d="M10 16h5M10 20h8M21 17h3" strokeLinecap="round" />
    </svg>
  ),
  project: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M4 26h24" />
      <path d="M7 26V12l9-6 9 6v14" />
      <path d="M12 26v-8h8v8" />
    </svg>
  ),
  allies: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3">
      <circle cx="10" cy="11" r="4" />
      <circle cx="22" cy="11" r="4" />
      <path d="M4 27c1-5 4-8 6-8s5 3 6 8" />
      <path d="M16 27c1-5 4-8 6-8s5 3 6 8" />
    </svg>
  ),
  landscape: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M3 24L11 14L17 20L22 15L29 24" />
      <path d="M3 28h26" />
      <circle cx="23" cy="6" r="2.5" />
    </svg>
  ),
  advice: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M16 4C10 4 6 8 6 13c0 3 1.5 5 3 6.5l-1.5 4.5L12 22c1 .5 2.5 1 4 1 6 0 10-4 10-10S22 4 16 4z" />
      <path d="M12 12h8M12 16h6" strokeLinecap="round" />
    </svg>
  ),
  production: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M6 28V14L16 7L26 14V28" />
      <path d="M11 28V20H21V28" />
      <path d="M16 7V3" strokeLinecap="round" />
      <path d="M13 5L16 3L19 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  decor: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M16 22V12" />
      <path d="M16 12C12 12 10 8 12 5C14 7 16 9 16 12Z" />
      <path d="M16 12C20 12 22 8 20 5C18 7 16 9 16 12Z" />
      <path d="M10 26h12L20 22H12L10 26Z" />
    </svg>
  ),
};

export function Services() {
  return (
    <section className="py-24 md:py-36 px-6 lg:px-10 bg-bone">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-16 md:mb-24">
          <span className="eyebrow">Lo que hacemos</span>
          <h2 className="display text-5xl md:text-7xl text-forest-800 mt-4 text-balance">
            Más que vender plantas,
            <br />
            <span className="italic text-forest-600">acompañamos proyectos.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-forest-100 border border-forest-100">
          {SITE.services.map((s, i) => (
            <div
              key={s.title}
              className="bg-bone p-8 md:p-12 hover:bg-forest-50 transition-colors group"
            >
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 flex-shrink-0 text-forest-700 group-hover:text-forest-800 transition-colors">
                  {ICONS[s.icon]}
                </div>
                <div>
                  <h3 className="font-serif text-2xl md:text-3xl text-forest-800 mb-3">
                    {s.title}
                  </h3>
                  <p className="text-forest-700 leading-relaxed">{s.blurb}</p>
                </div>
              </div>
              <div className="mt-8 ml-18 pl-18">
                <span className="text-xs text-forest-500 tabular-nums">
                  / 0{i + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
