import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CategoryForm } from "@/components/admin/CategoryForm";
import type { CategorySection } from "@/lib/types";

export default async function EditCategoryPage({ params }: PageProps<"/admin/categories/[id]">) {
  const { id } = await params;
  const cat = await prisma.category.findUnique({ where: { id: Number(id) || 0 } });
  if (!cat) notFound();
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-semibold">카테고리 수정: {cat.name}</h1>
        <Link href={`/product/${cat.slug}`} target="_blank" className="btn sm">
          사이트에서 보기 ↗
        </Link>
      </div>
      <CategoryForm category={{ ...cat, sections: (cat.sections as CategorySection[]) ?? [] }} />
    </div>
  );
}
