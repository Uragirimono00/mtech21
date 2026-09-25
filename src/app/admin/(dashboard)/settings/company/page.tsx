import { getSettings } from "@/lib/settings";
import { ActionForm } from "@/components/admin/ActionForm";
import { FileField } from "@/components/admin/ui";
import { saveCompanySettings } from "@/app/admin/actions/content";

export default async function CompanySettingsPage() {
  const { company, site } = await getSettings(["company", "site"]);
  return (
    <div>
      <h1 className="mb-5 text-xl font-semibold">회사정보 · 푸터 · 사이트</h1>
      <ActionForm action={saveCompanySettings}>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card">
            <h2 className="mb-3 font-semibold">회사 정보 (푸터에 표시)</h2>
            <div className="field">
              <label>상호명</label>
              <input type="text" name="name" defaultValue={company.name} />
            </div>
            <div className="field">
              <label>영문 상호</label>
              <input type="text" name="nameEn" defaultValue={company.nameEn} />
            </div>
            <div className="field">
              <label>대표이사</label>
              <input type="text" name="ceo" defaultValue={company.ceo} />
            </div>
            <div className="field">
              <label>전화</label>
              <input type="text" name="phone" defaultValue={company.phone} />
            </div>
            <div className="field">
              <label>E-mail</label>
              <input type="text" name="email" defaultValue={company.email} />
            </div>
            <div className="field">
              <label>주소</label>
              <input type="text" name="address" defaultValue={company.address} />
            </div>
            <div className="field">
              <label>사업자등록번호 (비우면 푸터에 표시 안 함)</label>
              <input type="text" name="bizNo" defaultValue={company.bizNo} />
            </div>
            <div className="field">
              <label>저작권 문구</label>
              <input type="text" name="copyright" defaultValue={company.copyright} />
            </div>
          </div>
          <div className="card">
            <h2 className="mb-3 font-semibold">사이트 기본</h2>
            <div className="field">
              <label>사이트 제목 (브라우저 탭)</label>
              <input type="text" name="siteTitle" defaultValue={site.title} />
            </div>
            <div className="field">
              <label>사이트 설명 (검색엔진용)</label>
              <textarea name="siteDescription" defaultValue={site.description} style={{ minHeight: 70 }} />
            </div>
            <FileField name="logo" label="로고 이미지 (139×39)" defaultValue={site.logo} folder="design" accept="image/*" />
            <FileField name="subVisual" label="서브페이지 상단 비주얼 (1920×150)" defaultValue={site.subVisual} folder="design" accept="image/*" />
          </div>
        </div>
      </ActionForm>
    </div>
  );
}
