import AdminShell from "@/components/admin/AdminShell";
import Link from "next/link";
import { selectRows } from "@/lib/backoffice/supabase-rest";
import type { Payment } from "@/lib/backoffice/types";
import { money, shortDate, statusLabel } from "@/lib/backoffice/format";

export const dynamic = "force-dynamic";

export default async function PaymentsPage() {
  const rows = await selectRows<Payment>("pa_payments", { select: "*", order: "created_at.desc" });
  const total = rows.reduce((acc, row) => acc + Number(row.received_amount || 0), 0);
  return (
    <AdminShell>
      <div className="space-y-8">
      <div><h1 className="text-4xl font-semibold">Pagos y rendiciones</h1><p className="mt-2 text-neutral-600">Rendiciones recibidas desde consignaciones y otros cobros asociados.</p></div>
      <div className="rounded-[1.5rem] border border-emerald-900/10 bg-white p-5 shadow-sm"><p className="text-sm text-neutral-500">Total registrado</p><p className="mt-2 text-3xl font-semibold">{money(total)}</p></div>
      <section className="rounded-[1.5rem] border border-emerald-900/10 bg-white p-5 shadow-sm"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-xs uppercase tracking-wide text-neutral-500"><tr><th className="py-3">Fecha</th><th>Tipo</th><th>Monto</th><th>Método</th><th>Estado</th><th>Referencia</th></tr></thead><tbody className="divide-y divide-neutral-100">{rows.map((p) => <tr key={p.id}><td className="py-3">{shortDate(p.created_at)}</td><td>{p.reference_type === "consignment" ? <Link className="underline" href={`/admin/consignaciones/${p.reference_id}`}>Consignación</Link> : p.reference_type}</td><td className="font-semibold">{money(p.received_amount)}</td><td>{p.method}</td><td className="capitalize">{statusLabel(p.status)}</td><td>{p.external_reference || p.notes || "—"}</td></tr>)}</tbody></table></div></section>
      </div>
    </AdminShell>
  );
}
