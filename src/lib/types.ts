/** 카테고리 페이지 하단 텍스트 섹션 (특징 / 적용 / 공통사양 ...) */
export type CategorySection = { title: string; body: string };

/** 제품 상세 섹션 (Specification / Dimension ... ) — HTML 본문 */
export type ProductSection = { title: string; html: string };

export type SiteSettings = {
  title: string;
  description: string;
  subVisual: string;
  logo: string;
};

export type CompanySettings = {
  name: string;
  nameEn: string;
  ceo: string;
  phone: string;
  email: string;
  address: string;
  bizNo: string;
  copyright: string;
};

export type HomeSettings = {
  banner: { image: string; link: string };
  cards: { title: string; subtitle: string; image: string; link: string }[];
  newsTitle: string;
  customerCenter: {
    title: string;
    phone: string;
    tel: string;
    hours: string;
    buttons: { label: string; link: string }[];
  };
};

export type GreetingSettings = {
  title: string;
  subtitle: string;
  body: string;
  signImage: string;
  image: string;
};

export type HistorySettings = { title: string; subtitle: string };

export type LocationSettings = {
  mapEmbedUrl: string;
  address: string;
  phone: string;
  email: string;
  directions: { label: string; text: string }[];
};

export type ContactSettings = {
  title: string;
  subtitle: string;
  privacy: string;
  notifyEmail: string;
};

export type BoardSettings = { title: string; subtitle: string };

export type MenuSettings = { showQna: boolean };

export type SettingsMap = {
  site: SiteSettings;
  company: CompanySettings;
  home: HomeSettings;
  greeting: GreetingSettings;
  history: HistorySettings;
  location: LocationSettings;
  contact: ContactSettings;
  notice: BoardSettings;
  qna: BoardSettings;
  menu: MenuSettings;
};

export type SettingKey = keyof SettingsMap;
