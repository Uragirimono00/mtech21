import type { Metadata } from "next";
import { SubLayout } from "@/components/site/SubLayout";
import { getSetting } from "@/lib/settings";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "인사말 | 회사소개",
  description: "1995년 설립된 엠테크는 유량계·신호변환기·산업전자 제품을 개발하고 M-METER 브랜드로 직접 생산하며, 세계 유량계 전문 제조사의 제품을 국내 산업 현장에 공급합니다.",
  alternates: { canonical: "/company/greeting" },
};

export default async function GreetingPage() {
  const g = await getSetting("greeting");
  return (
    <SubLayout section="COMPANY" activeHref="/company/greeting" title="인사말" crumbs={[{ label: "인사말" }]}>
      <div className="intro">
        <span className="eyebrow">Greeting</span>
        <h2 style={{ marginTop: 10 }}>{g.title}</h2>
        <p className="intro__sub">{g.subtitle}</p>
      </div>
      <div className="greeting__body">{g.body}</div>
      {g.signImage && (
        <div className="greeting__sign">
          <img src={g.signImage} alt="대표 서명" />
        </div>
      )}
      {g.image && (
        <div className="greeting__photo">
          <img src={g.image} alt="" />
        </div>
      )}
    </SubLayout>
  );
}
