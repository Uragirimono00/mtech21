"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/lib/nav";

type Props = {
  nav: NavItem[];
  logo: string;
  siteName: string;
  phone?: string;
  hours?: string;
};

export function Header({ nav, logo, siteName, phone, hours }: Props) {
  const [open, setOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const pathname = usePathname();

  // 드로어 열림 시 배경 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isSectionActive = (item: NavItem) => item.children.some((c) => pathname === c.href || pathname.startsWith(c.href + "/"));

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="brand" aria-label={siteName}>
          <img src={logo} alt={siteName} />
          <span className="brand__sub">
            Flow Measurement
            <br />
            &amp; Instrumentation
          </span>
        </Link>

        <nav className="nav" aria-label="주요 메뉴">
          {nav.map((item, i) => {
            const wide = item.children.length > 6;
            const last = i === nav.length - 1;
            return (
              <div className="nav__item" key={item.label}>
                <Link href={item.href} className={`nav__link${isSectionActive(item) ? " is-active" : ""}`}>
                  {item.label}
                </Link>
                <div className={`nav__panel${wide ? " nav__panel--wide" : ""}${last && !wide ? " nav__panel--right" : ""}`}>
                  {item.children.map((child, j) => (
                    <Link key={child.href} href={child.href} className="nav__sub">
                      <i>{String(j + 1).padStart(2, "0")}</i>
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="header-actions">
          <Link href="/contact" className="btn btn--primary btn--sm header-cta">
            1:1 문의 <span className="arrow">→</span>
          </Link>
          <button type="button" className="hamburger" aria-label="메뉴 열기" aria-expanded={open} onClick={() => setOpen(true)}>
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* 모바일 드로어 */}
      {open && <div className="backdrop" onClick={() => setOpen(false)} />}
      <aside className={`drawer${open ? " is-open" : ""}`} aria-hidden={!open}>
        <div className="drawer__head">
          <Link href="/" className="brand" onClick={() => setOpen(false)}>
            <img src={logo} alt={siteName} />
          </Link>
          <button type="button" className="drawer__close" aria-label="메뉴 닫기" onClick={() => setOpen(false)}>
            ×
          </button>
        </div>
        {nav.map((item, i) => {
          const isOpen = openIndex === i || (openIndex === null && isSectionActive(item));
          return (
            <div className={`drawer__group${isOpen ? " is-open" : ""}`} key={item.label}>
              <button type="button" className="drawer__toggle" onClick={() => setOpenIndex(isOpen ? -1 : i)} aria-expanded={isOpen}>
                {item.label}
                <span className="chev">▼</span>
              </button>
              <div className="drawer__list">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={`drawer__link${pathname === child.href ? " is-active" : ""}`}
                    onClick={() => setOpen(false)}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
        <div className="drawer__foot">
          {phone && (
            <div>
              <a href={`tel:${phone.replace(/[^0-9+]/g, "")}`} className="drawer__phone">
                {phone}
              </a>
              {hours && <div className="drawer__hours">{hours}</div>}
            </div>
          )}
          <Link href="/contact" className="btn btn--primary" onClick={() => setOpen(false)}>
            1:1 문의하기 <span className="arrow">→</span>
          </Link>
        </div>
      </aside>
    </header>
  );
}
