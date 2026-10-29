import type { Metadata } from "next";
import { DesignWizard } from "@/components/design/design-wizard";
import { ComingSoon } from "@/components/ui/coming-soon";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { parseDesignParams } from "@/lib/design";
import { designMetals, listDesignParts } from "@/lib/design-server";

export const metadata: Metadata = {
  title: "Kendin Tasarla | NESİL1984",
  description: "Zincirini seç, charm'larını ekle, ayarını belirle. Hayalindeki kolyeyi tasarla, Şişli atölyemizde üretelim.",
};

export default async function DesignPage(props: PageProps<"/kendin-tasarla">) {
  const [parts, metals, params] = await Promise.all([listDesignParts(), designMetals(), props.searchParams]);

  // Zincir, charm ya da gram fiyatı yoksa sihirbaz çalışamaz: tanıtım sayfası gösterilir.
  if (parts.chains.length === 0 || parts.charms.length === 0 || metals.length === 0) {
    return (
      <ComingSoon
        eyebrow="Kendin Tasarla"
        title={["Hayalindeki takıyı", <span key="i" className="italic text-altin-600">sen tasarla</span>]}
        text="Zincirini seç, charm'larını ekle, rengini belirle. Tasarım sihirbazımız çok yakında."
        motif="necklace"
      />
    );
  }

  return (
    <main>
      <PageHero
        eyebrow="Kendin Tasarla"
        title={["Hayalindeki kolyeyi", <span key="i" className="italic text-altin-600">sen tasarla</span>]}
        text="Zincirini seç, charm'larını ekle, ayarını belirle. Tasarımını Şişli atölyemizde elde üretelim."
      />
      <section className="bg-krem-50 py-16 md:py-24">
        <Container>
          <DesignWizard {...parts} metals={metals} initial={parseDesignParams(params)} />
        </Container>
      </section>
    </main>
  );
}
