import "server-only";
import { cache } from "react";
import { getVisibleCategories } from "./data";
import { getSettings } from "./settings";

export type NavItem = { label: string; href: string; children: { label: string; href: string }[] };

/** 상단 GNB / 모바일 메뉴 / 서브 좌측 메뉴 공용 데이터 (요청당 1회 캐시) */
export const getNavData = cache(async () => {
  const [categories, settings] = await Promise.all([
    getVisibleCategories(),
    getSettings(["site", "company", "menu"]),
  ]);

  const nav: NavItem[] = [
    {
      label: "COMPANY",
      href: "/company/greeting",
      children: [
        { label: "인사말", href: "/company/greeting" },
        { label: "연혁", href: "/company/history" },
        { label: "오시는길", href: "/company/location" },
      ],
    },
    {
      label: "PRODUCT",
      href: categories[0] ? `/product/${categories[0].slug}` : "/product",
      children: categories.map((c) => ({ label: c.name, href: `/product/${c.slug}` })),
    },
    {
      label: "CONTACT",
      href: "/contact",
      children: [{ label: "1:1문의", href: "/contact" }],
    },
    {
      label: "CUSTOMER",
      href: "/customer/notice",
      children: [
        { label: "공지사항", href: "/customer/notice" },
        ...(settings.menu.showQna ? [{ label: "질문게시판", href: "/customer/qna" }] : []),
      ],
    },
  ];

  return { nav, categories, site: settings.site, company: settings.company, menu: settings.menu };
});

export const SECTION_TITLES: Record<string, string> = {
  COMPANY: "회사소개",
  PRODUCT: "제품소개",
  CONTACT: "고객문의",
  CUSTOMER: "고객센터",
};
