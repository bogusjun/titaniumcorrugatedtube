"use client";

import { useState, useCallback } from "react";
import { Calculator, AlertTriangle, TrendingDown, Zap, ChevronDown } from "lucide-react";

/* ─── 타입 ─── */
interface Inputs {
  /* 유체 조건 */
  flowRateHot: string;   // 온수(폐수) 유량 ton/h
  flowRateCold: string;  // 냉수(입수) 유량 ton/h
  tempHotIn: string;     // 온수 입구 °C
  tempColdIn: string;    // 냉수 입구 °C
  targetTemp: string;    // 목표 수온 °C

  /* 운전 조건 */
  opsHoursDay: string;   // 일일 가동 시간 h
  opsDaysYear: string;   // 연간 가동 일수 day

  /* 현장 에너지 조건 */
  electricRate: string;  // 전기요금 원/kWh
  equipType: string;     // 기존 설비 종류
  customCop: string;     // 직접 입력 COP (equipType === 'custom')
}

interface Result {
  /* 열역학 */
  maxDeltaT: number;          // 이론 최대 회수 가능 온도차
  recoveredDeltaT: number;    // 실제 회수 온도차 (η 적용)
  qHotMax_kW: number;         // 온수 측 최대 방열량 kW
  qColdActual_kW: number;     // 냉수 측 실제 흡열량 kW
  energyBalance_pct: number;  // 에너지 보존 검증 (%)

  /* 절감량 */
  savedEnergy_kWh_day: number;
  savedEnergy_kWh_year: number;

  /* 절감액 */
  savedMoney_day: number;
  savedMoney_month: number;
  savedMoney_year: number;

  /* 검증 경고 */
  warnings: string[];
}

/* ─── 상수 ─── */
const CP = 4.186;  // kJ / (kg·°C)
const ETA = 0.8231; // KOMERI 공인 열교환 효율 82.31%

const EQUIP_OPTIONS = [
  { value: "heatpump",   label: "히트펌프",    cop: 3.0  },
  { value: "heatpump25", label: "히트펌프 (COP 2.5)", cop: 2.5 },
  { value: "gasboiler",  label: "가스보일러",   cop: 0.95 },
  { value: "oilboiler",  label: "기름보일러",   cop: 0.8  },
  { value: "woodboiler", label: "화목보일러",   cop: 0.6  },
  { value: "custom",     label: "직접 입력",    cop: null },
];

/* ─── 계산 핵심 ─── */
function calculate(inp: Inputs): Result | null {
  const fH  = parseFloat(inp.flowRateHot)   || 0;
  const fC  = parseFloat(inp.flowRateCold)  || 0;
  const tHi = parseFloat(inp.tempHotIn)     || 0;
  const tCi = parseFloat(inp.tempColdIn)    || 0;
  const tTarget = parseFloat(inp.targetTemp) || 0;
  const opsH = parseFloat(inp.opsHoursDay)  || 0;
  const opsD = parseFloat(inp.opsDaysYear)  || 0;
  const rate = parseFloat(inp.electricRate) || 0;

  const equipOpt = EQUIP_OPTIONS.find(e => e.value === inp.equipType);
  const cop = inp.equipType === "custom"
    ? parseFloat(inp.customCop) || 1
    : (equipOpt?.cop ?? 1);

  if (fH <= 0 || fC <= 0 || opsH <= 0 || opsD <= 0 || rate <= 0 || cop <= 0) return null;

  const warnings: string[] = [];

  /* ── 에너지 보존 검증 ──
     온수가 잃을 수 있는 최대 열량 (냉수 입구까지 냉각되는 경우)
     Q_hot_max = m_hot × Cp × (T_hot_in - T_cold_in)

     냉수가 얻을 수 있는 최대 열량 (온수 입구까지 가열되는 경우)
     Q_cold_max = m_cold × Cp × (T_hot_in - T_cold_in)

     실질 제약: 양쪽 중 작은 쪽이 이론 최대
  */
  const deltaTMax = tHi - tCi; // 두 유체 사이 전체 온도차

  if (deltaTMax <= 0) {
    warnings.push("냉수 입구 온도가 온수 입구 온도보다 높거나 같습니다. 열교환이 불가능합니다.");
  }

  // 각 측 최대 열전달 능력 (kW)
  const qHotMax_kW  = (fH  * 1000 / 3600) * CP * Math.max(deltaTMax, 0); // ton/h → kg/s
  const qColdMax_kW = (fC  * 1000 / 3600) * CP * Math.max(deltaTMax, 0);

  // 이론 최대 회수량 = min(온수 방열 최대, 냉수 흡열 최대)
  const qTheoMax_kW = Math.min(qHotMax_kW, qColdMax_kW);

  // 실제 회수량 (η 적용)
  const qColdActual_kW = qTheoMax_kW * ETA;

  // 냉수 실제 온도 상승
  const recoveredDeltaT = fC > 0
    ? qColdActual_kW / ((fC * 1000 / 3600) * CP)
    : 0;

  // 에너지 보존 검증: 냉수 흡열 / 온수 방열 (%)
  const energyBalance_pct = qHotMax_kW > 0
    ? (qColdActual_kW / qHotMax_kW) * 100
    : 0;

  // 경고: 냉수가 목표 수온을 초과할 경우
  const coldOutTemp = tCi + recoveredDeltaT;
  if (tTarget > 0 && coldOutTemp > tTarget) {
    warnings.push(
      `냉수 출구 예상 온도(${coldOutTemp.toFixed(1)}°C)가 목표 수온(${tTarget}°C)을 초과합니다. 유량 조정 또는 바이패스를 검토하세요.`
    );
  }

  if (fH !== fC) {
    warnings.push(
      `온수(${fH} ton/h)와 냉수(${fC} ton/h) 유량이 다릅니다. 유량이 적은 측이 열교환 제약 조건이 됩니다.`
    );
  }

  /* ── 절감 에너지 계산 ──
     히트펌프 등 설비가 같은 열량을 공급할 때 필요한 전기 소비량
     W_elec = Q_thermal / COP
  */
  const savedEnergy_kWh_day  = (qColdActual_kW * opsH) / cop;           // kWh/일
  const savedEnergy_kWh_year = savedEnergy_kWh_day * opsD;              // kWh/년

  const savedMoney_day   = savedEnergy_kWh_day  * rate;
  const savedMoney_month = savedMoney_day * (opsD / 12);
  const savedMoney_year  = savedEnergy_kWh_year * rate;

  return {
    maxDeltaT: deltaTMax,
    recoveredDeltaT,
    qHotMax_kW,
    qColdActual_kW,
    energyBalance_pct,
    savedEnergy_kWh_day,
    savedEnergy_kWh_year,
    savedMoney_day,
    savedMoney_month,
    savedMoney_year,
    warnings,
  };
}

