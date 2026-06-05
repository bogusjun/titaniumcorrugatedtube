import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Dark base (다크 섹션 배경)
        ti: {
          950: "#16181E",  // 전체 다크 베이스
          900: "#1F2530",  // 카드·패널
          800: "#2E3340",  // 보더·구분선
          700: "#3D4455",  // subtle surface
        },
        // ── Titanium silver (다크 배경 위 텍스트·아이콘)
        silver: {
          50:  "#F2F4F6",  // 라이트 섹션 배경
          100: "#E4E8ED",
          200: "#C8D0DC",  // 브라이트 실버
          300: "#A8B4C0",  // 미드 실버
          400: "#8090A0",
          500: "#6B7585",  // 보조 텍스트
          600: "#4A5568",
          700: "#363D4A",
        },
        // ── Accent: 스틸 블루 (CTA·포인트)
        accent: {
          DEFAULT: "#5B8DB8",
          dark:    "#3E6F99",
          light:   "#7AADD4",
          subtle:  "#5B8DB820",
        },
        // ── 라이트 섹션 텍스트
        ink: {
          DEFAULT: "#16181E",
          muted:   "#4A5568",
          subtle:  "#6B7585",
        },
      },
      fontFamily: {
        sans: ["var(--font-noto-sans-kr)", "Noto Sans KR", "sans-serif"],
      },
      backgroundImage: {
        // 다크 섹션 그라데이션
        "ti-gradient":     "linear-gradient(135deg, #16181E 0%, #1F2530 60%, #16181E 100%)",
        // 금속 광택 효과 (섹션 헤더 등)
        "metal-sheen":     "linear-gradient(105deg, #16181E 0%, #2E3340 40%, #1F2530 100%)",
        // 라이트 섹션
        "light-surface":   "linear-gradient(180deg, #F2F4F6 0%, #FFFFFF 100%)",
        // 히어로 오버레이
        "hero-overlay":    "linear-gradient(180deg, rgba(22,24,30,0.88) 0%, rgba(22,24,30,0.55) 60%, rgba(22,24,30,0.92) 100%)",
        // 카드 shimmer
        "shimmer-ti":      "linear-gradient(105deg, transparent 40%, rgba(91,141,184,0.08) 50%, transparent 60%)",
      },
      animation: {
        "fade-in":     "fadeIn 0.6s ease-out forwards",
        "fade-in-up":  "fadeInUp 0.7s ease-out forwards",
        "fade-in-left":"fadeInLeft 0.6s ease-out forwards",
        "slide-up":    "slideUp 0.8s cubic-bezier(0.19,1,0.22,1) forwards",
        "shimmer":     "shimmer 2.5s linear infinite",
      },
      keyframes: {
        fadeIn:     { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        fadeInUp:   { "0%": { opacity: "0", transform: "translateY(40px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        fadeInLeft: { "0%": { opacity: "0", transform: "translateX(-30px)" }, "100%": { opacity: "1", transform: "translateX(0)" } },
        slideUp:    { "0%": { opacity: "0", transform: "translateY(60px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        shimmer:    { "0%": { transform: "translateX(-100%)" }, "100%": { transform: "translateX(200%)" } },
      },
      boxShadow: {
        "ti-sm":  "0 1px 3px rgba(22,24,30,0.4)",
        "ti-md":  "0 4px 16px rgba(22,24,30,0.5)",
        "ti-lg":  "0 8px 32px rgba(22,24,30,0.6)",
        "accent": "0 4px 20px rgba(91,141,184,0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
