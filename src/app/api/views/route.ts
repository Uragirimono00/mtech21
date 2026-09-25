import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/** 게시글 조회수 증가 (페이지는 정적 캐시되므로 클라이언트에서 호출) → { views } */
export async function POST(request: Request) {
  let body: { type?: string; id?: number } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  const id = Number(body.id);
  if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ error: "bad id" }, { status: 400 });

  try {
    if (body.type === "notice") {
      const n = await prisma.notice.update({ where: { id }, data: { views: { increment: 1 } }, select: { views: true } });
      return NextResponse.json({ views: n.views });
    }
    if (body.type === "qna") {
      const q = await prisma.qna.update({ where: { id }, data: { views: { increment: 1 } }, select: { views: true } });
      return NextResponse.json({ views: q.views });
    }
  } catch {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json({ error: "bad type" }, { status: 400 });
}
