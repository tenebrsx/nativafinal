"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import type { AdLang } from "./ads-library";

gsap.registerPlugin(useGSAP, SplitText);

const COPY = {
  es: {
    studio: "Web Studio · RD",
    query: "clinicas cerca de mi",
    tabs: ["Todos", "Imágenes", "Videos", "Maps"],
    about: "About 284,000 results (0.41 seconds)",
    mark: "Tu marca",
    dose: "Dosis de SEO",
    doseSub: "inyectada",
    yoursName: "Tu Clínica",
    yoursUrl: "tuclinica.com",
    yoursTitle: "Tu Clínica | Citas online · Santo Domingo",
    yoursSnippet: "Agenda, WhatsApp y precios claros. El paciente llega listo.",
    holdLead: "Tu clínica merece",
    holdPayoff: "lo mejor.",
    holdBrand: "Nativa",
    cta: "Elige Nativa",
    rivals: [
      { name: "Doctoralia", url: "doctoralia.com.do › clinicas", title: "Clínicas cerca de ti — Doctoralia", snippet: "Opiniones, precios y agenda online de clínicas en Santo Domingo." },
      { name: "Google Maps", url: "maps.google.com › clinicas", title: "Clínicas cerca de mí · Santo Domingo", snippet: "4.6 ★ · Abierto · Cómo llegar · Sitio web" },
      { name: "Facebook", url: "facebook.com › clinicasrd", title: "Clínicas RD | Facebook", snippet: "Páginas, reseñas y publicaciones de clínicas locales." },
      { name: "Páginas Amarillas", url: "paginasamarillas.com.do › salud", title: "Clínicas y centros médicos", snippet: "Directorio: teléfonos, direcciones y horarios." },
      { name: "Instagram", url: "instagram.com › clinicasrd", title: "clinicas.rd • Fotos y videos", snippet: "12.4 mil seguidores. Reels y destacados de salud." },
    ],
  },
  en: {
    studio: "Web Studio · DR",
    query: "clinicas cerca de mi",
    tabs: ["All", "Images", "Videos", "Maps"],
    about: "About 284,000 results (0.41 seconds)",
    mark: "Your brand",
    dose: "SEO dose",
    doseSub: "injected",
    yoursName: "Tu Clínica",
    yoursUrl: "tuclinica.com",
    yoursTitle: "Tu Clínica | Online bookings · Santo Domingo",
    yoursSnippet: "Bookings, WhatsApp and clear pricing. Patients arrive ready.",
    holdLead: "Your clinic deserves",
    holdPayoff: "the best.",
    holdBrand: "Nativa",
    cta: "Choose Nativa",
    rivals: [
      { name: "Doctoralia", url: "doctoralia.com.do › clinics", title: "Clinics near you — Doctoralia", snippet: "Reviews, prices and online booking for clinics in Santo Domingo." },
      { name: "Google Maps", url: "maps.google.com › clinics", title: "Clinics near me · Santo Domingo", snippet: "4.6 ★ · Open · Directions · Website" },
      { name: "Facebook", url: "facebook.com › clinicasrd", title: "Clínicas RD | Facebook", snippet: "Pages, reviews and posts from local clinics." },
      { name: "Yellow Pages", url: "paginasamarillas.com.do › health", title: "Clinics and medical centers", snippet: "Directory: phone numbers, addresses and hours." },
      { name: "Instagram", url: "instagram.com › clinicasrd", title: "clinicas.rd • Photos and videos", snippet: "12.4k followers. Health reels and highlights." },
    ],
  },
} as const;

const DURATION = 16;
const TYPE_ZOOM = 1.18;
const TYPE_MS = 95;
const FAV = ["#00a0dc", "#34a853", "#1877f2", "#fbbc05", "#e1306c"] as const;

