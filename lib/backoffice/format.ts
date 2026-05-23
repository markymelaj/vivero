export function money(value: number | string | null | undefined) {
  const n = Number(value || 0);
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);
}

export function shortDate(value?: string | null) {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat("es-AR", { dateStyle: "short" }).format(new Date(value));
  } catch {
    return value;
  }
}

export function statusLabel(status?: string | null) {
  if (!status) return "—";
  return status.replaceAll("_", " ");
}
