import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Yönetim Girişi | NESİL1984",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-krem-100 px-6">
      <div className="w-full max-w-sm">
        <p className="text-center font-wordmark text-3xl tracking-[0.06em] text-bordo-800">NESİL1984</p>
        <p className="mt-2 text-center text-[0.65rem] uppercase tracking-[0.4em] text-altin-600">
          Yönetim paneli
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
