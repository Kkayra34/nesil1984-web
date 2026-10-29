"use client";

import { useActionState } from "react";
import { Field } from "@/components/admin/field";
import { login } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form action={action} className="mt-10 space-y-5 bg-krem-50 p-8 shadow-sm">
      <Field
        label="E-posta"
        name="email"
        type="email"
        autoComplete="username"
        required
        defaultValue={state?.values?.email}
      />
      <Field label="Şifre" name="password" type="password" autoComplete="current-password" required />
      {state?.error && <p className="text-sm text-bordo-700">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-bordo-800 py-3 text-xs uppercase tracking-[0.2em] text-krem-50 transition-colors hover:bg-bordo-950 disabled:opacity-60"
      >
        {pending ? "Giriş yapılıyor…" : "Giriş yap"}
      </button>
    </form>
  );
}
