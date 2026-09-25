import type { CompanySettings } from "@/lib/types";

export function Footer({ company }: { company: CompanySettings }) {
  return (
    <div id="footer">
      <div className="copyright">
        <ul>
          <li>상호명 : {company.name}</li>
          <li className="line">|</li>
          <li>대표이사 : {company.ceo}</li>
          <li className="line">|</li>
          <li>전화 : {company.phone}</li>
          {company.bizNo && (
            <>
              <li className="line">|</li>
              <li>사업자등록번호 : {company.bizNo}</li>
            </>
          )}
          <li className="line">|</li>
          <li>E-mail : {company.email}</li>
          <li className="copy">{company.copyright}</li>
        </ul>
      </div>
    </div>
  );
}
