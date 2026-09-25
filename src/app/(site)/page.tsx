import Link from "next/link";
import { Slider } from "@/components/site/Slider";
import { getRecentNotices, getSlides, formatDate } from "@/lib/data";
import { getSetting } from "@/lib/settings";

export const revalidate = 3600;

export default async function HomePage() {
  const [slides, home, notices] = await Promise.all([getSlides(), getSetting("home"), getRecentNotices(5)]);
  const cc = home.customerCenter;

  return (
    <div id="main">
      <Slider slides={slides} />

      <div id="main_content">
        <section className="lr10">
          <div className="width70">
            <div className="banner border1">
              <Link href={home.banner.link || "#"}>
                <img src={home.banner.image} alt="" />
              </Link>
            </div>
            <div className="col1">
              {home.cards.map((card, i) => (
                <div className={`col2 ${i === 0 ? "brand" : "business"}`} key={i}>
                  <Link href={card.link || "#"}>
                    <p className="title3 mt30 mb10">{card.title}</p>
                    <span className="title6 mb20">{card.subtitle}</span>
                    <img src={card.image} alt="" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="width30">
            <div className="news border1">
              <Link href="/customer/notice">
                <p className="title3 mb20">{home.newsTitle}</p>
              </Link>
              <ul>
                {notices.map((n) => (
                  <li key={n.id}>
                    <Link href={`/customer/notice/${n.id}`}>{n.title}</Link>
                    <span className="date">{formatDate(n.createdAt)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="customer">
              <p className="title3 mt30 mb10">{cc.title}</p>
              <div className="mobileNone">
                <img className="phone fl" src="/images/main/icon_phone.jpg" alt="" />
                <a className="num fl">{cc.phone}</a>
              </div>
              <div className="pcNone">
                <img className="phone fl" src="/images/main/icon_phone.jpg" alt="" />
                <a href={`tel:${cc.tel}`} className="num fl">
                  {cc.phone}
                </a>
              </div>
              <span className="title6 pt10 mb20 clear">{cc.hours}</span>
              {cc.buttons.map((b, i) => (
                <Link className="btn" href={b.link} key={i}>
                  <span className="title6">{b.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
