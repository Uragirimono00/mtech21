import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SubLayout } from "@/components/site/SubLayout";
import { HtmlContent } from "@/components/site/HtmlContent";
import { getProduct } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

/** 빌드 시 모든 제품 상세 페이지를 미리 생성 (이후 신규 제품은 첫 요청 때 생성 후 캐시) */
export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    where: { visible: true, category: { visible: true } },
    select: { slug: true, category: { select: { slug: true } } },
  });
  return products.map((p) => ({ category: p.category.slug, product: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/product/[category]/[product]">): Promise<Metadata> {
  const { category, product } = await params;
  const data = await getProduct(category, product);
  if (!data) return { title: "제품소개" };
  const catTitle = data.category.title || data.category.name;
  const sub = (data.product.subtitle ?? "").replace(/\s+/g, " ").trim();
  const description = `${data.product.name} - 엠테크 ${catTitle}${data.category.engTitle ? ` (${data.category.engTitle})` : ""}${sub ? `. ${sub}` : ""}. 사양, 치수, 모델 선택 가이드 및 카탈로그 제공.`;
  const path = `/product/${data.category.slug}/${data.product.slug}`;
  return {
    title: `${data.product.name} ${catTitle}`,
    description: description.slice(0, 200),
    alternates: { canonical: path },
    openGraph: { title: `${data.product.name} | 엠테크 ${catTitle}`, description: description.slice(0, 200), url: path, ...(data.product.thumbnail ? { images: [data.product.thumbnail] } : {}) },
  };
}

export default async function ProductPage({ params }: PageProps<"/product/[category]/[product]">) {
  const { category, product } = await params;
  const data = await getProduct(category, product);
  if (!data) notFound();
  const cat = data.category;
  const p = data.product;
  const catTitle = cat.title || cat.name;

  return (
    <SubLayout
      section="PRODUCT"
      activeHref={`/product/${cat.slug}`}
      title={p.name}
      crumbs={[{ label: catTitle, href: `/product/${cat.slug}` }, { label: p.name }]}
    >
      <div className="product-head">
        <span className="tag tag--accent tag--mono">{catTitle}</span>
        <h1>{p.name}</h1>
        {p.subtitle && <p className="product-head__sub">{p.subtitle}</p>}
      </div>
      {p.sections.map((s, i) => (
        <section className="product-section" key={i}>
          {s.title && (
            <div className="product-section__head">
              <span className="idx">{String(i + 1).padStart(2, "0")}</span>
              <h2>{s.title}</h2>
            </div>
          )}
          <HtmlContent html={s.html} />
        </section>
      ))}
    </SubLayout>
  );
}
