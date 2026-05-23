import Image from "next/image";
import Link from "next/link";
import { getFeatured } from "@/lib/products";
import { whatsappFromContext } from "@/lib/whatsapp";

export function Featured() {
  const featured = getFeatured();

  return (
    <section className="py-24 md:py-36 px-6 lg:px-10 bg-forest-50">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-16">
          <span className="eyebrow">Destacados</span>
          <h2 className="display text-5xl md:text-6xl text-forest-800 mt-4 text-balance">
            Lo que más nos están
            <span className="italic text-forest-600"> pidiendo</span>.
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featured.map((p) => (
            <Link
              key={p.slug}
              href={`/catalogo?cat=${p.category}`}
              className="group block"
            >
              <div className="relative aspect-square rounded-sm overflow-hidden bg-forest-100">
                <Image
                  src={`/images/catalog/${p.image}`}
                  alt={p.name}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="mt-4">
                <p className="font-serif text-lg text-forest-800 leading-tight">
                  {p.name}
                </p>
                {p.scientificName && (
                  <p className="text-xs italic text-forest-500 mt-0.5">
                    {p.scientificName}
                  </p>
                )}
                <p className="text-xs text-forest-600 mt-2">
                  {p.presentations.map((pr) => pr.size).join(" · ")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function B2BCallout() {
  return (
    <section className="py-24 md:py-32 px-6 lg:px-10 bg-forest-800 text-bone relative overflow-hidden">
      {/* Decorative wave at bottom — echoes the catalog cover */}
      <svg
        className="absolute bottom-0 left-0 w-full text-forest-700/40"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,60 C300,120 600,0 900,60 C1050,90 1150,40 1200,60 L1200,120 L0,120 Z"
          fill="currentColor"
        />
      </svg>

      <div className="relative max-w-5xl mx-auto text-center">
        <span className="eyebrow text-forest-200">Mayorista</span>
        <h2 className="display text-5xl md:text-7xl mt-4 text-balance">
          ¿Querés vender,
          <br />
          <span className="italic text-forest-200">comprar por volumen o aliarte?</span>
        </h2>
        <p className="mt-8 text-lg md:text-xl text-forest-100 max-w-2xl mx-auto leading-relaxed">
          Trabajamos con clientes finales, viveristas, arquitectos, corralones, pet shops y vendedores externos. Todo pedido se confirma por stock, pago y entrega coordinada.
        </p>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link
            href="/aliados"
            className="px-8 py-4 bg-bone text-forest-900 hover:bg-forest-100 rounded-full transition-colors font-medium"
          >
            Ver propuesta de aliados
          </Link>
          <a
            href={whatsappFromContext("mayorista")}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 border border-forest-300 text-bone hover:bg-forest-700 rounded-full transition-colors"
          >
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
