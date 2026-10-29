"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/shop/cart-store";
import { cn } from "@/lib/cn";
import { mainNav } from "@/lib/site";
import { Logo } from "./logo";

const announcements = [
  "Kendi atölyemizde tasarım ve üretim",
  "İstanbul içi aynı gün teslimat",
  "Kargo veya mağazadan teslim",
];

export function Header() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const count = useCart().reduce((n, l) => n + l.qty, 0);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 40));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <div className="bg-bordo-900 text-krem-100">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-center gap-8 overflow-hidden px-6 text-[0.65rem] uppercase tracking-[0.25em]">
          {announcements.map((a, i) => (
            <span key={a} className={cn(i > 0 && "hidden md:inline")}>
              {a}
            </span>
          ))}
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-40 transition-all duration-500 ease-soft",
          scrolled
            ? "border-b border-krem-200 bg-krem-50/90 backdrop-blur-md"
            : "border-b border-transparent bg-krem-100",
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-500 md:px-10",
            scrolled ? "h-16" : "h-20",
          )}
        >
          <Logo withTagline={!scrolled} />

          <nav aria-label="Ana menü" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "group relative py-2 text-[0.7rem] uppercase tracking-[0.22em] transition-colors",
                      isActive(item.href) ? "text-bordo-800" : "text-bordo-900/70 hover:text-bordo-800",
                    )}
                  >
                    {item.label}
                    <span
                      className={cn(
                        "absolute -bottom-0.5 left-0 h-px bg-altin-500 transition-all duration-500 ease-soft",
                        isActive(item.href) ? "w-full" : "w-0 group-hover:w-full",
                      )}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            <Link href="/sepet" className="relative p-2 text-bordo-800" aria-label={`Sepet, ${count} ürün`}>
              <ShoppingBag className="size-6" strokeWidth={1.25} />
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0.4 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0.5 right-0.5 flex min-w-4 items-center justify-center rounded-full bg-bordo-800 px-1 text-[0.6rem] leading-4 text-krem-50"
                >
                  {count}
                </motion.span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="p-2 text-bordo-800 lg:hidden"
              aria-label="Menüyü aç"
              aria-expanded={open}
            >
              <Menu className="size-6" strokeWidth={1.25} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col bg-bordo-900 text-krem-50 lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="flex h-20 items-center justify-between px-6">
              <div onClick={() => setOpen(false)}>
                <Logo light />
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2"
                aria-label="Menüyü kapat"
              >
                <X className="size-6" strokeWidth={1.25} />
              </button>
            </div>
            <nav aria-label="Mobil menü" className="flex flex-1 flex-col justify-center px-8">
              {mainNav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-krem-50/10 py-4 font-display text-4xl font-light"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <p className="px-8 pb-10 font-display text-lg italic text-altin-400">
              Köklerden geleceğe
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
