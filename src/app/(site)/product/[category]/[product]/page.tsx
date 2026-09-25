import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SubLayout } from "@/components/site/SubLayout";
import { HtmlContent } from "@/components/site/HtmlContent";
import { getProduct } from "@/lib/data";

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps<"/product/[category]/[product]">): Promise<Metadata> {
  const { category, product } = await params;
  const data = await getProduct(category, product);
  return { title: data ? data.product.name : "제품소개" };
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
