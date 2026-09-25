import "server-only";
import { prisma } from "./prisma";
import seed from "../../prisma/seed-data.json";
import type { SettingKey, SettingsMap } from "./types";

const defaults = seed.settings as unknown as SettingsMap;

/** 설정 1개 조회 (DB에 없으면 시드 기본값) */
export async function getSetting<K extends SettingKey>(key: K): Promise<SettingsMap[K]> {
  const row = await prisma.setting.findUnique({ where: { key } });
  const value = (row?.value ?? {}) as Partial<SettingsMap[K]>;
  return { ...defaults[key], ...value } as SettingsMap[K];
}

/** 여러 설정 한 번에 조회 */
export async function getSettings<K extends SettingKey>(keys: K[]): Promise<Pick<SettingsMap, K>> {
  const rows = await prisma.setting.findMany({ where: { key: { in: keys } } });
  const map = new Map(rows.map((r) => [r.key, r.value]));
  const out = {} as Pick<SettingsMap, K>;
  for (const key of keys) {
    const value = (map.get(key) ?? {}) as Partial<SettingsMap[K]>;
    out[key] = { ...defaults[key], ...value } as SettingsMap[K];
  }
  return out;
}

export async function saveSetting<K extends SettingKey>(key: K, value: SettingsMap[K]) {
  await prisma.setting.upsert({
    where: { key },
    create: { key, value: value as object },
    update: { value: value as object },
  });
}

export function getDefaultSetting<K extends SettingKey>(key: K): SettingsMap[K] {
  return defaults[key];
}
