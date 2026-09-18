"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import type { User } from "firebase/auth";
import AdsAuthGate from "@/components/ads-auth-gate";
import { signOutAds, subscribeAdsAuth } from "@/lib/ads-auth";
import {
  ADS,
  findAd,
  type AdEntry,
  type AdKind,
  type AdLang,
} from "./ads-library";
import { InboxReel } from "./inbox-reel";
import { SeoReel } from "./seo-reel";
import {
  assetPreviewSrc,
  createAdsAsset,
  createAdsFolder,
  deleteAdsAsset,
  deleteAdsFolder,
  subscribeAdsAssets,
  subscribeAdsFolders,
  subscribeAdsMeta,
  updateAdsAsset,
  uploadAdsAssetFile,
  upsertAdsMeta,
  type AdsAsset,
  type AdsFolder,
  type AdsMeta,
  type AdsStatus,
} from "@/lib/ads-gallery";
import "./ads.css";

type FolderFilter = "all" | "unfiled" | string;
type Selection =
  | { kind: "builtin"; id: AdKind }
  | { kind: "asset"; id: string };

function StillVisual({ ad, lang }: { ad: AdEntry; lang: AdLang }) {
  const t = ad.frame[lang];

  if (ad.id === "quality" || ad.id === "quality-light") {
    return (
      <div className="ad-quality-site" aria-hidden="true">
        <div className="ad-quality-chrome">
          <span />
          <span />
          <span />
          <b>nativa.studio</b>
        </div>
        <div className="ad-quality-page">
          <div className="ad-quality-page-nav">
            <b>{t.mockBrand}</b>
            {t.mockNav.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <div className="ad-quality-hero">
            <small>{t.mockHero}</small>
            <strong>{t.mockCta}</strong>
          </div>
          <div className="ad-quality-cards">
            {t.mockCards.map((card) => (
              <div key={card.v}>
                <em>{card.k}</em>
                <b>{card.v}</b>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (ad.id === "speed") {
    return (
      <div className="ad-speed" aria-hidden="true">
        <div className="ad-speed-col is-old">
          <small>Antes</small>
          <b>{t.speedOld}</b>
        </div>
        <span>→</span>
        <div className="ad-speed-col is-new">
          <small>Nativa</small>
          <b>{t.speedNew}</b>
        </div>
      </div>
    );
  }

  if (ad.id === "maps") {
    return (
      <div className="ad-maps" aria-hidden="true">
        <div className="ad-maps-pin" />
        <div className="ad-maps-card">
          <em>★ #1</em>
          <b>{t.mapsName}</b>
          <span>{t.mapsMeta}</span>
          <strong>WhatsApp</strong>
        </div>
      </div>
    );
  }

  return (
    <div className="ad-wa" aria-hidden="true">
      <div className="ad-wa-head">WhatsApp</div>
      <div className="ad-wa-bubble">
        <small>{t.waFrom}</small>
        <p>{t.waMsg}</p>
      </div>
    </div>
  );
}

function MissingStill({ ad, lang }: { ad: AdEntry; lang: AdLang }) {
  const t = ad.frame[lang];

  return (
    <article className="ad-missing" aria-label={ad.label[lang]}>
      <div className="ad-missing-grid" aria-hidden="true">
        <i className="ad-miss-blk is-a" />
        <i className="ad-miss-blk is-b" />
        <i className="ad-miss-blk is-c" />
        <i className="ad-miss-blk is-d" />
        <i className="ad-miss-blk is-e" />
        <i className="ad-miss-blk is-f" />
        <i className="ad-miss-ring" />
        <i className="ad-miss-slash" />
      </div>

      <header className="ad-missing-top">
        <span>{t.eyebrow}</span>
        <b>{t.studio}</b>
      </header>

      <div className="ad-missing-mid">
        <p className="ad-miss-kicker">{t.lead}</p>
        <h2 className="ad-miss-title">{t.payoff}</h2>
        <div className="ad-miss-stamp">
          <span>{t.body}</span>
        </div>
        <ul className="ad-miss-chips">
          {t.proof.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <footer className="ad-missing-bot">
        <strong>{t.cta}</strong>
        <em>{t.url}</em>
      </footer>
    </article>
  );
}

function NecesitaStill({ ad, lang }: { ad: AdEntry; lang: AdLang }) {
  const t = ad.frame[lang];
  const es = lang === "es";

  return (
    <article className="ad-necesita" aria-label={ad.label[lang]}>
      <div className="ad-necesita-stage" aria-hidden="true">
        <div className="ad-necesita-site">
          <div className="ad-necesita-chrome">
            <span />
            <span />
            <span />
            <em>{t.mockBrand.toLowerCase().replace(/\s+/g, "")}.do</em>
          </div>

          <div className="ad-necesita-page">
            <div className="ad-nec-mast">
              <strong>{t.mockBrand}</strong>
              <nav>
                {t.mockNav.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </nav>
              <b>{es ? "Reservar" : "Book"}</b>
            </div>

            <div className="ad-nec-spread">
              <div className="ad-nec-hero-copy">
                <small>{t.mockHero}</small>
                <h3>
                  {es ? (
                    <>
                      Lino,
                      <br />
                      <i>sal</i>
                      <br />
                      y sombra.
                    </>
                  ) : (
                    <>
                      Linen,
                      <br />
                      <i>salt</i>
                      <br />
                      and shade.
                    </>
                  )}
                </h3>
                <p>
                  {es
                    ? "Una web que se siente tan cara como el showroom."
                    : "A site that feels as expensive as the showroom."}
                </p>
                <div className="ad-nec-cta-row">
                  <u>{t.mockCta}</u>
                  <span>WhatsApp →</span>
                </div>
              </div>

              <div className="ad-nec-collage">
                <figure className="ad-nec-shot is-tall" style={{ backgroundImage: "url(/demo/bavaro-swim/beach.jpg)" }} />
                <figure className="ad-nec-shot is-top" style={{ backgroundImage: "url(/demo/bavaro-swim/vestido-cala.jpg)" }} />
                <figure className="ad-nec-shot is-bot" style={{ backgroundImage: "url(/demo/sdq-dental/exterior.jpg)" }} />
                <div className="ad-nec-float">
                  <em>★ 4.9</em>
                  <strong>{es ? "Maps · Zona Colonial" : "Maps · Zona Colonial"}</strong>
                  <small>{es ? "41 pedidos esta semana" : "41 orders this week"}</small>
                </div>
              </div>
            </div>

            <div className="ad-nec-ticker">
              {(es
                ? ["Diseño web", "SEO local", "WhatsApp CRM", "Live en 18 días", "Santo Domingo"]
                : ["Web design", "Local SEO", "WhatsApp CRM", "Live in 18 days", "Santo Domingo"]
              ).map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>

            <div className="ad-nec-strip">
              <figure style={{ backgroundImage: "url(/demo/bavaro-swim/enterizo-arena.jpg)" }} />
              <figure style={{ backgroundImage: "url(/demo/punta-cana-villas/pool.jpg)" }} />
              <figure style={{ backgroundImage: "url(/demo/constructora-aybar/piantini.jpg)" }} />
              <figure style={{ backgroundImage: "url(/demo/bavaro-swim/pareo.jpg)" }} />
            </div>

            <div className="ad-nec-editorial">
              <blockquote>
                <p>
                  {es
                    ? "“Antes éramos invisibles. Ahora el chat no para.”"
                    : "“We were invisible. Now the chat never stops.”"}
                </p>
                <cite>{es ? "— Fundadora, Maison Brisa" : "— Founder, Maison Brisa"}</cite>
              </blockquote>
              <figure style={{ backgroundImage: "url(/demo/sdq-dental/hero-operatory.jpg)" }} />
              <aside>
                {t.mockCards.map((card) => (
                  <div key={card.k}>
                    <small>{card.k}</small>
                    <strong>{card.v}</strong>
                  </div>
                ))}
              </aside>
            </div>
          </div>
        </div>
      </div>

      <div className="ad-necesita-scrim" aria-hidden="true" />

      <header className="ad-necesita-top">{t.eyebrow}</header>
      <div className="ad-necesita-mid">
        <p className="ad-necesita-line1">{t.lead}</p>
        <p className="ad-necesita-line2">{t.payoff}</p>
        <p className="ad-necesita-line3">
          {t.body}
          <i aria-hidden="true">.</i>
        </p>
      </div>
      <footer className="ad-necesita-bot">
        <span className="ad-necesita-rule" aria-hidden="true" />
        <span className="ad-necesita-url">{t.url}</span>
      </footer>
    </article>
  );
}

function Still({ ad, lang }: { ad: AdEntry; lang: AdLang }) {
  const t = ad.frame[lang];

  return (
    <article
      className={`ad-quality ad-kind-${ad.id}${ad.theme === "light" ? " is-light" : ""}`}
      aria-label={ad.label[lang]}
    >
      <header className="ad-quality-top">
        <div className="ad-quality-brand">
          <i className="ad-quality-mark" aria-hidden="true" />
          <div>
            <strong>Nativa</strong>
            <span>{t.studio}</span>
          </div>
        </div>
      </header>

      <div className="ad-quality-mid">
        <em>{t.eyebrow}</em>
        <h2>
          <span className="ad-quality-lead">{t.lead}</span>
          <i>{t.payoff}</i>
        </h2>
        <p>{t.body}</p>
        <StillVisual ad={ad} lang={lang} />
        <div className="ad-quality-proof">
          {t.proof.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>
      </div>

      <footer className="ad-quality-bot">
        <div className="ad-quality-cta">
          <i aria-hidden="true" />
          {t.cta}
        </div>
        <div className="ad-quality-url">{t.url}</div>
      </footer>
    </article>
  );
}

function statusLabel(status: AdsStatus, lang: AdLang) {
  if (lang === "es") {
    return status === "posted" ? "Publicado" : status === "ready" ? "Listo" : "Borrador";
  }
  return status === "posted" ? "Posted" : status === "ready" ? "Ready" : "Draft";
}

function AdsStudio() {
  const [lang, setLang] = useState<AdLang>("es");
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [folders, setFolders] = useState<AdsFolder[]>([]);
  const [meta, setMeta] = useState<Record<string, AdsMeta>>({});
  const [assets, setAssets] = useState<AdsAsset[]>([]);
  const [folderFilter, setFolderFilter] = useState<FolderFilter>("all");
  const [notesDraft, setNotesDraft] = useState("");
  const [captionDraft, setCaptionDraft] = useState("");
  const [titleDraft, setTitleDraft] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);
  const reduced = useReducedMotion() ?? false;
  const params = useSearchParams();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const saveTimer = useRef<number | null>(null);

  const requested = params.get("ad");
  const assetParam = params.get("asset");

  const selection: Selection = useMemo(() => {
    if (assetParam) return { kind: "asset", id: assetParam };
    const builtin = (requested as AdKind | null) ?? "quality-light";
    return { kind: "builtin", id: findAd(builtin).id };
  }, [assetParam, requested]);

  const builtinAd = selection.kind === "builtin" ? findAd(selection.id) : null;
  const selectedAsset =
    selection.kind === "asset" ? assets.find((a) => a.id === selection.id) ?? null : null;

  useEffect(() => subscribeAdsAuth(setUser), []);
  useEffect(() => subscribeAdsFolders(setFolders), []);
  useEffect(() => subscribeAdsMeta(setMeta), []);
  useEffect(() => subscribeAdsAssets(setAssets), []);

  useEffect(() => {
    if (selection.kind === "builtin" && builtinAd) {
      const m = meta[builtinAd.id];
      setNotesDraft(m?.notes ?? "");
      setCaptionDraft(m?.captionOverride ?? builtinAd.caption[lang]);
      setTitleDraft(builtinAd.label[lang]);
      return;
    }
    if (selection.kind === "asset" && selectedAsset) {
      setNotesDraft(selectedAsset.notes);
      setCaptionDraft(selectedAsset.caption);
      setTitleDraft(selectedAsset.title);
      return;
    }
    if (selection.kind === "asset" && !selectedAsset) {
      setNotesDraft("");
      setCaptionDraft("");
      setTitleDraft(lang === "es" ? "Cargando…" : "Loading…");
    }
  }, [selection, builtinAd, selectedAsset, meta, lang]);

  const galleryItems = useMemo(() => {
    const builtins = ADS.map((ad) => {
      const m = meta[ad.id];
      return {
        key: `b:${ad.id}`,
        kind: "builtin" as const,
        id: ad.id,
        n: ad.n,
        label: ad.label[lang],
        blurb: ad.blurb[lang],
        format: ad.format,
        folderId: m?.folderId ?? null,
        status: (m?.status ?? "draft") as AdsStatus,
      };
    });
    const customs = assets.map((asset, i) => ({
      key: `a:${asset.id}`,
      kind: "asset" as const,
      id: asset.id,
      n: String(i + 1).padStart(2, "0"),
      label: asset.title,
      blurb: asset.format === "svg" ? "SVG" : "Screenshot",
      format: "still" as const,
      folderId: asset.folderId,
      status: asset.status,
    }));
    const all = [...builtins, ...customs];
    return all.filter((item) => {
      if (folderFilter === "all") return true;
      if (folderFilter === "unfiled") return !item.folderId;
      return item.folderId === folderFilter;
    });
  }, [assets, meta, lang, folderFilter]);

  const currentStatus: AdsStatus =
    selection.kind === "builtin"
      ? meta[selection.id]?.status ?? "draft"
      : selectedAsset?.status ?? "draft";

  const currentFolderId =
    selection.kind === "builtin"
      ? meta[selection.id]?.folderId ?? null
      : selectedAsset?.folderId ?? null;

  const scheduleSave = (fn: () => Promise<void>) => {
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    setSaveState("saving");
    saveTimer.current = window.setTimeout(async () => {
      try {
        await fn();
        setSaveState("saved");
        window.setTimeout(() => setSaveState("idle"), 1200);
      } catch {
        setSaveState("error");
      }
    }, 450);
  };

  const selectBuiltin = (id: AdKind) => {
    setCopied(false);
    setUploadMsg(null);
    router.replace(`/ads?ad=${id}`, { scroll: false });
  };

  const selectAsset = (id: string) => {
    setCopied(false);
    setUploadMsg(null);
    router.replace(`/ads?asset=${id}`, { scroll: false });
  };

  const copyCaption = async () => {
    await navigator.clipboard.writeText(captionDraft);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const onNotesChange = (value: string) => {
    setNotesDraft(value);
    scheduleSave(async () => {
      if (selection.kind === "builtin") {
        await upsertAdsMeta(selection.id, { notes: value });
      } else {
        await updateAdsAsset(selection.id, { notes: value });
      }
    });
  };

  const onCaptionChange = (value: string) => {
    setCaptionDraft(value);
    scheduleSave(async () => {
      if (selection.kind === "builtin") {
        await upsertAdsMeta(selection.id, { captionOverride: value });
      } else {
        await updateAdsAsset(selection.id, { caption: value });
      }
    });
  };

  const onTitleChange = (value: string) => {
    setTitleDraft(value);
    if (selection.kind !== "asset") return;
    scheduleSave(async () => {
      await updateAdsAsset(selection.id, { title: value });
    });
  };

  const onStatusChange = async (status: AdsStatus) => {
    setSaveState("saving");
    try {
      if (selection.kind === "builtin") {
        await upsertAdsMeta(selection.id, { status });
      } else {
        await updateAdsAsset(selection.id, { status });
      }
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  };

  const onFolderAssign = async (folderId: string) => {
    const next = folderId === "" ? null : folderId;
    setSaveState("saving");
    try {
      if (selection.kind === "builtin") {
        await upsertAdsMeta(selection.id, { folderId: next });
      } else {
        await updateAdsAsset(selection.id, { folderId: next });
      }
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  };

  const addFolder = async () => {
    const name =
      typeof window !== "undefined"
        ? window.prompt(lang === "es" ? "Nombre de la carpeta" : "Folder name", "Instagram")
        : null;
    if (!name) return;
    await createAdsFolder(name, folders.length);
  };

  const removeFolder = async (id: string) => {
    if (!window.confirm(lang === "es" ? "¿Borrar carpeta?" : "Delete folder?")) return;
    await deleteAdsFolder(id);
    if (folderFilter === id) setFolderFilter("all");
  };

  const addAsset = async () => {
    const ref = await createAdsAsset({
      title: lang === "es" ? "Nuevo ad" : "New ad",
      order: assets.length,
      folderId: folderFilter !== "all" && folderFilter !== "unfiled" ? folderFilter : null,
    });
    selectAsset(ref.id);
  };

  const removeAsset = async () => {
    if (selection.kind !== "asset") return;
    if (!window.confirm(lang === "es" ? "¿Borrar este ad?" : "Delete this ad?")) return;
    await deleteAdsAsset(selection.id);
    selectBuiltin("quality-light");
  };

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || selection.kind !== "asset") return;
    setUploadMsg(lang === "es" ? "Subiendo…" : "Uploading…");
    try {
      const result = await uploadAdsAssetFile(selection.id, file);
      setUploadMsg(
        result.mode === "storage"
          ? lang === "es"
            ? "Guardado en Storage"
            : "Saved to Storage"
          : lang === "es"
            ? "Guardado inline (Storage aún no activo)"
            : "Saved inline (Storage not active yet)",
      );
    } catch (err) {
      setUploadMsg(err instanceof Error ? err.message : "Upload failed");
    }
  };

  const previewSrc = selectedAsset ? assetPreviewSrc(selectedAsset) : null;

  return (
    <div className="ads-studio ads-studio-gallery">
      <header className="ads-bar">
        <Link href="/">Nativa</Link>
        <div className="ads-bar-meta">
          <span className="ads-chip">Galería · 9:16</span>
          <div className="ads-toggle" role="group" aria-label="Language">
            <button
              type="button"
              className={lang === "es" ? "is-on" : undefined}
              onClick={() => setLang("es")}
            >
              ES
            </button>
            <button
              type="button"
              className={lang === "en" ? "is-on" : undefined}
              onClick={() => setLang("en")}
            >
              EN
            </button>
          </div>
          {user ? (
            <div className="ads-user">
              <span>{user.email}</span>
              <button type="button" onClick={() => signOutAds()}>
                {lang === "es" ? "Salir" : "Sign out"}
              </button>
            </div>
          ) : null}
        </div>
      </header>

      <div className="ads-gallery">
        <aside className="ads-rail" aria-label={lang === "es" ? "Carpetas" : "Folders"}>
          <div className="ads-rail-head">
            <p className="ads-lib-kicker">{lang === "es" ? "Carpetas" : "Folders"}</p>
            <button type="button" className="ads-mini-btn" onClick={addFolder}>
              + {lang === "es" ? "Nueva" : "New"}
            </button>
          </div>
          <div className="ads-folder-list">
            <button
              type="button"
              className={folderFilter === "all" ? "is-on" : undefined}
              onClick={() => setFolderFilter("all")}
            >
              {lang === "es" ? "Todas" : "All"}
            </button>
            <button
              type="button"
              className={folderFilter === "unfiled" ? "is-on" : undefined}
              onClick={() => setFolderFilter("unfiled")}
            >
              {lang === "es" ? "Sin carpeta" : "Unfiled"}
            </button>
            {folders.map((folder) => (
              <div key={folder.id} className="ads-folder-row">
                <button
                  type="button"
                  className={folderFilter === folder.id ? "is-on" : undefined}
                  onClick={() => setFolderFilter(folder.id)}
                >
                  {folder.name}
                </button>
                <button
                  type="button"
                  className="ads-folder-del"
                  aria-label={lang === "es" ? "Borrar carpeta" : "Delete folder"}
                  onClick={() => removeFolder(folder.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="ads-rail-head ads-rail-head-spaced">
            <p className="ads-lib-kicker">{lang === "es" ? "Ads" : "Ads"}</p>
            <button type="button" className="ads-mini-btn" onClick={addAsset}>
              + {lang === "es" ? "Ad" : "Ad"}
            </button>
          </div>
          <div className="ads-lib" role="listbox" aria-label={lang === "es" ? "Elegir anuncio" : "Pick an ad"}>
            {galleryItems.map((item) => {
              const on =
                (item.kind === "builtin" && selection.kind === "builtin" && selection.id === item.id) ||
                (item.kind === "asset" && selection.kind === "asset" && selection.id === item.id);
              return (
                <button
                  key={item.key}
                  type="button"
                  role="option"
                  aria-selected={on}
                  className={`ads-lib-item${on ? " is-on" : ""}`}
                  onClick={() =>
                    item.kind === "builtin"
                      ? selectBuiltin(item.id as AdKind)
                      : selectAsset(item.id)
                  }
                >
                  <b>{item.n}</b>
                  <span>
                    <strong>
                      {item.label}
                      {item.format === "reel" ? " · Reel" : ""}
                      {item.kind === "asset" ? " · File" : ""}
                    </strong>
                    <em>
                      {statusLabel(item.status, lang)} · {item.blurb}
                    </em>
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="ads-stage-wrap">
          <div className="ads-stage-label">
            {builtinAd?.format === "reel"
              ? lang === "es"
                ? `Graba este cuadro · 9:16 · loop ${builtinAd.id === "inbox-reel" ? "14s" : builtinAd.id === "seo-reel" ? "16s" : "12s"}`
                : `Record this frame · 9:16 · ${builtinAd.id === "inbox-reel" ? "14s" : builtinAd.id === "seo-reel" ? "16s" : "12s"} loop`
              : lang === "es"
                ? "Captura este cuadro · 9:16"
                : "Screenshot this frame · 9:16"}
          </div>
          <div className="ads-stage">
            <div className="ads-frame">
              {selection.kind === "asset" ? (
                previewSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="ads-asset-preview" src={previewSrc} alt={titleDraft} />
                ) : (
                  <div className="ads-asset-empty">
                    <p>{lang === "es" ? "Sube un SVG o screenshot" : "Upload an SVG or screenshot"}</p>
                    <button type="button" className="ads-copy-btn" onClick={() => fileRef.current?.click()}>
                      {lang === "es" ? "Elegir archivo" : "Choose file"}
                    </button>
                  </div>
                )
              ) : builtinAd?.id === "inbox-reel" ? (
                <InboxReel key={lang} lang={lang} reduced={reduced} />
              ) : builtinAd?.id === "seo-reel" ? (
                <SeoReel key={lang} lang={lang} reduced={reduced} />
              ) : builtinAd?.id === "necesita" ? (
                <NecesitaStill key={lang} ad={builtinAd} lang={lang} />
              ) : builtinAd?.id === "missing" ? (
                <MissingStill key={lang} ad={builtinAd} lang={lang} />
              ) : builtinAd ? (
                <Still ad={builtinAd} lang={lang} />
              ) : null}
            </div>
          </div>
        </div>

        <aside className="ads-side ads-detail" aria-label={lang === "es" ? "Detalles" : "Details"}>
          <p className="ads-lib-kicker">
            {selection.kind === "builtin"
              ? lang === "es"
                ? "Ad en código"
                : "Code ad"
              : lang === "es"
                ? "Ad archivo"
                : "Asset ad"}
          </p>
          {selection.kind === "asset" ? (
            <input
              className="ads-title-input"
              value={titleDraft}
              onChange={(e) => onTitleChange(e.target.value)}
              aria-label={lang === "es" ? "Título" : "Title"}
            />
          ) : (
            <h1>
              {builtinAd?.n} · {titleDraft}
            </h1>
          )}
          <p>
            {builtinAd?.blurb[lang] ??
              (lang === "es"
                ? "Guarda el export aquí, anota el caption y márcalo cuando lo publiques."
                : "Store the export here, jot the caption, mark it when posted.")}
          </p>

          <div className="ads-field-row">
            <label>
              <span>{lang === "es" ? "Estado" : "Status"}</span>
              <select
                value={currentStatus}
                onChange={(e) => onStatusChange(e.target.value as AdsStatus)}
              >
                <option value="draft">{statusLabel("draft", lang)}</option>
                <option value="ready">{statusLabel("ready", lang)}</option>
                <option value="posted">{statusLabel("posted", lang)}</option>
              </select>
            </label>
            <label>
              <span>{lang === "es" ? "Carpeta" : "Folder"}</span>
              <select
                value={currentFolderId ?? ""}
                onChange={(e) => onFolderAssign(e.target.value)}
              >
                <option value="">{lang === "es" ? "Sin carpeta" : "Unfiled"}</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="ads-notes">
            <span>{lang === "es" ? "Notas" : "Notes"}</span>
            <textarea
              value={notesDraft}
              onChange={(e) => onNotesChange(e.target.value)}
              rows={5}
              placeholder={
                lang === "es"
                  ? "Ideas, variantes, qué publicar en Stories…"
                  : "Ideas, variants, Stories notes…"
              }
            />
          </label>

          <div className="ads-side-card">
            <b>{lang === "es" ? "Caption" : "Caption"}</b>
            <textarea
              className="ads-caption-edit"
              value={captionDraft}
              onChange={(e) => onCaptionChange(e.target.value)}
              rows={8}
            />
            <button
              type="button"
              className={`ads-copy-btn${copied ? " is-done" : ""}`}
              onClick={copyCaption}
            >
              {copied
                ? lang === "es"
                  ? "Copiado"
                  : "Copied"
                : lang === "es"
                  ? "Copiar caption"
                  : "Copy caption"}
            </button>
          </div>

          {selection.kind === "asset" ? (
            <div className="ads-side-card">
              <b>{lang === "es" ? "Archivo" : "File"}</b>
              <input
                ref={fileRef}
                type="file"
                accept="image/*,.svg,image/svg+xml"
                hidden
                onChange={onFile}
              />
              <div className="ads-asset-actions">
                <button type="button" className="ads-copy-btn" onClick={() => fileRef.current?.click()}>
                  {lang === "es" ? "Subir SVG / screenshot" : "Upload SVG / screenshot"}
                </button>
                <button type="button" className="ads-danger-btn" onClick={removeAsset}>
                  {lang === "es" ? "Borrar ad" : "Delete ad"}
                </button>
              </div>
              {uploadMsg ? <p className="ads-upload-msg">{uploadMsg}</p> : null}
            </div>
          ) : null}

          <p className="ads-save-state">
            {saveState === "saving"
              ? lang === "es"
                ? "Guardando…"
                : "Saving…"
              : saveState === "saved"
                ? lang === "es"
                  ? "Guardado en Firebase"
                  : "Saved to Firebase"
                : saveState === "error"
                  ? lang === "es"
                    ? "Error al guardar"
                    : "Save failed"
                  : "\u00a0"}
          </p>
        </aside>
      </div>
    </div>
  );
}

export default function AdsPage() {
  return (
    <AdsAuthGate>
      <Suspense fallback={null}>
        <AdsStudio />
      </Suspense>
    </AdsAuthGate>
  );
}
