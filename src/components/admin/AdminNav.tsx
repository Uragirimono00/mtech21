"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const groups: { title: string; items: { href: string; label: string }[] }[] = [
  {
    title: "제품",
    items: [
      { href: "/admin/categories", label: "제품 카테고리" },
      { href: "/admin/products", label: "제품 관리" },
    ],
  },
  {
    title: "게시판",
    items: [
      { href: "/admin/notices", label: "공지사항" },
      { href: "/admin/qna", label: "질문게시판" },
      { href: "/admin/inquiries", label: "1:1 문의" },
    ],
  },
  {
    title: "회사 / 사이트",
    items: [
      { href: "/admin/settings/company", label: "회사정보·푸터" },
      { href: "/admin/settings/home", label: "메인화면" },
      { href: "/admin/slides", label: "메인 슬라이드" },
      { href: "/admin/settings/greeting", label: "인사말" },
      { href: "/admin/history", label: "연혁" },
      { href: "/admin/settings/location", label: "오시는길" },
      { href: "/admin/settings/pages", label: "페이지 문구·메뉴" },
    ],
  },
  {
    title: "시스템",
    items: [
      { href: "/admin/media", label: "파일 업로드" },
      { href: "/admin/account", label: "계정 설정" },
    ],
  },
];

export function AdminNav({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  if (compact) {
    return (
      <nav className="flex gap-1 overflow-x-auto border-b border-[#e3e5ea] bg-white px-2 py-2 text-xs">
        <Link href="/admin" className={`rounded px-2 py-1 ${pathname === "/admin" ? "bg-[#2f3542] text-white" : "text-gray-600"}`}>
          홈
        </Link>
        {groups.flatMap((g) => g.items).map((it) => (
          <Link key={it.href} href={it.href} className={`whitespace-nowrap rounded px-2 py-1 ${isActive(it.href) ? "bg-[#2f3542] text-white" : "text-gray-600"}`}>
            {it.label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4 text-sm">
      <Link href="/admin" className={`mb-2 block rounded-md px-3 py-2 ${pathname === "/admin" ? "active" : "text-gray-700 hover:bg-gray-100"}`}>
        대시보드
      </Link>
      {groups.map((g) => (
        <div key={g.title} className="mb-4">
          <div className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">{g.title}</div>
          {g.items.map((it) => (
            <Link key={it.href} href={it.href} className={`block rounded-md px-3 py-2 ${isActive(it.href) ? "active" : "text-gray-700 hover:bg-gray-100"}`}>
              {it.label}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
}
