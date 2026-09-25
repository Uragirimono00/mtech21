import Link from "next/link";
import type { ReactNode } from "react";
import { getNavData } from "@/lib/nav";

type Crumb = { label: string; href?: string };

type Props = {
  section: "COMPANY" | "PRODUCT" | "CONTACT" | "CUSTOMER";
  /** 좌측(모바일: 상단 칩) 메뉴에서 활성 표시할 href */
  activeHref: string;
  /** 배너에 표시되는 페이지 제목 */
  title: string;
  /** 브레드크럼 (Home 은 자동) */
  crumbs: Crumb[];
  children: ReactNode;
};

/** 서브 페이지 공통 레이아웃: 배너(제목/브레드크럼) + 사이드 메뉴 + 본문 */
export async function SubLayout({ section, activeHref, title, crumbs, children }: Props) {
  const { nav, site } = await getNavData();
  const current = nav.find((n) => n.label === section);
  const items = current?.children ?? [];

  return (
    <>
      <section className="page-banner">
        <img className="page-banner__img" src={site.subVisual} alt="" />
        <div className="container page-banner__inner">
          <nav className="crumbs reveal" aria-label="현재 위치">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            {current ? <Link href={current.href}>{current.label}</Link> : <span>{section}</span>}
            {crumbs.map((c, i) => (
              <span key={i} style={{ display: "contents" }}>
                <span className="sep">/</span>
                {i === crumbs.length - 1 ? <span className="cur">{c.label}</span> : c.href ? <Link href={c.href}>{c.label}</Link> : <span>{c.label}</span>}
              </span>
            ))}
          </nav>
          <h1 className="reveal reveal-2">{title}</h1>
        </div>
      </section>

      <div className="container sub-layout">
        <aside className="sub-nav">
          <div className="sub-nav__title">{section}</div>
          <nav className="sub-nav__list" aria-label={`${section} 메뉴`}>
            {items.map((item) => (
              <Link key={item.href} href={item.href} className={`sub-nav__link${item.href === activeHref ? " is-active" : ""}`}>
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="sub-content">{children}</div>
      </div>
    </>
  );
}
