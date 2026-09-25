# -*- coding: utf-8 -*-
"""
브랜드 이미지 생성 스크립트 (파비콘 / OG 이미지 / 메인 배너 3장 / 서브 배너)
- 원본 로고(public/images/design/logo.png)와 자사 제품 사진(public/images/product/*)만 사용
- 실행: python scripts/gen-brand-assets.py   (PIL 필요)
"""
import os, sys, math
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUB = os.path.join(ROOT, "public")
APP = os.path.join(ROOT, "src", "app")
PROD = os.path.join(PUB, "images", "product")
OUT_MAIN = os.path.join(PUB, "images", "main")

NAVY = (11, 18, 32)
NAVY2 = (14, 36, 84)
BLUE = (15, 91, 216)
SKY = (143, 180, 255)
WHITE = (255, 255, 255)

FONT_DIR = os.environ.get("WINDIR", r"C:\Windows") + r"\Fonts"

def font(size, weight="Bold", mono=False):
    """Noto Sans KR 가변 폰트(윈도우 기본) → 없으면 맑은 고딕. 라벨용 mono는 Consolas."""
    if mono:
        for name in ["consola.ttf", "cour.ttf"]:
            p = os.path.join(FONT_DIR, name)
            if os.path.exists(p):
                return ImageFont.truetype(p, size)
    p = os.path.join(FONT_DIR, "NotoSansKR-VF.ttf")
    if os.path.exists(p):
        f = ImageFont.truetype(p, size)
        try:
            f.set_variation_by_name(weight)
        except Exception:
            try:
                f.set_variation_by_axes([700 if weight == "Bold" else 500])
            except Exception:
                pass
        return f
    p = os.path.join(FONT_DIR, "malgunbd.ttf" if weight == "Bold" else "malgun.ttf")
    return ImageFont.truetype(p, size)


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def background(w, h, glow_x=0.78, glow_y=0.35, glow_r=0.55, grid=56):
    """네이비 그라데이션 + 블루 글로우 + 블루프린트 그리드"""
    img = Image.new("RGB", (w, h), NAVY)
    px = img.load()
    # 좌상→우하 대각 그라데이션
    for y in range(h):
        for x in range(0, w, 4):
            t = (x / w) * 0.55 + (y / h) * 0.45
            c = lerp(NAVY, NAVY2, t * 0.9)
            for k in range(4):
                if x + k < w:
                    px[x + k, y] = c
    # 글로우
    glow = Image.new("RGB", (w, h), (0, 0, 0))
    gd = ImageDraw.Draw(glow)
    r = int(min(w, h) * glow_r)
    cx, cy = int(w * glow_x), int(h * glow_y)
    gd.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(24, 82, 190))
    glow = glow.filter(ImageFilter.GaussianBlur(r * 0.55))
    if _has_numpy():
        import numpy as np
        arr = np.asarray(img, dtype="int16") + (np.asarray(glow, dtype="int16") * 0.55).astype("int16")
        img = Image.fromarray(np.clip(arr, 0, 255).astype("uint8"))
    else:
        img = _add_blend(img, glow, 0.55)
    # 그리드 (좌측은 옅게, 우측은 살짝 진하게)
    ov = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    od = ImageDraw.Draw(ov)
    for x in range(0, w, grid):
        od.line([(x, 0), (x, h)], fill=(255, 255, 255, 14), width=1)
    for y in range(0, h, grid):
        od.line([(0, y), (w, y)], fill=(255, 255, 255, 14), width=1)
    # 대각 하이라이트 밴드
    band = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    bd = ImageDraw.Draw(band)
    bd.polygon([(int(w * 0.52), 0), (int(w * 0.62), 0), (int(w * 0.40), h), (int(w * 0.30), h)], fill=(255, 255, 255, 10))
    img = img.convert("RGBA")
    img.alpha_composite(band)
    img.alpha_composite(ov)
    return img


