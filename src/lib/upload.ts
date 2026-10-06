import "server-only";
import { put } from "@vercel/blob";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml", "application/pdf"];

/** 비공개(private) Blob 파일을 이 사이트를 통해 제공하는 경로 접두사 → src/app/files/[...path]/route.ts */
export const BLOB_FILES_PREFIX = "/files";

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

/** Vercel Blob 저장소가 연결되어 있는지 (구형: BLOB_READ_WRITE_TOKEN, 신형: BLOB_STORE_ID + OIDC 자동 인증) */
export function hasBlobStorage() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

/** Blob pathname(예: uploads/a.png) → 이 사이트에서 접근 가능한 URL(/files/uploads/a.png) */
export function blobFileUrl(pathname: string) {
  return `${BLOB_FILES_PREFIX}/${pathname.split("/").map(encodeURIComponent).join("/")}`;
}

/**
 * 파일 저장 후 공개 URL 반환.
 * - Vercel Blob 이 연결되어 있으면 Blob 에 비공개(private)로 업로드하고 /files/... 경로를 반환 (배포 환경).
 *   Blob 저장소가 private 로 설정되어 있어 원본 blob URL 은 브라우저에서 직접 열 수 없으므로,
 *   /files/[...path] route handler 가 서버에서 Blob 을 읽어 전달합니다. 인증은 @vercel/blob 이 환경변수에서 자동으로 찾습니다.
 * - 없으면 로컬 public/uploads 에 저장 (개발 환경)
 */
export async function saveUpload(file: File, folder = "uploads"): Promise<string> {
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("파일 크기는 10MB 이하여야 합니다.");
  if (!ALLOWED.includes(file.type)) throw new Error("이미지(jpg, png, gif, webp, svg) 또는 PDF 파일만 업로드할 수 있습니다.");
  const name = safeName(file.name);

  if (hasBlobStorage()) {
    const blob = await put(`${folder}/${name}`, file, { access: "private", addRandomSuffix: true });
    return blobFileUrl(blob.pathname);
  }

  // Vercel 등 서버리스 환경은 파일 시스템이 읽기 전용이므로 Blob 저장소가 반드시 연결되어야 합니다.
  if (process.env.VERCEL) {
    throw new Error(
      "파일 저장소가 연결되지 않았습니다. Vercel 프로젝트 → Storage 에서 Blob 을 생성해 프로젝트에 연결한 뒤 다시 배포해주세요.",
    );
  }

  const stamp = Date.now().toString(36);
  const dir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(dir, { recursive: true });
  const fileName = `${stamp}-${name}`;
  await writeFile(path.join(dir, fileName), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${folder}/${fileName}`;
}
