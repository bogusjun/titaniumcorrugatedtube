/**
 * 영문·일문 제품 문구 — 원본은 products.json(국문)이고, 여기에는 번역만 둔다
 *
 * - 제품을 추가하거나 국문 이름·설명·용도·특징을 바꾸면 productText 도 같이 고친다
 * - 사양 값(specs·variants·grade) 가운데 한글이 들어간 값은 valueText 에서 찾아 바꾼다.
 *   새 한글 값을 products.json 에 넣으면 valueText 에도 추가해야 영·일 페이지에 한글이 남지 않는다
 */
import productsData from "./products.json";

export type ProductLocale = "en" | "ja";

type BaseProduct = (typeof productsData)[number];
export type ProductVariant = Record<string, string>;
export type Product = Omit<BaseProduct, "specs" | "variants"> & {
  specs: Record<string, string>;
  variants?: ProductVariant[];
};

type L = Record<ProductLocale, string>;

export const categoryText: Record<string, L> = {
  tube: { en: "Titanium Corrugated Tube", ja: "チタン波管" },
  "heat-exchanger": { en: "Custom Heat Exchangers", ja: "オーダーメイド熱交換器" },
  "waste-heat-recovery": { en: "Waste Heat Recovery", ja: "廃熱回収装置" },
  socket: { en: "Tube Sockets", ja: "波管ソケット" },
};

/** 사양 값 번역 — products.json 의 한글 값과 글자 그대로 맞아야 한다 */
const valueText: Record<string, L> = {
  "고객 사양": { en: "Per customer specification", ja: "お客様仕様" },
  "맞춤 제작": { en: "Custom", ja: "オーダーメイド" },
  "설계에 따름": { en: "Per design", ja: "設計による" },
  "최대 30 MPa": { en: "Up to 30 MPa", ja: "最大 30 MPa" },
  "최대 20 MPa": { en: "Up to 20 MPa", ja: "最大 20 MPa" },
  "고객 도면 기준": { en: "Per customer drawing", ja: "お客様図面による" },
  "플랜지 / 고객 도면 기준": { en: "Flange / per customer drawing", ja: "フランジ / お客様図面による" },
  "소켓 (티타늄·황동) / NPT / BSPT": { en: "Socket (titanium / brass) / NPT / BSPT", ja: "ソケット（チタン・真鍮）/ NPT / BSPT" },
  "소켓 (티타늄·황동)": { en: "Socket (titanium / brass)", ja: "ソケット（チタン・真鍮）" },
  "300mm / 500mm / 1,000mm (재고 보유)": { en: "300mm / 500mm / 1,000mm (in stock)", ja: "300mm / 500mm / 1,000mm（在庫あり）" },
  '3/8" NPT (양쪽 수나사)': { en: '3/8" NPT (male thread, both ends)', ja: '3/8" NPT（両端おねじ）' },
  "Ti: -196°C ~ 280°C / 황동: -10°C ~ 120°C": { en: "Ti: -196°C ~ 280°C / Brass: -10°C ~ 120°C", ja: "Ti: -196°C ~ 280°C / 真鍮: -10°C ~ 120°C" },
  "Ti Gr.2 / 황동 (Brass)": { en: "Ti Gr.2 / Brass", ja: "Ti Gr.2 / 真鍮（Brass）" },
  "NPT / BSPT 수나사·암나사": { en: "NPT / BSPT male and female threads", ja: "NPT / BSPT おねじ・めねじ" },
};

type ProductCopy = { name: string; description: string; applications: string[]; features: string[] };

