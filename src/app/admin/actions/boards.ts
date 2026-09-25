"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidateSite } from "@/lib/revalidate";
import { str, bool, int, type ActionState } from "./util";

/* ---------- 공지사항 ---------- */
export async function saveNotice(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = int(fd, "id", 0);
  const title = str(fd, "title", 200);
  const content = str(fd, "content", 200_000);
  if (!title) return { error: "제목을 입력해주세요." };
  const data = { title, content, author: str(fd, "author", 50) || "관리자", pinned: bool(fd, "pinned") };
  if (id) await prisma.notice.update({ where: { id }, data });
  else await prisma.notice.create({ data });
  revalidateSite();
  redirect("/admin/notices?saved=1");
}

export async function deleteNotice(fd: FormData) {
  await requireAdmin();
  const id = int(fd, "id", 0);
  if (!id) return;
  await prisma.notice.delete({ where: { id } });
  revalidateSite();
  redirect("/admin/notices?deleted=1");
}

/* ---------- 질문게시판 ---------- */
export async function answerQna(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = int(fd, "id", 0);
  const answer = str(fd, "answer", 10_000);
  if (!id) return { error: "잘못된 요청입니다." };
  await prisma.qna.update({
    where: { id },
    data: { answer: answer || null, answeredAt: answer ? new Date() : null },
  });
  revalidateSite();
  return { ok: true, message: answer ? "답변이 저장되었습니다." : "답변이 삭제되었습니다." };
}

export async function deleteQna(fd: FormData) {
  await requireAdmin();
  const id = int(fd, "id", 0);
  if (!id) return;
  await prisma.qna.delete({ where: { id } });
  revalidateSite();
  redirect("/admin/qna?deleted=1");
}

/* ---------- 1:1 문의 ---------- */
export async function updateInquiry(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = int(fd, "id", 0);
  if (!id) return { error: "잘못된 요청입니다." };
  await prisma.inquiry.update({ where: { id }, data: { memo: str(fd, "memo", 5000) || null, isRead: bool(fd, "isRead") } });
  return { ok: true };
}

export async function toggleInquiryRead(fd: FormData) {
  await requireAdmin();
  const id = int(fd, "id", 0);
  const q = await prisma.inquiry.findUnique({ where: { id } });
  if (!q) return;
  await prisma.inquiry.update({ where: { id }, data: { isRead: !q.isRead } });
  redirect("/admin/inquiries");
}

export async function deleteInquiry(fd: FormData) {
  await requireAdmin();
  const id = int(fd, "id", 0);
  if (!id) return;
  await prisma.inquiry.delete({ where: { id } });
  redirect("/admin/inquiries?deleted=1");
}
