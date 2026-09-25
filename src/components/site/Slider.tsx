"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export type SlideItem = {
  id: number;
  image: string;
  textImage: string | null;
  kicker: string | null;
  title: string | null;
  subtitle: string | null;
  link: string | null;
  linkLabel: string | null;
  alt: string | null;
  theme: string;
};

export function Slider({ slides, interval = 6500 }: { slides: SlideItem[]; interval?: number }) {
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
        const light = s.theme === "light";
        const hasCopy = Boolean(s.title || s.kicker || s.subtitle);
        return (
          <div key={s.id} className={`hero__slide${active ? " is-active" : ""}${light ? " hero__slide--light" : " hero__slide--dark"}`} aria-hidden={!active}>
            <img src={s.image} className="hero__img" alt={s.alt ?? ""} loading={i === 0 ? "eager" : "lazy"} />
            <span className="hero__shade" />
            <span className="hero__grid" />
            <div className="container hero__inner">
              {hasCopy ? (
                <div className="hero__copy">
                  {s.kicker && <span className="hero__kicker">{s.kicker}</span>}
                  {s.title && <h2 className="hero__title">{s.title}</h2>}
                  {s.subtitle && <p className="hero__sub">{s.subtitle}</p>}
                  {s.link && (
                    <Link href={s.link} className={`btn hero__cta ${light ? "btn--dark" : "btn--light"}`} tabIndex={active ? 0 : -1}>
                      {s.linkLabel || "자세히 보기"} <span className="arrow">→</span>
                    </Link>
                  )}
                </div>
              ) : (
                s.textImage && (
                  <div className="hero__text">
                    {s.link ? (
                      <Link href={s.link} tabIndex={active ? 0 : -1}>
                        <img src={s.textImage} alt={s.alt ?? ""} />
                      </Link>
                    ) : (
                      <img src={s.textImage} alt={s.alt ?? ""} />
                    )}
                  </div>
                )
              )}
            </div>
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
