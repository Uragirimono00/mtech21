"use client";

import { useActionState, useRef } from "react";
import { submitInquiry, type InquiryState } from "./actions";

export function ContactForm({ privacy }: { privacy: string }) {
  const [state, action, pending] = useActionState<InquiryState, FormData>(submitInquiry, { ok: false });
  const formRef = useRef<HTMLFormElement>(null);

  if (state.submitted) {
    return (
      <div className="form_done">
        <div className="title2">문의가 접수되었습니다.</div>
        <div className="title5">빠른 시일 내에 답변 드리겠습니다. 감사합니다.</div>
      </div>
    );
  }

  return (
    <form ref={formRef} action={action} name="com_formmail">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{ display: "none" }} aria-hidden="true" />
      <table cellPadding={0} cellSpacing={0} className="form">
        <colgroup>
          <col width="130" />
          <col />
        </colgroup>
        <tbody>
          <tr>
            <td className="formmail_title_bgcolor">이름</td>
            <td className="formmail_cell_bgcolor">
              <input type="text" name="name" maxLength={100} required />
            </td>
          </tr>
          <tr>
            <td className="formmail_title_bgcolor">연락처</td>
            <td className="formmail_cell_bgcolor">
              <input type="tel" name="phone" maxLength={20} />
            </td>
          </tr>
          <tr>
            <td className="formmail_title_bgcolor">이메일</td>
            <td className="formmail_cell_bgcolor">
              <input type="email" name="email" maxLength={200} />
            </td>
          </tr>
          <tr>
            <td className="formmail_title_bgcolor">주소</td>
            <td className="formmail_cell_bgcolor">
              <input type="text" name="address" maxLength={300} />
            </td>
          </tr>
          <tr>
            <td className="formmail_title_bgcolor">내용</td>
            <td className="formmail_cell_bgcolor">
              <textarea name="content" className="formmail_textarea_style" required />
            </td>
          </tr>
          <tr>
            <td className="formmail_cell_bgcolor" colSpan={2} style={{ padding: 10 }}>
              <table cellSpacing={0} cellPadding={0} width="100%">
                <tbody>
                  <tr>
                    <td align="left" style={{ border: 0 }}>
                      · 개인정보의 수집 및 이용목적
                    </td>
                    <td align="right" style={{ border: 0 }}>
                      <label style={{ cursor: "pointer" }}>
                        <input type="checkbox" name="agree" /> 개인정보의 수집 및 이용목적에 동의합니다.
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2} style={{ border: 0 }}>
                      <textarea readOnly rows={9} defaultValue={privacy} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      {state.error && <div className="form_msg err">{state.error}</div>}
      <div className="form_btn">
        <button type="submit" className="ok" disabled={pending}>
          {pending ? "전송중..." : "확인"}
        </button>
        <button type="button" className="cancel" onClick={() => formRef.current?.reset()}>
          취소
        </button>
      </div>
    </form>
  );
}
