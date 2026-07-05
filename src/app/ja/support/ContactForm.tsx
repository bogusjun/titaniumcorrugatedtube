"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle, ChevronDown } from "lucide-react";

const FLUID_OPTIONS = [
  "海水 (Sea Water)",
  "純水 / 超純水 (DI/UPW)",
  "フッ化水素酸 (HF)",
  "塩酸 (HCl)",
  "硫酸 (H₂SO₄)",
  "硝酸 (HNO₃)",
  "水酸化ナトリウム (NaOH)",
  "アンモニア (NH₃)",
  "スチーム (Steam)",
  "冷却水 (Cooling Water)",
  "その他（直接入力）",
];

const PRODUCT_OPTIONS = [
  { value: "tube", label: "チタン波管（カスタム製作）" },
  { value: "tube-standard", label: "チタン波管 標準品（在庫品）" },
  { value: "heat-exchanger-corrugated", label: "熱交換器 波管型" },
  { value: "heat-exchanger-straight", label: "熱交換器 直管型" },
  { value: "heat-exchanger-shell-tube", label: "熱交換器 シェル＆チューブ型" },
  { value: "waste-heat-recovery", label: "廃熱回収装置" },
  { value: "socket", label: "波管ソケット（チタン / 黄銅）" },
];

interface FormData {
  company: string;
  name: string;
  email: string;
  phone: string;
  product: string;
  size: string;
  quantity: string;
  fluid: string;
  fluidCustom: string;
  message: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const selectCls = "w-full px-4 py-2.5 pr-9 rounded-lg border border-silver-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent bg-white appearance-none";
const inputCls  = "w-full px-4 py-2.5 rounded-lg border border-silver-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent";

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-ink-muted mb-1.5">
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );
}

export default function JaContactForm() {
  const [form, setForm] = useState<FormData>({
    company: "", name: "", email: "", phone: "",
    product: "", size: "", quantity: "", fluid: "", fluidCustom: "", message: "",
  });
  const [emailError, setEmailError] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "email") {
      setEmailError(value && !emailRegex.test(value) ? "正しいメールアドレスを入力してください。" : "");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailRegex.test(form.email)) {
      setEmailError("正しいメールアドレスを入力してください。");
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
          product: PRODUCT_OPTIONS.find((p) => p.value === form.product)?.label || form.product,
          size: form.size,
          quantity: form.quantity,
          fluid: form.fluid === "その他（直接入力）" ? form.fluidCustom : form.fluid,
          message: `[日本語からの問い合わせ]\n${form.message}`,
        }),
      });
      if (!res.ok) throw new Error("送信失敗");
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("送信に失敗しました。お手数ですが再度お試しください。");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-16">
        <CheckCircle2 className="w-16 h-16 text-accent mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-ink mb-2">お見積もり依頼を受け付けました！</h3>
        <p className="text-ink-muted mb-6">営業日24時間以内に担当者よりご連絡いたします。</p>
        <button
          onClick={() => setStatus("idle")}
          className="btn-primary"
        >
          新しいお問い合わせ
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* 企業情報 */}
      <section>
        <h3 className="text-xs font-bold text-ink uppercase tracking-widest mb-4 pb-2 border-b border-silver-100">企業情報</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label required>会社名</Label>
            <input type="text" name="company" required value={form.company} onChange={handleChange} placeholder="株式会社 ○○" className={inputCls} />
          </div>
          <div>
            <Label required>ご担当者名</Label>
            <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="山田 太郎" className={inputCls} />
          </div>
          <div>
            <Label required>メールアドレス</Label>
            <input
              type="email" name="email" required value={form.email} onChange={handleChange}
              placeholder="example@company.co.jp"
              className={`${inputCls} ${emailError ? "border-red-400 bg-red-50" : ""}`}
            />
            {emailError && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />{emailError}
              </p>
            )}
          </div>
          <div>
            <Label>電話番号</Label>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="03-0000-0000" className={inputCls} />
          </div>
        </div>
      </section>

      {/* ご希望製品仕様 */}
      <section>
        <h3 className="text-xs font-bold text-ink uppercase tracking-widest mb-4 pb-2 border-b border-silver-100">ご希望製品仕様</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Label>製品種類</Label>
            <div className="relative">
              <select name="product" value={form.product} onChange={handleChange} className={selectCls}>
                <option value="">製品をお選びください</option>
                {PRODUCT_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
            </div>
          </div>

          <div>
            <Label>規格・サイズ</Label>
            <input type="text" name="size" value={form.size} onChange={handleChange} placeholder="例: 15A、OD 19.4mm" className={inputCls} />
          </div>

          <div>
            <Label>数量</Label>
            <input type="text" name="quantity" value={form.quantity} onChange={handleChange} placeholder="例: 10本" className={inputCls} />
          </div>

          <div>
            <Label>移送流体・適用環境</Label>
            <div className="relative">
              <select name="fluid" value={form.fluid} onChange={handleChange} className={selectCls}>
                <option value="">流体をお選びください</option>
                {FLUID_OPTIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
            </div>
          </div>

          {form.fluid === "その他（直接入力）" && (
            <div>
              <Label>流体（直接入力）</Label>
              <input
                type="text" name="fluidCustom" value={form.fluidCustom} onChange={handleChange}
                placeholder="例: フッ化水素酸 (HF) 20%"
                className={inputCls}
              />
            </div>
          )}
        </div>
      </section>

      {/* 追加ご要望 */}
      <section>
        <h3 className="text-xs font-bold text-ink uppercase tracking-widest mb-4 pb-2 border-b border-silver-100">追加ご要望</h3>
        <textarea
          name="message" value={form.message} onChange={handleChange} rows={4}
          placeholder="特別な認証要件、納期条件、その他ご要望等を自由にご記入ください。"
          className={`${inputCls} resize-none`}
        />
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
          <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />送信中...</>
        ) : (
          <><Send className="w-5 h-5" />お見積もりを送信する</>
        )}
      </button>

      <p className="text-xs text-ink-subtle text-center">
        営業日24時間以内にご回答いたします。 |{" "}
        <a href="mailto:777@atx.kr" className="underline hover:text-ink-muted">777@atx.kr</a>
      </p>
    </form>
  );
}
