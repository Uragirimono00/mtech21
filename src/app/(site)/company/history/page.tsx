import type { Metadata } from "next";
import { SubLayout } from "@/components/site/SubLayout";
import { getHistory } from "@/lib/data";
import { getSetting } from "@/lib/settings";

export const revalidate = 3600;
export const metadata: Metadata = { title: "연혁" };

export default async function HistoryPage() {
  const [items, meta] = await Promise.all([getHistory(), getSetting("history")]);

  // 연도별 묶기 (등록 순서 유지)
  const years: { year: string; items: typeof items }[] = [];
  for (const it of items) {
    const last = years[years.length - 1];
    if (last && last.year === it.year) last.items.push(it);
    else years.push({ year: it.year, items: [it] });
  }

  return (
    <SubLayout section="COMPANY" activeHref="/company/history" title="회사연혁" crumbs={["연혁"]} innerClass="m_padding">
      <div className="title1">
        <span className="point_color">{meta.title}</span>
      </div>
      <div className="title4 mt10">{meta.subtitle}</div>
      {years.map((y, i) => (
        <div className={i === 0 ? "history border2 mt25" : "history"} key={y.year + i}>
          <div className="title1 fl">{y.year}</div>
          <ol className="title5">
            {y.items.map((it) => (
              <li key={it.id}>
                <p className="title4 point_color">{it.month}</p>
                <span className="pre">{it.content}</span>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </SubLayout>
  );
}
