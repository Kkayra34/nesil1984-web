# Yol Haritası

Tahmini süre: 8–10 hafta. Her faz bitince commit atılır ve push edilir. Kutular yapıldıkça işaretlenir.

## Faz 0: Hazırlık (müşteri + biz, paralel)
- [ ] Anlaşma yazılı onaylandı, ilk ödeme (%50) alındı
- [ ] PayTR mağaza başvurusu yapıldı (müşteri, onay günler sürebilir)
- [ ] Alan adı müşteri adına alındı
- [ ] Müşteriden: logo (vektör), ürün fotoğrafları, hikâye metinleri
- [ ] Müşteriden: Kendin Tasarla için şeffaf zeminli zincir/charm görselleri

## Faz 1: İskelet ve tasarım sistemi
- [x] Next.js 16 (TypeScript) + Tailwind 4 kurulumu, proje klasör yapısı
- [x] Marka renkleri (bordo / krem / altın), yazı tipleri (Cormorant Garamond + Jost), temel bileşenler (Button, Container)
- [x] Animasyon altyapısı (`motion`): `Reveal` bileşeni, "hareketi azalt" desteği. Sayfa geçişleri Faz 2'de
- [x] `.env.example`, lint ve derleme temiz
- Not: `cacheComponents` kapatıldı (veritabanlı sayfalarda gereksiz karmaşıklık). Marka adı Faz 2'de müşterinin logo dosyasıyla gösterilecek (Cormorant'ın eski stil rakamları "1984"ü logodan farklı gösteriyor)

## Faz 2: Vitrin sayfaları
- [x] Header (duyuru bandı, kaydırınca küçülen menü, animasyonlu mobil menü), footer, sayfa geçişleri
- [x] Ana sayfa: kendini çizen zincir + düşen charm'lar hero animasyonu, kayan yazı bandı, koleksiyonlar, Kendin Tasarla tanıtımı, hikâye, kategoriler, atölye, güven bandı
- [x] Biz Kimiz, Atölye, İletişim (Google harita, WhatsApp butonu numara girilince görünür)
- [x] Koleksiyonlar sayfası ve Daily / Signature / Heritage sayfaları
- [x] Ürünler, Kendin Tasarla, Kişiye Özel için geçici "hazırlanıyor" sayfaları
- [x] Mobil uyum kontrolü (375px, yatay taşma yok)
- [ ] **Müşteriden bekleniyor:** adres, telefon, WhatsApp, e-posta, çalışma saatleri, Instagram (`src/lib/site.ts`)
- [ ] **Müşteri tasarım onayı** (2. ödeme)
- Not: Görseller şimdilik altın çizgili takı illüstrasyonları (`ArtFrame`). Fotoğraflar gelince bu bileşen değiştirilecek. Marka yazısı Bodoni Moda; logo dosyası gelince değiştirilecek

## Faz 3: Veri modeli ve yönetim paneli
- [x] Neon PostgreSQL + Drizzle ORM: 10 tablo (ürün, ölçü, görsel, kategori, parça, sipariş, sipariş kalemi, özel talep, kur, admin). Para kuruş, ağırlık miligram (tam sayı)
- [x] Fiyat motoru `src/lib/pricing.ts`: `gram × ayar fiyatı + işçilik + taş`, sabit fiyat modu, Kendin Tasarla toplamı, Türkçe tutar okuma ("37.170" = binlik). 13 test
- [x] Admin girişi: scrypt şifre, imzalı çerez, proxy + her işlemde `requireAdmin()`. 4 test
- [x] Altın kuru ekranı ve genel bakış paneli (uçtan uca denendi)
- [x] Kategoriler yüklendi (`npm run db:seed`)
- [ ] **Senin yapacağın:** `npm run admin:create` ile müşterinin admin hesabını oluştur
- [x] Ürün ekle/düzenle/sil, ölçü seçenekleri, fotoğraf yükleme (Cloudinary)
- [x] Kendin Tasarla parça yönetimi (`/admin/parcalar`)
- Not: Prisma'nın yeni sürümü Windows'ta kurulamadığı için Drizzle seçildi

## Faz 4: Ürün kataloğu
- [x] Kategoriler (Kids ve Erkek dahil): `/urunler?kategori=kids`, ana sayfa kartları buraya bağlı
- [x] Filtreler: ayar, taş, renk, fiyat (adres çubuğundan, JavaScript gerektirmez). 8 test
- [x] Ürün sayfası: renk/ölçü seçimi, ölçüye göre fiyat, güven bilgileri
- [x] `/urunler`, `/urunler/[slug]` ve koleksiyon sayfaları veritabanından gelir
- Not: Online sipariş Faz 6'ya kadar yok; ürün sayfasında WhatsApp / iletişim düğmesi var. Kids ve Erkek için ayrı sayfa yerine kategori filtresi kullanıldı

## Faz 5: Kendin Tasarla
- [x] Parça yönetimi (admin): zincir, charm, ara parça; şeffaf PNG önizleme görseli. Malzeme = gram fiyatı girilmiş ayarlar
- [x] Sihirbaz arayüzü (Zincir → Charm'lar → Ayar) ve canlı önizleme (katmanlı görsel, görsel yoksa altın çizim)
- [x] Sunucuda fiyat hesabı: tarayıcı sadece parça numarası gönderir, fiyat veritabanındaki parçalardan hesaplanır
- [x] Animasyonlu yerleşme efektleri (zincir çizilir, charm'lar yaylanarak düşer ve sallanır, diğerleri kayarak yer açar)
- [x] İlk sürüm: yalnızca charm kolye
- [ ] **Müşteriden bekleniyor:** şeffaf zincir/charm görselleri (zincir 1200×880, sitedeki eğriyi izlemeli)
- [ ] **Karar:** sihirbazda hangi ayarlar sunulsun (şu an gram fiyatı girilmiş hepsi, 22 ayar ve gümüş dahil)
- Not: Tasarım adres çubuğunda (`?zincir=1&parca=2-3-2&ayar=K14`), paylaşılabilir. Sipariş Faz 6'ya kadar WhatsApp/iletişim ile. 13 yeni test

## Faz 6: Sepet, ödeme, sipariş
- [ ] Sepet ve teslimat seçimi (kargo / mağazadan teslim)
- [ ] PayTR entegrasyonu (önce test modu, sonra canlı)
- [ ] Sipariş kaydı, e-posta bildirimleri
- [ ] Sipariş takip sayfası (sipariş no + e-posta/telefon)
- [ ] Admin: sipariş listesi ve durum güncelleme

## Faz 7: Kişiye özel tasarım, yasal, SEO
- [ ] Kişiye özel tasarım talep formu (admin'e düşer)
- [ ] KVKK, mesafeli satış, iade/cayma, çerez onayı
- [ ] SEO ayarları, sitemap, performans optimizasyonu

## Faz 8: Test ve yayın
- [ ] Uçtan uca test (sipariş, ödeme, iade akışı)
- [ ] Hosting ve veritabanı kurulumu, alan adı bağlama
- [ ] Müşteriye yönetim paneli eğitimi
- [ ] Yayına alma (3. ödeme)
- [ ] 1 ay ücretsiz hata düzeltme dönemi

## Notlar
- Gizli anahtarlar `.env` dosyasında, değerler Bitwarden'da. Git'e girmez.
- Kapsam dışı: fotoğraf çekimi, içerik yazımı, 3D önizleme, mobil uygulama, pazaryeri ve e-fatura entegrasyonu.
