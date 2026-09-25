"use client";

import { useState } from "react";

/** 공지사항 등 단일 HTML 본문 편집기 (소스 + 미리보기 + 이미지 삽입) */
export function HtmlEditor({ name, defaultValue = "", folder = "notices" }: { name: string; defaultValue?: string; folder?: string }) {
  const [value, setValue] = useState(defaultValue);
  const [preview, setPreview] = useState(false);

  async function insertUpload(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const json = await res.json();
    if (!res.ok) {
      alert(json.error || "업로드 실패");
      return;
    }
    const snippet = file.type === "application/pdf" ? `<p><a href="${json.url}" target="_blank">📎 ${file.name}</a></p>` : `<p><img src="${json.url}" alt="" /></p>`;
    setValue((v) => (v ? v + "\n" + snippet : snippet));
  }

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
        <label className="btn sm" style={{ marginBottom: 0 }}>
          이미지/파일 삽입
          <input
            type="file"
            accept="image/*,application/pdf"
            style={{ display: "none" }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) insertUpload(f);
              e.target.value = "";
            }}
          />
        </label>
        <button type="button" className="btn sm" onClick={() => setValue((v) => v + "\n<p></p>")}>
          문단 추가
        </button>
        <button type="button" className="btn sm" onClick={() => setPreview((p) => !p)}>
          {preview ? "미리보기 닫기" : "미리보기"}
        </button>
        <span className="help">HTML 태그를 사용할 수 있습니다. 일반 텍스트만 입력해도 줄바꿈이 유지됩니다.</span>
      </div>
      <textarea name={name} className="code" value={value} onChange={(e) => setValue(e.target.value)} spellCheck={false} />
      {preview && (
        <div className="preview mt-2">
          <div className="board_view_content" style={{ whiteSpace: "pre-line" }} dangerouslySetInnerHTML={{ __html: value }} />
        </div>
      )}
    </div>
  );
}
