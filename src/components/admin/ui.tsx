"use client";

import { useFormStatus } from "react-dom";
import { useState, type ReactNode } from "react";

export function SubmitButton({ children = "저장", className = "btn primary" }: { children?: ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending}>
      {pending ? "처리중..." : children}
    </button>
  );
}

/** confirm 후 서버액션 실행 (삭제 등) */
export function ConfirmForm({
  action,
  message = "정말 삭제하시겠습니까?",
  children,
  hidden = {},
  className = "inline",
  buttonClass = "btn sm danger",
}: {
  action: (formData: FormData) => void | Promise<void>;
  message?: string;
  children: ReactNode;
  hidden?: Record<string, string | number>;
  className?: string;
  buttonClass?: string;
}) {
  return (
    <form
      action={action}
      className={className}
      onSubmit={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {Object.entries(hidden).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <button type="submit" className={buttonClass}>
        {children}
      </button>
    </form>
  );
}

/** 파일 업로드 → URL 입력 필드 */
export function FileField({
  name,
  label,
  defaultValue = "",
  folder = "uploads",
  help,
  accept = "image/*,application/pdf",
  preview = true,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  folder?: string;
  help?: string;
  accept?: string;
  preview?: boolean;
}) {
  const [value, setValue] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setBusy(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "업로드 실패");
      setValue(json.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "업로드 실패");
    } finally {
      setBusy(false);
    }
  }

  const isImage = /\.(png|jpe?g|gif|webp|svg)(\?|$)/i.test(value) || value.startsWith("data:image");

  return (
    <div className="field">
      <label>{label}</label>
      <div className="flex items-center gap-2">
        <input type="text" name={name} value={value} onChange={(e) => setValue(e.target.value)} placeholder="/images/... 또는 업로드" />
        <label className="btn" style={{ marginBottom: 0 }}>
          {busy ? "업로드중..." : "파일 선택"}
          <input
            type="file"
            accept={accept}
            className="hidden"
            style={{ display: "none" }}
            disabled={busy}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
              e.target.value = "";
            }}
          />
        </label>
        {value && (
          <button type="button" className="btn sm" onClick={() => setValue("")}>
            지우기
          </button>
        )}
      </div>
      {error && <div className="msg err mt-2">{error}</div>}
      {help && <div className="help">{help}</div>}
      {preview && value && isImage && (
        <div className="mt-2">
          <img src={value} alt="" style={{ maxHeight: 120, maxWidth: "100%", border: "1px solid #eee", borderRadius: 4 }} />
        </div>
      )}
    </div>
  );
}
