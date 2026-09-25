import Link from "next/link";
import type { CompanySettings } from "@/lib/types";
import type { NavItem } from "@/lib/nav";

export function Footer({ company, nav, logo }: { company: CompanySettings; nav: NavItem[]; logo: string }) {
  const year = new Date().getFullYear();
  const links = nav.flatMap((n) => n.children).slice(0, 8);
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__inner">
          <div className="site-footer__brand">
            <img src={logo} alt={company.name} />
            <p>
              유량계 · 신호변환기 · 산업전자 제품 개발과 제어 계측 솔루션을 공급합니다.
              <br />
              M-METER 브랜드로 직접 생산하는 유량계와 해외 전문 제조사의 제품을 국내 산업 현장에 제공합니다.
            </p>
          </div>
          <div>
            <h4>Menu</h4>
            <ul className="site-footer__links">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <div className="site-footer__meta">
              <div>
                <span className="k">Company</span>
                {company.name}
              </div>
              <div>
                <span className="k">CEO</span>
                {company.ceo}
              </div>
              <div>
                <span className="k">Tel</span>
                <a href={`tel:${company.phone.replace(/[^0-9+]/g, "")}`}>{company.phone}</a>
              </div>
              <div>
                <span className="k">Email</span>
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </div>
              {company.address && (
                <div>
                  <span className="k">Addr</span>
                  {company.address}
                </div>
              )}
              {company.bizNo && (
                <div>
                  <span className="k">Biz No.</span>
                  {company.bizNo}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="site-footer__bottom">
          <span>{company.copyright || `© ${year} ${company.nameEn || company.name}. All rights reserved.`}</span>
          <Link href="/admin">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
