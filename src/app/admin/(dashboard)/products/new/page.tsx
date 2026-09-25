import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage({ searchParams }: PageProps<"/admin/products/new">) {
  const sp = await searchParams;
  const categories = await prisma.category.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }], select: { id: true, name: true } });
  return (
    <div>
      <h1 className="mb-5 text-xl font-semibold">제품 추가</h1>
      <ProductForm categories={categories} defaultCategoryId={Number(sp.category) || undefined} />
    </div>
  );
}
