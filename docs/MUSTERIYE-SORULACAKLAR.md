# Müşteriye sorulacaklar

Cevap gelince ilgili kutu işaretlenir, cevap "Cevap:" satırına yazılır. Şifre, anahtar ve token değerleri buraya yazılmaz (Bitwarden). Önceliği **Canlıdan önce şart** olanlar belirler.

## 1. Şirket ve satıcı bilgileri (canlıdan önce şart)
Yasal metinlerde (mesafeli satış sözleşmesi, KVKK) görünür. `src/lib/site.ts` içine girilir.
- [ ] Ticari unvan (örn. "… Kuyumculuk Ltd. Şti." / şahıs işletmesi ise ad soyad)
- [ ] Vergi dairesi ve vergi numarası
- [ ] Mersis numarası (varsa)
- [ ] Açık adres (Şişli, tam adres) ve Google harita bağlantısı
- [ ] Telefon, WhatsApp numarası, e-posta adresi
- [ ] Çalışma saatleri, Instagram hesabı
- [ ] Sipariş bildirimlerinin düşeceği e-posta (`SHOP_EMAIL`): kim ilgilenecek?

## 2. Ödeme (PayTR) (canlıdan önce şart)
- [ ] PayTR mağaza başvurusu yapıldı mı, onaylandı mı? Onay günler sürebilir
- [ ] Mağaza numarası, mağaza parolası, mağaza gizli anahtarı (değerler Bitwarden'a, bize güvenli yolla)
- [ ] Taksit olsun mu? Kaç taksite kadar? (şu an PayTR'ın izin verdiği en yüksek)
- [ ] Havale/EFT ile ödeme de isteniyor mu? (şu an yalnızca kart)

## 3. Kargo ve teslimat (canlıdan önce şart)
- [ ] Kargo ücreti: ücretsiz mi, sabit ücret mi? Belirli tutarın üstünde ücretsiz mi? (şu an ücretsiz)
- [ ] Hangi kargo firması? Değerli ürünler için sigortalı mı gönderilecek?
- [ ] Siparişin hazırlanıp kargoya verilme süresi kaç gün? (yasal üst sınır 30 gün; sitede ne yazsın?)
- [ ] Mağazadan teslimde kurallar: kimlik gerekir mi, ürün kaç gün bekletilir, hangi saatlerde?
- [ ] Yurt dışına gönderim olacak mı? (şu an yalnızca Türkiye)

## 4. İade, cayma ve yasal (canlıdan önce şart)
- [ ] Metinleri okuyacak avukat ya da mali müşavir kim? (taslaklar `src/lib/legal.ts`)
- [ ] İade kargo ücretini kim öder? (müşteri / mağaza)
- [ ] Kişiye özel ürünlerde ve Kendin Tasarla ürünlerinde iade/cayma yok kabul ediliyor mu? (hukukçu teyit etmeli)
- [ ] Hasarlı/ayıplı üründe süreç: değişim mi, bedel iadesi mi?
- [ ] Ürünle birlikte fatura ve sertifika veriliyor mu? Faturayı kim, nasıl kesiyor? (e-fatura entegrasyonu kapsam dışı)

## 5. Alan adı, e-posta ve hesaplar (canlıdan önce şart)
- [ ] Alan adı alındı mı, kimin adına? (anlaşmada müşteri adına)
- [ ] Sipariş e-postaları hangi adresten gitsin? (örn. siparis@alanadi.com). Alan adında DNS kaydı eklemek gerekecek
- [ ] Hosting, veritabanı ve görsel depolama (Vercel, Neon, Cloudinary) hesapları müşteri adına mı açılsın, bizim hesabımızda mı kalsın? Aylık maliyeti kim öder?
- [ ] Yönetim paneline kaç kişi girecek? Hesapları kime açalım?

## 6. Ürünler (canlıdan önce şart)
- [ ] İlk açılışta kaç ürün olacak, ürün listesi ve fotoğrafları (logo vektör dosyası dahil)
- [ ] Her ürün için: ayar, renk (sarı/beyaz/rose), taş, ölçü seçenekleri ve ağırlıkları, koleksiyonu (Daily / Signature / Heritage), kategorisi
- [ ] Fiyat nasıl belirleniyor: gram × altın fiyatı + işçilik + taş mı, sabit fiyat mı? İşçilik oranları nedir?
- [ ] Stok takibi isteniyor mu? Şu an stok sayısı yok; ürün satışta ya da kapalı. Tek parça ürünler satılınca otomatik kapansın mı?
- [ ] İndirim kodu / kampanya fiyatı olacak mı? (üstü çizili eski fiyat gösterimi var, kod sistemi yok)
- [ ] Hikâye, Biz Kimiz ve Atölye sayfaları için metinler ve fotoğraflar

## 7. Altın kuru (canlıdan önce şart)
Ürün fiyatları buna bağlı. Elle güncelleme unutulursa zarar edilebilir.
- [ ] Kuru kim, günde kaç kez güncelleyecek?
- [ ] Hangi kaynağa bakılacak? (isterse otomatik kur çekme eklenebilir, ek iş ve ek maliyet)
- [ ] Kur girilmemiş ya da çok eskiyse ne yapılsın? (şu an son girilen kullanılır)

## 8. Kendin Tasarla
- [ ] Sunulacak zincir ve charm listesi: kaç çeşit zincir, kaç çeşit charm? Başlangıçta 5-10 parçayla açmak yeterli mi?
- [ ] Her parçanın fotoğrafı var mı? Hangi fonda (beyaz, renkli, elde)? Yoksa kim, nasıl çekecek? (fotoğraf çekimi kapsam dışı)
- [ ] Şeffaf zeminli (PNG) görsel hazırlanabilir mi, yoksa arka planı otomatik silen yöntem mi kullanalım? (ek maliyet olabilir)
- [ ] Hangi ayarlar sunulsun? 8, 14, 18, 22 ayar ve gümüş. Şu an gram fiyatı girilmiş hepsi çıkıyor
- [ ] Her parçanın gram ağırlığı ve işçilik bedeli
- [ ] Sadece charm kolye mi? Yüzük, bileklik, küpe ileride isteniyor mu? (ilk sürüm yalnızca charm kolye)
- [ ] Müşteri tasarımı tek parça mı üretiliyor? Üretim süresi kaç gün?

## 9. Kişiye özel tasarım talepleri
- [ ] Talebe kaç saat/gün içinde dönüş yapılacak? (formda "en kısa sürede" yazıyor)
- [ ] Hangi ürün türleri sunuluyor: isim kolyesi, harf, tarih, yüzük, bileklik, küpe, diğer. Eklenecek/çıkarılacak var mı?
- [ ] Ön ödeme / kapora alınacak mı? Talepten siparişe geçiş nasıl olacak? (şu an talep sadece kaydediliyor, ödeme ayrı yapılıyor)
- [ ] Talepleri kim takip edecek?

## 10. Müşteriye giden e-postalar
- [ ] Sipariş alındı, kargoya verildi, teslime hazır, iptal e-postalarının metinlerini ve imzayı onaylasın (şu an düz metin, kısa)
- [ ] E-postalarda logo olsun mu?

## 11. Site kararları
- [ ] Logo (vektör), renkler ve yazı tipi onayı (şu an marka yazısı geçici yazı tipiyle)
- [ ] Kids ve Erkek için ayrı sayfa istiyor mu, yoksa kategori filtresi yeterli mi? (şu an filtre)
- [ ] Instagram akışı, blog, müşteri yorumları gibi eklemek istediği bir şey var mı?
- [ ] Reklam / istatistik aracı (Google Analytics, Meta Pixel) kullanacak mı? Kullanırsa çerez onay penceresi gerekir
- [ ] Siteyi açık denemek için ilk gösterim tarihi ve yayına alma hedef tarihi

## 12. Sözleşme ve süreç
- [ ] Anlaşma yazılı onaylandı mı, ilk ödeme (%50) alındı mı?
- [ ] Tasarım onayı verildi mi? (2. ödeme)
- [ ] Yönetim paneli eğitimi için uygun gün ve kaç kişi katılacak?
- [ ] 1 aylık ücretsiz hata düzeltme sonrası destek/bakım isteniyor mu? Hangi koşulla?
- [ ] Sitede kullanılacak içerikler için yetkili kişi kim? (soru sorulunca kime ulaşalım)

## Kısaca, canlıya çıkmak için en az gerekenler
1. Satıcı bilgileri (bölüm 1)
2. PayTR onayı ve anahtarları (bölüm 2)
3. Kargo kararı (bölüm 3)
4. Alan adı ve e-posta adresi (bölüm 5)
5. İlk ürünler ve fotoğrafları (bölüm 6)
6. Avukat/mali müşavir onayı (bölüm 4)
