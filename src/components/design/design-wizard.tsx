"use client";

import { ArrowLeft, ArrowRight, Check, Link2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { getDesignQuote } from "@/app/(site)/kendin-tasarla/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { designQuery, type DesignSelection } from "@/lib/design";
import type { DesignQuote } from "@/lib/design-server";
import { DESIGN_LIMITS, formatGram, formatTRY, METAL_LABELS, type Metal } from "@/lib/pricing";
import { whatsappLink } from "@/lib/site";
import { DesignPreview, type PreviewItem, type PreviewPart } from "./design-preview";

type Part = PreviewPart & { weightMg: number; thumbUrl: string | null };

const steps = [
  { key: "chain", label: "Zincir" },
  { key: "charms", label: "Charm'lar" },
  { key: "metal", label: "Ayar" },
] as const;
type Step = (typeof steps)[number]["key"];

let nextKey = 1;

function PartTile({ part, selected, disabled, onClick }: { part: Part; selected?: boolean; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        "group flex flex-col items-center border p-3 text-center transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-40",
        selected ? "border-bordo-800 bg-krem-100" : "border-krem-300 bg-krem-50 hover:border-bordo-800",
      )}
    >
      <span className="relative flex aspect-square w-full items-center justify-center bg-[radial-gradient(ellipse_at_30%_20%,var(--color-krem-50),var(--color-krem-200))]">
        {part.thumbUrl ? (
          <Image src={part.thumbUrl} alt="" fill sizes="120px" className="object-contain p-2" />
        ) : (
          <span className="flex size-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#f0d7a6,#c9a06f_45%,#8a5a3b)] font-wordmark text-lg text-bordo-900">
            {part.name.trim().charAt(0).toLocaleUpperCase("tr-TR")}
          </span>
        )}
        {selected && (
          <span className="absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full bg-bordo-800 text-krem-50">
            <Check className="size-3" strokeWidth={2.5} />
          </span>
        )}
      </span>
      <span className="mt-2 text-sm text-bordo-800">{part.name}</span>
      <span className="text-xs text-bordo-900/50">{formatGram(part.weightMg)}</span>
    </button>
  );
}

