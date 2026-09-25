# 엠테크 (mtech21.co.kr) 웹사이트 — Next.js 마이그레이션

기존 카페24 빌더 기반 사이트(`http://www.mtech21.co.kr`)를 **Next.js 16 + React 19 + Prisma + PostgreSQL** 로 옮긴 프로젝트입니다.
공개 사이트의 모든 페이지(메인, 회사소개 3, 제품 카테고리 14, 제품 상세 29, 1:1문의, 공지사항, 질문게시판)와
콘텐츠를 직접 수정할 수 있는 **관리자 화면(`/admin`)** 을 포함합니다.

## 기술 스택

| 구분 | 내용 |
| --- | --- |
| 프레임워크 | Next.js 16 (App Router, Turbopack), React 19, TypeScript |
| 스타일 | 기존 사이트 CSS 이식(`src/app/globals.css`) + Tailwind v4 유틸리티(관리자 화면) |
| DB / ORM | PostgreSQL + Prisma 6 |
| 인증 | 관리자 전용 세션 쿠키(JWT, `jose`) + bcrypt 비밀번호 |
| 파일 업로드 | Vercel Blob (`BLOB_READ_WRITE_TOKEN` 있을 때) / 로컬 `public/uploads` (개발) |
| 배포 | Vercel |

## 폴더 구조

```
prisma/
  schema.prisma        # DB 스키마 (Category, Product, Notice, Qna, Inquiry, History, Slide, Setting, Admin)
  seed-data.json       # 기존 사이트에서 크롤링·변환한 초기 콘텐츠
  seed.ts              # 초기 데이터 시드 (이미 있는 항목은 건너뜀 → 관리자 수정분 보존)
public/
  images/{design,main,product,company}   # 기존 사이트 이미지
  pdf/                 # 제품 카탈로그 PDF 36개
src/
  app/(site)/          # 공개 사이트 페이지
  app/admin/           # 관리자 화면 (login, dashboard, CRUD)
  app/api/admin/upload # 파일 업로드 API
  components/site/     # Header, Footer, SubLayout, Slider, BoardList ...
  components/admin/    # 관리자 폼/편집기
  lib/                 # prisma, auth, settings, data, upload ...
  data/redirects.json  # 구 URL(/default/*.php) → 새 URL 영구 리다이렉트 목록
  proxy.ts             # /admin 접근 보호
```

## URL 구조

| 기존 | 새 주소 |
| --- | --- |
| `/default/` | `/` |
| `/default/company/company_01.php` … `03.php` | `/company/greeting`, `/company/history`, `/company/location` |
| `/default/product/product_magnetic.php` 등 | `/product/{카테고리 슬러그}` (magnetic, vortex, ultrasonic, coriolis, thermal, positive, mf, valve, transmitter, level, turbine, converter, indicator, arrester) |
| `/default/product/magnetic/mtm_200c.php` 등 | `/product/{카테고리}/{제품 슬러그}` (예: `/product/magnetic/mtm-200c`) |
| `/default/contact/contact_01.php` | `/contact` |
| `/default/customer/customer_01.php` | `/customer/notice` |
| `/default/customer/customer_02.php` | `/customer/qna` |

기존 주소로 들어와도 `next.config.ts` 의 redirects(308) 로 자동 이동합니다.

## 로컬 개발

```bash
npm install
cp .env.example .env      # DATABASE_URL, AUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD 설정
npm run db:push           # 테이블 생성
npm run db:seed           # 초기 콘텐츠 + 관리자 계정 생성
npm run dev               # http://localhost:3000
```

- 관리자: `http://localhost:3000/admin` (계정은 `.env` 의 `ADMIN_EMAIL` / `ADMIN_PASSWORD`, 로그인 후 **계정 설정**에서 변경)
- 로컬 PostgreSQL 이 없으면 Neon/Supabase 무료 DB 연결 문자열을 `DATABASE_URL` 에 넣어도 됩니다.

## Vercel 배포

1. GitHub 에 이 저장소를 올리고 Vercel 에서 **Import** 합니다.
2. Vercel 프로젝트 → **Storage** 에서 Postgres(Neon) 와 **Blob** 을 생성해 연결합니다.
   - 연결하면 `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN` 환경변수가 자동으로 추가됩니다.
   - Supabase 등 다른 Postgres 를 쓰려면 `DATABASE_URL` 만 직접 등록하면 됩니다.
3. **Settings → Environment Variables** 에 다음을 추가합니다.
   - `AUTH_SECRET` : 32자 이상 임의 문자열 (예: `openssl rand -base64 32`)
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD` : 최초 관리자 계정
4. **Deploy**. 빌드 스크립트가 `prisma db push` → 시드 → `next build` 를 순서대로 실행하므로 첫 배포에서 테이블 생성과 초기 콘텐츠 입력이 자동으로 끝납니다.
5. 도메인 연결: Vercel → Settings → Domains 에 `mtech21.co.kr`, `www.mtech21.co.kr` 추가 후, 카페24(또는 도메인 등록기관) DNS 에서 A 레코드 `76.76.21.21`, CNAME `www → cname.vercel-dns.com` 으로 변경합니다.

배포 후 `https://도메인/admin` 으로 로그인해 비밀번호를 바꿔주세요.

## 관리자 기능

- **제품 카테고리**: 메뉴명·페이지 제목·영문 제목·소개·설명 섹션(특징/적용/공통사양) 편집, 순서 변경, 공개/숨김
- **제품**: 카테고리별 제품 등록, 썸네일 업로드, 상세 섹션(HTML + 미리보기, 표 템플릿, 이미지/PDF 삽입), 복사, 순서 변경
- **공지사항 / 질문게시판(답변) / 1:1 문의(확인·메모)**
- **메인화면**(배너·소개 카드·고객센터), **메인 슬라이드**, **인사말**, **연혁**, **오시는길**(구글 지도), **페이지 문구·메뉴**, **회사정보·푸터·로고**
- **파일 업로드**, **계정 설정**(이메일/비밀번호 변경)

저장하면 공개 사이트 캐시가 즉시 갱신됩니다.

## 스크립트

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 |
| `npm run build` | `prisma generate` → `db push` → seed → `next build` (Vercel 빌드에 사용) |
| `npm run db:push` | 스키마를 DB 에 반영 |
| `npm run db:seed` | 초기 데이터 시드 (idempotent) |
| `npm run db:studio` | Prisma Studio (DB GUI) |
| `npm run lint` | ESLint |
