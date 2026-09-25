import type { Metadata } from "next";
import { SubLayout } from "@/components/site/SubLayout";
import { QnaWriteForm } from "../QnaClient";

export const metadata: Metadata = { title: "질문 작성" };

export default function QnaWritePage() {
  return (
    <SubLayout section="CUSTOMER" activeHref="/customer/qna" title="질문게시판" crumbs={[{ label: "질문게시판", href: "/customer/qna" }, { label: "글쓰기" }]}>
      <div className="intro">
        <span className="eyebrow">Write</span>
        <h2 style={{ marginTop: 10 }}>질문을 남겨주세요.</h2>
        <p className="intro__desc">비밀번호는 비밀글 확인 및 글 삭제 시 사용됩니다.</p>
      </div>
      <QnaWriteForm />
    </SubLayout>
  );
}
