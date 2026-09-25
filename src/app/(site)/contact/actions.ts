"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

export type InquiryState = { ok: boolean; error?: string; submitted?: boolean };

const schema = z.object({
  name: z.string().trim().min(1, "이름을 입력해주세요.").max(100),
  phone: z.string().trim().max(50).optional().default(""),
  email: z.string().trim().max(200).optional().default(""),
  address: z.string().trim().max(300).optional().default(""),
  content: z.string().trim().min(1, "내용을 입력해주세요.").max(5000),
  agree: z.literal("on", { message: "개인정보의 수집 및 이용목적에 동의해주세요." }),
});

export async function submitInquiry(_prev: InquiryState, formData: FormData): Promise<InquiryState> {
  // 스팸 방지용 허니팟
  if (formData.get("website")) return { ok: true, submitted: true };

  const parsed = schema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    address: formData.get("address"),
    content: formData.get("content"),
    agree: formData.get("agree") ?? undefined,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }
  const d = parsed.data;
  if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) {
    return { ok: false, error: "이메일 형식이 올바르지 않습니다." };
  }

  await prisma.inquiry.create({
    data: { name: d.name, phone: d.phone || null, email: d.email || null, address: d.address || null, content: d.content },
  });
  return { ok: true, submitted: true };
}
