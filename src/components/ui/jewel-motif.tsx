import type { JewelMotifName } from "@/lib/site";

// İnce çizgili takı illüstrasyonları. Ürün fotoğrafları gelene kadar görsel yerine kullanılır.
const paths: Record<JewelMotifName, React.ReactNode> = {
  ring: (
    <>
      <circle cx="100" cy="122" r="44" />
      <circle cx="100" cy="122" r="37" />
      <path d="M84 80 L100 60 L116 80 L100 96 Z" />
      <path d="M84 80 H116 M92 80 L100 96 L108 80 M92 80 L100 60 L108 80" />
    </>
  ),
  necklace: (
    <>
      <path d="M38 36 Q100 150 162 36" />
      <path d="M44 36 Q100 140 156 36" strokeDasharray="2 4" />
      <path d="M100 93 V106" />
      <circle cx="100" cy="122" r="15" />
      <path d="M100 113 L103 120 L110 122 L103 124 L100 131 L97 124 L90 122 L97 120 Z" />
    </>
  ),
  earring: (
    <>
      <circle cx="100" cy="74" r="26" />
      <path d="M100 100 V114" />
      <path d="M100 114 C86 134 86 150 100 158 C114 150 114 134 100 114 Z" />
      <path d="M100 124 C94 136 94 146 100 150" />
    </>
  ),
  bracelet: (
    <>
      <ellipse cx="100" cy="100" rx="68" ry="30" />
      <ellipse cx="100" cy="100" rx="60" ry="24" />
      {[60, 80, 100, 120, 140].map((x) => (
        <circle key={x} cx={x} cy={x === 100 ? 129 : x === 80 || x === 120 ? 127 : 122} r="3.5" />
      ))}
    </>
  ),
  chain: (
    <>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <ellipse
          key={i}
          cx={40 + i * 24}
          cy={100 + Math.sin(i * 0.9) * 8}
          rx="15"
          ry="8"
          transform={`rotate(${i % 2 ? 18 : -18} ${40 + i * 24} ${100 + Math.sin(i * 0.9) * 8})`}
        />
      ))}
    </>
  ),
  pendant: (
    <>
      <path d="M58 28 L100 86 L142 28" />
      <circle cx="100" cy="92" r="5" />
      <circle cx="100" cy="126" r="28" />
      <circle cx="100" cy="126" r="22" strokeDasharray="1.5 3" />
      <path d="M100 108 L104 122 L118 126 L104 130 L100 144 L96 130 L82 126 L96 122 Z" />
    </>
  ),
};

export function JewelMotif({
  name,
  className,
  strokeWidth = 1.1,
}: {
  name: JewelMotifName;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
