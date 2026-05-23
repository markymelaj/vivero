"use client";

import { PublicShell } from "@/components/PublicShell";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { CartFAB } from "@/components/CartDrawer";
import { PRODUCTS, CATEGORIES, type Category } from "@/lib/products";

const CAT_FILTERS: Array<{ value: "all" | Category; label: string }> = [
  { value: "all", label: "Todo" },
  ...(Object.entries(CATEGORIES) as Array<[Category, { short: string }]>).map(
    ([k, v]) => ({ value: k, label: v.short })
  ),
];

function CatalogInner() {
  const params = useSearchParams();
  const initial = (params.get("cat") as "all" | Category) ?? "all";
  const [filter, setFilter] = useState<"all" | Category>(initial);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const cat = params.get("cat") as Category | null;
    if (cat && CATEGORIES[cat]) setFilter(cat);
  }, [params]);

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (filter !== "all" && p.category !== filter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          (p.scientificName?.toLowerCase().includes(q) ?? false)
        );
      }
      return true;
    });
  }, [filter, search]);

  return (
    <PublicShell>
      <main className="bg-bone min-h-screen pb-32">
      {/* Page hero */}
      <section className="pt-32 md:pt-40 pb-12 px-6 lg:px-10 bg-forest-50">
        <div className="max-w-7xl mx-auto">
          <span className="eyebrow">Catálogo</span>
          <h1 className="display text-6xl md:text-8xl text-forest-800 mt-4 text-balance">
            Nuestras
            <span className="italic text-forest-600"> especies</span>.
          </h1>
          <p className="mt-6 text-lg text-forest-700 max-w-2xl text-pretty">
            Seleccioná especies, agregalas y cotizamos por WhatsApp en el día.
            Stock sujeto a disponibilidad — siempre verificamos antes de
            confirmar.
          </p>
        </div>
      </section>

      {/* Filters bar */}
      <section className="sticky top-16 md:top-20 z-30 bg-bone/95 backdrop-blur-md border-b border-forest-100 px-6 lg:px-10 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-3 md:items-center">
          <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            {CAT_FILTERS.map((c) => (
              <button
                key={c.value}
                onClick={() => setFilter(c.value)}
                className={`px-3.5 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors ${
                  filter === c.value
                    ? "bg-forest-800 text-bone"
                    : "bg-forest-50 text-forest-700 hover:bg-forest-100"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="md:ml-auto md:w-72 relative">
            <input
              type="search"
              placeholder="Buscar especie..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-forest-50 border border-forest-200 rounded-full px-4 py-2 text-sm placeholder:text-forest-500 focus:outline-none focus:border-forest-500 transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 lg:px-10 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-baseline justify-between mb-8">
            <p className="text-sm text-forest-600">
              {filtered.length}{" "}
              {filtered.length === 1 ? "producto" : "productos"}
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-2xl text-forest-700">
                No hay resultados
              </p>
              <p className="text-sm text-forest-500 mt-2">
                Probá con otra búsqueda o categoría.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filtered.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <WhatsAppFloat context="catalogo" />
      <CartFAB mode="catalogo" />
    </main>
    </PublicShell>
  );
}

import { Suspense } from "react";

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bone" />}>
      <CatalogInner />
    </Suspense>
  );
}
