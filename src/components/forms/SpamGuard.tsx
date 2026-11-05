"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HONEYPOT_NAME } from "@/lib/spam-guard";

/**
 * 견적 폼 스팸 검사용 훅 — 숨긴 칸 값과 폼을 연 시각을 들고 있다가 보낼 때 함께 넘긴다
 * 규칙은 @/lib/spam-guard 참고
 */
export function useSpamGuard() {
  const [hp, setHp] = useState("");
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  /** 요청 본문에 넣을 값 */
  const spamFields = useCallback(
    () => ({ hp, elapsedMs: startedAt.current ? Date.now() - startedAt.current : -1 }),
    [hp]
  );

  /** 「새 문의 작성」으로 폼을 다시 열 때 */
  const resetSpamGuard = useCallback(() => {
    setHp("");
    startedAt.current = Date.now();
  }, []);

  return { hp, setHp, spamFields, resetSpamGuard };
}

/** 화면 밖에 둔 입력칸 — display:none 은 걸러 내는 봇이 있어 위치로 숨긴다 */
export function HoneypotField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div
      aria-hidden="true"
      style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}
    >
      <label>
        Leave this field empty
        <input
          type="text"
          name={HONEYPOT_NAME}
          tabIndex={-1}
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  );
}
