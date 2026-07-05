"use client";

import { useState, useRef } from "react";
import { Send, Upload, CheckCircle2, AlertCircle, ChevronDown } from "lucide-react";
import productsData from "@/data/products.json";

// ────────────────────────────────────────────────────────────
// 제품별 사양 필드 구성
// ────────────────────────────────────────────────────────────

interface SizeOption { label: string; od?: string }

interface ProductFieldConfig {
  // 호칭 규격
  size: "buttons" | "select" | "text" | "none";
  sizeOptions?: SizeOption[];
  sizePlaceholder?: string;
  // 길이
  length: "m" | "mm" | "select" | "none";
  lengthPresets?: string[]; // "select" 모드에서 기성 길이 목록
  // 수량 단위
  quantityUnits: string[];
  // 사용 압력
  pressure: "input" | "fixed" | "none";
  pressureFixed?: string; // "fixed" 모드의 표시값
  // 이송 유체
  fluid: "select" | "none";
  // 연결 방식
  connection: "select" | "fixed" | "none";
  connectionFixed?: string;
  connectionOptions?: string[];
  // 직관형/쉘앤튜브형 열교환기 전용 필드 (튜브 OD·길이·수)
  straightTubeFields?: boolean;
  // 소켓 전용 필드 (소재·호칭·연결방식 버튼)
  socketFields?: boolean;
  // 추가 안내 문구
  hint?: string;
}

const FLUID_OPTIONS = [
  "해수 (Sea Water)",
  "순수 / 초순수 (DI/UPW)",
  "불산 (HF)",
  "염산 (HCl)",
  "황산 (H₂SO₄)",
  "질산 (HNO₃)",
  "수산화나트륨 (NaOH)",
  "암모니아 (NH₃)",
  "스팀 (Steam)",
  "냉각수 (Cooling Water)",
  "기타 (직접 입력)",
];

const PRODUCT_CONFIG: Record<string, ProductFieldConfig> = {
  // ── 티타늄 주름관 (주문제작)
  tube: {
    size: "buttons",
    sizeOptions: [
      { label: "10A (3/8\")", od: "OD 16.4mm" },
      { label: "15A (1/2\")", od: "OD 19.4mm" },
    ],
    length: "m",
    quantityUnits: ["본"],
    pressure: "none",
    fluid: "select",
    connection: "select",
    connectionOptions: ["소켓 피팅 (Socket)", "플랜지 (Flange)", "NPT 수나사", "BSPT 수나사", "미결정 / 협의 필요"],
  },

  // ── 티타늄 주름관 표준품 (재고 기성품)
  "tube-standard": {
    size: "none",              // 15A 단일 규격 고정
    length: "select",
    lengthPresets: ["300mm", "500mm", "1,000mm", "직접 입력"],
    quantityUnits: ["개"],
    pressure: "none",          // 10MPa 고정
    fluid: "select",
    connection: "none",        // 3/8\" NPT 고정
    hint: "재고 보유 규격: 15A (OD 19.4mm) · NPT 3/8\" 양끝 수나사 · 즉시 납품 가능",
  },

  // ── 열교환기 주름관형
  "heat-exchanger-corrugated": {
    size: "buttons",
    sizeOptions: [
      { label: "10A (3/8\")", od: "OD 16.4mm" },
      { label: "15A (1/2\")", od: "OD 19.4mm" },
    ],
    length: "none",
    quantityUnits: ["set"],
    pressure: "input",
    fluid: "select",
    connection: "none",
    hint: "코일 형상, 권수, 냉·온수 측 유량 등 상세 사양은 '추가 요청사항' 또는 도면으로 전달해 주세요.",
  },

  // ── 열교환기 직관형
  "heat-exchanger-straight": {
    size: "none",
    length: "none",
    quantityUnits: ["set"],
    pressure: "input",
    fluid: "select",
    connection: "none",
    straightTubeFields: true,
    hint: "하우징 치수, 바플 구조, 유량 등 상세 사양은 '추가 요청사항' 또는 도면으로 전달해 주세요.",
  },

  // ── 열교환기 쉘앤튜브형
  "heat-exchanger-shell-tube": {
    size: "none",
    length: "none",
    quantityUnits: ["set"],
    pressure: "input",
    fluid: "select",
    connection: "fixed",
    connectionFixed: "플랜지 (Flange)",
    straightTubeFields: true,
    hint: "TEMA 타입, 패스 수, 유량·온도 조건 등 상세 사양은 '추가 요청사항' 또는 도면으로 전달해 주세요.",
  },

  // ── 폐열회수기
  "waste-heat-recovery": {
    size: "text",
    sizePlaceholder: "예: 고온 측 유량 50 L/min / 회수 열량 20 kW",
    length: "none",
    quantityUnits: ["set"],
    pressure: "input",
    fluid: "select",
    connection: "none",
    hint: "고온·저온 측 유체, 유량, 입·출구 온도 조건을 '추가 요청사항'에 기재해 주시면 빠른 견적이 가능합니다.",
  },

  // ── 주름관 소켓 (티타늄 / 황동 통합)
  "socket": {
    size: "none",
    length: "none",
    quantityUnits: ["개"],
    pressure: "none",
    fluid: "none",
    connection: "none",
    socketFields: true,
  },
};

