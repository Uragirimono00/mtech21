import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/data";

export default async function AdminDashboard() {
  const [categories, products, notices, qna, qnaWaiting, inquiries, inquiriesUnread, recentInquiries, recentQna] = await Promise.all([
    prisma.category.count(),
    prisma.product.count(),
    prisma.notice.count(),
    prisma.qna.count(),
    prisma.qna.count({ where: { answeredAt: null } }),
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { isRead: false } }),
    prisma.inquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.qna.findMany({ where: { answeredAt: null }, orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const stats = [
    { label: "제품 카테고리", value: categories, href: "/admin/categories" },
    { label: "제품", value: products, href: "/admin/products" },
    { label: "공지사항", value: notices, href: "/admin/notices" },
    { label: "질문게시판 (미답변)", value: `${qna} (${qnaWaiting})`, href: "/admin/qna" },
    { label: "1:1 문의 (미확인)", value: `${inquiries} (${inquiriesUnread})`, href: "/admin/inquiries" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">대시보드</h1>
      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-5">
        {stats.map((s) => (
          <Link href={s.href} key={s.label} className="card hover:border-[#b3917c]">
            <div className="text-xs text-gray-500">{s.label}</div>
            <div className="mt-1 text-2xl font-semibold">{s.value}</div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">최근 1:1 문의</h2>
            <Link href="/admin/inquiries" className="text-xs text-gray-500">
              전체보기 →
            </Link>
          </div>
          {recentInquiries.length === 0 && <div className="text-sm text-gray-500">접수된 문의가 없습니다.</div>}
          <ul className="divide-y divide-gray-100 text-sm">
            {recentInquiries.map((q) => (
              <li key={q.id} className="flex items-center justify-between py-2">
                <Link href={`/admin/inquiries/${q.id}`} className={q.isRead ? "text-gray-600" : "font-semibold"}>
                  {!q.isRead && <span className="badge new mr-2">NEW</span>}
                  {q.name} — {q.content.slice(0, 40)}
                  {q.content.length > 40 && "…"}
                </Link>
                <span className="text-xs text-gray-400">{formatDate(q.createdAt)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">답변 대기 질문</h2>
            <Link href="/admin/qna" className="text-xs text-gray-500">
              전체보기 →
            </Link>
          </div>
          {recentQna.length === 0 && <div className="text-sm text-gray-500">답변 대기 중인 질문이 없습니다.</div>}
          <ul className="divide-y divide-gray-100 text-sm">
            {recentQna.map((q) => (
              <li key={q.id} className="flex items-center justify-between py-2">
                <Link href={`/admin/qna/${q.id}`} className="font-medium">
                  {q.isSecret && "🔒 "}
                  {q.title} <span className="text-gray-400">({q.author})</span>
                </Link>
                <span className="text-xs text-gray-400">{formatDate(q.createdAt)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card mt-6 text-sm text-gray-600">
        <h2 className="mb-2 font-semibold text-gray-800">사용 안내</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>제품 페이지는 <b>제품 카테고리</b>(메뉴) → <b>제품</b>(상세 페이지) 구조입니다. 제품 상세의 각 섹션은 HTML로 편집하며 미리보기를 제공합니다.</li>
          <li>메인 화면의 슬라이드·배너·고객센터 문구는 <b>메인화면 / 메인 슬라이드</b>에서, 회사 정보와 푸터는 <b>회사정보·푸터</b>에서 수정합니다.</li>
          <li>저장 즉시 공개 사이트에 반영됩니다. (최대 몇 초 지연)</li>
        </ul>
      </div>
    </div>
  );
}
