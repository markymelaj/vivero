import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, getByCategory, type Category } from "@/lib/products";

const HIGHLIGHTS: Array<{ cat: Category; copy: string }> = [
  { cat: "interior",  copy: "Para casa, oficina y proyectos de interior." },
  { cat: "jardin",    copy: "Especies pensadas para el clima mendocino." },
  { cat: "graminea",  copy: "Textura, movimiento y bajo mantenimiento." },
  { cat: "arboles",   copy: "Estructura y porte para obras y veredas." },
  { cat: "suculenta", copy: "Resistencia, color y cero complicación." },
  { cat: "sustrato",  copy: "Sustratos, mulch y tierra preparada." },
];

export function Categories() {
  return (
    <section className="py-24 md:py-36 px-6 lg:px-10 bg-bone">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <span className="eyebrow">Catálogo</span>
            <h2 className="display text-5xl md:text-7xl text-forest-800 mt-4 text-balance">
              Variedad cultivada
              <br />
              <span className="italic text-forest-600">con criterio.</span>
            </h2>
          </div>
          <Link
            href="/catalogo"
            className="hidden md:inline-flex items-center gap-2 text-forest-800 hover:gap-3 transition-all"
          >
            Ver catálogo completo
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
          {HIGHLIGHTS.map(({ cat, copy }, i) => {
            const products = getByCategory(cat);
            const sampleImage = products[0]?.image ?? "cat-000.jpg";
            const count = products.length;
            return (
              <Link
                key={cat}
                href={`/catalogo?cat=${cat}`}
                className="group relative aspect-[4/5] rounded-sm overflow-hidden bg-forest-900"
              >
                <Image
                  src={`/images/catalog/${sampleImage}`}
                  alt={CATEGORIES[cat].label}
                  fill
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-900/90 via-forest-900/30 to-transparent" />
                <div className="absolute inset-0 p-5 md:p-7 flex flex-col justify-end text-bone">
                  <span className="text-xs opacity-70 tabular-nums">
                    / 0{i + 1} · {count} esp.
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl mt-2 leading-tight">
                    {CATEGORIES[cat].label}
                  </h3>
                  <p className="text-sm opacity-80 mt-2 max-w-[260px] text-pretty">
                    {copy}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 md:hidden text-center">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 text-forest-800"
          >
            Ver catálogo completo →
          </Link>
        </div>
      </div>
    </section>
  );
}
