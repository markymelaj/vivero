import Link from "next/link";
import { requireSession } from "@/lib/backoffice/auth";

const nav = [
  ["/admin", "Dashboard"],
  ["/admin/consignaciones", "Consignaciones"],
  ["/admin/aliados", "Aliados"],
  ["/admin/productos", "Productos"],
  ["/admin/pagos", "Pagos"],
  ["/admin/comisiones", "Comisiones"],
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = requireSession();
  return (
    <div className="min-h-screen bg-[#f3f4ea] text-emerald-950">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-emerald-900/10 bg-white/85 p-6 lg:block">
        <Link href="/" className="text-2xl font-semibold tracking-wide">PAESAGGIO</Link>
        <p className="mt-1 text-sm text-neutral-500">Control comercial</p>
        <nav className="mt-8 space-y-2">
          {nav.map(([href, label]) => (
            <Link key={href} href={href} className="block rounded-2xl px-4 py-3 text-sm font-medium hover:bg-emerald-900 hover:text-white">
              {label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-6 left-6 right-6 rounded-3xl bg-emerald-950 p-4 text-white">
          <p className="text-sm font-semibold">{session.full_name}</p>
          <p className="text-xs text-white/70">{session.email}</p>
          <Link href="/admin/logout" className="mt-3 inline-block text-xs underline">Cerrar sesión</Link>
        </div>
      </aside>
      <header className="sticky top-0 z-20 border-b border-emerald-900/10 bg-white/90 px-4 py-4 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <Link href="/admin" className="font-semibold">PAESAGGIO</Link>
          <Link href="/admin/logout" className="text-xs underline">Salir</Link>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {nav.map(([href, label]) => <Link key={href} href={href} className="whitespace-nowrap rounded-full bg-emerald-900/10 px-3 py-2 text-xs">{label}</Link>)}
        </div>
      </header>
      <main className="lg:pl-72">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
