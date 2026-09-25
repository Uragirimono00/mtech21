import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/data";
import { ActionForm } from "@/components/admin/ActionForm";
import { ConfirmForm } from "@/components/admin/ui";
import { answerQna, deleteQna } from "@/app/admin/actions/boards";

export default async function QnaDetailAdminPage({ params }: PageProps<"/admin/qna/[id]">) {
  const { id } = await params;
  const q = await prisma.qna.findUnique({ where: { id: Number(id) || 0 } });
  if (!q) notFound();
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-semibold">질문 답변</h1>
        <div className="flex gap-2">
          <Link href={`/customer/qna/${q.id}`} target="_blank" className="btn sm">
            사이트에서 보기 ↗
          </Link>
          <Link href="/admin/qna" className="btn sm">
            목록
          </Link>
        </div>
      </div>
      <div className="card mb-4">
        <div className="mb-2 text-lg font-semibold">
          {q.isSecret && "🔒 "}
          {q.title}
        </div>
        <div className="mb-3 text-xs text-gray-500">
          {q.author} · {formatDate(q.createdAt)} · 조회 {q.views}
          {q.email && ` · ${q.email}`}
          {q.phone && ` · ${q.phone}`}
        </div>
        <div className="whitespace-pre-line rounded bg-gray-50 p-4 text-sm">{q.content}</div>
      </div>
      <ActionForm action={answerQna} submitLabel="답변 저장" extra={<ConfirmForm action={deleteQna} hidden={{ id: q.id }} buttonClass="btn danger">질문 삭제</ConfirmForm>}>
        <input type="hidden" name="id" value={q.id} />
        <div className="card">
          <div className="field">
            <label>답변 {q.answeredAt && <span className="text-gray-400">(등록: {formatDate(q.answeredAt)})</span>}</label>
            <textarea name="answer" defaultValue={q.answer ?? ""} style={{ minHeight: 180 }} placeholder="답변 내용을 입력하세요. 비우고 저장하면 답변이 삭제됩니다." />
          </div>
        </div>
      </ActionForm>
    </div>
  );
}
