import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "관리자 로그인", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage({ searchParams }: PageProps<"/admin/login">) {
  const session = await getSession();
  if (session) redirect("/admin");
  const sp = await searchParams;
  const next = typeof sp.next === "string" ? sp.next : "/admin";
  return (
    <div className="admin flex min-h-screen items-center justify-center p-6">
      <div className="card w-full max-w-sm">
        <div className="mb-6 text-center">
          <img src="/images/design/logo.png" alt="엠테크" className="mx-auto mb-3" />
          <h1 className="text-lg font-semibold">관리자 로그인</h1>
        </div>
        <LoginForm next={next} />
      </div>
    </div>
  );
}
