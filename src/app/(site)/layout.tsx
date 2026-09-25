import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getNavData } from "@/lib/nav";
import { getSetting } from "@/lib/settings";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [{ nav, site, company }, home] = await Promise.all([getNavData(), getSetting("home")]);
  return (
    <div className="site">
      <Header nav={nav} logo={site.logo} siteName={site.title} phone={home.customerCenter.phone} hours={home.customerCenter.hours} />
      <main className="site-main">{children}</main>
      <Footer company={company} nav={nav} logo={site.logo} />
    </div>
  );
}
