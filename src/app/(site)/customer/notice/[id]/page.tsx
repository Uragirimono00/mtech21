import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SubLayout } from "@/components/site/SubLayout";
import { HtmlContent } from "@/components/site/HtmlContent";
import { ViewCounter } from "@/components/site/ViewCounter";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/data";

// 정적 생성 + 캐시 (관리자 수정 시 갱신). 조회수는 클라이언트에서 집계
export const revalidate = 3600;

export async function generateStaticParams() {
  const rows = await prisma.notice.findMany({ select: { id: true }, orderBy: { id: "desc" }, take: 100 });
  return rows.map((r) => ({ id: String(r.id) }));
}

export async function generateMetadata({ params }: PageProps<"/customer/notice/[id]">): Promise<Metadata> {
  const { id } = await params;
  const n = await prisma.notice.findUnique({ where: { id: Number(id) || 0 }, select: { title: true } });
  return { title: n ? n.title : "공지사항" };
}

export default async function NoticeViewPage({ params }: PageProps<"/customer/notice/[id]">) {
  const { id } = await params;
  const nid = Number(id);
  if (!Number.isInteger(nid)) notFound();
  const notice = await prisma.notice.findUnique({ where: { id: nid } });
  if (!notice) notFound();

  const [prev, next] = await Promise.all([
    prisma.notice.findFirst({ where: { id: { lt: nid } }, orderBy: { id: "desc" }, select: { id: true, title: true } }),
    prisma.notice.findFirst({ where: { id: { gt: nid } }, orderBy: { id: "asc" }, select: { id: true, title: true } }),
  ]);

  return (
    <SubLayout section="CUSTOMER" activeHref="/customer/notice" title="공지사항" crumbs={[{ label: "공지사항", href: "/customer/notice" }, { label: notice.title }]}>
      <article className="post">
        <div className="post__head">
          <h2>
            {notice.pinned && <span className="tag tag--ink">공지</span>}
            {notice.title}
          </h2>
          <div className="post__meta">
            <span>{notice.author}</span>
            <span>{formatDate(notice.createdAt)}</span>
            <ViewCounter type="notice" id={notice.id} initial={notice.views} />
          </div>
        </div>
        <HtmlContent html={notice.content} className="post__body" />
        <div className="post__nav">
          <div>
            <span className="k">Next</span>
            {next ? (
              <Link href={`/customer/notice/${next.id}`} className="t">
                {next.title}
              </Link>
            ) : (
              <span className="none">다음글이 없습니다.</span>
            )}
          </div>
          <div>
            <span className="k">Prev</span>
            {prev ? (
              <Link href={`/customer/notice/${prev.id}`} className="t">
                {prev.title}
              </Link>
            ) : (
              <span className="none">이전글이 없습니다.</span>
            )}
          </div>
        </div>
        <div className="post__actions">
          <Link href="/customer/notice" className="btn btn--ghost">
            목록으로
          </Link>
        </div>
      </article>
    </SubLayout>
  );
}
