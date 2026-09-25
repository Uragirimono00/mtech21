"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidateSite } from "@/lib/revalidate";
import { slugify } from "@/lib/slug";
import type { ProductSection } from "@/lib/types";
import { str, bool, int, json, type ActionState } from "./util";

export async function saveProduct(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = int(fd, "id", 0);
  const categoryId = int(fd, "categoryId", 0);
  const name = str(fd, "name", 200);
  if (!categoryId) return { error: "카테고리를 선택해주세요." };
  if (!name) return { error: "제품명을 입력해주세요." };
  const slug = slugify(str(fd, "slug", 80) || name, "product");
  const sectionsRaw = json<{ title?: string; html?: string }[]>(fd, "sections", []);
  const sections: ProductSection[] = sectionsRaw
    .map((s) => ({ title: String(s.title ?? "").trim(), html: String(s.html ?? "").trim() }))
    .filter((s) => s.title || s.html);

  const data = {
    categoryId,
    name,
    slug,
    subtitle: str(fd, "subtitle", 2000) || null,
    thumbnail: str(fd, "thumbnail", 500) || null,
    sections,
    sortOrder: int(fd, "sortOrder", 0),
    visible: bool(fd, "visible"),
  };

  const dup = await prisma.product.findUnique({ where: { categoryId_slug: { categoryId, slug } } });
  if (dup && dup.id !== id) return { error: `같은 카테고리에 URL 슬러그 "${slug}" 가 이미 있습니다.` };

  if (id) await prisma.product.update({ where: { id }, data });
  else await prisma.product.create({ data });

  revalidateSite();
  redirect(`/admin/products?category=${categoryId}&saved=1`);
}

export async function deleteProduct(fd: FormData) {
  await requireAdmin();
  const id = int(fd, "id", 0);
  if (!id) return;
  const p = await prisma.product.delete({ where: { id } });
  revalidateSite();
  redirect(`/admin/products?category=${p.categoryId}&deleted=1`);
}

export async function moveProduct(fd: FormData) {
  await requireAdmin();
  const id = int(fd, "id", 0);
  const dir = str(fd, "dir") === "up" ? -1 : 1;
  const target = await prisma.product.findUnique({ where: { id } });
  if (!target) return;
  const all = await prisma.product.findMany({ where: { categoryId: target.categoryId }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
  const idx = all.findIndex((c) => c.id === id);
  const j = idx + dir;
  if (idx < 0 || j < 0 || j >= all.length) return;
  const reordered = [...all];
  [reordered[idx], reordered[j]] = [reordered[j], reordered[idx]];
  await prisma.$transaction(reordered.map((c, i) => prisma.product.update({ where: { id: c.id }, data: { sortOrder: i + 1 } })));
  revalidateSite();
  redirect(`/admin/products?category=${target.categoryId}`);
}

export async function duplicateProduct(fd: FormData) {
  await requireAdmin();
  const id = int(fd, "id", 0);
  const p = await prisma.product.findUnique({ where: { id } });
  if (!p) return;
  const copy = await prisma.product.create({
    data: {
      categoryId: p.categoryId,
      name: `${p.name} (복사)`,
      slug: `${p.slug}-copy-${Date.now().toString(36)}`,
      subtitle: p.subtitle,
      thumbnail: p.thumbnail,
      sections: p.sections as object,
      sortOrder: p.sortOrder + 1,
      visible: false,
    },
  });
  redirect(`/admin/products/${copy.id}`);
}
