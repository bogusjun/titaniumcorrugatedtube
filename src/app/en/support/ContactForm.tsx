"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle, ChevronDown } from "lucide-react";

const FLUID_OPTIONS = [
  "Sea Water",
  "Deionized / Ultrapure Water (DI/UPW)",
  "Hydrofluoric Acid (HF)",
  "Hydrochloric Acid (HCl)",
  "Sulfuric Acid (H₂SO₄)",
  "Nitric Acid (HNO₃)",
  "Sodium Hydroxide (NaOH)",
  "Ammonia (NH₃)",
  "Steam",
  "Cooling Water",
  "Other (please specify)",
];

const PRODUCT_OPTIONS = [
  { value: "tube",                        label: "Titanium Corrugated Tube (Custom)" },
  { value: "tube-standard",               label: "Titanium Corrugated Tube (Standard Stock)" },
  { value: "heat-exchanger-corrugated",   label: "Heat Exchanger — Corrugated Tube Type" },
  { value: "heat-exchanger-straight",     label: "Heat Exchanger — Straight Tube Type" },
  { value: "heat-exchanger-shell-tube",   label: "Heat Exchanger — Shell & Tube Type" },
  { value: "waste-heat-recovery",         label: "Waste Heat Recovery System" },
  { value: "socket",                      label: "Corrugated Tube Socket (Titanium / Brass)" },
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

export default function EnContactForm() {
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
      setEmailError(value && !emailRegex.test(value) ? "Please enter a valid email address." : "");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailRegex.test(form.email)) {
      setEmailError("Please enter a valid email address.");
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
          fluid: form.fluid === "Other (please specify)" ? form.fluidCustom : form.fluid,
          message: `[Inquiry from English site]\n${form.message}`,
        }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Submission failed. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-16">
        <CheckCircle2 className="w-16 h-16 text-accent mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-ink mb-2">Quote Request Received!</h3>
        <p className="text-ink-muted mb-6">Our team will get back to you within 24 business hours.</p>
        <button
          onClick={() => setStatus("idle")}
          className="btn-primary"
        >
          New Inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* Company Information */}
      <section>
        <h3 className="text-xs font-bold text-ink uppercase tracking-widest mb-4 pb-2 border-b border-silver-100">Company Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label required>Company Name</Label>
            <input type="text" name="company" required value={form.company} onChange={handleChange} placeholder="Your Company Ltd." className={inputCls} />
          </div>
          <div>
            <Label required>Contact Person</Label>
            <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="John Smith" className={inputCls} />
          </div>
          <div>
            <Label required>Email Address</Label>
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
            <Label>Phone Number</Label>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+1-000-000-0000" className={inputCls} />
          </div>
        </div>
      </section>

      {/* Product Specifications */}
      <section>
        <h3 className="text-xs font-bold text-ink uppercase tracking-widest mb-4 pb-2 border-b border-silver-100">Product Specifications</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Label>Product Type</Label>
            <div className="relative">
              <select name="product" value={form.product} onChange={handleChange} className={selectCls}>
                <option value="">Select a product</option>
                {PRODUCT_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
            </div>
          </div>

          <div>
            <Label>Size / Specification</Label>
            <input type="text" name="size" value={form.size} onChange={handleChange} placeholder="e.g. 15A, OD 19.4 mm" className={inputCls} />
          </div>

          <div>
            <Label>Quantity</Label>
            <input type="text" name="quantity" value={form.quantity} onChange={handleChange} placeholder="e.g. 10 pcs" className={inputCls} />
          </div>

          <div>
            <Label>Fluid / Application Environment</Label>
            <div className="relative">
              <select name="fluid" value={form.fluid} onChange={handleChange} className={selectCls}>
                <option value="">Select a fluid</option>
                {FLUID_OPTIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
            </div>
          </div>

          {form.fluid === "Other (please specify)" && (
            <div>
              <Label>Fluid (Manual Entry)</Label>
              <input
                type="text" name="fluidCustom" value={form.fluidCustom} onChange={handleChange}
                placeholder="e.g. HF 20%"
                className={inputCls}
              />
            </div>
          )}
        </div>
      </section>

      {/* Additional Requirements */}
      <section>
        <h3 className="text-xs font-bold text-ink uppercase tracking-widest mb-4 pb-2 border-b border-silver-100">Additional Requirements</h3>
        <textarea
          name="message" value={form.message} onChange={handleChange} rows={4}
          placeholder="Special certification requirements, delivery schedule, or any other requests."
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
          <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</>
        ) : (
          <><Send className="w-5 h-5" />Submit Quote Request</>
        )}
      </button>

      <p className="text-xs text-ink-subtle text-center">
        We respond within 24 business hours. |{" "}
        <a href="mailto:777@atx.kr" className="underline hover:text-ink-muted">777@atx.kr</a>
      </p>
    </form>
  );
}
