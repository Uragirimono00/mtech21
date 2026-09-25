"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export type SlideItem = { id: number; image: string; textImage: string | null; link: string | null; alt: string | null };

export function Slider({ slides, interval = 6000 }: { slides: SlideItem[]; interval?: number }) {
  const [index, setIndex] = useState(0);
  const paused = useRef(false);
  const count = slides.length;

  const go = useCallback((n: number) => setIndex(((n % count) + count) % count), [count]);

  useEffect(() => {
    if (count <= 1) return;
    const t = setInterval(() => {
      if (!paused.current) setIndex((i) => (i + 1) % count);
    }, interval);
    return () => clearInterval(t);
  }, [count, interval]);

  if (count === 0) return null;

  return (
    <section
      className="hero"
      aria-roledescription="carousel"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      {slides.map((s, i) => {
        const active = i === index;
        const inner = (
          <>
            <img src={s.image} className="hero__img" alt={s.alt ?? ""} loading={i === 0 ? "eager" : "lazy"} />
            <span className="hero__shade" />
            <span className="hero__grid" />
          </>
        );
        return (
          <div key={s.id} className={`hero__slide${active ? " is-active" : ""}`} aria-hidden={!active}>
            {s.link ? (
              <Link href={s.link} className="hero__link" tabIndex={active ? 0 : -1} aria-label={s.alt ?? "자세히 보기"}>
                {inner}
              </Link>
            ) : (
              <span className="hero__link">{inner}</span>
            )}
            {s.textImage && (
              <div className="container hero__inner">
                <div className="hero__text">
                  <img src={s.textImage} alt="" />
                </div>
              </div>
            )}
          </div>
        );
      })}

      {count > 1 && (
        <>
          <button type="button" className="hero__arrow hero__arrow--prev" aria-label="이전 슬라이드" onClick={() => go(index - 1)}>
            ←
          </button>
          <button type="button" className="hero__arrow hero__arrow--next" aria-label="다음 슬라이드" onClick={() => go(index + 1)}>
            →
          </button>
          <div className="hero__dots" role="tablist" aria-label="슬라이드 선택">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`${i + 1}번 슬라이드`}
                className={`hero__dot${i === index ? " is-active" : ""}`}
                onClick={() => go(i)}
              />
            ))}
          </div>
          <div className="hero__count" aria-hidden="true">
            {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </div>
        </>
      )}
    </section>
  );
}
