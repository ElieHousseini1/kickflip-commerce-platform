export interface CatalogProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  stockQuantity: number;
  description: string;
  image: string;
  variantName: string;
  variantOptions: string[];
  colors: string[];
  badge?: string;
}

export const catalog: CatalogProduct[] = [
  {
    id: "chair-001",
    slug: "mira-lounge-chair",
    name: "Mira Lounge Chair",
    category: "Furniture",
    price: 890,
    stockQuantity: 8,
    description:
      "A generous, sculptural chair wrapped in softly textured bouclé.",
    image:
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=85",
    variantName: "Upholstery",
    variantOptions: ["Ivory bouclé", "Charcoal wool", "Rust velvet"],
    colors: ["#e6dfd0", "#262421", "#b75d3e"],
    badge: "Bestseller",
  },
  {
    id: "lamp-001",
    slug: "arc-table-lamp",
    name: "Arc Table Lamp",
    category: "Lighting",
    price: 240,
    stockQuantity: 14,
    description: "A soft pool of light from a brushed steel silhouette.",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=85",
    variantName: "Finish",
    variantOptions: ["Brushed steel", "Tomato red"],
    colors: ["#b7b7b5", "#bf3b28"],
    badge: "New",
  },
  {
    id: "speaker-001",
    slug: "alto-speaker",
    name: "Alto Speaker",
    category: "Tech",
    price: 180,
    stockQuantity: 21,
    description: "Room-filling sound in a compact, tactile aluminum body.",
    image:
      "https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=1200&q=85",
    variantName: "Color",
    variantOptions: ["Cobalt", "Chalk", "Graphite"],
    colors: ["#1648d8", "#e7e1d5", "#1e1e1e"],
    badge: "New",
  },
  {
    id: "vase-001",
    slug: "luma-glass-vase",
    name: "Luma Glass Vase",
    category: "Objects",
    price: 95,
    stockQuantity: 5,
    description: "Mouth-blown amber glass with a satisfyingly weighty base.",
    image:
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=85",
    variantName: "Glass",
    variantOptions: ["Amber", "Moss"],
    colors: ["#c66b21", "#718567"],
    badge: "Limited",
  },
  {
    id: "table-001",
    slug: "orbit-side-table",
    name: "Orbit Side Table",
    category: "Furniture",
    price: 420,
    stockQuantity: 9,
    description: "A monolithic side table with a calm, architectural presence.",
    image:
      "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=1200&q=85",
    variantName: "Stone",
    variantOptions: ["Travertine", "Terracotta"],
    colors: ["#d9d0c0", "#a9432e"],
  },
  {
    id: "headphones-001",
    slug: "form-headphones",
    name: "Form Headphones",
    category: "Tech",
    price: 320,
    stockQuantity: 17,
    description:
      "Balanced listening with all-day comfort and intuitive controls.",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=85",
    variantName: "Color",
    variantOptions: ["Oat", "Black"],
    colors: ["#ded7c9", "#1f1f1d"],
  },
  {
    id: "lamp-002",
    slug: "milo-floor-lamp",
    name: "Milo Floor Lamp",
    category: "Lighting",
    price: 510,
    stockQuantity: 6,
    description: "A slender statement light designed for soft, indirect glow.",
    image:
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=85",
    variantName: "Finish",
    variantOptions: ["Linen", "Graphite"],
    colors: ["#e9e1d1", "#252521"],
  },
  {
    id: "clock-001",
    slug: "tempo-desk-clock",
    name: "Tempo Desk Clock",
    category: "Objects",
    price: 110,
    stockQuantity: 24,
    description: "A quiet timekeeper reduced to pure, friendly geometry.",
    image:
      "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=1200&q=85",
    variantName: "Color",
    variantOptions: ["Sunflower", "Chalk", "Ink"],
    colors: ["#f2b134", "#ece7dd", "#273d78"],
  },
  {
    id: "sofa-001",
    slug: "nora-modular-sofa",
    name: "Nora Modular Sofa",
    category: "Furniture",
    price: 1890,
    stockQuantity: 4,
    description:
      "Deep, relaxed seating with modules made to move with your space.",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=85",
    variantName: "Upholstery",
    variantOptions: ["Sage linen", "Natural canvas", "Midnight wool"],
    colors: ["#87917a", "#d8cfbd", "#252b36"],
    badge: "Bestseller",
  },
  {
    id: "chair-002",
    slug: "line-dining-chair",
    name: "Line Dining Chair",
    category: "Furniture",
    price: 290,
    stockQuantity: 12,
    description: "A light, stackable chair with a supportive curved back.",
    image:
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=85",
    variantName: "Wood",
    variantOptions: ["Natural oak", "Black oak"],
    colors: ["#c5a06d", "#24231f"],
  },
  {
    id: "lamp-003",
    slug: "sol-pendant-light",
    name: "Sol Pendant Light",
    category: "Lighting",
    price: 375,
    stockQuantity: 11,
    description: "A warm suspended light with a soft architectural glow.",
    image:
      "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=1200&q=85",
    variantName: "Finish",
    variantOptions: ["Parchment", "Cobalt"],
    colors: ["#e4d5b3", "#244dae"],
  },
  {
    id: "keyboard-001",
    slug: "grid-wireless-keyboard",
    name: "Grid Wireless Keyboard",
    category: "Tech",
    price: 145,
    stockQuantity: 19,
    description: "A compact mechanical keyboard made for focused work.",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=85",
    variantName: "Layout",
    variantOptions: ["US English", "UK English"],
    colors: ["#d8d5cc", "#242424"],
  },
  {
    id: "camera-001",
    slug: "frame-instant-camera",
    name: "Frame Instant Camera",
    category: "Tech",
    price: 210,
    stockQuantity: 7,
    description:
      "An uncomplicated instant camera for keeping tangible memories.",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=85",
    variantName: "Color",
    variantOptions: ["Chalk", "Cobalt", "Coral"],
    colors: ["#e9e5da", "#244fb8", "#d9654d"],
  },
  {
    id: "vase-002",
    slug: "fold-ceramic-vase",
    name: "Fold Ceramic Vase",
    category: "Objects",
    price: 45,
    stockQuantity: 13,
    description: "A hand-finished vessel shaped by gentle, asymmetric folds.",
    image:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=85",
    variantName: "Glaze",
    variantOptions: ["Bone", "Cobalt"],
    colors: ["#e8e0d2", "#254ca8"],
  },
  {
    id: "tray-001",
    slug: "arc-catchall-tray",
    name: "Arc Catchall Tray",
    category: "Objects",
    price: 70,
    stockQuantity: 26,
    description:
      "A useful landing place for the small things you carry every day.",
    image:
      "https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=1200&q=85",
    variantName: "Material",
    variantOptions: ["Amber glass", "Green marble"],
    colors: ["#bd6e27", "#526955"],
  },
];
