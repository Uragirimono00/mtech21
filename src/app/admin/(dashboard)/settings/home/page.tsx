import { getSetting } from "@/lib/settings";
import { ActionForm } from "@/components/admin/ActionForm";
import { FileField } from "@/components/admin/ui";
import { saveHomeSettings } from "@/app/admin/actions/content";

export default async function HomeSettingsPage() {
  const home = await getSetting("home");
  const cards = [home.cards[0] ?? { title: "", subtitle: "", image: "", link: "" }, home.cards[1] ?? { title: "", subtitle: "", image: "", link: "" }];
  const buttons = [home.customerCenter.buttons[0] ?? { label: "", link: "" }, home.customerCenter.buttons[1] ?? { label: "", link: "" }];
  return (
    <div>
      <h1 className="mb-5 text-xl font-semibold">메인화면</h1>
      <p className="help mb-4">메인 슬라이드는 별도 메뉴(메인 슬라이드)에서 관리합니다.</p>
      <ActionForm action={saveHomeSettings}>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card">
            <h2 className="mb-3 font-semibold">메인 배너 (슬라이드 아래 왼쪽 큰 이미지)</h2>
            <FileField name="banner_image" label="배너 이미지 (654×196)" defaultValue={home.banner.image} folder="main" accept="image/*" />
            <div className="field">
              <label>클릭 시 이동 링크</label>
              <input type="text" name="banner_link" defaultValue={home.banner.link} placeholder="/product/vortex/mvt-3000f" />
            </div>
          </div>
          <div className="card">
            <h2 className="mb-3 font-semibold">고객센터 박스</h2>
            <div className="field">
              <label>제목</label>
              <input type="text" name="cc_title" defaultValue={home.customerCenter.title} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="field">
                <label>표시 전화번호</label>
                <input type="text" name="cc_phone" defaultValue={home.customerCenter.phone} placeholder="010. 3717. 2879" />
              </div>
              <div className="field">
                <label>모바일 전화연결 번호</label>
                <input type="text" name="cc_tel" defaultValue={home.customerCenter.tel} placeholder="010-3717-2879" />
              </div>
            </div>
            <div className="field">
              <label>운영시간</label>
              <input type="text" name="cc_hours" defaultValue={home.customerCenter.hours} />
            </div>
            {buttons.map((b, i) => (
              <div className="grid grid-cols-2 gap-3" key={i}>
                <div className="field">
                  <label>버튼 {i + 1} 문구</label>
                  <input type="text" name={`btn${i}_label`} defaultValue={b.label} />
                </div>
                <div className="field">
                  <label>버튼 {i + 1} 링크</label>
                  <input type="text" name={`btn${i}_link`} defaultValue={b.link} />
                </div>
              </div>
            ))}
            <div className="field">
              <label>뉴스 박스 제목</label>
              <input type="text" name="newsTitle" defaultValue={home.newsTitle} />
              <div className="help">뉴스 목록은 공지사항 최신 5건이 자동으로 표시됩니다.</div>
            </div>
          </div>
          {cards.map((c, i) => (
            <div className="card" key={i}>
              <h2 className="mb-3 font-semibold">소개 카드 {i + 1} {i === 0 ? "(왼쪽)" : "(오른쪽)"}</h2>
              <div className="field">
                <label>영문 제목</label>
                <input type="text" name={`card${i}_title`} defaultValue={c.title} placeholder="Flow Measurement" />
              </div>
              <div className="field">
                <label>한글 부제</label>
                <input type="text" name={`card${i}_subtitle`} defaultValue={c.subtitle} placeholder="유량계 제품소개" />
              </div>
              <FileField name={`card${i}_image`} label="이미지 (307×70)" defaultValue={c.image} folder="main" accept="image/*" />
              <div className="field">
                <label>링크</label>
                <input type="text" name={`card${i}_link`} defaultValue={c.link} placeholder="/product/magnetic" />
              </div>
            </div>
          ))}
        </div>
      </ActionForm>
    </div>
  );
}
