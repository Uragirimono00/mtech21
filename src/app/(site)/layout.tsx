import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getNavData } from "@/lib/nav";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { nav, site, company } = await getNavData();
  return (
    <div id="wrap_main" className="wrap">
      <Header nav={nav} logo={site.logo} siteName={site.title} />
      {children}
      <Footer company={company} />
    </div>
  );
}
