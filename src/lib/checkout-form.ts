// Ödeme formu doğrulama ve sipariş numarası. Tarayıcıda da çalışır (hata mesajları aynı olsun diye).

export type CheckoutInput = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  delivery: "CARGO" | "PICKUP";
  address: string | null;
  city: string | null;
  district: string | null;
  note: string | null;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** "0532 111 22 33", "+90 532 1112233", "5321112233" → "05321112233". Okunamazsa null. */
export function normalizePhone(input: string): string | null {
  let d = input.replace(/\D/g, "");
  if (d.startsWith("90") && d.length === 12) d = d.slice(2);
  if (d.length === 10) d = `0${d}`;
  return /^0\d{10}$/.test(d) ? d : null;
}

export function parseCheckoutForm(f: { get(name: string): FormDataEntryValue | null }): { error: string } | { data: CheckoutInput } {
  const str = (n: string, max = 200) => String(f.get(n) ?? "").trim().slice(0, max);

  const customerName = str("name", 100);
  if (customerName.length < 3) return { error: "Ad soyad girin." };
  const customerEmail = str("email", 120).toLowerCase();
  if (!EMAIL.test(customerEmail)) return { error: "Geçerli bir e-posta adresi girin." };
  const customerPhone = normalizePhone(str("phone", 30));
  if (!customerPhone) return { error: "Geçerli bir telefon numarası girin (örn. 0532 111 22 33)." };

  const delivery = str("delivery") === "PICKUP" ? "PICKUP" : "CARGO";
  const address = str("address", 500) || null;
  const city = str("city", 60) || null;
  const district = str("district", 60) || null;
  if (delivery === "CARGO" && (!address || !city || !district)) {
    return { error: "Kargo için adres, il ve ilçe gerekli." };
  }
  if (f.get("terms") !== "on") return { error: "Devam etmek için satış koşullarını onaylayın." };

  return {
    data: {
      customerName,
      customerEmail,
      customerPhone,
      delivery,
      address: delivery === "CARGO" ? address : null,
      city: delivery === "CARGO" ? city : null,
      district: delivery === "CARGO" ? district : null,
      note: str("note", 500) || null,
    },
  };
}

// Karışmayan harf/rakamlar (0/O, 1/I yok): müşteri telefonda okurken hata olmasın.
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

/** "N84-7K2Q9XWM": 8 rastgele karakter (~1 trilyon olasılık), tahmin edilemez. */
export function generateOrderNo(random: (n: number) => Uint8Array = (n) => crypto.getRandomValues(new Uint8Array(n))) {
  const bytes = random(8);
  return `N84-${Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("")}`;
}
