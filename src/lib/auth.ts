import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const SESSION_COOKIE = "mtech_admin_session";
const SESSION_DAYS = 7;

function secretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("AUTH_SECRET 환경변수를 16자 이상으로 설정하세요.");
  }
  return new TextEncoder().encode(secret);
}

export type AdminSession = { id: number; email: string; name: string };

export async function createSessionToken(session: AdminSession) {
  return new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secretKey());
}

export async function verifySessionToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (typeof payload.id !== "number" || typeof payload.email !== "string") return null;
    return { id: payload.id, email: payload.email, name: String(payload.name ?? "관리자") };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/** 관리자 페이지/액션에서 호출. 세션이 없으면 로그인 페이지로 이동. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function login(email: string, password: string) {
  const admin = await prisma.admin.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (!admin) return { ok: false as const, error: "이메일 또는 비밀번호가 올바르지 않습니다." };
  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return { ok: false as const, error: "이메일 또는 비밀번호가 올바르지 않습니다." };
  const token = await createSessionToken({ id: admin.id, email: admin.email, name: admin.name });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
  return { ok: true as const };
}

export async function logout() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
