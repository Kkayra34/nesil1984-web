import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "İletişim | NESİL1984",
  description: "Şişli'deki atölyemizi ziyaret edin ya da bize WhatsApp, telefon veya e-posta ile ulaşın.",
};

export default function ContactPage() {
  const { address, phone, email, hours } = site.contact;
  const wa = whatsappLink("Merhaba, bilgi almak istiyorum.");

  const items = [
    { icon: MapPin, label: "Adres", value: address || "Şişli, İstanbul" },
    { icon: Phone, label: "Telefon", value: phone, href: phone && `tel:${phone.replace(/\s/g, "")}` },
    { icon: Mail, label: "E-posta", value: email, href: email && `mailto:${email}` },
    { icon: Clock, label: "Çalışma saatleri", value: hours },
  ].filter((i) => i.value);

  const mapQuery = encodeURIComponent(address || "Şişli, İstanbul");

  return (
    <main>
      <PageHero
        eyebrow="İletişim"
        title={["Atölyemize", <span key="i" className="italic text-altin-600">bekleriz</span>]}
        text="Bir parçayı yakından görmek, kişiye özel bir tasarım konuşmak ya da tamir için bize ulaşın."
      />

      <section className="bg-krem-50 py-24">
        <Container className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <ul className="divide-y divide-krem-300/70 border-y border-krem-300/70">
              {items.map((item, i) => (
                <Reveal key={item.label} delay={i * 0.1}>
                  <li className="flex gap-5 py-6">
                    <item.icon className="mt-0.5 size-5 shrink-0 text-altin-600" strokeWidth={1.25} />
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.3em] text-altin-600">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="mt-2 block text-bordo-800 hover:text-altin-700">
                          {item.value}
                        </a>
                      ) : (
                        <p className="mt-2 text-bordo-800">{item.value}</p>
                      )}
                    </div>
                  </li>
                </Reveal>
              ))}
            </ul>
            {wa && (
              <Reveal delay={0.4}>
                <Button href={wa} className="mt-10">
                  <MessageCircle className="size-4" strokeWidth={1.5} /> WhatsApp ile yazın
                </Button>
              </Reveal>
            )}
          </div>

          <Reveal delay={0.2} className="lg:col-span-7">
            <iframe
              title="NESİL1984 atölye konumu"
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              className="aspect-[4/3] w-full border-0 grayscale-[35%] sepia-[15%]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
        </Container>
      </section>
    </main>
  );
}
