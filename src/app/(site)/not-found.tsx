import Link from "next/link";

export default function NotFound() {
  return (
    <div id="wrap" style={{ padding: "80px 10px", textAlign: "center" }}>
      <div className="title1">페이지를 찾을 수 없습니다.</div>
      <div className="title4 mt10">요청하신 페이지가 존재하지 않거나 이동되었습니다.</div>
      <div className="mt30">
        <Link href="/" className="board_write_btn">
          홈으로 이동
        </Link>
      </div>
    </div>
  );
}
