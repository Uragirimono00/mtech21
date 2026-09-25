import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/data";
import { ConfirmForm } from "@/components/admin/ui";
import { Flash } from "@/components/admin/Flash";
import { deleteInquiry, toggleInquiryRead } from "@/app/admin/actions/boards";

export default async function InquiriesAdminPage({ searchParams }: PageProps<"/admin/inquiries">) {
  const sp = await searchParams;
  const items = await prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="mb-5 text-xl font-semibold">1:1 문의</h1>
      <Flash sp={sp} />
      <div className="card" style={{ padding: 0 }}>
        <table className="list">
          <thead>
            <tr>
              <th style={{ width: 80 }}>상태</th>
              <th style={{ width: 110 }}>이름</th>
              <th style={{ width: 130 }}>연락처</th>
              <th>내용</th>
              <th style={{ width: 110 }}>접수일</th>
              <th style={{ width: 170 }}></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500">
                  접수된 문의가 없습니다.
                </td>
              </tr>
            )}
            {items.map((q) => (
              <tr key={q.id} className={q.isRead ? "" : "font-semibold"}>
                <td>{q.isRead ? <span className="badge">확인</span> : <span className="badge new">NEW</span>}</td>
                <td>
                  <Link href={`/admin/inquiries/${q.id}`}>{q.name}</Link>
                </td>
                <td className="text-gray-600">{q.phone || q.email || "-"}</td>
                <td className="max-w-[360px] truncate font-normal text-gray-600">
                  <Link href={`/admin/inquiries/${q.id}`}>{q.content}</Link>
                </td>
                <td className="font-normal">{formatDate(q.createdAt)}</td>
                <td className="text-right font-normal">
                  <Link href={`/admin/inquiries/${q.id}`} className="btn sm">
                    보기
                  </Link>{" "}
                  <form action={toggleInquiryRead} className="inline">
                    <input type="hidden" name="id" value={q.id} />
                    <button className="btn sm">{q.isRead ? "미확인" : "확인"}</button>
                  </form>{" "}
                  <ConfirmForm action={deleteInquiry} hidden={{ id: q.id }}>
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
