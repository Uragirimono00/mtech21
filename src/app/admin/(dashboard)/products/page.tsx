import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ConfirmForm } from "@/components/admin/ui";
import { Flash } from "@/components/admin/Flash";
import { deleteProduct, moveProduct, duplicateProduct } from "@/app/admin/actions/products";

export default async function ProductsPage({ searchParams }: PageProps<"/admin/products">) {
  const sp = await searchParams;
  const categories = await prisma.category.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
  const selected = Number(sp.category) || categories[0]?.id || 0;
  const products = selected
    ? await prisma.product.findMany({ where: { categoryId: selected }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] })
    : [];
  const current = categories.find((c) => c.id === selected);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">제품 관리</h1>
        <Link href={`/admin/products/new?category=${selected}`} className="btn primary">
          + 제품 추가
        </Link>
      </div>
      <Flash sp={sp} />
      <div className="mb-4 flex flex-wrap gap-1">
        {categories.map((c) => (
          <Link key={c.id} href={`/admin/products?category=${c.id}`} className={`btn sm ${c.id === selected ? "primary" : ""}`}>
            {c.name}
          </Link>
        ))}
      </div>
      <div className="card" style={{ padding: 0 }}>
        <table className="list">
          <thead>
            <tr>
              <th style={{ width: 60 }}>순서</th>
              <th style={{ width: 70 }}>썸네일</th>
              <th>제품명</th>
              <th>부제</th>
              <th>URL</th>
              <th style={{ width: 70 }}>상태</th>
              <th style={{ width: 200 }}></th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-500">
                  {current ? `"${current.name}" 카테고리에 등록된 제품이 없습니다.` : "카테고리를 먼저 만들어주세요."}
                </td>
              </tr>
            )}
            {products.map((p, i) => (
              <tr key={p.id}>
                <td>
                  <div className="flex items-center gap-1">
                    <form action={moveProduct}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="dir" value="up" />
                      <button className="btn sm" disabled={i === 0}>
                        ↑
                      </button>
                    </form>
                    <form action={moveProduct}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="dir" value="down" />
                      <button className="btn sm" disabled={i === products.length - 1}>
                        ↓
                      </button>
                    </form>
                  </div>
                </td>
                <td>{p.thumbnail && <img src={p.thumbnail} alt="" style={{ width: 44, height: 52, objectFit: "cover", border: "1px solid #eee" }} />}</td>
                <td>
                  <Link href={`/admin/products/${p.id}`} className="font-medium">
                    {p.name}
                  </Link>
                </td>
                <td className="max-w-[240px] truncate text-gray-500">{p.subtitle?.split("\n")[0]}</td>
                <td className="text-gray-500">
                  {current && (
                    <Link href={`/product/${current.slug}/${p.slug}`} target="_blank" className="hover:underline">
                      /{p.slug}
                    </Link>
                  )}
                </td>
                <td>{p.visible ? <span className="badge on">공개</span> : <span className="badge off">숨김</span>}</td>
                <td className="text-right">
                  <Link href={`/admin/products/${p.id}`} className="btn sm">
                    수정
                  </Link>{" "}
                  <form action={duplicateProduct} className="inline">
                    <input type="hidden" name="id" value={p.id} />
                    <button className="btn sm">복사</button>
                  </form>{" "}
                  <ConfirmForm action={deleteProduct} hidden={{ id: p.id }} message={`"${p.name}" 제품을 삭제할까요?`}>
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
