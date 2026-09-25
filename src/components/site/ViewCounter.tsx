"use client";

import { useEffect, useState } from "react";

/**
 * 조회수 표시 + 증가. 페이지가 정적 캐시되므로 카운트는 클라이언트에서 올리고,
 * 같은 브라우저 세션에서는 한 번만 집계한다.
 */
export function ViewCounter({ type, id, initial }: { type: "notice" | "qna"; id: number; initial: number }) {
  const [views, setViews] = useState(initial);

  useEffect(() => {
    const key = `viewed:${type}:${id}`;
    let seen = false;
    try {
      seen = sessionStorage.getItem(key) === "1";
    } catch {
      seen = false;
    }
    if (seen) return;
    const controller = new AbortController();
    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id }),
      signal: controller.signal,
      keepalive: true,
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (j && typeof j.views === "number") setViews(j.views);
        try {
          sessionStorage.setItem(key, "1");
        } catch {
          /* ignore */
        }
      })
      .catch(() => {});
    return () => controller.abort();
  }, [type, id]);

  return <span>VIEWS {views}</span>;
}
