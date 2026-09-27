export interface CatalogProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  compareAtPrice?: number;
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
    slug: "diy-quarter-pipe",
    name: "DIY Quarter Pipe",
    category: "Ramps",
    price: 890,
    stockQuantity: 8,
    description:
      "A backyard-ready quarter pipe with a smooth birch riding surface and galvanized steel coping.",
    image: "/images/products/diy-quarter-pipe-v3.jpg",
    variantName: "Width",
    variantOptions: ["4 foot", "6 foot", "8 foot"],
    colors: ["#d7b477", "#20201e", "#e5542f"],
    badge: "Crew pick",
  },
  {
    id: "lamp-001",
    slug: "street-complete-skateboard",
    name: "Street Complete",
    category: "Completes",
    price: 240,
    compareAtPrice: 300,
    stockQuantity: 14,
    description:
      "A responsive street complete built around a snappy seven-ply maple deck and dependable components.",
    image: "/images/products/street-complete-v3.jpg",
    variantName: "Size",
    variantOptions: ['8.0"', '8.25"'],
    colors: ["#ff5c35", "#d9654d"],
    badge: "20% off",
  },
  {
    id: "speaker-001",
    slug: "hollow-skateboard-trucks",
    name: "Hollow Trucks Set",
    category: "Hardware",
    price: 180,
    stockQuantity: 21,
    description:
      "Lightweight hollow-axle trucks with a stable turn and plenty of grind clearance.",
    image: "/images/products/hollow-trucks-v3.jpg",
    variantName: "Finish",
    variantOptions: ["Orange", "Raw silver", "Midnight"],
    colors: ["#ff5c35", "#c9c9c5", "#171715"],
    badge: "New drop",
  },
  {
    id: "vase-001",
    slug: "formula-skateboard-wheels-54mm",
    name: "Formula Wheels 54mm",
    category: "Hardware",
    price: 95,
    compareAtPrice: 120,
    stockQuantity: 5,
    description:
      "Fast, flat-spot-resistant street wheels with a crisp slide and a dependable 99a durometer.",
    image: "/images/products/formula-wheels-v3.jpg",
    variantName: "Color",
    variantOptions: ["Acid yellow", "Pool green"],
    colors: ["#dfff00", "#718567"],
    badge: "Sale",
  },
  {
    id: "table-001",
    slug: "curb-crusher-complete-skateboard",
    name: "Curb Crusher Complete",
    category: "Completes",
    price: 420,
    stockQuantity: 9,
    description:
      "A wider complete tuned for curbs, rough spots, and fast lines through the city.",
    image: "/images/products/curb-crusher-v3.jpg",
    variantName: "Shape",
    variantOptions: ["Classic popsicle", "Egg shape"],
    colors: ["#e7d8b4", "#ff5c35"],
  },
  {
    id: "headphones-001",
    slug: "impact-skate-helmet",
    name: "Impact Skate Helmet",
    category: "Protection",
    price: 320,
    stockQuantity: 17,
    description:
      "A low-profile certified helmet with soft, washable liners for long sessions.",
    image: "/images/products/impact-helmet-v3.jpg",
    variantName: "Color",
    variantOptions: ["Bone", "Black"],
    colors: ["#ded7c9", "#1f1f1d"],
  },
  {
    id: "lamp-002",
    slug: "flat-bar-grind-rail",
    name: "Flat Bar Grind Rail",
    category: "Ramps",
    price: 510,
    stockQuantity: 6,
    description:
      "A heavy-duty portable flat bar with adjustable height and planted rubber feet.",
    image: "/images/products/grind-rail-v3.jpg",
    variantName: "Finish",
    variantOptions: ["Raw steel", "Graphite"],
    colors: ["#bfc0bc", "#252521"],
  },
  {
    id: "clock-001",
    slug: "ceramic-skateboard-bearings",
    name: "Ceramic Speed Bearings",
    category: "Hardware",
    price: 110,
    stockQuantity: 24,
    description:
      "Eight low-friction ceramic bearings made to stay fast through dust, drops, and wet streets.",
    image: "/images/products/speed-bearings-v3.jpg",
    variantName: "Shield",
    variantOptions: ["Sunburst", "Chalk", "Ink"],
    colors: ["#f2b134", "#ece7dd", "#171715"],
  },
  {
    id: "sofa-001",
    slug: "backyard-mini-ramp",
    name: "Backyard Mini Ramp",
    category: "Ramps",
    price: 1890,
    stockQuantity: 4,
    description:
      "A modular mini ramp kit engineered for clean transitions, solid landings, and endless runs.",
    image: "/images/products/mini-ramp-v3.jpg",
    variantName: "Surface",
    variantOptions: ["Natural birch", "Weatherproof tan", "Midnight"],
    colors: ["#caa873", "#d8cfbd", "#252b36"],
    badge: "Crew pick",
  },
  {
    id: "chair-002",
    slug: "pool-shaped-skateboard-deck",
    name: "Pool Shaped Deck",
    category: "Decks",
    price: 290,
    stockQuantity: 12,
    description:
      "A wide, directional pool deck with a full nose and wheel wells for deep carving.",
    image: "/images/products/pool-deck-v3.jpg",
    variantName: "Width",
    variantOptions: ['9.0"', '9.5"'],
    colors: ["#c5a06d", "#24231f"],
  },
  {
    id: "lamp-003",
    slug: "session-skate-backpack",
    name: "Session Skate Backpack",
    category: "Accessories",
    price: 375,
    stockQuantity: 11,
    description:
      "A rugged day pack with external deck straps, a padded laptop sleeve, and stash pockets.",
    image: "/images/products/skate-backpack-v3.jpg",
    variantName: "Color",
    variantOptions: ["Sand", "Orange"],
    colors: ["#e4d5b3", "#ff5c35"],
  },
  {
    id: "keyboard-001",
    slug: "pro-skate-knee-pads",
    name: "Pro Knee Pad Set",
    category: "Protection",
    price: 145,
    compareAtPrice: 180,
    stockQuantity: 19,
    description:
      "Low-bulk knee pads with hard caps, breathable sleeves, and locked-in wraparound straps.",
    image: "/images/products/knee-pads-v3.jpg",
    variantName: "Size",
    variantOptions: ["Medium", "Large"],
    colors: ["#d8d5cc", "#242424"],
    badge: "Sale",
  },
  {
    id: "camera-001",
    slug: "break-in-skate-hi-tops",
    name: "Break-In Hi-Tops",
    category: "Footwear",
    price: 210,
    stockQuantity: 7,
    description:
      "Durable suede skate shoes with reinforced flick zones and cushioned impact insoles.",
    image: "/images/products/hi-top-shoes-v3.jpg",
    variantName: "Color",
    variantOptions: ["Chalk", "Orange", "Coral"],
    colors: ["#e9e5da", "#ff5c35", "#d9654d"],
  },
  {
    id: "vase-002",
    slug: "pocket-skate-tool",
    name: "Pocket Skate Tool",
    category: "Accessories",
    price: 45,
    stockQuantity: 13,
    description:
      "A compact all-in-one tool for axle nuts, kingpins, mounting hardware, and quick fixes.",
    image: "/images/products/skate-tool-v3.jpg",
    variantName: "Finish",
    variantOptions: ["Bone", "Orange"],
    colors: ["#e8e0d2", "#ff5c35"],
  },
  {
    id: "tray-001",
    slug: "after-school-logo-tee",
    name: "After-School Logo Tee",
    category: "Apparel",
    price: 70,
    compareAtPrice: 90,
    stockQuantity: 26,
    description:
      "A heavyweight cotton shop tee with a relaxed fit made for skating and everything after.",
    image: "/images/products/logo-tee-v3.jpg",
    variantName: "Color",
    variantOptions: ["Washed orange", "Forest"],
    colors: ["#bd6e27", "#526955"],
    badge: "22% off",
  },
];
