"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});
  return (
    <form action={action}>
      <input type="hidden" name="next" value={next} />
      <div className="field">
        <label htmlFor="email">이메일</label>
        <input id="email" type="email" name="email" autoComplete="username" required autoFocus />
      </div>
      <div className="field">
        <label htmlFor="password">비밀번호</label>
        <input id="password" type="password" name="password" autoComplete="current-password" required />
      </div>
      {state.error && <div className="msg err">{state.error}</div>}
      <button type="submit" className="btn primary w-full justify-center" disabled={pending}>
        {pending ? "로그인 중..." : "로그인"}
      </button>
    </form>
  );
}
