"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { User } from "firebase/auth";
import {
  ADS_ALLOWED_EMAIL,
  isAdsAdmin,
  signInAdsWithGoogle,
  signOutAds,
  subscribeAdsAuth,
} from "@/lib/ads-auth";

type GateState =
  | { status: "loading" }
  | { status: "signed_out"; error?: string }
  | { status: "unauthorized"; email: string }
  | { status: "ready"; user: User };

export default function AdsAuthGate({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GateState>({ status: "loading" });
  const [busy, setBusy] = useState(false);
  const deniedEmail = useRef<string | null>(null);

  useEffect(() => {
    return subscribeAdsAuth(async (user) => {
      if (!user) {
        if (deniedEmail.current) {
          setState({ status: "unauthorized", email: deniedEmail.current });
          return;
        }
        setState({ status: "signed_out" });
        return;
      }
      if (!isAdsAdmin(user)) {
        deniedEmail.current = user.email ?? "(no email)";
        try {
          await signOutAds();
        } catch {
          /* still show unauthorized */
        }
        setState({ status: "unauthorized", email: deniedEmail.current });
        return;
      }
      deniedEmail.current = null;
      setState({ status: "ready", user });
    });
  }, []);

  const signIn = async () => {
    deniedEmail.current = null;
    setBusy(true);
    try {
      await signInAdsWithGoogle();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "No se pudo iniciar sesión.";
      setState({ status: "signed_out", error: message });
    } finally {
      setBusy(false);
    }
  };

  if (state.status === "loading") {
    return (
      <div className="ads-gate">
        <div className="ads-gate-card">
          <p className="ads-gate-kicker">Ads studio</p>
          <h1>Cargando…</h1>
        </div>
      </div>
    );
  }

  if (state.status === "ready") {
    return <>{children}</>;
  }

  const denied = state.status === "unauthorized";

  return (
    <div className="ads-gate">
      <div className="ads-gate-card">
        <p className="ads-gate-kicker">Ads studio · privado</p>
        <h1>{denied ? "Sin acceso" : "Entrar al estudio"}</h1>
        <p>
          {denied
            ? `${state.email} no está en la lista. Solo ${ADS_ALLOWED_EMAIL} puede entrar.`
            : "Inicia sesión con Google para organizar ads, carpetas y notas."}
        </p>
        {state.status === "signed_out" && state.error ? (
          <p className="ads-gate-error">{state.error}</p>
        ) : null}
        <button type="button" className="ads-gate-btn" onClick={signIn} disabled={busy}>
          {busy ? "Abriendo Google…" : "Continuar con Google"}
        </button>
      </div>
    </div>
  );
}
