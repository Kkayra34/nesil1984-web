import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/site";

// Numara site.ts'e girilince görünür.
export function WhatsAppButton() {
  const href = whatsappLink("Merhaba, web sitenizden yazıyorum.");
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ile yazın"
      className="fixed right-5 bottom-5 z-30 flex size-14 items-center justify-center rounded-full bg-bordo-800 text-krem-50 shadow-lg shadow-bordo-950/20 transition-transform duration-500 ease-soft hover:scale-110"
    >
      <MessageCircle className="size-6" strokeWidth={1.5} />
    </a>
  );
}
