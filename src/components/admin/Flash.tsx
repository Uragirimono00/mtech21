/** ?saved=1 / ?deleted=1 / ?error=1 쿼리로 전달되는 처리 결과 메시지 */
export function Flash({ sp }: { sp: { [key: string]: string | string[] | undefined } }) {
  if (sp.saved) return <div className="msg ok">저장되었습니다.</div>;
  if (sp.deleted) return <div className="msg ok">삭제되었습니다.</div>;
  if (sp.error) return <div className="msg err">입력값을 확인해주세요.</div>;
  return null;
}
