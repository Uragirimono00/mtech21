import Link from "next/link";
import { ActionForm } from "./ActionForm";
import { HtmlEditor } from "./HtmlEditor";
import { saveNotice } from "@/app/admin/actions/boards";

export function NoticeForm({ notice }: { notice?: { id: number; title: string; content: string; author: string; pinned: boolean } }) {
  const n = notice;
  return (
    <ActionForm action={saveNotice} extra={<Link href="/admin/notices" className="btn">취소</Link>}>
      {n && <input type="hidden" name="id" value={n.id} />}
      <div className="card">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="field md:col-span-3">
            <label>제목 *</label>
            <input type="text" name="title" defaultValue={n?.title ?? ""} required />
          </div>
          <div className="field">
            <label>작성자</label>
            <input type="text" name="author" defaultValue={n?.author ?? "관리자"} />
          </div>
        </div>
        <div className="field">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="pinned" defaultChecked={n?.pinned ?? false} style={{ width: "auto" }} /> 상단 고정 (공지)
          </label>
        </div>
        <div className="field">
          <label>내용</label>
          <HtmlEditor name="content" defaultValue={n?.content ?? ""} />
        </div>
      </div>
    </ActionForm>
  );
}
