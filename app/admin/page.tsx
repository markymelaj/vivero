import Link from "next/link";
import { selectRows } from "@/lib/backoffice/supabase-rest";
import type { ConsignmentSummary, Partner, Product, Commission } from "@/lib/backoffice/types";
import { money, statusLabel } from "@/lib/backoffice/format";

export const dynamic = "force-dynamic";

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-[1.5rem] border border-emerald-900/10 bg-white p-5 shadow-sm">
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-emerald-950">{value}</p>
      {hint ? <p className="mt-2 text-xs text-neutral-500">{hint}</p> : null}
    </div>
  );
}

export default async function AdminDashboard() {
  const [consignments, partners, products, commissions] = await Promise.all([
    selectRows<ConsignmentSummary>("pa_v_consignments_summary", { select: "*", order: "created_at.desc", limit: 8 }),
    selectRows<Partner>("pa_partners", { select: "*", active: "eq.true" }),
    selectRows<Product>("pa_products", { select: "id,stock_owned,stock_consigned,active", active: "eq.true" }),
    selectRows<Commission>("pa_commissions", { select: "*", status: "eq.pendiente" }),
  ]);

  const totalSold = consignments.reduce((acc, row) => acc + Number(row.total_sold || 0), 0);
  const pending = consignments.reduce((acc, row) => acc + Number(row.pending_to_render || 0), 0);
  const consignedUnits = products.reduce((acc, row) => acc + Number(row.stock_consigned || 0), 0);
  const pendingCommissions = commissions.reduce((acc, row) => acc + Number(row.amount || 0), 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-800">Panel privado</p>
          <h1 className="mt-2 text-4xl font-semibold">Control y trazabilidad</h1>
          <p className="mt-2 max-w-2xl text-neutral-600">Consignaciones, ventas registradas por aliados, stock restante, rendiciones, pagos y comisiones.</p>
        </div>
        <Link href="/admin/consignaciones/nueva" className="rounded-full bg-emerald-900 px-5 py-3 text-sm font-semibold text-white">Nueva consignación</Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="Vendido en consignación" value={money(totalSold)} hint="Según ventas registradas" />
        <Stat label="Pendiente de rendir" value={money(pending)} hint="Saldo por cobrar a aliados" />
        <Stat label="Unidades consignadas" value={String(consignedUnits)} hint="Stock fuera del vivero" />
        <Stat label="Comisiones pendientes" value={money(pendingCommissions)} hint="Vendedores / referidos" />
      </div>

      <section className="rounded-[1.5rem] border border-emerald-900/10 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Últimas consignaciones</h2>
          <Link href="/admin/consignaciones" className="text-sm font-medium text-emerald-800 underline">Ver todo</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="py-3">Código</th><th>Aliado</th><th>Estado</th><th>Vendido</th><th>A rendir</th><th>Restante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {consignments.map((row) => (
                <tr key={row.id}>
                  <td className="py-3 font-medium"><Link href={`/admin/consignaciones/${row.id}`} className="underline">{row.code}</Link></td>
                  <td>{row.partner_name}</td>
                  <td className="capitalize">{statusLabel(row.status)}</td>
                  <td>{money(row.total_sold)}</td>
                  <td>{money(row.pending_to_render)}</td>
                  <td>{row.total_units_remaining} u.</td>
                </tr>
              ))}
              {!consignments.length ? <tr><td className="py-6 text-neutral-500" colSpan={6}>Todavía no hay consignaciones.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