export function DesignWizard({
  chains,
  charms,
  connectors,
  metals,
  initial,
}: {
  chains: Part[];
  charms: Part[];
  connectors: Part[];
  metals: Metal[];
  initial: DesignSelection;
}) {
  const byId = useMemo(() => new Map([...chains, ...charms, ...connectors].map((p) => [p.id, p])), [chains, charms, connectors]);

  const [step, setStep] = useState<Step>("chain");
  const [chainId, setChainId] = useState(
    initial.chainId && byId.get(initial.chainId)?.kind === "CHAIN" ? initial.chainId : (chains[0]?.id ?? null),
  );
  const [items, setItems] = useState<{ key: number; id: number }[]>(() =>
    initial.itemIds.filter((id) => byId.get(id) && byId.get(id)!.kind !== "CHAIN").map((id) => ({ key: nextKey++, id })),
  );
  const [metal, setMetal] = useState<Metal | null>(
    initial.metal && metals.includes(initial.metal) ? initial.metal : metals.includes("K14") ? "K14" : (metals[0] ?? null),
  );

  const selection: DesignSelection = useMemo(() => ({ chainId, itemIds: items.map((i) => i.id), metal }), [chainId, items, metal]);
  const count = (kind: Part["kind"]) => items.filter((i) => byId.get(i.id)?.kind === kind).length;
  const charmCount = count("CHARM");
  const connectorCount = count("CONNECTOR");

  // Fiyat sunucudan gelir. Hızlı tıklamalarda eski cevap yenisinin üstüne yazılmasın diye sıra numarası tutulur.
  const [quote, setQuote] = useState<DesignQuote | null>(null);
  const [pending, startTransition] = useTransition();
  const seq = useRef(0);
  useEffect(() => {
    const mine = ++seq.current;
    startTransition(async () => {
      const q = await getDesignQuote(selection);
      if (mine === seq.current) setQuote(q);
    });
    // Tasarım adres çubuğunda: sayfa yenilense ya da bağlantı paylaşılsa da kaybolmaz.
    const q = designQuery(selection);
    window.history.replaceState(null, "", q ? `?${q}` : window.location.pathname);
  }, [selection]);

  const add = (id: number) => setItems((list) => [...list, { key: nextKey++, id }]);
  const remove = (key: number) => setItems((list) => list.filter((i) => i.key !== key));
  const move = (key: number, dir: -1 | 1) =>
    setItems((list) => {
      const i = list.findIndex((x) => x.key === key);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= list.length) return list;
      const next = [...list];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const chain = chainId ? (byId.get(chainId) ?? null) : null;
  const previewItems: PreviewItem[] = items.flatMap((i) => {
    const part = byId.get(i.id);
    return part ? [{ key: i.key, part }] : [];
  });

  const [copied, setCopied] = useState(false);
  const shareUrl = () => `${window.location.origin}/kendin-tasarla?${designQuery(selection)}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* pano izni yoksa sessiz geç */
    }
  };

  const summary = [
    chain && `Zincir: ${chain.name}`,
    previewItems.length > 0 && `Parçalar: ${previewItems.map((i) => i.part.name).join(", ")}`,
    metal && `Ayar: ${METAL_LABELS[metal]}`,
  ].filter(Boolean) as string[];
  // Bağlantı tarayıcıda üretildiği için WhatsApp linki tıklanınca kurulur.
  const openWhatsapp = () => {
    const link = whatsappLink(`Merhaba, Kendin Tasarla ile bir kolye tasarladım. ${summary.join(" / ")}. ${shareUrl()}`);
    if (link) window.open(link, "_blank", "noopener");
  };
  const hasWhatsapp = whatsappLink() !== null;

  const stepIndex = steps.findIndex((s) => s.key === step);

  return (
    <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
      {/* Önizleme + dizilim */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="relative bg-[radial-gradient(ellipse_at_50%_30%,var(--color-krem-50),var(--color-krem-200))] px-4 pt-6 pb-10 md:px-10">
          <DesignPreview chain={chain} items={previewItems} />
          {items.length === 0 && (
            <p className="absolute inset-x-0 bottom-6 text-center font-display text-lg italic text-altin-700">
              Charm ekleyerek tasarımına başla
            </p>
          )}
        </div>

        {items.length > 0 && (
          <div className="mt-4">
            <p className="text-[0.65rem] uppercase tracking-[0.25em] text-altin-700">Dizilim (soldan sağa)</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              <AnimatePresence initial={false}>
                {items.map((item, i) => {
                  const part = byId.get(item.id);
                  if (!part) return null;
                  return (
                    <motion.li
                      key={item.key}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center border border-krem-300 bg-krem-50 text-sm text-bordo-800"
                    >
                      <button type="button" onClick={() => move(item.key, -1)} disabled={i === 0} className="px-1.5 py-1.5 disabled:opacity-25" aria-label={`${part.name} sola al`}>
                        <ArrowLeft className="size-3.5" strokeWidth={1.5} />
                      </button>
                      <span className="px-1">{part.name}</span>
                      <button type="button" onClick={() => move(item.key, 1)} disabled={i === items.length - 1} className="px-1.5 py-1.5 disabled:opacity-25" aria-label={`${part.name} sağa al`}>
                        <ArrowRight className="size-3.5" strokeWidth={1.5} />
                      </button>
                      <button type="button" onClick={() => remove(item.key)} className="border-l border-krem-300 px-2 py-1.5 hover:text-bordo-700" aria-label={`${part.name} çıkar`}>
                        <X className="size-3.5" strokeWidth={1.5} />
                      </button>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          </div>
        )}
      </div>

      {/* Adımlar + özet */}
      <div>
        <nav className="grid grid-cols-3 border-b border-krem-300" aria-label="Tasarım adımları">
          {steps.map((s, i) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setStep(s.key)}
              aria-current={step === s.key ? "step" : undefined}
              className={cn(
                "relative pb-3 text-left transition-colors",
                step === s.key ? "text-bordo-800" : "text-bordo-900/40 hover:text-bordo-800",
              )}
            >
              <span className="font-display text-2xl">0{i + 1}</span>
              {/* Dar ekranda ad numaranın altına iner, yoksa üç sekme birbirine biner. */}
              <span className="block text-[0.6rem] uppercase tracking-[0.15em] sm:ml-2 sm:inline sm:text-xs sm:tracking-[0.2em]">
                {s.label}
              </span>
              {step === s.key && <motion.span layoutId="kt-step" className="absolute inset-x-0 -bottom-px h-0.5 bg-bordo-800" />}
            </button>
          ))}
        </nav>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="min-h-64 py-8"
          >
            {step === "chain" && (
              <>
                <p className="text-sm text-bordo-900/70">Tasarımının temeli olacak zinciri seç.</p>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  {chains.map((p) => (
                    <PartTile key={p.id} part={p} selected={chainId === p.id} onClick={() => setChainId(p.id)} />
                  ))}
                </div>
              </>
            )}

            {step === "charms" && (
              <>
                <p className="text-sm text-bordo-900/70">
                  Charm&apos;a dokununca zincire eklenir; aynısından birden fazla ekleyebilirsin.{" "}
                  <span className="text-bordo-900/50">
                    ({charmCount}/{DESIGN_LIMITS.maxCharms} charm)
                  </span>
                </p>
                <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {charms.map((p) => (
                    <PartTile key={p.id} part={p} disabled={charmCount >= DESIGN_LIMITS.maxCharms} onClick={() => add(p.id)} />
                  ))}
                </div>
                {connectors.length > 0 && (
                  <>
                    <p className="mt-8 text-sm text-bordo-900/70">
                      Ara parçalar charm&apos;ların arasına dizilir.{" "}
                      <span className="text-bordo-900/50">
                        ({connectorCount}/{DESIGN_LIMITS.maxConnectors})
                      </span>
                    </p>
                    <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4">
                      {connectors.map((p) => (
                        <PartTile key={p.id} part={p} disabled={connectorCount >= DESIGN_LIMITS.maxConnectors} onClick={() => add(p.id)} />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}

            {step === "metal" && (
              <>
                <p className="text-sm text-bordo-900/70">Tasarımın üretileceği ayarı seç. Fiyat güncel gram fiyatından hesaplanır.</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {metals.map((m) => (
                    <button
                      key={m}
                      type="button"
                      aria-pressed={metal === m}
                      onClick={() => setMetal(m)}
                      className={cn(
                        "border px-5 py-3 text-sm transition-colors duration-300",
                        metal === m ? "border-bordo-800 bg-bordo-800 text-krem-50" : "border-krem-300 text-bordo-800 hover:border-bordo-800",
                      )}
                    >
                      {METAL_LABELS[m]}
                    </button>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between border-b border-krem-300 pb-6">
          <button
            type="button"
            onClick={() => setStep(steps[stepIndex - 1].key)}
            className={cn("inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-altin-700 hover:text-bordo-800", stepIndex === 0 && "invisible")}
          >
            <ArrowLeft className="size-4" strokeWidth={1.5} /> Geri
          </button>
          {stepIndex < steps.length - 1 && (
            <button
              type="button"
              onClick={() => setStep(steps[stepIndex + 1].key)}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-bordo-800 hover:text-altin-700"
            >
              Sonraki adım <ArrowRight className="size-4" strokeWidth={1.5} />
            </button>
          )}
        </div>

        {/* Özet: fiyat her zaman sunucudan */}
        <div className="mt-6" aria-live="polite">
          <p className="text-[0.65rem] uppercase tracking-[0.25em] text-altin-700">Tasarımın</p>
          <div className={cn("mt-2 transition-opacity duration-300", pending && "opacity-50")}>
            {quote?.ok ? (
              <>
                <motion.p key={quote.priceKurus} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="font-display text-4xl text-bordo-800">
                  {formatTRY(quote.priceKurus)}
                </motion.p>
                <p className="mt-1 text-sm text-bordo-900/60">Yaklaşık {formatGram(quote.weightMg)}</p>
              </>
            ) : (
              <p className="font-display text-xl italic text-bordo-900/60">{quote ? quote.error : "Hesaplanıyor…"}</p>
            )}
          </div>
          {summary.length > 0 && (
            <ul className="mt-4 space-y-1 text-sm text-bordo-900/70">
              {summary.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-4">
            {hasWhatsapp ? (
              <Button type="button" onClick={openWhatsapp} disabled={!quote?.ok}>
                WhatsApp ile sipariş ver
              </Button>
            ) : (
              <Button href="/iletisim">Bize ulaşın</Button>
            )}
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-altin-700 hover:text-bordo-800"
            >
              {copied ? <Check className="size-4" strokeWidth={1.5} /> : <Link2 className="size-4" strokeWidth={1.5} />}
              {copied ? "Kopyalandı" : "Tasarım bağlantısı"}
            </button>
          </div>
          <p className="mt-4 text-xs text-bordo-900/50">
            Online sipariş çok yakında. Tasarımın bağlantısını bize göndererek sipariş verebilirsin.
          </p>
        </div>
      </div>
    </div>
  );
}
