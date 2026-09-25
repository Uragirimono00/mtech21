import type { Metadata } from "next";
import { parseBoardQuery } from "@/components/site/BoardList";
import { NoticeBoard } from "../NoticeBoard";

export const metadata: Metadata = { title: "공지사항" };

/** 페이지 이동·검색 (요청 시 렌더링) */
export default async function NoticeSearchPage({ searchParams }: PageProps<"/customer/notice/search">) {
  const { page, search } = parseBoardQuery(await searchParams);
  return <NoticeBoard page={page} search={search} />;
}
