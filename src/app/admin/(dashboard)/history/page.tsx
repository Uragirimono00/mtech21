import { prisma } from "@/lib/prisma";
import { ConfirmForm } from "@/components/admin/ui";
import { Flash } from "@/components/admin/Flash";
import { saveHistory, deleteHistory } from "@/app/admin/actions/content";

export default async function HistoryAdminPage({ searchParams }: PageProps<"/admin/history">) {
  const sp = await searchParams;
  const items = await prisma.history.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
  return (
    <div>
      <h1 className="mb-5 text-xl font-semibold">회사 연혁</h1>
      <Flash sp={sp} />
      <form action={saveHistory} className="card mb-6">
        <h2 className="mb-3 font-semibold">연혁 추가</h2>
        <div className="grid gap-3 md:grid-cols-[100px_80px_1fr_90px_auto] md:items-end">
          <div className="field" style={{ marginBottom: 0 }}>
            <label>연도 *</label>
            <input type="text" name="year" placeholder="2024" required />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>월</label>
            <input type="text" name="month" placeholder="01" />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>내용 *</label>
            <input type="text" name="content" placeholder="예: OO 제품 개발 및 시판" required />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>순서</label>
            <input type="number" name="sortOrder" placeholder="자동" />
          </div>
          <button className="btn primary" type="submit">
            추가
          </button>
        </div>
        <div className="help mt-2">순서 값이 작을수록 위에 표시됩니다. 최신 연도가 위로 오도록 순서를 지정하세요. (같은 연도는 자동으로 묶여 표시됩니다)</div>
      </form>

      <div className="card" style={{ padding: 0 }}>
        <table className="list">
          <thead>
            <tr>
              <th style={{ width: 80 }}>순서</th>
              <th style={{ width: 100 }}>연도</th>
              <th style={{ width: 80 }}>월</th>
              <th>내용</th>
              <th style={{ width: 150 }}></th>
            </tr>
          </thead>
          <tbody>
            {items.map((h) => (
              <tr key={h.id}>
                <td colSpan={5} style={{ padding: 0 }}>
                  <form action={saveHistory} className="flex items-center gap-2 px-3 py-2">
                    <input type="hidden" name="id" value={h.id} />
                    <input type="number" name="sortOrder" defaultValue={h.sortOrder} style={{ width: 70 }} />
                    <input type="text" name="year" defaultValue={h.year} style={{ width: 90 }} />
                    <input type="text" name="month" defaultValue={h.month} style={{ width: 70 }} />
                    <input type="text" name="content" defaultValue={h.content} style={{ flex: 1 }} />
                    <button className="btn sm" type="submit">
                      저장
                    </button>
                    <ConfirmForm action={deleteHistory} hidden={{ id: h.id }}>
                      삭제
                    </ConfirmForm>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
