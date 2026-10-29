import { site } from "./site";

// Yasal metinler. TASLAKTIR: yayından önce müşterinin avukatı / mali müşaviri okumalı.
// Satıcı bilgileri src/lib/site.ts içindeki `legal` ve `contact` alanlarından gelir; boşsa "[…]" görünür.

export type LegalDoc = { slug: string; title: string; summary: string; sections: { heading: string; body: string[] }[] };

const fill = (v: string, label: string) => v || `[${label}]`;

/** Satıcı bilgileri boş olan alanların adları (geliştirme uyarısı için). */
export function missingSellerInfo() {
  const { legal, contact } = site;
  return [
    ["Ticari unvan", legal.companyName],
    ["Vergi dairesi", legal.taxOffice],
    ["Vergi no", legal.taxNo],
    ["Adres", contact.address],
    ["Telefon", contact.phone],
    ["E-posta", contact.email],
  ]
    .filter(([, v]) => !v)
    .map(([k]) => k);
}

function sellerLines() {
  const { legal, contact } = site;
  return [
    `Unvan: ${fill(legal.companyName, "ticari unvan")} (marka: ${site.name})`,
    `Adres: ${fill(contact.address, "adres")}`,
    `Telefon: ${fill(contact.phone, "telefon")} · E-posta: ${fill(contact.email, "e-posta")}`,
    `Vergi dairesi / no: ${fill(legal.taxOffice, "vergi dairesi")} / ${fill(legal.taxNo, "vergi no")}${legal.mersisNo ? ` · Mersis: ${legal.mersisNo}` : ""}`,
  ];
}

