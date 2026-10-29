// Sitenin her yerde kullanılan sabit bilgileri.
// İletişim bilgileri müşteriden gelince doldurulacak; boş alanlar sitede gizlenir.
export const site = {
  name: "NESİL1984",
  tagline: "Köklerden geleceğe",
  description:
    "Üç nesildir süren Şişli atölyemizde tasarlayıp ürettiğimiz altın, pırlanta ve kişiye özel mücevherler.",
  contact: {
    address: "", // örn. "Halaskargazi Cd. No:1, Şişli / İstanbul"
    phone: "", // örn. "+90 212 000 00 00"
    whatsapp: "", // sadece rakam, örn. "905000000000"
    email: "",
    hours: "", // örn. "Pzt–Cmt 10:00–19:00"
    instagram: "", // örn. "https://instagram.com/nesil1984"
  },
};

// Teslimat ücretleri (kuruş). Müşteri karar verince güncellenecek; şimdilik kargo ücretsiz.
export const shipping = {
  cargoFeeKurus: 0,
  /** Bu tutarın üstünde kargo ücretsiz (null = her zaman cargoFeeKurus). */
  freeCargoOverKurus: null as number | null,
};

export function shippingFee(delivery: "CARGO" | "PICKUP", subtotalKurus: number) {
  if (delivery === "PICKUP") return 0;
  if (shipping.freeCargoOverKurus !== null && subtotalKurus >= shipping.freeCargoOverKurus) return 0;
  return shipping.cargoFeeKurus;
}

export const mainNav = [
  { href: "/koleksiyonlar", label: "Koleksiyonlar" },
  { href: "/urunler", label: "Ürünler" },
  { href: "/kendin-tasarla", label: "Kendin Tasarla" },
  { href: "/hakkimizda", label: "Biz Kimiz" },
  { href: "/atolye", label: "Atölye" },
  { href: "/iletisim", label: "İletişim" },
];

export type Collection = {
  slug: "daily" | "signature" | "heritage";
  name: string;
  short: string;
  description: string;
  motif: JewelMotifName;
};

export type JewelMotifName = "ring" | "necklace" | "earring" | "bracelet" | "chain" | "pendant";

export const collections: Collection[] = [
  {
    slug: "daily",
    name: "Nesil Daily",
    short: "Günlük, minimal, ulaşılabilir.",
    description:
      "Her gün takılmak için tasarlanan sade ve zarif parçalar. İnce zincirler, minimal yüzükler ve katmanlanabilen kolyeler.",
    motif: "necklace",
  },
  {
    slug: "signature",
    name: "Nesil Signature",
    short: "Markanın esas tasarım koleksiyonu.",
    description:
      "NESİL1984 çizgisini en net anlatan tasarımlar. Atölyemizde çizilip üretilen, imzamızı taşıyan parçalar.",
    motif: "ring",
  },
  {
    slug: "heritage",
    name: "Nesil Heritage",
    short: "Nesilden nesile aktarılacak parçalar.",
    description:
      "Yüksek işçilikli, taşlı ve bir ömür saklanacak mücevherler. Bugün takılıp yarına emanet edilenler.",
    motif: "pendant",
  },
];

export const categories: { label: string; slug: string; motif: JewelMotifName }[] = [
  { label: "Kolye", slug: "kolye", motif: "necklace" },
  { label: "Küpe", slug: "kupe", motif: "earring" },
  { label: "Bileklik", slug: "bileklik", motif: "bracelet" },
  { label: "Yüzük", slug: "yuzuk", motif: "ring" },
  { label: "Zincir", slug: "zincir", motif: "chain" },
  { label: "Setler", slug: "setler", motif: "pendant" },
  { label: "Düğün Setleri", slug: "dugun-setleri", motif: "necklace" },
  { label: "22 Ayar Bilezik", slug: "22-ayar-bilezik", motif: "bracelet" },
  { label: "Erkek", slug: "erkek", motif: "chain" },
  { label: "Kids", slug: "kids", motif: "earring" },
];

export function whatsappLink(message?: string) {
  if (!site.contact.whatsapp) return null;
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${site.contact.whatsapp}${text}`;
}
