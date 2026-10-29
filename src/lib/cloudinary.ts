import "server-only";
import { createHash } from "node:crypto";

// CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
function config() {
  const raw = process.env.CLOUDINARY_URL;
  if (!raw) return null;
  try {
    const u = new URL(raw);
    if (u.protocol !== "cloudinary:" || !u.username || !u.password || !u.hostname) return null;
    return { apiKey: u.username, apiSecret: decodeURIComponent(u.password), cloudName: u.hostname };
  } catch {
    return null;
  }
}

export const cloudinaryReady = () => config() !== null;

/** Cloudinary imzası: parametreler alfabetik, "k=v&k=v" + secret, SHA-1. */
export function signParams(params: Record<string, string>, secret: string) {
  const base = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha1").update(base + secret).digest("hex");
}

export async function uploadImage(file: File, folder: string): Promise<{ url: string; publicId: string }> {
  const c = config();
  if (!c) throw new Error("Fotoğraf depolama (CLOUDINARY_URL) ayarlanmamış.");

  const timestamp = String(Math.floor(Date.now() / 1000));
  const signed = { folder, timestamp };
  const body = new FormData();
  body.set("file", file);
  body.set("api_key", c.apiKey);
  body.set("timestamp", timestamp);
  body.set("folder", folder);
  body.set("signature", signParams(signed, c.apiSecret));

  const res = await fetch(`https://api.cloudinary.com/v1_1/${c.cloudName}/image/upload`, {
    method: "POST",
    body,
  });
  const json = (await res.json()) as { secure_url?: string; public_id?: string; error?: { message: string } };
  if (!res.ok || !json.secure_url || !json.public_id) {
    throw new Error(json.error?.message ?? "Fotoğraf yüklenemedi.");
  }
  return { url: json.secure_url, publicId: json.public_id };
}

/** ".../upload/v123/nesil/urunler/abc.jpg" → "nesil/urunler/abc" */
export function publicIdFromUrl(url: string) {
  const after = url.split("/upload/")[1];
  if (!after) return null;
  const parts = after.split("/");
  // Sürüm (v123) varsa ondan öncesi dönüşüm parametreleridir; yoksa "w_400" gibi parçaları atla.
  const v = parts.findIndex((p) => /^v\d+$/.test(p));
  let id = v >= 0 ? parts.slice(v + 1) : parts;
  if (v < 0) while (id.length > 1 && /^[a-z]{1,3}_[^/]*$/i.test(id[0])) id = id.slice(1);
  const joined = id.join("/").replace(/\.[a-z0-9]+$/i, "");
  return joined || null;
}

export async function deleteImage(publicId: string) {
  const c = config();
  if (!c) return;
  const timestamp = String(Math.floor(Date.now() / 1000));
  const body = new FormData();
  body.set("public_id", publicId);
  body.set("api_key", c.apiKey);
  body.set("timestamp", timestamp);
  body.set("signature", signParams({ public_id: publicId, timestamp }, c.apiSecret));
  await fetch(`https://api.cloudinary.com/v1_1/${c.cloudName}/image/destroy`, { method: "POST", body });
}
