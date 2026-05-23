import AdminShell from "@/components/admin/AdminShell";
import Link from "next/link";
import { notFound } from "next/navigation";
import { registerConsignmentAdjustmentAction, registerConsignmentPaymentAction, registerConsignmentSaleAction } from "@/lib/backoffice/actions";
import { eq, selectRows } from "@/lib/backoffice/supabase-rest";
import type { ConsignmentItemStatus, ConsignmentSummary, Payment } from "@/lib/backoffice/types";
import { money, shortDate, statusLabel } from "@/lib/backoffice/format";

export const dynamic = "force-dynamic";

export default async function ConsignmentDetailPage({ params }: { params: { id: string } }) {
  const [summaryRows, items, payments] = await Promise.all([
    selectRows<ConsignmentSummary>("pa_v_consignments_summary", { select: "*", id: eq(params.id), limit: 1 }),
    selectRows<ConsignmentItemStatus>("pa_v_consignment_items_status", { select: "*", consignment_id: eq(params.id), order: "product_name.asc" }),
    selectRows<Payment>("pa_payments", { select: "*", reference_type: "eq.consignment", reference_id: eq(params.id), order: "created_at.desc" }),
  ]);
  const summary = summaryRows[0];
  if (!summary) notFound();
  const portalPath = `/portal/${summary.portal_token}`;

  return (
    <AdminShell>
      <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <Link href="/admin/consignaciones" className="text-sm text-emerald-800 underline">← Volver</Link>
          <h1 className="mt-2 text-4xl font-semibold">{summary.code}</h1>
          <p className="mt-2 text-neutral-600">{summary.partner_name} · <span className="capitalize">{statusLabel(summary.status)}</span> · revisión {shortDate(summary.review_date)}</p>
        </div>
        <Link href={portalPath} className="rounded-full border border-emerald-900 px-5 py-3 text-sm font-semibold text-emerald-900">Portal aliado</Link>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Card label="Total vendido" value={money(summary.total_sold)} />
        <Card label="Debe rendir" value={money(summary.total_to_render)} />
        <Card label="Rendido" value={money(summary.total_rendered)} />
        <Card label="Pendiente" value={money(summary.pending_to_render)} />
        <Card label="Stock restante" value={`${summary.total_units_remaining} u.`} />
      </div>

      <section className="rounded-[1.5rem] border border-emerald-900/10 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold">Productos en consignación</h2>
        <div className="mt-4 overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-xs uppercase tracking-wide text-neutral-500"><tr><th className="py-3">Producto</th><th>Entregado</th><th>Vendido</th><th>Restante</th><th>Venta sugerida</th><th>A rendir/u</th><th>Comisión local/u</th><th>A rendir</th></tr></thead><tbody className="divide-y divide-neutral-100">{items.map((item) => <tr key={item.id}><td className="py-3 font-medium">{item.product_name} · {item.presentation}</td><td>{item.quantity_delivered}</td><td>{item.quantity_sold}</td><td>{item.quantity_remaining}</td><td>{money(item.suggested_price)}</td><td>{money(item.render_price)}</td><td>{money(item.local_commission_unit)}</td><td>{money(item.render_value)}</td></tr>)}</tbody></table></div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-[1.5rem] border border-emerald-900/10 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Registrar venta del aliado</h2>
          <p className="mt-1 text-sm text-neutral-500">Cada cantidad vendida descuenta stock restante y calcula total vendido, monto a rendir y comisión local.</p>
          <form action={registerConsignmentSaleAction} className="mt-4 space-y-3">
            <input type="hidden" name="consignment_id" value={summary.id} />
            {items.map((item) => (
              <div key={item.id} className="grid gap-3 rounded-2xl bg-[#f5f5ed] p-3 md:grid-cols-[1.5fr_0.5fr_0.7fr]">
                <input type="hidden" name="consignment_item_id" value={item.id} />
                <div className="text-sm"><p className="font-medium">{item.product_name}</p><p className="text-neutral-500">Disponible: {item.quantity_remaining} · a rendir/u: {money(item.render_price)}</p></div>
                <input name="quantity" type="number" min="0" max={item.quantity_remaining} placeholder="Cant." className="rounded-xl border border-neutral-200 px-3 py-2" />
                <input name="sale_price" type="number" placeholder="Precio venta" defaultValue={item.suggested_price} className="rounded-xl border border-neutral-200 px-3 py-2" />
              </div>
            ))}
            <textarea name="notes" rows={2} placeholder="Observación" className="w-full rounded-2xl border border-neutral-200 px-3 py-3" />
            <button className="rounded-full bg-emerald-900 px-5 py-3 text-sm font-semibold text-white">Registrar venta</button>
          </form>
        </section>

        <section className="rounded-[1.5rem] border border-emerald-900/10 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Registrar rendición / pago</h2>
          <form action={registerConsignmentPaymentAction} className="mt-4 grid gap-4">
            <input type="hidden" name="consignment_id" value={summary.id} />
            <input name="amount" type="number" step="0.01" placeholder="Monto recibido" className="rounded-2xl border border-neutral-200 px-3 py-3" />
            <select name="method" className="rounded-2xl border border-neutral-200 px-3 py-3"><option value="transferencia">Transferencia</option><option value="efectivo">Efectivo</option><option value="mercado_pago">Mercado Pago</option><option value="otro">Otro</option></select>
            <input name="external_reference" placeholder="Nº comprobante / referencia" className="rounded-2xl border border-neutral-200 px-3 py-3" />
            <textarea name="notes" rows={2} placeholder="Observación" className="rounded-2xl border border-neutral-200 px-3 py-3" />
            <button className="rounded-full bg-emerald-900 px-5 py-3 text-sm font-semibold text-white">Confirmar rendición</button>
          </form>
          <h3 className="mt-6 font-semibold">Pagos registrados</h3>
          <div className="mt-3 space-y-2">{payments.map((p) => <div key={p.id} className="rounded-2xl bg-[#f5f5ed] p-3 text-sm"><div className="flex justify-between"><span>{shortDate(p.created_at)} · {p.method}</span><strong>{money(p.received_amount)}</strong></div><p className="text-neutral-500">{p.external_reference || p.notes || "Sin referencia"}</p></div>)}{!payments.length ? <p className="text-sm text-neutral-500">Todavía no hay rendiciones.</p> : null}</div>
        </section>
      </div>

      <section className="rounded-[1.5rem] border border-emerald-900/10 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold">Ajustes de stock consignado</h2>
        <p className="mt-1 text-sm text-neutral-500">Para devoluciones, productos dañados o faltantes. Todo queda trazado como movimiento.</p>
        <form action={registerConsignmentAdjustmentAction} className="mt-4 grid gap-4 md:grid-cols-5">
          <input type="hidden" name="consignment_id" value={summary.id} />
          <select name="consignment_item_id" className="rounded-2xl border border-neutral-200 px-3 py-3 md:col-span-2">{items.map((item) => <option key={item.id} value={item.id}>{item.product_name} · disponible {item.quantity_remaining}</option>)}</select>
          <select name="type" className="rounded-2xl border border-neutral-200 px-3 py-3"><option value="devuelto">Devuelto</option><option value="danado">Dañado</option><option value="faltante">Faltante</option></select>
          <input name="quantity" type="number" min="1" placeholder="Cantidad" className="rounded-2xl border border-neutral-200 px-3 py-3" />
          <button className="rounded-full border border-emerald-900 px-5 py-3 text-sm font-semibold text-emerald-900">Registrar ajuste</button>
          <input name="notes" placeholder="Observación" className="rounded-2xl border border-neutral-200 px-3 py-3 md:col-span-5" />
        </form>
      </section>
      </div>
    </AdminShell>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return <div className="rounded-[1.5rem] border border-emerald-900/10 bg-white p-5 shadow-sm"><p className="text-sm text-neutral-500">{label}</p><p className="mt-2 text-2xl font-semibold">{value}</p></div>;
}
