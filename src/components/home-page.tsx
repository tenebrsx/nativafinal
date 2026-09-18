"use client";
import { useGeo } from "@/lib/geo-context";
import { translations } from "@/lib/translations";
import PricingBuilder from "@/components/pricing-builder";
import LaunchJourney from "@/components/launch-journey";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import Reveal from "@/components/reveal";
import {
  BrandMarquee,
  CountStat,
  HeroAtmosphere,
  HeroSiteScene,
  PointerGlow,
} from "@/components/home-visuals";
import ServiceStories, { StackStories } from "@/components/service-stages";
import ProofGallery, { ProofIntro } from "@/components/proof-gallery";
import { openWhatsAppFunnel } from "@/lib/whatsapp";

const PARTNERS = [
  "SDQ Dental Care",
  "Punta Cana Real Estate",
  "Zona Colonial Tours",
  "Naco Law Group",
  "Las Terrenas Rentals",
  "Bávaro Swim",
  "Café Terrenas",
];

export default function HomePage() {
  const { lang } = useGeo();
  const dict = translations[lang];

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)", position: "relative" }}>
      <PointerGlow />
      <SiteNav />

      {/* ─── HERO ────────────────────────────────────────────────── */}
      <section className="hero-section">
        <HeroAtmosphere />
        <div className="container">
          <div className="hero-grid">
            <div className="hero-copy">
              <h1 className="hero-title hero-in hero-in-d2">
                {dict.hero.title_1}
                {dict.hero.title_2 ? (
                  <>
                    <br />
                    <span className="wave-accent">{dict.hero.title_2}</span>
                  </>
                ) : null}
                {dict.hero.title_3 ? (
                  <>
                    <br />
                    {dict.hero.title_3}
                  </>
                ) : null}
              </h1>

              <p className="hero-lede hero-in hero-in-d3">
                {dict.hero.desc}
              </p>

              <div className="hero-ctas hero-in hero-in-d4">
                <button
                  type="button"
                  className="btn btn-launch"
                  style={{ fontSize: "15px", padding: "16px 32px" }}
                  onClick={() => openWhatsAppFunnel("hero")}
                >
                  {dict.hero.cta_launch}
                </button>
                <a href="#pricing" className="btn btn-outline" style={{ fontSize: "15px", padding: "14.5px 30.5px" }}>
                  {dict.hero.cta_price}
                </a>
              </div>
              <p className="hero-proof hero-in hero-in-d4">{dict.hero.proof}</p>

              <div className="hero-stats hero-in hero-in-d5" style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
                {[
                  { num: dict.hero.stat_delivery, label: dict.hero.stat_delivery_lbl },
                  { num: dict.hero.stat_brands, label: dict.hero.stat_brands_lbl },
                  { num: dict.hero.stat_updates, label: dict.hero.stat_updates_lbl },
                ].map(s => (
                  <CountStat key={`${s.num}-${s.label}`} value={s.num} label={s.label} />
                ))}
              </div>
            </div>
            <HeroSiteScene lang={lang === "en" ? "en" : "es"} />
          </div>
        </div>
      </section>

      {/* ─── BRAND STRIP ────────────────────────────────────────── */}
      <section style={{ background: "var(--gray-foam)", borderBottom: "1px solid var(--border)", padding: "22px 0", overflow: "hidden" }}>
        <div className="container">
          <BrandMarquee label={dict.partners.label} names={PARTNERS} />
        </div>
      </section>

      {/* ─── SERVICES ────────────────────────────────────────────── */}
      <section id="services" style={{ padding: "90px 0", background: "var(--bg)", borderBottom: "1px solid var(--border)", scrollMarginTop: 88 }}>
        <div className="container">
          <Reveal style={{ textAlign: "center", marginBottom: "56px" }}>
            <div className="section-label">{dict.services.label}</div>
            <h2 className="section-title">{dict.services.title}</h2>
            <p className="section-sub" style={{ margin: "0 auto" }}>
              {dict.services.sub}
            </p>
          </Reveal>

          <Reveal>
            <ServiceStories />
          </Reveal>

          <Reveal delay={80}>
            <div
              id="stack"
              className="home-stack-desktop"
              style={{
                marginTop: "48px",
                padding: "28px",
                background: "var(--gray-foam)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="section-label" style={{ marginBottom: "8px" }}>
                {dict.services.stack_label}
              </div>
              <p style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "20px", maxWidth: "560px" }}>
                {dict.services.stack_sub}
              </p>
              <StackStories />
            </div>
          </Reveal>
        </div>
      </section>

      <PricingBuilder />

      {/* ─── PROOF ───────────────────────────────────────────────── */}
      <section id="proof" className="proof-section">
        <div className="container">
          <Reveal>
            <ProofIntro />
          </Reveal>

          <Reveal delay={80}>
            <ProofGallery />
          </Reveal>

          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <button type="button" className="btn btn-launch btn-launch-static" style={{ padding: "16px 32px" }} onClick={() => openWhatsAppFunnel("proof")}>
              {dict.proof.cta}
            </button>
          </div>
        </div>
      </section>

      {/* ─── PROCESS (3 STEPS) ────────────────────────────────────── */}
      <LaunchJourney />

      <SiteFooter />
    </div>
  );
}
