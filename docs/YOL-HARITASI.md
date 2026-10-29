# Yol Haritası

Tahmini süre: 8–10 hafta. Her faz bitince commit atılır ve push edilir. Kutular yapıldıkça işaretlenir.

## Faz 0: Hazırlık (müşteri + biz, paralel)
- [ ] Anlaşma yazılı onaylandı, ilk ödeme (%50) alındı
- [ ] PayTR mağaza başvurusu yapıldı (müşteri, onay günler sürebilir)
- [ ] Alan adı müşteri adına alındı
- [ ] Müşteriden: logo (vektör), ürün fotoğrafları, hikâye metinleri
- [ ] Müşteriden: Kendin Tasarla için şeffaf zeminli zincir/charm görselleri

## Faz 1: İskelet ve tasarım sistemi
- [ ] Next.js (TypeScript) + Tailwind kurulumu, proje klasör yapısı
- [ ] Marka renkleri (bordo / krem / altın), yazı tipleri, bileşenler
- [ ] Animasyon altyapısı (Framer Motion), sayfa geçişleri
- [ ] `.env.example`, temel lint ve format ayarları

## Faz 2: Vitrin sayfaları
- [ ] Ana sayfa (hero animasyonu, koleksiyonlar, güven bandı)
- [ ] Biz Kimiz, Atölyeden Size, İletişim (harita, WhatsApp)
- [ ] Koleksiyon sayfaları: Daily, Signature, Heritage
- [ ] Mobil uyum kontrolü
- [ ] **Müşteri tasarım onayı** (2. ödeme)

## Faz 3: Veri modeli ve yönetim paneli
- [ ] PostgreSQL + Prisma: ürün, kategori, parça (zincir/charm), sipariş, kur
- [ ] Admin girişi
- [ ] Ürün ekle/düzenle/sil, fotoğraf yükleme
- [ ] Altın/gümüş gram fiyatı girişi (8/14/18/22 ayar, 925)
- [ ] Fiyat motoru: `gram × ayar fiyatı + işçilik + taş`

## Faz 4: Ürün kataloğu
- [ ] Kategoriler (Kids ve Erkek ayrı vitrin dahil)
- [ ] Filtreler: ayar, taş, renk, fiyat
- [ ] Ürün sayfası: renk/ölçü seçimi, güven bilgileri

## Faz 5: Kendin Tasarla
- [ ] Parça yönetimi (admin): zincir, charm, ara parça, malzeme
- [ ] Sihirbaz arayüzü ve canlı önizleme (katmanlı görsel)
- [ ] Sunucuda fiyat hesabı (tarayıcıdaki fiyata güvenilmez)
- [ ] Animasyonlu yerleşme efektleri
- [ ] İlk sürüm: yalnızca charm kolye

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
