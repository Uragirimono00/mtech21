import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/data";
import { ConfirmForm } from "@/components/admin/ui";
import { Flash } from "@/components/admin/Flash";
import { deleteQna } from "@/app/admin/actions/boards";

export default async function QnaAdminPage({ searchParams }: PageProps<"/admin/qna">) {
  const sp = await searchParams;
  const items = await prisma.qna.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="mb-5 text-xl font-semibold">질문게시판</h1>
      <Flash sp={sp} />
      <div className="card" style={{ padding: 0 }}>
        <table className="list">
          <thead>
            <tr>
              <th style={{ width: 90 }}>상태</th>
              <th>제목</th>
              <th style={{ width: 120 }}>작성자</th>
              <th style={{ width: 110 }}>작성일</th>
              <th style={{ width: 140 }}></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  등록된 질문이 없습니다.
                </td>
              </tr>
            )}
            {items.map((q) => (
              <tr key={q.id}>
                <td>{q.answeredAt ? <span className="badge on">답변완료</span> : <span className="badge new">대기</span>}</td>
                <td>
                  <Link href={`/admin/qna/${q.id}`} className="font-medium">
                    {q.isSecret && "🔒 "}
                    {q.title}
                  </Link>
                </td>
                <td>{q.author}</td>
                <td>{formatDate(q.createdAt)}</td>
                <td className="text-right">
                  <Link href={`/admin/qna/${q.id}`} className="btn sm">
                    답변
                  </Link>{" "}
                  <ConfirmForm action={deleteQna} hidden={{ id: q.id }}>
                    삭제
                  </ConfirmForm>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
