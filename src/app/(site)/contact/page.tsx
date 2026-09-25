import type { Metadata } from "next";
import { SubLayout } from "@/components/site/SubLayout";
import { getSettings } from "@/lib/settings";
import { ContactForm } from "./ContactForm";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "1:1문의 | 견적·기술 문의",
  description: "유량계, 신호변환기, 지시계, 전송기 등 엠테크 제품의 견적과 기술 문의를 남겨주세요. 확인 후 빠르게 답변 드립니다.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const { contact, company, home } = await getSettings(["contact", "company", "home"]);
  const tel = (home.customerCenter.tel || company.phone).replace(/[^0-9+]/g, "");
  return (
    <SubLayout section="CONTACT" activeHref="/contact" title="1:1문의" crumbs={[{ label: "1:1문의" }]}>
      <div className="contact-grid">
        <div className="contact-aside">
          <div className="intro" style={{ marginBottom: 8 }}>
            <span className="eyebrow">Contact</span>
            <h2 style={{ marginTop: 10 }}>{contact.title}</h2>
            <p className="intro__desc">{contact.subtitle}</p>
          </div>
          <div className="info-item">
            <div className="k">Tel</div>
            <div className="v">
              <a href={`tel:${tel}`}>{company.phone}</a>
            </div>
            <div className="intro__desc" style={{ marginTop: 6, fontSize: 13 }}>
              {home.customerCenter.hours}
            </div>
          </div>
          <div className="info-item">
            <div className="k">Email</div>
            <div className="v">
              <a href={`mailto:${company.email}`}>{company.email}</a>
            </div>
          </div>
          <div className="info-item">
            <div className="k">Address</div>
            <div className="v">{company.address}</div>
          </div>
        </div>
        <ContactForm privacy={contact.privacy} />
      </div>
    </SubLayout>
  );
}
