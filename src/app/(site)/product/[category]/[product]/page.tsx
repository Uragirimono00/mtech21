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
    <SubLayout section="PRODUCT" activeHref={`/product/${cat.slug}`} title={catTitle} crumbs={[catTitle, p.name]}>
      <div className="title1">{p.name}</div>
      {p.subtitle && <div className="title4 mt10 pre">{p.subtitle}</div>}
      {p.sections.map((s, i) => (
        <div key={i}>
          {i > 0 && <div className="border1 tb25" />}
          <div className="business mt25">
            <div className="txt1">
              {s.title && (
                <div className="title2">
                  <span className="point_color">{s.title}</span>
                </div>
              )}
              <img className="bullet" src="/images/design/bullet.jpg" alt="" />
              <HtmlContent html={s.html} />
            </div>
          </div>
        </div>
      ))}
    </SubLayout>
  );
}
