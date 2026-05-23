export type CartItem = {
  id: string;              // `${productSlug}-${size}`
  slug: string;
  name: string;
  presentation: string;    // "3L", "M12", etc.
  quantity: number;
  priceWholesale?: number;
  category: string;
  image: string;
};

export type CartMode = "catalogo" | "mayorista";
