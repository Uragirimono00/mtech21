"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidateSite } from "@/lib/revalidate";
import { slugify } from "@/lib/slug";
import type { CategorySection } from "@/lib/types";
import { str, bool, int, json, type ActionState } from "./util";

export async function saveCategory(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = int(fd, "id", 0);
  const name = str(fd, "name", 100);
  if (!name) return { error: "메뉴 표시명을 입력해주세요." };
  const slug = slugify(str(fd, "slug", 80) || name, "category");
  const sectionsRaw = json<{ title?: string; body?: string }[]>(fd, "sections", []);
  const sections: CategorySection[] = sectionsRaw
    .map((s) => ({ title: String(s.title ?? "").trim(), body: String(s.body ?? "").trim() }))
    .filter((s) => s.title || s.body);

  const data = {
    name,
    slug,
    title: str(fd, "title", 200) || null,
    engTitle: str(fd, "engTitle", 200) || null,
    intro: str(fd, "intro", 5000) || null,
    sections,
    sortOrder: int(fd, "sortOrder", 0),
    visible: bool(fd, "visible"),
  };

  const dup = await prisma.category.findUnique({ where: { slug } });
  if (dup && dup.id !== id) return { error: `URL 슬러그 "${slug}" 는 이미 사용 중입니다.` };

  if (id) await prisma.category.update({ where: { id }, data });
  else await prisma.category.create({ data });

  revalidateSite();
  redirect("/admin/categories?saved=1");
}

export async function deleteCategory(fd: FormData) {
  await requireAdmin();
  const id = int(fd, "id", 0);
  if (!id) return;
  await prisma.category.delete({ where: { id } });
  revalidateSite();
  redirect("/admin/categories?deleted=1");
}

export async function moveCategory(fd: FormData) {
  await requireAdmin();
  const id = int(fd, "id", 0);
  const dir = str(fd, "dir") === "up" ? -1 : 1;
  const all = await prisma.category.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
  const idx = all.findIndex((c) => c.id === id);
  const j = idx + dir;
  if (idx < 0 || j < 0 || j >= all.length) return;
  const reordered = [...all];
  [reordered[idx], reordered[j]] = [reordered[j], reordered[idx]];
  await prisma.$transaction(reordered.map((c, i) => prisma.category.update({ where: { id: c.id }, data: { sortOrder: i + 1 } })));
  revalidateSite();
  redirect("/admin/categories");
}
