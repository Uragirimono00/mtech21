import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container notfound">
      <h1>404</h1>
      <h2>페이지를 찾을 수 없습니다.</h2>
      <p>요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
      <div style={{ marginTop: 28 }}>
        <Link href="/" className="btn btn--dark">
          홈으로 이동
        </Link>
      </div>
    </div>
  );
}
