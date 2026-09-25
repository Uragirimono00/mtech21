import type { Metadata } from "next";
import { SubLayout } from "@/components/site/SubLayout";
import { getSetting } from "@/lib/settings";

export const revalidate = 3600;
export const metadata: Metadata = { title: "오시는길" };

export default async function LocationPage() {
  const loc = await getSetting("location");
  return (
    <SubLayout section="COMPANY" activeHref="/company/location" title="오시는길" crumbs={["오시는길"]}>
      {loc.mapEmbedUrl && (
        <div className="map">
          <iframe src={loc.mapEmbedUrl} width="600" height="450" style={{ border: 0 }} allowFullScreen loading="lazy" title="지도" />
        </div>
      )}
      <div className="add">
        <div className="title3 fontB">주소 및 연락처</div>
        <img className="bullet" src="/images/design/bullet.jpg" alt="" />
        <div className="title5">주소 : {loc.address}</div>
        <div className="title5">전화 : {loc.phone}</div>
        <div className="title5">이메일 : {loc.email}</div>
      </div>
      <div className="border1 tb25" />
      <div>
        <div className="title3 fontB">오시는 방법</div>
        <img className="bullet" src="/images/design/bullet.jpg" alt="" />
        {loc.directions.map((d, i) => (
          <div className="title5" key={i}>
            {d.label} : {d.text}
          </div>
        ))}
      </div>
    </SubLayout>
  );
}
