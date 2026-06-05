import { Shield, Zap, Flame, Droplets, Microscope, Weight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";

const advantages = [
  { icon: Shield,    title: "최강의 내식성",    desc: "불산·염산·황산 등 강부식성 화학물질에 탁월한 내성. SUS 316L 대비 10배 이상의 내식 수명.", color: "text-silver-300", bg: "bg-ti-700" },
  { icon: Weight,    title: "경량 고강도",       desc: "SUS 316L 대비 40% 가벼우면서도 동등 이상의 강도. 항공·모바일 장비에 최적.", color: "text-silver-300", bg: "bg-ti-700" },
  { icon: Flame,     title: "광범위 온도 대응",  desc: "극저온(-196°C) LNG 배관부터 고온(350°C) 스팀 배관까지 하나의 소재로 대응.", color: "text-accent",     bg: "bg-accent/10" },
  { icon: Droplets,  title: "완벽한 내해수성",   desc: "해수·염수 환경에서 스테인리스가 빠르게 부식되는 반면, 티타늄은 반영구적 내구성.", color: "text-silver-300", bg: "bg-ti-700" },
  { icon: Microscope,title: "생체 친화성",       desc: "FDA 인정 생체 친화 소재. 의료기기·제약 배관에 완벽히 적용 가능.", color: "text-silver-300", bg: "bg-ti-700" },
  { icon: Zap,       title: "유연성·진동 흡수",  desc: "주름 구조로 배관 변위·진동을 흡수. 열팽창·기계 진동에 의한 배관 파손 방지.", color: "text-accent",     bg: "bg-accent/10" },
];

const comparisonRows = [
  { property: "내식성",      titanium: "탁월 (HF, HCl 대응)", sus316: "불량 (강산 취약)" },
  { property: "비중",        titanium: "4.51 g/cm³",          sus316: "7.98 g/cm³" },
  { property: "인장강도",    titanium: "≥ 345 MPa",           sus316: "≥ 515 MPa" },
  { property: "내해수성",    titanium: "반영구",               sus316: "1~3년 (점식 발생)" },
  { property: "생체 친화성", titanium: "✔ FDA 공인",          sus316: "✗" },
  { property: "사용 온도",   titanium: "-196°C ~ 350°C",      sus316: "-180°C ~ 300°C" },
  { property: "유지보수",    titanium: "거의 불필요",          sus316: "정기 교체 필요" },
];

export default function WhyTitanium() {
  return (
    <section className="section-dark relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-silver-200/3 rounded-full blur-3xl pointer-events-none" />

      <div className="container-pad relative">
        <ScrollReveal>
          <SectionHeader
            label="왜 티타늄인가"
            title="스테인리스를 넘어서는 성능"
            subtitle="단순한 대체재가 아닙니다. 가혹한 환경일수록 티타늄의 가치는 빛납니다."
            light
          />
        </ScrollReveal>

        {/* Advantages */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-14">
          {advantages.map((adv, i) => (
            <ScrollReveal key={adv.title} delay={i * 80}>
              <div className="card-dark p-6 hover:-translate-y-1 transition-transform duration-300 hover:border-ti-700">
                <div className={`inline-flex p-3 rounded-xl ${adv.bg} mb-4`}>
                  <adv.icon className={`w-6 h-6 ${adv.color}`} />
                </div>
                <h3 className="text-silver-200 font-bold text-lg mb-2">{adv.title}</h3>
                <p className="text-silver-500 text-sm leading-relaxed">{adv.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Comparison Table */}
        <ScrollReveal delay={200}>
          <div className="mt-16 bg-ti-900 rounded-2xl border border-ti-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-ti-800 flex items-center gap-3">
              <div className="metal-line w-6 h-px" />
              <h3 className="text-silver-200 font-bold text-lg">티타늄 vs 스테인리스(SUS 316L) 비교</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ti-800">
                    <th className="text-left py-3 px-6 text-silver-500 font-medium w-36">항목</th>
                    <th className="text-left py-3 px-6 text-accent font-semibold">티타늄 주름관</th>
                    <th className="text-left py-3 px-6 text-silver-600 font-medium">SUS 316L 주름관</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr key={row.property} className={`border-b border-ti-800/50 ${i % 2 === 0 ? "bg-ti-950/30" : ""}`}>
                      <td className="py-3 px-6 text-silver-400 font-medium">{row.property}</td>
                      <td className="py-3 px-6 text-silver-200">{row.titanium}</td>
                      <td className="py-3 px-6 text-silver-600">{row.sus316}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
