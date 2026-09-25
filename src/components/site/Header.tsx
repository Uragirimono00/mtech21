"use client";

import Link from "next/link";
import { useState } from "react";
import type { NavItem } from "@/lib/nav";

export function Header({ nav, logo, siteName }: { nav: NavItem[]; logo: string; siteName: string }) {
  const [open, setOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="header">
      <div className="gnb">
        {/* 모바일 상단바 */}
        <div className="top">
          <div className="m_logo">
            <Link href="/">
              <img src={logo} alt={siteName} />
            </Link>
          </div>
          <a
            className="menu"
            href="#menu"
            aria-label="메뉴 열기"
            onClick={(e) => {
              e.preventDefault();
              setOpen(true);
            }}
          >
            <img src="/images/design/open.png" alt="menu" />
          </a>
        </div>

        {/* PC 헤더 */}
        <div id="header">
          <div className="insideWrap">
            <div className="logo">
              <Link href="/">
                <img src={logo} alt={siteName} />
              </Link>
            </div>
            <div className="global_nav" />
            <div id="menu" className="ml215">
              <ul className="menu">
                {nav.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href}>{item.label}</Link>
                    <div>
                      <ul>
                        <li>
                          <a className="nav_top" aria-hidden="true" />
                        </li>
                        {item.children.map((child, i) => (
                          <li key={child.href + i} className="contents">
                            {i > 0 && <a className="nav_line" aria-hidden="true" />}
                            <Link className="smenu" href={child.href}>
                              {child.label}
                            </Link>
                          </li>
                        ))}
                        <li>
                          <a className="nav_bottom" aria-hidden="true" />
                        </li>
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 모바일 슬라이드 메뉴 */}
        <div className={open ? "menu open" : "menu"} id="menu-mobile">
          <a
            className="close"
            href="#"
            aria-label="메뉴 닫기"
            onClick={(e) => {
              e.preventDefault();
              setOpen(false);
            }}
          >
            <img src="/images/design/close.png" alt="close" />
          </a>
          <ul>
            {nav.map((item, i) => (
              <li key={item.label} className={openIndex === i ? "open" : ""}>
                <span>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenIndex(openIndex === i ? null : i);
                    }}
                  >
                    {item.label}
                  </a>
                </span>
                <ul>
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <Link href={child.href} onClick={() => setOpen(false)}>
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
        {open && <div className="menu_dim" onClick={() => setOpen(false)} />}
      </div>
    </div>
  );
}
