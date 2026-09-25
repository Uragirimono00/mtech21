"use client";

import Link from "next/link";
import { useActionState } from "react";
import { writeQna, unlockQna, deleteQnaByUser, type QnaWriteState, type QnaUnlockState, type QnaDeleteState } from "./actions";

export function QnaWriteForm() {
  const [state, action, pending] = useActionState<QnaWriteState, FormData>(writeQna, {});
  return (
    <form action={action}>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{ display: "none" }} aria-hidden="true" />
      <div className="form-grid">
        <div className="field">
          <label htmlFor="q-author">
            이름<span className="req">*</span>
          </label>
          <input id="q-author" className="input" type="text" name="author" maxLength={50} required />
        </div>
        <div className="field">
          <label htmlFor="q-password">
            비밀번호<span className="req">*</span>
          </label>
          <input id="q-password" className="input" type="password" name="password" maxLength={50} required minLength={4} placeholder="4자 이상" />
        </div>
        <div className="field">
          <label htmlFor="q-phone">연락처</label>
          <input id="q-phone" className="input" type="tel" name="phone" maxLength={50} />
        </div>
        <div className="field">
          <label htmlFor="q-email">이메일</label>
          <input id="q-email" className="input" type="email" name="email" maxLength={200} />
        </div>
        <div className="field field--full">
          <label htmlFor="q-title">
            제목<span className="req">*</span>
          </label>
          <input id="q-title" className="input" type="text" name="title" maxLength={200} required />
        </div>
        <div className="field field--full">
          <label htmlFor="q-content">
            내용<span className="req">*</span>
          </label>
          <textarea id="q-content" className="textarea" name="content" required />
        </div>
        <div className="field field--full">
          <label className="check">
            <input type="checkbox" name="isSecret" /> 비밀글로 등록 (비밀번호를 아는 사람만 열람)
          </label>
        </div>
      </div>
      {state.error && <div className="alert alert--err">{state.error}</div>}
      <div className="form-actions">
        <Link href="/customer/qna" className="btn btn--ghost">
          취소
        </Link>
        <button type="submit" className="btn btn--primary" disabled={pending}>
          {pending ? "등록 중..." : "질문 등록"} <span className="arrow">→</span>
        </button>
      </div>
    </form>
  );
}

export function QnaSecretView({ id, initialAnswer }: { id: number; initialAnswer: string | null }) {
  const [state, action, pending] = useActionState<QnaUnlockState, FormData>(unlockQna, {});
  if (state.unlocked) {
    return (
      <>
        <div className="post__body">{state.unlocked.content}</div>
        {state.unlocked.answer && (
          <div className="answer">
            <div className="answer__label">Answer</div>
            <div className="answer__body">{state.unlocked.answer}</div>
          </div>
        )}
      </>
    );
  }
  return (
    <div className="lock-box">
      <div className="lock-box__icon">🔒</div>
      <p>비밀글입니다. 작성 시 입력한 비밀번호를 입력해주세요.</p>
      {initialAnswer !== null && <p style={{ color: "var(--accent)", marginTop: 6 }}>답변이 등록된 글입니다.</p>}
      <form action={action}>
        <input type="hidden" name="id" value={id} />
        <input type="password" name="password" className="input input--sm" placeholder="비밀번호" required aria-label="비밀번호" />
        <button type="submit" className="btn btn--dark btn--sm" disabled={pending}>
          확인
        </button>
      </form>
      {state.error && <div className="alert alert--err">{state.error}</div>}
    </div>
  );
}

export function QnaDeleteForm({ id }: { id: number }) {
  const [state, action, pending] = useActionState<QnaDeleteState, FormData>(deleteQnaByUser, {});
  return (
    <form action={action} className="inline-form">
      <input type="hidden" name="id" value={id} />
      <input type="password" name="password" className="input input--sm" placeholder="비밀번호" required aria-label="삭제 비밀번호" style={{ width: 140 }} />
      <button type="submit" className="btn btn--danger btn--sm" disabled={pending}>
        삭제
      </button>
      {state.error && <span style={{ color: "#a3261a", fontSize: 13 }}>{state.error}</span>}
    </form>
  );
}
