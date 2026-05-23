import { PublicShell } from "@/components/PublicShell";
import type { Metadata } from "next";
import Link from "next/link";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { whatsappFromContext } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Aliados comerciales",
  description:
    "Propuesta comercial Paesaggio para vendedores, comercios aliados, viveristas, arquitectos, paisajistas y proyectos en Gran Mendoza.",
};

const CHANNELS = [
  {
    title: "Viveristas y compras por volumen",
    eyebrow: "Mayorista",
    text:
      "Lista profesional, disponibilidad semanal, precios por cantidad y retiro o entrega coordinada en Gran Mendoza.",
    bullets: ["Plantas y árboles", "Sustratos, tierra, chips y cortezas", "Productos a pedido según temporada"],
    cta: "Pedir lista mayorista",
    href: whatsappFromContext("mayorista", "Canal: WEB-ALIADOS-MAYORISTA"),
  },
  {
    title: "Arquitectos y paisajistas",
    eyebrow: "Proyectos",
    text:
      "Cotización de especies, sustratos y terminaciones verdes para casas, patios, locales, obras y espacios comerciales.",
    bullets: ["Cotización por proyecto", "Entrega a obra", "Selección de especies según uso y mantenimiento"],
    cta: "Cotizar proyecto",
    href: whatsappFromContext("arquitectos", "Canal: WEB-ALIADOS-ARQ"),
  },
  {
    title: "Corralones, pet shops y comercios",
    eyebrow: "Puntos de venta",
    text:
      "Línea de tierra preparada, sustratos, humus, chips y cortezas para sumar a local bajo compra mayorista o consignación controlada.",
    bullets: ["Reposición coordinada", "Stock registrado", "Ideal para góndola o exhibición simple"],
    cta: "Quiero vender Paesaggio",
    href: whatsappFromContext("comercio", "Canal: WEB-ALIADOS-COMERCIO"),
  },
  {
    title: "Vendedores externos",
    eyebrow: "Comisión",
    text:
      "Sistema con código de vendedor, pedidos registrados y comisión sobre ventas cobradas y entregadas.",
    bullets: ["Sin manejo informal de dinero", "Comisión por venta real", "Catálogo digital para compartir"],
    cta: "Quiero vender por comisión",
    href: whatsappFromContext("vendedor", "Canal: WEB-ALIADOS-VENDEDOR"),
  },
];

const STEPS = [
  {
    title: "1. Consulta o pedido",
    text: "El cliente, comercio, vendedor o profesional consulta por WhatsApp, catálogo o recomendación.",
  },
  {
    title: "2. Confirmación de stock",
    text: "Antes de cobrar, se confirma disponibilidad real, presentación, precio y zona de entrega.",
  },
  {
    title: "3. Pago o reserva",
    text: "La venta se registra y se coordina el pago. Los vendedores derivan pedidos; no se improvisa el cobro.",
  },
  {
    title: "4. Preparación y entrega",
    text: "El equipo local prepara, fotografía y coordina retiro o delivery con estado de seguimiento.",
  },
  {
    title: "5. Comisión o reposición",
    text: "Si hubo vendedor, aliado o consignación, se calcula comisión/rendición solo sobre venta efectiva.",
  },
];

export default function AliadosPage() {
  return (
    <PublicShell>
      <main className="bg-bone min-h-screen pb-24">
      <section className="pt-32 md:pt-40 pb-16 px-6 lg:px-10 bg-forest-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-forest-200/40 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-8">
            <span className="eyebrow">Sistema comercial Paesaggio</span>
            <h1 className="display text-6xl md:text-8xl text-forest-800 mt-4 text-balance">
              Vendé, comprá o
              <span className="italic text-forest-600"> trabajemos juntos</span>.
            </h1>
            <p className="mt-8 text-lg md:text-xl text-forest-700 max-w-3xl leading-relaxed text-pretty">
              Paesaggio trabaja con venta online, mayoristas, arquitectos,
              paisajistas, comercios aliados y vendedores externos. La operación
              se ordena por WhatsApp, catálogo, confirmación de stock, pago y
              entrega coordinada en Gran Mendoza.
            </p>
          </div>
          <div className="lg:col-span-4 bg-bone border border-forest-100 rounded-sm p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.18em] text-forest-500">Contacto directo</p>
            <p className="mt-4 font-serif text-3xl text-forest-800">WhatsApp comercial</p>
            <p className="mt-2 text-forest-700">261 419-1619 · Maipú, Mendoza</p>
            <a
              href={whatsappFromContext("aliados", "Canal: WEB-ALIADOS-HERO")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex w-full justify-center px-6 py-3 bg-forest-800 text-bone hover:bg-forest-900 rounded-full transition-colors"
            >
              Escribir ahora
            </a>
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-10 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12">
            <span className="eyebrow">Canales comerciales</span>
            <h2 className="display text-5xl md:text-6xl text-forest-800 mt-4 text-balance">
              Cuatro formas de
              <span className="italic text-forest-600"> trabajar con Paesaggio</span>.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {CHANNELS.map((item) => (
              <article key={item.title} className="bg-white/60 border border-forest-100 rounded-sm p-7 md:p-8">
                <span className="text-xs uppercase tracking-[0.18em] text-forest-500">{item.eyebrow}</span>
                <h3 className="mt-4 font-serif text-3xl text-forest-800">{item.title}</h3>
                <p className="mt-4 text-forest-700 leading-relaxed">{item.text}</p>
                <ul className="mt-6 space-y-2 text-sm text-forest-700">
                  {item.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-forest-500 flex-shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-flex px-5 py-3 bg-forest-800 text-bone hover:bg-forest-900 rounded-full transition-colors text-sm"
                >
                  {item.cta}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-10 py-20 bg-forest-800 text-bone">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <span className="eyebrow text-forest-200">Operación controlada</span>
            <h2 className="display text-5xl md:text-6xl mt-4 text-balance">
              Del pedido a la entrega,
              <span className="italic text-forest-200"> sin perder control</span>.
            </h2>
            <p className="mt-6 text-forest-100 leading-relaxed">
              Cada venta debe quedar registrada: origen, cliente, productos,
              pago, entrega, responsable y comisión. Esto permite vender a
              distancia sin depender de conversaciones sueltas.
            </p>
          </div>
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-px bg-forest-700 border border-forest-700">
            {STEPS.map((step) => (
              <div key={step.title} className="bg-forest-800 p-6">
                <h3 className="font-serif text-2xl text-bone">{step.title}</h3>
                <p className="mt-3 text-sm text-forest-100 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-10 py-20">
        <div className="max-w-5xl mx-auto text-center">
          <span className="eyebrow">Listas y catálogo</span>
          <h2 className="display text-5xl md:text-6xl text-forest-800 mt-4 text-balance">
            Pedidos simples,
            <span className="italic text-forest-600"> cotización rápida</span>.
          </h2>
          <p className="mt-6 text-forest-700 max-w-2xl mx-auto leading-relaxed">
            Usá el catálogo para armar consultas minoristas o la lista mayorista
            para viveristas y compras por volumen. Si no está en lista, también
            se puede consultar por productos a pedido.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/catalogo" className="px-7 py-4 bg-forest-800 text-bone rounded-full hover:bg-forest-900 transition-colors">
              Ver catálogo
            </Link>
            <Link href="/mayorista" className="px-7 py-4 border border-forest-300 text-forest-800 rounded-full hover:bg-forest-50 transition-colors">
              Ver mayorista
            </Link>
          </div>
        </div>
      </section>

      <WhatsAppFloat context="aliados" />
    </main>
    </PublicShell>
  );
}