/* ─── 포맷 헬퍼 ─── */
const fmt = (n: number, digits = 0) =>
  n.toLocaleString("ko-KR", { maximumFractionDigits: digits, minimumFractionDigits: digits });

/* ─── 컴포넌트 ─── */
export default function SavingsCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    flowRateHot:  "20",
    flowRateCold: "20",
    tempHotIn:    "28",
    tempColdIn:   "15",
    targetTemp:   "20",
    opsHoursDay:  "24",
    opsDaysYear:  "330",
    electricRate: "130",
    equipType:    "heatpump",
    customCop:    "1",
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const set = useCallback(
    (key: keyof Inputs) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setInputs(prev => ({ ...prev, [key]: e.target.value })),
    []
  );

  const result = calculate(inputs);

  const selectedEquip = EQUIP_OPTIONS.find(e => e.value === inputs.equipType);
  const displayCop = inputs.equipType === "custom"
    ? parseFloat(inputs.customCop) || "-"
    : selectedEquip?.cop;

  return (
    <div className="bg-ti-950 rounded-2xl border border-ti-700 overflow-hidden">

      {/* 헤더 */}
      <div className="px-6 py-4 border-b border-ti-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center flex-shrink-0">
          <Calculator className="w-4 h-4 text-accent" />
        </div>
        <div>
          <h3 className="text-white font-black text-base">연간 절감액 계산기</h3>
          <p className="text-silver-500 text-xs mt-0.5">현장 조건을 입력하면 에너지 보존 법칙 기반으로 절감 효과를 즉시 계산합니다</p>
        </div>
      </div>

      {/* ─── 3단 레이아웃: 유체조건 | 에너지/설비 | 결과 ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ti-800">

        {/* ── 열 1: 유체 조건 ── */}
        <div className="p-5 space-y-4">
          <p className="text-silver-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <span className="w-3 h-px bg-accent inline-block" />
            유체 조건
          </p>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-silver-400 text-xs font-semibold block mb-1.5">온수(폐수) 유량</span>
              <div className="relative">
                <input type="number" min="0" step="0.5"
                  value={inputs.flowRateHot} onChange={set("flowRateHot")}
                  className="calc-input pr-14" />
                <span className="calc-unit">ton/h</span>
              </div>
            </label>
            <label className="block">
              <span className="text-silver-400 text-xs font-semibold block mb-1.5">냉수(입수) 유량</span>
              <div className="relative">
                <input type="number" min="0" step="0.5"
                  value={inputs.flowRateCold} onChange={set("flowRateCold")}
                  className="calc-input pr-14" />
                <span className="calc-unit">ton/h</span>
              </div>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-silver-400 text-xs font-semibold block mb-1.5">온수 입구 온도</span>
              <div className="relative">
                <input type="number" step="0.1"
                  value={inputs.tempHotIn} onChange={set("tempHotIn")}
                  className="calc-input pr-8" />
                <span className="calc-unit">°C</span>
              </div>
            </label>
            <label className="block">
              <span className="text-silver-400 text-xs font-semibold block mb-1.5">냉수 입구 온도</span>
              <div className="relative">
                <input type="number" step="0.1"
                  value={inputs.tempColdIn} onChange={set("tempColdIn")}
                  className="calc-input pr-8" />
                <span className="calc-unit">°C</span>
              </div>
            </label>
          </div>

          {/* 고급 설정 */}
          <div>
            <button
              onClick={() => setShowAdvanced(v => !v)}
              className="flex items-center gap-1.5 text-silver-500 hover:text-silver-300 text-xs font-semibold transition-colors"
            >
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
              고급 설정
            </button>
            {showAdvanced && (
              <div className="mt-3 space-y-3 pl-3 border-l border-ti-700">
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-silver-400 text-xs font-semibold block mb-1.5">일일 가동 시간</span>
                    <div className="relative">
                      <input type="number" min="1" max="24" step="1"
                        value={inputs.opsHoursDay} onChange={set("opsHoursDay")}
                        className="calc-input pr-6" />
                      <span className="calc-unit">h</span>
                    </div>
                  </label>
                  <label className="block">
                    <span className="text-silver-400 text-xs font-semibold block mb-1.5">연간 가동 일수</span>
                    <div className="relative">
                      <input type="number" min="1" max="365" step="1"
                        value={inputs.opsDaysYear} onChange={set("opsDaysYear")}
                        className="calc-input pr-8" />
                      <span className="calc-unit">일</span>
                    </div>
                  </label>
                </div>
                <label className="block">
                  <span className="text-silver-400 text-xs font-semibold block mb-1.5">목표 수온</span>
                  <div className="relative">
                    <input type="number" step="0.5"
                      value={inputs.targetTemp} onChange={set("targetTemp")}
                      className="calc-input pr-8" />
                    <span className="calc-unit">°C</span>
                  </div>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* ── 열 2: 에너지 단가 & 설비 ── */}
        <div className="p-5 space-y-4">
          <p className="text-silver-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <span className="w-3 h-px bg-accent inline-block" />
            에너지 단가 &amp; 기존 설비
          </p>

          <label className="block">
            <span className="text-silver-400 text-xs font-semibold block mb-1.5">
              현장 전기요금 단가
              <span className="text-silver-600 font-normal ml-1">(청구서 기준)</span>
            </span>
            <div className="relative">
              <input type="number" min="1" step="1"
                value={inputs.electricRate} onChange={set("electricRate")}
                className="calc-input pr-16" />
              <span className="calc-unit">원/kWh</span>
            </div>
            <p className="text-silver-600 text-xs mt-1">산업용 저압 평균 약 110~160원/kWh</p>
          </label>

          <label className="block">
            <span className="text-silver-400 text-xs font-semibold block mb-1.5">현재 사용 중인 가온·냉각 설비</span>
            <div className="relative">
              <select value={inputs.equipType} onChange={set("equipType")}
                className="calc-input appearance-none pr-8 cursor-pointer">
                {EQUIP_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>
                    {o.label}{o.cop ? ` (COP ${o.cop})` : ""}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-silver-500 pointer-events-none" />
            </div>
          </label>

          {inputs.equipType === "custom" && (
            <label className="block">
              <span className="text-silver-400 text-xs font-semibold block mb-1.5">COP 직접 입력</span>
              <div className="relative">
                <input type="number" min="0.1" step="0.1"
                  value={inputs.customCop} onChange={set("customCop")}
                  className="calc-input" />
              </div>
            </label>
          )}

          {/* 계산 가정 */}
          <div className="bg-ti-900/60 border border-ti-700 rounded-xl px-4 py-3 text-xs text-silver-500 space-y-1 mt-auto">
            <p className="text-silver-400 font-semibold mb-1.5">계산 가정</p>
            <p>· 열교환 효율: KOMERI 공인 <span className="text-silver-300">82.31%</span></p>
            <p>· 물의 비열: <span className="text-silver-300">4.186 kJ/(kg·°C)</span></p>
            <p>· 에너지 보존 법칙 — 온수 방열량 초과 회수 불가</p>
            <p>· COP: <span className="text-silver-300">{displayCop}</span></p>
          </div>
        </div>

        {/* ── 열 3: 결과 ── */}
        <div className="p-5 space-y-3">
          <p className="text-silver-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <span className="w-3 h-px bg-accent inline-block" />
            계산 결과
          </p>

          {/* 경고 메시지 */}
          {result?.warnings.map((w, i) => (
            <div key={i} className="flex items-start gap-2 bg-yellow-950/50 border border-yellow-800/60 rounded-xl px-3 py-2.5">
              <AlertTriangle className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-yellow-300 text-xs leading-relaxed">{w}</p>
            </div>
          ))}

          {result ? (
            <>
              {/* 열역학 검증 — 가로 2×2 */}
              <div className="bg-ti-900 border border-ti-700 rounded-xl p-3">
                <p className="text-silver-500 text-xs font-bold uppercase tracking-wider mb-2">열역학 검증</p>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-ti-950 rounded-lg p-2.5">
                    <p className="text-silver-500 text-[10px] mb-0.5">최대 회수 ΔT</p>
                    <p className="text-white font-black text-lg leading-tight">{result.maxDeltaT.toFixed(1)}°C</p>
                    <p className="text-silver-600 text-[10px]">이론 최대</p>
                  </div>
                  <div className="bg-ti-950 rounded-lg p-2.5">
                    <p className="text-silver-500 text-[10px] mb-0.5">실제 회수 ΔT</p>
                    <p className="text-accent font-black text-lg leading-tight">{result.recoveredDeltaT.toFixed(1)}°C</p>
                    <p className="text-silver-600 text-[10px]">η 82.31% 적용</p>
                  </div>
                  <div className="bg-ti-950 rounded-lg p-2.5">
                    <p className="text-silver-500 text-[10px] mb-0.5">온수 최대 방열</p>
                    <p className="text-orange-400 font-black text-lg leading-tight">{fmt(result.qHotMax_kW, 0)} kW</p>
                  </div>
                  <div className="bg-ti-950 rounded-lg p-2.5">
                    <p className="text-silver-500 text-[10px] mb-0.5">냉수 실제 흡열</p>
                    <p className="text-blue-400 font-black text-lg leading-tight">{fmt(result.qColdActual_kW, 0)} kW</p>
                    <p className={`text-[10px] font-semibold ${result.energyBalance_pct <= 100 ? "text-emerald-500" : "text-red-400"}`}>
                      온수의 {result.energyBalance_pct.toFixed(0)}%
                    </p>
                  </div>
                </div>
                {result.energyBalance_pct <= 100 && (
                  <p className="mt-2 text-center text-[10px] text-emerald-500 font-semibold">
                    ✓ 에너지 보존 법칙 충족
                  </p>
                )}
              </div>

              {/* 절감 에너지 */}
              <div className="bg-ti-900 border border-ti-700 rounded-xl p-3">
                <p className="text-silver-500 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Zap className="w-3 h-3" /> 절감 에너지
                </p>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-ti-950 rounded-lg p-2.5">
                    <p className="text-silver-500 text-[10px] mb-0.5">일일</p>
                    <p className="text-white font-black text-base">{fmt(result.savedEnergy_kWh_day, 0)}</p>
                    <p className="text-silver-500 text-[10px]">kWh/일</p>
                  </div>
                  <div className="bg-ti-950 rounded-lg p-2.5">
                    <p className="text-silver-500 text-[10px] mb-0.5">연간</p>
                    <p className="text-white font-black text-base">{fmt(result.savedEnergy_kWh_year, 0)}</p>
                    <p className="text-silver-500 text-[10px]">kWh/년</p>
                  </div>
                </div>
              </div>

              {/* 절감액 — 핵심 */}
              <div className="bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/40 rounded-xl p-4">
                <p className="text-silver-300 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <TrendingDown className="w-3.5 h-3.5 text-accent" />
                  예상 절감액
                  <span className="text-silver-500 font-normal normal-case text-[10px]">@{fmt(parseFloat(inputs.electricRate), 0)}원/kWh</span>
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-silver-400 text-xs">일 절감액</span>
                    <span className="text-white font-semibold text-sm">{fmt(result.savedMoney_day, 0)}원</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-silver-400 text-xs">월 절감액</span>
                    <span className="text-white font-bold">{fmt(result.savedMoney_month, 0)}원</span>
                  </div>
                  <div className="h-px bg-accent/20 my-1" />
                  <div className="flex items-center justify-between">
                    <span className="text-silver-200 font-bold text-sm">연간 절감액</span>
                    <span className="text-accent font-black text-2xl">{fmt(result.savedMoney_year, 0)}원</span>
                  </div>
                </div>
              </div>

              <p className="text-silver-600 text-[10px] text-center leading-relaxed">
                * 이론 추정치입니다. 실제 절감액은 배관 손실·계절 변동·운전 패턴에 따라 다를 수 있습니다.
              </p>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <Calculator className="w-10 h-10 text-ti-700 mb-3" />
              <p className="text-silver-500 text-sm">입력값을 채우면<br />자동으로 계산됩니다.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