def _has_numpy():
    try:
        import numpy  # noqa
        return True
    except Exception:
        return False


def _add_blend(img, glow, k):
    a = img.load(); b = glow.load()
    w, h = img.size
    out = Image.new("RGB", (w, h))
    o = out.load()
    for y in range(h):
        for x in range(w):
            p = a[x, y]; q = b[x, y]
            o[x, y] = (min(255, int(p[0] + q[0] * k)), min(255, int(p[1] + q[1] * k)), min(255, int(p[2] + q[2] * k)))
    return out


def rounded_mask(size, radius):
    m = Image.new("L", size, 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, size[0] - 1, size[1] - 1], radius=radius, fill=255)
    return m


def whiten(photo):
    """제품 사진의 옅은 회색/크림색 배경을 순백으로 정리 (카드 배경과 자연스럽게 이어지도록)"""
    if not _has_numpy():
        return photo
    import numpy as np
    a = np.asarray(photo.convert("RGB"), dtype="float32")
    mn = a.min(axis=2)
    # 밝은 회색(>=215)은 흰색 쪽으로 부드럽게 끌어올림
    t = np.clip((mn - 215.0) / 40.0, 0.0, 1.0)[..., None]
    out = a + (255.0 - a) * t
    return Image.fromarray(np.clip(out, 0, 255).astype("uint8"))


def product_card(photo_path, label, sub, size=(300, 340), radius=26, pad=26):
    """흰색 라운드 카드 + 제품 사진(contain) + 모델명 라벨"""
    w, h = size
    card = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    base = Image.new("RGBA", (w, h), (255, 255, 255, 255))
    card.paste(base, (0, 0), rounded_mask((w, h), radius))
    photo = whiten(Image.open(photo_path).convert("RGB"))
    # 사진 영역
    area_w, area_h = w - pad * 2, h - pad * 2 - 64
    ph = photo.copy()
    ph.thumbnail((area_w, area_h), Image.LANCZOS)
    if ph.width < area_w * 0.8 and ph.height < area_h * 0.8:  # 작은 썸네일은 소폭 확대
        s = min(area_w * 0.9 / ph.width, area_h * 0.9 / ph.height)
        ph = photo.resize((int(photo.width * s), int(photo.height * s)), Image.LANCZOS)
    px = pad + (area_w - ph.width) // 2
    py = pad + (area_h - ph.height) // 2
    card.paste(ph, (px, py))
    d = ImageDraw.Draw(card)
    # 구분선 + 라벨
    d.line([(pad, h - 64), (w - pad, h - 64)], fill=(228, 231, 236), width=1)
    d.text((pad, h - 52), label, font=font(17, "Bold"), fill=(11, 18, 32))
    d.text((pad, h - 29), sub, font=font(12, "Medium"), fill=(102, 112, 133))
    # 우상단 작은 점(액센트)
    d.ellipse([w - pad - 8, pad - 6, w - pad, pad + 2], fill=BLUE)
    return card


def drop_shadow(img, offset=(0, 24), blur=28, opacity=110):
    w, h = img.size
    pad = blur * 3
    sh = Image.new("RGBA", (w + pad * 2, h + pad * 2), (0, 0, 0, 0))
    alpha = img.split()[3]
    shadow = Image.new("RGBA", img.size, (0, 0, 0, opacity))
    sh.paste(shadow, (pad + offset[0], pad + offset[1]), alpha)
    sh = sh.filter(ImageFilter.GaussianBlur(blur))
    return sh, pad


def compose_cards(bg, cards, positions):
    """cards: [(card_img, (x, y))] — 그림자 포함 합성"""
    for card, (x, y) in zip(cards, positions):
        sh, pad = drop_shadow(card)
        bg.alpha_composite(sh, (x - pad, y - pad))
        bg.alpha_composite(card, (x, y))
    return bg


