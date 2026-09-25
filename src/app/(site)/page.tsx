import Link from "next/link";
import { Slider } from "@/components/site/Slider";
import { getCategoryCards, getRecentNotices, getSlides, formatDate } from "@/lib/data";
import { getSettings } from "@/lib/settings";
import { siteUrl } from "@/lib/site-url";

export const revalidate = 3600;

export default async function HomePage() {
  const [slides, { home, company, site }, notices, cats] = await Promise.all([getSlides(), getSettings(["home", "company", "site"]), getRecentNotices(5), getCategoryCards()]);
  const cc = home.customerCenter;
  const tel = (cc.tel || cc.phone).replace(/[^0-9+]/g, "");
  const base = siteUrl();

  // 검색엔진용 구조화 데이터 (회사 정보)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    alternateName: company.nameEn,
    url: base,
    logo: site.logo.startsWith("http") ? site.logo : `${base}${site.logo}`,
    email: company.email,
    telephone: company.phone.replace(/\s/g, ""),
    address: { "@type": "PostalAddress", streetAddress: company.address, addressCountry: "KR" },
    foundingDate: "1995",
    description: site.description,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Slider slides={slides} />

      <div className="strip" aria-hidden="true">
        <div className="container strip__inner">
          <span>Since 1995</span>
          <span>Flow Measurement &amp; Instrumentation</span>
          <span>Electronic Control Industry</span>
          <span>M-Meter</span>
        </div>
      </div>

      {/* 추천 배너 + 고객센터 */}
      <section className="section">
        <div className="container top-grid">
          <Link href={home.banner.link || "/product"} className="banner-card reveal">
            <span className="tag tag--accent tag--mono banner-card__tag">Featured</span>
            <img src={home.banner.image} alt="" />
            <span className="btn btn--dark btn--sm banner-card__cta">
              자세히 보기 <span className="arrow">→</span>
            </span>
          </Link>
          <div className="cc-card reveal reveal-2">
            <span className="eyebrow">Customer Center</span>
            <div className="cc-card__title">{cc.title}</div>
            <a href={`tel:${tel}`} className="cc-card__phone">
              {cc.phone}
            </a>
            <div className="cc-card__hours">{cc.hours}</div>
            <div className="cc-card__actions">
              {cc.buttons.map((b, i) => (
                <Link key={i} href={b.link} className={`btn btn--sm ${i === 0 ? "btn--light" : "btn--outline-light"}`}>
                  {b.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 제품 카테고리 */}
      {cats.length > 0 && (
        <section className="section section--tint">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="eyebrow">Products</span>
                <h2>제품 소개</h2>
                <p>유량계부터 신호변환기·지시계·피뢰기까지, 현장에 맞는 계측 제품을 공급합니다.</p>
              </div>
              <Link href="/product" className="link-more">
                전체 제품 <span className="arrow">→</span>
              </Link>
            </div>
            <div className="cat-grid">
              {cats.map((c, i) => (
                <Link key={c.slug} href={`/product/${c.slug}`} className="cat-card">
                  <div className="cat-card__thumb">{c.thumb ? <img src={c.thumb} alt="" loading="lazy" /> : <span className="ph">—</span>}</div>
                  <span className="cat-card__idx">{String(i + 1).padStart(2, "0")}</span>
                  <span className="cat-card__name">{c.name}</span>
                  <span className="cat-card__meta">
                    {c.title && c.title !== c.name ? c.title : c.count > 0 ? `${c.count}개 제품` : "제품 안내"}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 소개 카드 + 뉴스 */}
      <section className="section">
        <div className="container tri-grid">
          {home.cards.map((card, i) => (
            <Link href={card.link || "/product"} className="feature-card" key={i}>
              <div className="feature-card__title">{card.title}</div>
              <div className="feature-card__sub">{card.subtitle}</div>
              <span className="feature-card__arrow">→</span>
              {card.image && (
                <div className="feature-card__img">
                  <img src={card.image} alt="" loading="lazy" />
                </div>
              )}
            </Link>
          ))}
          <div className="news-card">
            <div className="news-card__head">
              <h3>{home.newsTitle}</h3>
              <Link href="/customer/notice" className="link-more">
                더보기 <span className="arrow">→</span>
              </Link>
            </div>
            {notices.length === 0 ? (
              <div className="news-empty">등록된 소식이 없습니다.</div>
            ) : (
              <ul className="news-list">
                {notices.map((n) => (
                  <li key={n.id}>
                    <Link href={`/customer/notice/${n.id}`}>
                      <span className="title">{n.title}</span>
                      <time dateTime={n.createdAt.toISOString()}>{formatDate(n.createdAt)}</time>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
