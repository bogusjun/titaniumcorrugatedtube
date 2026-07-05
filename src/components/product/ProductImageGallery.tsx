"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface Props {
  images: string[];
  name: string;
}

export default function ProductImageGallery({ images, name }: Props) {
  const [active, setActive] = useState(0);

  // 자동 슬라이드 없음 — 클릭으로만 전환
  const handleSelect = useCallback((i: number) => {
    setActive(i);
  }, []);

  // 이미지 목록이 바뀌면 첫 번째로 리셋
  useEffect(() => {
    setActive(0);
  }, [images]);

  const cols = images.length <= 4 ? images.length : 4;

  return (
    <div>
      {/* 메인 이미지 — key를 src로 줘서 확실히 교체 */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-silver-100 mb-4">
        <Image
          key={images[active]}
          src={images[active]}
          alt={name}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      {/* 썸네일 — 4개 이하면 그 수만큼, 초과면 4열 */}
      {images.length > 1 && (
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => handleSelect(i)}
              className={`relative aspect-square rounded-xl overflow-hidden bg-silver-100 border-2 transition-colors ${
                active === i
                  ? "border-accent ring-2 ring-accent/30"
                  : "border-transparent hover:border-accent/50"
              }`}
            >
              <Image
                src={img}
                alt={`${name} ${i + 1}`}
                fill
                className="object-cover"
                sizes="120px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
