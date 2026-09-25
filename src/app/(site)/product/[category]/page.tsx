import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SubLayout } from "@/components/site/SubLayout";
import { getCategoryBySlug } from "@/lib/data";

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps<"/product/[category]">): Promise<Metadata> {
  const { category } = await params;
  const cat = await getCategoryBySlug(category);
  return { title: cat ? (cat.title || cat.name) : "제품소개" };
}

export default async function CategoryPage({ params }: PageProps<"/product/[category]">) {
  const { category } = await params;
  const cat = await getCategoryBySlug(category);
  if (!cat) notFound();
  const title = cat.title || cat.name;

  return (
    <SubLayout section="PRODUCT" activeHref={`/product/${cat.slug}`} title={title} crumbs={[title]}>
      {/* 제품 리스트 */}
      <div className="business mt25">
        {cat.products.map((p) => (
          <div className="gallery" key={p.id}>
            <Link href={`/product/${cat.slug}/${p.slug}`}>
              <img src={p.thumbnail || "/images/design/bullet.jpg"} alt={p.name} />
            </Link>
            <div className="desc">{p.name}</div>
          </div>
        ))}
      </div>

      {(cat.engTitle || cat.intro || cat.sections.length > 0) && (
        <>
          <img className="bullet" src="/images/design/bullet.jpg" alt="" />
          {cat.engTitle && <div className="title1">{cat.engTitle}</div>}
          {cat.intro && <div className="title4 mt10 pre">{cat.intro}</div>}
          {cat.sections.map((s, i) => (
            <div key={i}>
              <div className="border1 tb25" />
              <div className={i === 0 ? "business mt25" : "business"}>
                <div className="txt1">
                  <div className="title2">
                    <span className="point_color">{s.title}</span>
                  </div>
                  <div className="title4 mt10 pre">{s.body}</div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </SubLayout>
  );
}
