"use client";

import { useActionState, type ReactNode } from "react";

export type ActionState = { error?: string; ok?: boolean; message?: string };

/** 서버 액션 폼 래퍼: 에러/성공 메시지 + 제출 버튼 */
export function ActionForm({
  action,
  children,
  submitLabel = "저장",
  className = "",
  extra,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  children: ReactNode;
  submitLabel?: string;
  className?: string;
  /** 제출 버튼 옆에 표시할 요소 (취소 링크 등) */
  extra?: ReactNode;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, {});
  return (
    <form action={formAction} className={className}>
      {state.error && <div className="msg err">{state.error}</div>}
      {state.ok && <div className="msg ok">{state.message ?? "저장되었습니다."}</div>}
      {children}
      <div className="mt-5 flex items-center gap-2">
        <button type="submit" className="btn primary" disabled={pending}>
          {pending ? "저장중..." : submitLabel}
        </button>
        {extra}
      </div>
    </form>
  );
}
