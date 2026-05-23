"use client";

import { useFormState, useFormStatus } from "react-dom";
import { loginAction } from "@/lib/backoffice/actions";

function Button() {
  const { pending } = useFormStatus();
  return (
    <button className="w-full rounded-full bg-emerald-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50" disabled={pending}>
      {pending ? "Entrando..." : "Entrar al control"}
    </button>
  );
}

export default function AdminLoginPage() {
  const [state, formAction] = useFormState(loginAction, null as any);
  return (
    <main className="min-h-screen bg-[#eef3df] px-5 py-12 text-emerald-950">
      <section className="mx-auto max-w-md rounded-[2rem] border border-emerald-900/10 bg-white/90 p-8 shadow-sm">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-900/70">Paesaggio</p>
          <h1 className="mt-2 text-3xl font-semibold">Control comercial</h1>
          <p className="mt-2 text-sm text-neutral-600">Pedidos, consignaciones, rendiciones, pagos y comisiones.</p>
        </div>
        <form action={formAction} className="space-y-4">
          <label className="block text-sm font-medium">
            Email
            <input name="email" type="email" defaultValue="admin@paesaggio.local" className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-emerald-800" />
          </label>
          <label className="block text-sm font-medium">
            Contraseña
            <input name="password" type="password" className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-emerald-800" />
          </label>
          {state?.error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p> : null}
          <Button />
        </form>
        <p className="mt-6 text-xs text-neutral-500">Usuario inicial: admin@paesaggio.local · Clave inicial: Paesaggio2026!</p>
      </section>
    </main>
  );
}
