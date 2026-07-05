"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";

type Case = {
  id: number;
  title: string;
  location: string;
  description: string;
  image: string;
  tag: string;
};

export default function CasesCarousel({ cases }: { cases: Case[] }) {
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // 카드 너비 + 간격
  const CARD_W = 320;
  const GAP    = 24;

  // 무한 루프를 위해 네 벌 복제 (카드 수 적을 때 끊김 방지)
  const doubled = [...cases, ...cases, ...cases, ...cases];

  const totalW = cases.length * (CARD_W + GAP);
  const duration = cases.length * 4; // 카드 수 × 4초

  return (
    <section className="relative overflow-hidden py-8">
      {/* 좌우 fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-ti-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-ti-950 to-transparent" />

      {/* 일시정지 버튼 */}
      <button
        onClick={() => setPaused((p) => !p)}
        className="absolute top-4 right-8 z-20 flex items-center gap-1.5 text-xs text-silver-500 hover:text-silver-300 transition-colors"
      >
        {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
        {paused ? "재생" : "일시정지"}
      </button>

      {/* 트랙 */}
      <div
        ref={trackRef}
        className="flex gap-6"
        style={{
          width: `${doubled.length * (CARD_W + GAP)}px`,
          animation: `marquee ${duration}s linear infinite`,
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {doubled.map((c, i) => (
          <div
            key={`${c.id}-${i}`}
            className="flex-shrink-0 rounded-2xl overflow-hidden bg-ti-900 border border-ti-800"
            style={{ width: `${CARD_W}px` }}
          >
            {/* 이미지 영역 */}
            <div className="relative w-full h-48 bg-ti-800">
              <Image
                src={c.image}
                alt={c.title}
                fill
                className="object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              {/* 태그 */}
              <span className="absolute top-3 left-3 bg-ti-950/80 text-accent text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                {c.tag}
              </span>
            </div>

            {/* 텍스트 */}
            <div className="p-5">
              <p className="text-xs text-silver-500 mb-1">{c.location}</p>
              <h3 className="text-sm font-bold text-silver-200 mb-2 leading-snug">{c.title}</h3>
              <p className="text-xs text-silver-500 leading-relaxed">{c.description}</p>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-${totalW}px); }
        }
      `}</style>
    </section>
  );
}
