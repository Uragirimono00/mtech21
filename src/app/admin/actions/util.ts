import "server-only";

export type ActionState = { error?: string; ok?: boolean; message?: string };

export function str(fd: FormData, key: string, max = 5000) {
  const v = fd.get(key);
  return (typeof v === "string" ? v : "").trim().slice(0, max);
}
export function bool(fd: FormData, key: string) {
  return fd.get(key) === "on" || fd.get(key) === "true";
}
export function int(fd: FormData, key: string, def = 0) {
  const n = parseInt(str(fd, key), 10);
  return Number.isFinite(n) ? n : def;
}
export function json<T>(fd: FormData, key: string, def: T): T {
  try {
    const v = str(fd, key, 2_000_000);
    return v ? (JSON.parse(v) as T) : def;
  } catch {
    return def;
  }
}
