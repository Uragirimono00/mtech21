import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/data";
import { ActionForm } from "@/components/admin/ActionForm";
import { ConfirmForm } from "@/components/admin/ui";
import { updateInquiry, deleteInquiry } from "@/app/admin/actions/boards";

export default async function InquiryDetailPage({ params }: PageProps<"/admin/inquiries/[id]">) {
  const { id } = await params;
  const q = await prisma.inquiry.findUnique({ where: { id: Number(id) || 0 } });
  if (!q) notFound();
  if (!q.isRead) await prisma.inquiry.update({ where: { id: q.id }, data: { isRead: true } });

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-semibold">문의 상세</h1>
        <Link href="/admin/inquiries" className="btn sm">
          목록
        </Link>
      </div>
      <div className="card mb-4">
        <table className="w-full text-sm">
          <tbody>
            <tr>
              <th className="w-28 py-2 text-left text-gray-500">이름</th>
              <td className="py-2">{q.name}</td>
            </tr>
            <tr>
              <th className="py-2 text-left text-gray-500">연락처</th>
              <td className="py-2">{q.phone ? <a href={`tel:${q.phone}`}>{q.phone}</a> : "-"}</td>
            </tr>
            <tr>
              <th className="py-2 text-left text-gray-500">이메일</th>
              <td className="py-2">{q.email ? <a href={`mailto:${q.email}`} className="underline">{q.email}</a> : "-"}</td>
            </tr>
            <tr>
              <th className="py-2 text-left text-gray-500">주소</th>
              <td className="py-2">{q.address || "-"}</td>
            </tr>
            <tr>
              <th className="py-2 text-left text-gray-500">접수일</th>
              <td className="py-2">{formatDate(q.createdAt)} {q.createdAt.toLocaleTimeString("ko-KR")}</td>
            </tr>
            <tr>
              <th className="py-2 align-top text-left text-gray-500">내용</th>
              <td className="whitespace-pre-line py-2">{q.content}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <ActionForm action={updateInquiry} submitLabel="메모 저장" extra={<ConfirmForm action={deleteInquiry} hidden={{ id: q.id }} buttonClass="btn danger">문의 삭제</ConfirmForm>}>
        <input type="hidden" name="id" value={q.id} />
        <div className="card">
          <div className="field">
            <label>처리 메모 (내부용)</label>
            <textarea name="memo" defaultValue={q.memo ?? ""} placeholder="예: 9/25 전화 답변 완료" />
          </div>
          <div className="field">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="isRead" defaultChecked style={{ width: "auto" }} /> 확인 처리
            </label>
          </div>
        </div>
      </ActionForm>
    </div>
  );
}
