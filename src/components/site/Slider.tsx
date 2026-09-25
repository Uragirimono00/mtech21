"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export type SlideItem = { id: number; image: string; textImage: string | null; link: string | null; alt: string | null };

export function Slider({ slides, interval = 5000 }: { slides: SlideItem[]; interval?: number }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), interval);
    return () => clearInterval(t);
  }, [slides.length, interval]);

  if (slides.length === 0) return null;

  return (
    <div id="wrap_slider">
      <div className="visualArea">
        <ul className="rollArea">
          {slides.map((s, i) => {
            const inner = (
              <>
                <img src={s.image} className="pc" alt={s.alt ?? ""} />
                {s.textImage && (
                  <span className="text">
                    <img className="txt" src={s.textImage} alt="" />
                  </span>
                )}
              </>
            );
            return (
              <li key={s.id} className={i === index ? "active" : undefined} aria-hidden={i !== index}>
                {s.link ? <Link href={s.link}>{inner}</Link> : <a>{inner}</a>}
              </li>
            );
          })}
        </ul>
        {slides.length > 1 && (
          <div className="bx-pager">
            {slides.map((s, i) => (
              <div className="bx-pager-item" key={s.id}>
                <a
                  href="#"
                  className={i === index ? "active" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    setIndex(i);
                  }}
                >
                  {i + 1}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
