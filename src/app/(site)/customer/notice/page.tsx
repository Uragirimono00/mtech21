import type { Metadata } from "next";
import { NoticeBoard } from "./NoticeBoard";

// 1페이지 목록은 정적으로 생성·캐시 (관리자 저장 시 갱신). 페이지 이동/검색은 /customer/notice/search
export const revalidate = 3600;
export const metadata: Metadata = { title: "공지사항" };

export default function NoticeListPage() {
  return <NoticeBoard page={1} search={{ field: "subject", value: "" }} />;
}
