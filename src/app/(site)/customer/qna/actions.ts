"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export type QnaWriteState = { error?: string };

const writeSchema = z.object({
  author: z.string().trim().min(1, "이름을 입력해주세요.").max(50),
  password: z.string().min(4, "비밀번호는 4자 이상 입력해주세요.").max(50),
  email: z.string().trim().max(200).optional().default(""),
  phone: z.string().trim().max(50).optional().default(""),
  title: z.string().trim().min(1, "제목을 입력해주세요.").max(200),
  content: z.string().trim().min(1, "내용을 입력해주세요.").max(5000),
  isSecret: z.boolean(),
});

export async function writeQna(_prev: QnaWriteState, formData: FormData): Promise<QnaWriteState> {
  if (formData.get("website")) redirect("/customer/qna");
  const parsed = writeSchema.safeParse({
    author: formData.get("author"),
    password: formData.get("password"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    title: formData.get("title"),
    content: formData.get("content"),
    isSecret: formData.get("isSecret") === "on",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  const d = parsed.data;
  const q = await prisma.qna.create({
    data: {
      author: d.author,
      passwordHash: await bcrypt.hash(d.password, 10),
      email: d.email || null,
      phone: d.phone || null,
      title: d.title,
      content: d.content,
      isSecret: d.isSecret,
    },
  });
  revalidatePath("/customer/qna");
  redirect(`/customer/qna/${q.id}`);
}

export type QnaUnlockState = {
  error?: string;
  unlocked?: { content: string; answer: string | null; answeredAt: string | null };
};

/** 비밀글 열람: 비밀번호 확인 후 본문 반환 */
export async function unlockQna(_prev: QnaUnlockState, formData: FormData): Promise<QnaUnlockState> {
  const id = Number(formData.get("id"));
  const password = String(formData.get("password") ?? "");
  const q = await prisma.qna.findUnique({ where: { id } });
  if (!q) return { error: "글을 찾을 수 없습니다." };
  if (!q.passwordHash || !(await bcrypt.compare(password, q.passwordHash))) {
    return { error: "비밀번호가 올바르지 않습니다." };
  }
  return {
    unlocked: { content: q.content, answer: q.answer, answeredAt: q.answeredAt ? q.answeredAt.toISOString() : null },
  };
}

export type QnaDeleteState = { error?: string };

/** 작성자 삭제 (비밀번호 확인) */
export async function deleteQnaByUser(_prev: QnaDeleteState, formData: FormData): Promise<QnaDeleteState> {
  const id = Number(formData.get("id"));
  const password = String(formData.get("password") ?? "");
  const q = await prisma.qna.findUnique({ where: { id } });
  if (!q) return { error: "글을 찾을 수 없습니다." };
  if (!q.passwordHash || !(await bcrypt.compare(password, q.passwordHash))) {
    return { error: "비밀번호가 올바르지 않습니다." };
  }
  await prisma.qna.delete({ where: { id } });
  revalidatePath("/customer/qna");
  revalidatePath(`/customer/qna/${id}`);
  redirect("/customer/qna");
}
