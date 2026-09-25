import type { Metadata } from "next";
import { SubLayout } from "@/components/site/SubLayout";
import { getSetting } from "@/lib/settings";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "오시는길 | 회사소개",
  description: "엠테크 위치 안내: 인천광역시 부평구 안남로 425-10 4층 (청천동). 인천지하철 1호선 갈산역 인근. 전화 010-3717-2879.",
  alternates: { canonical: "/company/location" },
};

export default async function LocationPage() {
  const loc = await getSetting("location");
  const tel = loc.phone.replace(/[^0-9+]/g, "");
  return (
    <SubLayout section="COMPANY" activeHref="/company/location" title="오시는길" crumbs={[{ label: "오시는길" }]}>
      {loc.mapEmbedUrl && (
        <div className="map-card">
          <iframe src={loc.mapEmbedUrl} allowFullScreen loading="lazy" title="회사 위치 지도" referrerPolicy="no-referrer-when-downgrade" />
        </div>
      )}
      <div className="info-grid">
        <div className="info-item">
          <div className="k">Address</div>
          <div className="v">{loc.address}</div>
        </div>
        <div className="info-item">
          <div className="k">Tel</div>
          <div className="v">
            <a href={`tel:${tel}`}>{loc.phone}</a>
          </div>
        </div>
        <div className="info-item">
          <div className="k">Email</div>
          <div className="v">
            <a href={`mailto:${loc.email}`}>{loc.email}</a>
          </div>
        </div>
      </div>
      {loc.directions.length > 0 && (
        <div className="directions">
          <h3>오시는 방법</h3>
          <ul>
            {loc.directions.map((d, i) => (
              <li key={i}>
                <span className="k">{d.label}</span>
                <span>{d.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </SubLayout>
  );
}
