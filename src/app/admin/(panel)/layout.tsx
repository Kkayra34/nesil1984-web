import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import { logout } from "../actions";

export const metadata: Metadata = {
  title: "Yönetim | NESİL1984",
  robots: { index: false, follow: false },
};

const nav = [
  { href: "/admin", label: "Genel bakış" },
  { href: "/admin/urunler", label: "Ürünler" },
  { href: "/admin/altin-kuru", label: "Altın kuru" },
  // Sonraki fazlarda eklenecek: Parçalar, Siparişler, Talepler
];

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  await requireAdmin();

  return (
    <div className="flex min-h-svh flex-col bg-krem-100 md:flex-row">
      <aside className="flex shrink-0 flex-col bg-bordo-950 text-krem-100 md:w-60">
        <div className="px-6 py-6">
          <p className="font-wordmark text-2xl tracking-[0.06em]">NESİL1984</p>
          <p className="mt-1 text-[0.6rem] uppercase tracking-[0.35em] text-altin-400">Yönetim</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 md:flex-col">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2.5 text-sm whitespace-nowrap text-krem-100/80 transition-colors hover:bg-bordo-900 hover:text-krem-50"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex gap-4 px-6 py-6 text-xs">
          <Link href="/" className="text-krem-100/60 hover:text-krem-50">
            Siteye git
          </Link>
          <form action={logout}>
            <button type="submit" className="text-krem-100/60 hover:text-krem-50">
              Çıkış
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-10">{children}</main>
    </div>
  );
}
