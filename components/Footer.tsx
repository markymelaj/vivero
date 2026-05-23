import Link from "next/link";
import { Logo } from "./Logo";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer id="contacto" className="bg-forest-800 text-bone mt-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div className="grid md:grid-cols-12 gap-12">
          {/* Brand block */}
          <div className="md:col-span-5">
            <Logo variant="full" color="light" className="text-3xl" />
            <p className="mt-6 font-serif text-2xl text-forest-100 leading-snug max-w-md">
              Venta online, mayorista y red comercial en Gran Mendoza.
            </p>
            <p className="mt-4 text-sm text-forest-200 max-w-md">
              Plantas, sustratos, tierra preparada, chips y cortezas para clientes finales, viveristas, comercios, arquitectos y proyectos.
            </p>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <h3 className="font-serif text-lg text-bone mb-5">Contacto</h3>
            <ul className="space-y-3 text-sm text-forest-100">
              <li>
                <a
                  href={`https://wa.me/${SITE.whatsapp.number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-bone transition-colors inline-flex items-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.4-1.4-.9-.8-1.4-1.8-1.6-2.1-.2-.3 0-.4.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.6-1.5-.8-2.1-.2-.5-.4-.4-.6-.5h-.5c-.2 0-.5.1-.7.3-.3.3-1 .9-1 2.3 0 1.4 1 2.7 1.1 2.9.1.2 2 3 4.7 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.2-.2-.5-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.4c1.4.8 3.1 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2z"/>
                  </svg>
                  {SITE.whatsapp.display}
                </a>
              </li>
              <li className="text-forest-200">{SITE.hoursWhatsApp}</li>
              <li className="pt-2">
                <a
                  href={SITE.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-bone transition-colors inline-flex items-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                  </svg>
                  @paesaggio_vivero
                </a>
              </li>
            </ul>
          </div>

          {/* Visit */}
          <div className="md:col-span-3">
            <h3 className="font-serif text-lg text-bone mb-5">Visitanos</h3>
            <p className="text-sm text-forest-100 leading-relaxed">
              {SITE.location} · {SITE.area}
              <br />
              <span className="text-forest-200 mt-2 block">{SITE.hoursVivero}</span>
            </p>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-forest-700/50 flex flex-col md:flex-row justify-between gap-3 text-xs text-forest-200">
          <div className="flex gap-5">
            <Link href="/catalogo" className="hover:text-bone transition-colors">Catálogo</Link>
            <Link href="/mayorista" className="hover:text-bone transition-colors">Lista mayorista</Link>
            <Link href="/aliados" className="hover:text-bone transition-colors">Aliados</Link>
          </div>
          <div>© {new Date().getFullYear()} Paesaggio · Vivero & Paisajismo</div>
        </div>
      </div>
    </footer>
  );
}
