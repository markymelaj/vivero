import AdminShell from "@/components/admin/AdminShell";
import { markCommissionPaidAction } from "@/lib/backoffice/actions";
import { selectRows } from "@/lib/backoffice/supabase-rest";
import type { Commission } from "@/lib/backoffice/types";
import { money, shortDate, statusLabel } from "@/lib/backoffice/format";

export const dynamic = "force-dynamic";

export default async function CommissionsPage() {
  const rows = await selectRows<Commission>("pa_commissions", { select: "*,pa_app_users(full_name,email),pa_partners(business_name)", order: "created_at.desc" });
  const pending = rows.filter((row) => row.status === "pendiente").reduce((acc, row) => acc + Number(row.amount || 0), 0);
  return (
    <AdminShell>
      <div className="space-y-8">
      <div><h1 className="text-4xl font-semibold">Comisiones</h1><p className="mt-2 text-neutral-600">Comisiones generadas solo cuando hay rendición/pago confirmado.</p></div>
      <div className="rounded-[1.5rem] border border-emerald-900/10 bg-white p-5 shadow-sm"><p className="text-sm text-neutral-500">Pendiente de pagar</p><p className="mt-2 text-3xl font-semibold">{money(pending)}</p></div>
      <section className="rounded-[1.5rem] border border-emerald-900/10 bg-white p-5 shadow-sm"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-xs uppercase tracking-wide text-neutral-500"><tr><th className="py-3">Fecha</th><th>Beneficiario</th><th>Aliado</th><th>Base</th><th>%</th><th>Comisión</th><th>Estado</th><th></th></tr></thead><tbody className="divide-y divide-neutral-100">{rows.map((c) => <tr key={c.id}><td className="py-3">{shortDate(c.created_at)}</td><td>{c.pa_app_users?.full_name || "—"}</td><td>{c.pa_partners?.business_name || "—"}</td><td>{money(c.base_amount)}</td><td>{c.rate}%</td><td className="font-semibold">{money(c.amount)}</td><td className="capitalize">{statusLabel(c.status)}</td><td>{c.status !== "pagada" ? <form action={markCommissionPaidAction}><input type="hidden" name="commission_id" value={c.id} /><button className="rounded-full border border-emerald-900 px-3 py-1 text-xs font-semibold text-emerald-900">Marcar pagada</button></form> : "—"}</td></tr>)}</tbody></table></div></section>
      </div>
    </AdminShell>
  );
}
