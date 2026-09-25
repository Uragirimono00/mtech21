"use client";

import { useState } from "react";

type Section = { title: string; body: string };

/**
 * 섹션 목록 편집기 (제목 + 본문). hidden input(name)에 JSON으로 직렬화.
 * mode="html": 제품 상세용 (HTML 소스 + 미리보기, 이미지/PDF 삽입)
 * mode="text": 카테고리 설명용 (줄바꿈 텍스트)
 */
export function SectionsEditor({
  name,
  initial,
  mode,
  bodyKey = "body",
}: {
  name: string;
  initial: { title: string; body?: string; html?: string }[];
  mode: "html" | "text";
  bodyKey?: "body" | "html";
}) {
  const [sections, setSections] = useState<Section[]>(
    initial.map((s) => ({ title: s.title ?? "", body: (s.html ?? s.body ?? "") as string })),
  );
  const [previewIdx, setPreviewIdx] = useState<number | null>(null);

  const serialized = JSON.stringify(sections.map((s) => ({ title: s.title, [bodyKey]: s.body })));

  function update(i: number, patch: Partial<Section>) {
    setSections((prev) => prev.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  }
  function move(i: number, dir: -1 | 1) {
    setSections((prev) => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }
  function remove(i: number) {
    if (!confirm("이 섹션을 삭제할까요?")) return;
    setSections((prev) => prev.filter((_, j) => j !== i));
  }
  function add() {
    setSections((prev) => [...prev, { title: "", body: "" }]);
  }

  async function insertUpload(i: number, file: File) {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "products");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const json = await res.json();
    if (!res.ok) {
      alert(json.error || "업로드 실패");
      return;
    }
    const url: string = json.url;
    const snippet = file.type === "application/pdf"
      ? `<a href="${url}" target="_blank"><img src="/images/design/icon_pdf.gif" height="18" width="18" align="absmiddle" alt="PDF" /></a>`
      : `<img src="${url}" alt="" width="100%" />`;
    update(i, { body: sections[i].body ? sections[i].body + "\n" + snippet : snippet });
  }

  return (
    <div>
      <input type="hidden" name={name} value={serialized} />
      {sections.length === 0 && <div className="help mb-3">섹션이 없습니다. 아래 버튼으로 추가하세요.</div>}
      {sections.map((s, i) => (
        <div className="card mb-3" key={i}>
          <div className="mb-2 flex items-center gap-2">
            <span className="badge">섹션 {i + 1}</span>
            <input
              type="text"
              value={s.title}
              onChange={(e) => update(i, { title: e.target.value })}
              placeholder="섹션 제목 (예: Specification / 특징)"
              style={{ flex: 1 }}
            />
            <button type="button" className="btn sm" onClick={() => move(i, -1)} disabled={i === 0} title="위로">
              ↑
            </button>
            <button type="button" className="btn sm" onClick={() => move(i, 1)} disabled={i === sections.length - 1} title="아래로">
              ↓
            </button>
            <button type="button" className="btn sm danger" onClick={() => remove(i)}>
              삭제
            </button>
          </div>
          {mode === "html" ? (
            <>
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                <label className="btn sm" style={{ marginBottom: 0 }}>
                  이미지/PDF 삽입
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) insertUpload(i, f);
                      e.target.value = "";
                    }}
                  />
                </label>
                <button
                  type="button"
                  className="btn sm"
                  onClick={() =>
                    update(i, {
                      body:
                        s.body +
                        `\n<table class="rtable">\n<thead>\n<tr><th>항목</th><th>내용</th></tr>\n</thead>\n<tbody>\n<tr><td>-</td><td>-</td></tr>\n</tbody>\n</table>`,
                    })
                  }
                >
                  표 템플릿
                </button>
                <button
                  type="button"
                  className="btn sm"
                  onClick={() =>
                    update(i, {
                      body:
                        s.body +
                        `\n<table class="rtable rtable--flip">\n<thead>\n<tr><th>Model</th><th>Size</th></tr>\n</thead>\n<tbody>\n<tr><td>-</td><td>-</td></tr>\n</tbody>\n</table>`,
                    })
                  }
                >
                  사양표(세로) 템플릿
                </button>
                <button type="button" className="btn sm" onClick={() => setPreviewIdx(previewIdx === i ? null : i)}>
                  {previewIdx === i ? "미리보기 닫기" : "미리보기"}
                </button>
              </div>
              <textarea className="code" value={s.body} onChange={(e) => update(i, { body: e.target.value })} spellCheck={false} />
              {previewIdx === i && (
                <div className="preview mt-2">
                  <div className="product-html" dangerouslySetInnerHTML={{ __html: s.body }} />
                </div>
              )}
            </>
          ) : (
            <textarea value={s.body} onChange={(e) => update(i, { body: e.target.value })} placeholder="한 줄에 한 항목씩 입력 (줄바꿈이 그대로 표시됩니다)" />
          )}
        </div>
      ))}
      <button type="button" className="btn" onClick={add}>
        + 섹션 추가
      </button>
    </div>
  );
}
