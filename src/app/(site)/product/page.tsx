import { redirect } from "next/navigation";
import { getVisibleCategories } from "@/lib/data";

export const revalidate = 3600;

/** /product → 첫 번째 카테고리로 이동 */
export default async function ProductIndexPage() {
  const cats = await getVisibleCategories();
  redirect(cats[0] ? `/product/${cats[0].slug}` : "/");
}