def hero(filename, cards):
    W, H = 1920, 640
    bg = background(W, H)
    imgs = [product_card(*c) for c in cards]
    # 우측 45% 영역에 3장을 지그재그 배치 (텍스트는 좌측 HTML)
    positions = [(1040, 150), (1330, 60), (1580, 200)]
    sizes = [(300, 340), (280, 320), (260, 300)]
    imgs = [product_card(c[0], c[1], c[2], size=s) for c, s in zip(cards, sizes)]
    # 뒤쪽 카드부터 합성 (오른쪽 작은 카드 → 왼쪽 큰 카드)
    order = [2, 1, 0]
    compose_cards(bg, [imgs[i] for i in order], [positions[i] for i in order])
    # 좌하단 미세 라벨
    d = ImageDraw.Draw(bg)
    d.text((1040, 560), "MTECH  ·  FLOW MEASUREMENT & INSTRUMENTATION", font=font(13, mono=True), fill=(143, 180, 255, 140))
    out = os.path.join(OUT_MAIN, filename)
    bg.convert("RGB").save(out, "JPEG", quality=88, optimize=True, progressive=True)
    print("saved", out)


def sub_banner():
    # 서브 배너는 매우 가로로 긴 영역(약 1920×260)에 cover 로 들어가므로 낮은 높이로 제작, 카드는 세로 중앙에 맞춤
    W, H = 1920, 320
    bg = background(W, H, glow_x=0.85, glow_y=0.5, glow_r=0.8, grid=48)
    cards = [
        product_card(os.path.join(PROD, "mtm_200c_s1.jpg"), "MTM-200C", "Magnetic Flowmeter", size=(170, 196), pad=14, radius=18),
        product_card(os.path.join(PROD, "mvt_3000f_s1.jpg"), "MVT-3000F", "Vortex Flowmeter", size=(160, 186), pad=14, radius=18),
        product_card(os.path.join(PROD, "indicator_digital_s1.jpg"), "MT-3000", "Totalizer", size=(160, 186), pad=14, radius=18),
    ]
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    compose_cards(layer, cards, [(1240, 62), (1440, 40), (1620, 96)])
    # 서브 배너는 은은하게 (오버레이가 얹힘)
    a = layer.split()[3].point(lambda v: int(v * 0.7))
    layer.putalpha(a)
    bg.alpha_composite(layer)
    out = os.path.join(OUT_MAIN, "banner_sub.jpg")
    bg.convert("RGB").save(out, "JPEG", quality=86, optimize=True, progressive=True)
    print("saved", out)


def logo_white():
    lg = Image.open(os.path.join(PUB, "images", "design", "logo.png")).convert("RGBA")
    a = lg.split()[3]
    white = Image.new("RGBA", lg.size, (255, 255, 255, 0))
    white.putalpha(a)
    return white


def logo_mark():
    """로고에서 첫 글자(M)만 추출 → 파비콘용 마크"""
    lg = Image.open(os.path.join(PUB, "images", "design", "logo.png")).convert("RGBA")
    a = lg.split()[3]
    w, h = lg.size
    # 글자들이 서로 붙어 있어 열(column) 분석으로는 분리가 안 됨 → M 은 로고 폭의 앞 31% 구간
    x1 = int(w * float(os.environ.get("MARK_RATIO", "0.36")))
    part = lg.crop((0, 0, x1, h))
    box = part.getbbox()
    mark = part.crop(box)
    white = Image.new("RGBA", mark.size, (255, 255, 255, 0))
    white.putalpha(mark.split()[3])
    return white


