"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Flip } from "gsap/Flip";
import { SplitText } from "gsap/SplitText";
import type { AdLang } from "./ads-library";

gsap.registerPlugin(useGSAP, SplitText, Flip, DrawSVGPlugin);

const MEDIA = {
  hero: "/demo/constructora-aybar/hero.jpg",
  a: "/demo/constructora-aybar/torre.jpg",
  b: "/demo/constructora-aybar/site.jpg",
  c: "/demo/constructora-aybar/villas.jpg",
} as const;

const COPY = {
  es: {
    studio: "Web Studio · RD",
    before: "Antes",
    after: "Después",
    ig: "Instagram · Direct",
    igSub: "Bandeja vacía",
    dm1: "precio?",
    dm2: "info?",
    dead: "Cero cierre. Cero visita. Cero cliente.",
    zeroLabel: "mensajes útiles",
    zeroHint: "Solo preguntas muertas.",
    siteKicker: "El sitio · Nativa",
    siteDomain: "tu-negocio.do",
    siteBrand: "Tu negocio",
    siteTag: "Hecho por Nativa",
    siteNav: ["Inicio", "Servicios", "Contacto"],
    siteKickerLine: "Tu marca · Santo Domingo",
    siteHeadline: ["Tu oferta.", "Tu zona.", "Tu WhatsApp."],
    siteLede: "El cliente llega con lo que necesita. El chat cierra.",
    siteCta: "Escribir ahora",
    siteStats: [
      { k: "Chat", v: "WA" },
      { k: "Citas", v: "Online" },
      { k: "Zona", v: "RD" },
    ],
    siteObras: [
      { img: MEDIA.a, name: "Servicio" },
      { img: MEDIA.b, name: "Proyecto" },
      { img: MEDIA.c, name: "Galería" },
    ],
    wa: "WhatsApp Business",
    waOnline: "en línea",
    countLabel: "mensajes hoy",
    holdLead: "Tu negocio merece",
    holdPayoff: "más clientes.",
    cta: "Elige Nativa",
    bubbles: [
      { from: "Carlos M.", msg: "Vi el sitio. ¿Tienen cupo mañana?", time: "09:12" },
      { from: "María L.", msg: "Quiero el plan completo. ¿Precio?", time: "09:18" },
      { from: "Ana R.", msg: "Estoy en SD. ¿Puedo agendar hoy?", time: "09:24" },
      { from: "Grupo Norte", msg: "Listo para cerrar. Coordinamos.", time: "09:31" },
    ],
  },
  en: {
    studio: "Web Studio · DR",
    before: "Before",
    after: "After",
    ig: "Instagram · Direct",
    igSub: "Empty inbox",
    dm1: "price?",
    dm2: "info?",
    dead: "No close. No visit. No client.",
    zeroLabel: "useful messages",
    zeroHint: "Only dead questions.",
    siteKicker: "The site · Nativa",
    siteDomain: "your-business.do",
    siteBrand: "Your business",
    siteTag: "Built by Nativa",
    siteNav: ["Home", "Services", "Contact"],
    siteKickerLine: "Your brand · Santo Domingo",
    siteHeadline: ["Your offer.", "Your zone.", "Your WhatsApp."],
    siteLede: "The client arrives with what they need. Chat closes.",
    siteCta: "Message now",
    siteStats: [
      { k: "Chat", v: "WA" },
      { k: "Bookings", v: "Online" },
      { k: "Zone", v: "DR" },
    ],
    siteObras: [
      { img: MEDIA.a, name: "Service" },
      { img: MEDIA.b, name: "Project" },
      { img: MEDIA.c, name: "Gallery" },
    ],
    wa: "WhatsApp Business",
    waOnline: "online",
    countLabel: "messages today",
    holdLead: "Your business deserves",
    holdPayoff: "more clients.",
    cta: "Choose Nativa",
    bubbles: [
      { from: "Carlos M.", msg: "Saw the site. Slot tomorrow?", time: "09:12" },
      { from: "María L.", msg: "Want the full plan. Price?", time: "09:18" },
      { from: "Ana R.", msg: "I'm in SD. Can I book today?", time: "09:24" },
      { from: "Grupo Norte", msg: "Ready to close. Let's coordinate.", time: "09:31" },
    ],
  },
} as const;

const DURATION = 14;

