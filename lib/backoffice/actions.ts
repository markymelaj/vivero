"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { clearSession, loginWithPassword, requireSession } from "./auth";
import { insertRow, rpc, updateRows } from "./supabase-rest";
import type { Partner, Product } from "./types";

function n(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").replace(/\./g, "").replace(/,/g, ".").trim();
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

function s(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();
  return raw || null;
}

export async function loginAction(_: unknown, formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const result = await loginWithPassword(email, password);
  if (!result.ok) return result;
  redirect("/admin");
}

export async function logoutAction() {
  clearSession();
  redirect("/admin/login");
}

export async function createPartnerAction(formData: FormData) {
  requireSession();
  const type = String(formData.get("type") || "comercio");
  const businessName = String(formData.get("business_name") || "").trim();
  if (!businessName) throw new Error("Falta nombre del aliado.");
  const prefix = type.slice(0, 3).toUpperCase();
  const code = `${prefix}-${Date.now().toString().slice(-6)}`;
  await insertRow<Partner>("pa_partners", {
    code,
    type,
    business_name: businessName,
    contact_name: s(formData.get("contact_name")),
    whatsapp: s(formData.get("whatsapp")),
    email: s(formData.get("email")),
    address: s(formData.get("address")),
    zone: s(formData.get("zone")),
    agreement_type: s(formData.get("agreement_type")) || "consignacion",
    default_commission_rate: n(formData.get("default_commission_rate")),
    seller_id: s(formData.get("seller_id")),
    notes: s(formData.get("notes")),
    active: true,
  });
  revalidatePath("/admin/aliados");
  redirect("/admin/aliados");
}

export async function createProductAction(formData: FormData) {
  requireSession();
  const sku = String(formData.get("sku") || "").trim().toUpperCase();
  const name = String(formData.get("name") || "").trim();
  if (!sku || !name) throw new Error("Falta SKU o nombre.");
  await insertRow<Product>("pa_products", {
    sku,
    name,
    category: String(formData.get("category") || "General"),
    presentation: String(formData.get("presentation") || "-"),
    retail_price: n(formData.get("retail_price")),
    wholesale_price: n(formData.get("wholesale_price")),
    consignment_render_price: n(formData.get("consignment_render_price")),
    cost_price: n(formData.get("cost_price")),
    stock_owned: n(formData.get("stock_owned")),
    active: true,
    notes: s(formData.get("notes")),
  });
  revalidatePath("/admin/productos");
  redirect("/admin/productos");
}

export async function adjustProductStockAction(formData: FormData) {
  const session = requireSession();
  const productId = String(formData.get("product_id") || "");
  const qty = n(formData.get("quantity"));
  const mode = String(formData.get("mode") || "add");
  if (!productId || !qty) throw new Error("Falta producto o cantidad.");
  // Usamos un update directo con RPC implícita vía PATCH no permite stock = stock + qty.
  // Para mantener simple y auditable, se registra ajuste como movimiento y se actualiza desde RPC dedicada si se desea.
  await rpc("pa_register_stock_adjustment", {
    p_product_id: productId,
    p_quantity: mode === "subtract" ? -Math.abs(qty) : Math.abs(qty),
    p_notes: s(formData.get("notes")),
    p_created_by: session.id,
  });
  revalidatePath("/admin/productos");
  redirect("/admin/productos");
}

export async function createConsignmentAction(formData: FormData) {
  const session = requireSession();
  const partnerId = String(formData.get("partner_id") || "");
  if (!partnerId) throw new Error("Falta aliado.");
  const productIds = formData.getAll("product_id").map(String);
  const quantities = formData.getAll("quantity").map((x) => Number(String(x || "0")));
  const suggested = formData.getAll("suggested_price").map((x) => String(x || ""));
  const render = formData.getAll("render_price").map((x) => String(x || ""));
  const items = productIds
    .map((product_id, i) => ({
      product_id,
      quantity: quantities[i] || 0,
      suggested_price: suggested[i],
      render_price: render[i],
    }))
    .filter((item) => item.product_id && item.quantity > 0);
  if (!items.length) throw new Error("La consignación debe tener productos.");
  const id = await rpc<string>("pa_create_consignment", {
    p_partner_id: partnerId,
    p_items: items,
    p_seller_id: s(formData.get("seller_id")),
    p_review_date: s(formData.get("review_date")),
    p_notes: s(formData.get("notes")),
    p_created_by: session.id,
  });
  revalidatePath("/admin/consignaciones");
  redirect(`/admin/consignaciones/${id}`);
}

export async function registerConsignmentSaleAction(formData: FormData) {
  const session = requireSession();
  const consignmentId = String(formData.get("consignment_id") || "");
  const itemIds = formData.getAll("consignment_item_id").map(String);
  const quantities = formData.getAll("quantity").map((x) => Number(String(x || "0")));
  const prices = formData.getAll("sale_price").map((x) => String(x || ""));
  const items = itemIds
    .map((consignment_item_id, i) => ({ consignment_item_id, quantity: quantities[i] || 0, sale_price: prices[i] }))
    .filter((item) => item.consignment_item_id && item.quantity > 0);
  if (!consignmentId || !items.length) throw new Error("Falta consignación o productos vendidos.");
  await rpc<string>("pa_register_consignment_sale", {
    p_consignment_id: consignmentId,
    p_items: items,
    p_notes: s(formData.get("notes")),
    p_created_by: session.id,
  });
  revalidatePath(`/admin/consignaciones/${consignmentId}`);
  redirect(`/admin/consignaciones/${consignmentId}`);
}

export async function registerPortalSaleAction(formData: FormData) {
  const token = String(formData.get("token") || "");
  const consignmentId = String(formData.get("consignment_id") || "");
  const itemIds = formData.getAll("consignment_item_id").map(String);
  const quantities = formData.getAll("quantity").map((x) => Number(String(x || "0")));
  const prices = formData.getAll("sale_price").map((x) => String(x || ""));
  const items = itemIds
    .map((consignment_item_id, i) => ({ consignment_item_id, quantity: quantities[i] || 0, sale_price: prices[i] }))
    .filter((item) => item.consignment_item_id && item.quantity > 0);
  if (!token || !consignmentId || !items.length) throw new Error("Falta información de venta.");
  await rpc<string>("pa_register_consignment_sale", {
    p_consignment_id: consignmentId,
    p_items: items,
    p_notes: s(formData.get("notes")) || "Registrado desde portal aliado",
    p_created_by: null,
  });
  revalidatePath(`/portal/${token}`);
  redirect(`/portal/${token}`);
}

export async function registerConsignmentPaymentAction(formData: FormData) {
  const session = requireSession();
  const consignmentId = String(formData.get("consignment_id") || "");
  const amount = n(formData.get("amount"));
  if (!consignmentId || amount <= 0) throw new Error("Falta consignación o monto.");
  await rpc<string>("pa_register_consignment_payment", {
    p_consignment_id: consignmentId,
    p_amount: amount,
    p_method: String(formData.get("method") || "transferencia"),
    p_external_reference: s(formData.get("external_reference")),
    p_notes: s(formData.get("notes")),
    p_created_by: session.id,
  });
  revalidatePath(`/admin/consignaciones/${consignmentId}`);
  revalidatePath("/admin/pagos");
  revalidatePath("/admin/comisiones");
  redirect(`/admin/consignaciones/${consignmentId}`);
}

export async function registerConsignmentAdjustmentAction(formData: FormData) {
  const session = requireSession();
  const consignmentId = String(formData.get("consignment_id") || "");
  const itemId = String(formData.get("consignment_item_id") || "");
  if (!itemId) throw new Error("Falta item.");
  await rpc<void>("pa_register_consignment_adjustment", {
    p_consignment_item_id: itemId,
    p_type: String(formData.get("type") || "danado"),
    p_quantity: n(formData.get("quantity")),
    p_notes: s(formData.get("notes")),
    p_created_by: session.id,
  });
  revalidatePath(`/admin/consignaciones/${consignmentId}`);
  redirect(`/admin/consignaciones/${consignmentId}`);
}

export async function markCommissionPaidAction(formData: FormData) {
  requireSession();
  const commissionId = String(formData.get("commission_id") || "");
  if (!commissionId) throw new Error("Falta comisión.");
  await updateRows("pa_commissions", `id=eq.${commissionId}`, { status: "pagada", paid_at: new Date().toISOString() });
  revalidatePath("/admin/comisiones");
  redirect("/admin/comisiones");
}
