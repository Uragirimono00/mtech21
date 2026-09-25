import { prisma } from "@/lib/prisma";
import { ActionForm } from "@/components/admin/ActionForm";
import { ConfirmForm, FileField } from "@/components/admin/ui";
import { Flash } from "@/components/admin/Flash";
import { saveSlide, deleteSlide } from "@/app/admin/actions/content";

export default async function SlidesAdminPage({ searchParams }: PageProps<"/admin/slides">) {
  const sp = await searchParams;
  const slides = await prisma.slide.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
  const editId = Number(sp.edit) || 0;
  const editing = slides.find((s) => s.id === editId);

  return (
    <div>
      <h1 className="mb-5 text-xl font-semibold">메인 슬라이드</h1>
      <Flash sp={sp} />
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-2 font-semibold">{editing ? `슬라이드 #${editing.id} 수정` : "슬라이드 추가"}</h2>
          <ActionForm action={saveSlide} key={editing?.id ?? "new"} extra={editing && <a href="/admin/slides" className="btn">새로 추가</a>}>
            {editing && <input type="hidden" name="id" value={editing.id} />}
            <div className="card">
              <FileField name="image" label="배경 이미지 * (1920×504 권장)" defaultValue={editing?.image ?? ""} folder="slides" accept="image/*" />
              <FileField name="textImage" label="문구 이미지 (421×230, 투명 PNG)" defaultValue={editing?.textImage ?? ""} folder="slides" accept="image/*" help="배경 위 왼쪽에 겹쳐 표시되는 문구 이미지. 없으면 배경만 표시" />
              <div className="field">
                <label>클릭 시 이동 링크</label>
                <input type="text" name="link" defaultValue={editing?.link ?? ""} placeholder="/product/magnetic" />
              </div>
              <div className="field">
                <label>대체 텍스트</label>
                <input type="text" name="alt" defaultValue={editing?.alt ?? ""} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="field">
                  <label>순서</label>
                  <input type="number" name="sortOrder" defaultValue={editing?.sortOrder ?? slides.length + 1} />
                </div>
                <div className="field flex items-end">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="visible" defaultChecked={editing ? editing.visible : true} style={{ width: "auto" }} /> 표시
                  </label>
                </div>
              </div>
            </div>
          </ActionForm>
        </div>
        <div>
          <h2 className="mb-2 font-semibold">등록된 슬라이드</h2>
          <div className="space-y-3">
            {slides.length === 0 && <div className="card text-sm text-gray-500">등록된 슬라이드가 없습니다.</div>}
            {slides.map((s) => (
              <div key={s.id} className="card flex items-center gap-3">
                <div style={{ position: "relative", width: 160, height: 42, overflow: "hidden", borderRadius: 4, background: "#eee", flexShrink: 0 }}>
                  <img src={s.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  {s.textImage && <img src={s.textImage} alt="" style={{ position: "absolute", left: 6, top: 4, height: 34 }} />}
                </div>
                <div className="min-w-0 flex-1 text-xs text-gray-600">
                  <div>
                    #{s.id} · 순서 {s.sortOrder} {s.visible ? <span className="badge on">표시</span> : <span className="badge off">숨김</span>}
                  </div>
                  <div className="truncate">{s.link || "링크 없음"}</div>
                </div>
                <a href={`/admin/slides?edit=${s.id}`} className="btn sm">
                  수정
                </a>
                <ConfirmForm action={deleteSlide} hidden={{ id: s.id }}>
                  삭제
                </ConfirmForm>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
