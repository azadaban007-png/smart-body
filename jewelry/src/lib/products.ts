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
      "یک الماس برلیانت‌کات منفرد در نگین شش‌پر‌های ظریف. سلست یک نماد ماندگار است، برای بیشترین بازگشت نور برش خورده و با دست تنظیم شده.",
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
      "سنگ مرکزی کوشن‌کات احاطه‌شده با هاله‌ای از الماس‌های پاوه. هاله‌ی آرورا درخشش را از هر زاویه‌ای amplify می‌کند.",
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
      "حلقه‌ی طلایی سنگین با پرداخت دستی و سطحی مات و نرم. ساخته‌شده برای پوشیدن تنها یا روی هم برای یک عمر.",
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
      "حلقه‌ی نقره‌ای باریک با لبه‌ی کاملاً صیقلی. آن‌قدر سبک که روی هم بپوشی و آن‌قدر ظریف که تنها بدرخشد.",
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
      "حلقه‌های گوش طلایی کاملاً گرد با لولای پنهان و پرداخت آینه‌ای. نماد هرروز، در طلای یکپارچه بازتصور شده.",
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
      "گوشواره‌های خطی از الماس‌های درجه‌بندی‌شده، هر سنگ آویزان تا نور را با حرکت شما بگیرد.",
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
      "نخ‌های نقره‌ای بسیار باریک که از گوش‌وار عبور می‌کنند برای جلوه‌ای شناور و بی‌وزن.",
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
      "بنگل طلایی مجسمه‌سازانه با رویه‌ی مقعر صیقلی که نور اطراف شما را می‌گیرد و بازتاب می‌دهد.",
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
      "خط پیوسته‌ای از الماس‌های هم‌خانواده در گالری چهارپر امن. تعریف درخشش خاموش.",
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
      "کاف نقره‌ای باز با بافت چکشی دست‌ساز. پوشیدنش بی‌کوشش، نادیده‌گرفتنش غیرممکن.",
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
      "آویز الماس‌های پاوه آویزان از زنجیر طلایی ظریف. نور مانند نفسی نگه‌داشته‌شده در گردن جمع می‌شود.",
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
      "یک الماس گلابی‌شکل منفرد روی زنجیر قابل‌تنظیم. تکه‌ای طراحی‌شده تا نتهای نهایی هر ترکیب باشد.",
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
      "زنجیر طلایی چندلایه با میخ‌های ستاره‌ای کوچک در طولش. ساخته‌شده برای پوشیدن بلند یا دوبل.",
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
      "یقه‌ای از الماس‌های برلیانت که به سنگ مرکزی می‌رسد. تکه‌ی تاج‌بخش داستان عروس.",
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

/** Persian display names — values stay English (used as filter identifiers). */
export const FA = {
  categories: { Rings: "انگشتر", Earrings: "گوشواره", Bracelets: "دستبند", Necklaces: "گردنبند" },
  materials: { Diamond: "الماس", Gold: "طلا", Silver: "نقره" },
  collections: { Bridal: "عروس", Aurora: "آرورا", Heritage: "میراث", Celeste: "سلست" },
} as const;

export const faCat = (c: string) => FA.categories[c as keyof typeof FA.categories] ?? c;
export const faMat = (m: string) => FA.materials[m as keyof typeof FA.materials] ?? m;
export const faColl = (c: string) => FA.collections[c as keyof typeof FA.collections] ?? c;
