import { getSettings } from "@/lib/settings";
import { ActionForm } from "@/components/admin/ActionForm";
import { savePageSettings } from "@/app/admin/actions/content";

export default async function PageSettingsPage() {
  const { contact, notice, qna, history, menu } = await getSettings(["contact", "notice", "qna", "history", "menu"]);
  return (
    <div>
      <h1 className="mb-5 text-xl font-semibold">페이지 문구 · 메뉴</h1>
      <ActionForm action={savePageSettings}>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card">
            <h2 className="mb-3 font-semibold">1:1 문의</h2>
            <div className="field">
              <label>제목</label>
              <input type="text" name="contact_title" defaultValue={contact.title} />
            </div>
            <div className="field">
              <label>부제</label>
              <input type="text" name="contact_subtitle" defaultValue={contact.subtitle} />
            </div>
            <div className="field">
              <label>문의 알림 받을 이메일 (참고용)</label>
              <input type="text" name="contact_notifyEmail" defaultValue={contact.notifyEmail} />
            </div>
            <div className="field">
              <label>개인정보 수집·이용 안내문</label>
              <textarea name="contact_privacy" defaultValue={contact.privacy} style={{ minHeight: 200 }} />
            </div>
          </div>
          <div>
            <div className="card mb-6">
              <h2 className="mb-3 font-semibold">공지사항</h2>
              <div className="field">
                <label>제목</label>
                <input type="text" name="notice_title" defaultValue={notice.title} />
              </div>
              <div className="field">
                <label>부제</label>
                <input type="text" name="notice_subtitle" defaultValue={notice.subtitle} />
              </div>
            </div>
            <div className="card mb-6">
              <h2 className="mb-3 font-semibold">질문게시판</h2>
              <div className="field">
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="showQna" defaultChecked={menu.showQna} style={{ width: "auto" }} /> 상단 메뉴(CUSTOMER)에 질문게시판 표시
                </label>
                <div className="help">체크 해제 시 메뉴에서만 숨겨지고, 메인 화면의 Q&amp;A 버튼과 주소(/customer/qna)로는 접근 가능합니다.</div>
              </div>
              <div className="field">
                <label>제목</label>
                <input type="text" name="qna_title" defaultValue={qna.title} />
              </div>
              <div className="field">
                <label>부제</label>
                <input type="text" name="qna_subtitle" defaultValue={qna.subtitle} />
              </div>
            </div>
            <div className="card">
              <h2 className="mb-3 font-semibold">연혁 페이지</h2>
              <div className="field">
                <label>제목</label>
                <input type="text" name="history_title" defaultValue={history.title} />
              </div>
              <div className="field">
                <label>부제</label>
                <input type="text" name="history_subtitle" defaultValue={history.subtitle} />
              </div>
            </div>
          </div>
        </div>
      </ActionForm>
    </div>
  );
}
