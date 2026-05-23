import Link from "next/link";
import { notFound } from "next/navigation";
import { registerPortalSaleAction } from "@/lib/backoffice/actions";
import { eq, selectRows } from "@/lib/backoffice/supabase-rest";
import type { ConsignmentItemStatus, ConsignmentSummary, Partner } from "@/lib/backoffice/types";
import { money, statusLabel } from "@/lib/backoffice/format";

export const dynamic = "force-dynamic";

export default async function PartnerPortalPage({ params }: { params: { token: string } }) {
  const partners = await selectRows<Partner>("pa_partners", { select: "*", portal_token: eq(params.token), active: "eq.true", limit: 1 });
  const partner = partners[0];
  if (!partner) notFound();
  const consignments = await selectRows<ConsignmentSummary>("pa_v_consignments_summary", { select: "*", partner_id: eq(partner.id), order: "created_at.desc" });
  const active = consignments.find((c) => !["cerrada", "rendida"].includes(c.status)) || consignments[0];
  const items = active ? await selectRows<ConsignmentItemStatus>("pa_v_consignment_items_status", { select: "*", consignment_id: eq(active.id), order: "product_name.asc" }) : [];

  return (
    <main className="min-h-screen bg-[#f3f4ea] px-4 py-8 text-emerald-950">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-[2rem] border border-emerald-900/10 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-800">Portal aliado Paesaggio</p>
          <h1 className="mt-2 text-3xl font-semibold">{partner.business_name}</h1>
          <p className="mt-2 text-neutral-600">Desde acá podés ver stock recibido, registrar ventas y controlar cuánto queda pendiente de rendir.</p>
        </header>

        {active ? (
          <>
            <section className="grid gap-4 md:grid-cols-4">
              <Card label="Consignación" value={active.code} />
              <Card label="Vendido" value={money(active.total_sold)} />
              <Card label="Pendiente de rendir" value={money(active.pending_to_render)} />
              <Card label="Stock restante" value={`${active.total_units_remaining} u.`} />
            </section>
            <section className="rounded-[2rem] border border-emerald-900/10 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Mi stock actual</h2>
              <div className="mt-4 overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-xs uppercase tracking-wide text-neutral-500"><tr><th className="py-3">Producto</th><th>Recibido</th><th>Vendido</th><th>Disponible</th><th>A rendir/u</th></tr></thead><tbody className="divide-y divide-neutral-100">{items.map((item) => <tr key={item.id}><td className="py-3 font-medium">{item.product_name} · {item.presentation}</td><td>{item.quantity_delivered}</td><td>{item.quantity_sold}</td><td>{item.quantity_remaining}</td><td>{money(item.render_price)}</td></tr>)}</tbody></table></div>
            </section>
            <section className="rounded-[2rem] border border-emerald-900/10 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Registrar venta</h2>
              <p className="mt-1 text-sm text-neutral-500">Cargá solamente los productos vendidos. Paesaggio verá el movimiento y el cálculo de rendición.</p>
              <form action={registerPortalSaleAction} className="mt-4 space-y-3">
                <input type="hidden" name="token" value={params.token} />
                <input type="hidden" name="consignment_id" value={active.id} />
                {items.map((item) => (
                  <div key={item.id} className="grid gap-3 rounded-2xl bg-[#f5f5ed] p-3 md:grid-cols-[1.5fr_0.5fr_0.7fr]">
                    <input type="hidden" name="consignment_item_id" value={item.id} />
                    <div className="text-sm"><p className="font-medium">{item.product_name}</p><p className="text-neutral-500">Disponible: {item.quantity_remaining}</p></div>
                    <input name="quantity" type="number" min="0" max={item.quantity_remaining} placeholder="Cant." className="rounded-xl border border-neutral-200 px-3 py-2" />
                    <input name="sale_price" type="number" placeholder="Precio venta" defaultValue={item.suggested_price} className="rounded-xl border border-neutral-200 px-3 py-2" />
                  </div>
                ))}
                <textarea name="notes" rows={2} placeholder="Observación" className="w-full rounded-2xl border border-neutral-200 px-3 py-3" />
                <button className="rounded-full bg-emerald-900 px-5 py-3 text-sm font-semibold text-white">Enviar venta registrada</button>
              </form>
            </section>
          </>
        ) : (
          <section className="rounded-[2rem] border border-emerald-900/10 bg-white p-6 shadow-sm"><p>No tenés consignaciones activas todavía.</p></section>
        )}

        <section className="rounded-[2rem] border border-emerald-900/10 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Historial</h2>
          <div className="mt-4 space-y-2">{consignments.map((c) => <div key={c.id} className="flex flex-wrap justify-between gap-3 rounded-2xl bg-[#f5f5ed] p-3 text-sm"><span>{c.code} · <span className="capitalize">{statusLabel(c.status)}</span></span><span>Vendido {money(c.total_sold)} · pendiente {money(c.pending_to_render)}</span></div>)}</div>
        </section>
        <Link href="/" className="inline-block text-sm underline">Volver a Paesaggio</Link>
      </div>
    </main>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return <div className="rounded-[1.5rem] border border-emerald-900/10 bg-white p-5 shadow-sm"><p className="text-sm text-neutral-500">{label}</p><p className="mt-2 text-2xl font-semibold">{value}</p></div>;
}
