import Link from "next/link";
import type { ReactNode } from "react";
import { getNavData, SECTION_TITLES } from "@/lib/nav";

type Props = {
  /** 상단 메뉴 구분 (COMPANY / PRODUCT / CONTACT / CUSTOMER) */
  section: "COMPANY" | "PRODUCT" | "CONTACT" | "CUSTOMER";
  /** 좌측 메뉴에서 활성 표시할 href */
  activeHref: string;
  /** 페이지 제목 (title2) */
  title: string;
  /** 브레드크럼: Home > ... > 마지막 항목은 강조 */
  crumbs: string[];
  /** 컨텐츠 영역 래퍼 클래스 (기본 lr10) */
  innerClass?: string;
  children: ReactNode;
};

/** 서브 페이지 공통 레이아웃: 상단 비주얼 + 좌측 메뉴 + 본문 */
export async function SubLayout({ section, activeHref, title, crumbs, innerClass = "lr10", children }: Props) {
  const { nav, site } = await getNavData();
  const current = nav.find((n) => n.label === section);
  const items = current?.children ?? [];
  const sectionLabel = section.charAt(0) + section.slice(1).toLowerCase();

  return (
    <div id="wrap">
      <div className="pb30 visual">
        <img src={site.subVisual} alt="" />
      </div>
      <div id="secondmenu">
        <div className="leftmenu">
          <h1 title={SECTION_TITLES[section]}>{section}</h1>
          <dl>
            {items.map((item) => (
              <dt key={item.href}>
                <Link href={item.href} className={item.href === activeHref ? "on" : undefined}>
                  {item.label}
                </Link>
              </dt>
            ))}
          </dl>
        </div>
      </div>
      <div className="sub_main">
        <div className={innerClass}>
          <div className="title2">{title}</div>
          <div className="location">
            Home &gt; {sectionLabel} &gt;{" "}
            {crumbs.slice(0, -1).map((c) => (
              <span key={c}>{c} &gt; </span>
            ))}
            <span className="page">{crumbs[crumbs.length - 1]}</span>
          </div>
          {children}
        </div>
      </div>
      <div className="clear" />
    </div>
  );
}
