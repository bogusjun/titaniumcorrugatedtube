import Script from "next/script";

/**
 * 방문 분석 태그 — ID 를 넣으면 켜진다 (비어 있으면 아무것도 싣지 않는다)
 *
 * GA4_ID: Google 애널리틱스 4 측정 ID (G-XXXXXXXXXX)
 * NAVER_WA: 네이버 애널리틱스 사이트 ID — 파워링크 전환 추적(무명기획 운영)에 쓴다
 * 2026-10-21: ATX 구글 계정(ovingyou·atx.lsj)에 GA 계정이 없어 ID 미정 — 속성을 만들면 여기에 넣는다.
 */
const GA4_ID = "";
const NAVER_WA = "";

export default function Analytics() {
  return (
    <>
      {GA4_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA4_ID}');`}
          </Script>
        </>
      )}
      {NAVER_WA && (
        <>
          <Script src="https://wcs.naver.net/wcslog.js" strategy="afterInteractive" />
          <Script id="naver-wcs" strategy="afterInteractive">
            {`if(!window.wcs_add)window.wcs_add={};wcs_add["wa"]="${NAVER_WA}";(function r(n){if(window.wcs){wcs_do();}else if(n<50){setTimeout(function(){r(n+1);},200);}})(0);`}
          </Script>
        </>
      )}
    </>
  );
}
