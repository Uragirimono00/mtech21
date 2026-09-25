import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import type { ProductSection } from "@/lib/types";

export default async function EditProductPage({ params }: PageProps<"/admin/products/[id]">) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id: Number(id) || 0 }, include: { category: true } });
  if (!product) notFound();
  const categories = await prisma.category.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }], select: { id: true, name: true } });
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          제품 수정: {product.name} <span className="text-sm font-normal text-gray-400">({product.category.name})</span>
        </h1>
        <Link href={`/product/${product.category.slug}/${product.slug}`} target="_blank" className="btn sm">
          사이트에서 보기 ↗
        </Link>
      </div>
      <ProductForm product={{ ...product, sections: (product.sections as ProductSection[]) ?? [] }} categories={categories} />
    </div>
  );
}
