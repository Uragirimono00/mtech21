import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin, logout } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata: Metadata = { title: { default: "관리자", template: "%s | 엠테크 관리자" }, robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();

  async function logoutAction() {
    "use server";
    await logout();
    redirect("/admin/login");
  }

  return (
    <div className="admin flex min-h-screen">
      <aside className="sidebar hidden w-56 shrink-0 flex-col border-r border-[#e3e5ea] bg-white md:flex">
        <div className="border-b border-[#e3e5ea] px-5 py-4">
          <Link href="/admin" className="flex items-center gap-2">
            <img src="/images/design/logo.png" alt="" className="h-6 w-auto" />
            <span className="text-sm font-semibold">관리자</span>
          </Link>
        </div>
        <AdminNav />
        <div className="mt-auto border-t border-[#e3e5ea] p-4 text-xs text-gray-500">
          <div className="mb-2 truncate">{session.email}</div>
          <div className="flex gap-2">
            <Link href="/" className="btn sm" target="_blank">
              사이트 보기
            </Link>
            <form action={logoutAction}>
              <button className="btn sm" type="submit">
                로그아웃
              </button>
            </form>
          </div>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[#e3e5ea] bg-white px-4 py-3 md:hidden">
          <Link href="/admin" className="font-semibold">
            엠테크 관리자
          </Link>
          <form action={logoutAction}>
            <button className="btn sm" type="submit">
              로그아웃
            </button>
          </form>
        </header>
        <div className="md:hidden">
          <AdminNav compact />
        </div>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
