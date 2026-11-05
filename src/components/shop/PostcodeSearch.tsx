"use client";

import { useEffect, useRef, useState } from "react";

// 카카오(다음) 우편번호 서비스 — 별도 키 없이 무료로 사용 가능
// https://postcode.map.daum.net/guide
const SCRIPT_SRC = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

type DaumPostcodeData = {
  zonecode: string;
  roadAddress: string;
  jibunAddress: string;
  userSelectedType: "R" | "J";
  bname: string;
  buildingName: string;
  apartment: "Y" | "N";
};

declare global {
  interface Window {
    daum?: {
      Postcode: new (opts: {
        oncomplete: (data: DaumPostcodeData) => void;
        width?: string;
        height?: string;
      }) => { embed: (el: HTMLElement) => void };
    };
  }
}

let scriptPromise: Promise<void> | null = null;
function loadScript(): Promise<void> {
  if (window.daum?.Postcode) return Promise.resolve();
  scriptPromise ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      scriptPromise = null;
      reject(new Error("주소 검색을 불러오지 못했습니다."));
    };
    document.head.appendChild(s);
  });
  return scriptPromise;
}

export type PostcodeResult = { postcode: string; address: string };

export function PostcodeSearch({ onSelect }: { onSelect: (r: PostcodeResult) => void }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    loadScript()
      .then(() => {
        if (cancelled || !boxRef.current || !window.daum) return;
        boxRef.current.innerHTML = "";
        new window.daum.Postcode({
          width: "100%",
          height: "100%",
          oncomplete: (data) => {
            let address = data.userSelectedType === "R" ? data.roadAddress : data.jibunAddress;
            if (data.userSelectedType === "R") {
              const extra = [data.bname, data.apartment === "Y" ? data.buildingName : ""].filter(Boolean).join(", ");
              if (extra) address += ` (${extra})`;
            }
            onSelect({ postcode: data.zonecode, address });
            setOpen(false);
          },
        }).embed(boxRef.current);
      })
      .catch((e: Error) => setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [open, onSelect]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError("");
          setOpen(true);
        }}
        className="shrink-0 px-4 rounded-lg bg-ti-950 text-silver-200 text-sm font-semibold hover:bg-ti-800 transition-colors"
      >
        주소 검색
      </button>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      {open && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div
            className="bg-white w-full max-w-md h-[min(560px,85vh)] flex flex-col rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="주소 검색"
          >
            <div className="flex items-center justify-between px-4 h-12 border-b border-silver-100 shrink-0">
              <p className="text-sm font-semibold text-ink">주소 검색</p>
              <button type="button" onClick={() => setOpen(false)} className="text-sm text-ink-muted" aria-label="닫기">
                닫기
              </button>
            </div>
            <div ref={boxRef} className="flex-1" />
          </div>
        </div>
      )}
    </>
  );
}
