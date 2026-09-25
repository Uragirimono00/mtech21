import type { Metadata } from "next";
import { QnaBoard } from "./QnaBoard";

// 1페이지 목록은 정적으로 생성·캐시 (글 등록/답변 시 갱신). 페이지 이동/검색은 /customer/qna/search
export const revalidate = 3600;
export const metadata: Metadata = { title: "질문게시판" };

export default function QnaListPage() {
  return <QnaBoard page={1} search={{ field: "subject", value: "" }} />;
}
