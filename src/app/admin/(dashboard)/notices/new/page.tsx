import { NoticeForm } from "@/components/admin/NoticeForm";

export default function NewNoticePage() {
  return (
    <div>
      <h1 className="mb-5 text-xl font-semibold">공지사항 작성</h1>
      <NoticeForm />
    </div>
  );
}