function GoogleG() {
  return (
    <svg className="ad-seo-g" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function setPhase(el: HTMLElement, phase: "typing" | "serp" | "hold") {
  el.dataset.phase = phase;
}

export function SeoReel({ lang, reduced }: { lang: AdLang; reduced: boolean }) {
  const t = COPY[lang];
  const root = useRef<HTMLElement>(null);
  const queryChars = Array.from(t.query);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      gsap.ticker.lagSmoothing(0);

      const brand = el.querySelector<HTMLElement>(".ad-seo-brand");
      const cam = el.querySelector<HTMLElement>(".ad-seo-cam");
      const lens = el.querySelector<HTMLElement>(".ad-seo-lens");
      const stage = el.querySelector<HTMLElement>(".ad-seo-stage");
      const chrome = el.querySelector<HTMLElement>(".ad-seo-chrome");
      const tabs = el.querySelector<HTMLElement>(".ad-seo-tabs");
      const view = el.querySelector<HTMLElement>(".ad-seo-view");
      const list = el.querySelector<HTMLElement>(".ad-seo-list");
      const chars = gsap.utils.toArray<HTMLElement>(".ad-seo-ch", el);
      const caret = el.querySelector<HTMLElement>(".ad-seo-caret");
      const yours = el.querySelector<HTMLElement>(".ad-seo-row.is-yours");
      const mark = el.querySelector<HTMLElement>(".ad-seo-mark");
      const dose = el.querySelector<HTMLElement>(".ad-seo-dose");
      const rivals = gsap.utils.toArray<HTMLElement>(".ad-seo-row.is-rival", el);
      const hold = el.querySelector<HTMLElement>(".ad-seo-hold");
      const cta = el.querySelector<HTMLElement>(".ad-seo .ad-quality-cta");
      const holdLead = el.querySelector<HTMLElement>(".ad-seo-hold-lead");
      const holdPayoff = el.querySelector<HTMLElement>(".ad-seo-hold-payoff");
      const holdBrand = el.querySelector<HTMLElement>(".ad-seo-hold-brand");

      const placeYoursLast = () => {
        if (!list || !yours) return;
        list.appendChild(yours);
      };

      const placeYoursFirst = () => {
        if (!list || !yours) return;
        list.prepend(yours);
      };

      const revealChars = (n: number) => {
        const shown = Math.max(0, Math.min(chars.length, Math.round(n)));
        chars.forEach((ch, i) => {
          ch.classList.toggle("is-on", i < shown);
        });
        return shown;
      };

      /** Soft zoom locked on the search pill — G always stays in frame. */
      const lensToSearch = (scale = TYPE_ZOOM) => {
        if (!cam || !lens) return { x: 0, y: 0, scale: 1 };
        const searchEl = el.querySelector<HTMLElement>(".ad-seo-search");
        if (!searchEl) return { x: 0, y: 0, scale: 1 };

        const camBox = cam.getBoundingClientRect();
        const searchBox = searchEl.getBoundingClientRect();
        const curScale = Math.max(0.001, Number(gsap.getProperty(lens, "scale")) || 1);
        const curX = Number(gsap.getProperty(lens, "x")) || 0;
        const curY = Number(gsap.getProperty(lens, "y")) || 0;

        const cx = searchBox.left + searchBox.width * 0.5 - camBox.left;
        const cy = searchBox.top + searchBox.height * 0.5 - camBox.top;
        const localX = (cx - curX) / curScale;
        const localY = (cy - curY) / curScale;

        return {
          x: camBox.width * 0.5 - localX * scale,
          y: camBox.height * 0.48 - localY * scale,
          scale,
        };
      };

      /** Keep the caret visible inside the pill as letters grow (real input feel). */
      const followCaretInField = () => {
        const typeEl = el.querySelector<HTMLElement>(".ad-seo-type");
        if (!typeEl || !caret) return;
        const caretLeft = caret.offsetLeft;
        const viewLeft = typeEl.scrollLeft;
        const viewRight = viewLeft + typeEl.clientWidth;
        const pad = 18;
        if (caretLeft > viewRight - pad) {
          typeEl.scrollLeft = caretLeft - typeEl.clientWidth + pad;
        } else if (caretLeft < viewLeft + pad) {
          typeEl.scrollLeft = Math.max(0, caretLeft - pad);
        }
      };

      let typeTimer: ReturnType<typeof setInterval> | null = null;
      let typeDelay: ReturnType<typeof setTimeout> | null = null;

      const stopTyping = () => {
        if (typeTimer) {
          clearInterval(typeTimer);
          typeTimer = null;
        }
        if (typeDelay) {
          clearTimeout(typeDelay);
          typeDelay = null;
        }
      };

      const trackTypingCamera = () => {
        if (!lens) return;
        followCaretInField();
        gsap.to(lens, {
          ...lensToSearch(TYPE_ZOOM),
          duration: 0.14,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      const startTyping = () => {
        stopTyping();
        let i = 0;
        revealChars(0);
        const typeEl = el.querySelector<HTMLElement>(".ad-seo-type");
        if (typeEl) typeEl.scrollLeft = 0;
        gsap.set(lens, lensToSearch(TYPE_ZOOM));

        typeDelay = setTimeout(() => {
          typeDelay = null;
          i = 1;
          revealChars(i);
          trackTypingCamera();

          typeTimer = setInterval(() => {
            if (cancelled) {
              stopTyping();
              return;
            }
            i += 1;
            revealChars(i);
            trackTypingCamera();
            if (i >= chars.length) stopTyping();
          }, TYPE_MS);
        }, 280);
      };

      const showFinal = () => {
        placeYoursFirst();
        setPhase(el, "hold");
        revealChars(chars.length);
        gsap.set([brand, cam, stage, hold, chrome, tabs, view, lens], {
          autoAlpha: 1,
          x: 0,
          y: 0,
          scale: 1,
          clearProps: "transform",
        });
        yours?.classList.remove("is-climbing");
        gsap.set([rivals, yours], { autoAlpha: 1, y: 0, scale: 1, clearProps: "zIndex" });
        gsap.set([mark, dose, caret], { autoAlpha: 0 });
        gsap.set(cta, { autoAlpha: 1, y: 0, scale: 1 });
        gsap.set(holdBrand, { autoAlpha: 1, y: 0 });
      };

      if (reduced) {
        showFinal();
        return;
      }

      let leadSplit: ReturnType<typeof SplitText.create> | null = null;
      let payoffSplit: ReturnType<typeof SplitText.create> | null = null;
      let cancelled = false;
      let tl: gsap.core.Timeline | null = null;

      const resetLoop = () => {
        stopTyping();
        placeYoursLast();
        yours?.classList.remove("is-climbing");
        setPhase(el, "typing");
        revealChars(0);
        gsap.set([hold, mark, dose], { autoAlpha: 0, y: 0, scale: 1, rotation: 0 });
        gsap.set(brand, { autoAlpha: 1, y: 0 });
        gsap.set(cam, { autoAlpha: 1 });
        gsap.set(lens, { x: 0, y: 0, scale: 1, transformOrigin: "0 0" });
        gsap.set(stage, { autoAlpha: 1, x: 0, y: 0, scale: 1, clearProps: "transform" });
        gsap.set(tabs, { autoAlpha: 0 });
        gsap.set(view, { autoAlpha: 0 });
        gsap.set(chrome, { autoAlpha: 1 });
        gsap.set(rivals, { autoAlpha: 1, y: 0, scale: 1, clearProps: "zIndex" });
        gsap.set(yours, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          zIndex: 2,
          clearProps: "zIndex",
        });
        gsap.set(caret, { autoAlpha: 1 });
        gsap.set(cta, { autoAlpha: 0, y: 16, scale: 0.94 });
        gsap.set(holdBrand, { autoAlpha: 0, y: 8 });
        if (leadSplit) gsap.set(leadSplit.words, { opacity: 0, y: 14 });
        if (payoffSplit) gsap.set(payoffSplit.chars, { opacity: 0, y: 16 });
        const typeEl = el.querySelector<HTMLElement>(".ad-seo-type");
        if (typeEl) typeEl.scrollLeft = 0;
        gsap.set(lens, lensToSearch(TYPE_ZOOM));
        startTyping();
      };

      leadSplit = holdLead
        ? SplitText.create(holdLead, { type: "words", aria: "auto" })
        : null;
      payoffSplit = holdPayoff
        ? SplitText.create(holdPayoff, { type: "chars,words", aria: "auto" })
        : null;

      resetLoop();

      tl = gsap.timeline({
        repeat: -1,
        defaults: { ease: "power3.out" },
        onRepeat: resetLoop,
      });

      const typerWait = 0.28 + TYPE_MS * chars.length / 1000 + 0.15;

      // 1 · Wall-clock typing (started in resetLoop) + pull camera back before SERP
      tl.to(brand, { autoAlpha: 1, duration: 0.2 }, 0)
        .call(() => {
          if (cancelled) return;
          revealChars(chars.length);
          stopTyping();
        }, undefined, Math.max(2.4, typerWait))
        .to(caret, { autoAlpha: 0, duration: 0.15 }, Math.max(2.45, typerWait + 0.05))
        .to(
          lens,
          { x: 0, y: 0, scale: 1, duration: 0.45, ease: "power3.inOut" },
          Math.max(2.5, typerWait + 0.1),
        );

      const serpAt = Math.max(2.95, typerWait + 0.55);

      const FOCUS_ZOOM = 1.42;
      let focusStageY = 0;

      /** One-shot measure (stage at 0) so the tween can't chase its own transform. */
      const measureBusinessFocusY = () => {
        if (!cam || !yours || !stage) return -220;
        const prevY = Number(gsap.getProperty(stage, "y")) || 0;
        gsap.set(stage, { y: 0 });
        const camBox = cam.getBoundingClientRect();
        const yoursBox = yours.getBoundingClientRect();
        gsap.set(stage, { y: prevY });
        if (yoursBox.height < 1) return -220;
        // Business sits in the lower band — rivals peek above, little white below.
        const targetBottom = camBox.top + camBox.height * 0.88;
        return targetBottom - yoursBox.bottom;
      };

      /** Scale from the business center so overflow crops the dead white. */
      const punchIntoBusiness = (scale = FOCUS_ZOOM) => {
        if (!cam || !lens || !yours) return;
        const camBox = cam.getBoundingClientRect();
        const yoursBox = yours.getBoundingClientRect();
        const ox = ((yoursBox.left + yoursBox.width * 0.5 - camBox.left) / camBox.width) * 100;
        const oy = ((yoursBox.top + yoursBox.height * 0.55 - camBox.top) / camBox.height) * 100;
        gsap.set(lens, {
          x: 0,
          y: 0,
          scale: 1,
          transformOrigin: `${Math.max(8, Math.min(92, ox))}% ${Math.max(12, Math.min(88, oy))}%`,
        });
        gsap.to(lens, {
          scale,
          duration: 0.55,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      // 2 · Open the SERP and glide down to tuclinica.com
      tl.call(() => {
        if (!cancelled) setPhase(el, "serp");
      }, undefined, serpAt)
        .to(tabs, { autoAlpha: 1, duration: 0.28 }, serpAt + 0.05)
        .fromTo(
          view,
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.4 },
          serpAt + 0.1,
        )
        .call(() => {
          if (cancelled) return;
          focusStageY = measureBusinessFocusY();
        }, undefined, serpAt + 0.22)
        .to(
          stage,
          {
            y: () => focusStageY,
            duration: 1.35,
            ease: "power3.inOut",
          },
          serpAt + 0.25,
        )
        // Punch in on the business so the frame isn't half empty white
        .call(() => {
          if (!cancelled) punchIntoBusiness(FOCUS_ZOOM);
        }, undefined, serpAt + 1.4)

        // 3 · Arrows → tu marca
        .fromTo(
          mark,
          { autoAlpha: 0, scale: 0.7, x: 18 },
          { autoAlpha: 1, scale: 1, x: 0, duration: 0.45, ease: "back.out(1.6)" },
          serpAt + 1.55,
        )
        .to(mark, { x: 4, duration: 0.55, yoyo: true, repeat: 1, ease: "sine.inOut" }, serpAt + 2.0)

        // 4 · SEO dose injection
        .fromTo(
          dose,
          { autoAlpha: 0, scale: 0.4, y: -40, rotation: -18 },
          { autoAlpha: 1, scale: 1, y: 0, rotation: 0, duration: 0.55, ease: "back.out(1.7)" },
          serpAt + 2.7,
        )
        .to(
          yours,
          {
            scale: 1.04,
            duration: 0.22,
            yoyo: true,
            repeat: 1,
            ease: "power1.out",
          },
          serpAt + 3.1,
        )
        .to(dose, { autoAlpha: 0, scale: 1.2, y: -12, duration: 0.35, ease: "power2.in" }, serpAt + 3.4)
        .to(mark, { autoAlpha: 0, duration: 0.25 }, serpAt + 3.45)

        // Reset camera for the climb
        .to(lens, { scale: 1, duration: 0.5, ease: "power3.inOut" }, serpAt + 3.5)
        .set(lens, { transformOrigin: "0 0", x: 0, y: 0 }, serpAt + 4.0)
        .to(stage, { y: 0, duration: 0.55, ease: "power3.inOut" }, serpAt + 3.55);

      // 5 · Climb past competition
      if (list && yours) {
        const climbStart = serpAt + 4.1;
        const climbDur = 2.45;
        let climbDist = 0;
        let pushDown = 0;

        tl.call(
          () => {
            if (cancelled || !list || !yours) return;
            const gap =
              parseFloat(getComputedStyle(list).rowGap || getComputedStyle(list).gap) || 14;
            climbDist = rivals.reduce((sum, row) => sum + row.offsetHeight + gap, 0);
            pushDown = yours.offsetHeight + gap;
            yours.classList.add("is-climbing");
          },
          undefined,
          climbStart - 0.04,
        )
          .set(yours, { zIndex: 8, transformOrigin: "50% 50%" }, climbStart)
          .to(
            yours,
            {
              y: () => -climbDist,
              duration: climbDur,
              ease: "power2.inOut",
            },
            climbStart,
          );

        const fromBottom = [...rivals].reverse();
        fromBottom.forEach((rival, i) => {
          const n = fromBottom.length || 1;
          const passAt = climbStart + ((i + 0.12) / n) * climbDur * 0.92;
          // Keep rivals fully solid — only slide them down as yours passes.
          tl!.to(
            rival,
            {
              y: () => pushDown,
              duration: 0.42,
              ease: "power3.out",
            },
            passAt,
          );
        });

        tl.call(
          () => {
            if (cancelled || !yours) return;
            yours.classList.remove("is-climbing");
            placeYoursFirst();
            gsap.set(yours, { y: 0, scale: 1, clearProps: "zIndex" });
            gsap.set(rivals, { y: 0, scale: 1, autoAlpha: 1 });
            // Fill the tall 9:16 frame so #1 isn't floating over a white void
            if (cam && lens && stage) {
              gsap.set(lens, { x: 0, y: 0, scale: 1, transformOrigin: "50% 0%" });
              const camH = cam.getBoundingClientRect().height;
              const stageH = stage.getBoundingClientRect().height;
              const fit = Math.min(1.5, Math.max(1, (camH * 0.96) / Math.max(stageH, 1)));
              gsap.to(lens, { scale: fit, duration: 0.45, ease: "power2.out", overwrite: "auto" });
            }
          },
          undefined,
          climbStart + climbDur + 0.02,
        );
      }

      // 6 · Hold
      const holdAt = Math.max(10.2, serpAt + 6.7);
      tl.to(cam, { autoAlpha: 0, duration: 0.4, ease: "power2.in" }, holdAt)
        .call(() => {
          if (!cancelled) setPhase(el, "hold");
        }, undefined, holdAt)
        .to(hold, { autoAlpha: 1, duration: 0.22 }, holdAt + 0.25);

      if (leadSplit) {
        tl.to(
          leadSplit.words,
          { opacity: 1, y: 0, duration: 0.38, stagger: 0.05, ease: "power2.out" },
          holdAt + 0.35,
        );
      }
      if (payoffSplit) {
        tl.to(
          payoffSplit.chars,
          { opacity: 1, y: 0, duration: 0.42, stagger: 0.02, ease: "power3.out" },
          holdAt + 0.65,
        );
      }

      tl.to(holdBrand, { autoAlpha: 1, y: 0, duration: 0.35 }, holdAt + 0.9)
        .to(
          cta,
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.48, ease: "back.out(1.5)" },
          holdAt + 1.1,
        )
        .to(
          cta,
          {
            scale: 1.04,
            duration: 0.48,
            yoyo: true,
            repeat: 1,
            ease: "power1.inOut",
          },
          holdAt + 1.8,
        )
        .to([hold, brand], { autoAlpha: 0, duration: 0.38, ease: "power2.in" }, Math.min(DURATION - 1.15, holdAt + 4.5))
        .to({}, { duration: 0.01 }, DURATION);

      const onVis = () => {
        if (document.visibilityState === "visible" && tl && !cancelled) {
          gsap.ticker.wake();
          tl.play();
        }
      };
      document.addEventListener("visibilitychange", onVis);

      return () => {
        cancelled = true;
        stopTyping();
        document.removeEventListener("visibilitychange", onVis);
        tl?.kill();
        leadSplit?.revert();
        payoffSplit?.revert();
      };
    },
    { scope: root, dependencies: [lang, reduced] },
  );

  return (
    <article
      ref={root}
      className={`ad-seo ad-reel${reduced ? " is-static" : ""}`}
      aria-label="SEO reel"
      style={{ ["--reel" as string]: `${DURATION}s` }}
    >
      <header className="ad-seo-brand ad-reel-brand">
        <i className="ad-quality-mark" aria-hidden="true" />
        <div>
          <strong>Nativa</strong>
          <span>{t.studio}</span>
        </div>
      </header>

      <div className="ad-seo-body">
        <div className="ad-seo-cam">
          <div className="ad-seo-lens">
            <div className="ad-seo-stage">
              <div className="ad-seo-chrome">
                <div className="ad-seo-search">
                  <GoogleG />
                  <div className="ad-seo-type">
                    <b className="ad-seo-query">
                      {queryChars.map((ch, i) => (
                        <i className="ad-seo-ch" key={`${ch}-${i}`}>
                          {ch === " " ? "\u00a0" : ch}
                        </i>
                      ))}
                    </b>
                    <i className="ad-seo-caret" aria-hidden="true" />
                  </div>
                  <i className="ad-seo-x" aria-hidden="true" />
                  <i className="ad-seo-mic" aria-hidden="true" />
                </div>
                <nav className="ad-seo-tabs" aria-hidden="true">
                  {t.tabs.map((tab, i) => (
                    <span className={i === 0 ? "is-on" : undefined} key={tab}>
                      {tab}
                    </span>
                  ))}
                </nav>
              </div>

              <div className="ad-seo-view">
                <p className="ad-seo-about">{t.about}</p>
                <div className="ad-seo-list">
                  {t.rivals.map((r, i) => (
                    <article className="ad-seo-row is-rival" key={r.url}>
                      <div className="ad-seo-cite">
                        <i className="ad-seo-fav" style={{ background: FAV[i] }} aria-hidden="true">
                          {r.name.slice(0, 1)}
                        </i>
                        <div>
                          <b>{r.name}</b>
                          <small className="ad-seo-url">{r.url}</small>
                        </div>
                      </div>
                      <strong>{r.title}</strong>
                      <p>{r.snippet}</p>
                    </article>
                  ))}

                  <article className="ad-seo-row is-yours">
                    <div className="ad-seo-cite">
                      <i className="ad-seo-fav is-yours" aria-hidden="true">
                        T
                      </i>
                      <div>
                        <b>{t.yoursName}</b>
                        <small className="ad-seo-url">{t.yoursUrl}</small>
                      </div>
                    </div>
                    <strong>{t.yoursTitle}</strong>
                    <p>{t.yoursSnippet}</p>

                    <div className="ad-seo-mark" aria-hidden="true">
                      <svg viewBox="0 0 64 40" className="ad-seo-mark-arrows">
                        <path d="M8 8 L28 20 L8 32" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M22 8 L42 20 L22 32" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>{t.mark}</span>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </div>

          <div className="ad-seo-dose" aria-hidden="true">
            <i />
            <div>
              <b>{t.dose}</b>
              <small>{t.doseSub}</small>
            </div>
          </div>
        </div>
      </div>

      <footer className="ad-seo-hold ad-reel-hold">
        <h2>
          <span className="ad-seo-hold-lead">{t.holdLead}</span>
          <i className="ad-seo-hold-payoff">{t.holdPayoff}</i>
        </h2>
        <p className="ad-seo-hold-brand">{t.holdBrand}</p>
        <div className="ad-quality-cta">
          <i aria-hidden="true" />
          {t.cta}
        </div>
      </footer>
    </article>
  );
}
