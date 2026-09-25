import { SubLayout } from "@/components/site/SubLayout";
import { BoardList } from "@/components/site/BoardList";
import { getNoticePage, formatDate } from "@/lib/data";
import { getSetting } from "@/lib/settings";

/** 공지사항 목록 (정적 1페이지와 동적 검색 페이지가 공유) */
export async function NoticeBoard({ page, search }: { page: number; search: { field: string; value: string } }) {
  const [meta, data] = await Promise.all([getSetting("notice"), getNoticePage(page, search)]);
  return (
    <SubLayout section="CUSTOMER" activeHref="/customer/notice" title="공지사항" crumbs={[{ label: "공지사항" }]}>
      <div className="intro">
        <span className="eyebrow">Notice</span>
        <h2 style={{ marginTop: 10 }}>{meta.title}</h2>
        <p className="intro__desc">{meta.subtitle}</p>
      </div>
      <BoardList
        rows={data.items.map((n) => ({
          id: n.id,
          href: `/customer/notice/${n.id}`,
          title: n.title,
          author: n.author,
          date: formatDate(n.createdAt),
          isNotice: n.pinned,
        }))}
        total={data.total}
        page={data.page}
        pages={data.pages}
        basePath="/customer/notice"
        actionPath="/customer/notice/search"
        search={search}
        emptyText="등록된 공지사항이 없습니다."
      />
    </SubLayout>
  );
}
