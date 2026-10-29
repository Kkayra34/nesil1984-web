# NESİL1984 Web Sitesi

Şişli'deki üç nesillik kuyumcu atölyesi NESİL1984 için tanıtım + e-ticaret sitesi.

## Kararlar
- **Teknoloji:** Next.js 16 (TypeScript) + Tailwind 4, Neon PostgreSQL + Drizzle ORM, PayTR ödeme, bulut görsel depolama
- **Tasarım:** Özgün, animasyonlu; bordo / krem / altın paleti, zarif serif başlıklar
- **Kendin Tasarla:** Zincir + charm sihirbazı, sunucuda fiyat hesabı, doğrudan PayTR ile ödeme (ilk sürümde sadece charm kolye)
- **Kişiye özel tasarım:** Talep formu, atölye teklif verir
- **Fiyat:** `gram × ayar gram fiyatı + işçilik + taş`; altın/gümüş gram fiyatları admin panelinden girilir
- **Teslimat:** Kargo veya mağazadan teslim
- **Kategoriler:** Kids ve Erkek ayrı vitrin

## Komutlar
| Komut | Ne yapar |
|---|---|
| `npm run dev` | Geliştirme sunucusu (http://localhost:3000) |
| `npm test` | Fiyat motoru ve oturum testleri |
| `npm run db:generate` | Şema değişince migration dosyası üretir |
| `npm run db:migrate` | Migration'ları Neon'a uygular |
| `npm run db:seed` | Kategorileri yükler |
| `npm run admin:create` | Admin hesabı oluşturur / şifresini değiştirir |

## Gizli bilgiler
Anahtarlar `.env` dosyasında tutulur, git'e girmez. Değerler Bitwarden'dadır. Örnek şablon: `.env.example`.

## Durum
Planlama tamamlandı. Geliştirme yol haritasına göre adım adım ilerler, her adım bu repoya push edilir.
