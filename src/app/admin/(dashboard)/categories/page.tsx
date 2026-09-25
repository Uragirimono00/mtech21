import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ConfirmForm } from "@/components/admin/ui";
import { Flash } from "@/components/admin/Flash";
import { deleteCategory, moveCategory } from "@/app/admin/actions/categories";

export default async function CategoriesPage({ searchParams }: PageProps<"/admin/categories">) {
  const sp = await searchParams;
  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-semibold">제품 카테고리</h1>
        <Link href="/admin/categories/new" className="btn primary">
          + 카테고리 추가
        </Link>
      </div>
      <Flash sp={sp} />
      <div className="card" style={{ padding: 0 }}>
        <table className="list">
          <thead>
            <tr>
              <th style={{ width: 60 }}>순서</th>
              <th>메뉴 표시명</th>
              <th>페이지 제목 / 영문 제목</th>
              <th>URL</th>
              <th style={{ width: 70 }}>제품 수</th>
              <th style={{ width: 70 }}>상태</th>
              <th style={{ width: 220 }}></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c, i) => (
              <tr key={c.id}>
                <td>
                  <div className="flex items-center gap-1">
                    <form action={moveCategory}>
                      <input type="hidden" name="id" value={c.id} />
                      <input type="hidden" name="dir" value="up" />
                      <button className="btn sm" disabled={i === 0} title="위로">
                        ↑
                      </button>
                    </form>
                    <form action={moveCategory}>
                      <input type="hidden" name="id" value={c.id} />
                      <input type="hidden" name="dir" value="down" />
                      <button className="btn sm" disabled={i === categories.length - 1} title="아래로">
                        ↓
                      </button>
                    </form>
                  </div>
                </td>
                <td>
                  <Link href={`/admin/categories/${c.id}`} className="font-medium">
                    {c.name}
                  </Link>
                </td>
                <td className="text-gray-600">
                  {c.title || c.name}
                  {c.engTitle && <span className="text-gray-400"> / {c.engTitle}</span>}
                </td>
                <td className="text-gray-500">
                  <Link href={`/product/${c.slug}`} target="_blank" className="hover:underline">
                    /product/{c.slug}
                  </Link>
                </td>
                <td>
                  <Link href={`/admin/products?category=${c.id}`}>{c._count.products}</Link>
                </td>
                <td>{c.visible ? <span className="badge on">공개</span> : <span className="badge off">숨김</span>}</td>
                <td className="text-right">
                  <Link href={`/admin/products/new?category=${c.id}`} className="btn sm">
                    제품 추가
                  </Link>{" "}
                  <Link href={`/admin/categories/${c.id}`} className="btn sm">
                    수정
                  </Link>{" "}
                  <ConfirmForm action={deleteCategory} hidden={{ id: c.id }} message={`"${c.name}" 카테고리와 소속 제품 ${c._count.products}개를 모두 삭제합니다. 계속할까요?`}>
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
