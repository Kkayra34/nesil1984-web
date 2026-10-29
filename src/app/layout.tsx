import type { Metadata } from "next";
import { Bodoni_Moda, Cormorant_Garamond, Jost } from "next/font/google";
import { Providers } from "@/components/providers";
import { siteUrl } from "@/lib/site";
import "./globals.css";

// Marka yazısı için: logodaki gibi yüksek kontrastlı ve rakamları büyük harf boyunda.
const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "NESİL1984 | Atelier & Jewelry",
  description:
    "Üç nesildir süren Şişli atölyemizden altın, pırlanta ve kişiye özel tasarım mücevherler. Köklerden geleceğe.",
  openGraph: { siteName: "NESİL1984", locale: "tr_TR", type: "website" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${cormorant.variable} ${jost.variable} ${bodoni.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
