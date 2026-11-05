export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  collection: string;
  material: string;
  metals: string[];
  images: string[];
  description: string;
  stock: number;
  isNew?: boolean;
  isFeatured?: boolean;
};

export const PRODUCTS: Product[] = [
  {
    id: "celeste-solitaire",
    name: "Celeste Solitaire Ring",
    price: 4200,
    category: "Rings",
    collection: "Bridal",
    material: "Diamond",
    metals: ["Platinum", "Yellow Gold", "Rose Gold"],
    images: ["/ring.jpg"],
    description:
      "A single brilliant-cut diamond held in a delicate six-prong setting. The Celeste solitaire is an enduring symbol, cut for maximum light return and set by hand.",
    stock: 8,
    isFeatured: true,
  },
  {
    id: "aurora-halo-ring",
    name: "Aurora Halo Ring",
    price: 5800,
    category: "Rings",
    collection: "Bridal",
    material: "Diamond",
    metals: ["Platinum", "White Gold"],
    images: ["/bridal.jpg"],
    description:
      "A cushion-cut centre stone framed by a halo of pavé diamonds. The Aurora halo amplifies brilliance from every angle.",
    stock: 5,
    isFeatured: true,
    isNew: true,
  },
  {
    id: "heritage-gold-band",
    name: "Heritage Gold Band",
    price: 1450,
    category: "Rings",
    collection: "Heritage",
    material: "Gold",
    metals: ["Yellow Gold", "Rose Gold"],
    images: ["/ring.jpg"],
    description:
      "A weighty, hand-finished band with a softly brushed surface. Made to be worn alone or stacked for a lifetime.",
    stock: 14,
  },
  {
    id: "silver-whisper-band",
    name: "Silver Whisper Band",
    price: 680,
    category: "Rings",
    collection: "Heritage",
    material: "Silver",
    metals: ["Sterling Silver"],
    images: ["/ring.jpg"],
    description:
      "A slim sterling silver band with a high-polish edge. Light enough to layer, refined enough to stand alone.",
    stock: 22,
  },
  {
    id: "eternal-hoops",
    name: "Eternal Hoops",
    price: 980,
    category: "Earrings",
    collection: "Celeste",
    material: "Gold",
    metals: ["Yellow Gold", "White Gold"],
    images: ["/hoops.jpg"],
    description:
      "Perfectly round gold hoops with a hidden hinge and a mirror finish. An everyday icon, reimagined in solid gold.",
    stock: 11,
    isFeatured: true,
  },
  {
    id: "diamond-drop-earrings",
    name: "Diamond Drop Earrings",
    price: 2300,
    category: "Earrings",
    collection: "Celeste",
    material: "Diamond",
    metals: ["White Gold", "Platinum"],
    images: ["/hoops.jpg"],
    description:
      "Linear drops of graduated diamonds, each stone suspended to catch the light as you move.",
    stock: 6,
    isNew: true,
  },
  {
    id: "silver-thread-earrings",
    name: "Silver Thread Earrings",
    price: 420,
    category: "Earrings",
    collection: "Heritage",
    material: "Silver",
    metals: ["Sterling Silver"],
    images: ["/hoops.jpg"],
    description:
      "Whisper-thin sterling threads that thread through the lobe for a floating, weightless effect.",
    stock: 0,
  },
  {
    id: "bangle-of-light",
    name: "Bangle of Light",
    price: 1650,
    category: "Bracelets",
    collection: "Aurora",
    material: "Gold",
    metals: ["Yellow Gold", "Rose Gold"],
    images: ["/bangle.jpg"],
    description:
      "A sculptural gold bangle with a polished concave face that captures and reflects the light around you.",
    stock: 9,
    isFeatured: true,
  },
  {
    id: "tennis-bracelet",
    name: "Tennis Bracelet",
    price: 6900,
    category: "Bracelets",
    collection: "Celeste",
    material: "Diamond",
    metals: ["White Gold", "Platinum"],
    images: ["/bangle.jpg"],
    description:
      "A continuous line of matched diamonds set in a secure four-prong gallery. The definition of quiet brilliance.",
    stock: 4,
  },
  {
    id: "silver-cuff",
    name: "Silver Cuff",
    price: 540,
    category: "Bracelets",
    collection: "Heritage",
    material: "Silver",
    metals: ["Sterling Silver"],
    images: ["/bangle.jpg"],
    description:
      "An open sterling cuff with a hand-hammered texture. Effortless to wear, impossible to ignore.",
    stock: 18,
  },
  {
    id: "aurora-necklace",
    name: "Aurora Necklace",
    price: 2750,
    category: "Necklaces",
    collection: "Aurora",
    material: "Gold",
    metals: ["Yellow Gold", "White Gold"],
    images: ["/aurora-necklace.jpg"],
    description:
      "A pendant of pavé diamonds suspended from a fine gold chain. Light pools at the collarbone like a held breath.",
    stock: 7,
    isFeatured: true,
    isNew: true,
  },
  {
    id: "hero-pendant",
    name: "Hero Pendant",
    price: 3400,
    category: "Necklaces",
    collection: "Bridal",
    material: "Diamond",
    metals: ["Platinum", "White Gold"],
    images: ["/hero-necklace.jpg"],
    description:
      "A single pear-shaped diamond on an adjustable chain. A piece designed to be the final note of any ensemble.",
    stock: 5,
    isFeatured: true,
  },
  {
    id: "chain-of-stars",
    name: "Chain of Stars",
    price: 1200,
    category: "Necklaces",
    collection: "Celeste",
    material: "Gold",
    metals: ["Yellow Gold"],
    images: ["/chain.jpg"],
    description:
      "A layered gold chain with tiny star-set studs along its length. Made to be worn long or doubled.",
    stock: 12,
  },
  {
    id: "bridal-necklace",
    name: "Bridal Necklace",
    price: 4800,
    category: "Necklaces",
    collection: "Bridal",
    material: "Diamond",
    metals: ["Platinum", "White Gold"],
    images: ["/bridal.jpg"],
    description:
      "A collar of brilliant diamonds graduating to a central stone. The crowning piece of the bridal story.",
    stock: 3,
    isFeatured: true,
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function searchProducts(q: string): Product[] {
  const t = q.trim().toLowerCase();
  if (!t) return [];
  return PRODUCTS.filter((p) =>
    [p.name, p.category, p.collection, p.material].join(" ").toLowerCase().includes(t),
  );
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export const CATEGORIES = ["Rings", "Earrings", "Bracelets", "Necklaces"];
export const MATERIALS = ["Diamond", "Gold", "Silver"];
export const COLLECTIONS = ["Bridal", "Aurora", "Heritage", "Celeste"];
