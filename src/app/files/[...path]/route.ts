import { get } from "@vercel/blob";
import { ALLOWED_UPLOAD_TYPES, hasBlobStorage } from "@/lib/upload";

export const runtime = "nodejs";

/** Blob pathname 세그먼트 허용 문자: 영문/숫자/한글/._- (saveUpload 의 safeName 과 동일 범위) */
const SAFE_SEGMENT = /^[\w가-힣.-]+$/;
/** 브라우저에서 바로(inline) 열어도 되는 종류 = 업로드 허용 목록. 그 외는 다운로드로만 내려줍니다. */
const INLINE_TYPES = new Set<string>(ALLOWED_UPLOAD_TYPES);

/**
 * 비공개(private) Vercel Blob 파일을 이 사이트 경로(/files/<pathname>)로 공개 제공합니다.
 * 예) /files/uploads/photo-AbC123.png → Blob 의 uploads/photo-AbC123.png
 *
 * 사이트와 같은 출처에서 제공되므로 저장된 Content-Type/Content-Disposition 을 그대로 믿지 않습니다.
 * - 허용 목록(이미지·PDF) 외 종류는 application/octet-stream + 첨부파일(다운로드)로만 내려줌 (HTML 등 실행 방지)
 * - SVG 는 직접 열릴 때 스크립트가 실행되지 않도록 CSP 로 차단 (<img> 로 쓸 때는 영향 없음)
 * 업로드 시 addRandomSuffix 로 파일명이 고유하므로(덮어쓰기 없음) 장기 캐시를 허용합니다.
 * ?download=1 을 붙이면 첨부파일(다운로드)로 내려줍니다.
 */
export async function GET(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  if (!hasBlobStorage() || path.length === 0 || !path.every((s) => SAFE_SEGMENT.test(s) && s !== "." && s !== "..")) {
    return new Response("Not found", { status: 404 });
  }
  const pathname = path.join("/");

  let result;
  try {
    result = await get(pathname, { access: "private", ifNoneMatch: request.headers.get("if-none-match") ?? undefined });
  } catch (e) {
    console.error(`[files] Blob 읽기 실패: ${pathname}`, e);
    return new Response("Storage error", { status: 502 });
  }
  if (!result) return new Response("Not found", { status: 404 });

  const headers = new Headers({
    "Cache-Control": "public, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff",
  });
  if (result.blob.etag) headers.set("ETag", result.blob.etag);
  const lastModified = result.headers.get("last-modified");
  if (lastModified) headers.set("Last-Modified", lastModified);

  if (result.statusCode === 304) return new Response(null, { status: 304, headers });

  const type = (result.blob.contentType || "").split(";")[0].trim().toLowerCase();
  const download = new URL(request.url).searchParams.has("download");
  const inline = INLINE_TYPES.has(type) && !download;
  const filename = path[path.length - 1];
  headers.set("Content-Type", inline ? type : "application/octet-stream");
  headers.set("Content-Disposition", `${inline ? "inline" : "attachment"}; filename*=UTF-8''${encodeURIComponent(filename)}`);
  if (type === "image/svg+xml") headers.set("Content-Security-Policy", "script-src 'none'; sandbox");
  // fetch 가 content-encoding 을 해제해 전달하므로, 인코딩이 없을 때만 원본 길이를 그대로 사용
  const contentLength = result.headers.get("content-length");
  if (contentLength && !result.headers.get("content-encoding")) headers.set("Content-Length", contentLength);

  return new Response(result.stream, { status: 200, headers });
}
