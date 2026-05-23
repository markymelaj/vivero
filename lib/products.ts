// =====================================================================
// PRODUCTOS — Paesaggio Vivero
// =====================================================================
// Esta es la fuente única de verdad para catálogo y lista mayorista.
// Para actualizar precios, modificar acá y redeploy. (Más adelante se
// puede migrar a Supabase sin cambiar la UI — ver README.)
//
// Convención de imágenes: las fotos están en /public/images/catalog/
// y se referencian por filename (sin ruta). Para reemplazar una foto:
//   1. Poner el archivo nuevo en public/images/catalog/
//   2. Cambiar el campo `image` del producto
// =====================================================================

export type Category =
  | "arboles"
  | "arbustos"
  | "graminea"
  | "interior"
  | "suculenta"
  | "jardin"
  | "sustrato"
  | "corteza";

export const CATEGORIES: Record<Category, { label: string; short: string }> = {
  arboles:    { label: "Árboles",            short: "Árboles" },
  arbustos:   { label: "Arbustos",           short: "Arbustos" },
  graminea:   { label: "Gramíneas",          short: "Gramíneas" },
  interior:   { label: "Plantas de interior", short: "Interior" },
  suculenta:  { label: "Cactus y suculentas", short: "Suculentas" },
  jardin:     { label: "Plantas de jardín",  short: "Jardín" },
  sustrato:   { label: "Tierras y sustratos", short: "Sustratos" },
  corteza:    { label: "Cortezas y chips",   short: "Cortezas" },
};

export type Presentation = {
  size: string;        // "10L", "M12", "6/8 cm", etc.
  priceRetail?: number; // ARS, optional (lo que el cliente final paga)
  priceWholesale?: number; // ARS mayorista
};

export type Product = {
  slug: string;
  name: string;
  scientificName?: string;
  category: Category;
  image: string;        // filename in /public/images/catalog/
  description?: string; // 1-2 line copy for the card
  presentations: Presentation[];
  featured?: boolean;   // shows on landing
};

// =====================================================================
// CATÁLOGO COMPLETO
// =====================================================================
// Precios mayoristas tomados de "lista_mayorista_nueva_nueva.pdf" (mayo 2026).
// Cuando no figura en esa lista, se usa el del "Catálogo Mayoristas 2025".
// Si querés mostrar precios minoristas en /catalogo, agregá `priceRetail`.
// =====================================================================

