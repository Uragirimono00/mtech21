import type { Metadata } from "next";
import { SubLayout } from "@/components/site/SubLayout";
import { BoardList, parseBoardQuery } from "@/components/site/BoardList";
import { getNoticePage, formatDate } from "@/lib/data";
import { getSetting } from "@/lib/settings";

export const metadata: Metadata = { title: "공지사항" };

export default async function NoticeListPage({ searchParams }: PageProps<"/customer/notice">) {
  const sp = await searchParams;
  const { page, search } = parseBoardQuery(sp);
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
        search={search}
        emptyText="등록된 공지사항이 없습니다."
      />
    </SubLayout>
  );
}
