import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

// Geçici açılış sayfası: tasarım sistemini (renk, yazı tipi, animasyon) doğrulamak için.
// Gerçek ana sayfa Faz 2'de yapılacak.
export default function Home() {
  return (
    <main className="flex flex-1 items-center bg-krem-100">
      <Container className="py-24 text-center">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.4em] text-altin-600">
            Atelier &amp; Jewelry
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <h1 className="mt-6 font-display text-6xl font-light tracking-wide text-bordo-800 md:text-8xl">
            NESİL1984
          </h1>
        </Reveal>
        <Reveal delay={0.3}>
          <p className="mt-6 font-display text-2xl italic text-altin-600 md:text-3xl">
            Köklerden geleceğe
          </p>
        </Reveal>
        <Reveal delay={0.45}>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Button href="/">Koleksiyonlar</Button>
            <Button href="/" variant="outline">
              Kendin Tasarla
            </Button>
          </div>
        </Reveal>
      </Container>
    </main>
  );
}
