import { cn } from "@/lib/cn";

type FieldProps = {
  label: string;
  hint?: string;
  suffix?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

// Admin formlarındaki standart giriş alanı.
export function Field({ label, hint, suffix, className, ...input }: FieldProps) {
  return (
    <label className="block">
      <span className="text-[0.65rem] uppercase tracking-[0.25em] text-altin-700">{label}</span>
      <span className="mt-2 flex items-center border border-krem-300 bg-white focus-within:border-altin-500">
        <input
          {...input}
          className={cn("w-full bg-transparent px-3 py-2.5 text-bordo-900 outline-none", className)}
        />
        {suffix && <span className="pr-3 text-sm text-bordo-900/50">{suffix}</span>}
      </span>
      {hint && <span className="mt-1.5 block text-xs text-bordo-900/50">{hint}</span>}
    </label>
  );
}
