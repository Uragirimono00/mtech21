import "server-only";
import { put } from "@vercel/blob";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml", "application/pdf"];

function safeName(name: string) {
  const ext = path.extname(name).toLowerCase();
  const base = path
    .basename(name, ext)
    .normalize("NFC")
    .replace(/[^\w가-힣.-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "file";
  return `${base}${ext}`;
}

/**
 * 파일 저장 후 공개 URL 반환.
 * - BLOB_READ_WRITE_TOKEN 이 있으면 Vercel Blob 에 업로드 (배포 환경)
 * - 없으면 로컬 public/uploads 에 저장 (개발 환경)
 */
export async function saveUpload(file: File, folder = "uploads"): Promise<string> {
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("파일 크기는 10MB 이하여야 합니다.");
  if (!ALLOWED.includes(file.type)) throw new Error("이미지(jpg, png, gif, webp, svg) 또는 PDF 파일만 업로드할 수 있습니다.");
  const name = safeName(file.name);

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`${folder}/${name}`, file, { access: "public", addRandomSuffix: true });
    return blob.url;
  }

  const stamp = Date.now().toString(36);
  const dir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(dir, { recursive: true });
  const fileName = `${stamp}-${name}`;
  await writeFile(path.join(dir, fileName), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${folder}/${fileName}`;
}
