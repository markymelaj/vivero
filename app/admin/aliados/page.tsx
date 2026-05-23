import Link from "next/link";
import { createPartnerAction } from "@/lib/backoffice/actions";
import { selectRows } from "@/lib/backoffice/supabase-rest";
import type { AppUser, Partner } from "@/lib/backoffice/types";

export const dynamic = "force-dynamic";

const types = [
  ["pet_shop", "Pet shop"], ["corralon", "Corralón"], ["vivero", "Vivero"], ["ferreteria", "Ferretería"], ["arquitecto", "Arquitecto"], ["paisajista", "Paisajista"], ["comercio", "Comercio"], ["cliente", "Cliente"],
];

export default async function PartnersPage() {
  const [partners, sellers] = await Promise.all([
    selectRows<Partner>("pa_partners", { select: "*", order: "created_at.desc" }),
    selectRows<AppUser>("pa_app_users", { select: "id,full_name,email,role,commission_rate,active", active: "eq.true", role: "eq.vendedor" }),
  ]);
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-semibold">Aliados y clientes</h1>
        <p className="mt-2 text-neutral-600">Pet shops, corralones, viveros, arquitectos, vendedores y comercios con acuerdo.</p>
      </div>

      <section className="rounded-[1.5rem] border border-emerald-900/10 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold">Nuevo aliado</h2>
        <form action={createPartnerAction} className="mt-5 grid gap-4 md:grid-cols-3">
          <label className="text-sm font-medium">Tipo
            <select name="type" className="mt-2 w-full rounded-2xl border border-neutral-200 px-3 py-3">
              {types.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium">Nombre comercial
            <input name="business_name" required className="mt-2 w-full rounded-2xl border border-neutral-200 px-3 py-3" placeholder="Pet Shop Los Andes" />
          </label>
          <label className="text-sm font-medium">Responsable
            <input name="contact_name" className="mt-2 w-full rounded-2xl border border-neutral-200 px-3 py-3" />
          </label>
          <label className="text-sm font-medium">WhatsApp
            <input name="whatsapp" className="mt-2 w-full rounded-2xl border border-neutral-200 px-3 py-3" />
          </label>
          <label className="text-sm font-medium">Email
            <input name="email" type="email" className="mt-2 w-full rounded-2xl border border-neutral-200 px-3 py-3" />
          </label>
          <label className="text-sm font-medium">Zona
            <input name="zone" className="mt-2 w-full rounded-2xl border border-neutral-200 px-3 py-3" placeholder="Maipú, Godoy Cruz..." />
          </label>
          <label className="text-sm font-medium md:col-span-2">Dirección
            <input name="address" className="mt-2 w-full rounded-2xl border border-neutral-200 px-3 py-3" />
          </label>
          <label className="text-sm font-medium">Acuerdo
            <select name="agreement_type" className="mt-2 w-full rounded-2xl border border-neutral-200 px-3 py-3">
              <option value="consignacion">Consignación</option>
              <option value="mayorista">Mayorista</option>
              <option value="mixto">Mixto</option>
              <option value="referidor">Referidor</option>
            </select>
          </label>
          <label className="text-sm font-medium">Comisión general %
            <input name="default_commission_rate" type="number" step="0.01" className="mt-2 w-full rounded-2xl border border-neutral-200 px-3 py-3" defaultValue="0" />
          </label>
          <label className="text-sm font-medium">Vendedor asociado
            <select name="seller_id" className="mt-2 w-full rounded-2xl border border-neutral-200 px-3 py-3">
              <option value="">Sin vendedor</option>
              {sellers.map((seller) => <option key={seller.id} value={seller.id}>{seller.full_name}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium md:col-span-3">Notas
            <textarea name="notes" className="mt-2 w-full rounded-2xl border border-neutral-200 px-3 py-3" rows={2} />
          </label>
          <div className="md:col-span-3"><button className="rounded-full bg-emerald-900 px-5 py-3 text-sm font-semibold text-white">Crear aliado</button></div>
        </form>
      </section>

      <section className="rounded-[1.5rem] border border-emerald-900/10 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold">Base de aliados</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-neutral-500"><tr><th className="py-3">Código</th><th>Nombre</th><th>Tipo</th><th>Zona</th><th>WhatsApp</th><th>Portal</th></tr></thead>
            <tbody className="divide-y divide-neutral-100">
              {partners.map((p) => (
                <tr key={p.id}>
                  <td className="py-3 font-medium">{p.code}</td><td>{p.business_name}</td><td>{p.type}</td><td>{p.zone || "—"}</td><td>{p.whatsapp || "—"}</td>
                  <td><Link className="text-emerald-800 underline" href={`/portal/${p.portal_token}`}>Abrir portal</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