const productText: Record<string, Record<ProductLocale, ProductCopy>> = {
  tube: {
    en: {
      name: "Titanium Corrugated Tube",
      description:
        "Flexible corrugated tube made from high-purity Grade 2 titanium. Available in 10A and 15A for highly corrosive environments such as semiconductor, chemical and seawater piping.",
      applications: [
        "Seawater aquaculture farms",
        "Semiconductor cleaning lines",
        "Chemical transfer",
        "General chemical piping",
        "Medical device piping",
        "Marine seawater piping",
        "Precision instrumentation piping",
      ],
      features: ["High corrosion resistance", "Lightweight and highly flexible", "Seawater resistant", "Biocompatible", "Maintains high purity"],
    },
    ja: {
      name: "チタン波管",
      description:
        "高純度Grade 2チタン製のフレキシブル波管。10A・15A規格で、半導体・化学・海水配管など強腐食環境に使用されます。",
      applications: ["海水養殖場", "半導体洗浄ライン", "薬品移送", "汎用化学配管", "医療機器配管", "船舶海水配管", "精密計測配管"],
      features: ["高耐食性", "軽量・高柔軟性", "耐海水性", "生体適合性", "高純度を維持"],
    },
  },
  "tube-standard": {
    en: {
      name: "Titanium Corrugated Tube — Standard (Ready Stock)",
      description:
        "Available both as ready-stock standard items for immediate delivery and as fully custom builds with your choice of outer diameter, length and number of coil turns. Supplied with integrated socket fittings, so it connects to your piping right away without welding.",
      applications: ["Emergency piping replacement", "Laboratory piping", "Small-volume chemical transfer", "R&D test piping"],
      features: ["Immediate delivery", "Finished assembly with integrated fittings", "No welding required"],
    },
    ja: {
      name: "チタン波管 標準品（在庫品）",
      description:
        "在庫があり即納できる既製標準品と、外径・長さ・コイル巻数を自由に指定できる完全オーダーメイドの両方に対応します。ソケット継手一体型で供給するため、溶接なしですぐに配管へ接続できます。",
      applications: ["緊急の配管交換", "実験室配管", "少量の薬品移送", "R&D試験配管"],
      features: ["即納可能", "継手一体型の完成品", "溶接不要"],
    },
  },
  "heat-exchanger-corrugated": {
    en: {
      name: "Custom Heat Exchanger — Corrugated Tube Type",
      description:
        "High-efficiency custom heat exchanger made by forming titanium corrugated tube into coils. The corrugations create turbulence that maximizes heat transfer, and units are built in many shapes, including round and square frames.",
      applications: ["Waste heat recovery systems", "Seawater heat exchangers for fish farms", "Semiconductor temperature control", "Chemical reactor cooling"],
      features: ["High heat transfer efficiency (turbulence promotion)", "Fully custom-built", "Round, square and other shapes"],
    },
    ja: {
      name: "オーダーメイド熱交換器（波管型）",
      description:
        "チタン波管をコイル状に成形した高効率のオーダーメイド熱交換器。波形構造が乱流を生み伝熱効率を最大化します。円形・角形フレームなど多様な形状で製作します。",
      applications: ["廃熱回収システム", "養殖場用海水熱交換器", "半導体温度制御", "化学反応器の冷却"],
      features: ["高い伝熱効率（乱流促進）", "完全オーダーメイド", "円形・角形など多様な形状"],
    },
  },
  "heat-exchanger-straight": {
    en: {
      name: "Custom Heat Exchanger — Straight Tube Type",
      description:
        "Straight-tube heat exchanger with multiple straight titanium tubes arranged in parallel. Low flow resistance and easy cleaning and maintenance. Combined with plates or a housing, it suits high-capacity heat exchange.",
      applications: ["High-capacity cooling systems", "Chemical plant heat exchange", "Seawater desalination plants"],
      features: ["Low flow resistance", "Easy cleaning and maintenance", "Suited to high capacity"],
    },
    ja: {
      name: "オーダーメイド熱交換器（直管型）",
      description:
        "直線のチタン管を多数配列した直管型熱交換器。流路抵抗が低く、洗浄・メンテナンスが容易です。プレートやハウジングと組み合わせ、大容量の熱交換に適しています。",
      applications: ["大容量冷却システム", "化学プラントの熱交換", "海水淡水化設備"],
      features: ["低い流路抵抗", "洗浄・メンテナンスが容易", "大容量に対応"],
    },
  },
  "heat-exchanger-shell-tube": {
    en: {
      name: "Custom Heat Exchanger — Shell & Tube Type",
      description:
        "Shell-and-tube heat exchanger with many titanium tubes arranged inside an outer shell. Highly reliable under high pressure and high flow, and the standard design in petrochemical and power generation.",
      applications: ["Petrochemical plants", "Power plant cooling", "Offshore plants", "High-pressure process heat exchange"],
      features: ["Handles high pressure and high flow", "Industry-standard design", "Choice of shell material"],
    },
    ja: {
      name: "オーダーメイド熱交換器（シェル＆チューブ型）",
      description:
        "チタンチューブをシェル（外筒）内に多数配列したシェル＆チューブ式熱交換器。高圧・高流量の環境で信頼性が高く、石油化学・発電分野の標準構造です。",
      applications: ["石油化学プラント", "発電所の冷却", "海洋プラント", "高圧プロセスの熱交換"],
      features: ["高圧・高流量に対応", "業界標準の構造", "シェル材質も選択可能"],
    },
  },
  socket: {
    en: {
      name: "Corrugated Tube Socket",
      description:
        "Socket fittings made for titanium corrugated tube. Titanium sockets keep the line all-titanium and eliminate galvanic corrosion at the source, while brass sockets connect economically to general-purpose piping.",
      applications: [
        "All-titanium semiconductor piping",
        "Strong acid and alkali lines",
        "Where galvanic corrosion must be prevented",
        "General fluid piping connections",
        "General chemical transfer",
      ],
      features: ["Choice of titanium or brass", "NPT / BSPT standard threads", "Fits 10A / 15A nominal sizes"],
    },
    ja: {
      name: "波管ソケット",
      description:
        "チタン波管専用のソケット継手。チタン製はオールチタン配管で異種金属腐食を根本から防ぎ、真鍮製は汎用配管システムと経済的に接続できます。",
      applications: ["半導体向けオールチタン配管", "強酸・強アルカリの流体ライン", "異種金属腐食の防止が必要な環境", "一般流体配管の接続", "汎用薬品の移送"],
      features: ["チタン・真鍮から選択可能", "NPT / BSPT 標準規格", "10A / 15A 呼び径に対応"],
    },
  },
  "waste-heat-recovery": {
    en: {
      name: "Non-Powered Titanium Waste Heat Recovery Unit",
      description:
        "ATX's proprietary technology that recovers heat from discharged water and wastewater by natural convection, with no pumps. Certified as an NET New Technology by Korea's Ministry of Oceans and Fisheries (No. 2024-0024) and patented (No. 10-2832328). Fish farms and seafood businesses have cut their electricity bills by several million won a month.",
      applications: [
        "Heat recovery from fish-farm seawater discharge",
        "Heat recovery from live-fish truck cooling water",
        "Heat recovery from seafood processing wastewater",
        "Reuse of cooling-water waste heat",
        "Steam condensate heat recovery",
        "Industrial process exhaust heat recovery",
      ],
      features: [
        "NET New Technology certified (Ministry of Oceans and Fisheries, No. 2024-0024)",
        "Patent registered (No. 10-2832328)",
        "Non-powered — zero pump electricity cost",
        "Proven savings of several million won a month in electricity",
        "Titanium corrugated tube: high corrosion resistance and heat transfer",
      ],
    },
    ja: {
      name: "無動力チタン廃熱回収装置",
      description:
        "捨てられる排出水・廃水の熱エネルギーをポンプなしで自然対流により回収するATX独自の技術。韓国海洋水産部 NET新技術認証（2024-0024号）、特許登録（10-2832328号）。養殖場・水産業者で電気料金を月数百万ウォン削減した実績があります。",
      applications: [
        "海水養殖場の排水からの熱回収",
        "活魚車の冷却水からの熱回収",
        "水産加工場の廃水からの熱回収",
        "冷却水廃熱の再利用",
        "蒸気凝縮の熱回収",
        "産業プロセスの排気熱回収",
      ],
      features: [
        "NET新技術認証（韓国海洋水産部 2024-0024号）",
        "特許登録（10-2832328号）",
        "無動力 — ポンプの電気代ゼロ",
        "月数百万ウォンの電気料金削減を実証",
        "チタン波管による高耐食・高伝熱効率",
      ],
    },
  },
};

function tv(value: string, locale: ProductLocale): string {
  return valueText[value]?.[locale] ?? value;
}

function mapValues(obj: Record<string, string>, locale: ProductLocale): Record<string, string> {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, tv(v, locale)]));
}

export function localizeProduct(p: BaseProduct | Product, locale: ProductLocale): Product {
  const copy = productText[p.slug]?.[locale];
  const variants = (p as Product).variants;
  return {
    ...p,
    name: copy?.name ?? p.nameEn,
    categoryLabel: categoryText[p.category]?.[locale] ?? p.categoryLabel,
    description: copy?.description ?? p.description,
    grade: tv(p.grade, locale),
    specs: mapValues(p.specs as Record<string, string>, locale),
    variants: variants?.map((v) => mapValues(v, locale)),
    applications: copy?.applications ?? p.applications,
    features: copy?.features ?? p.features,
  };
}

export function getLocalizedProducts(locale: ProductLocale): Product[] {
  return productsData.map((p) => localizeProduct(p, locale));
}
