"use client";

import { useState, useRef } from "react";
import { Send, Upload, CheckCircle2 } from "lucide-react";

interface FormData {
  company: string;
  name: string;
  email: string;
  phone: string;
  product: string;
  size: string;
  quantity: string;
  pressure: string;
  fluid: string;
  message: string;
}

const initialData: FormData = {
  company: "",
  name: "",
  email: "",
  phone: "",
  product: "",
  size: "",
  quantity: "",
  pressure: "",
  fluid: "",
  message: "",
};

export default function ContactForm() {
  const [form, setForm] = useState<FormData>(initialData);
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files).slice(0, 3));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    // 실제 구현 시 Resend / EmailJS API 연동
    await new Promise((r) => setTimeout(r, 1500));
    setStatus("success");
  };

  if (status === "success") {
    return (
      <div className="text-center py-16">
        <CheckCircle2 className="w-16 h-16 text-accent mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-ink mb-2">견적 요청이 접수되었습니다!</h3>
        <p className="text-ink-muted mb-6">
          영업일 기준 24시간 내에 담당자가 연락드리겠습니다.
        </p>
        <button
          onClick={() => { setForm(initialData); setFiles([]); setStatus("idle"); }}
          className="btn-primary"
        >
          새 문의 작성
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Company Info */}
      <div>
        <h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-4 pb-2 border-b border-silver-100">
          기업 정보
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-1.5">
              회사명 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="company"
              required
              value={form.company}
              onChange={handleChange}
              placeholder="(주) 회사명"
              className="w-full px-4 py-2.5 rounded-lg border border-silver-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-1.5">
              담당자명 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="홍길동"
              className="w-full px-4 py-2.5 rounded-lg border border-silver-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-1.5">
              이메일 <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="example@company.com"
              className="w-full px-4 py-2.5 rounded-lg border border-silver-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-1.5">
              연락처
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="010-0000-0000"
              className="w-full px-4 py-2.5 rounded-lg border border-silver-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
          </div>
        </div>
      </div>

      {/* Product Spec */}
      <div>
        <h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-4 pb-2 border-b border-silver-100">
          희망 제품 사양
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-1.5">
              제품 종류
            </label>
            <select
              name="product"
              value={form.product}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-silver-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent bg-white"
            >
              <option value="">선택하세요</option>
              <option value="single-ply">단층 주름관 (Single Ply)</option>
              <option value="multi-ply">다층 주름관 (Multi Ply)</option>
              <option value="braided">브레이드형 주름관</option>
              <option value="heat-exchanger">주름관 열교환기</option>
              <option value="custom">커스텀 규격</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-1.5">
              희망 규격 (호칭 / 외경)
            </label>
            <input
              type="text"
              name="size"
              value={form.size}
              onChange={handleChange}
              placeholder="예: 15A / OD 21.7mm"
              className="w-full px-4 py-2.5 rounded-lg border border-silver-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-1.5">
              수량 (본 또는 m)
            </label>
            <input
              type="text"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              placeholder="예: 50본 / 200m"
              className="w-full px-4 py-2.5 rounded-lg border border-silver-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-1.5">
              사용 압력
            </label>
            <input
              type="text"
              name="pressure"
              value={form.pressure}
              onChange={handleChange}
              placeholder="예: 10 MPa / 100 bar"
              className="w-full px-4 py-2.5 rounded-lg border border-silver-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-ink-muted mb-1.5">
              이송 유체 / 적용 환경
            </label>
            <input
              type="text"
              name="fluid"
              value={form.fluid}
              onChange={handleChange}
              placeholder="예: 불산 (HF) 20% / 반도체 세정 배관"
              className="w-full px-4 py-2.5 rounded-lg border border-silver-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
          </div>
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-ink-muted mb-1.5">
          추가 요청사항
        </label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={4}
          placeholder="연결 방식, 길이, 특수 인증 요건 등 상세 내용을 자유롭게 작성해 주세요."
          className="w-full px-4 py-2.5 rounded-lg border border-silver-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none"
        />
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-ink-muted mb-1.5">
          도면·파일 첨부 (최대 3개, 10MB)
        </label>
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-silver-100 rounded-xl p-6 text-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-colors"
        >
          <Upload className="w-8 h-8 text-silver-400 mx-auto mb-2" />
          <p className="text-sm text-ink-subtle">
            클릭하여 파일을 선택하거나 드래그하세요
          </p>
          <p className="text-xs text-ink-subtle mt-1">PDF, DWG, DXF, JPG, PNG 지원</p>
          {files.length > 0 && (
            <div className="mt-3 space-y-1">
              {files.map((f) => (
                <div key={f.name} className="text-xs text-ink-muted font-medium">
                  📎 {f.name}
                </div>
              ))}
            </div>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept=".pdf,.dwg,.dxf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-primary w-full justify-center py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "sending" ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            전송 중...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            견적 요청 보내기
          </>
        )}
      </button>

      <p className="text-xs text-ink-subtle text-center">
        영업일 기준 24시간 이내 답변 드립니다. |{" "}
        <a href="mailto:info@atx-titanium.co.kr" className="underline hover:text-ink-muted">
          info@atx-titanium.co.kr
        </a>
      </p>
    </form>
  );
}
