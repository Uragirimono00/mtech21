import { SubLayout } from "@/components/site/SubLayout";
import { BoardList } from "@/components/site/BoardList";
import { getQnaPage, formatDate } from "@/lib/data";
import { getSetting } from "@/lib/settings";

/** 질문게시판 목록 (정적 1페이지와 동적 검색 페이지가 공유) */
export async function QnaBoard({ page, search }: { page: number; search: { field: string; value: string } }) {
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
              {q.answeredAt ? (
                <span className="tag tag--accent" style={{ marginLeft: 6 }}>
                  답변완료
                </span>
              ) : (
                <span className="tag tag--wait" style={{ marginLeft: 6 }}>
                  답변대기
                </span>
              )}
            </>
          ),
          author: q.author,
          date: formatDate(q.createdAt),
        }))}
        total={data.total}
        page={data.page}
        pages={data.pages}
        basePath="/customer/qna"
        actionPath="/customer/qna/search"
        search={search}
        writeHref="/customer/qna/write"
        emptyText="등록된 질문이 없습니다."
      />
    </SubLayout>
  );
}
