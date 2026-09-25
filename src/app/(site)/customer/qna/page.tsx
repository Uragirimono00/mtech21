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
    <SubLayout section="CUSTOMER" activeHref="/customer/qna" title="질문게시판" crumbs={[{ label: "질문게시판" }]}>
      <div className="intro">
        <span className="eyebrow">Q&amp;A</span>
        <h2 style={{ marginTop: 10 }}>{meta.title}</h2>
        <p className="intro__desc">{meta.subtitle}</p>
      </div>
      <BoardList
        rows={data.items.map((q) => ({
          id: q.id,
          href: `/customer/qna/${q.id}`,
          title: (
            <>
              {q.isSecret && "🔒 "}
              {q.title}
              {q.answeredAt ? <span className="tag tag--accent" style={{ marginLeft: 6 }}>답변완료</span> : <span className="tag tag--wait" style={{ marginLeft: 6 }}>답변대기</span>}
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