export function legalDocs(): LegalDoc[] {
  const email = fill(site.contact.email, "e-posta");
  const seller = sellerLines();

  return [
    {
      slug: "on-bilgilendirme-formu",
      title: "Ön Bilgilendirme Formu",
      summary: "Sipariş vermeden önce bilmen gereken satıcı, ürün, fiyat, teslimat ve cayma bilgileri.",
      sections: [
        { heading: "1. Satıcı", body: seller },
        {
          heading: "2. Ürün ve fiyat",
          body: [
            "Sözleşmeye konu ürünün cinsi, ayarı, rengi, ölçüsü ve adedi sipariş özetinde ve sipariş onay e-postasında yer alır.",
            "Fiyatlara KDV dahildir. Ürün fiyatları altının güncel gram fiyatına göre hesaplanır ve ödeme adımında yeniden kontrol edilir. Ödeme ekranındaki toplam, sipariş anındaki bağlayıcı tutardır.",
          ],
        },
        {
          heading: "3. Ödeme",
          body: [
            "Ödeme, PayTR güvenli ödeme sayfasında kredi/banka kartı ile yapılır. Kart bilgileri satıcıya iletilmez ve satıcı tarafından saklanmaz.",
            "Ödeme alınmadan sipariş onaylanmış sayılmaz.",
          ],
        },
        {
          heading: "4. Teslimat",
          body: [
            "Sipariş, ödemenin alınmasından sonra hazırlanır ve seçtiğin yönteme göre kargo ile adrese gönderilir ya da atölyemizden teslim edilir.",
            "Teslimat, her halükarda sipariş tarihinden itibaren 30 günü geçmez. Kargo ücreti ve varsa teslimat bedeli ödeme sayfasında gösterilir.",
          ],
        },
        {
          heading: "5. Cayma hakkı",
          body: [
            "Hazır ürünlerde, ürünü teslim aldığın tarihten itibaren 14 gün içinde herhangi bir gerekçe göstermeden ve cezai şart ödemeden sözleşmeden cayabilirsin.",
            `Cayma bildirimini ${email} adresine yazılı olarak iletmen yeterlidir. Ayrıntılar "İade ve Cayma Koşulları" sayfasındadır.`,
            "Kişiye özel hazırlanan ürünlerde (isim, harf, tarih vb. işlenenler) ve Kendin Tasarla ile senin seçimlerinle hazırlanan ürünlerde, mevzuat gereği cayma hakkı kullanılamaz.",
          ],
        },
        {
          heading: "6. Şikâyet ve başvuru",
          body: [
            "Şikâyetlerini yukarıdaki iletişim bilgilerine iletebilirsin. Uyuşmazlık halinde, yürürlükteki parasal sınırlar dahilinde yerleşim yerindeki veya satın aldığın yerdeki Tüketici Hakem Heyeti'ne ya da Tüketici Mahkemesi'ne başvurabilirsin.",
          ],
        },
      ],
    },
    {
      slug: "mesafeli-satis-sozlesmesi",
      title: "Mesafeli Satış Sözleşmesi",
      summary: "İnternet üzerinden verdiğin siparişin tarafların hak ve yükümlülüklerini düzenleyen sözleşmesi.",
      sections: [
        {
          heading: "1. Taraflar",
          body: [
            "SATICI:",
            ...seller,
            "ALICI: Sipariş formunda adı, telefonu, e-postası ve (kargo seçildiyse) teslimat adresi yazılı kişidir.",
          ],
        },
        {
          heading: "2. Konu",
          body: [
            "Bu sözleşme, ALICI'nın SATICI'ya ait internet sitesinden elektronik ortamda sipariş verdiği ürünün satışı ve teslimi ile 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümlerinin uygulanmasını düzenler.",
          ],
        },
        {
          heading: "3. Ürün, fiyat ve ödeme",
          body: [
            "Ürünün cinsi, ayarı, ölçüsü, adedi ve KDV dahil toplam bedeli sipariş özetinde belirtilmiştir. Ürün bedeli, siparişin verildiği andaki altın gram fiyatına göre hesaplanmış ve ödeme sayfasında ALICI'ya gösterilmiştir.",
            "Ödeme, PayTR altyapısıyla kredi/banka kartı ile yapılır. Ödemenin alınması ile sipariş kesinleşir.",
          ],
        },
        {
          heading: "4. Teslimat",
          body: [
            "Ürün, ödemenin alınmasından sonra hazırlanır ve ALICI'nın seçtiği teslimat yöntemine göre kargo ile adresine gönderilir ya da SATICI'nın atölyesinden teslim edilir. Teslimat süresi sipariş tarihinden itibaren en geç 30 gündür.",
            "ALICI, kargo teslimi sırasında paketi kontrol eder; hasarlı veya açılmış pakete ilişkin durumu kargo görevlisine tutanakla bildirir. Ürün ALICI'ya ya da bildirdiği kişiye teslim edildiğinde SATICI'nın teslim yükümlülüğü yerine gelmiş sayılır.",
          ],
        },
        {
          heading: "5. Cayma hakkı",
          body: [
            "ALICI, hazır ürünlerde teslim tarihinden itibaren 14 gün içinde gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayabilir. Cayma bildirimi SATICI'nın e-posta ya da yazılı adresine yapılır.",
            "Cayma halinde ürün, 14 gün içinde kullanılmamış, hasarsız ve orijinal ambalajı, sertifika ve faturası ile birlikte SATICI'ya gönderilir. Ürün bedeli, ürünün SATICI'ya ulaşıp kontrol edilmesinden sonra en geç 14 gün içinde, ödemede kullanılan yöntemle iade edilir.",
            "ALICI'nın istekleri veya kişisel ihtiyaçları doğrultusunda hazırlanan mallar (isim, harf, tarih işlenen ürünler ve Kendin Tasarla ile ALICI'nın seçimlerine göre hazırlanan ürünler) için cayma hakkı kullanılamaz.",
          ],
        },
        {
          heading: "6. Ayıplı ürün",
          body: [
            "Ürün ayıplı çıkarsa ALICI, 6502 sayılı Kanun'da yer alan seçimlik haklarını (ücretsiz onarım, değişim, bedel indirimi, sözleşmeden dönme) kullanabilir. Bildirimler SATICI'nın iletişim bilgilerine yapılır.",
          ],
        },
        {
          heading: "7. Uyuşmazlıkların çözümü",
          body: [
            "Bu sözleşmeden doğan uyuşmazlıklarda, yürürlükteki parasal sınırlar dahilinde ALICI'nın veya SATICI'nın yerleşim yerindeki Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir.",
          ],
        },
        {
          heading: "8. Yürürlük",
          body: [
            "ALICI, ödeme öncesinde bu sözleşmeyi ve Ön Bilgilendirme Formu'nu okuyup kabul ettiğini elektronik ortamda onaylar. Sözleşme, siparişin onaylanması ile yürürlüğe girer.",
          ],
        },
      ],
    },
    {
      slug: "iade-ve-cayma",
      title: "İade ve Cayma Koşulları",
      summary: "Hangi ürünler, ne zamana kadar, nasıl iade edilir.",
      sections: [
        {
          heading: "Hazır ürünler",
          body: [
            "Ürünü teslim aldığın günden itibaren 14 gün içinde, gerekçe göstermeden iade edebilirsin.",
            "Ürün kullanılmamış, hasarsız ve orijinal kutusu, sertifikası ve faturasıyla birlikte olmalıdır.",
          ],
        },
        {
          heading: "İade istemek için",
          body: [
            `${email} adresine sipariş numaranı ve iade isteğini yaz. Sana iade adımlarını ileteceğiz.`,
            "Ürünü sigortalı ve takip numaralı bir kargo ile göndermeni öneririz.",
            "Ürün bize ulaşıp kontrol edildikten sonra bedel, en geç 14 gün içinde ödeme yaptığın karta iade edilir.",
          ],
        },
        {
          heading: "İade edilemeyen ürünler",
          body: [
            "Kişiye özel hazırlanan ürünler (isim, harf, tarih vb. işlenenler) ve Kendin Tasarla ile senin seçimlerinle hazırlanan ürünler, mevzuat gereği cayma hakkı kapsamı dışındadır.",
          ],
        },
        {
          heading: "Hasarlı veya hatalı ürün",
          body: [
            "Ürün hasarlı geldiyse ya da siparişinden farklıysa, teslim aldığın gün bize yaz. Onarım, değişim veya bedel iadesi seçeneklerini birlikte değerlendiririz.",
          ],
        },
      ],
    },
    {
      slug: "kvkk-aydinlatma",
      title: "KVKK Aydınlatma Metni",
      summary: "Kişisel verilerinin kim tarafından, hangi amaçla işlendiği ve haklarının neler olduğu.",
      sections: [
        {
          heading: "1. Veri sorumlusu",
          body: ["6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca veri sorumlusu:", ...seller],
        },
        {
          heading: "2. İşlenen veriler",
          body: [
            "Kimlik ve iletişim: ad soyad, telefon, e-posta.",
            "Teslimat: adres, il, ilçe.",
            "Sipariş: ürünler, tutar, sipariş notu, sipariş durumu.",
            "Kişiye özel tasarım talebi: talep metni, tercihler, paylaştığın referans bağlantısı.",
            "Ödeme bilgileri (kart numarası vb.) tarafımızca alınmaz ve saklanmaz; ödeme PayTR tarafından işlenir.",
          ],
        },
        {
          heading: "3. İşleme amaçları ve hukuki sebepler",
          body: [
            "Siparişin alınması, hazırlanması, teslimi ve iadesi, sözleşmenin kurulması ve ifası için (KVKK m.5/2-c).",
            "Faturalama, muhasebe ve yasal saklama yükümlülükleri için (KVKK m.5/2-ç).",
            "Kişiye özel tasarım talebine dönüş yapmak ve teklif sunmak için (açık rıza ve sözleşme öncesi görüşme).",
            "Sipariş durumu bildirimleri ve müşteri hizmetleri için (meşru menfaat, KVKK m.5/2-f).",
          ],
        },
        {
          heading: "4. Aktarım",
          body: [
            "Verilerin, yalnızca hizmetin gerektirdiği ölçüde ve yasal sınırlar içinde şu taraflara aktarılabilir: ödeme kuruluşu (PayTR), kargo şirketleri, e-posta gönderim hizmeti, barındırma ve veritabanı hizmet sağlayıcıları, mali müşavir ve yetkili kamu kurumları.",
            "Bu hizmet sağlayıcılardan bazılarının sunucuları yurt dışında olabilir; bu durumda aktarım KVKK m.9 hükümlerine uygun yapılır.",
          ],
        },
        {
          heading: "5. Saklama süresi",
          body: [
            "Sipariş ve fatura kayıtları ilgili mevzuatta öngörülen süre boyunca (genellikle 10 yıl) saklanır. Kişiye özel talep kayıtları, talebin sonuçlanmasından sonra makul bir süre içinde silinir veya anonimleştirilir.",
          ],
        },
        {
          heading: "6. Haklarınız (KVKK m.11)",
          body: [
            "Kişisel verilerinin işlenip işlenmediğini öğrenme, işlenmişse bilgi isteme, amacına uygun kullanılıp kullanılmadığını öğrenme, aktarıldığı kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini isteme, silinmesini veya yok edilmesini isteme, bunların aktarıldığı kişilere bildirilmesini isteme, otomatik sistemlerle analiz edilmesi sonucu aleyhine bir sonuca itiraz etme ve zarara uğraman halinde tazminat talep etme haklarına sahipsin.",
            `Başvurularını ${email} adresine veya yukarıdaki posta adresine yazılı olarak iletebilirsin. Başvurun en geç 30 gün içinde sonuçlandırılır.`,
          ],
        },
      ],
    },
    {
      slug: "gizlilik-ve-cerezler",
      title: "Gizlilik ve Çerezler",
      summary: "Sitenin tarayıcında neleri sakladığı.",
      sections: [
        {
          heading: "Çerezler ve tarayıcı depolaması",
          body: [
            "Bu site yalnızca çalışması için zorunlu olanı kullanır: sepetin tarayıcının yerel depolamasında (nesil1984_sepet) tutulur ve cihazından dışarı çıkmaz. Yönetim paneli için oturum çerezi yalnızca yetkili yönetici girişinde oluşturulur.",
            "Şu anda reklam, izleme veya istatistik amaçlı çerez kullanılmamaktadır; bu nedenle çerez onay penceresi gösterilmez. Gelecekte bu tür bir araç eklenirse önce onayın istenecektir.",
          ],
        },
        {
          heading: "Kişisel verilerin korunması",
          body: [
            "Siparişlerde ve taleplerde paylaştığın bilgilerin nasıl işlendiği KVKK Aydınlatma Metni'nde açıklanmıştır. Ödeme bilgilerin yalnızca PayTR'ın güvenli ödeme sayfasına girilir.",
          ],
        },
      ],
    },
  ];
}

export function legalDoc(slug: string) {
  return legalDocs().find((d) => d.slug === slug);
}
