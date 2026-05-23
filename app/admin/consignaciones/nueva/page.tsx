import { createConsignmentAction } from "@/lib/backoffice/actions";
import { selectRows } from "@/lib/backoffice/supabase-rest";
import type { AppUser, Partner, Product } from "@/lib/backoffice/types";

export const dynamic = "force-dynamic";

export default async function NewConsignmentPage() {
  const [partners, products, sellers] = await Promise.all([
    selectRows<Partner>("pa_partners", { select: "*", active: "eq.true", order: "business_name.asc" }),
    selectRows<Product>("pa_products", { select: "*", active: "eq.true", order: "category.asc,name.asc" }),
    selectRows<AppUser>("pa_app_users", { select: "id,full_name,email,role,commission_rate,active", active: "eq.true", role: "eq.vendedor" }),
  ]);
  return (
    <div className="space-y-8">
      <div><h1 className="text-4xl font-semibold">Nueva consignación</h1><p className="mt-2 text-neutral-600">Entrega productos a un pet shop, corralón, vivero o comercio aliado. El sistema calculará vendido, comisión y rendición.</p></div>
      <form action={createConsignmentAction} className="space-y-6 rounded-[1.5rem] border border-emerald-900/10 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <label className="text-sm font-medium">Aliado
            <select name="partner_id" required className="mt-2 w-full rounded-2xl border border-neutral-200 px-3 py-3"><option value="">Seleccionar</option>{partners.map((p) => <option key={p.id} value={p.id}>{p.business_name} · {p.type}</option>)}</select>
          </label>
          <label className="text-sm font-medium">Vendedor asociado
            <select name="seller_id" className="mt-2 w-full rounded-2xl border border-neutral-200 px-3 py-3"><option value="">Sin vendedor</option>{sellers.map((s) => <option key={s.id} value={s.id}>{s.full_name}</option>)}</select>
          </label>
          <label className="text-sm font-medium">Fecha revisión/rendición
            <input type="date" name="review_date" className="mt-2 w-full rounded-2xl border border-neutral-200 px-3 py-3" />
          </label>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Productos entregados</h2>
          <p className="mt-1 text-sm text-neutral-500">Precio sugerido = precio público. Valor a rendir = lo que el local debe pagar a Paesaggio por unidad vendida. Diferencia = comisión local.</p>
          <div className="mt-4 space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="grid gap-3 rounded-2xl bg-[#f5f5ed] p-3 md:grid-cols-[2fr_0.6fr_0.8fr_0.8fr]">
                <select name="product_id" className="rounded-xl border border-neutral-200 px-3 py-2"><option value="">Producto</option>{products.map((p) => <option key={p.id} value={p.id}>{p.name} · {p.presentation} · ${p.retail_price}</option>)}</select>
                <input name="quantity" type="number" min="0" placeholder="Cant." className="rounded-xl border border-neutral-200 px-3 py-2" />
                <input name="suggested_price" type="number" placeholder="Venta sugerida" className="rounded-xl border border-neutral-200 px-3 py-2" />
                <input name="render_price" type="number" placeholder="A rendir" className="rounded-xl border border-neutral-200 px-3 py-2" />
              </div>
            ))}
          </div>
        </div>
        <label className="block text-sm font-medium">Notas
          <textarea name="notes" rows={3} className="mt-2 w-full rounded-2xl border border-neutral-200 px-3 py-3" />
        </label>
        <button className="rounded-full bg-emerald-900 px-6 py-3 text-sm font-semibold text-white">Crear y registrar entrega</button>
      </form>
    </div>
  );
}
