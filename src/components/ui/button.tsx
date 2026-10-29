import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs font-medium uppercase tracking-[0.2em] transition-colors duration-500 ease-soft";

const variants: Record<Variant, string> = {
  primary: "bg-bordo-800 text-krem-50 hover:bg-bordo-950",
  outline:
    "border border-bordo-800 text-bordo-800 hover:bg-bordo-800 hover:text-krem-50",
  ghost: "text-altin-700 hover:text-bordo-800",
};

type ButtonProps = {
  variant?: Variant;
  href?: string;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

export function Button({
  variant = "primary",
  href,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cn(base, variants[variant], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
