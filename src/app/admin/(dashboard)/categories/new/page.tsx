import { CategoryForm } from "@/components/admin/CategoryForm";

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="mb-5 text-xl font-semibold">카테고리 추가</h1>
      <CategoryForm />
    </div>
  );
}
