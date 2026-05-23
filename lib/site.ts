// Configuración global del sitio. Editar acá para cambiar contacto,
// metadatos, número de WhatsApp y textos comerciales principales.

export const SITE = {
  name: "Paesaggio Vivero & Paisajismo",
  tagline: "Plantas, sustratos y soluciones verdes en Gran Mendoza",
  description:
    "Vivero en Maipú, Mendoza. Venta online de plantas, árboles, sustratos, tierra preparada, chips y cortezas. Atención minorista, mayorista, arquitectos, comercios aliados y proyectos.",
  url: "https://paesaggio.com.ar", // cambiar al dominio real
  location: "Maipú — Mendoza",
  area: "Gran Mendoza",
  hoursVivero: "Lunes a sábados 09:00 a 18:00 hs",
  hoursWhatsApp: "Atención por WhatsApp 09:00 a 18:00 hs",
  whatsapp: {
    // Formato internacional sin "+" ni espacios — Argentina móvil.
    number: "5492614191619",
    display: "+54 9 261 419-1619",
  },
  instagram: "https://www.instagram.com/paesaggio_vivero/",
  services: [
    {
      title: "Venta online",
      blurb:
        "Catálogo por WhatsApp para clientes finales: plantas, árboles, tierra preparada, sustratos, chips y cortezas con entrega coordinada en Gran Mendoza.",
      icon: "catalog",
    },
    {
      title: "Mayorista y volumen",
      blurb:
        "Lista profesional para viveristas, paisajistas, comercios y compras por cantidad, con stock confirmado antes de cerrar cada pedido.",
      icon: "wholesale",
    },
    {
      title: "Proyectos y arquitectura",
      blurb:
        "Cotización de especies, sustratos y terminaciones verdes para casas, obras, locales, estudios de arquitectura y espacios comerciales.",
      icon: "project",
    },
    {
      title: "Red de aliados",
      blurb:
        "Trabajamos con vendedores, comercios, corralones, pet shops y puntos de venta bajo modalidad mayorista o consignación controlada.",
      icon: "allies",
    },
  ],
};

export type WhatsappContext =
  | "general"
  | "catalogo"
  | "mayorista"
  | "asesoria"
  | "aliados"
  | "arquitectos"
  | "comercio"
  | "vendedor"
  | "consignacion";
