/**
 * 초기 데이터 시드: 기존 mtech21.co.kr 사이트에서 옮겨온 콘텐츠(seed-data.json)를 DB에 넣습니다.
 * - 이미 존재하는 항목(slug 기준)은 덮어쓰지 않습니다 (관리자 수정분 보존).
 * - 관리자 계정은 ADMIN_EMAIL / ADMIN_PASSWORD 환경변수로 생성됩니다.
 *
 * 실행: npm run db:seed
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import data from "./seed-data.json";

const prisma = new PrismaClient();

async function main() {
  // 관리자
  const email = (process.env.ADMIN_EMAIL ?? "admin@mtech21.co.kr").toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "mtech21admin!";
  const existingAdmin = await prisma.admin.findUnique({ where: { email } });
  if (!existingAdmin) {
    await prisma.admin.create({
      data: { email, passwordHash: await bcrypt.hash(password, 10), name: "관리자" },
    });
    console.log(`관리자 계정 생성: ${email}`);
  }

  // 설정
  for (const [key, value] of Object.entries(data.settings)) {
    const exists = await prisma.setting.findUnique({ where: { key } });
    if (!exists) {
      await prisma.setting.create({ data: { key, value: value as object } });
    }
  }
  // 디자인 개편(2026-09): 글자가 박힌 구 서브 비주얼을 쓰고 있으면 새 기본 이미지로 교체 (관리자가 바꾼 값은 유지)
  const siteRow = await prisma.setting.findUnique({ where: { key: "site" } });
  const siteVal = (siteRow?.value ?? {}) as { subVisual?: string };
  if (siteRow && (siteVal.subVisual === "/images/design/visual_mt1.jpg" || siteVal.subVisual === "/images/main/slider3.jpg")) {
    await prisma.setting.update({ where: { key: "site" }, data: { value: { ...siteVal, subVisual: data.settings.site.subVisual } } });
    console.log("서브 비주얼 이미지를 새 기본값으로 교체했습니다.");
  }

  // 슬라이드
  const existingSlides = await prisma.slide.findMany();
  // 디자인 개편(2026-09): 템플릿 제공 이미지(slider1~3.jpg)만 있고 문구가 없는 구형 슬라이드는 자사 제품 배너로 교체
  const legacyOnly = existingSlides.length > 0 && existingSlides.every((s) => /\/images\/main\/slider\d\.jpg$/.test(s.image) && !s.title);
  if (legacyOnly) {
    await prisma.slide.deleteMany({});
    console.log("템플릿 슬라이드를 새 배너로 교체했습니다.");
  }
  if (legacyOnly || existingSlides.length === 0) {
    for (const s of data.slides) {
      await prisma.slide.create({ data: s });
    }
  }

  // 연혁
  if ((await prisma.history.count()) === 0) {
    for (const h of data.history) {
      await prisma.history.create({ data: h });
    }
  }

  // 카테고리 + 제품
  const catIds = new Map<string, number>();
  for (const c of data.categories) {
    let cat = await prisma.category.findUnique({ where: { slug: c.slug } });
    if (!cat) {
      cat = await prisma.category.create({
        data: {
          slug: c.slug,
          name: c.name,
          title: c.title,
          engTitle: c.engTitle,
          intro: c.intro,
          sections: c.sections,
          sortOrder: c.sortOrder,
        },
      });
    }
    catIds.set(c.slug, cat.id);
  }
  for (const p of data.products) {
    const categoryId = catIds.get(p.categorySlug);
    if (!categoryId) continue;
    const exists = await prisma.product.findUnique({
      where: { categoryId_slug: { categoryId, slug: p.slug } },
    });
    if (!exists) {
      await prisma.product.create({
        data: {
          categoryId,
          slug: p.slug,
          name: p.name,
          subtitle: p.subtitle,
          thumbnail: p.thumbnail,
          sections: p.sections,
          sortOrder: p.sortOrder,
        },
      });
    }
  }

  console.log(
    `시드 완료: 카테고리 ${await prisma.category.count()}개, 제품 ${await prisma.product.count()}개, 연혁 ${await prisma.history.count()}건, 슬라이드 ${await prisma.slide.count()}개`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
