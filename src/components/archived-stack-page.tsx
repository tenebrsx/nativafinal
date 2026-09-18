"use client";

import Link from "next/link";
import { useGeo } from "@/lib/geo-context";
import { translations } from "@/lib/translations";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import { StackStories } from "@/components/service-stages";
import { PointerGlow } from "@/components/home-visuals";

export default function ArchivedStackPage() {
  const { lang } = useGeo();
  const dict = translations[lang];
  const es = lang !== "en";

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)", position: "relative" }}>
      <PointerGlow />
      <SiteNav />

      <section style={{ padding: "110px 0 90px", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <p className="section-label" style={{ marginBottom: "10px" }}>
            {es ? "Archivo privado" : "Private archive"}
          </p>
          <h1 className="section-title" style={{ marginBottom: "12px" }}>
            {dict.services.stack_label}
          </h1>
          <p className="section-sub" style={{ marginBottom: "18px", maxWidth: "560px" }}>
            {dict.services.stack_sub}
          </p>
          <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "28px", maxWidth: "520px" }}>
            {es
              ? "Sacado del homepage para no saturar la oferta. CRM personal y Agente IA de marca viven aquí mientras la web pública se queda en sitio + Maps + WhatsApp."
              : "Pulled off the homepage to cut decision fatigue. Personal CRM and Brand AI live here while the public site stays on site + Maps + WhatsApp."}
          </p>

          <div
            id="stack"
            style={{
              padding: "28px",
              background: "var(--gray-foam)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border)",
            }}
          >
            <StackStories />
          </div>

          <p style={{ marginTop: "28px" }}>
            <Link href="/" className="btn btn-outline" style={{ fontSize: "14px", padding: "12px 22px" }}>
              {es ? "← Volver al inicio" : "← Back home"}
            </Link>
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
