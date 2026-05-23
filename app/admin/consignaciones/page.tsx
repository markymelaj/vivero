import AdminShell from "@/components/admin/AdminShell";
import Link from "next/link";
import { selectRows } from "@/lib/backoffice/supabase-rest";
import type { ConsignmentSummary } from "@/lib/backoffice/types";
import { money, shortDate, statusLabel } from "@/lib/backoffice/format";

export const dynamic = "force-dynamic";

export default async function ConsignmentsPage() {
  const rows = await selectRows<ConsignmentSummary>("pa_v_consignments_summary", { select: "*", order: "created_at.desc" });
  return (
    <AdminShell>
      <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div><h1 className="text-4xl font-semibold">Consignaciones</h1><p className="mt-2 text-neutral-600">Control completo: entregado, vendido, comisión local, monto a rendir y stock restante.</p></div>
        <Link href="/admin/consignaciones/nueva" className="rounded-full bg-emerald-900 px-5 py-3 text-sm font-semibold text-white">Nueva consignación</Link>
      </div>
      <section className="rounded-[1.5rem] border border-emerald-900/10 bg-white p-5 shadow-sm">
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-xs uppercase tracking-wide text-neutral-500"><tr><th className="py-3">Código</th><th>Aliado</th><th>Estado</th><th>Vendido</th><th>A rendir</th><th>Rendido</th><th>Pendiente</th><th>Restante</th><th>Revisión</th></tr></thead><tbody className="divide-y divide-neutral-100">{rows.map((r) => <tr key={r.id}><td className="py-3 font-medium"><Link className="underline" href={`/admin/consignaciones/${r.id}`}>{r.code}</Link></td><td>{r.partner_name}</td><td className="capitalize">{statusLabel(r.status)}</td><td>{money(r.total_sold)}</td><td>{money(r.total_to_render)}</td><td>{money(r.total_rendered)}</td><td>{money(r.pending_to_render)}</td><td>{r.total_units_remaining} u.</td><td>{shortDate(r.review_date)}</td></tr>)}{!rows.length ? <tr><td colSpan={9} className="py-8 text-neutral-500">No hay consignaciones todavía.</td></tr> : null}</tbody></table></div>
      </section>
      </div>
    </AdminShell>
  );
}
