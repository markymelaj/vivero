"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "./CartProvider";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const { add, openDrawer } = useCart();
  const [presentation, setPresentation] = useState(product.presentations[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    add("catalogo", {
      id: `${product.slug}-${presentation.size}`,
      slug: product.slug,
      name: product.name,
      presentation: presentation.size,
      quantity: qty,
      priceWholesale: presentation.priceWholesale,
      category: product.category,
      image: product.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const handleAddAndOpen = () => {
    handleAdd();
    setTimeout(() => openDrawer("catalogo"), 200);
  };

  return (
    <article className="group flex flex-col bg-bone border border-forest-100 rounded-sm overflow-hidden hover:border-forest-300 transition-colors">
      <div className="relative aspect-[4/5] bg-forest-50 overflow-hidden">
        <Image
          src={`/images/catalog/${product.image}`}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <span className="absolute top-3 left-3 text-[10px] uppercase tracking-wider bg-bone/90 backdrop-blur-sm text-forest-700 px-2 py-1 rounded">
          {product.category}
        </span>
      </div>

      <div className="flex-1 flex flex-col p-4 md:p-5">
        <h3 className="font-serif text-xl text-forest-800 leading-tight">
          {product.name}
        </h3>
        {product.scientificName && (
          <p className="text-xs italic text-forest-500 mt-0.5">
            {product.scientificName}
          </p>
        )}
        {product.description && (
          <p className="text-sm text-forest-700 mt-2 leading-relaxed text-pretty line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Presentation selector — only if more than one */}
        {product.presentations.length > 1 ? (
          <div className="mt-4">
            <p className="text-xs text-forest-600 mb-2">Presentación</p>
            <div className="flex flex-wrap gap-1.5">
              {product.presentations.map((p) => (
                <button
                  key={p.size}
                  onClick={() => setPresentation(p)}
                  className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                    presentation.size === p.size
                      ? "bg-forest-700 text-bone border-forest-700"
                      : "bg-bone text-forest-700 border-forest-200 hover:border-forest-400"
                  }`}
                >
                  {p.size}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-3 text-xs text-forest-600">
            Presentación{" "}
            <span className="text-forest-800 font-medium">
              {product.presentations[0].size}
            </span>
          </p>
        )}

        <div className="mt-auto pt-5 flex items-center gap-2">
          <div className="flex items-center border border-forest-200 rounded">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="px-2.5 py-1.5 text-forest-700 hover:bg-forest-50"
              aria-label="Menos"
            >
              −
            </button>
            <span className="w-8 text-center text-sm tabular-nums">{qty}</span>
            <button
              onClick={() => setQty(qty + 1)}
              className="px-2.5 py-1.5 text-forest-700 hover:bg-forest-50"
              aria-label="Más"
            >
              +
            </button>
          </div>
          <button
            onClick={handleAddAndOpen}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded transition-all ${
              added
                ? "bg-forest-500 text-bone"
                : "bg-forest-800 text-bone hover:bg-forest-900"
            }`}
          >
            {added ? "✓ Agregado" : "Agregar"}
          </button>
        </div>
      </div>
    </article>
  );
}
