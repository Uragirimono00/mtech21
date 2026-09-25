import Link from "next/link";
import { ActionForm } from "./ActionForm";
import { SectionsEditor } from "./SectionsEditor";
import { saveCategory } from "@/app/admin/actions/categories";
import type { CategorySection } from "@/lib/types";

type CategoryData = {
  id?: number;
  name: string;
  slug: string;
  title: string | null;
  engTitle: string | null;
  intro: string | null;
  sections: CategorySection[];
  sortOrder: number;
  visible: boolean;
};

export function CategoryForm({ category }: { category?: CategoryData }) {
  const c = category;
  return (
    <ActionForm action={saveCategory} extra={<Link href="/admin/categories" className="btn">취소</Link>}>
      {c?.id && <input type="hidden" name="id" value={c.id} />}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-1">
          <div className="field">
            <label>메뉴 표시명 *</label>
            <input type="text" name="name" defaultValue={c?.name ?? ""} required placeholder="예: 전자기유량계" />
            <div className="help">상단 메뉴·좌측 메뉴에 표시되는 이름</div>
          </div>
          <div className="field">
            <label>페이지 제목</label>
            <input type="text" name="title" defaultValue={c?.title ?? ""} placeholder="비우면 메뉴 표시명 사용" />
            <div className="help">예: Indicator &amp; Intergrator</div>
          </div>
          <div className="field">
            <label>URL 슬러그</label>
            <input type="text" name="slug" defaultValue={c?.slug ?? ""} placeholder="예: magnetic (영문/숫자/-)" />
            <div className="help">주소: /product/슬러그 — 변경 시 기존 링크가 바뀝니다.</div>
          </div>
          <div className="field">
            <label>정렬 순서</label>
            <input type="number" name="sortOrder" defaultValue={c?.sortOrder ?? 0} />
          </div>
          <div className="field">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="visible" defaultChecked={c ? c.visible : true} style={{ width: "auto" }} /> 사이트에 공개
            </label>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="card mb-4">
            <div className="field">
              <label>영문 제목 (제품 목록 아래 큰 제목)</label>
              <input type="text" name="engTitle" defaultValue={c?.engTitle ?? ""} placeholder="예: Magnetic Flowmeter" />
            </div>
            <div className="field">
              <label>소개 / 측정 원리</label>
              <textarea name="intro" defaultValue={c?.intro ?? ""} placeholder="줄바꿈이 그대로 표시됩니다." />
            </div>
          </div>
          <h2 className="mb-2 font-semibold">설명 섹션 (특징 / 적용 / 공통사양 ...)</h2>
          <SectionsEditor name="sections" mode="text" bodyKey="body" initial={c?.sections ?? []} />
        </div>
      </div>
    </ActionForm>
  );
}
