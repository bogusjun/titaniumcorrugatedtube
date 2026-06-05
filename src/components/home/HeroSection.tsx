"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, ChevronDown, Shield, Zap, Award } from "lucide-react";

const slides = [
  {
    image: "/images/products/hero-product-1.jpg",
    title: "티타늄 주름관",
    subtitle: "Titanium Corrugated Tube",
    highlight: "내식성 배관의 새로운 기준",
  },
  {
    image: "/images/products/hero-product-2.jpg",
    title: "반도체·화학·해양",
    subtitle: "Industrial Applications",
    highlight: "강부식 환경에서 검증된 소재",
  },
  {
    image: "/images/products/hero-product-3.jpg",
    title: "코일형 열교환기",
    subtitle: "Coil Heat Exchanger",
    highlight: "주름관 응용 맞춤 제작",
  },
];

const badges = [
  { icon: Shield, text: "ISO 9001 인증" },
  { icon: Zap,    text: "Grade 1/2/7 대응" },
  { icon: Award,  text: "20년 이상 납품 실적" },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [fadeIn, setFadeIn]   = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => { setCurrent((c) => (c + 1) % slides.length); setFadeIn(true); }, 400);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-ti-950">
      {/* Background image */}
      <div className="absolute inset-0 transition-opacity duration-700" style={{ opacity: fadeIn ? 1 : 0 }}>
        <Image src={slide.image} alt={slide.title} fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-hero-overlay" />
      </div>

      {/* Metal grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(200,208,220,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(200,208,220,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />


      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
        <div className="max-w-3xl">

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-8">
            {badges.map(({ icon: Icon, text }) => (
              <span
                key={text}
                className="inline-flex items-center gap-1.5 bg-ti-900/70 backdrop-blur-sm border border-ti-800 text-silver-300 text-xs font-medium px-3 py-1.5 rounded-full"
              >
                <Icon className="w-3.5 h-3.5 text-accent" />
                {text}
              </span>
            ))}
          </div>

          {/* Title */}
          <div key={current} className="animate-fade-in-up">
            <p className="text-accent text-sm font-semibold uppercase tracking-[0.2em] mb-3">
              {slide.subtitle}
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-silver-200 mb-4 leading-tight tracking-tight">
              {slide.title}
            </h1>
            <p className="text-xl md:text-2xl text-silver-400 font-light mb-2">
              {slide.highlight}
            </p>
          </div>

          <p className="text-silver-500 text-base md:text-lg mt-4 mb-10 leading-relaxed max-w-2xl">
            반도체·화학·항공우주·해양 산업에 최적화된 고순도 티타늄 주름관.
            뛰어난 내식성과 유연성으로 가혹한 환경에서도 완벽한 밀봉성을 보장합니다.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/support" className="btn-primary text-base py-4 px-8 group">
              무료 견적 요청
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/products" className="btn-outline text-base py-4 px-8">
              제품 카탈로그 보기
            </Link>
            <a
              href="/catalog.pdf"
              download
              className="inline-flex items-center gap-2 text-silver-500 hover:text-silver-300 font-semibold text-base py-4 px-6 transition-colors border border-ti-800 rounded-lg hover:bg-ti-800/50"
            >
              <Download className="w-5 h-5" />
              PDF 다운로드
            </a>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-px rounded-full transition-all duration-300 ${
              i === current ? "w-8 bg-accent" : "w-2 bg-silver-600"
            }`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 hidden md:flex flex-col items-center gap-2 text-silver-600 animate-bounce z-10">
        <span className="text-[10px] tracking-widest rotate-90 mb-1">SCROLL</span>
        <ChevronDown className="w-4 h-4" />
      </div>
    </section>
  );
}
