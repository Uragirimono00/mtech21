/** 사이트 공개 URL (환경변수 NEXT_PUBLIC_SITE_URL → Vercel 기본 도메인). sitemap/OG/canonical 에 사용 */
export function siteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") || "https://mtech21.vercel.app";
  return raw.replace(/\/+$/, "");
}
