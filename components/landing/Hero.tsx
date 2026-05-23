import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { whatsappFromContext } from "@/lib/whatsapp";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] bg-bone overflow-hidden">
      {/* Decorative top-right accent */}
      <div className="absolute top-0 right-0 w-1/2 h-2/3 bg-forest-200/40 rounded-bl-[40%] -z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-32 md:pt-40 pb-12">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-end">
          {/* LEFT — text */}
          <div className="lg:col-span-7 animate-fade-up">
            <span className="eyebrow">Venta online · Mayorista · Gran Mendoza</span>

            <h1 className="display text-[14vw] md:text-[10vw] lg:text-[7.5rem] text-forest-800 mt-6 text-balance">
              Plantas, sustratos
              <br />
              <span className="italic text-forest-700">y soluciones verdes</span>
              <span className="text-forest-500">.</span>
            </h1>

            <p className="mt-8 text-lg md:text-xl text-forest-700 max-w-xl leading-relaxed text-pretty">
              Venta online desde Maipú para hogares, viveristas, comercios, arquitectos y proyectos. Confirmamos stock, coordinamos entregas y cotizamos por WhatsApp.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                href="/catalogo"
                className="group inline-flex items-center gap-2 px-7 py-4 bg-forest-800 text-bone hover:bg-forest-900 rounded-full transition-all hover:gap-3"
              >
                Comprar / cotizar
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/aliados"
                className="px-7 py-4 text-forest-800 hover:bg-forest-100 rounded-full transition-colors"
              >
                Mayorista / aliados →
              </Link>
            </div>
          </div>

          {/* RIGHT — image */}
          <div className="lg:col-span-5 relative animate-scale-in">
            <div className="relative aspect-[3/4] w-full max-w-md ml-auto rounded-sm overflow-hidden shadow-2xl shadow-forest-900/20">
              <Image
                src="/images/hero-strelitzia.jpg"
                alt="Strelitzia reginae floreciendo en Paesaggio Vivero"
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            {/* Floating caption */}
            <div className="absolute -bottom-6 -left-6 lg:left-0 bg-bone px-5 py-3 rounded-sm shadow-lg max-w-[180px]">
              <p className="font-serif italic text-forest-700 text-sm leading-tight">
                Strelitzia reginae
              </p>
              <p className="text-xs text-forest-500 mt-0.5">Ave del paraíso</p>
            </div>
          </div>
        </div>

        {/* Tiny meta row at bottom */}
        <div className="mt-20 lg:mt-32 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-forest-600 border-t border-forest-200 pt-6">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-forest-500" />
            Maipú · Gran Mendoza
          </span>
          <span>·</span>
          <span>Minorista · mayorista · aliados</span>
          <span>·</span>
          <span>Pedidos online y entregas coordinadas</span>
          <a
            href={whatsappFromContext("general")}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-forest-700 hover:text-forest-900 underline underline-offset-4 decoration-forest-300"
          >
            WhatsApp {SITE.whatsapp.display}
          </a>
        </div>
      </div>
    </section>
  );
}