// ────────────────────────────────────────────────────────────
// FormData
// ────────────────────────────────────────────────────────────

interface FormData {
  company: string;
  name: string;
  email: string;
  phone: string;
  product: string;
  sizeLabel: string;
  length: string;
  lengthUnit: string;
  quantity: string;
  quantityUnit: string;
  pressureValue: string;
  pressureUnit: string;
  fluid: string;
  fluidCustom: string;
  connection: string;
  message: string;
  // 직관형/쉘앤튜브형 열교환기 전용
  straightTubeOD: string;
  straightTubeLength: string;
  straightTubeCount: string;
  // 소켓 전용
  socketMaterial: string;
  socketSize: string;
  socketConnection: string;
}

const initialData: FormData = {
  company: "",
  name: "",
  email: "",
  phone: "",
  product: "",
  sizeLabel: "",
  length: "",
  lengthUnit: "mm",
  quantity: "",
  quantityUnit: "본",
  pressureValue: "",
  pressureUnit: "MPa",
  fluid: "",
  fluidCustom: "",
  connection: "",
  message: "",
  straightTubeOD: "",
  straightTubeLength: "",
  straightTubeCount: "",
  socketMaterial: "",
  socketSize: "",
  socketConnection: "",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ────────────────────────────────────────────────────────────
// 공용 UI 컴포넌트
// ────────────────────────────────────────────────────────────

const selectCls = "w-full px-4 py-2.5 pr-9 rounded-lg border border-silver-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent bg-white appearance-none";
const inputCls  = "w-full px-4 py-2.5 rounded-lg border border-silver-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent";

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-ink-muted mb-1.5">
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );
}

function SelectBox({
  name, value, onChange, options, placeholder = "선택하세요",
}: {
  name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <select name={name} value={value} onChange={onChange} className={selectCls}>
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
    </div>
  );
}

function InputWithUnit({
  label, name, value, onChange, placeholder,
  unitName, unitValue, unitOptions, onUnitChange,
}: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  unitName: string; unitValue: string; unitOptions: string[];
  onUnitChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex">
        <input
          type="number" name={name} value={value} onChange={onChange}
          placeholder={placeholder} min="0"
          className={`flex-1 px-4 py-2.5 text-sm border border-silver-100 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent ${unitOptions.length === 1 ? "rounded-l-lg" : "rounded-l-lg"}`}
        />
        {unitOptions.length === 1 ? (
          <span className="px-4 py-2.5 rounded-r-lg border border-l-0 border-silver-100 bg-silver-50 text-sm font-medium text-ink-muted">
            {unitOptions[0]}
          </span>
        ) : (
          <div className="relative">
            <select
              name={unitName} value={unitValue} onChange={onUnitChange}
              className="h-full px-3 py-2.5 pr-7 rounded-r-lg border border-l-0 border-silver-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent bg-white appearance-none font-medium"
            >
              {unitOptions.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-subtle" />
          </div>
        )}
      </div>
    </div>
  );
}

