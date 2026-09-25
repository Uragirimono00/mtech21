import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { saveUpload } from "@/lib/upload";

export const runtime = "nodejs";

/** 관리자 파일 업로드 (multipart/form-data: file, folder?) → { url } */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });

  try {
    const form = await request.formData();
    const file = form.get("file");
    const folder = String(form.get("folder") ?? "uploads").replace(/[^a-z0-9_-]/gi, "") || "uploads";
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
    }
    const url = await saveUpload(file, folder);
    return NextResponse.json({ url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "업로드 실패";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
