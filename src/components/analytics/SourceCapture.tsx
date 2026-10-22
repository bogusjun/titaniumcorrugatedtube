"use client";

/**
 * 유입 출처 기록 — 첫 유입(atx_src_f, 90일)과 신호가 있는 마지막 유입(atx_src_l)을 1st-party 쿠키에 남긴다.
 * 신호 = utm_* · 네이버 파워링크 자동 추적(n_*) · gclid · fbclid · 바깥 사이트 referrer
 *
 * 견적 폼을 보내면 /api/contact 가 이 쿠키를 읽어 메일 꼬리말에 「유입정보: ATXSRC1|…」 한 줄로 싣고,
 * ATX Work 메일 처리기가 그 줄로 문의 출처를 기록한다. 손님 화면에는 아무것도 보이지 않는다.
 * 값 형식은 ATX몰 태그(atx-worklog scripts/marketing/gtm/atx-src-tag.html)와 같아야 한다.
 */

import { useEffect } from "react";

const MAX_AGE = 90 * 86400;
const ORDER = ["src", "med", "cmp", "grp", "kw", "q", "g", "fb", "land", "ref", "ts"] as const;
type Touch = Partial<Record<(typeof ORDER)[number], string>>;

function getCookie(name: string): string {
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : "";
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${MAX_AGE}; SameSite=Lax`;
}

function clean(v: string, max: number): string {
  return String(v || "").replace(/[|=]/g, "").replace(/\s+/g, "_").slice(0, max);
}

function stamp(): string {
  const d = new Date();
  const p = (x: number) => (x < 10 ? "0" : "") + x;
  return String(d.getFullYear()).slice(2) + p(d.getMonth() + 1) + p(d.getDate()) + p(d.getHours()) + p(d.getMinutes());
}

function encodeTouch(t: Touch, prefix: string): string {
  return ORDER.filter((k) => t[k]).map((k) => `${prefix}${k}=${clean(t[k] as string, k === "land" ? 60 : 40)}`).join("|");
}

export default function SourceCapture() {
  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search);
      let ref = "";
      try { ref = document.referrer ? new URL(document.referrer).hostname : ""; } catch { /* 없음 */ }
      if (ref === window.location.hostname) ref = "";
      const nMedia = q.get("n_media");
      const touch: Touch = {
        src: q.get("utm_source") || (nMedia ? "naver" : ""),
        med: q.get("utm_medium") || (nMedia ? "cpc" : ""),
        cmp: q.get("utm_campaign") || q.get("n_campaign_type") || "",
        grp: q.get("n_ad_group") || "",
        kw: q.get("n_keyword") || q.get("utm_term") || "",
        q: q.get("n_query") || "",
        g: q.get("gclid") ? "1" : "",
        fb: q.get("fbclid") ? "1" : "",
        land: window.location.pathname,
        ref,
        ts: stamp(),
      };
      const signal = touch.src || touch.g || touch.fb || touch.ref;
      if (!getCookie("atx_src_f")) setCookie("atx_src_f", encodeTouch(touch, "f_"));
      if (signal) setCookie("atx_src_l", encodeTouch(touch, "l_"));
    } catch {
      /* 출처 기록이 실패해도 사이트 동작은 막지 않는다 */
    }
  }, []);
  return null;
}
