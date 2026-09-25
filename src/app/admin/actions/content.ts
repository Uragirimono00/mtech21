"use server";

import { redirect } from "next/navigation";
import { requireAdmin, hashPassword, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidateSite } from "@/lib/revalidate";
import { saveSetting, getSetting } from "@/lib/settings";
import { str, bool, int, type ActionState } from "./util";

/* ---------- 연혁 ---------- */
export async function saveHistory(fd: FormData) {
  await requireAdmin();
  const id = int(fd, "id", 0);
  const data = { year: str(fd, "year", 10), month: str(fd, "month", 10), content: str(fd, "content", 1000), sortOrder: int(fd, "sortOrder", 0) };
  if (!data.year || !data.content) redirect("/admin/history?error=1");
  if (id) await prisma.history.update({ where: { id }, data });
  else {
    if (!data.sortOrder) {
      const max = await prisma.history.aggregate({ _max: { sortOrder: true } });
      data.sortOrder = (max._max.sortOrder ?? 0) + 1;
    }
    await prisma.history.create({ data });
  }
  revalidateSite();
  redirect("/admin/history?saved=1");
}

export async function deleteHistory(fd: FormData) {
  await requireAdmin();
  const id = int(fd, "id", 0);
  if (id) await prisma.history.delete({ where: { id } });
  revalidateSite();
  redirect("/admin/history?deleted=1");
}

/* ---------- 슬라이드 ---------- */
export async function saveSlide(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = int(fd, "id", 0);
  const image = str(fd, "image", 500);
  if (!image) return { error: "슬라이드 배경 이미지를 지정해주세요." };
  const data = {
    image,
    textImage: str(fd, "textImage", 500) || null,
    link: str(fd, "link", 500) || null,
    alt: str(fd, "alt", 200) || null,
    sortOrder: int(fd, "sortOrder", 0),
    visible: bool(fd, "visible"),
  };
  if (id) await prisma.slide.update({ where: { id }, data });
  else await prisma.slide.create({ data });
  revalidateSite();
  redirect("/admin/slides?saved=1");
}

export async function deleteSlide(fd: FormData) {
  await requireAdmin();
  const id = int(fd, "id", 0);
  if (id) await prisma.slide.delete({ where: { id } });
  revalidateSite();
  redirect("/admin/slides?deleted=1");
}

/* ---------- 설정 ---------- */
export async function saveCompanySettings(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  await saveSetting("company", {
    name: str(fd, "name", 100),
    nameEn: str(fd, "nameEn", 100),
    ceo: str(fd, "ceo", 100),
    phone: str(fd, "phone", 100),
    email: str(fd, "email", 200),
    address: str(fd, "address", 300),
    bizNo: str(fd, "bizNo", 100),
    copyright: str(fd, "copyright", 300),
  });
  await saveSetting("site", {
    title: str(fd, "siteTitle", 100) || "엠테크",
    description: str(fd, "siteDescription", 500),
    logo: str(fd, "logo", 500) || "/images/design/logo.png",
    subVisual: str(fd, "subVisual", 500) || "/images/design/visual_mt1.jpg",
  });
  revalidateSite();
  return { ok: true };
}

export async function saveHomeSettings(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const cards = [0, 1].map((i) => ({
    title: str(fd, `card${i}_title`, 100),
    subtitle: str(fd, `card${i}_subtitle`, 200),
    image: str(fd, `card${i}_image`, 500),
    link: str(fd, `card${i}_link`, 500),
  })).filter((c) => c.title || c.image);
  const buttons = [0, 1].map((i) => ({ label: str(fd, `btn${i}_label`, 50), link: str(fd, `btn${i}_link`, 500) })).filter((b) => b.label);
  await saveSetting("home", {
    banner: { image: str(fd, "banner_image", 500), link: str(fd, "banner_link", 500) },
    cards,
    newsTitle: str(fd, "newsTitle", 100) || "Company News",
    customerCenter: {
      title: str(fd, "cc_title", 100) || "Customer Center",
      phone: str(fd, "cc_phone", 100),
      tel: str(fd, "cc_tel", 100),
      hours: str(fd, "cc_hours", 200),
      buttons,
    },
  });
  revalidateSite();
  return { ok: true };
}

export async function saveGreetingSettings(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  await saveSetting("greeting", {
    title: str(fd, "title", 200),
    subtitle: str(fd, "subtitle", 300),
    body: str(fd, "body", 10_000),
    signImage: str(fd, "signImage", 500),
    image: str(fd, "image", 500),
  });
  revalidateSite();
  return { ok: true };
}

export async function saveLocationSettings(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  let mapEmbedUrl = str(fd, "mapEmbedUrl", 2000);
  // <iframe ...> 전체를 붙여넣은 경우 src만 추출
  const m = mapEmbedUrl.match(/src=["']([^"']+)["']/);
  if (m) mapEmbedUrl = m[1];
  const directions = str(fd, "directions", 5000)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const idx = l.indexOf(":");
      return idx > 0 ? { label: l.slice(0, idx).trim(), text: l.slice(idx + 1).trim() } : { label: "안내", text: l };
    });
  await saveSetting("location", {
    mapEmbedUrl,
    address: str(fd, "address", 300),
    phone: str(fd, "phone", 100),
    email: str(fd, "email", 200),
    directions,
  });
  revalidateSite();
  return { ok: true };
}

export async function savePageSettings(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const current = await getSetting("contact");
  await saveSetting("contact", {
    title: str(fd, "contact_title", 200),
    subtitle: str(fd, "contact_subtitle", 300),
    privacy: str(fd, "contact_privacy", 10_000) || current.privacy,
    notifyEmail: str(fd, "contact_notifyEmail", 200),
  });
  await saveSetting("notice", { title: str(fd, "notice_title", 200), subtitle: str(fd, "notice_subtitle", 300) });
  await saveSetting("qna", { title: str(fd, "qna_title", 200), subtitle: str(fd, "qna_subtitle", 300) });
  await saveSetting("history", { title: str(fd, "history_title", 100) || "HISTORY", subtitle: str(fd, "history_subtitle", 200) });
  await saveSetting("menu", { showQna: bool(fd, "showQna") });
  revalidateSite();
  return { ok: true };
}

/* ---------- 계정 ---------- */
export async function updateAccount(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const session = await requireAdmin();
  const admin = await prisma.admin.findUnique({ where: { id: session.id } });
  if (!admin) return { error: "계정을 찾을 수 없습니다." };
  const current = str(fd, "currentPassword", 100);
  if (!(await verifyPassword(current, admin.passwordHash))) return { error: "현재 비밀번호가 올바르지 않습니다." };

  const email = str(fd, "email", 200).toLowerCase();
  const name = str(fd, "name", 50) || "관리자";
  const newPassword = str(fd, "newPassword", 100);
  const confirm = str(fd, "confirmPassword", 100);
  if (!email) return { error: "이메일을 입력해주세요." };
  if (newPassword && newPassword.length < 8) return { error: "새 비밀번호는 8자 이상이어야 합니다." };
  if (newPassword && newPassword !== confirm) return { error: "새 비밀번호 확인이 일치하지 않습니다." };

  const dup = await prisma.admin.findUnique({ where: { email } });
  if (dup && dup.id !== admin.id) return { error: "이미 사용 중인 이메일입니다." };

  await prisma.admin.update({
    where: { id: admin.id },
    data: { email, name, ...(newPassword ? { passwordHash: await hashPassword(newPassword) } : {}) },
  });
  return { ok: true, message: "계정 정보가 변경되었습니다. 이메일을 바꾼 경우 다음 로그인부터 새 이메일을 사용하세요." };
}
