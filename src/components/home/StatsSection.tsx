import AnimatedNumber from "@/components/ui/AnimatedNumber";
import ScrollReveal from "@/components/ui/ScrollReveal";

const stats = [
  { value: 20,  suffix: "+", label: "업력 (년)",       desc: "2007년 창립" },
  { value: 500, suffix: "+", label: "납품 프로젝트",   desc: "국내외 누적" },
  { value: 50,  suffix: "+", label: "적용 산업 분야",  desc: "다양한 적용처" },
  { value: 99,  suffix: "%", label: "재주문율",         desc: "고객 신뢰도" },
];

export default function StatsSection() {
  return (
    <section className="bg-ti-900 py-14 border-y border-ti-800">
      {/* top accent line */}
      <div className="metal-line mb-14" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 100}>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-black mb-1">
                  <AnimatedNumber
                    value={stat.value}
                    suffix={stat.suffix}
                    duration={2000}
                    className="text-accent"
                  />
                </div>
                <div className="text-silver-300 font-semibold text-sm mb-0.5">{stat.label}</div>
                <div className="text-silver-600 text-xs">{stat.desc}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <div className="metal-line mt-14" />
    </section>
  );
}
