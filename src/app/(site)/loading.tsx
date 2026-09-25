/** 페이지 전환 중 즉시 표시되는 스켈레톤 (동적 페이지의 체감 대기시간 완화) */
export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <div className="page-banner" style={{ background: "#0b1220" }}>
        <div className="container page-banner__inner">
          <div style={{ width: 160, height: 12, borderRadius: 6, background: "rgba(255,255,255,0.18)" }} />
          <div style={{ width: 260, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.28)" }} />
        </div>
      </div>
      <div className="container sub-layout">
        <div className="sub-nav" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ height: 38, borderRadius: 9, background: "var(--surface)", marginBottom: 6 }} />
          ))}
        </div>
        <div className="sub-content" aria-hidden="true">
          <div style={{ width: 90, height: 12, borderRadius: 6, background: "var(--surface-2)" }} />
          <div style={{ width: "50%", height: 30, borderRadius: 8, background: "var(--surface-2)", marginTop: 14 }} />
          <div style={{ width: "100%", height: 220, borderRadius: 14, background: "var(--surface)", marginTop: 32 }} />
          <div style={{ width: "100%", height: 120, borderRadius: 14, background: "var(--surface)", marginTop: 16 }} />
        </div>
      </div>
    </div>
  );
}
