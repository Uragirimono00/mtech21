import Link from "next/link";
import { ActionForm } from "./ActionForm";
import { SectionsEditor } from "./SectionsEditor";
import { FileField } from "./ui";
import { saveProduct } from "@/app/admin/actions/products";
import type { ProductSection } from "@/lib/types";

type ProductData = {
  id?: number;
  categoryId: number;
  name: string;
  slug: string;
  subtitle: string | null;
  thumbnail: string | null;
  sections: ProductSection[];
  sortOrder: number;
  visible: boolean;
};

export function ProductForm({ product, categories, defaultCategoryId }: { product?: ProductData; categories: { id: number; name: string }[]; defaultCategoryId?: number }) {
  const p = product;
  return (
    <ActionForm action={saveProduct} extra={<Link href={`/admin/products?category=${p?.categoryId ?? defaultCategoryId ?? ""}`} className="btn">취소</Link>}>
      {p?.id && <input type="hidden" name="id" value={p.id} />}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-1">
          <div className="field">
            <label>카테고리 *</label>
            <select name="categoryId" defaultValue={p?.categoryId ?? defaultCategoryId ?? categories[0]?.id} required>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>제품명 *</label>
            <input type="text" name="name" defaultValue={p?.name ?? ""} required placeholder="예: MTM-200C" />
          </div>
          <div className="field">
            <label>부제 / 간단 설명</label>
            <textarea name="subtitle" defaultValue={p?.subtitle ?? ""} placeholder="예: Flange type (여러 줄 가능)" style={{ minHeight: 80 }} />
          </div>
          <FileField name="thumbnail" label="목록 썸네일 (110×130 권장)" defaultValue={p?.thumbnail ?? ""} folder="products" accept="image/*" />
          <div className="field">
            <label>URL 슬러그</label>
            <input type="text" name="slug" defaultValue={p?.slug ?? ""} placeholder="예: mtm-200c (비우면 제품명으로 생성)" />
          </div>
          <div className="field">
            <label>정렬 순서</label>
            <input type="number" name="sortOrder" defaultValue={p?.sortOrder ?? 0} />
          </div>
          <div className="field">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="visible" defaultChecked={p ? p.visible : true} style={{ width: "auto" }} /> 사이트에 공개
            </label>
          </div>
        </div>
        <div className="lg:col-span-2">
          <h2 className="mb-1 font-semibold">상세 섹션</h2>
          <p className="help mb-3">
            Specification, Dimension, Document File 등 섹션별로 제목과 HTML 본문을 입력합니다. 표는 <code>&lt;table class=&quot;rtable&quot;&gt;</code>(가로형) 또는{" "}
            <code>&lt;table class=&quot;rtable rtable--flip&quot;&gt;</code>(세로 사양표)을 사용하면 기존 디자인과 동일하게 표시됩니다.
          </p>
          <SectionsEditor name="sections" mode="html" bodyKey="html" initial={p?.sections ?? []} />
        </div>
      </div>
    </ActionForm>
  );
}
