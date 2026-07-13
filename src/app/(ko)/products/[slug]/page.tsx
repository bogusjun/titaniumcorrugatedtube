import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft, CheckCircle2, Thermometer, Gauge, Ruler, Phone,
  Package, Settings2, ChevronRight, Hand, Wrench, Waves, ArrowRight,
  X, AlertCircle, ShieldCheck, Zap, FlaskConical, Fish, Cpu, Ship,
  RotateCcw, Star, MapPin, Flame, Leaf, RefreshCw,
} from "lucide-react";
import Image from "next/image";
import productsData from "@/data/products.json";
import ProductCard from "@/components/product/ProductCard";
import ProductImageGallery from "@/components/product/ProductImageGallery";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return productsData.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = productsData.find((p) => p.slug === params.slug);
  if (!product) return {};
  const url = `https://www.atx-titanium.co.kr/products/${product.slug}`;
  const ogImage = product.images?.[0]
    ? { url: product.images[0], width: 1200, height: 630, alt: product.name }
    : { url: "/images/og-image.jpg", width: 1200, height: 630, alt: product.name };
  return {
    title: product.name,
    description: product.description,
    alternates: {
      canonical: url,
      languages: {
        ko: url,
        en: `https://www.atx-titanium.co.kr/en/products/${product.slug}`,
        ja: `https://www.atx-titanium.co.kr/ja/products/${product.slug}`,
      },
    },
    openGraph: {
      title: `${product.name} | ATX 티타늄 주름관`,
      description: product.description,
      url,
      images: [ogImage],
    },
  };
}

const specLabels: [string, string][] = [
  ["nominalSize", "호칭 규격"],
  ["outerDiameter", "외경 (OD)"],
  ["innerDiameter", "내경 (ID)"],
  ["wallThickness", "두께"],
  ["bendRadius", "공차"],
  ["workingPressure", "사용 압력"],
  ["testPressure", "시험 압력"],
  ["temperatureRange", "온도 범위"],
  ["material", "재질 (Grade)"],
  ["standardLength", "공급 길이"],
  ["endFitting", "연결 방식"],
];

type ProductData = (typeof productsData)[number];
type Variant = { size: string } & Record<string, string>;

const standardItems = [
  { length: "300mm", turns: "약 5권", fitting: '3/8" NPT 수나사' },
  { length: "500mm", turns: "약 9권", fitting: '3/8" NPT 수나사' },
  { length: "1,000mm", turns: "약 18권", fitting: '3/8" NPT 수나사' },
];

