import type { Metadata } from "next";
import { SubLayout } from "@/components/site/SubLayout";
import { BoardList, parseBoardQuery } from "@/components/site/BoardList";
import { getQnaPage, formatDate } from "@/lib/data";
import { getSetting } from "@/lib/settings";

export const metadata: Metadata = { title: "질문게시판" };

export default async function QnaListPage({ searchParams }: PageProps<"/customer/qna">) {
  const sp = await searchParams;
  const { page, search } = parseBoardQuery(sp);
  const [meta, data] = await Promise.all([getSetting("qna"), getQnaPage(page, search)]);

  return (
    <SubLayout section="CUSTOMER" activeHref="/customer/qna" title="질문게시판" crumbs={["질문게시판"]}>
      <div className="title1">{meta.title}</div>
      <div className="title4">{meta.subtitle}</div>
      <img className="bullet" src="/images/design/bullet.jpg" alt="" />
      <BoardList
        rows={data.items.map((q) => ({
          id: q.id,
          href: `/customer/qna/${q.id}`,
          title: (
            <>
              {q.title}
              {q.isSecret && <span className="badge_lock">🔒</span>}
              {q.answeredAt ? <span className="badge_done">답변완료</span> : <span className="badge_wait">답변대기</span>}
            </>
          ),
          author: q.author,
          date: formatDate(q.createdAt),
        }))}
        total={data.total}
        page={data.page}
        pages={data.pages}
        basePath="/customer/qna"
        search={search}
        writeHref="/customer/qna/write"
        emptyText="등록된 질문이 없습니다."
      />
    </SubLayout>
  );
}
