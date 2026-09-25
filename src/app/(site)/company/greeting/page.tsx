import type { Metadata } from "next";
import { SubLayout } from "@/components/site/SubLayout";
import { getSetting } from "@/lib/settings";

export const revalidate = 3600;
export const metadata: Metadata = { title: "인사말" };

export default async function GreetingPage() {
  const g = await getSetting("greeting");
  return (
    <SubLayout section="COMPANY" activeHref="/company/greeting" title="인사말" crumbs={["인사말"]}>
      <div className="title1">{g.title}</div>
      <div className="title2">
        <span className="point_color">{g.subtitle}</span>
      </div>
      <img className="bullet" src="/images/design/bullet.jpg" alt="" />
      <div className="title4 pre">{g.body}</div>
      {g.signImage && <div className="companysign" style={{ backgroundImage: `url(${g.signImage})` }} />}
      {g.image && <img className="wh100 tb25" src={g.image} alt="" />}
    </SubLayout>
  );
}
