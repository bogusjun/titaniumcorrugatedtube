import Link from "next/link";
import { CONSENT, PRIVACY_PATH } from "./privacy-content";
import type { LegalLocale } from "./types";

/** 견적 폼 하단 개인정보 수집·이용 동의 — 체크해야 폼을 보낼 수 있다 */
export default function PrivacyConsent({
  locale,
  checked,
  onChange,
}: {
  locale: LegalLocale;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  const t = CONSENT[locale];

  return (
    <section className={`rounded-xl border border-silver-100 bg-silver-50 p-5 space-y-4 ${locale === "ko" ? "break-keep" : ""}`}>
      <h3 className="text-sm font-bold text-ink">
        {t.heading} <span className="text-red-500 font-medium">{t.required}</span>
      </h3>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-xs">
        {t.rows.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="font-semibold text-ink-muted whitespace-nowrap">{label}</dt>
            <dd className="text-ink-muted">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="text-xs text-ink-subtle leading-relaxed">
        {t.refusal}{" "}
        <Link href={PRIVACY_PATH[locale]} target="_blank" className="underline hover:text-ink-muted">
          {t.viewPolicy}
        </Link>
      </p>
      <label className="flex items-start gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          name="privacyConsent"
          required
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-accent flex-shrink-0"
        />
        <span className="text-sm font-medium text-ink">
          {t.checkbox} <span className="text-red-500">*</span>
        </span>
      </label>
    </section>
  );
}
