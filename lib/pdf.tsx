"use client";

// PDF generator. Cargado dinámicamente desde CartDrawer para no
// bloatear el bundle inicial. Genera un PDF prolijo con cabecera
// Paesaggio, tabla de items y totales.

import type { CartItem, CartMode } from "./cart-types";
import { formatARS } from "./format";
import { SITE } from "./site";

export async function generateQuotePDF(items: CartItem[], mode: CartMode) {
  const { Document, Page, Text, View, StyleSheet, pdf, Font } = await import(
    "@react-pdf/renderer"
  );

  // Registrar fuentes web — Fraunces (serif) + Inter (sans)
  Font.register({
    family: "Fraunces",
    fonts: [
      { src: "https://fonts.gstatic.com/s/fraunces/v32/6NUh8FyLNQOQZAnv9bYEvDiIdE9Ea92uemAk.ttf", fontWeight: 400 },
      { src: "https://fonts.gstatic.com/s/fraunces/v32/6NUh8FyLNQOQZAnv9bYEvDiIdE9Ea9KuemAk.ttf", fontWeight: 600 },
    ],
  });
  Font.register({
    family: "Inter",
    fonts: [
      { src: "https://fonts.gstatic.com/s/inter/v18/UcCo3FwrK3iLTcvneQg7Ca725JhhKnNqk4j1ebLhAm8SrXTc2dRykS-pXjI.ttf", fontWeight: 400 },
      { src: "https://fonts.gstatic.com/s/inter/v18/UcCo3FwrK3iLTcvneQg7Ca725JhhKnNqk4j1ebLhAm8SrXTcwNRykS-pXjI.ttf", fontWeight: 600 },
    ],
  });

  const styles = StyleSheet.create({
    page: {
      backgroundColor: "#F8F6F0",
      padding: 48,
      fontFamily: "Inter",
      fontSize: 10,
      color: "#1A1A1A",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      paddingBottom: 24,
      borderBottomWidth: 1,
      borderBottomColor: "#2D4A1F",
      marginBottom: 24,
    },
    brand: {
      fontFamily: "Fraunces",
      fontSize: 32,
      color: "#1F3815",
      letterSpacing: -1,
    },
    tagline: {
      fontSize: 9,
      color: "#3F6829",
      marginTop: 4,
    },
    meta: {
      textAlign: "right",
      fontSize: 9,
      color: "#3F6829",
    },
    title: {
      fontFamily: "Fraunces",
      fontSize: 22,
      color: "#1F3815",
      marginBottom: 6,
    },
    subtitle: {
      fontSize: 10,
      color: "#3F6829",
      marginBottom: 24,
    },
    table: {
      marginBottom: 24,
      borderTopWidth: 1,
      borderTopColor: "#C8DCA0",
    },
    row: {
      flexDirection: "row",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#E0EAD0",
    },
    rowHeader: {
      flexDirection: "row",
      paddingVertical: 8,
      backgroundColor: "#F2F5EC",
      paddingHorizontal: 8,
      marginHorizontal: -8,
    },
    col1: { flex: 4, paddingHorizontal: 4 },
    col2: { flex: 2, paddingHorizontal: 4 },
    col3: { flex: 1, paddingHorizontal: 4, textAlign: "center" },
    col4: { flex: 2, paddingHorizontal: 4, textAlign: "right" },
    cellH: {
      fontSize: 9,
      fontWeight: 600,
      color: "#3F6829",
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    cell: { fontSize: 10 },
    productName: { fontSize: 10, fontWeight: 600, color: "#1F3815" },
    totals: {
      marginTop: 12,
      alignSelf: "flex-end",
      width: 240,
      borderTopWidth: 2,
      borderTopColor: "#2D4A1F",
      paddingTop: 12,
    },
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 4,
    },
    totalLabel: { fontSize: 10, color: "#3F6829" },
    totalValue: { fontSize: 10 },
    totalGrand: {
      fontFamily: "Fraunces",
      fontSize: 20,
      color: "#1F3815",
      marginTop: 8,
    },
    footer: {
      position: "absolute",
      bottom: 32,
      left: 48,
      right: 48,
      fontSize: 8,
      color: "#5C8A3C",
      textAlign: "center",
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: "#C8DCA0",
    },
    notes: {
      fontSize: 9,
      color: "#3F6829",
      marginTop: 16,
      padding: 12,
      backgroundColor: "#F2F5EC",
      borderRadius: 4,
      lineHeight: 1.5,
    },
  });

  const today = new Date().toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const total = items.reduce(
    (s, it) => s + (it.priceWholesale ?? 0) * it.quantity,
    0
  );
  const totalUnits = items.reduce((s, it) => s + it.quantity, 0);
  const isMayorista = mode === "mayorista";

  const Doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>paesaggio</Text>
            <Text style={styles.tagline}>Vivero · Paisajismo · Mendoza</Text>
          </View>
          <View style={styles.meta}>
            <Text>{today}</Text>
            <Text>WhatsApp {SITE.whatsapp.display}</Text>
          </View>
        </View>

        <Text style={styles.title}>
          {isMayorista ? "Cotización mayorista" : "Selección de productos"}
        </Text>
        <Text style={styles.subtitle}>
          {isMayorista
            ? "Detalle de pedido para presupuesto. Sujeto a disponibilidad y confirmación."
            : "Productos seleccionados desde el catálogo. Te confirmamos por WhatsApp."}
        </Text>

        <View style={styles.table}>
          <View style={styles.rowHeader}>
            <Text style={[styles.col1, styles.cellH]}>Producto</Text>
            <Text style={[styles.col2, styles.cellH]}>Presentación</Text>
            <Text style={[styles.col3, styles.cellH]}>Cant.</Text>
            {isMayorista && <Text style={[styles.col4, styles.cellH]}>Subtotal</Text>}
          </View>
          {items.map((it) => (
            <View key={it.id} style={styles.row}>
              <View style={styles.col1}>
                <Text style={styles.productName}>{it.name}</Text>
              </View>
              <Text style={[styles.col2, styles.cell]}>{it.presentation}</Text>
              <Text style={[styles.col3, styles.cell]}>{it.quantity}</Text>
              {isMayorista && (
                <Text style={[styles.col4, styles.cell]}>
                  {it.priceWholesale
                    ? formatARS(it.priceWholesale * it.quantity)
                    : "—"}
                </Text>
              )}
            </View>
          ))}
        </View>

        {isMayorista && total > 0 && (
          <View style={styles.totals}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>{totalUnits} unidades</Text>
              <Text style={styles.totalValue}>Subtotal</Text>
            </View>
            <Text style={[styles.totalRow, styles.totalGrand]}>
              {formatARS(total)}
            </Text>
          </View>
        )}

        <View style={styles.notes}>
          <Text>
            Precios orientativos en pesos argentinos, sujetos a modificación sin previo aviso.
            Disponibilidad sujeta a stock del día. Envíos en Gran Mendoza a coordinar según
            zona y volumen.
          </Text>
        </View>

        <Text style={styles.footer} fixed>
          {SITE.name}  ·  Russell, Maipú — Mendoza  ·  WhatsApp {SITE.whatsapp.display}
        </Text>
      </Page>
    </Document>
  );

  const blob = await pdf(Doc).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `paesaggio-${isMayorista ? "cotizacion" : "seleccion"}-${Date.now()}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
