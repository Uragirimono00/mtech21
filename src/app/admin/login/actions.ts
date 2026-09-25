"use server";

import { redirect } from "next/navigation";
import { login } from "@/lib/auth";

export type LoginState = { error?: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "");
  if (!email || !password) return { error: "이메일과 비밀번호를 입력해주세요." };
  const result = await login(email, password);
  if (!result.ok) return { error: result.error };
  redirect(next.startsWith("/admin") ? next : "/admin");
}