export function InboxReel({ lang, reduced }: { lang: AdLang; reduced: boolean }) {
  const t = COPY[lang];
  const root = useRef<HTMLElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const countEl = useRef<HTMLSpanElement>(null);
  const zeroEl = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const brand = el.querySelector<HTMLElement>(".ad-reel-brand");
      const before = el.querySelector<HTMLElement>(".ad-reel-before");
      const site = el.querySelector<HTMLElement>(".ad-reel-site");
      const after = el.querySelector<HTMLElement>(".ad-reel-after");
      const hold = el.querySelector<HTMLElement>(".ad-reel-hold");
      const dms = gsap.utils.toArray<HTMLElement>(".ad-reel-dm", el);
      const dead = el.querySelector<HTMLElement>(".ad-reel-dead");
      const zeroDash = el.querySelector<HTMLElement>(".ad-reel-zero");
      const mock = el.querySelector<HTMLElement>(".ad-reel-biz");
      const siteKicker = el.querySelector<HTMLElement>(".ad-reel-site > em");
      const bizBits = gsap.utils.toArray<HTMLElement>(
        ".ad-reel-biz-nav, .ad-reel-biz-hero, .ad-reel-biz-stats, .ad-reel-biz-obras",
        el,
      );
      const bizStats = gsap.utils.toArray<HTMLElement>(".ad-reel-biz-stats li", el);
      const bizObras = gsap.utils.toArray<HTMLElement>(".ad-reel-biz-obras figure", el);
      const bubbles = gsap.utils.toArray<HTMLElement>(".ad-reel-bubble", el);
      const chart = el.querySelector<SVGPathElement>(".ad-reel-chart-rise");
      const flatChart = el.querySelector<SVGPathElement>(".ad-reel-chart-flat");
      const chartWrap = el.querySelector<HTMLElement>(".ad-reel-chart");
      const dash = el.querySelector<HTMLElement>(".ad-reel-dash");
      const waHead = el.querySelector<HTMLElement>(".ad-reel-wa-head");
      const cta = el.querySelector<HTMLElement>(".ad-reel .ad-quality-cta");
      const holdLead = el.querySelector<HTMLElement>(".ad-reel-hold-lead");
      const holdPayoff = el.querySelector<HTMLElement>(".ad-reel-hold-payoff");
      const cursorNode = cursor.current;

      const showFinal = () => {
        gsap.set([before, site], { autoAlpha: 0 });
        gsap.set([after, hold, brand, dash, waHead], { autoAlpha: 1, clearProps: "transform,filter" });
        gsap.set(bubbles, { autoAlpha: 1, x: 0, y: 0, scale: 1, rotation: 0, clearProps: "transform" });
        gsap.set(chart, { drawSVG: "100%" });
        gsap.set(chartWrap, { scale: 1 });
        gsap.set(cta, { autoAlpha: 1, scale: 1, y: 0 });
        gsap.set(bizBits, { autoAlpha: 1, y: 0 });
        if (countEl.current) countEl.current.textContent = "47";
        if (zeroEl.current) zeroEl.current.textContent = "0";
        if (cursorNode) gsap.set(cursorNode, { autoAlpha: 0 });
      };

      if (reduced) {
        showFinal();
        return;
      }

      let deadSplit: ReturnType<typeof SplitText.create> | null = null;
      let leadSplit: ReturnType<typeof SplitText.create> | null = null;
      let payoffSplit: ReturnType<typeof SplitText.create> | null = null;
      let cancelled = false;
      let removePointer: (() => void) | null = null;

      const resetLoop = () => {
        if (countEl.current) countEl.current.textContent = "0";
        if (zeroEl.current) zeroEl.current.textContent = "0";
        gsap.set([before, site, after, hold], { autoAlpha: 0, y: 0, scale: 1, filter: "none" });
        gsap.set(brand, { autoAlpha: 0, y: 14 });
        gsap.set(dms, { autoAlpha: 0, x: -28, scale: 0.92 });
        gsap.set(zeroDash, { autoAlpha: 0, y: 16 });
        gsap.set(bubbles, {
          autoAlpha: 0,
          x: 0,
          y: -200,
          scale: 0.75,
          rotation: (i: number) => (i % 2 === 0 ? -10 : 10),
        });
        gsap.set(chart, { drawSVG: "0%" });
        gsap.set(flatChart, { drawSVG: "100%" });
        gsap.set(chartWrap, { scale: 0.84, transformOrigin: "50% 100%" });
        gsap.set(dash, { autoAlpha: 0, y: 16 });
        gsap.set(waHead, { autoAlpha: 0, y: -10 });
        gsap.set(mock, {
          autoAlpha: 1,
          rotateX: 10,
          rotateY: -8,
          scale: 1,
          y: 0,
          filter: "none",
          transformPerspective: 900,
        });
        gsap.set(bizBits, { autoAlpha: 0, y: 18 });
        gsap.set(bizStats, { autoAlpha: 0, y: 10 });
        gsap.set(bizObras, { autoAlpha: 0, scale: 0.92, y: 12 });
        gsap.set(cta, { autoAlpha: 0, y: 18, scale: 0.94 });
        if (deadSplit) gsap.set(deadSplit.words, { opacity: 0, y: 12 });
        if (leadSplit) gsap.set(leadSplit.words, { opacity: 0, y: 14 });
        if (payoffSplit) gsap.set(payoffSplit.chars, { opacity: 0, y: 16 });
        if (cursorNode) gsap.set(cursorNode, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
      };

      const run = () => {
        if (cancelled) return;

        deadSplit = dead
          ? SplitText.create(dead, { type: "words", aria: "auto" })
          : null;
        leadSplit = holdLead
          ? SplitText.create(holdLead, { type: "words", aria: "auto" })
          : null;
        payoffSplit = holdPayoff
          ? SplitText.create(holdPayoff, { type: "chars,words", aria: "auto" })
          : null;

        resetLoop();

        const counter = { n: 0 };
        const tl = gsap.timeline({
          repeat: -1,
          defaults: { ease: "power3.out" },
        });

        // ── Before: 0 useful messages
        tl.to(brand, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power4.out" }, 0)
          .to(cursorNode, { autoAlpha: 0.8, duration: 0.35 }, 0.1)
          .to(before, { autoAlpha: 1, duration: 0.3 }, 0.35)
          .to(zeroDash, { autoAlpha: 1, y: 0, duration: 0.45 }, 0.45)
          .to(
            dms,
            {
              autoAlpha: 0.55,
              x: 0,
              scale: 1,
              duration: 0.5,
              stagger: 0.1,
              ease: "back.out(1.5)",
            },
            0.65,
          );

        if (deadSplit) {
          tl.to(
            deadSplit.words,
            { opacity: 1, y: 0, duration: 0.38, stagger: 0.06, ease: "power2.out" },
            1.2,
          );
        }

        // ── Morph into Tu negocio site
        tl.to(
          before,
          {
            autoAlpha: 0,
            scale: 0.94,
            y: -16,
            filter: "blur(6px)",
            duration: 0.45,
            ease: "power3.in",
          },
          2.5,
        ).add(() => {
          gsap.set(site, { autoAlpha: 1 });
          if (!mock) return;
          const card = el.querySelector(".ad-reel-zero") || el.querySelector(".ad-reel-ig");
          if (!card) return;
          try {
            const state = Flip.getState(card);
            Flip.from(state, {
              targets: mock,
              duration: 0.7,
              ease: "power3.inOut",
              absolute: true,
              scale: true,
              fade: true,
            });
          } catch {
            gsap.fromTo(
              mock,
              { scale: 0.92, y: 28, autoAlpha: 0 },
              { scale: 1, y: 0, autoAlpha: 1, duration: 0.7, ease: "power4.out" },
            );
          }
        }, 2.65)
          .fromTo(
            siteKicker,
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 0.3 },
            2.75,
          )
          .to(
            bizBits,
            { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out" },
            2.85,
          )
          .to(
            bizStats,
            { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.06, ease: "back.out(1.4)" },
            3.2,
          )
          .to(
            bizObras,
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.07, ease: "power3.out" },
            3.45,
          )
          .to(mock, { rotateX: 0, rotateY: 0, duration: 0.85, ease: "power2.inOut" }, 3.6)
          .to(
            site,
            { autoAlpha: 0, y: -14, scale: 0.98, duration: 0.4, ease: "power2.in" },
            5.35,
          )

          // ── After inbox
          .set(after, { autoAlpha: 1, y: 0 }, 5.5)
          .to(waHead, { autoAlpha: 1, y: 0, duration: 0.4 }, 5.55)
          .to(dash, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out" }, 5.65);

        bubbles.forEach((bubble, i) => {
          const x1 = i % 2 === 0 ? -72 : 72;
          const x2 = i % 2 === 0 ? -18 : 22;
          const t0 = 5.85 + i * 0.28;
          tl.set(
            bubble,
            {
              autoAlpha: 0,
              scale: 0.72,
              rotation: i % 2 === 0 ? -12 : 12,
              x: x1,
              y: -210,
            },
            t0,
          ).to(
            bubble,
            {
              keyframes: [
                { x: x1, y: -210, autoAlpha: 0, scale: 0.72, duration: 0 },
                {
                  x: x2,
                  y: -95,
                  autoAlpha: 1,
                  scale: 0.92,
                  rotation: i % 2 === 0 ? -4 : 4,
                  duration: 0.4,
                  ease: "power2.out",
                },
                {
                  x: 0,
                  y: 0,
                  scale: 1,
                  rotation: 0,
                  duration: 0.45,
                  ease: "back.out(1.4)",
                },
              ],
            },
            t0,
          );
        });

        tl.to(
          counter,
          {
            n: 47,
            duration: 2.2,
            ease: "power2.out",
            onUpdate: () => {
              if (countEl.current) {
                countEl.current.textContent = String(Math.round(counter.n));
              }
            },
          },
          6.3,
        )
          .to(chart, { drawSVG: "100%", duration: 2.4, ease: "power2.inOut" }, 6.4)
          .to(chartWrap, { scale: 1.1, duration: 1.0, ease: "back.out(1.5)" }, 7.9)
          .to(chartWrap, { scale: 1, duration: 0.4, ease: "power2.out" }, 9.0)

          // ── Centered hold
          .to(after, { autoAlpha: 0, y: -12, duration: 0.4, ease: "power2.in" }, 9.4)
          .set(hold, { autoAlpha: 1 }, 9.55);

        if (leadSplit) {
          tl.to(
            leadSplit.words,
            { opacity: 1, y: 0, duration: 0.38, stagger: 0.05, ease: "power2.out" },
            9.6,
          );
        }
        if (payoffSplit) {
          tl.to(
            payoffSplit.chars,
            { opacity: 1, y: 0, duration: 0.42, stagger: 0.018, ease: "power3.out" },
            9.9,
          );
        }

        tl.to(
          cta,
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.6)" },
          10.45,
        )
          .to(
            cta,
            {
              scale: 1.04,
              duration: 0.5,
              yoyo: true,
              repeat: 1,
              ease: "power1.inOut",
            },
            11.2,
          )
          .to(
            [hold, brand, cursorNode],
            { autoAlpha: 0, duration: 0.4, ease: "power2.in" },
            13.1,
          )
          .add(() => {
            counter.n = 0;
            resetLoop();
          }, 13.6);

        if (cursorNode && mock) {
          const xTo = gsap.quickTo(cursorNode, "x", { duration: 0.55, ease: "power3" });
          const yTo = gsap.quickTo(cursorNode, "y", { duration: 0.55, ease: "power3" });
          const pxTo = gsap.quickTo(mock, "rotateY", { duration: 0.75, ease: "power2" });
          const pyTo = gsap.quickTo(mock, "rotateX", { duration: 0.75, ease: "power2" });

          const onMove = (e: PointerEvent) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            xTo(x);
            yTo(y);
            const nx = (x / rect.width) * 2 - 1;
            const ny = (y / rect.height) * 2 - 1;
            pxTo(nx * -7);
            pyTo(ny * 5);
          };

          el.addEventListener("pointermove", onMove);
          removePointer = () => el.removeEventListener("pointermove", onMove);
        }
      };

      run();

      return () => {
        cancelled = true;
        removePointer?.();
        deadSplit?.revert();
        leadSplit?.revert();
        payoffSplit?.revert();
      };
    },
    { scope: root, dependencies: [lang, reduced] },
  );

  return (
    <article
      ref={root}
      className={`ad-reel${reduced ? " is-static" : ""}`}
      aria-label="Inbox reel"
      style={{ ["--reel" as string]: `${DURATION}s` }}
    >
      <div ref={cursor} className="ad-reel-cursor" aria-hidden="true" />

      <header className="ad-reel-brand">
        <i className="ad-quality-mark" aria-hidden="true" />
        <div>
          <strong>Nativa</strong>
          <span>{t.studio}</span>
        </div>
      </header>

      <div className="ad-reel-body">
        {/* ── BEFORE: 0 messages ─────────────────────────── */}
        <section className="ad-reel-scene ad-reel-before">
          <em>{t.before}</em>
          <div className="ad-reel-zero">
            <div className="ad-reel-count is-zero">
              <b>
                <span ref={zeroEl}>0</span>
              </b>
              <small>{t.zeroLabel}</small>
            </div>
            <svg className="ad-reel-chart is-flat" viewBox="0 0 160 56" fill="none" aria-hidden="true">
              <path className="ad-reel-chart-flat" d="M4 40 H156" />
            </svg>
            <p className="ad-reel-zero-hint">{t.zeroHint}</p>
          </div>
          <div className="ad-reel-ig">
            <div className="ad-reel-ig-head">
              <b>{t.ig}</b>
              <span>{t.igSub}</span>
            </div>
            <div className="ad-reel-dm is-ghost">{t.dm1}</div>
            <div className="ad-reel-dm is-ghost">{t.dm2}</div>
            <div className="ad-reel-empty" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <p className="ad-reel-dead">{t.dead}</p>
          </div>
        </section>

        {/* ── SITE: Tu negocio (generic) ─────────────────── */}
        <section className="ad-reel-scene ad-reel-site">
          <em>{t.siteKicker}</em>
          <div className="ad-reel-biz">
            <div className="ad-reel-biz-chrome">
              <span />
              <span />
              <span />
              <b>{t.siteDomain}</b>
            </div>
            <div className="ad-reel-biz-nav">
              <i className="ad-reel-biz-mark" aria-hidden="true">
                T
              </i>
              <div>
                <strong>{t.siteBrand}</strong>
                <small>{t.siteTag}</small>
              </div>
              <nav>
                {t.siteNav.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </nav>
            </div>
            <div className="ad-reel-biz-hero">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={MEDIA.hero} alt="" />
              <div className="ad-reel-biz-hero-copy">
                <span>{t.siteKickerLine}</span>
                <h3>
                  {t.siteHeadline[0]}
                  <br />
                  {t.siteHeadline[1]}
                  <br />
                  <em>{t.siteHeadline[2]}</em>
                </h3>
                <p>{t.siteLede}</p>
                <b>{t.siteCta}</b>
              </div>
            </div>
            <ul className="ad-reel-biz-stats">
              {t.siteStats.map((s) => (
                <li key={s.k}>
                  <strong>{s.v}</strong>
                  <span>{s.k}</span>
                </li>
              ))}
            </ul>
            <div className="ad-reel-biz-obras">
              {t.siteObras.map((o) => (
                <figure key={o.name}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={o.img} alt="" />
                  <figcaption>{o.name}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ── AFTER: exploding WhatsApp ──────────────────── */}
        <section className="ad-reel-scene ad-reel-after">
          <em>{t.after}</em>
          <div className="ad-reel-wa-head">
            <i className="ad-reel-biz-mark is-wa" aria-hidden="true">
              T
            </i>
            <div>
              <b>{t.siteBrand}</b>
              <span>
                {t.wa} · {t.waOnline}
              </span>
            </div>
          </div>
          <div className="ad-reel-dash">
            <div className="ad-reel-count">
              <b>
                <span ref={countEl}>0</span>
              </b>
              <small>{t.countLabel}</small>
            </div>
            <svg className="ad-reel-chart" viewBox="0 0 160 56" fill="none" aria-hidden="true">
              <path
                className="ad-reel-chart-rise"
                d="M4 48 C 28 46, 36 40, 52 36 S 84 30, 100 18 S 132 10, 156 6"
              />
            </svg>
          </div>
          <div className="ad-reel-stack">
            {t.bubbles.map((b) => (
              <div className="ad-reel-bubble" key={b.from}>
                <div className="ad-reel-bubble-meta">
                  <small>{b.from}</small>
                  <time>{b.time}</time>
                </div>
                <p>{b.msg}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="ad-reel-hold">
        <h2>
          <span className="ad-reel-hold-lead">{t.holdLead}</span>
          <i className="ad-reel-hold-payoff">{t.holdPayoff}</i>
        </h2>
        <div className="ad-quality-cta">
          <i aria-hidden="true" />
          {t.cta}
        </div>
      </footer>
    </article>
  );
}