function FixedBadge({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="px-4 py-2.5 rounded-lg border border-silver-100 bg-silver-50 text-sm text-ink-muted">
        {value}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// 메인 컴포넌트
// ────────────────────────────────────────────────────────────

export default function ContactForm() {
  const [form, setForm] = useState<FormData>(initialData);
  const [emailError, setEmailError] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const cfg = form.product ? PRODUCT_CONFIG[form.product] : null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "product") {
      const newCfg = PRODUCT_CONFIG[value];
      setForm({
        ...initialData,
        company: form.company,
        name: form.name,
        email: form.email,
        phone: form.phone,
        product: value,
        quantityUnit: newCfg?.quantityUnits[0] ?? "본",
      });
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "email") {
      setEmailError(value && !emailRegex.test(value) ? "올바른 이메일 형식을 입력해 주세요." : "");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files).slice(0, 3));
  };

  const buildSpecSummary = () => {
    if (!cfg) return "";
    const parts: string[] = [];
    if (cfg.straightTubeFields) {
      if (form.straightTubeOD) parts.push(`튜브 OD: ${form.straightTubeOD}mm`);
      if (form.straightTubeLength) parts.push(`튜브 길이: ${form.straightTubeLength}mm`);
      if (form.straightTubeCount) parts.push(`튜브 수: ${form.straightTubeCount}본`);
    } else if (form.sizeLabel) {
      parts.push(`규격: ${form.sizeLabel}`);
    }
    if (cfg.length === "m" && form.length) parts.push(`길이: ${form.length}m`);
    else if (cfg.length === "mm" && form.length) parts.push(`길이: ${form.length}${form.lengthUnit}`);
    else if (cfg.length === "select" && form.length) parts.push(`길이: ${form.length}`);
    if (form.quantity) parts.push(`수량: ${form.quantity}${form.quantityUnit}`);
    if (cfg.pressure === "input" && form.pressureValue) parts.push(`압력: ${form.pressureValue} ${form.pressureUnit}`);
    if (cfg.pressure === "fixed" && cfg.pressureFixed) parts.push(`압력: ${cfg.pressureFixed}`);
    const fluid = form.fluid === "기타 (직접 입력)" ? form.fluidCustom : form.fluid;
    if (fluid) parts.push(`유체: ${fluid}`);
    if (cfg.socketFields) {
      if (form.socketMaterial) parts.push(`소재: ${form.socketMaterial}`);
      if (form.socketSize) parts.push(`호칭: ${form.socketSize}`);
      if (form.socketConnection) parts.push(`연결: ${form.socketConnection}`);
    } else {
      const conn = cfg.connection === "fixed" ? cfg.connectionFixed : form.connection;
      if (conn) parts.push(`연결: ${conn}`);
    }
    return parts.join(" | ");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailRegex.test(form.email)) {
      setEmailError("올바른 이메일 형식을 입력해 주세요.");
      return;
    }
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: form.company,
          name: form.name,
          email: form.email,
          phone: form.phone,
          product: productsData.find((p) => p.id === form.product)?.name || form.product,
          size: buildSpecSummary(),
          quantity: form.quantity ? `${form.quantity}${form.quantityUnit}` : "",
          pressure: cfg?.pressure === "input" && form.pressureValue ? `${form.pressureValue} ${form.pressureUnit}` : (cfg?.pressureFixed ?? ""),
          fluid: form.fluid === "기타 (직접 입력)" ? form.fluidCustom : form.fluid,
          message: form.message,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "전송 실패");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "메일 전송에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-16">
        <CheckCircle2 className="w-16 h-16 text-accent mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-ink mb-2">견적 요청이 접수되었습니다!</h3>
        <p className="text-ink-muted mb-6">영업일 기준 24시간 내에 담당자가 연락드리겠습니다.</p>
        <button onClick={() => { setForm(initialData); setFiles([]); setStatus("idle"); }} className="btn-primary">
          새 문의 작성
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* ── 기업 정보 ── */}
      <section>
        <h3 className="text-xs font-bold text-ink uppercase tracking-widest mb-4 pb-2 border-b border-silver-100">기업 정보</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label required>회사명</Label>
            <input type="text" name="company" required value={form.company} onChange={handleChange} placeholder="(주) 회사명" className={inputCls} />
          </div>
          <div>
            <Label required>담당자명</Label>
            <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="홍길동" className={inputCls} />
          </div>
          <div>
            <Label required>이메일</Label>
            <input
              type="email" name="email" required value={form.email} onChange={handleChange}
              placeholder="example@company.com"
              className={`${inputCls} ${emailError ? "border-red-400 bg-red-50" : ""}`}
            />
            {emailError && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />{emailError}
              </p>
            )}
          </div>
          <div>
            <Label>연락처</Label>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="010-0000-0000" className={inputCls} />
          </div>
        </div>
      </section>

      {/* ── 희망 제품 사양 ── */}
      <section>
        <h3 className="text-xs font-bold text-ink uppercase tracking-widest mb-4 pb-2 border-b border-silver-100">희망 제품 사양</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* 제품 종류 — 항상 표시 */}
          <div className="sm:col-span-2">
            <Label>제품 종류</Label>
            <SelectBox
              name="product" value={form.product} onChange={handleChange}
              placeholder="제품을 선택하세요"
              options={productsData.map((p) => ({ value: p.id, label: p.name }))}
            />
          </div>

          {/* 제품 선택 전 안내 */}
          {!cfg && (
            <p className="sm:col-span-2 text-sm text-ink-subtle text-center py-4">
              제품을 선택하면 해당 제품에 맞는 사양 입력 항목이 나타납니다.
            </p>
          )}

          {/* 제품 선택 후 — cfg에 따라 필드 렌더 */}
          {cfg && (
            <>
              {/* 힌트 배너 */}
              {cfg.hint && (
                <div className="sm:col-span-2 px-4 py-3 rounded-lg bg-accent/5 border border-accent/20 text-xs text-ink-muted">
                  {cfg.hint}
                </div>
              )}

              {/* 직관형 열교환기 전용: 튜브 OD / 길이 / 수 */}
              {cfg.straightTubeFields && (
                <>
                  <div>
                    <Label>튜브 외경 (OD)</Label>
                    <div className="flex">
                      <input
                        type="number" name="straightTubeOD" value={form.straightTubeOD}
                        onChange={handleChange} placeholder="예: 12" min="0"
                        className="flex-1 px-4 py-2.5 rounded-l-lg border border-silver-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                      />
                      <span className="px-4 py-2.5 rounded-r-lg border border-l-0 border-silver-100 bg-silver-50 text-sm font-medium text-ink-muted">mm</span>
                    </div>
                  </div>
                  <div>
                    <Label>튜브 길이 (유효 전열 길이)</Label>
                    <div className="flex">
                      <input
                        type="number" name="straightTubeLength" value={form.straightTubeLength}
                        onChange={handleChange} placeholder="예: 1000" min="0"
                        className="flex-1 px-4 py-2.5 rounded-l-lg border border-silver-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                      />
                      <span className="px-4 py-2.5 rounded-r-lg border border-l-0 border-silver-100 bg-silver-50 text-sm font-medium text-ink-muted">mm</span>
                    </div>
                  </div>
                  <div>
                    <Label>튜브 수</Label>
                    <div className="flex">
                      <input
                        type="number" name="straightTubeCount" value={form.straightTubeCount}
                        onChange={handleChange} placeholder="예: 24" min="1"
                        className="flex-1 px-4 py-2.5 rounded-l-lg border border-silver-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                      />
                      <span className="px-4 py-2.5 rounded-r-lg border border-l-0 border-silver-100 bg-silver-50 text-sm font-medium text-ink-muted">본</span>
                    </div>
                  </div>
                </>
              )}

              {/* 소켓 전용: 소재·호칭·연결방식 버튼 */}
              {cfg.socketFields && (
                <>
                  {/* 소재 */}
                  <div className="sm:col-span-2">
                    <Label>소재</Label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: "티타늄 (Ti Gr.2)", desc: "이종금속 부식 없음 · 강산·강알칼리 대응" },
                        { value: "황동 (Brass)", desc: "범용 배관 호환 · 경제적" },
                      ].map((m) => (
                        <button
                          key={m.value} type="button"
                          onClick={() => setForm((prev) => ({ ...prev, socketMaterial: m.value }))}
                          className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors text-left ${
                            form.socketMaterial === m.value
                              ? "border-accent bg-accent text-white"
                              : "border-silver-100 bg-white text-ink-muted hover:border-accent hover:text-accent"
                          }`}
                        >
                          {m.value}
                          <span className={`block text-xs font-normal mt-0.5 ${form.socketMaterial === m.value ? "opacity-80" : "opacity-60"}`}>
                            {m.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* 호칭 규격 */}
                  <div>
                    <Label>호칭 규격</Label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: "10A (3/8\")", od: "OD 16.4mm" },
                        { value: "15A (1/2\")", od: "OD 19.4mm" },
                      ].map((s) => (
                        <button
                          key={s.value} type="button"
                          onClick={() => setForm((prev) => ({ ...prev, socketSize: s.value }))}
                          className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                            form.socketSize === s.value
                              ? "border-accent bg-accent text-white"
                              : "border-silver-100 bg-white text-ink-muted hover:border-accent hover:text-accent"
                          }`}
                        >
                          {s.value}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* 연결 방식 */}
                  <div>
                    <Label>연결 방식</Label>
                    <div className="flex flex-wrap gap-2">
                      {["NPT 수나사", "NPT 암나사", "BSPT 수나사", "BSPT 암나사"].map((c) => (
                        <button
                          key={c} type="button"
                          onClick={() => setForm((prev) => ({ ...prev, socketConnection: c }))}
                          className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                            form.socketConnection === c
                              ? "border-accent bg-accent text-white"
                              : "border-silver-100 bg-white text-ink-muted hover:border-accent hover:text-accent"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* 규격 — 버튼 선택 */}
              {cfg.size === "buttons" && cfg.sizeOptions && (
                <div className="sm:col-span-2">
                  <Label>호칭 규격</Label>
                  <div className="flex flex-wrap gap-2">
                    {cfg.sizeOptions.map((s) => (
                      <button
                        key={s.label}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, sizeLabel: s.label }))}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                          form.sizeLabel === s.label
                            ? "border-accent bg-accent text-white"
                            : "border-silver-100 bg-white text-ink-muted hover:border-accent hover:text-accent"
                        }`}
                      >
                        {s.label}{s.od ? <span className="ml-1.5 font-normal opacity-70">{s.od}</span> : null}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {/* 규격 — 드롭다운 */}
              {cfg.size === "select" && cfg.sizeOptions && (
                <div>
                  <Label>호칭 규격</Label>
                  <SelectBox
                    name="sizeLabel" value={form.sizeLabel} onChange={handleChange}
                    options={cfg.sizeOptions.map((s) => ({
                      value: s.label,
                      label: s.od ? `${s.label} — ${s.od}` : s.label,
                    }))}
                  />
                </div>
              )}
              {/* 규격 — 자유입력 */}
              {cfg.size === "text" && (
                <div>
                  <Label>희망 규격</Label>
                  <input
                    type="text" name="sizeLabel" value={form.sizeLabel} onChange={handleChange}
                    placeholder={cfg.sizePlaceholder ?? "규격을 입력하세요"}
                    className={inputCls}
                  />
                </div>
              )}

              {/* 길이 — m 고정 */}
              {cfg.length === "m" && (
                <div>
                  <Label>길이</Label>
                  <div className="flex">
                    <input
                      type="number" name="length" value={form.length} onChange={handleChange}
                      placeholder="예: 2" min="0"
                      className="flex-1 px-4 py-2.5 rounded-l-lg border border-silver-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                    />
                    <span className="px-4 py-2.5 rounded-r-lg border border-l-0 border-silver-100 bg-silver-50 text-sm font-medium text-ink-muted">m</span>
                  </div>
                </div>
              )}
              {/* 길이 — mm 입력 */}
              {cfg.length === "mm" && (
                <InputWithUnit
                  label="길이" name="length" value={form.length} onChange={handleChange}
                  placeholder="예: 500"
                  unitName="lengthUnit" unitValue={form.lengthUnit}
                  unitOptions={["mm", "m"]} onUnitChange={handleChange}
                />
              )}
              {/* 길이 — 기성품 select */}
              {cfg.length === "select" && (
                <div>
                  <Label>길이</Label>
                  <SelectBox
                    name="length" value={form.length} onChange={handleChange}
                    placeholder="길이를 선택하세요"
                    options={(cfg.lengthPresets ?? []).map((l) => ({ value: l, label: l }))}
                  />
                  {form.length === "직접 입력" && (
                    <input
                      type="text" name="lengthUnit" value={form.lengthUnit} onChange={handleChange}
                      placeholder="예: 1,500mm"
                      className={`${inputCls} mt-2`}
                    />
                  )}
                </div>
              )}

              {/* 수량 */}
              <InputWithUnit
                label="수량" name="quantity" value={form.quantity} onChange={handleChange}
                placeholder="예: 10"
                unitName="quantityUnit" unitValue={form.quantityUnit}
                unitOptions={cfg.quantityUnits} onUnitChange={handleChange}
              />

              {/* 사용 압력 */}
              {cfg.pressure === "input" && (
                <InputWithUnit
                  label="사용 압력" name="pressureValue" value={form.pressureValue} onChange={handleChange}
                  placeholder="예: 10"
                  unitName="pressureUnit" unitValue={form.pressureUnit}
                  unitOptions={["MPa", "bar", "kgf/cm²", "psi"]} onUnitChange={handleChange}
                />
              )}
              {cfg.pressure === "fixed" && cfg.pressureFixed && (
                <FixedBadge label="사용 압력" value={cfg.pressureFixed} />
              )}

              {/* 이송 유체 */}
              {cfg.fluid === "select" && (
                <>
                  <div>
                    <Label>이송 유체 / 적용 환경</Label>
                    <SelectBox
                      name="fluid" value={form.fluid} onChange={handleChange}
                      placeholder="유체를 선택하세요"
                      options={FLUID_OPTIONS.map((o) => ({ value: o, label: o }))}
                    />
                  </div>
                  {form.fluid === "기타 (직접 입력)" && (
                    <div>
                      <Label>유체 직접 입력</Label>
                      <input
                        type="text" name="fluidCustom" value={form.fluidCustom} onChange={handleChange}
                        placeholder="예: 불산 (HF) 20% / 반도체 세정 배관"
                        className={inputCls}
                      />
                    </div>
                  )}
                </>
              )}

              {/* 연결 방식 */}
              {cfg.connection === "select" && cfg.connectionOptions && (
                <div>
                  <Label>연결 방식 (End Fitting)</Label>
                  <SelectBox
                    name="connection" value={form.connection} onChange={handleChange}
                    placeholder="연결 방식을 선택하세요"
                    options={cfg.connectionOptions.map((o) => ({ value: o, label: o }))}
                  />
                </div>
              )}
              {cfg.connection === "fixed" && cfg.connectionFixed && (
                <FixedBadge label="연결 방식 (End Fitting)" value={cfg.connectionFixed} />
              )}
            </>
          )}
        </div>
      </section>

      {/* ── 추가 요청사항 ── */}
      <section>
        <h3 className="text-xs font-bold text-ink uppercase tracking-widest mb-4 pb-2 border-b border-silver-100">추가 요청사항</h3>
        <textarea
          name="message" value={form.message} onChange={handleChange} rows={4}
          placeholder="특수 인증 요건, 납기 조건, 기타 요청 사항을 자유롭게 작성해 주세요."
          className={`${inputCls} resize-none`}
        />
      </section>

      {/* ── 도면·파일 첨부 ── */}
      <section>
        <h3 className="text-xs font-bold text-ink uppercase tracking-widest mb-4 pb-2 border-b border-silver-100">도면·파일 첨부</h3>
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-silver-100 rounded-xl p-6 text-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-colors"
        >
          <Upload className="w-8 h-8 text-silver-400 mx-auto mb-2" />
          <p className="text-sm text-ink-subtle">클릭하여 파일을 선택하거나 드래그하세요</p>
          <p className="text-xs text-ink-subtle mt-1">PDF, DWG, DXF, JPG, PNG · 최대 3개, 10MB</p>
          {files.length > 0 && (
            <div className="mt-3 space-y-1">
              {files.map((f) => (
                <div key={f.name} className="text-xs text-ink-muted font-medium">📎 {f.name}</div>
              ))}
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" multiple accept=".pdf,.dwg,.dxf,.jpg,.jpeg,.png" onChange={handleFileChange} className="hidden" />
      </section>

      {status === "error" && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />{errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending" || !!emailError}
        className="btn-primary w-full justify-center py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "sending" ? (
          <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />전송 중...</>
        ) : (
          <><Send className="w-5 h-5" />견적 요청 보내기</>
        )}
      </button>

      <p className="text-xs text-ink-subtle text-center">
        영업일 기준 24시간 이내 답변 드립니다. |{" "}
        <a href="mailto:777@atx.kr" className="underline hover:text-ink-muted">777@atx.kr</a>
      </p>
    </form>
  );
}
