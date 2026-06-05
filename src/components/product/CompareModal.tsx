"use client";

import { X } from "lucide-react";

interface Product {
  name: string;
  image: string;
  specs: Record<string, string>;
  grade: string;
  connectionLabel: string;
}

interface CompareModalProps {
  products: Product[];
  onClose: () => void;
}

const specLabels: [string, string][] = [
  ["nominalSize", "호칭 규격"],
  ["outerDiameter", "외경 (OD)"],
  ["innerDiameter", "내경 (ID)"],
  ["wallThickness", "두께"],
  ["workingPressure", "사용 압력"],
  ["testPressure", "시험 압력"],
  ["temperatureRange", "온도 범위"],
  ["bendRadius", "최소 굴곡 반경"],
  ["standardLength", "공급 길이"],
  ["material", "재질"],
  ["endFitting", "연결 방식"],
];

export default function CompareModal({ products, onClose }: CompareModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ti-950/80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-silver-100">
          <h2 className="text-xl font-bold text-ink">제품 사양 비교</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-silver-100 transition-colors"
          >
            <X className="w-5 h-5 text-ink-muted" />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-auto flex-1">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="border-b border-silver-100">
                <th className="text-left py-3 px-6 text-ink-subtle font-medium w-36 bg-silver-50">
                  항목
                </th>
                {products.map((p) => (
                  <th key={p.name} className="py-3 px-6 text-center">
                    <div className="font-bold text-ink text-sm">{p.name}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {specLabels.map(([key, label], i) => (
                <tr
                  key={key}
                  className={`border-b border-silver-100 ${i % 2 === 0 ? "bg-silver-50/50" : "bg-white"}`}
                >
                  <td className="py-3 px-6 text-ink-muted font-medium bg-silver-50/80">
                    {label}
                  </td>
                  {products.map((p) => (
                    <td key={p.name} className="py-3 px-6 text-center text-ink-muted">
                      {p.specs[key] || "-"}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-b border-silver-100 bg-silver-50/50">
                <td className="py-3 px-6 text-ink-muted font-medium bg-silver-50/80">
                  Grade
                </td>
                {products.map((p) => (
                  <td key={p.name} className="py-3 px-6 text-center text-ink-muted">
                    {p.grade}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
