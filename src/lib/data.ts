import "server-only";
import { prisma } from "./prisma";
import type { CategorySection, ProductSection } from "./types";

export async function getVisibleCategories() {
  return prisma.category.findMany({
    where: { visible: true },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    select: { id: true, slug: true, name: true, title: true },
  });
}

export async function getCategoryBySlug(slug: string) {
  const cat = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: { visible: true },
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        select: { id: true, slug: true, name: true, thumbnail: true },
      },
    },
  });
  if (!cat || !cat.visible) return null;
  return { ...cat, sections: (cat.sections as CategorySection[]) ?? [] };
}

export async function getProduct(categorySlug: string, productSlug: string) {
  const cat = await prisma.category.findUnique({ where: { slug: categorySlug } });
  if (!cat || !cat.visible) return null;
  const product = await prisma.product.findUnique({
    where: { categoryId_slug: { categoryId: cat.id, slug: productSlug } },
  });
  if (!product || !product.visible) return null;
  return { category: cat, product: { ...product, sections: (product.sections as ProductSection[]) ?? [] } };
}

export async function getHistory() {
  return prisma.history.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
}

export async function getSlides() {
  return prisma.slide.findMany({ where: { visible: true }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
}

export async function getRecentNotices(take = 5) {
  return prisma.notice.findMany({
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    take,
    select: { id: true, title: true, createdAt: true },
  });
}

export const PAGE_SIZE = 15;

export async function getNoticePage(page: number, search?: { field: string; value: string }) {
  const where =
    search && search.value
      ? search.field === "writer"
        ? { author: { contains: search.value } }
        : search.field === "description"
          ? { content: { contains: search.value } }
          : { title: { contains: search.value } }
      : {};
  const [total, items] = await Promise.all([
    prisma.notice.count({ where }),
    prisma.notice.findMany({
      where,
      orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);
  return { total, items, page, pages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function getQnaPage(page: number, search?: { field: string; value: string }) {
  const where =
    search && search.value
      ? search.field === "writer"
        ? { author: { contains: search.value } }
        : search.field === "description"
          ? { content: { contains: search.value } }
          : { title: { contains: search.value } }
      : {};
  const [total, items] = await Promise.all([
    prisma.qna.count({ where }),
    prisma.qna.findMany({
      where,
      orderBy: [{ createdAt: "desc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        title: true,
        author: true,
        createdAt: true,
        isSecret: true,
        answeredAt: true,
        views: true,
      },
    }),
  ]);
  return { total, items, page, pages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export function formatDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
