"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";
import { formatARS } from "@/lib/format";
import { CATEGORIES, type Product } from "@/lib/products";

export function PriceTable({ products }: { products: Product[] }) {
  const { add, openDrawer } = useCart();
  const [flashId, setFlashId] = useState<string | null>(null);

  const grouped = products.reduce<Record<string, Product[]>>((acc, p) => {
    (acc[p.category] ??= []).push(p);
    return acc;
  }, {});

  const handleAdd = (p: Product, size: string, price: number | undefined) => {
    const id = `${p.slug}-${size}`;
    add("mayorista", {
      id,
      slug: p.slug,
      name: p.name,
      presentation: size,
      quantity: 1,
      priceWholesale: price,
      category: p.category,
      image: p.image,
    });
    setFlashId(id);
    setTimeout(() => setFlashId(null), 900);
    setTimeout(() => openDrawer("mayorista"), 200);
  };

  return (
    <div className="space-y-16">
      {Object.entries(grouped).map(([cat, items]) => (
        <section key={cat}>
          <div className="flex items-baseline justify-between mb-6 pb-3 border-b border-forest-200">
            <h2 className="font-serif text-3xl text-forest-800">
              {CATEGORIES[cat as keyof typeof CATEGORIES].label}
            </h2>
            <span className="text-xs text-forest-500 tabular-nums">
              {items.length} {items.length === 1 ? "producto" : "productos"}
            </span>
          </div>

          <div className="overflow-x-auto -mx-6 md:mx-0">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-forest-600 border-b border-forest-100">
                  <th className="py-3 px-3 md:px-4 font-medium">Producto</th>
                  <th className="py-3 px-3 md:px-4 font-medium w-32">Presentación</th>
                  <th className="py-3 px-3 md:px-4 font-medium text-right w-28">Mayorista</th>
                  <th className="py-3 px-3 md:px-4 font-medium text-right w-32"></th>
                </tr>
              </thead>
              <tbody>
                {items.flatMap((p) =>
                  p.presentations.map((pres, i) => {
                    const id = `${p.slug}-${pres.size}`;
                    const isFlash = flashId === id;
                    return (
                      <tr
                        key={id}
                        className={`border-b border-forest-50 hover:bg-forest-50/60 transition-colors ${
                          isFlash ? "bg-forest-200/40" : ""
                        }`}
                      >
                        <td className="py-3 px-3 md:px-4">
                          {i === 0 ? (
                            <>
                              <p className="font-medium text-forest-900">
                                {p.name}
                              </p>
                              {p.scientificName && (
                                <p className="text-xs italic text-forest-500 mt-0.5">
                                  {p.scientificName}
                                </p>
                              )}
                            </>
                          ) : (
                            <p className="text-forest-500 text-xs pl-3">↳ otra presentación</p>
                          )}
                        </td>
                        <td className="py-3 px-3 md:px-4 text-forest-700">{pres.size}</td>
                        <td className="py-3 px-3 md:px-4 text-right tabular-nums font-medium text-forest-800">
                          {pres.priceWholesale ? formatARS(pres.priceWholesale) : "—"}
                        </td>
                        <td className="py-3 px-3 md:px-4 text-right">
                          <button
                            onClick={() => handleAdd(p, pres.size, pres.priceWholesale)}
                            className="text-xs font-medium text-forest-700 hover:text-forest-900 border border-forest-200 hover:border-forest-700 rounded px-3 py-1.5 transition-colors"
                          >
                            + Cotizar
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
