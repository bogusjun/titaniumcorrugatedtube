"use client";

import { useState } from "react";
import { FileText, Calculator } from "lucide-react";
import SavingsCalculator from "./SavingsCalculator";

const TABS = [
  { id: "product", label: "제품 소개",    icon: FileText },
  { id: "calc",    label: "절감액 계산기", icon: Calculator },
] as const;

type TabId = typeof TABS[number]["id"];

export default function TabWrapper({ productContent }: { productContent: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabId>("product");

  return (
    <>
      {/* 탭 네비게이션 — sticky */}
      <div className="sticky top-16 md:top-20 z-40 bg-ti-950/95 backdrop-blur-md border-b-2 border-accent/30 shadow-ti-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-2 md:gap-3 py-2 md:py-3">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`
                  flex items-center justify-center gap-2 md:gap-3 px-4 py-3 md:py-4 rounded-lg text-sm md:text-base font-bold transition-all
                  ${activeTab === id
                    ? "bg-accent text-white shadow-lg shadow-accent/30 scale-[1.02]"
                    : "bg-ti-900 border border-ti-700 text-silver-300 hover:text-white hover:border-accent/50 hover:bg-ti-800"}
                `}
              >
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      {activeTab === "product" && productContent}

      {activeTab === "calc" && (
        <div className="min-h-screen bg-ti-950">
          <section className="py-12 md:py-16">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-16">
              {/* 섹션 타이틀 */}
              <div className="text-center mb-8">
                <span className="inline-flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-widest mb-3">
                  <span className="w-5 h-px bg-accent inline-block" />
                  영업용 계산 도구
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
                  우리 현장에 설치하면{" "}
                  <span className="text-accent">얼마나 절감되나요?</span>
                </h2>
                <p className="text-silver-400 text-base">
                  유량·온도·전기요금을 입력하면 에너지 보존 법칙 기반으로 물리적으로 가능한 절감 효과를 즉시 계산합니다.
                </p>
              </div>

              <SavingsCalculator />
            </div>
          </section>
        </div>
      )}
    </>
  );
}
