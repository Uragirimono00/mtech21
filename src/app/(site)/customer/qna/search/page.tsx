import type { Metadata } from "next";
import { parseBoardQuery } from "@/components/site/BoardList";
import { QnaBoard } from "../QnaBoard";

export const metadata: Metadata = { title: "질문게시판" };

/** 페이지 이동·검색 (요청 시 렌더링) */
export default async function QnaSearchPage({ searchParams }: PageProps<"/customer/qna/search">) {
  const { page, search } = parseBoardQuery(await searchParams);
  return <QnaBoard page={page} search={search} />;
}
