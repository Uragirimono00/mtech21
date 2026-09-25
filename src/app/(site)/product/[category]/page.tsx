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
  const hasAbout = Boolean(cat.engTitle || cat.intro || cat.sections.length > 0);

  return (
    <SubLayout section="PRODUCT" activeHref={`/product/${cat.slug}`} title={title} crumbs={[{ label: title }]}>
      <div className="section-head" style={{ marginBottom: 20 }}>
        <div>
          <span className="eyebrow">Line-up</span>
          <h2 style={{ fontSize: 22, marginTop: 8 }}>{title} 제품</h2>
        </div>
        <span className="tag tag--soft tag--mono">{cat.products.length} models</span>
      </div>

      {cat.products.length === 0 ? (
        <div className="product-empty">등록된 제품이 없습니다.</div>
      ) : (
        <div className="product-grid">
          {cat.products.map((p) => (
            <Link key={p.id} href={`/product/${cat.slug}/${p.slug}`} className="product-card">
              <div className="product-card__thumb">{p.thumbnail ? <img src={p.thumbnail} alt={p.name} loading="lazy" /> : null}</div>
              <div className="product-card__body">
                <div className="product-card__name">{p.name}</div>
                <div className="product-card__cta">View detail →</div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {hasAbout && (
        <div className="about">
          <div className="intro">
            <span className="eyebrow">About</span>
            {cat.engTitle && <h2 style={{ marginTop: 10 }}>{cat.engTitle}</h2>}
            {cat.intro && (
              <p className="prose prose--lg" style={{ marginTop: 16 }}>
                {cat.intro}
              </p>
            )}
          </div>
          {cat.sections.length > 0 && (
            <div className="info-list">
              {cat.sections.map((s, i) => (
                <div className="info-block" key={i}>
                  <div className="info-block__label">
                    <span className="idx">{String(i + 1).padStart(2, "0")}</span>
                    <h3>{s.title}</h3>
                  </div>
                  <div className="info-block__body">{s.body}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </SubLayout>
  );
}