def icon(size, radius_ratio=0.22, bg=NAVY):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    base = Image.new("RGBA", (size, size), bg + (255,))
    img.paste(base, (0, 0), rounded_mask((size, size), int(size * radius_ratio)))
    mark = logo_mark()
    target_h = int(size * 0.5)
    s = target_h / mark.height
    mk = mark.resize((max(1, int(mark.width * s)), target_h), Image.LANCZOS)
    img.alpha_composite(mk, ((size - mk.width) // 2, (size - mk.height) // 2 + int(size * 0.02)))
    # 우하단 액센트 점
    d = ImageDraw.Draw(img)
    r = int(size * 0.06)
    d.ellipse([size * 0.70, size * 0.70, size * 0.70 + r * 2, size * 0.70 + r * 2], fill=BLUE + (255,))
    return img


def favicons():
    big = icon(512)
    big.save(os.path.join(APP, "icon.png"))
    ap = icon(180, radius_ratio=0.0)
    ap.convert("RGB").save(os.path.join(APP, "apple-icon.png"))
    ico_src = icon(256, radius_ratio=0.2)
    ico_src.save(os.path.join(APP, "favicon.ico"), format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
    print("saved favicons")


def og_image():
    W, H = 1200, 630
    bg = background(W, H, glow_x=0.8, glow_y=0.4, glow_r=0.6, grid=48)
    lg = logo_white()
    s = 220 / lg.width
    lg = lg.resize((int(lg.width * s), int(lg.height * s)), Image.LANCZOS)
    bg.alpha_composite(lg, (88, 92))
    d = ImageDraw.Draw(bg)
    d.text((88, 190), "FLOW MEASUREMENT & INSTRUMENTATION", font=font(16, mono=True), fill=(143, 180, 255))
    d.text((88, 236), "유량계 · 신호변환기", font=font(52, "Bold"), fill=WHITE)
    d.text((88, 300), "산업전자 제어 솔루션", font=font(52, "Bold"), fill=WHITE)
    d.text((88, 384), "계측과 제어 솔루션의 파트너, 엠테크", font=font(26, "Medium"), fill=(200, 210, 230))
    d.text((88, 540), "www.mtech21.co.kr  ·  Since 1995", font=font(16, mono=True), fill=(143, 180, 255))
    cards = [
        product_card(os.path.join(PROD, "mtm_200c_s1.jpg"), "MTM-200C", "Magnetic Flowmeter", size=(220, 260), pad=20),
        product_card(os.path.join(PROD, "converter_slim_type.jpg"), "MTSC Series", "Signal Converter", size=(220, 260), pad=20),
    ]
    compose_cards(bg, cards, [(800, 120), (950, 250)])
    bg.convert("RGB").save(os.path.join(APP, "opengraph-image.png"), "PNG", optimize=True)
    bg.convert("RGB").save(os.path.join(APP, "twitter-image.png"), "PNG", optimize=True)
    print("saved og images")


if __name__ == "__main__":
    os.makedirs(OUT_MAIN, exist_ok=True)
    hero("hero_flow.jpg", [
        (os.path.join(PROD, "mtm_200c_s1.jpg"), "MTM-200C", "전자기유량계 · Magnetic"),
        (os.path.join(PROD, "mvt_3000f_s1.jpg"), "MVT-3000F", "와류식유량계 · Vortex"),
        (os.path.join(PROD, "mtm_9000_s1.jpg"), "MTM-9000", "코리올리유량계 · Coriolis"),
    ])
    hero("hero_control.jpg", [
        (os.path.join(PROD, "converter_slim_type.jpg"), "MTSC Series", "신호변환기 · Slim Type"),
        (os.path.join(PROD, "indicator_digital_s1.jpg"), "MT-3000", "지시적산계 · Totalizer"),
        (os.path.join(PROD, "arrester_big_s1.jpg"), "MTAR-PWR", "서지 보호기 · Arrester"),
    ])
    hero("hero_company.jpg", [
        (os.path.join(PROD, "mdp_600_s1.jpg"), "MDP-600", "차압전송기 · DP Transmitter"),
        (os.path.join(PROD, "mul_100_s1.jpg"), "MUL-100", "초음파 레벨미터 · Level"),
        (os.path.join(PROD, "mfc_100_s1.jpg"), "MFC-100", "Flow Computer"),
    ])
    sub_banner()
    favicons()
    og_image()
