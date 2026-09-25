"use client";

import Link from "next/link";
import { useActionState } from "react";
import { writeQna, unlockQna, deleteQnaByUser, type QnaWriteState, type QnaUnlockState, type QnaDeleteState } from "./actions";

export function QnaWriteForm() {
  const [state, action, pending] = useActionState<QnaWriteState, FormData>(writeQna, {});
  return (
    <form action={action}>
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
              <input type="text" name="author" maxLength={50} required />
            </td>
          </tr>
          <tr>
            <td className="formmail_title_bgcolor">비밀번호</td>
            <td className="formmail_cell_bgcolor">
              <input type="password" name="password" maxLength={50} required minLength={4} />
            </td>
          </tr>
          <tr>
            <td className="formmail_title_bgcolor">연락처</td>
            <td className="formmail_cell_bgcolor">
              <input type="tel" name="phone" maxLength={50} />
            </td>
          </tr>
          <tr>
            <td className="formmail_title_bgcolor">이메일</td>
            <td className="formmail_cell_bgcolor">
              <input type="email" name="email" maxLength={200} />
            </td>
          </tr>
          <tr>
            <td className="formmail_title_bgcolor">제목</td>
            <td className="formmail_cell_bgcolor">
              <input type="text" name="title" maxLength={200} required />
            </td>
          </tr>
          <tr>
            <td className="formmail_title_bgcolor">내용</td>
            <td className="formmail_cell_bgcolor">
              <textarea name="content" required />
            </td>
          </tr>
          <tr>
            <td className="formmail_title_bgcolor">비밀글</td>
            <td className="formmail_cell_bgcolor">
              <label style={{ cursor: "pointer" }}>
                <input type="checkbox" name="isSecret" style={{ width: "auto", height: "auto" }} /> 비밀글로 등록 (비밀번호를 아는 사람만 열람)
              </label>
            </td>
          </tr>
        </tbody>
      </table>
      {state.error && <div className="form_msg err">{state.error}</div>}
      <div className="form_btn">
        <button type="submit" className="ok" disabled={pending}>
          {pending ? "등록중..." : "등록"}
        </button>
        <Link href="/customer/qna" className="cancel">
          취소
        </Link>
      </div>
    </form>
  );
}

export function QnaSecretView({ id, initialAnswer }: { id: number; initialAnswer: string | null }) {
  const [state, action, pending] = useActionState<QnaUnlockState, FormData>(unlockQna, {});
  if (state.unlocked) {
    return (
      <>
        <div className="board_view_content pre">{state.unlocked.content}</div>
        {state.unlocked.answer && (
          <div className="board_answer">
            <span className="label">답변</span>
            <div className="pre">{state.unlocked.answer}</div>
          </div>
        )}
      </>
    );
  }
  return (
    <form action={action} className="board_view_content" style={{ textAlign: "center" }}>
      <input type="hidden" name="id" value={id} />
      <p style={{ marginBottom: 10 }}>🔒 비밀글입니다. 작성 시 입력한 비밀번호를 입력해주세요.</p>
      <input type="password" name="password" required style={{ height: 30, border: "1px solid #ccc", padding: "0 8px" }} />{" "}
      <button type="submit" className="board_write_btn" disabled={pending} style={{ height: 30, lineHeight: "30px" }}>
        확인
      </button>
      {state.error && <div className="form_msg err">{state.error}</div>}
      {initialAnswer !== null && <p style={{ marginTop: 10, color: "#b3917c" }}>답변이 등록된 글입니다.</p>}
    </form>
  );
}

export function QnaDeleteForm({ id }: { id: number }) {
  const [state, action, pending] = useActionState<QnaDeleteState, FormData>(deleteQnaByUser, {});
  return (
    <form action={action} style={{ display: "inline-block", marginLeft: 8 }}>
      <input type="hidden" name="id" value={id} />
      <input type="password" name="password" placeholder="비밀번호" required style={{ height: 30, border: "1px solid #ccc", padding: "0 8px", width: 110 }} />{" "}
      <button type="submit" className="danger" disabled={pending} style={{ height: 32, lineHeight: "32px", padding: "0 12px", borderRadius: 2, border: "1px solid #c33", color: "#c33", background: "#fff", fontSize: 12 }}>
        삭제
      </button>
      {state.error && <span style={{ color: "#a33", fontSize: 12, marginLeft: 6 }}>{state.error}</span>}
    </form>
  );
}
