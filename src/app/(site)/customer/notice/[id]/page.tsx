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
    <SubLayout section="CUSTOMER" activeHref="/customer/notice" title="공지사항" crumbs={["공지사항"]}>
      <div className="table_02">
        <table className="board">
          <tbody>
            <tr>
              <td className="board_bgcolor">
                <span>제목</span>
              </td>
              <td>
                {notice.pinned && <b className="notice_subject">[공지] </b>}
                {notice.title}
              </td>
            </tr>
            <tr>
              <td className="board_bgcolor">
                <span>작성자</span>
              </td>
              <td>
                {notice.author} &nbsp;|&nbsp; 작성일 {formatDate(notice.createdAt)} &nbsp;|&nbsp; 조회 {notice.views + 1}
              </td>
            </tr>
            <tr>
              <td colSpan={2} style={{ padding: 0 }}>
                <HtmlContent html={notice.content} className="board_view_content" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="table_02" style={{ borderTop: 0, marginTop: 10 }}>
        <table className="board">
          <tbody>
            <tr>
              <td className="board_bgcolor">
                <span>다음글</span>
              </td>
              <td>{next ? <Link href={`/customer/notice/${next.id}`}>{next.title}</Link> : "다음글이 없습니다."}</td>
            </tr>
            <tr>
              <td className="board_bgcolor">
                <span>이전글</span>
              </td>
              <td>{prev ? <Link href={`/customer/notice/${prev.id}`}>{prev.title}</Link> : "이전글이 없습니다."}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="board_btns">
        <Link href="/customer/notice" className="list">
          목록
        </Link>
      </div>
    </SubLayout>
  );
}
