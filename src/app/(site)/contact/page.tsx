import type { Metadata } from "next";
import { SubLayout } from "@/components/site/SubLayout";
import { getSetting } from "@/lib/settings";
import { ContactForm } from "./ContactForm";

export const revalidate = 3600;
export const metadata: Metadata = { title: "1:1문의" };

export default async function ContactPage() {
  const c = await getSetting("contact");
  return (
    <SubLayout section="CONTACT" activeHref="/contact" title="1:1문의" crumbs={["1:1문의"]}>
      <div className="title1">{c.title}</div>
      <div className="title4">{c.subtitle}</div>
      <img className="bullet" src="/images/design/bullet.jpg" alt="" />
      <ContactForm privacy={c.privacy} />
    </SubLayout>
  );
}
