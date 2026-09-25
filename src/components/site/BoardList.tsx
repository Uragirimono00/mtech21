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

/** 원본 게시판(카페24 board) 목록 마크업 재현 */
export function BoardList({ rows, total, page, pages, basePath, search, writeHref, emptyText = "등록된 글이 없습니다." }: Props) {
  const PAGE_SIZE = 15;
  const start = total - (page - 1) * PAGE_SIZE;
  const groupStart = Math.floor((page - 1) / 10) * 10 + 1;
  const groupEnd = Math.min(groupStart + 9, pages);

  return (
    <>
      <div className="table_02 title">
        <table className="board">
          <tbody>
            <tr>
              <td className="att_title bbsno">
                <span>번호</span>
              </td>
              <td className="att_title bbsnewf5">
                <span>제목</span>
              </td>
              <td className="att_title bbswriter">
                <span>작성자</span>
              </td>
              <td className="att_title bbsetc_dateof_write">
                <span>작성일자</span>
              </td>
            </tr>
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="board_empty">
                  {emptyText}
                </td>
              </tr>
            )}
            {rows.map((r, i) => (
              <tr key={r.id}>
                <td className="bbsno">{r.isNotice ? <b>공지</b> : start - i}</td>
                <td className="bbsnewf5">
                  <Link href={r.href} className={r.isNotice ? "notice_subject" : undefined}>
                    {r.title}
                  </Link>
                </td>
                <td className="bbswriter">{r.author}</td>
                <td className="bbsetc_dateof_write">{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="paging">
        {groupStart > 1 && <Link href={pageHref(basePath, groupStart - 1, search)}>&laquo;</Link>}
        {Array.from({ length: groupEnd - groupStart + 1 }, (_, i) => groupStart + i).map((p) =>
          p === page ? <b key={p}>{p}</b> : <Link key={p} href={pageHref(basePath, p, search)}>{p}</Link>,
        )}
        {groupEnd < pages && <Link href={pageHref(basePath, groupEnd + 1, search)}>&raquo;</Link>}
      </div>

      {writeHref && (
        <div className="board_write">
          <Link href={writeHref} className="board_write_btn">
            글쓰기
          </Link>
        </div>
      )}

      <div id="ext_search">
        <form method="get" action={basePath}>
          <table id="search_table" cellSpacing={0} cellPadding={2}>
            <tbody>
              <tr>
                <td className="est_cate_cell">
                  <select name="field" defaultValue={search.field} title="검색 항목">
                    <option value="subject">제목</option>
                    <option value="description">내용</option>
                    <option value="writer">작성자</option>
                  </select>
                </td>
                <td className="est_keyword_cell">
                  <input type="text" name="q" defaultValue={search.value} placeholder="검색어" title="검색어" />
                </td>
                <td className="est_btn_cell">
                  <button type="submit">검색</button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
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
