import type { Metadata } from "next";
import { SubLayout } from "@/components/site/SubLayout";
import { QnaWriteForm } from "../QnaClient";

export const metadata: Metadata = { title: "질문 작성" };

export default function QnaWritePage() {
  return (
    <SubLayout section="CUSTOMER" activeHref="/customer/qna" title="질문게시판" crumbs={["질문게시판", "글쓰기"]}>
      <div className="title1">질문을 남겨주세요.</div>
      <div className="title4">비밀번호는 글 확인(비밀글) 및 삭제 시 사용됩니다.</div>
      <img className="bullet" src="/images/design/bullet.jpg" alt="" />
      <QnaWriteForm />
    </SubLayout>
  );
}
