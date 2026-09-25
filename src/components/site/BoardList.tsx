import Link from "next/link";
import type { ReactNode } from "react";

export type BoardRow = {
  id: number;
  href: string;
  title: ReactNode;
  author: string;
  date: string;
  isNotice?: boolean;
};

type Props = {
  rows: BoardRow[];
  total: number;
  page: number;
  pages: number;
  basePath: string;
  search: { field: string; value: string };
  writeHref?: string;
  emptyText?: string;
};

function pageHref(basePath: string, page: number, search: { field: string; value: string }) {
  const sp = new URLSearchParams();
  if (page > 1) sp.set("page", String(page));
  if (search.value) {
    sp.set("field", search.field);
    sp.set("q", search.value);
  }
  const qs = sp.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function BoardList({ rows, total, page, pages, basePath, search, writeHref, emptyText = "등록된 글이 없습니다." }: Props) {
  const PAGE_SIZE = 15;
  const start = total - (page - 1) * PAGE_SIZE;
  const groupStart = Math.floor((page - 1) / 10) * 10 + 1;
  const groupEnd = Math.min(groupStart + 9, pages);

  return (
    <>
      <div className="board">
        <div className="board__row board__row--head" aria-hidden="true">
          <div className="board__num">No.</div>
          <div>Title</div>
          <div className="board__author">Writer</div>
          <div className="board__date">Date</div>
        </div>
        {rows.length === 0 && <div className="board__empty">{emptyText}</div>}
        {rows.map((r, i) => (
          <div className="board__row" key={r.id}>
            <div className="board__num">{r.isNotice ? <span className="tag tag--ink">공지</span> : start - i}</div>
            <div className="board__title">
              <Link href={r.href}>{r.title}</Link>
            </div>
            <div className="board__author">{r.author}</div>
            <div className="board__date">{r.date}</div>
          </div>
        ))}
      </div>

      <div className="board__foot">
        <nav className="pager" aria-label="페이지">
          {groupStart > 1 && <Link href={pageHref(basePath, groupStart - 1, search)}>«</Link>}
          {Array.from({ length: groupEnd - groupStart + 1 }, (_, i) => groupStart + i).map((p) =>
            p === page ? (
              <b key={p} aria-current="page">
                {p}
              </b>
            ) : (
              <Link key={p} href={pageHref(basePath, p, search)}>
                {p}
              </Link>
            ),
          )}
          {groupEnd < pages && <Link href={pageHref(basePath, groupEnd + 1, search)}>»</Link>}
        </nav>
        <div className="inline-form">
          <form method="get" action={basePath} className="search">
            <select name="field" defaultValue={search.field} className="select select--sm" aria-label="검색 항목">
              <option value="subject">제목</option>
              <option value="description">내용</option>
              <option value="writer">작성자</option>
            </select>
            <input type="text" name="q" defaultValue={search.value} placeholder="검색어" className="input input--sm" aria-label="검색어" />
            <button type="submit" className="btn btn--dark btn--sm">
              검색
            </button>
          </form>
          {writeHref && (
            <Link href={writeHref} className="btn btn--primary btn--sm">
              글쓰기
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

export function parseBoardQuery(sp: { [key: string]: string | string[] | undefined }) {
  const page = Math.max(1, parseInt(String(sp.page ?? "1"), 10) || 1);
  const field = ["subject", "description", "writer"].includes(String(sp.field)) ? String(sp.field) : "subject";
  const value = String(sp.q ?? "").trim().slice(0, 100);
  return { page, search: { field, value } };
}
