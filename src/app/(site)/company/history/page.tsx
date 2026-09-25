import type { Metadata } from "next";
import { SubLayout } from "@/components/site/SubLayout";
import { getHistory } from "@/lib/data";
import { getSetting } from "@/lib/settings";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "연혁 | 회사소개",
  description: "1995년 에스콘 엔지니어링 설립부터 신호변환기·지시계·유량계 개발과 공급, 다중 복합환경센서 개발용역까지 엠테크의 연혁을 소개합니다.",
  alternates: { canonical: "/company/history" },
};

export default async function HistoryPage() {
  const [items, meta] = await Promise.all([getHistory(), getSetting("history")]);

  const years: { year: string; items: typeof items }[] = [];
  for (const it of items) {
    const last = years[years.length - 1];
    if (last && last.year === it.year) last.items.push(it);
    else years.push({ year: it.year, items: [it] });
  }

  return (
    <SubLayout section="COMPANY" activeHref="/company/history" title="연혁" crumbs={[{ label: "연혁" }]}>
      <div className="intro">
        <span className="eyebrow">{meta.title}</span>
        <h2 style={{ marginTop: 10 }}>{meta.subtitle}</h2>
        <p className="intro__desc">1995년 설립 이후 계측·제어 분야에서 쌓아온 발자취입니다.</p>
      </div>
      <div className="timeline">
        {years.map((y, i) => (
          <div className="timeline__year" key={y.year + i}>
            <div className="timeline__y">{y.year}</div>
            <div className="timeline__items">
              {y.items.map((it) => (
                <div className="timeline__item" key={it.id}>
                  <span className="timeline__m">{it.month || "—"}</span>
                  <span>{it.content}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SubLayout>
  );
}
