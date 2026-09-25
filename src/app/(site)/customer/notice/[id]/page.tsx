import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SubLayout } from "@/components/site/SubLayout";
import { HtmlContent } from "@/components/site/HtmlContent";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/data";

export const dynamic = "force-dynamic";

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
  await prisma.notice.update({ where: { id: nid }, data: { views: { increment: 1 } } }).catch(() => {});

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
            <span>VIEWS {notice.views + 1}</span>
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
