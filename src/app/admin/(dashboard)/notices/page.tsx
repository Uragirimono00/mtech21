import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/data";
import { ConfirmForm } from "@/components/admin/ui";
import { Flash } from "@/components/admin/Flash";
import { deleteNotice } from "@/app/admin/actions/boards";

export default async function NoticesAdminPage({ searchParams }: PageProps<"/admin/notices">) {
  const sp = await searchParams;
  const notices = await prisma.notice.findMany({ orderBy: [{ pinned: "desc" }, { createdAt: "desc" }] });
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-semibold">공지사항</h1>
        <Link href="/admin/notices/new" className="btn primary">
          + 글쓰기
        </Link>
      </div>
      <Flash sp={sp} />
      <div className="card" style={{ padding: 0 }}>
        <table className="list">
          <thead>
            <tr>
              <th style={{ width: 60 }}>번호</th>
              <th>제목</th>
              <th style={{ width: 100 }}>작성자</th>
              <th style={{ width: 70 }}>조회</th>
              <th style={{ width: 110 }}>작성일</th>
              <th style={{ width: 140 }}></th>
            </tr>
          </thead>
          <tbody>
            {notices.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500">
                  등록된 공지사항이 없습니다.
                </td>
              </tr>
            )}
            {notices.map((n) => (
              <tr key={n.id}>
                <td>{n.pinned ? <span className="badge">공지</span> : n.id}</td>
                <td>
                  <Link href={`/admin/notices/${n.id}`} className="font-medium">
                    {n.title}
                  </Link>
                </td>
                <td>{n.author}</td>
                <td>{n.views}</td>
                <td>{formatDate(n.createdAt)}</td>
                <td className="text-right">
                  <Link href={`/admin/notices/${n.id}`} className="btn sm">
                    수정
                  </Link>{" "}
                  <ConfirmForm action={deleteNotice} hidden={{ id: n.id }}>
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
