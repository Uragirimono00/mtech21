import "server-only";
import { revalidatePath } from "next/cache";

/** 관리자 변경 후 공개 사이트 전체 캐시 갱신 */
export function revalidateSite() {
  revalidatePath("/", "layout");
}
