import { getSetting } from "@/lib/settings";
import { ActionForm } from "@/components/admin/ActionForm";
import { saveLocationSettings } from "@/app/admin/actions/content";

export default async function LocationSettingsPage() {
  const loc = await getSetting("location");
  return (
    <div>
      <h1 className="mb-5 text-xl font-semibold">오시는길</h1>
      <ActionForm action={saveLocationSettings}>
        <div className="card">
          <div className="field">
            <label>구글 지도 삽입 URL</label>
            <textarea name="mapEmbedUrl" defaultValue={loc.mapEmbedUrl} style={{ minHeight: 90 }} />
            <div className="help">
              Google 지도 → 공유 → &quot;지도 퍼가기&quot; 의 iframe 코드 전체 또는 src URL을 붙여넣으세요.
            </div>
          </div>
          <div className="field">
            <label>주소</label>
            <input type="text" name="address" defaultValue={loc.address} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="field">
              <label>전화</label>
              <input type="text" name="phone" defaultValue={loc.phone} />
            </div>
            <div className="field">
              <label>이메일</label>
              <input type="text" name="email" defaultValue={loc.email} />
            </div>
          </div>
          <div className="field">
            <label>오시는 방법</label>
            <textarea name="directions" defaultValue={loc.directions.map((d) => `${d.label} : ${d.text}`).join("\n")} />
            <div className="help">한 줄에 하나씩 &quot;구분 : 내용&quot; 형식으로 입력 (예: 지하철 : 인천1호선 갈산역 하차 ...)</div>
          </div>
        </div>
      </ActionForm>
    </div>
  );
}
