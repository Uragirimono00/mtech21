import type { Metadata } from "next";
import { SubLayout } from "@/components/site/SubLayout";
import { getSetting } from "@/lib/settings";

export const revalidate = 3600;
export const metadata: Metadata = { title: "인사말" };

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
