/** URL 슬러그 생성: 영문/숫자/하이픈만. 비어 있으면 fallback 사용 */
export function slugify(input: string, fallback = "item") {
  const s = input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return s || `${fallback}-${Date.now().toString(36)}`;
}
