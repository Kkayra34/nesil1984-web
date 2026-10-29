import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { legalDoc, legalDocs, missingSellerInfo } from "@/lib/legal";

export function generateStaticParams() {
  return legalDocs().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/yasal/[slug]">): Promise<Metadata> {
  const doc = legalDoc((await params).slug);
  return doc ? { title: `${doc.title} | NESİL1984`, description: doc.summary } : {};
}

export default async function LegalPage({ params }: PageProps<"/yasal/[slug]">) {
  const doc = legalDoc((await params).slug);
  if (!doc) notFound();
  const missing = process.env.NODE_ENV === "production" ? [] : missingSellerInfo();

  return (
    <main className="bg-krem-50 py-16 md:py-24">
      <Container className="max-w-3xl">
        <h1 className="font-display text-5xl font-light text-bordo-800">{doc.title}</h1>
        <p className="mt-4 text-bordo-900/70">{doc.summary}</p>

        {missing.length > 0 && (
          <p className="mt-6 border-l-2 border-bordo-700 bg-krem-100 p-4 text-sm text-bordo-800">
            Geliştirme uyarısı (canlıda görünmez): satıcı bilgileri eksik: {missing.join(", ")}. <code>src/lib/site.ts</code> içinde
            doldurulmalı.
          </p>
        )}

        <div className="mt-10 space-y-10">
          {doc.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="font-display text-2xl text-bordo-800">{s.heading}</h2>
              <div className="mt-3 space-y-3 leading-relaxed text-bordo-900/80">
                {s.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <nav className="mt-16 flex flex-wrap gap-x-6 gap-y-2 border-t border-krem-300 pt-6 text-sm">
          {legalDocs()
            .filter((d) => d.slug !== doc.slug)
            .map((d) => (
              <Link key={d.slug} href={`/yasal/${d.slug}`} className="text-altin-700 underline-offset-4 hover:underline">
                {d.title}
              </Link>
            ))}
        </nav>
      </Container>
    </main>
  );
}
