import { createProductAction, adjustProductStockAction } from "@/lib/backoffice/actions";
import { selectRows } from "@/lib/backoffice/supabase-rest";
import type { Product } from "@/lib/backoffice/types";
import { money } from "@/lib/backoffice/format";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await selectRows<Product>("pa_products", { select: "*", order: "category.asc,name.asc" });
  return (
    <div className="space-y-8">
      <div><h1 className="text-4xl font-semibold">Productos y stock</h1><p className="mt-2 text-neutral-600">Precios minoristas, mayoristas, valor a rendir en consignación y stock propio/consignado.</p></div>
      <section className="grid gap-5 lg:grid-cols-2">
        <form action={createProductAction} className="rounded-[1.5rem] border border-emerald-900/10 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Nuevo producto</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <input name="sku" required placeholder="SKU" className="rounded-2xl border border-neutral-200 px-3 py-3" />
            <input name="name" required placeholder="Nombre" className="rounded-2xl border border-neutral-200 px-3 py-3" />
            <input name="category" placeholder="Categoría" className="rounded-2xl border border-neutral-200 px-3 py-3" />
            <input name="presentation" placeholder="Presentación" className="rounded-2xl border border-neutral-200 px-3 py-3" />
            <input name="retail_price" type="number" placeholder="Precio minorista" className="rounded-2xl border border-neutral-200 px-3 py-3" />
            <input name="wholesale_price" type="number" placeholder="Precio mayorista" className="rounded-2xl border border-neutral-200 px-3 py-3" />
            <input name="consignment_render_price" type="number" placeholder="Valor a rendir" className="rounded-2xl border border-neutral-200 px-3 py-3" />
            <input name="stock_owned" type="number" placeholder="Stock inicial" className="rounded-2xl border border-neutral-200 px-3 py-3" />
          </div>
          <button className="mt-4 rounded-full bg-emerald-900 px-5 py-3 text-sm font-semibold text-white">Crear producto</button>
        </form>
        <form action={adjustProductStockAction} className="rounded-[1.5rem] border border-emerald-900/10 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Ajustar stock propio</h2>
          <div className="mt-5 grid gap-4">
            <select name="product_id" className="rounded-2xl border border-neutral-200 px-3 py-3">
              {products.map((p) => <option key={p.id} value={p.id}>{p.name} · {p.presentation} · stock {p.stock_owned}</option>)}
            </select>
            <div className="grid gap-4 md:grid-cols-2">
              <input name="quantity" type="number" required placeholder="Cantidad" className="rounded-2xl border border-neutral-200 px-3 py-3" />
              <select name="mode" className="rounded-2xl border border-neutral-200 px-3 py-3"><option value="add">Sumar</option><option value="subtract">Descontar</option></select>
            </div>
            <input name="notes" placeholder="Motivo" className="rounded-2xl border border-neutral-200 px-3 py-3" />
          </div>
          <button className="mt-4 rounded-full bg-emerald-900 px-5 py-3 text-sm font-semibold text-white">Registrar ajuste</button>
        </form>
      </section>
      <section className="rounded-[1.5rem] border border-emerald-900/10 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold">Listado</h2>
        <div className="mt-4 overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-xs uppercase tracking-wide text-neutral-500"><tr><th className="py-3">SKU</th><th>Producto</th><th>Categoría</th><th>Minorista</th><th>Mayorista</th><th>A rendir</th><th>Propio</th><th>Consignado</th></tr></thead><tbody className="divide-y divide-neutral-100">{products.map((p) => <tr key={p.id}><td className="py-3 font-medium">{p.sku}</td><td>{p.name} · {p.presentation}</td><td>{p.category}</td><td>{money(p.retail_price)}</td><td>{money(p.wholesale_price)}</td><td>{money(p.consignment_render_price)}</td><td>{p.stock_owned}</td><td>{p.stock_consigned}</td></tr>)}</tbody></table></div>
      </section>
    </div>
  );
}
