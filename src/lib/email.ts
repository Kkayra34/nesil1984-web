import "server-only";

// E-posta gönderimi (Resend HTTP API). Anahtar yoksa e-posta gönderilmez, sunucu kaydına yazılır:
// geliştirmede ve sağlayıcı seçilene kadar sipariş akışı e-posta yüzünden durmaz.
// .env: RESEND_API_KEY, EMAIL_FROM ("NESİL1984 <siparis@alanadi.com>"), SHOP_EMAIL (yeni sipariş bildirimi)

type Mail = { to: string; subject: string; text: string };

export async function sendEmail(mail: Mail) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) {
    console.info(`[e-posta gönderilmedi: RESEND_API_KEY/EMAIL_FROM yok] ${mail.to} | ${mail.subject}`);
    return;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [mail.to], subject: mail.subject, text: mail.text }),
    });
    if (!res.ok) console.error("E-posta gönderilemedi:", res.status, await res.text());
  } catch (e) {
    // E-posta hatası siparişi bozmasın: kaydedip devam et.
    console.error("E-posta gönderilemedi:", e);
  }
}

export const shopEmail = () => process.env.SHOP_EMAIL || null;
