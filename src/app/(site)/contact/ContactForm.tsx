"use client";

import { useActionState, useRef } from "react";
import { submitInquiry, type InquiryState } from "./actions";

export function ContactForm({ privacy }: { privacy: string }) {
  const [state, action, pending] = useActionState<InquiryState, FormData>(submitInquiry, { ok: false });
  const formRef = useRef<HTMLFormElement>(null);

  if (state.submitted) {
    return (
      <div className="done">
        <div className="done__icon">✓</div>
        <h3>문의가 접수되었습니다.</h3>
        <p>빠른 시일 내에 답변 드리겠습니다. 감사합니다.</p>
      </div>
    );
  }

  return (
    <form ref={formRef} action={action} name="com_formmail" className="contact-form">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{ display: "none" }} aria-hidden="true" />
      <div className="form-grid">
        <div className="field">
          <label htmlFor="c-name">
            이름<span className="req">*</span>
          </label>
          <input id="c-name" className="input" type="text" name="name" maxLength={100} required placeholder="성함 또는 회사명" />
        </div>
        <div className="field">
          <label htmlFor="c-phone">연락처</label>
          <input id="c-phone" className="input" type="tel" name="phone" maxLength={20} placeholder="010-0000-0000" />
        </div>
        <div className="field">
          <label htmlFor="c-email">이메일</label>
          <input id="c-email" className="input" type="email" name="email" maxLength={200} placeholder="name@company.com" />
        </div>
        <div className="field">
          <label htmlFor="c-address">주소</label>
          <input id="c-address" className="input" type="text" name="address" maxLength={300} placeholder="선택 입력" />
        </div>
        <div className="field field--full">
          <label htmlFor="c-content">
            문의 내용<span className="req">*</span>
          </label>
          <textarea id="c-content" className="textarea" name="content" required placeholder="제품명, 규격, 수량, 사용 환경 등을 적어주시면 정확한 답변에 도움이 됩니다." />
        </div>
      </div>

      <div className="privacy">
        <div className="privacy__head">
          <span>개인정보의 수집 및 이용목적</span>
          <label className="check">
            <input type="checkbox" name="agree" /> 위 내용에 동의합니다.
          </label>
        </div>
        <div className="privacy__text">{privacy}</div>
      </div>

      {state.error && <div className="alert alert--err">{state.error}</div>}
      <div className="form-actions">
        <button type="button" className="btn btn--ghost" onClick={() => formRef.current?.reset()}>
          다시 작성
        </button>
        <button type="submit" className="btn btn--primary" disabled={pending}>
          {pending ? "전송 중..." : "문의 보내기"} <span className="arrow">→</span>
        </button>
      </div>
    </form>
  );
}