function TubeStandardSection() {
  return (
    <div className="space-y-8 mb-12">
      {/* 표준품 재고 테이블 */}
      <div className="bg-white rounded-2xl border border-silver-100 overflow-hidden">
        <div className="bg-ti-950 px-6 py-4 flex items-center gap-3">
          <Package className="w-5 h-5 text-accent" />
          <h2 className="text-silver-200 font-bold text-lg">재고 표준품 라인업</h2>
          <span className="ml-auto text-xs bg-accent/20 text-accent px-2.5 py-1 rounded-full font-semibold">즉시 납품</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-silver-100 bg-silver-50">
                {["길이", "권수", "피팅 사양"].map((h) => (
                  <th key={h} className="py-3 px-5 text-left font-semibold text-ink-subtle whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {standardItems.map((item, i) => (
                <tr key={i} className={`border-t border-silver-100 ${i % 2 === 0 ? "bg-white" : "bg-silver-50"}`}>
                  <td className="py-3 px-5 font-semibold text-ink">{item.length}</td>
                  <td className="py-3 px-5 text-ink-muted">{item.turns}</td>
                  <td className="py-3 px-5 text-ink-muted">{item.fitting}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 bg-silver-50 border-t border-silver-100">
          <p className="text-xs text-ink-subtle">* 재고 현황에 따라 납기가 상이할 수 있습니다. 정확한 재고 확인은 문의 바랍니다.</p>
        </div>
      </div>

      {/* 주문제작 안내 */}
      <div className="bg-white rounded-2xl border border-silver-100 overflow-hidden">
        <div className="bg-ti-950 px-6 py-4 flex items-center gap-3">
          <Settings2 className="w-5 h-5 text-accent" />
          <h2 className="text-silver-200 font-bold text-lg">주문제작 — 규격 자유 지정</h2>
        </div>
        <div className="p-6">
          <p className="text-ink-subtle text-sm leading-relaxed mb-6">
            표준품 외에도 아래 항목을 고객이 원하는 수치로 자유롭게 지정하여 제작합니다.
            도면 없이 수치만으로도 발주가 가능하며, 소량 1개부터 대량 주문까지 모두 대응합니다.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              {
                label: "외경 (OD)",
                desc: "15A 외 다른 규격도 제작 가능",
                example: "예) 12mm, 25mm…",
              },
              {
                label: "코일 길이",
                desc: "원하는 유로 길이로 코일 권수 조정",
                example: "예) 200mm ~ 5,000mm",
              },
              {
                label: "피팅 사양",
                desc: "NPT / BSPT / 플랜지 / 용접단 등",
                example: "예) 3/8\" NPT, 양쪽 용접단",
              },
            ].map((item) => (
              <div key={item.label} className="bg-silver-50 rounded-xl p-4 border border-silver-100">
                <p className="font-bold text-ink text-sm mb-1">{item.label}</p>
                <p className="text-ink-subtle text-xs leading-relaxed mb-2">{item.desc}</p>
                <p className="text-accent text-xs font-medium">{item.example}</p>
              </div>
            ))}
          </div>
          <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 flex items-start gap-3">
            <ChevronRight className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
            <p className="text-sm text-ink-muted leading-relaxed">
              <span className="font-semibold text-ink">주문제작 리드타임:</span> 수량·사양에 따라 다르나 통상{" "}
              <span className="font-semibold text-ink">2~4주</span> 소요. 긴급 대응 가능 여부는 문의 바랍니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const tubeEnSpecs = [
  { label: "Size", enLabel: "Size", key: "size" },
  { label: "외경 (Outer Diameter / O.D)", enLabel: "Outer Diameter (O.D)", key: "outerDiameter" },
  { label: "내경 (Inner Diameter / I.D)", enLabel: "Inner Diameter (I.D)", key: "innerDiameter" },
  { label: "두께 (Wall Thickness / T)", enLabel: "Wall Thickness (T)", key: "wallThickness" },
  { label: "중량 (Weight)", enLabel: "Weight (kg/m)", key: "weight" },
  { label: "공차 (Tolerance)", enLabel: "Tolerance (mm)", key: "bendRadius" },
  { label: "공급 가능 길이 (Available Length)", enLabel: "Available Length", key: "standardLength" },
  { label: "소재 (Material)", enLabel: "Material", key: "material" },
];

const tubeSpecData = [
  { size: "10A", outerDiameter: "OD 16.4mm", innerDiameter: "11.7mm", wallThickness: "0.3mm", weight: "0.083 kg/m", bendRadius: "±0.3mm", standardLength: "1~100m", material: "Ti Grade 2" },
  { size: "15A", outerDiameter: "OD 19.4mm", innerDiameter: "15.4mm", wallThickness: "0.3mm", weight: "0.104 kg/m", bendRadius: "±0.3mm", standardLength: "1~100m", material: "Ti Grade 2" },
];

function TubeVariantTable({ variants }: { variants: Variant[] }) {
  void variants; // products.json variants는 하위 호환을 위해 유지, 실제 렌더링은 tubeSpecData 사용
  return (
    <div className="space-y-6 mb-8">
      {/* 한국어 버전 */}
      <div className="bg-white rounded-2xl border border-silver-100 overflow-hidden">
        <div className="bg-ti-950 px-6 py-4 flex items-center gap-3">
          <Ruler className="w-5 h-5 text-accent" />
          <h2 className="text-silver-200 font-bold text-lg">규격별 기술 사양</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-silver-100 bg-silver-50">
                <th className="py-3 px-5 text-left font-semibold text-ink-subtle w-52">항목</th>
                {tubeSpecData.map((v) => (
                  <th key={v.size} className="py-3 px-5 text-center font-black text-ink text-base">
                    {v.size}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tubeEnSpecs.map(({ label, key }, i) => (
                <tr key={key} className={`border-t border-silver-100 ${i % 2 === 0 ? "bg-white" : "bg-silver-50"}`}>
                  <td className="py-3 px-5 font-semibold text-ink-subtle text-xs leading-tight">{label}</td>
                  {tubeSpecData.map((v) => (
                    <td key={v.size} className="py-3 px-5 text-center text-ink font-medium">
                      {(v as Record<string, string>)[key] || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 bg-silver-50 border-t border-silver-100">
          <p className="text-xs text-ink-subtle">* 위 사양은 표준 제조 기준이며, 주문제작 시 외경·두께·피팅 사양 변경 가능합니다.</p>
        </div>
      </div>

      {/* 영문 버전 (카탈로그용) */}
      <div className="bg-white rounded-2xl border border-silver-100 overflow-hidden">
        <div className="bg-ti-950 px-6 py-4 flex items-center gap-3">
          <Ruler className="w-5 h-5 text-accent" />
          <h2 className="text-silver-200 font-bold text-lg">Technical Specifications</h2>
          <span className="ml-auto text-xs bg-accent/20 text-accent px-2.5 py-1 rounded-full font-semibold">English</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-silver-100 bg-silver-50">
                <th className="py-3 px-5 text-left font-semibold text-ink-subtle w-52">Item</th>
                {tubeSpecData.map((v) => (
                  <th key={v.size} className="py-3 px-5 text-center font-black text-ink text-base">
                    {v.size}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tubeEnSpecs.map(({ enLabel, key }, i) => (
                <tr key={key} className={`border-t border-silver-100 ${i % 2 === 0 ? "bg-white" : "bg-silver-50"}`}>
                  <td className="py-3 px-5 font-semibold text-ink-subtle">{enLabel}</td>
                  {tubeSpecData.map((v) => (
                    <td key={v.size} className="py-3 px-5 text-center text-ink font-medium">
                      {(v as Record<string, string>)[key] || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 bg-silver-50 border-t border-silver-100">
          <p className="text-xs text-ink-subtle">* Specifications are based on standard manufacturing. OD, wall thickness, and fitting type can be customized upon order.</p>
        </div>
      </div>
    </div>
  );
}

function TubeMaterialSection() {
  return (
    <div className="bg-white rounded-2xl border border-silver-100 overflow-hidden mb-8">
      <div className="bg-ti-950 px-6 py-4 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-accent" />
        <h2 className="text-silver-200 font-bold text-lg">Grade 2 티타늄 — 소재가 다릅니다</h2>
      </div>
      <div className="p-6">
        <p className="text-ink-muted text-sm leading-relaxed mb-6">
          ATX 티타늄 주름관은 산업용 티타늄 중 가장 널리 쓰이는{" "}
          <strong className="text-ink">Grade 2 (공업용 순티타늄)</strong>으로 제조됩니다.
          스테인리스·PVC 대비 내식성·경량성이 압도적으로 우수하며,
          해수·강산·강알칼리 등 극한 환경에서도 장기 사용이 가능합니다.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            {
              icon: ShieldCheck,
              title: "내식성",
              sub: "최고 등급",
              desc: "해수·염산·황산·수산화나트륨 등 대부분의 부식성 유체에 무반응. 스테인리스 대비 내식 수명 10배 이상.",
              color: "text-accent",
              bg: "bg-accent/5 border-accent/20",
            },
            {
              icon: Zap,
              title: "경량성",
              sub: "스테인리스의 57%",
              desc: "비중 4.5로 스테인리스(7.9)의 절반 수준. 동일 길이 기준 무게가 가벼워 운송·시공 부담이 낮습니다.",
              color: "text-blue-500",
              bg: "bg-blue-50 border-blue-100",
            },
            {
              icon: Star,
              title: "생체친화성",
              sub: "의료·식품 등급",
              desc: "인체 삽입재·식품 배관으로도 허가된 소재. 수산물 양식장·활어차·음료 배관에 이물질 용출 우려 없음.",
              color: "text-green-600",
              bg: "bg-green-50 border-green-100",
            },
            {
              icon: Thermometer,
              title: "내열성",
              sub: "-196°C ~ 280°C",
              desc: "극저온 액체질소부터 고온 스팀까지 대응. PVC·합성수지 파이프가 변형되는 환경에서도 형상 유지.",
              color: "text-orange-500",
              bg: "bg-orange-50 border-orange-100",
            },
          ].map((item) => (
            <div key={item.title} className={`rounded-2xl border p-5 ${item.bg}`}>
              <div className={`flex items-center gap-2 mb-1 ${item.color}`}>
                <item.icon className="w-5 h-5" />
                <span className="font-black text-base">{item.title}</span>
              </div>
              <p className={`text-xs font-bold mb-3 ${item.color}`}>{item.sub}</p>
              <p className="text-xs text-ink-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        {/* 소재 비교 테이블 */}
        <div className="overflow-x-auto rounded-xl border border-silver-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-silver-50 border-b border-silver-100">
                <th className="py-3 px-4 text-left font-semibold text-ink-subtle">항목</th>
                <th className="py-3 px-4 text-center font-semibold text-ink-subtle">스테인리스</th>
                <th className="py-3 px-4 text-center font-semibold text-ink-subtle">PVC</th>
                <th className="py-3 px-4 text-center font-bold text-accent">Ti Grade 2</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["해수 내식성", "❌ 부식", "⚠️ 보통", "✅ 우수"],
                ["최고 사용 온도", "~500°C", "~60°C", "~280°C"],
                ["비중 (가벼울수록 ↓)", "7.9", "1.4", "4.5"],
                ["생체친화성", "❌", "❌", "✅ 의료 등급"],
                ["굴곡 유연성", "❌ 불가", "⚠️ 제한적", "✅ 손으로 밴딩"],
                ["수명 (해수 환경)", "1~3년", "3~5년", "반영구"],
              ].map(([label, ss, pvc, ti], i) => (
                <tr key={label} className={`border-t border-silver-100 ${i % 2 === 0 ? "bg-white" : "bg-silver-50/50"}`}>
                  <td className="py-3 px-4 font-semibold text-ink-subtle text-xs">{label}</td>
                  <td className="py-3 px-4 text-center text-xs text-ink-muted">{ss}</td>
                  <td className="py-3 px-4 text-center text-xs text-ink-muted">{pvc}</td>
                  <td className="py-3 px-4 text-center text-xs font-bold text-accent bg-accent/5">{ti}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TubeApplicationSection() {
  const industries = [
    {
      icon: Fish,
      title: "해수 양식장",
      color: "text-blue-600",
      bg: "bg-blue-50 border-blue-100",
      desc: "해수 냉각·가열 열교환기, 수조 온도 유지 배관으로 사용. 해수에 강한 내식성으로 스테인리스 교체 수요 급증.",
      examples: ["활어 수조 냉각 코일", "해수 열교환기 코어", "수산물 양식장 온도 조절"],
    },
    {
      icon: Cpu,
      title: "반도체·전자",
      color: "text-purple-600",
      bg: "bg-purple-50 border-purple-100",
      desc: "초순수(UPW)·약품 이송 라인, 세정조 배관. 고순도 유지가 필수인 공정에서 이물질 용출 제로.",
      examples: ["세정액 공급 배관", "초순수 이송 라인", "에칭 약품 배관"],
    },
    {
      icon: FlaskConical,
      title: "화학·제약",
      color: "text-green-600",
      bg: "bg-green-50 border-green-100",
      desc: "강산·강알칼리·유기용제 등 부식성 약품 이송. 반응기 냉각 코일, 약품 가열·냉각 배관.",
      examples: ["반응기 냉각 코일", "강산 이송 배관", "제약 공정 냉각 라인"],
    },
    {
      icon: Ship,
      title: "선박·해양",
      color: "text-cyan-600",
      bg: "bg-cyan-50 border-cyan-100",
      desc: "해수 담수화 플랜트, 선박 해수 배관, 해양플랜트 부식 방지 배관. 내해수성 최고 등급 소재.",
      examples: ["선박 해수 냉각 배관", "담수화 설비 배관", "해양플랜트 유체 라인"],
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-silver-100 overflow-hidden mb-8">
      <div className="bg-ti-950 px-6 py-4">
        <h2 className="text-silver-200 font-bold text-lg">적용 분야</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {industries.map((ind) => (
            <div key={ind.title} className={`rounded-2xl border p-5 ${ind.bg}`}>
              <div className={`flex items-center gap-2 mb-2 ${ind.color}`}>
                <ind.icon className="w-5 h-5" />
                <span className="font-black text-base text-ink">{ind.title}</span>
              </div>
              <p className="text-sm text-ink-muted leading-relaxed mb-3">{ind.desc}</p>
              <ul className="space-y-1">
                {ind.examples.map((ex) => (
                  <li key={ex} className="flex items-center gap-2 text-xs text-ink-muted">
                    <ChevronRight className={`w-3 h-3 flex-shrink-0 ${ind.color}`} />
                    {ex}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* 기타 태그 */}
        <div className="mt-4 pt-4 border-t border-silver-100">
          <p className="text-xs text-ink-subtle font-semibold mb-2">기타 적용 분야</p>
          <div className="flex flex-wrap gap-2">
            {["의료기기 배관", "정밀 계측배관", "범용 화학배관", "R&D 실험실", "온천·스파 설비", "폐열회수 시스템"].map((tag) => (
              <span key={tag} className="px-3 py-1 bg-silver-50 text-ink-muted rounded-lg text-xs font-medium border border-silver-100">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const competitors = [
  {
    name: "스테인리스 스틸",
    icon: AlertCircle,
    color: "text-red-500",
    bg: "bg-red-50 border-red-100",
    cons: [
      "해수·부식성 유체에서 빠르게 산화·부식",
      "잦은 교체·수리로 유지비 증가",
      "녹으로 중금속 오염 우려",
    ],
  },
  {
    name: "PVC 엑셀파이프",
    icon: AlertCircle,
    color: "text-orange-500",
    bg: "bg-orange-50 border-orange-100",
    cons: [
      "두꺼운 관벽으로 열전달 효율 극히 낮음",
      "고온 환경 사용 불가",
      "직관형이라 열교환 면적 부족",
    ],
  },
  {
    name: "티타늄 직관",
    icon: AlertCircle,
    color: "text-yellow-600",
    bg: "bg-yellow-50 border-yellow-100",
    cons: [
      "벤딩 가공 및 운송비 별도 발생",
      "직선형이라 열전달 효율 낮음",
      "현장 용접·시공 필요",
    ],
  },
  {
    name: "ATX 티타늄 주름관",
    icon: CheckCircle2,
    color: "text-accent",
    bg: "bg-accent/5 border-accent/20",
    best: true,
    pros: [
      "넓은 전열면적 + 난류 효과로 최고 열교환 효율",
      "손으로 밴딩 — 용접·공사 없이 직접 시공",
      "확실한 내부식성 (해수·강산·강알칼리 대응)",
    ],
  },
];

function TubeCompareSection() {
  const others = competitors.filter((c) => !c.best);
  const best = competitors.find((c) => c.best)!;

  return (
    <div className="bg-white rounded-2xl border border-silver-100 overflow-hidden mb-8">
      <div className="bg-ti-950 px-6 py-4">
        <h2 className="text-silver-200 font-bold text-lg">소재별 비교 — 왜 티타늄 주름관인가</h2>
      </div>
      <div className="p-6 space-y-4">

        {/* 스테인리스 녹 문제 — 실사 강조 */}
        <div className="rounded-2xl overflow-hidden border-2 border-red-200 bg-red-50">
          <div className="bg-red-600 px-5 py-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-white flex-shrink-0" />
            <p className="text-white font-black text-sm">
              혹시 이런 경험 있으신가요? — 스테인리스 주름관 사용 현장의 실제 사진입니다
            </p>
          </div>
          <div className="grid grid-cols-3 gap-0">
            {[
              { src: "/images/products/ss-rust-closeup.jpg", caption: "주름관 부식으로 인해 터짐" },
              { src: "/images/products/ss-rust-coil.jpg", caption: "타래 전체로 번진 녹 (중금속 용출)" },
              { src: "/images/products/ss-rust-pile.jpg", caption: "폐기된 스테인리스 주름관 더미" },
            ].map((img) => (
              <div key={img.src} className="relative aspect-[4/3] group overflow-hidden">
                <Image
                  src={img.src}
                  alt={img.caption}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <p className="absolute bottom-0 left-0 right-0 text-white text-[10px] leading-tight p-2 font-medium">
                  {img.caption}
                </p>
              </div>
            ))}
          </div>
          <div className="px-5 py-4 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-red-700 font-bold mb-1">
                위 사진은 모두{" "}
                <span className="bg-red-200 px-1 rounded">스테인리스 스틸(SUS304/316) 주름관</span>
                입니다. 티타늄과 외형이 비슷해 혼동하기 쉽지만, 소재가 근본적으로 다릅니다.
              </p>
              <p className="text-xs text-red-600 leading-relaxed">
                스테인리스는 해수·염소 이온·산성 환경에서 <strong>공식(孔食) 부식</strong>이 진행됩니다.
                주름 골 사이 좁은 틈에 부식이 집중되어, 겉으로 멀쩡해 보여도 내부에서 먼저 썩습니다.
                1~3년 사용 후 교체 반복 — 그 비용과 공사 번거로움, 겪어보셨나요?
              </p>
            </div>
          </div>
        </div>

        {/* 비교 대상 3개 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {others.map((c) => (
            <div key={c.name} className={`rounded-xl border p-4 ${c.bg}`}>
              <div className="flex items-center gap-2 mb-3 font-bold text-sm text-ink">
                <c.icon className={`w-4 h-4 ${c.color}`} />
                {c.name}
              </div>
              <ul className="space-y-1.5">
                {(c.cons ?? []).map((text) => (
                  <li key={text} className="flex items-start gap-2 text-xs text-ink-muted leading-snug">
                    <X className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ATX 티타늄 주름관 — 크게 */}
        <div className="rounded-2xl border-2 border-accent/40 bg-accent/5 p-6 ring-2 ring-accent/20">
          <div className="flex items-center gap-3 mb-5">
            <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0" />
            <span className="text-lg font-black text-accent">{best.name}</span>
            <span className="ml-auto text-sm bg-accent text-white px-3 py-1 rounded-full font-bold">최선택</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {[
              { Icon: Zap,         color: "text-yellow-500", bg: "bg-yellow-50",   border: "border-yellow-200", title: "최고 열교환 효율", label: "직관 대비 열효율 ↑", desc: "주름 구조로 전열면적 극대화 + 난류 촉진. 동일 유로 길이에서 직관 대비 열교환량 대폭 향상." },
              { Icon: Hand,        color: "text-blue-500",   bg: "bg-blue-50",     border: "border-blue-200",   title: "용접·공사 불필요", label: "현장 직접 시공",     desc: "손으로 밴딩 후 소켓만 조이면 배관 완성. 전문 용접공 없이 현장에서 직접 시공 가능." },
              { Icon: ShieldCheck, color: "text-accent",     bg: "bg-accent/8",    border: "border-accent/20",  title: "반영구 내식 수명", label: "교체 없이 반영구",  desc: "해수·강산·강알칼리에서도 부식 없음. 스테인리스 대비 교체 주기 대폭 연장으로 유지비 절감." },
            ].map(({ Icon, color, bg, border, title, label, desc }) => (
              <div key={title} className="bg-white rounded-xl p-4 border border-accent/20 flex flex-col gap-3">
                <div className={`w-12 h-12 rounded-xl ${bg} border ${border} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <div>
                  <p className="text-xs font-bold text-ink-muted mb-0.5">{label}</p>
                  <p className="text-sm font-black text-ink">{title}</p>
                </div>
                <p className="text-xs text-ink-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-accent/10 rounded-xl p-4 text-center">
            <p className="text-sm font-bold text-accent">
한 번 설치로 끝납니다. 교체도, 추가 공사도 없습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TubeTurbulenceSection() {
  return (
    <div className="bg-white rounded-2xl border border-silver-100 overflow-hidden mb-8">
      <div className="bg-ti-950 px-6 py-4 flex items-center gap-3">
        <Waves className="w-5 h-5 text-accent" />
        <h2 className="text-silver-200 font-bold text-lg">주름 구조가 만드는 난류 — 열교환 효율의 핵심</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 직관형 */}
          <div className="bg-silver-50 rounded-2xl p-8 border border-silver-200 flex flex-col items-center text-center">
            <p className="text-sm font-bold text-ink-subtle uppercase tracking-widest mb-6">기존 직관형 파이프</p>
            <div className="relative w-full max-w-[360px] mb-6">
              <Image
                src="/images/products/pipe-laminar.png"
                alt="직관형 파이프 — 층류"
                width={720}
                height={200}
                className="w-full h-auto"
              />
            </div>
            <p className="text-base text-ink-muted leading-relaxed">
              직선형 관에서 유체가{" "}
              <strong className="text-ink">층류(Laminar flow)</strong>로 흐릅니다.
              <br />
              관 중심부만 빠르게 지나가 관벽과의 열교환이 충분히 일어나지 않습니다.
            </p>
          </div>

          {/* 주름관 */}
          <div className="bg-accent/5 rounded-2xl p-8 border-2 border-accent/30 flex flex-col items-center text-center">
            <p className="text-sm font-bold text-accent uppercase tracking-widest mb-6">ATX 티타늄 주름관</p>
            <div className="relative w-full max-w-[360px] mb-6">
              <Image
                src="/images/products/pipe-turbulent.png"
                alt="ATX 티타늄 주름관 — 난류"
                width={720}
                height={200}
                className="w-full h-auto"
              />
            </div>
            <p className="text-base text-ink-muted leading-relaxed">
              주름부에서 유체가{" "}
              <strong className="text-accent">난류(Turbulent flow)</strong>로 전환됩니다.
              <br />
              전열면적이 늘어나고 관벽과의 접촉이 극대화되어 가열·냉각 효율이 크게 향상됩니다.
            </p>
          </div>
        </div>

        {/* 결과 배너 */}
        <div className="mt-6 bg-ti-950 rounded-2xl py-8 px-8 flex flex-col items-center text-center gap-4">
          <Waves className="w-10 h-10 text-accent" />
          <p className="text-white font-bold text-xl">
            동일 유로 길이에서 직관 대비 열교환 효율 향상
          </p>
          <p className="text-silver-400 text-base">
            주름 구조로 전열면적 증가 + 난류 촉진 → 가열·냉각에 필요한 에너지 절감 가능
          </p>
        </div>
      </div>
    </div>
  );
}

function TubeInstallSection() {
  return (
    <div className="bg-white rounded-2xl border border-silver-100 overflow-hidden mb-12">
      <div className="bg-ti-950 px-6 py-4 flex items-center gap-3">
        <Hand className="w-5 h-5 text-accent" />
        <h2 className="text-silver-200 font-bold text-lg">직접 시공 가능 — 용접·공사비 제로</h2>
      </div>
      <div className="p-6 space-y-6">

        {/* 운송 문제 부각 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-red-100">
          {/* 이미지 */}
          <div className="relative aspect-[4/3] md:aspect-auto min-h-[220px]">
            <Image
              src="/images/products/pipe-transport.jpg"
              alt="직관 파이프 운송의 불편함"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="inline-block bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
                직관형 파이프의 현실
              </span>
              <p className="text-white font-black text-lg leading-tight drop-shadow">
                번거로운 파이프 운송<br />
                <span className="text-sm font-medium opacity-90">공간 크기에 맞게 절단 필요</span>
              </p>
            </div>
          </div>
          {/* 대조 내용 */}
          <div className="bg-red-50 p-6 flex flex-col justify-center gap-4">
            <div>
              <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2">직관형 파이프 문제점</p>
              <ul className="space-y-2">
                {[
                  "긴 파이프를 트럭으로 운반 — 운반비·안전사고 위험",
                  "현장 크기에 맞게 절단·용접 필요",
                  "시공 후 이동·교체 불가",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm text-ink-muted">
                    <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-red-200 pt-4">
              <p className="text-xs font-bold text-accent uppercase tracking-wider mb-2">ATX 티타늄 주름관 해결</p>
              <ul className="space-y-2">
                {[
                  "코일 형태로 공급 — 택배 박스 크기로 배송 가능",
                  "1m~100m, 원하는 길이로 주문 가능. 현장에서 원하는 길이로 절단해서 사용 가능",
                  "손으로 밴딩, 소켓만 조이면 시공 완료",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm text-ink-muted">
                    <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 1~100m 강조 배너 */}
        <div className="bg-ti-950 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="flex-shrink-0">
            <p className="text-5xl font-black text-accent leading-none">1<span className="text-2xl">m</span></p>
            <p className="text-silver-500 text-xs mt-0.5">최소</p>
          </div>
          <div className="text-silver-400 text-2xl font-light hidden sm:block">~</div>
          <div className="flex-shrink-0">
            <p className="text-5xl font-black text-white leading-none">100<span className="text-2xl">m</span></p>
            <p className="text-silver-500 text-xs mt-0.5">최대</p>
          </div>
          <div className="sm:ml-6 sm:border-l sm:border-silver-700 sm:pl-6">
            <p className="text-white font-bold text-base mb-1">필요한 길이 그대로 — 낭비 없이 주문</p>
            <p className="text-silver-400 text-sm leading-relaxed">
              소량 1m부터 대량 100m까지 코일 단위로 공급.<br className="hidden sm:block" />
              현장에서 잘라 쓰면 자투리도 다음 시공에 재사용 가능합니다.
            </p>
          </div>
        </div>

        {/* 손으로 밴딩 — 실제 영상 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="rounded-2xl overflow-hidden bg-black aspect-video">
            <video
              src="/images/products/tube-bending.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1">
              <Hand className="w-5 h-5 text-accent" />
              <p className="font-black text-ink text-lg">손으로 밴딩 — 도구 불필요</p>
            </div>
            <p className="text-ink-muted text-sm leading-relaxed">
              별도 기계·장비 없이 <strong className="text-ink">맨손으로 원하는 형태로 구부릴 수 있습니다.</strong>
              현장 공간에 맞게 즉석에서 형상을 조정할 수 있어, 복잡한 배관 경로도 간단히 대응합니다.
            </p>
            <ul className="space-y-2">
              {[
                "별도 벤딩 기계·공구 불필요",
                "현장에서 즉시 원하는 각도로 조정",
                "수조·탱크·배관 경로에 자유롭게 맞춤",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2 text-sm text-ink-muted">
                  <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 시공 나머지 2단계 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 소켓 연결 */}
          <div className="bg-silver-50 rounded-xl border border-silver-100 overflow-hidden">
            <div className="relative aspect-[4/3] bg-white">
              <Image
                src="/images/products/socket-connected.png"
                alt="티타늄·황동 소켓 연결 실물"
                fill
                className="object-contain p-4"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
            <div className="p-5 text-center">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                <Wrench className="w-5 h-5 text-accent" />
              </div>
              <p className="font-bold text-ink text-sm mb-2">소켓 연결만으로 완성</p>
              <p className="text-ink-subtle text-xs leading-relaxed">티타늄·황동 소켓을 조이는 것만으로 배관 완성. 용접 공정이 필요 없습니다.</p>
            </div>
          </div>

          {/* 원하는 길이로 절단 */}
          <div className="bg-silver-50 rounded-xl border border-silver-100 overflow-hidden">
            <div className="relative aspect-[4/3] bg-white">
              <Image
                src="/images/products/tube-cutting.png"
                alt="주름관 현장 절단"
                fill
                className="object-contain p-4"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
            <div className="p-5 text-center">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                <ArrowRight className="w-5 h-5 text-accent" />
              </div>
              <p className="font-bold text-ink text-sm mb-2">원하는 길이로 절단</p>
              <p className="text-ink-subtle text-xs leading-relaxed">코일로 공급되므로 현장에서 필요한 길이만큼 잘라 즉시 사용 가능합니다.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

const installCases = [
  {
    image: "/images/products/case-nexrevo-japan-4.jpg",
    location: "일본 NEX-REVO(株式会社ネクスレボ)",
    tag: "일본 수출",
    tagColor: "bg-accent",
    desc: "고부식 유체 라인에 적용되는 나선형 티타늄 코일 열교환기. 다권·다열 구조 4대 세트로 도면 사양에 맞춰 제작·직납.",
  },
  {
    image: "/images/products/case-fish-farm-yeosu.jpg",
    location: "여수 해수 양식장",
    tag: "양식장",
    tagColor: "bg-blue-500",
    desc: "해수 수조 위에 코일형 열교환기를 현수 설치. 스테인리스 교체 후 부식 없이 운용 중.",
  },
  {
    image: "/images/products/case-fish-tank-truck.jpg",
    location: "동해상사 활어 운반차",
    tag: "활어차",
    tagColor: "bg-cyan-600",
    desc: "활어차 수조 내벽에 S자 배관으로 냉각 코일 시공. 해수 환경에서 장기 내식 확인.",
  },
  {
    image: "/images/products/case-seawater-sauna.jpg",
    location: "성강 해수 사우나",
    tag: "해수 설비",
    tagColor: "bg-teal-600",
    desc: "티타늄 매니폴드에 주름관 다채널 연결. 해수 온도 제어 시스템에 최적화된 구성.",
  },
];

function HeatExchangerCaseSection() {
  return (
    <div className="bg-white rounded-2xl border border-silver-100 overflow-hidden mb-8">
      <div className="bg-ti-950 px-6 py-4 flex items-center gap-3">
        <MapPin className="w-5 h-5 text-accent" />
        <h2 className="text-silver-200 font-bold text-lg">납품·설치 사례</h2>
        <span className="ml-auto text-xs bg-accent/20 text-accent px-2.5 py-1 rounded-full font-semibold">실제 현장</span>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {installCases.map((c) => (
            <div key={c.location} className="rounded-2xl overflow-hidden border border-silver-100 bg-silver-50 flex flex-col">
              <div className="relative aspect-[4/3]">
                <Image
                  src={c.image}
                  alt={c.location}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
                <span className={`absolute top-3 left-3 text-white text-xs font-bold px-2.5 py-1 rounded-full ${c.tagColor}`}>
                  {c.tag}
                </span>
              </div>
              <div className="p-4 flex flex-col gap-1">
                <p className="font-bold text-ink text-sm">{c.location}</p>
                <p className="text-ink-muted text-xs leading-relaxed">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 bg-silver-50 rounded-xl border border-silver-100 p-4 flex items-start gap-3">
          <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
          <p className="text-xs text-ink-muted leading-relaxed">
            모든 사례는 ATX가 직접 제작·납품한 현장입니다. 유사 적용 환경에 대한 레퍼런스 및 견적 문의를 환영합니다.
          </p>
        </div>
      </div>
    </div>
  );
}

function WasteHeatRecoverySection() {
  return (
    <>
      {/* ① 핵심 가치 — 무동력·NET인증·특허 */}
      <div className="bg-white rounded-2xl border border-silver-100 overflow-hidden mb-8">
        <div className="bg-ti-950 px-6 py-4 flex items-center gap-3">
          <RefreshCw className="w-5 h-5 text-accent" />
          <h2 className="text-silver-200 font-bold text-lg">무동력 폐열회수 — ATX 독자 기술</h2>
        </div>
        <div className="p-6">
          <p className="text-ink-muted text-sm leading-relaxed mb-6">
            양식장·수산업체에서 버려지는 배출수(폐수)의 열에너지를 <strong className="text-ink">펌프 없이</strong> 자연 대류만으로 회수합니다.
            일반 폐열회수기와 달리 <strong className="text-ink">운전 중 노폐물 막힘 문제가 해결</strong>되며,
            전기요금 획기적 절약과 유지보수 부담 제거를 동시에 실현합니다.
          </p>

          {/* 3대 핵심 강점 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              {
                icon: Zap,
                title: "무동력 운전",
                sub: "펌프 전기료 제로",
                desc: "별도 순환펌프 없이 자연 대류로 폐수 열에너지를 회수. 운전비용이 사실상 없습니다.",
                color: "text-accent",
                bg: "bg-accent/5 border-accent/20",
              },
              {
                icon: RotateCcw,
                title: "막힘 문제 해결",
                sub: "ATX 특허 기술",
                desc: "배출수 내 이물질에 의한 노폐물 막힘을 근본적으로 해소. 유지보수 없이 장기 운전 가능합니다.",
                color: "text-blue-500",
                bg: "bg-blue-50 border-blue-100",
              },
              {
                icon: Leaf,
                title: "에너지 절감·ESG",
                sub: "월 수백만 원 절감 실증",
                desc: "실제 양식장에서 월 400만~500만 원 전기요금 절감 확인. 탄소 저감으로 ESG 경영에 직결.",
                color: "text-green-600",
                bg: "bg-green-50 border-green-100",
              },
            ].map((item) => (
              <div key={item.title} className={`rounded-2xl border p-5 ${item.bg}`}>
                <div className={`flex items-center gap-2 mb-1 ${item.color}`}>
                  <item.icon className="w-5 h-5" />
                  <span className="font-black text-base">{item.title}</span>
                </div>
                <p className={`text-xs font-bold mb-3 ${item.color}`}>{item.sub}</p>
                <p className="text-xs text-ink-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* 내부 구조 사진 — 티타늄 주름관 빼곡한 모습 */}
          <div className="rounded-2xl overflow-hidden border border-silver-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/images/products/whr/whr-interior-tubes-1.jpg"
                  alt="ATX 폐열회수기 내부 — 티타늄 주름관 배열"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-bold text-sm drop-shadow">내부 티타늄 주름관 배열</p>
                  <p className="text-silver-300 text-xs">수백 개의 주름관이 촘촘히 배열 — 전열 면적 극대화</p>
                </div>
              </div>
              <div className="relative aspect-[4/3]">
                <Image
                  src="/images/products/whr/whr-interior-tubes-2.jpg"
                  alt="ATX 폐열회수기 제작 현장"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-bold text-sm drop-shadow">제작 현장 — 케이싱 조립</p>
                  <p className="text-silver-300 text-xs">자체 공장에서 설계부터 조립까지 일관 제작</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ② NET 신기술 인증 + 특허 */}
      <div className="bg-white rounded-2xl border border-silver-100 overflow-hidden mb-8">
        <div className="bg-ti-950 px-6 py-4 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-accent" />
          <h2 className="text-silver-200 font-bold text-lg">공인 인증 — 정부가 검증한 신기술</h2>
          <span className="ml-auto text-xs bg-accent/20 text-accent px-2.5 py-1 rounded-full font-semibold">공식 인증</span>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* NET 인증서 */}
            <div className="flex flex-col gap-4">
              <div className="relative rounded-2xl overflow-hidden border-2 border-accent/30 shadow-lg">
                <Image
                  src="/images/certifications/net-cert-2024-0024.jpg"
                  alt="해양수산부 NET 신기술 인증서 2024-0024호"
                  width={600}
                  height={840}
                  className="w-full h-auto"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-accent text-white text-xs font-black px-3 py-1 rounded-full shadow">
                    NET 신기술 인증
                  </span>
                </div>
              </div>
              <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
                <p className="text-xs font-bold text-accent mb-2 uppercase tracking-wide">해양수산신기술(NET) 인증서</p>
                <ul className="space-y-1.5 text-xs text-ink-muted">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-accent mt-0.5 flex-shrink-0" /><span><strong className="text-ink">인증번호:</strong> 해양수산신기술-2024-0024</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-accent mt-0.5 flex-shrink-0" /><span><strong className="text-ink">기술명:</strong> 티타늄 주름관을 이용한 양식장 배출수 무동력 열회수 설비 기술</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-accent mt-0.5 flex-shrink-0" /><span><strong className="text-ink">인증기관:</strong> 해양수산부 장관</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-accent mt-0.5 flex-shrink-0" /><span><strong className="text-ink">유효기간:</strong> 2024.12.31 ~ 2029.12.30</span></li>
                </ul>
              </div>
            </div>

            {/* 특허 + 시험성적서 */}
            <div className="flex flex-col gap-4">
              {/* 특허증 실물 이미지 */}
              <div className="rounded-2xl overflow-hidden border-2 border-ti-700 shadow-lg">
                <div className="bg-ti-950 px-5 py-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-accent flex-shrink-0" />
                  <p className="text-silver-200 font-bold text-sm">등록 특허증 — 특허청 발행</p>
                  <span className="ml-auto text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded-full font-bold">등록 완료</span>
                </div>
                <div className="relative w-full bg-white">
                  <Image
                    src="/images/certifications/patent-10-2832328.jpg"
                    alt="특허증 제10-2832328호 — 폐수 열회수기 (에이티엑스 주식회사)"
                    width={1488}
                    height={2105}
                    className="w-full h-auto"
                  />
                </div>
                <div className="bg-ti-950 px-5 py-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-accent text-xs font-bold">특허 등록번호</span>
                    <span className="text-white font-black text-sm">제 10-2832328 호</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-silver-400 text-xs">발명 명칭</span>
                    <span className="text-silver-200 text-xs font-medium">폐수 열회수기</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-silver-400 text-xs">출원일 / 등록일</span>
                    <span className="text-silver-200 text-xs">2023.01.12 / 2025.07.07</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-silver-400 text-xs">특허권자</span>
                    <span className="text-silver-200 text-xs">에이티엑스 주식회사</span>
                  </div>
                </div>
              </div>

              {/* KTL 시험성적서 */}
              <div className="rounded-2xl border border-silver-100 overflow-hidden">
                <div className="bg-silver-50 px-5 py-3 border-b border-silver-100">
                  <p className="text-ink font-bold text-sm">한국산업기술시험원(KTL) 시험성적서</p>
                  <p className="text-ink-subtle text-xs">독립기관 성능 시험으로 열회수 효율 공식 검증</p>
                </div>
                <div className="grid grid-cols-2 gap-0">
                  <div className="relative aspect-[3/4]">
                    <Image
                      src="/images/certifications/test-report-ktl-2.jpg"
                      alt="KTL 시험성적서 표지"
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <div className="relative aspect-[3/4]">
                    <Image
                      src="/images/certifications/test-report-ktl-1.jpg"
                      alt="KTL 시험결과"
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                </div>
                <div className="bg-silver-50 px-5 py-3 border-t border-silver-100">
                  <p className="text-xs text-ink-subtle">성적서 번호 22-016688-01-1 | 2022.03.29 시험</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ③ 실제 납품 현장 — 전국 10개 업체 실증 */}
      <div className="bg-white rounded-2xl border border-silver-100 overflow-hidden mb-8">
        <div className="bg-ti-950 px-6 py-4 flex items-center gap-3">
          <MapPin className="w-5 h-5 text-accent" />
          <h2 className="text-silver-200 font-bold text-lg">전국 납품 실적 — 실제 현장에서 검증된 성능</h2>
          <span className="ml-auto text-xs bg-accent/20 text-accent px-2.5 py-1 rounded-full font-semibold">10개 업체·기관</span>
        </div>
        <div className="p-6 space-y-6">

          {/* 핵심 수치 3개 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { value: "월 500만원", sub: "절감 실증 (동해수산)", desc: "가리비 집하장, 강원 동해 — 성능확인서 발행", color: "text-accent", bg: "bg-accent/5 border-accent/20" },
              { value: "수온 9°C↓", sub: "하강 실측 (해성수산 여름)", desc: "배출수 폐열 회수로 여름철 수조 수온 9°C 저감 인터뷰 확인", color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
              { value: "+10.3°C", sub: "입수 가온 실측 (광천수산)", desc: "해수 14.5°C 유입 → 24.8°C 출구 (2023.04.25 현장 측정)", color: "text-green-600", bg: "bg-green-50 border-green-100" },
            ].map((s) => (
              <div key={s.value} className={`rounded-2xl border p-5 ${s.bg}`}>
                <p className={`text-2xl font-black mb-0.5 ${s.color}`}>{s.value}</p>
                <p className={`text-xs font-bold mb-2 ${s.color}`}>{s.sub}</p>
                <p className="text-xs text-ink-muted leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* 온도 실측 보드 — 광천수산 */}
          <div className="rounded-2xl overflow-hidden border-2 border-green-200">
            <div className="bg-green-700 px-5 py-3 flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-white flex-shrink-0" />
              <p className="text-white font-black text-sm">현장 온도 측정 데이터 — 광천수산 (전북 고창), 2023년 4월 25일</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="relative aspect-[4/3] bg-white">
                <Image
                  src="/images/products/whr/whr-temp-data-gwangcheon.png"
                  alt="광천수산 폐열회수기 온도 측정 — 해수입구 14.5°C → 해수출구 24.8°C"
                  fill
                  className="object-contain p-6"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-6 flex flex-col justify-center gap-4 bg-green-50">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "해수 입구 온도", value: "14.5°C", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
                    { label: "해수 출구 온도", value: "24.8°C", color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
                    { label: "폐수 입구 온도", value: "28.4°C", color: "text-red-600", bg: "bg-red-50 border-red-200" },
                    { label: "폐수 출구 온도", value: "26.5°C", color: "text-green-700", bg: "bg-green-100 border-green-300" },
                  ].map((t) => (
                    <div key={t.label} className={`rounded-xl border p-3 ${t.bg}`}>
                      <p className="text-xs text-ink-subtle mb-1">{t.label}</p>
                      <p className={`font-black text-lg ${t.color}`}>{t.value}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-xl p-3 border border-green-200">
                  <p className="text-green-700 font-black text-sm mb-1">열회수 성과: <span className="text-green-600">+10.3°C 가온</span></p>
                  <p className="text-xs text-ink-muted leading-relaxed">
                    14.5°C 차가운 해수가 폐수 열을 흡수해 24.8°C로 가온되어 수조에 공급.
                    히트펌프 부하가 대폭 감소하여 전기요금 획기적 절감.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 성능확인서 2건 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                img: "/images/certifications/performance-confirm-donghae.jpg",
                name: "동해수산",
                location: "강원도 동해",
                species: "가리비 집하장",
                model: "ATX-P-10-TA",
                period: "2022.12.07 ~ 2023.09.30",
                saving: "월 5,000,000원 절감",
                savingAnnual: "연 6,000,000원",
                bg: "bg-blue-50 border-blue-100",
              },
              {
                img: "/images/certifications/performance-confirm-beomsoo.jpg",
                name: "범수산",
                location: "충청남도 태안",
                species: "어·대하·꽃넙치",
                model: "ATX-P-1-TC",
                period: "2022.11.01 ~ 2023.02.28 (4개월)",
                saving: "4개월 4,000,000원 절감",
                savingAnnual: null as string | null,
                bg: "bg-cyan-50 border-cyan-100",
              },
            ].map((c) => (
              <div key={c.name} className={`rounded-2xl border overflow-hidden ${c.bg}`}>
                <div className="relative aspect-[4/3]">
                  <Image
                    src={c.img}
                    alt={`${c.name} 티타늄 폐열회수기 사용 성능확인서`}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                  <span className="absolute top-3 left-3 bg-white/90 text-ink text-xs font-black px-3 py-1 rounded-full shadow">성능확인서</span>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Fish className="w-4 h-4 text-accent" />
                    <p className="font-black text-ink text-base">{c.name}</p>
                    <span className="text-ink-subtle text-xs ml-auto">{c.location}</span>
                  </div>
                  <p className="text-xs text-ink-muted">양식 어종: <strong className="text-ink">{c.species}</strong></p>
                  <p className="text-xs text-ink-muted">모델: <strong className="text-ink">{c.model}</strong> | 처리용량: 10 Ton/Hr</p>
                  <p className="text-xs text-ink-muted">기간: {c.period}</p>
                  <div className="mt-2 rounded-xl p-3 bg-white border border-silver-100">
                    <p className="text-xs font-bold text-accent mb-1">절감 효과 (업체 직접 확인)</p>
                    <p className="text-sm font-black text-ink">{c.saving}</p>
                    {c.savingAnnual && <p className="text-xs text-ink-muted mt-0.5">→ 연간 {c.savingAnnual} 절감</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 전국 납품 현장 갤러리 */}
          <div>
            <p className="text-xs font-bold text-ink-subtle uppercase tracking-widest mb-3">전국 납품·설치 현장</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { src: "/images/products/whr/whr-install-jnma-system.png", caption: "전남해양수산과학원 지도읍", tag: "공공기관" },
                { src: "/images/products/whr/whr-install-jnma-system2.png", caption: "전남해양수산과학원 — 운전 중", tag: "공공기관" },
                { src: "/images/products/whr/whr-install-donghae-1.jpg", caption: "동해상사 — 강원 동해", tag: "수산업체" },
                { src: "/images/products/whr/whr-install-donghae-2.jpg", caption: "동해상사 — 측면", tag: "수산업체" },
                { src: "/images/products/whr/whr-install-taean.jpg", caption: "태안 수산업체 — 신규 설치", tag: "수산업체" },
                { src: "/images/products/whr/whr-install-haeshin.jpg", caption: "해신수산 — 전남 여수", tag: "양식장" },
                { src: "/images/products/whr/whr-install-gwangcheon.png", caption: "광천수산 — 전북 고창", tag: "양식장" },
                { src: "/images/products/whr/whr-install-haesung-1.jpg", caption: "해성수산 — 전북 고창", tag: "양식장" },
              ].map((img) => (
                <div key={img.src} className="relative aspect-[4/3] rounded-xl overflow-hidden group">
                  <Image
                    src={img.src}
                    alt={img.caption}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <span className="absolute top-2 left-2 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{img.tag}</span>
                  <p className="absolute bottom-0 left-0 right-0 text-white text-[9px] leading-snug p-2 font-medium">{img.caption}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 납품 업체 목록 */}
          <div className="bg-silver-50 rounded-2xl border border-silver-100 p-5">
            <p className="text-xs font-bold text-ink uppercase tracking-widest mb-3">납품·운용 현황 (임대·판매 포함)</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { name: "해성수산", loc: "전북 고창", type: "양식장" },
                { name: "광천수산", loc: "전북 고창", type: "양식장" },
                { name: "동해수산", loc: "강원 동해", type: "집하장" },
                { name: "동해상사", loc: "강원 동해", type: "수산업체" },
                { name: "범수산", loc: "충남 태안", type: "양식장" },
                { name: "삼부수산", loc: "충남 보령", type: "양식장" },
                { name: "해신수산", loc: "전남 여수", type: "양식장" },
                { name: "신비수산·현수산", loc: "경남 남해", type: "양식장" },
                { name: "전남해양수산과학원", loc: "전남 신안", type: "공공기관" },
                { name: "전라남도해양수산과학원", loc: "전남 고흥", type: "공공기관" },
              ].map((b) => (
                <div key={b.name} className="flex items-center gap-2 bg-white rounded-lg p-2.5 border border-silver-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-ink leading-none">{b.name}</p>
                    <p className="text-[10px] text-ink-subtle mt-0.5">{b.loc} · {b.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-ti-950 rounded-2xl p-5 flex items-start gap-4">
            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white font-bold text-sm mb-1">납품 후 성능확인서 발행 — 수치로 증명합니다</p>
              <p className="text-silver-400 text-xs leading-relaxed">
                ATX는 납품 후 실제 절감 효과를 업체와 함께 측정·확인하고 성능확인서를 발행합니다.
                업체 규모·어종·운전 조건이 유사한 레퍼런스를 소개해 드릴 수 있으며, 예상 절감액 계산 상담을 환영합니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ④ 제품 외관 + 사양 */}
      <div className="bg-white rounded-2xl border border-silver-100 overflow-hidden mb-8">
        <div className="bg-ti-950 px-6 py-4 flex items-center gap-3">
          <Package className="w-5 h-5 text-accent" />
          <h2 className="text-silver-200 font-bold text-lg">제품 외관 및 규격</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-silver-100 bg-silver-50">
              <Image
                src="/images/products/whr/whr-dimensions.jpg"
                alt="ATX 폐열회수기 치수 — 150cm×110cm×50cm"
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="space-y-4">
              <div className="bg-silver-50 rounded-xl p-4 border border-silver-100">
                <p className="text-xs font-bold text-accent uppercase tracking-wide mb-3">표준 외형 치수 (10Ton/Hr 기준)</p>
                <div className="grid grid-cols-3 gap-3 text-center mb-3">
                  {[["폭", "150cm"], ["높이", "110cm"], ["깊이", "50cm"]].map(([label, val]) => (
                    <div key={label} className="bg-white rounded-lg p-3 border border-silver-100">
                      <p className="text-xs text-ink-subtle mb-1">{label}</p>
                      <p className="font-black text-ink text-base">{val}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-ink-subtle">* 처리 용량·현장 조건에 따라 외형 치수가 달라집니다.</p>
              </div>
              <div className="space-y-2">
                {[
                  { label: "표준 처리 용량", value: "10 Ton/Hr (모델 ATX-P-10)" },
                  { label: "내부 소재", value: "Ti Grade 2 주름관 (고내식·고전열)" },
                  { label: "외함 재질", value: "도장 철재 / STS 선택 가능" },
                  { label: "운전 방식", value: "무동력 자연 대류 (전력 소모 없음)" },
                  { label: "연결 방식", value: "해수 입·출구 / 폐수 입·출구 (4방향 플랜지)" },
                  { label: "유지보수", value: "정기 청소 외 무보수 운전 가능" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex gap-3 text-sm">
                    <span className="text-ink-subtle font-medium w-32 flex-shrink-0">{label}</span>
                    <span className="text-ink font-semibold">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ⑤ 작동 원리 */}
      <div className="bg-white rounded-2xl border border-silver-100 overflow-hidden mb-8">
        <div className="bg-ti-950 px-6 py-4 flex items-center gap-3">
          <Waves className="w-5 h-5 text-accent" />
          <h2 className="text-silver-200 font-bold text-lg">작동 원리 — 무동력 자연 대류 열교환</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step: "01", title: "배출수(폐수) 유입", desc: "양식장 수조·수산 가공에서 나온 배출수가 중력으로 폐열회수기에 유입됩니다.", color: "text-orange-500", bg: "bg-orange-50 border-orange-100" },
              { step: "02", title: "자연 대류 열교환", desc: "티타늄 주름관 내부를 흐르는 해수와 배출수 사이에서 펌프 없이 열이 이동합니다.", color: "text-accent", bg: "bg-accent/5 border-accent/20" },
              { step: "03", title: "회수된 열로 가온", desc: "폐수의 열이 차가운 유입 해수를 데워 히트펌프·보일러 부하를 대폭 줄입니다.", color: "text-blue-500", bg: "bg-blue-50 border-blue-100" },
              { step: "04", title: "에너지 절감", desc: "가온된 해수가 수조로 공급되어 전기 히터·히트펌프 가동 시간이 획기적으로 단축됩니다.", color: "text-green-600", bg: "bg-green-50 border-green-100" },
            ].map((item) => (
              <div key={item.step} className={`rounded-2xl border p-5 ${item.bg}`}>
                <p className={`text-3xl font-black mb-3 ${item.color} opacity-30`}>{item.step}</p>
                <p className={`font-black text-sm mb-2 ${item.color}`}>{item.title}</p>
                <p className="text-xs text-ink-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* 핵심 — 막힘 해결 */}
          <div className="rounded-2xl bg-ti-950 p-5 flex items-start gap-4">
            <RotateCcw className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white font-bold text-sm mb-2">기존 제품의 문제 — 노폐물 막힘 해소 (ATX 특허 핵심)</p>
              <p className="text-silver-400 text-xs leading-relaxed">
                기존 폐열회수기는 배출수에 포함된 어분·찌꺼기가 관내에 쌓여 <strong className="text-silver-200">수개월 내 막힘·열화</strong>가 발생합니다.
                ATX는 자연 대류와 주름관 배열 설계를 통해 이 막힘 문제를 근본적으로 해결했으며,
                이 기술이 특허 10-2832328호 및 NET 신기술 인증의 핵심입니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ⑥ 적용 분야 */}
      <div className="bg-white rounded-2xl border border-silver-100 overflow-hidden mb-8">
        <div className="bg-ti-950 px-6 py-4">
          <h2 className="text-silver-200 font-bold text-lg">적용 분야</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                icon: Fish,
                title: "해수 양식장",
                color: "text-blue-600",
                bg: "bg-blue-50 border-blue-100",
                desc: "수조 배출수·환수 폐열 회수. 가리비·어·대하·꽃넙치 등 어종 무관. 히트펌프 부하 대폭 저감.",
                examples: ["가리비 집하장 (강원 동해, 실증)", "어·대하·꽃넙치 양식장 (충남 태안, 실증)", "넙치·연어 등 냉수성 어종 양식"],
              },
              {
                icon: Waves,
                title: "수산 가공·활어 설비",
                color: "text-cyan-600",
                bg: "bg-cyan-50 border-cyan-100",
                desc: "수산 가공장 폐수, 활어차·수족관 순환수 온도 관리에서 버려지는 열을 회수합니다.",
                examples: ["수산 가공장 폐수 열회수", "활어차 냉각 에너지 절감", "수족관·횟집 순환수 온도 조절"],
              },
              {
                icon: Flame,
                title: "산업 공정 폐수",
                color: "text-orange-500",
                bg: "bg-orange-50 border-orange-100",
                desc: "공장 공정에서 발생하는 따뜻한 폐수·냉각수의 열에너지를 예열·온수에 재활용합니다.",
                examples: ["식품 가공 공정 온폐수 열회수", "냉각탑 배열 재활용", "증기 응축수 열회수"],
              },
              {
                icon: Leaf,
                title: "ESG·에너지 의무 감축",
                color: "text-green-600",
                bg: "bg-green-50 border-green-100",
                desc: "에너지 다소비 사업장 감축 의무 대응, 탄소 저감 실적 인정, 정부 보조사업 연계 가능.",
                examples: ["에너지 다소비 사업장 감축 의무 대응", "탄소중립·ESG 경영 실적 확보", "해양수산부 NET 인증 제품 활용"],
              },
            ].map((ind) => (
              <div key={ind.title} className={`rounded-2xl border p-5 ${ind.bg}`}>
                <div className={`flex items-center gap-2 mb-2 ${ind.color}`}>
                  <ind.icon className="w-5 h-5" />
                  <span className="font-black text-base text-ink">{ind.title}</span>
                </div>
                <p className="text-sm text-ink-muted leading-relaxed mb-3">{ind.desc}</p>
                <ul className="space-y-1">
                  {ind.examples.map((ex) => (
                    <li key={ex} className="flex items-center gap-2 text-xs text-ink-muted">
                      <ChevronRight className={`w-3 h-3 flex-shrink-0 ${ind.color}`} />
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ⑦ 상담 CTA */}
      <div className="bg-ti-950 rounded-2xl p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 text-center md:text-left">
            <p className="text-white font-black text-xl mb-2">우리 현장에 맞는 절감액이 궁금하세요?</p>
            <p className="text-silver-400 text-sm leading-relaxed">
              처리 용량(Ton/Hr), 운전 시간, 현재 전기요금을 알려주시면 예상 절감액과 투자 회수 기간을 계산해 드립니다.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link href="/support" className="btn-primary justify-center px-6 py-3 text-sm font-bold">
              절감액 계산 상담
            </Link>
            <a href="tel:021544-1909" className="btn-dark justify-center px-6 py-3 text-sm font-bold">
              <Phone className="w-4 h-4" />
              02-1544-1909
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ProductDetailPage({ params }: Props) {
  const product = productsData.find((p) => p.slug === params.slug) as ProductData | undefined;
  if (!product) notFound();

  const isTube = product.category === "tube";
  const isStandard = product.slug === "tube-standard";
  const isHeatExchangerCorrugated = product.slug === "heat-exchanger-corrugated";
  const isWasteHeatRecovery = product.slug === "waste-heat-recovery";
  const variants = isTube && !isStandard ? (product as ProductData & { variants?: Variant[] }).variants ?? [] : [];

  const relatedSlugs: Record<string, string[]> = {
    "tube": ["socket", "heat-exchanger-corrugated"],
    "tube-standard": ["tube", "socket"],
  };
  const related = relatedSlugs[product.slug]
    ? productsData.filter((p) => relatedSlugs[product.slug].includes(p.slug))
    : productsData.filter((p) => p.slug !== product.slug && p.category === product.category).slice(0, 3);

  const productUrl = `https://www.atx-titanium.co.kr/products/${product.slug}`;
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images?.[0] ?? product.image,
    url: productUrl,
    brand: { "@type": "Brand", name: "ATX" },
    manufacturer: {
      "@type": "Organization",
      name: "ATX Co., Ltd.",
      url: "https://www.atx-titanium.co.kr",
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "KRW",
      seller: { "@type": "Organization", name: "ATX Co., Ltd." },
    },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: "https://www.atx-titanium.co.kr" },
      { "@type": "ListItem", position: 2, name: "제품 소개", item: "https://www.atx-titanium.co.kr/products" },
      { "@type": "ListItem", position: 3, name: product.name, item: productUrl },
    ],
  };

  return (
    <div className="pt-20 min-h-screen bg-silver-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {/* Breadcrumb */}
      <div className="bg-white border-b border-silver-100">
        <div className="container-pad py-3">
          <div className="flex items-center gap-2 text-sm text-ink-subtle">
            <Link href="/" className="hover:text-ink transition-colors">홈</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-ink transition-colors">제품 소개</Link>
            <span>/</span>
            <span className="text-ink font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container-pad py-12">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-ink-muted hover:text-ink text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          전체 제품 목록
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Image Gallery */}
          <ProductImageGallery images={product.images} name={product.name} />

          {/* Product Info */}
          <div>
            <span className="inline-block bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full mb-3">
              {product.categoryLabel}
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-ink mb-3 leading-tight">
              {product.name}
            </h1>
            <p className="text-ink-subtle text-base mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Key Specs */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { Icon: Gauge, label: "사용 압력", value: product.specs.workingPressure },
                { Icon: Thermometer, label: "온도 범위", value: product.specs.temperatureRange },
                { Icon: Ruler, label: "호칭 규격", value: product.specs.nominalSize },
                { Icon: Ruler, label: "연결 방식", value: product.specs.endFitting },
              ].map(({ Icon, label, value }) => (
                <div key={label} className="bg-white rounded-xl border border-silver-100 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4 text-accent" />
                    <span className="text-xs text-ink-subtle font-medium">{label}</span>
                  </div>
                  <p className="text-sm font-bold text-ink">{value}</p>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="bg-silver-50 rounded-xl p-4 mb-6">
              <p className="text-xs font-semibold text-ink uppercase tracking-wider mb-3">
                주요 특징
              </p>
              <div className="grid grid-cols-1 gap-2">
                {product.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-ink-muted">
                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/support" className="btn-primary flex-1 justify-center py-3.5">
                견적 요청
              </Link>
              <a
                href="tel:1544-1909"
                className="btn-dark flex-1 justify-center py-3.5"
              >
                <Phone className="w-4 h-4" />
                전화 상담
              </a>
            </div>
          </div>
        </div>

        {/* Spec Section */}
        {isStandard ? (
          <>
            <TubeStandardSection />
            <HeatExchangerCaseSection />
          </>
        ) : isWasteHeatRecovery ? (
          <>
            <div className="bg-white rounded-2xl border border-silver-100 overflow-hidden mb-8">
              <div className="bg-ti-950 px-6 py-4">
                <h2 className="text-silver-200 font-bold text-lg">상세 기술 사양</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full spec-table">
                  <tbody>
                    {specLabels.map(([key, label]) => {
                      const val = (product.specs as Record<string, string>)[key];
                      if (!val || val === "-") return null;
                      return (
                        <tr key={key}>
                          <td className="font-semibold text-ink bg-silver-50 w-44">{label}</td>
                          <td>{val}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <WasteHeatRecoverySection />
          </>
        ) : isTube && variants.length > 0 ? (
          <>
            <TubeVariantTable variants={variants} />
            <TubeMaterialSection />
            <TubeCompareSection />
            <TubeTurbulenceSection />
            <TubeInstallSection />
            <TubeApplicationSection />
          </>
        ) : (
          <>
            <div className="bg-white rounded-2xl border border-silver-100 overflow-hidden mb-8">
              <div className="bg-ti-950 px-6 py-4">
                <h2 className="text-silver-200 font-bold text-lg">상세 기술 사양</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full spec-table">
                  <tbody>
                    {specLabels.map(([key, label]) => {
                      const val = (product.specs as Record<string, string>)[key];
                      if (!val || val === "-") return null;
                      return (
                        <tr key={key}>
                          <td className="font-semibold text-ink bg-silver-50 w-44">{label}</td>
                          <td>{val}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            {isHeatExchangerCorrugated && <HeatExchangerCaseSection />}
          </>
        )}

        {/* Applications — tube·waste-heat-recovery는 전용 섹션에서 처리 */}
        {!(isTube && variants.length > 0) && !isWasteHeatRecovery && (
          <div className="bg-white rounded-2xl border border-silver-100 p-6 mb-12">
            <h2 className="text-xl font-bold text-ink mb-4">적용 분야</h2>
            <div className="flex flex-wrap gap-2">
              {product.applications.map((app) => (
                <span
                  key={app}
                  className="px-4 py-2 bg-silver-50 text-ink-muted rounded-lg text-sm font-medium"
                >
                  {app}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-ink mb-6">관련 제품</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
