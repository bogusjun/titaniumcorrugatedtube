"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, ChevronDown, Shield, Award, Factory } from "lucide-react";

const slides = [
  {
    image: "/images/products/hero-product-1.jpg",
    title: "チタン波管",
    subtitle: "Titanium Corrugated Tube",
    highlight: "熱交換器用耐食材料の新たな基準",
    body: "半導体・化学・航空宇宙・海洋産業に最適化された高純度チタン波管。\n優れた耐食性と柔軟性により、過酷な環境下でも完璧なシール性を保証します。",
  },
  {
    image: "/images/products/hero-product-2.jpg",
    title: "手で曲げられる",
    subtitle: "Flexibility Titanium",
    highlight: "お好みの形状へ簡単に成形",
    body: "別途の曲げ加工や溶接なしに、手で曲げてソケットで簡単に接続してご使用いただけます。\nロール状で供給されるため、100mの長さでも宅配便での受け取りが可能です。",
  },
  {
    image: "/images/products/hero-product-2.jpg",
    title: "コイル型熱交換器",
    subtitle: "Coil Heat Exchanger",
    highlight: "波管応用カスタム製作",
    body: "完成品としてご希望のサイズと長さでカスタム製作・供給が可能です。\nソケット接続で簡単にご使用いただけます。",
  },
];

const badges = [
  { icon: Shield,  text: "ISO 9001 · 45001 認証取得" },
  { icon: Factory, text: "チタン熱交換器専門企業" },
  { icon: Award,   text: "10年以上の納入実績" },
];

export default function JaHeroSection() {
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
      <div className="absolute inset-0 transition-opacity duration-700" style={{ opacity: fadeIn ? 1 : 0 }}>
        <Image src={slide.image} alt={slide.title} fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(10,14,20,0.85) 0%, rgba(10,14,20,0.6) 50%, transparent 100%)" }} />
      </div>

      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(200,208,220,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(200,208,220,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
        <div className="max-w-3xl">

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

          <div key={current} className="animate-fade-in-up [text-shadow:0_2px_8px_rgba(0,0,0,0.8)]">
            <p className="text-accent text-sm font-semibold uppercase tracking-[0.2em] mb-3 drop-shadow-md">
              {slide.subtitle}
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-silver-200 mb-4 leading-tight tracking-tight">
              {slide.title}
            </h1>
            <p className="text-xl md:text-2xl text-silver-200 font-light mb-2 drop-shadow-md">
              {slide.highlight}
            </p>
          </div>

          <p className="text-silver-300 text-base md:text-lg mt-4 mb-10 leading-relaxed max-w-2xl [text-shadow:0_1px_6px_rgba(0,0,0,0.9)] whitespace-pre-line">
            {slide.body}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/ja/support" className="btn-primary text-base py-4 px-8 group">
              無料見積もり依頼
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/ja/products" className="btn-outline text-base py-4 px-8">
              製品カタログを見る
            </Link>
            <a
              href="/catalog.pdf"
              download
              className="inline-flex items-center gap-2 text-silver-300 hover:text-white font-semibold text-base py-4 px-6 transition-colors border border-ti-700 rounded-lg hover:bg-ti-800/50"
            >
              <Download className="w-5 h-5" />
              PDF ダウンロード
            </a>
          </div>
        </div>
      </div>

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

      <div className="absolute bottom-8 right-8 hidden md:flex flex-col items-center gap-2 text-silver-600 animate-bounce z-10">
        <span className="text-[10px] tracking-widest rotate-90 mb-1">SCROLL</span>
        <ChevronDown className="w-4 h-4" />
      </div>
    </section>
  );
}
