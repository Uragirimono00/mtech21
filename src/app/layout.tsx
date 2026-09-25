import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const SITE_NAME = "엠테크";
const DESCRIPTION = "유량계(전자기·와류·초음파·코리올리), 신호변환기, 디지털 지시계, 압력·레벨 전송기, 서지 보호기 등 산업용 계측·제어 제품을 개발·공급하는 엠테크(MTECH)입니다.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: `${SITE_NAME} | 유량계·신호변환기·산업전자 제어 솔루션`, template: `%s | ${SITE_NAME}` },
  description: DESCRIPTION,
  keywords: [
    "엠테크", "MTECH", "유량계", "전자기유량계", "와류식유량계", "초음파유량계", "코리올리유량계", "열식질량유량계", "PD유량계", "터빈유량계",
    "신호변환기", "컨버터", "디지털 지시계", "적산계", "압력전송기", "차압전송기", "레벨전송기", "레벨미터", "Flow Computer", "피뢰기", "서지 보호기", "Arrester",
    "M-METER", "계측기", "산업용 계측", "인천 부평 계측기",
  ],
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | 유량계·신호변환기·산업전자 제어 솔루션`,
    description: DESCRIPTION,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  formatDetection: { telephone: true, email: true, address: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={plexMono.variable}>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        {/* Pretendard: 한국어 웹에서 가장 널리 쓰이는 가변 폰트 (동적 서브셋) */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
