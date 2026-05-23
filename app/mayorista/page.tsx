import { PublicShell } from "@/components/PublicShell";
import { PriceTable } from "@/components/PriceTable";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { CartFAB } from "@/components/CartDrawer";
import { PRODUCTS } from "@/lib/products";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lista mayorista",
  description:
    "Lista de precios mayoristas para viveristas, paisajistas y empresas. Plantas de interior y exterior, sustratos y cortezas en Mendoza.",
};

export default function MayoristaPage() {
  return (
    <PublicShell>
      <main className="bg-bone min-h-screen pb-32">
      {/* Page hero */}
      <section className="pt-32 md:pt-40 pb-12 px-6 lg:px-10 bg-forest-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-forest-200/30 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="relative max-w-7xl mx-auto">
          <span className="eyebrow">Mayorista 2026</span>
          <h1 className="display text-6xl md:text-8xl text-forest-800 mt-4 text-balance">
            Lista de
            <span className="italic text-forest-600"> precios</span>.
          </h1>
          <p className="mt-6 text-lg text-forest-700 max-w-2xl text-pretty">
            Para viveristas, paisajistas, comercios, arquitectos y compras por volumen. Armá tu pedido, consultá stock y coordinamos retiro o entrega por WhatsApp.
          </p>

          {/* Conditions row */}
          <div className="mt-10 grid sm:grid-cols-3 gap-px bg-forest-200 rounded-sm overflow-hidden max-w-3xl border border-forest-200">
            <Cond label="Ubicación" value="Maipú — Mendoza" />
            <Cond label="Envíos" value="Gran Mendoza · coordinar" />
            <Cond label="Moneda" value="Pesos argentinos (ARS)" />
          </div>

          {/* Downloads */}
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/pdfs/lista-mayorista.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-forest-700 hover:text-forest-900 underline underline-offset-4 decoration-forest-300"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" />
              </svg>
              Descargar lista en PDF
            </a>
            <a
              href="/pdfs/catalogo.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-forest-700 hover:text-forest-900 underline underline-offset-4 decoration-forest-300"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" />
              </svg>
              Catálogo con fotos
            </a>
          </div>
        </div>
      </section>

      {/* Price table */}
      <section className="px-6 lg:px-10 py-16">
        <div className="max-w-6xl mx-auto">
          <PriceTable products={PRODUCTS} />

          {/* Conditions footer */}
          <div className="mt-20 p-8 bg-forest-50 rounded-sm border border-forest-100">
            <h3 className="font-serif text-2xl text-forest-800 mb-4">
              Condiciones mayoristas
            </h3>
            <ul className="space-y-2 text-sm text-forest-700 leading-relaxed">
              <li>
                · Lista orientativa para viveristas, comercios, paisajistas y compras por volumen.
              </li>
              <li>
                · Precios expresados en pesos argentinos. Sujetos a
                modificación sin previo aviso.
              </li>
              <li>
                · Disponibilidad sujeta a stock del día. Siempre confirmamos
                antes de cerrar pedido.
              </li>
              <li>
                · Envíos en Gran Mendoza a coordinar según zona y volumen.
                Retiro coordinado en el vivero.
              </li>
              <li>
                · Productos a pedido: consultar especies, tamaños o materiales
                que no figuren en la lista, según temporada y proveedor.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <WhatsAppFloat context="mayorista" />
      <CartFAB mode="mayorista" />
    </main>
    </PublicShell>
  );
}

function Cond({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-bone p-4">
      <p className="text-xs uppercase tracking-wider text-forest-500">{label}</p>
      <p className="text-sm text-forest-800 mt-1 font-medium">{value}</p>
    </div>
  );
}
