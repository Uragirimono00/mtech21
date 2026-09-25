import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/site-url";

export const revalidate = 3600;

/** 검색엔진용 사이트맵: 공개 페이지 전체 (DB 기준으로 자동 생성) */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const now = new Date();

  const [categories, products, notices] = await Promise.all([
    prisma.category.findMany({ where: { visible: true }, select: { slug: true, updatedAt: true } }),
    prisma.product.findMany({ where: { visible: true, category: { visible: true } }, select: { slug: true, updatedAt: true, category: { select: { slug: true } } } }),
    prisma.notice.findMany({ select: { id: true, updatedAt: true }, orderBy: { id: "desc" }, take: 500 }),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/company/greeting`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/company/history`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/company/location`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${base}/customer/notice`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${base}/customer/qna`, lastModified: now, changeFrequency: "weekly", priority: 0.4 },
  ];

  return [
    ...staticPages,
    ...categories.map((c) => ({ url: `${base}/product/${c.slug}`, lastModified: c.updatedAt, changeFrequency: "monthly" as const, priority: 0.9 })),
    ...products.map((p) => ({ url: `${base}/product/${p.category.slug}/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...notices.map((n) => ({ url: `${base}/customer/notice/${n.id}`, lastModified: n.updatedAt, changeFrequency: "yearly" as const, priority: 0.4 })),
  ];
}
