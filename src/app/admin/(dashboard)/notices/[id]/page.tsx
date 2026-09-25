import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { NoticeForm } from "@/components/admin/NoticeForm";

export default async function EditNoticePage({ params }: PageProps<"/admin/notices/[id]">) {
  const { id } = await params;
  const notice = await prisma.notice.findUnique({ where: { id: Number(id) || 0 } });
  if (!notice) notFound();
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-semibold">공지사항 수정</h1>
        <Link href={`/customer/notice/${notice.id}`} target="_blank" className="btn sm">
          사이트에서 보기 ↗
        </Link>
      </div>
      <NoticeForm notice={notice} />
    </div>
  );
}
