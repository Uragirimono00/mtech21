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
              <FileField name="image" label="배경 이미지 * (1920×640 권장)" defaultValue={editing?.image ?? ""} folder="slides" accept="image/*" help="문구는 아래 항목에 입력하면 이미지 위에 글자로 표시됩니다 (이미지에 글자를 넣을 필요 없음)" />
              <div className="grid grid-cols-2 gap-3">
                <div className="field">
                  <label>배경 밝기</label>
                  <select name="theme" defaultValue={editing?.theme ?? "dark"}>
                    <option value="dark">어두운 배경 (흰 글씨)</option>
                    <option value="light">밝은 배경 (검은 글씨)</option>
                  </select>
                </div>
                <div className="field">
                  <label>작은 영문 라벨</label>
                  <input type="text" name="kicker" defaultValue={editing?.kicker ?? ""} placeholder="예: Flow Measurement" />
                </div>
              </div>
              <div className="field">
                <label>큰 제목</label>
                <textarea name="title" defaultValue={editing?.title ?? ""} placeholder={"예: 정밀한 유량 측정,\n신뢰할 수 있는 계측"} style={{ minHeight: 70 }} />
                <div className="help">줄바꿈이 그대로 반영됩니다 (2줄 권장)</div>
              </div>
              <div className="field">
                <label>설명 문구</label>
                <textarea name="subtitle" defaultValue={editing?.subtitle ?? ""} style={{ minHeight: 70 }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="field">
                  <label>버튼 링크</label>
                  <input type="text" name="link" defaultValue={editing?.link ?? ""} placeholder="/product/magnetic" />
                </div>
                <div className="field">
                  <label>버튼 문구</label>
                  <input type="text" name="linkLabel" defaultValue={editing?.linkLabel ?? ""} placeholder="자세히 보기" />
                </div>
              </div>
              <div className="field">
                <label>대체 텍스트 (검색엔진·접근성용 이미지 설명)</label>
                <input type="text" name="alt" defaultValue={editing?.alt ?? ""} />
              </div>
              <details className="mb-3">
                <summary className="cursor-pointer text-xs text-gray-500">구형 옵션: 문구 이미지 (제목을 비웠을 때만 사용)</summary>
                <div className="mt-2">
                  <FileField name="textImage" label="문구 이미지 (투명 PNG)" defaultValue={editing?.textImage ?? ""} folder="slides" accept="image/*" />
                </div>
              </details>
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
                <div style={{ position: "relative", width: 168, height: 56, overflow: "hidden", borderRadius: 6, background: "#eee", flexShrink: 0 }}>
                  <img src={s.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div className="min-w-0 flex-1 text-xs text-gray-600">
                  <div className="truncate text-sm font-medium text-gray-800">{s.title?.split("\n")[0] || s.alt || `슬라이드 #${s.id}`}</div>
                  <div>
                    순서 {s.sortOrder} · {s.theme === "light" ? "밝은 배경" : "어두운 배경"} {s.visible ? <span className="badge on">표시</span> : <span className="badge off">숨김</span>}
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
