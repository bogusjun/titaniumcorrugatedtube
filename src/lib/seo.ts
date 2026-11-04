/**
 * 페이지별 검색·공유 메타데이터 — canonical·hreflang·og:url 을 페이지마다 자기 주소로 만든다
 *
 * 레이아웃에는 canonical 을 두지 않는다. 두면 자체 값이 없는 하위 페이지가 레이아웃 값(홈 주소)을 물려받아
 * 검색엔진이 하위 페이지를 홈의 중복으로 본다. 새 페이지를 만들면 metadata 에 pageMetadata() 를 쓴다.
 */
import type { Metadata } from "next";

export const SITE_URL = "https://tube.atx.kr";

export type SiteLocale = "ko" | "en" | "ja";

const PREFIX: Record<SiteLocale, string> = { ko: "", en: "/en", ja: "/ja" };

/** 언어별 기본 공유 정보 — siteName 은 각 레이아웃 title template 의 꼬리와 같다 */
export const OG_DEFAULTS: Record<SiteLocale, { locale: string; siteName: string; image: string; imageAlt: string }> = {
  ko: {
    locale: "ko_KR",
    siteName: "ATX 티타늄 주름관",
    image: "/images/og-image.jpg",
    imageAlt: "ATX 티타늄 주름관 — 고부식 환경 열교환 전문 제조사",
  },
  en: {
    locale: "en_US",
    siteName: "ATX Titanium",
    image: "/images/og-image-en.jpg",
    imageAlt: "ATX Titanium Corrugated Tube — Corrosion-Resistant Heat Exchanger Manufacturer",
  },
  ja: {
    locale: "ja_JP",
    siteName: "ATX チタン波管",
    image: "/images/og-image-ja.jpg",
    imageAlt: "ATX チタン波管 — 耐食性熱交換専門メーカー",
  },
};

/** path 는 언어 앞부분을 뺀 경로 — 홈은 "", 나머지는 "/about" 처럼 */
export function localeUrl(locale: SiteLocale, path = ""): string {
  return `${SITE_URL}${PREFIX[locale]}${path}`;
}

export function alternatesFor(path: string, locale: SiteLocale): NonNullable<Metadata["alternates"]> {
  return {
    canonical: localeUrl(locale, path),
    languages: {
      ko: localeUrl("ko", path),
      en: localeUrl("en", path),
      ja: localeUrl("ja", path),
      "x-default": localeUrl("ko", path),
    },
  };
}

type PageMetaInput = {
  locale: SiteLocale;
  path: string;
  title: string;
  description: string;
  /** true 면 레이아웃 template(「| 사이트명」)을 붙이지 않는다 — 홈처럼 제목에 이미 사이트명이 있을 때 */
  absoluteTitle?: boolean;
  /** 공유 카드 제목 — 없으면 브라우저 제목과 같게 */
  ogTitle?: string;
  ogImage?: { url: string; alt: string };
};

export function pageMetadata({ locale, path, title, description, absoluteTitle, ogTitle, ogImage }: PageMetaInput): Metadata {
  const og = OG_DEFAULTS[locale];
  const fullTitle = absoluteTitle ? title : `${title} | ${og.siteName}`;
  const image = ogImage ?? { url: og.image, alt: og.imageAlt };
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: alternatesFor(path, locale),
    openGraph: {
      type: "website",
      locale: og.locale,
      siteName: og.siteName,
      url: localeUrl(locale, path),
      title: ogTitle ?? fullTitle,
      description,
      images: [{ url: image.url, width: 1200, height: 630, alt: image.alt }],
    },
  };
}
