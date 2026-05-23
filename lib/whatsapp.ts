import { SITE, type WhatsappContext } from "./site";
import type { CartItem } from "./cart-types";
import { formatARS } from "./format";

/**
 * Construye una URL de wa.me con texto pre-rellenado y URL-encoded.
 * Punto único: si cambia el número, se actualiza acá.
 */
export function whatsappUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${SITE.whatsapp.number}?text=${encoded}`;
}

const CONTEXT_OPENER: Record<WhatsappContext, string> = {
  general:
    "Hola Paesaggio, quería consultar por plantas, sustratos o envíos en Gran Mendoza.",
  catalogo:
    "Hola Paesaggio, vengo del catálogo de la web y quería consultar disponibilidad y envío.",
  mayorista:
    "Hola Paesaggio, quiero recibir información mayorista. Soy viverista/paisajista/comercio o compro por volumen.",
  asesoria:
    "Hola Paesaggio, quería coordinar una consulta para un proyecto o jardín.",
  aliados:
    "Hola Paesaggio, vengo de la página de aliados y quiero recibir la propuesta comercial.",
  arquitectos:
    "Hola Paesaggio, soy arquitecto/paisajista o tengo un proyecto y quiero cotizar plantas, sustratos y terminaciones verdes.",
  comercio:
    "Hola Paesaggio, tengo un comercio/corralón/pet shop y quiero información para vender sustratos, tierra o cortezas.",
  vendedor:
    "Hola Paesaggio, quiero sumarme como vendedor o generar pedidos por comisión.",
  consignacion:
    "Hola Paesaggio, me interesa la modalidad de consignación controlada para mi comercio.",
};

export function whatsappFromContext(ctx: WhatsappContext, extra?: string): string {
  const msg = CONTEXT_OPENER[ctx] + (extra ? "\n\n" + extra : "");
  return whatsappUrl(msg);
}

/**
 * Arma el mensaje completo a partir del carrito.
 */
export function buildQuoteMessage(
  items: CartItem[],
  mode: "catalogo" | "mayorista"
): string {
  const opener = mode === "mayorista"
    ? "Hola Paesaggio, vengo de la lista mayorista y quiero cotizar:"
    : "Hola Paesaggio, vengo del catálogo y quería consultar por:";

  const lines = items.map((it) => {
    const price = mode === "mayorista" && it.priceWholesale
      ? `  ${formatARS(it.priceWholesale * it.quantity)}`
      : "";
    return `• ${it.name} ${it.presentation} × ${it.quantity}${price}`;
  });

  const totalWholesale = items.reduce(
    (sum, it) => sum + (it.priceWholesale ?? 0) * it.quantity,
    0
  );

  const footer = mode === "mayorista" && totalWholesale > 0
    ? `\nTotal estimado mayorista: ${formatARS(totalWholesale)}\n(Confirmar stock, precio final y envío antes de cerrar pedido)`
    : "\nNecesito confirmar stock, precio final y forma de retiro/envío.";

  return [opener, "", ...lines, footer, "", "Canal: WEB"].join("\n");
}
