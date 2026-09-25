import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SubLayout } from "@/components/site/SubLayout";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/data";
import { QnaSecretView, QnaDeleteForm } from "../QnaClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/customer/qna/[id]">): Promise<Metadata> {
  const { id } = await params;
  const q = await prisma.qna.findUnique({ where: { id: Number(id) || 0 }, select: { title: true, isSecret: true } });
  return { title: q ? (q.isSecret ? "비밀글" : q.title) : "질문게시판" };
}

export default async function QnaViewPage({ params }: PageProps<"/customer/qna/[id]">) {
  const { id } = await params;
  const qid = Number(id);
  if (!Number.isInteger(qid)) notFound();
  const q = await prisma.qna.findUnique({ where: { id: qid } });
  if (!q) notFound();
  if (!q.isSecret) await prisma.qna.update({ where: { id: qid }, data: { views: { increment: 1 } } }).catch(() => {});

  return (
    <SubLayout section="CUSTOMER" activeHref="/customer/qna" title="질문게시판" crumbs={["질문게시판"]}>
      <div className="table_02">
        <table className="board">
          <tbody>
            <tr>
              <td className="board_bgcolor">
                <span>제목</span>
              </td>
              <td>
                {q.title}
                {q.isSecret && <span className="badge_lock">🔒</span>}
                {q.answeredAt ? <span className="badge_done">답변완료</span> : <span className="badge_wait">답변대기</span>}
              </td>
            </tr>
            <tr>
              <td className="board_bgcolor">
                <span>작성자</span>
              </td>
              <td>
                {q.author} &nbsp;|&nbsp; 작성일 {formatDate(q.createdAt)} &nbsp;|&nbsp; 조회 {q.views + (q.isSecret ? 0 : 1)}
              </td>
            </tr>
            <tr>
              <td colSpan={2} style={{ padding: 0 }}>
                {q.isSecret ? (
                  <QnaSecretView id={q.id} initialAnswer={q.answer} />
                ) : (
                  <>
                    <div className="board_view_content pre">{q.content}</div>
                    {q.answer && (
                      <div className="board_answer">
                        <span className="label">답변 {q.answeredAt && `(${formatDate(q.answeredAt)})`}</span>
                        <div className="pre">{q.answer}</div>
                      </div>
                    )}
                  </>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="board_btns">
        <Link href="/customer/qna" className="list">
          목록
        </Link>
        <QnaDeleteForm id={q.id} />
      </div>
    </SubLayout>
  );
}
