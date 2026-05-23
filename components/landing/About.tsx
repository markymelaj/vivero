import Image from "next/image";
import Link from "next/link";
import { whatsappFromContext } from "@/lib/whatsapp";

export function About() {
  return (
    <section className="relative py-24 md:py-36 px-6 lg:px-10 bg-forest-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] rounded-sm overflow-hidden shadow-xl shadow-forest-900/15">
              <Image
                src="/images/production-sansevieria.jpg"
                alt="Producción de Sansevieria en Paesaggio Vivero"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            {/* Overlay stat card */}
            <div className="absolute -bottom-8 -right-4 md:right-8 bg-bone p-6 rounded-sm shadow-2xl max-w-[260px]">
              <p className="display text-5xl text-forest-800 leading-none">+20</p>
              <p className="text-sm text-forest-600 mt-2 leading-tight">
                años produciendo y diseñando jardines en Mendoza
              </p>
            </div>
          </div>

          {/* Copy */}
          <div className="lg:col-span-6">
            <span className="eyebrow">Quiénes somos</span>
            <h2 className="display text-5xl md:text-6xl text-forest-800 mt-4 text-balance">
              Cultivamos
              <span className="italic text-forest-600"> en Mendoza</span>,
              con foco en la sanidad de cada planta.
            </h2>

            <div className="mt-8 space-y-5 text-forest-700 text-lg leading-relaxed text-pretty">
              <p>
                En Paesaggio Vivero combinamos producción propia, asesoramiento
                técnico y mirada paisajística. Trabajamos con viveristas, 
                paisajistas, arquitectos y desarrollos privados que necesitan 
                proveedores serios y plantas que respondan en obra.
              </p>
              <p>
                Desde suculentas resistentes hasta especies para proyectos de
                paisajismo, te acompañamos en la selección, los volúmenes y la
                logística.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 max-w-md">
              <Stat label="Plantas producidas al año" value="+50.000" />
              <Stat label="Especies en stock" value="+200" />
              <Stat label="Mayorista y minorista" value="B2B · B2C" />
              <Stat label="Ubicación" value="Russell · Maipú" />
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href={whatsappFromContext("asesoria")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-forest-800 underline underline-offset-4 decoration-forest-300 hover:decoration-forest-700"
              >
                Coordinar una asesoría →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l border-forest-300 pl-4">
      <p className="font-serif text-2xl text-forest-800 leading-tight">{value}</p>
      <p className="text-xs text-forest-600 mt-1 uppercase tracking-wider">{label}</p>
    </div>
  );
}
