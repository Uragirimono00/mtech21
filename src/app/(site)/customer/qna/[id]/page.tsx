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
    <SubLayout section="CUSTOMER" activeHref="/customer/qna" title="질문게시판" crumbs={[{ label: "질문게시판", href: "/customer/qna" }, { label: q.isSecret ? "비밀글" : q.title }]}>
      <article className="post">
        <div className="post__head">
          <h2>
            {q.isSecret && <span aria-label="비밀글">🔒</span>}
            {q.title}
            {q.answeredAt ? <span className="tag tag--accent">답변완료</span> : <span className="tag tag--wait">답변대기</span>}
          </h2>
          <div className="post__meta">
            <span>{q.author}</span>
            <span>{formatDate(q.createdAt)}</span>
            <span>VIEWS {q.views + (q.isSecret ? 0 : 1)}</span>
          </div>
        </div>
        {q.isSecret ? (
          <QnaSecretView id={q.id} initialAnswer={q.answer} />
        ) : (
          <>
            <div className="post__body">{q.content}</div>
            {q.answer && (
              <div className="answer">
                <div className="answer__label">Answer {q.answeredAt && `· ${formatDate(q.answeredAt)}`}</div>
                <div className="answer__body">{q.answer}</div>
              </div>
            )}
          </>
        )}
        <div className="post__actions">
          <Link href="/customer/qna" className="btn btn--ghost">
            목록으로
          </Link>
          <QnaDeleteForm id={q.id} />
        </div>
      </article>
    </SubLayout>
  );
}
