import Link from "next/link";
import { Container } from "@/components/ui/container";
import { collections, mainNav, site } from "@/lib/site";
import { Logo } from "./logo";

export function Footer() {
  const { address, phone, email, hours } = site.contact;
  const contactLines = [address, phone, email, hours].filter(Boolean);

  return (
    <footer className="bg-bordo-950 text-krem-100">
      <Container className="grid gap-12 py-20 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo light />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-krem-100/70">
            {site.description}
          </p>
        </div>

        <div className="md:col-span-2 md:col-start-6">
          <h3 className="text-[0.65rem] uppercase tracking-[0.3em] text-altin-400">Keşfet</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {[...mainNav, { href: "/siparis-takip", label: "Sipariş takip" }].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-krem-100/75 transition-colors hover:text-krem-50">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-[0.65rem] uppercase tracking-[0.3em] text-altin-400">Koleksiyonlar</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {collections.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/koleksiyonlar/${c.slug}`}
                  className="text-krem-100/75 transition-colors hover:text-krem-50"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <h3 className="text-[0.65rem] uppercase tracking-[0.3em] text-altin-400">Atölye</h3>
          <ul className="mt-5 space-y-3 text-sm text-krem-100/75">
            {contactLines.length > 0 ? (
              contactLines.map((line) => <li key={line}>{line}</li>)
            ) : (
              <li>Şişli, İstanbul</li>
            )}
          </ul>
        </div>
      </Container>

      <div className="border-t border-krem-50/10">
        <Container className="flex flex-col items-center justify-between gap-3 py-6 text-[0.7rem] tracking-wider text-krem-100/50 md:flex-row">
          <p>© {new Date().getFullYear()} NESİL1984. Tüm hakları saklıdır.</p>
          <p className="font-display text-sm italic text-altin-400/80">
            Bir ustalık. Üç nesil. Yeni bir hikâye.
          </p>
        </Container>
      </div>
    </footer>
  );
}
