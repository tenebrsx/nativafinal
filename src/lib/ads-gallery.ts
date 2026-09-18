import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  type Unsubscribe,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { auth, db, storage } from "@/lib/firebase";
import type { AdKind } from "@/app/ads/ads-library";

export type AdsStatus = "draft" | "ready" | "posted";

export type AdsFolder = {
  id: string;
  name: string;
  order: number;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type AdsMeta = {
  id: string;
  notes: string;
  folderId: string | null;
  status: AdsStatus;
  captionOverride?: string;
  updatedAt?: unknown;
};

export type AdsAsset = {
  id: string;
  title: string;
  notes: string;
  caption: string;
  folderId: string | null;
  status: AdsStatus;
  format: "image" | "svg";
  storagePath?: string;
  downloadURL?: string;
  /** Inline fallback when Storage bucket is unavailable (small files). */
  dataUrl?: string;
  order: number;
  createdAt?: unknown;
  updatedAt?: unknown;
};

const FOLDERS = "adsFolders";
const META = "adsMeta";
const ASSETS = "adsAssets";

const MAX_INLINE_BYTES = 700_000;

export function subscribeAdsFolders(cb: (folders: AdsFolder[]) => void): Unsubscribe {
  const q = query(collection(db, FOLDERS), orderBy("order", "asc"));
  return onSnapshot(q, (snap) => {
    cb(
      snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: String(data.name ?? "Sin nombre"),
          order: Number(data.order ?? 0),
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };
      }),
    );
  });
}

export function subscribeAdsMeta(cb: (meta: Record<string, AdsMeta>) => void): Unsubscribe {
  return onSnapshot(collection(db, META), (snap) => {
    const next: Record<string, AdsMeta> = {};
    for (const d of snap.docs) {
      const data = d.data();
      next[d.id] = {
        id: d.id,
        notes: String(data.notes ?? ""),
        folderId: (data.folderId as string | null | undefined) ?? null,
        status: (data.status as AdsStatus) || "draft",
        captionOverride: data.captionOverride ? String(data.captionOverride) : undefined,
        updatedAt: data.updatedAt,
      };
    }
    cb(next);
  });
}

export function subscribeAdsAssets(cb: (assets: AdsAsset[]) => void): Unsubscribe {
  const q = query(collection(db, ASSETS), orderBy("order", "asc"));
  return onSnapshot(q, (snap) => {
    cb(
      snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          title: String(data.title ?? "Nuevo ad"),
          notes: String(data.notes ?? ""),
          caption: String(data.caption ?? ""),
          folderId: (data.folderId as string | null | undefined) ?? null,
          status: (data.status as AdsStatus) || "draft",
          format: data.format === "svg" ? "svg" : "image",
          storagePath: data.storagePath ? String(data.storagePath) : undefined,
          downloadURL: data.downloadURL ? String(data.downloadURL) : undefined,
          dataUrl: data.dataUrl ? String(data.dataUrl) : undefined,
          order: Number(data.order ?? 0),
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };
      }),
    );
  });
}

export async function createAdsFolder(name: string, order: number) {
  return addDoc(collection(db, FOLDERS), {
    name: name.trim() || "Nueva carpeta",
    order,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function renameAdsFolder(id: string, name: string) {
  await updateDoc(doc(db, FOLDERS, id), {
    name: name.trim() || "Sin nombre",
    updatedAt: serverTimestamp(),
  });
}

export async function deleteAdsFolder(id: string) {
  await deleteDoc(doc(db, FOLDERS, id));
}

export async function upsertAdsMeta(
  builtinId: AdKind | string,
  patch: Partial<Pick<AdsMeta, "notes" | "folderId" | "status" | "captionOverride">>,
) {
  await setDoc(
    doc(db, META, builtinId),
    {
      ...patch,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function createAdsAsset(input: {
  title: string;
  order: number;
  folderId?: string | null;
}) {
  return addDoc(collection(db, ASSETS), {
    title: input.title.trim() || "Nuevo ad",
    notes: "",
    caption: "",
    folderId: input.folderId ?? null,
    status: "draft" as AdsStatus,
    format: "image" as const,
    order: input.order,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateAdsAsset(
  id: string,
  patch: Partial<
    Pick<
      AdsAsset,
      | "title"
      | "notes"
      | "caption"
      | "folderId"
      | "status"
      | "format"
      | "storagePath"
      | "downloadURL"
      | "dataUrl"
      | "order"
    >
  >,
) {
  await updateDoc(doc(db, ASSETS, id), {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteAdsAsset(id: string) {
  await deleteDoc(doc(db, ASSETS, id));
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("read failed"));
    reader.readAsDataURL(file);
  });
}

export async function uploadAdsAssetFile(assetId: string, file: File) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Not signed in");

  const format: "image" | "svg" =
    file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg")
      ? "svg"
      : "image";

  const safeName = file.name.replace(/[^\w.\-]+/g, "_").slice(0, 80) || "ad";
  const storagePath = `ads-studio/${uid}/${assetId}/${safeName}`;

  try {
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, file, { contentType: file.type || "image/png" });
    const downloadURL = await getDownloadURL(storageRef);
    await updateAdsAsset(assetId, {
      format,
      storagePath,
      downloadURL,
      dataUrl: undefined,
    });
    return { mode: "storage" as const, downloadURL };
  } catch {
    if (file.size > MAX_INLINE_BYTES) {
      throw new Error(
        "Storage no está disponible aún y el archivo supera ~700KB. Activa Firebase Storage (Blaze) o sube un SVG/imagen más liviana.",
      );
    }
    const dataUrl = await readFileAsDataUrl(file);
    await updateAdsAsset(assetId, {
      format,
      dataUrl,
      storagePath: undefined,
      downloadURL: undefined,
    });
    return { mode: "inline" as const, dataUrl };
  }
}

export function assetPreviewSrc(asset: AdsAsset): string | null {
  return asset.downloadURL || asset.dataUrl || null;
}
