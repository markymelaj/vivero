"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useCart } from "./CartProvider";
import { buildQuoteMessage, whatsappUrl } from "@/lib/whatsapp";
import { formatARS } from "@/lib/format";

export function CartDrawer() {
  const { drawerMode, closeDrawer, state, setQty, remove, clear } = useCart();

  // Close on ESC
  useEffect(() => {
    if (!drawerMode) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerMode, closeDrawer]);

  // Prevent body scroll while open
  useEffect(() => {
    if (drawerMode) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [drawerMode]);

  if (!drawerMode) return null;

  const items = state[drawerMode];
  const isMayorista = drawerMode === "mayorista";
  const title = isMayorista ? "Mi cotización" : "Mi selección";

  const totalWholesale = items.reduce(
    (s, it) => s + (it.priceWholesale ?? 0) * it.quantity,
    0
  );
  const totalUnits = items.reduce((s, it) => s + it.quantity, 0);

  const handleWhatsApp = () => {
    if (!items.length) return;
    const msg = buildQuoteMessage(items, drawerMode);
    window.open(whatsappUrl(msg), "_blank", "noopener,noreferrer");
  };

  const handlePDF = async () => {
    if (!items.length) return;
    const { generateQuotePDF } = await import("@/lib/pdf");
    await generateQuotePDF(items, drawerMode);
  };

  return (
    <div
      className="fixed inset-0 z-[100] animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-forest-900/40 backdrop-blur-sm"
        onClick={closeDrawer}
      />

      {/* Panel */}
      <aside className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-bone shadow-2xl flex flex-col animate-fade-up">
        {/* Header */}
        <header className="px-6 py-5 border-b border-forest-100 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl text-forest-800 leading-none">
              {title}
            </h2>
            <p className="text-xs text-forest-600 mt-1">
              {isMayorista
                ? "Precios mayoristas orientativos"
                : "Te cotizamos por WhatsApp en el día"}
            </p>
          </div>
          <button
            onClick={closeDrawer}
            className="text-forest-700 hover:text-forest-900 p-2 -m-2"
            aria-label="Cerrar"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 6l12 12M18 6l-6 6-6 6" />
            </svg>
          </button>
        </header>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <div className="w-16 h-16 rounded-full bg-forest-100 flex items-center justify-center mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-forest-600">
                  <path d="M5 7h14l-1.5 11a2 2 0 01-2 1.8h-7a2 2 0 01-2-1.8L5 7zM9 7V5a3 3 0 016 0v2" />
                </svg>
              </div>
              <p className="font-serif text-lg text-forest-800 mb-1">
                Todavía no agregaste nada
              </p>
              <p className="text-sm text-forest-600 max-w-[240px]">
                Sumá especies y presentaciones desde el {isMayorista ? "listado mayorista" : "catálogo"}.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((it) => (
                <li
                  key={it.id}
                  className="bg-white rounded-lg p-3 flex gap-3 border border-forest-100"
                >
                  <div className="relative w-16 h-16 rounded overflow-hidden bg-forest-50 flex-shrink-0">
                    <Image
                      src={`/images/catalog/${it.image}`}
                      alt={it.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-forest-900 text-sm leading-snug truncate">
                          {it.name}
                        </p>
                        <p className="text-xs text-forest-600 mt-0.5">{it.presentation}</p>
                      </div>
                      <button
                        onClick={() => remove(drawerMode, it.id)}
                        className="text-forest-400 hover:text-clay transition-colors -m-1 p-1"
                        aria-label="Quitar"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center border border-forest-200 rounded">
                        <button
                          onClick={() => setQty(drawerMode, it.id, it.quantity - 1)}
                          className="px-2 py-1 text-forest-700 hover:bg-forest-50"
                          aria-label="Menos"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={it.quantity}
                          onChange={(e) =>
                            setQty(drawerMode, it.id, parseInt(e.target.value || "1", 10))
                          }
                          className="w-10 text-center text-sm bg-transparent border-x border-forest-200 py-1 focus:outline-none"
                        />
                        <button
                          onClick={() => setQty(drawerMode, it.id, it.quantity + 1)}
                          className="px-2 py-1 text-forest-700 hover:bg-forest-50"
                          aria-label="Más"
                        >
                          +
                        </button>
                      </div>
                      {isMayorista && it.priceWholesale && (
                        <span className="text-sm font-medium text-forest-800 tabular-nums">
                          {formatARS(it.priceWholesale * it.quantity)}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <footer className="border-t border-forest-100 px-6 py-4 bg-white">
            {isMayorista && totalWholesale > 0 && (
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-sm text-forest-600">Total estimado</span>
                <span className="font-serif text-2xl text-forest-900 tabular-nums">
                  {formatARS(totalWholesale)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between mb-3 text-xs text-forest-600">
              <span>{totalUnits} unidad{totalUnits !== 1 && "es"}</span>
              <button
                onClick={() => clear(drawerMode)}
                className="hover:text-clay transition-colors"
              >
                Vaciar
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handlePDF}
                className="px-4 py-3 text-sm font-medium text-forest-800 border border-forest-300 rounded hover:bg-forest-50 transition-colors flex items-center justify-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" />
                </svg>
                PDF
              </button>
              <button
                onClick={handleWhatsApp}
                className="px-4 py-3 text-sm font-medium text-white bg-forest-700 hover:bg-forest-800 rounded transition-colors flex items-center justify-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.4-1.4-.9-.8-1.4-1.8-1.6-2.1-.2-.3 0-.4.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.6-1.5-.8-2.1-.2-.5-.4-.4-.6-.5h-.5c-.2 0-.5.1-.7.3-.3.3-1 .9-1 2.3 0 1.4 1 2.7 1.1 2.9.1.2 2 3 4.7 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.2-.2-.5-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.4c1.4.8 3.1 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2z"/>
                </svg>
                WhatsApp
              </button>
            </div>
          </footer>
        )}
      </aside>
    </div>
  );
}

export function CartFAB({ mode }: { mode: "catalogo" | "mayorista" }) {
  const { state, openDrawer } = useCart();
  const count = state[mode].reduce((s, it) => s + it.quantity, 0);
  if (count === 0) return null;

  return (
    <button
      onClick={() => openDrawer(mode)}
      className="fixed bottom-6 left-6 z-40 bg-forest-800 text-bone px-5 py-3 rounded-full shadow-xl hover:bg-forest-900 transition-all hover:scale-105 flex items-center gap-2 animate-scale-in"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 7h14l-1.5 11a2 2 0 01-2 1.8h-7a2 2 0 01-2-1.8L5 7zM9 7V5a3 3 0 016 0v2" />
      </svg>
      <span className="font-medium text-sm">
        {mode === "mayorista" ? "Cotización" : "Selección"} ({count})
      </span>
    </button>
  );
}
