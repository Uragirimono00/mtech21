/** 관리자가 작성한 HTML 본문 렌더링 (제품 상세 섹션, 공지사항 등) */
export function HtmlContent({ html, className = "product-html" }: { html: string; className?: string }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