export const PRODUCTS: Product[] = [
  // ─── ÁRBOLES Y ARBUSTOS ─────────────────────────────────────────────
  {
    slug: "brachichito",
    name: "Brachichito",
    scientificName: "Brachychiton populneus",
    category: "arboles",
    image: "cat-002.jpg",
    description: "Árbol botella. Hojas brillantes, copa redondeada, gran resistencia.",
    presentations: [{ size: "10L / 1.5 mts", priceWholesale: 9500 }],
  },
  {
    slug: "fresno-aureo",
    name: "Fresno Áureo",
    scientificName: "Fraxinus excelsior 'Jaspidea'",
    category: "arboles",
    image: "cat-013.jpg",
    description: "Follaje dorado en otoño. Ideal para alineaciones urbanas.",
    presentations: [{ size: "6/8 cm", priceWholesale: 28000 }],
  },
  {
    slug: "fresno-redwood",
    name: "Fresno Redwood",
    scientificName: "Fraxinus pennsylvanica 'Summit'",
    category: "arboles",
    image: "cat-014.jpg",
    description: "Otoñal de fuerte rojo. Crecimiento rápido, sombra densa.",
    presentations: [{ size: "6/8 cm", priceWholesale: 28000 }],
  },
  {
    slug: "fresno-americano",
    name: "Fresno Americano",
    scientificName: "Fraxinus americana",
    category: "arboles",
    image: "cat-012.jpg",
    description: "Tronco recto, copa amplia. Clásico para vereda.",
    presentations: [{ size: "8/10 cm", priceWholesale: 15000 }],
  },
  {
    slug: "prunus-trailblazer",
    name: "Prunus Trailblazer",
    scientificName: "Prunus cerasifera 'Trailblazer'",
    category: "arboles",
    image: "cat-015.jpg",
    description: "Hoja púrpura todo el verano, floración rosada en primavera.",
    presentations: [{ size: "15L", priceWholesale: 28000 }],
    featured: true,
  },
  {
    slug: "lagerstroemia-crespon",
    name: "Lagerstroemia Crespón",
    scientificName: "Lagerstroemia indica",
    category: "arboles",
    image: "cat-023.jpg",
    description: "Floración estival larga, en rosa intenso. Tronco escultórico.",
    presentations: [{ size: "6-8 cm", priceWholesale: 22000 }],
  },
  {
    slug: "limonero",
    name: "Limonero",
    scientificName: "Citrus × limon",
    category: "arboles",
    image: "cat-026.jpg",
    description: "Frutal cítrico con limones cargados al momento de venta.",
    presentations: [{ size: "7L", priceWholesale: 20000 }],
  },
  {
    slug: "laurentino",
    name: "Laurentino",
    scientificName: "Viburnum tinus",
    category: "arbustos",
    image: "cat-024.jpg",
    description: "Arbusto perenne tupido, flores blancas en racimo.",
    presentations: [{ size: "10L / 1 mt", priceWholesale: 14000 }, { size: "4L / 70 cm", priceWholesale: 8000 }],
  },
  {
    slug: "leylandii-pino",
    name: "Leylandii Pino",
    scientificName: "Cupressocyparis leylandii",
    category: "arbustos",
    image: "cat-025.jpg",
    description: "Conífera de cerco, crecimiento rápido. Pantalla verde densa.",
    presentations: [{ size: "10L", priceWholesale: 18000 }],
  },
  {
    slug: "olea-europea",
    name: "Olea Europea",
    scientificName: "Olea europaea",
    category: "arbustos",
    image: "cat-029.jpg",
    description: "Olivo. Hoja plateada, porte mediterráneo.",
    presentations: [{ size: "8L", priceWholesale: 18000 }, { size: "7L", priceWholesale: 16000 }],
  },
  {
    slug: "olea-texanum",
    name: "Olea Texanum",
    scientificName: "Ligustrum japonicum 'Texanum'",
    category: "arbustos",
    image: "cat-030.jpg",
    description: "Hoja lustrosa, flores blancas fragantes. Setos formales.",
    presentations: [{ size: "4L", priceWholesale: 8000 }],
  },
  {
    slug: "juniperus-procumbens-nana",
    name: "Juniperus Procumbens Nana",
    scientificName: "Juniperus procumbens 'Nana'",
    category: "arbustos",
    image: "cat-022.jpg",
    description: "Conífera rastrera, cubre suelo perenne, tonos azulados.",
    presentations: [{ size: "10L", priceWholesale: 18000 }],
  },
  {
    slug: "rhus-crenata",
    name: "Rhus Crenata",
    scientificName: "Searsia crenata",
    category: "arbustos",
    image: "cat-033.jpg",
    description: "Arbusto perenne, hoja brillante crenada, muy resistente.",
    presentations: [{ size: "4L", priceWholesale: 5800 }],
  },
  {
    slug: "buxus-compacto",
    name: "Buxus Compacto",
    scientificName: "Buxus sempervirens 'Suffruticosa'",
    category: "arbustos",
    image: "cat-004.jpg",
    description: "Boj enano, ideal para bordura y topiarios bajos.",
    presentations: [{ size: "4L", priceWholesale: 9000 }],
  },
  {
    slug: "buxus-sempervirens",
    name: "Buxus Sempervirens",
    scientificName: "Buxus sempervirens",
    category: "arbustos",
    image: "cat-005.jpg",
    description: "Boj común, perfecto para setos formales y topiarios.",
    presentations: [{ size: "4L", priceWholesale: 8500 }],
  },
  {
    slug: "hebe-carnosula",
    name: "Hebe Carnosula",
    scientificName: "Hebe pinguifolia",
    category: "arbustos",
    image: "cat-017.jpg",
    description: "Arbusto bajo de hoja gris-azulada, flores blancas.",
    presentations: [{ size: "2L", priceWholesale: 3500 }],
  },
  {
    slug: "hebe-variegada",
    name: "Hebe Variegada",
    scientificName: "Hebe × andersonii variegata",
    category: "arbustos",
    image: "cat-016.jpg",
    description: "Hoja jaspeada blanco-verde. Flores en espiga lila.",
    presentations: [{ size: "2L", priceWholesale: 3500 }],
  },

  // ─── GRAMÍNEAS ──────────────────────────────────────────────────────
  {
    slug: "acorus",
    name: "Acorus",
    scientificName: "Acorus gramineus 'Ogon'",
    category: "graminea",
    image: "cat-000.jpg",
    description: "Cinta dorada compacta, tolera humedad. Bordes y maceteros.",
    presentations: [{ size: "M12", priceWholesale: 1500 }],
  },
  {
    slug: "liriope-muscari",
    name: "Liriope Muscari desarrollado",
    scientificName: "Liriope muscari",
    category: "graminea",
    image: "cat-025.jpg",
    description: "Macollas densas, espigas violetas en otoño.",
    presentations: [{ size: "M12", priceWholesale: 2600 }],
  },
  {
    slug: "muhlenbergia-capillaris",
    name: "Muhlenbergia Capillaris",
    scientificName: "Muhlenbergia capillaris",
    category: "graminea",
    image: "cat-028.jpg",
    description: "Plumas rosadas en otoño. Diseño paisajístico contemporáneo.",
    presentations: [{ size: "2L", priceWholesale: 3500 }],
    featured: true,
  },
  {
    slug: "nassella-tenuissima",
    name: "Nassella Tenuissima",
    scientificName: "Nassella tenuissima",
    category: "graminea",
    image: "cat-027.jpg",
    description: "Coirón, finura textural en movimiento. Bajo riego.",
    presentations: [{ size: "3L", priceWholesale: 2800 }],
  },
  {
    slug: "pennisetum-rubrum",
    name: "Pennisetum Rubrum",
    scientificName: "Pennisetum setaceum 'Rubrum'",
    category: "graminea",
    image: "cat-031.jpg",
    description: "Plumeros granate, follaje bordó. Acento dramático.",
    presentations: [{ size: "3L", priceWholesale: 3500 }],
  },
  {
    slug: "festuca-glauca",
    name: "Festuca Glauca",
    scientificName: "Festuca glauca",
    category: "graminea",
    image: "cat-009.jpg",
    description: "Mata azul-plateada compacta. Ideal en grupos.",
    presentations: [{ size: "2L", priceWholesale: 2000 }],
  },

  // ─── INTERIOR ───────────────────────────────────────────────────────
  {
    slug: "bromelia-cryptanthus",
    name: "Bromelia Cryptanthus",
    scientificName: "Cryptanthus bivittatus",
    category: "interior",
    image: "cat-003.jpg",
    description: "Bromelia terrestre, hojas estriadas rosa-bordó.",
    presentations: [{ size: "M12", priceWholesale: 5000 }],
  },
  {
    slug: "ficus-ali",
    name: "Ficus Ali",
    scientificName: "Ficus binnendijkii",
    category: "interior",
    image: "cat-011.jpg",
    description: "Hojas largas, porte elegante. Para interiores luminosos.",
    presentations: [{ size: "3L", priceWholesale: 12000 }],
  },
  {
    slug: "sansevieria",
    name: "Sansevieria",
    scientificName: "Sansevieria trifasciata",
    category: "interior",
    image: "cat-028.jpg",
    description: "Lengua de suegra. Resistente, purifica el aire de noche.",
    presentations: [{ size: "3L", priceWholesale: 7500 }, { size: "M14 hoja media", priceWholesale: 7000 }],
    featured: true,
  },
  {
    slug: "strelitzia-reginae",
    name: "Strelitzia Reginae",
    scientificName: "Strelitzia reginae",
    category: "interior",
    image: "cat-042.jpg",
    description: "Ave del paraíso. Flor anaranjada inconfundible.",
    presentations: [{ size: "10L", priceWholesale: 38000 }],
    featured: true,
  },
  {
    slug: "strelitzia-nicolai",
    name: "Strelitzia Nicolai",
    scientificName: "Strelitzia nicolai",
    category: "interior",
    image: "cat-041.jpg",
    description: "Ave del paraíso gigante, escala arquitectónica para interiores.",
    presentations: [{ size: "8L", priceWholesale: 25000 }],
  },
  {
    slug: "philodendron-monstera",
    name: "Philodendron Monstera",
    scientificName: "Monstera deliciosa",
    category: "interior",
    image: "cat-032.jpg",
    description: "Hojas perforadas dramáticas, planta tropical icónica.",
    presentations: [{ size: "3L", priceWholesale: 7500 }],
  },

  // ─── CACTUS Y SUCULENTAS ────────────────────────────────────────────
  {
    slug: "euphorbia-trigona",
    name: "Euphorbia Trigona",
    scientificName: "Euphorbia trigona",
    category: "suculenta",
    image: "cat-008.jpg",
    description: "Columnar arquitectónica. Casi sin mantenimiento.",
    presentations: [{ size: "3L", priceWholesale: 5000 }],
  },
  {
    slug: "sedum-spurium",
    name: "Sedum Spurium",
    scientificName: "Sedum spurium",
    category: "suculenta",
    image: "cat-039.jpg",
    description: "Roseta tapizante, tonos rojizos al sol.",
    presentations: [{ size: "M12", priceWholesale: 1500 }],
  },
  {
    slug: "sedum-tokyo",
    name: "Sedum Tokyo",
    scientificName: "Sedum × 'Tokyo Sun'",
    category: "suculenta",
    image: "cat-040.jpg",
    description: "Tapizante dorado, textura granular fresca.",
    presentations: [{ size: "M12", priceWholesale: 1500 }],
    featured: true,
  },

  // ─── PLANTAS DE JARDÍN ──────────────────────────────────────────────
  {
    slug: "agapanthus-africanus",
    name: "Agapanthus Africanus",
    scientificName: "Agapanthus africanus",
    category: "jardin",
    image: "cat-001.jpg",
    description: "Floración celeste en verano, macollas robustas.",
    presentations: [{ size: "4L", priceWholesale: 4800 }],
  },
  {
    slug: "lavanda",
    name: "Lavanda",
    scientificName: "Lavandula angustifolia",
    category: "jardin",
    image: "cat-021.jpg",
    description: "Aromática mediterránea, flores en espiga violeta.",
    presentations: [
      { size: "3L", priceWholesale: 3500 },
      { size: "2L", priceWholesale: 2500 },
      { size: "M12", priceWholesale: 1200 },
    ],
  },
  {
    slug: "dymondia",
    name: "Dymondia",
    scientificName: "Dymondia margaretae",
    category: "jardin",
    image: "cat-007.jpg",
    description: "Cubresuelo plateado, flores amarillas. Aguanta pisoteo leve.",
    presentations: [{ size: "M12", priceWholesale: 1500 }],
  },
  {
    slug: "convolvulus",
    name: "Convolvulus",
    scientificName: "Convolvulus mauritanicus",
    category: "jardin",
    image: "cat-006.jpg",
    description: "Tapizante de flor azul-violeta, follaje gris.",
    presentations: [{ size: "3L", priceWholesale: 4500 }],
  },
  {
    slug: "gaura-rosada",
    name: "Gaura Rosada",
    scientificName: "Gaura lindheimeri",
    category: "jardin",
    image: "cat-015.jpg",
    description: "Floración aérea continua, blanco y rosa. Movimiento al viento.",
    presentations: [{ size: "3L", priceWholesale: 3800 }],
  },
  {
    slug: "jazmin-de-leche",
    name: "Jazmín de Leche",
    scientificName: "Trachelospermum jasminoides",
    category: "jardin",
    image: "cat-019.jpg",
    description: "Trepadora perfumada, flor blanca en primavera-verano.",
    presentations: [{ size: "4L", priceWholesale: 6500 }, { size: "3L", priceWholesale: 5200 }],
  },
  {
    slug: "jazmin-fortunei",
    name: "Jazmín Fortunei",
    scientificName: "Trachelospermum jasminoides 'Fortunei'",
    category: "jardin",
    image: "cat-020.jpg",
    description: "Variedad robusta, flores cremas perfumadas.",
    presentations: [{ size: "10L", priceWholesale: 27000 }],
  },
  {
    slug: "salvia-leucantha",
    name: "Salvia Leucantha",
    scientificName: "Salvia leucantha",
    category: "jardin",
    image: "cat-038.jpg",
    description: "Espigas felpudas violetas, follaje plateado.",
    presentations: [{ size: "3L", priceWholesale: 3800 }],
  },
  {
    slug: "salvia-greggii",
    name: "Salvia Greggii",
    scientificName: "Salvia greggii",
    category: "jardin",
    image: "cat-037.jpg",
    description: "Floración roja prolongada, atrae polinizadores.",
    presentations: [{ size: "3L", priceWholesale: 3200 }],
  },
  {
    slug: "romero-erectus",
    name: "Romero Erectus",
    scientificName: "Rosmarinus officinalis 'Erectus'",
    category: "jardin",
    image: "cat-034.jpg",
    description: "Aromática culinaria, porte vertical, flor celeste.",
    presentations: [{ size: "3L", priceWholesale: 3500 }],
  },
  {
    slug: "romero-rastrero",
    name: "Romero Rastrero",
    scientificName: "Rosmarinus officinalis 'Prostratus'",
    category: "jardin",
    image: "cat-035.jpg",
    description: "Cae en cascada, ideal para muros y maceteros.",
    presentations: [{ size: "3L", priceWholesale: 3500 }],
  },
  {
    slug: "verbena-bonariensis",
    name: "Verbena Bonariensis",
    scientificName: "Verbena bonariensis",
    category: "jardin",
    image: "cat-043.jpg",
    description: "Espigas violetas altas y aéreas. Atrae mariposas.",
    presentations: [{ size: "3L", priceWholesale: 3200 }],
  },

  // ─── SUSTRATOS ──────────────────────────────────────────────────────
  {
    slug: "sustrato-5l",
    name: "Sustrato",
    category: "sustrato",
    image: "cat-048.jpg",
    description: "Sustrato preparado para macetas y trasplantes.",
    presentations: [
      { size: "5 dm³",  priceWholesale: 1300 },
      { size: "10 dm³", priceWholesale: 2300 },
      { size: "20 dm³", priceWholesale: 4000 },
      { size: "60 dm³", priceWholesale: 10500 },
    ],
  },
  {
    slug: "humus",
    name: "Humus de lombriz",
    category: "sustrato",
    image: "cat-045.jpg",
    description: "Abono orgánico nutritivo para enriquecer canteros.",
    presentations: [{ size: "5 dm³", priceWholesale: 2500 }],
  },
  {
    slug: "tierra-negra",
    name: "Tierra Negra Preparada",
    category: "sustrato",
    image: "cat-044.jpg",
    description: "Mezcla lista para uso en jardín y obra.",
    presentations: [{ size: "30 dm³", priceWholesale: 4000 }],
  },

  // ─── CORTEZAS ───────────────────────────────────────────────────────
  {
    slug: "corteza-pino",
    name: "Corteza de Pino",
    category: "corteza",
    image: "cat-047.jpg",
    description: "Mulch decorativo y funcional, reduce evaporación.",
    presentations: [
      { size: "20 dm³",  priceWholesale: 3700 },
      { size: "60 dm³",  priceWholesale: 10500 },
      { size: "100 dm³", priceWholesale: 18000 },
    ],
  },
  {
    slug: "chip-roble",
    name: "Chip de Roble",
    category: "corteza",
    image: "cat-046.jpg",
    description: "Mulch duradero, color profundo, terminación premium.",
    presentations: [
      { size: "10 dm³", priceWholesale: 3500 },
      { size: "20 dm³", priceWholesale: 6000 },
    ],
  },
];

// Helpers
export function getByCategory(cat: Category): Product[] {
  return PRODUCTS.filter((p) => p.category === cat);
}

export function getFeatured(): Product[] {
  return PRODUCTS.filter((p) => p.featured);
}

export function getBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
