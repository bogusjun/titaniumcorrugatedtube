import type { LegalLocale, PolicyBlock, PolicyDoc } from "./types";

function Block({ block }: { block: PolicyBlock }) {
  if ("p" in block) {
    return <p className="text-sm text-ink-muted leading-relaxed">{block.p}</p>;
  }
  if ("ul" in block) {
    return (
      <ul className="space-y-2">
        {block.ul.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm text-ink-muted leading-relaxed">
            <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-2" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div className="overflow-x-auto rounded-lg border border-silver-100">
      <table className="w-full min-w-[520px] text-sm">
        <thead className="bg-silver-50">
          <tr>
            {block.table.head.map((h) => (
              <th key={h} className="text-left font-semibold text-ink px-4 py-2.5 border-b border-silver-100">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.table.rows.map((row) => (
            <tr key={row[0]} className="border-b border-silver-100 last:border-b-0 align-top">
              {row.map((cell, i) => (
                <td key={i} className={i === 0 ? "px-4 py-3 font-medium text-ink min-w-[7rem]" : "px-4 py-3 text-ink-muted leading-relaxed"}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** 개인정보처리방침·이용약관 공용 화면 */
export default function LegalDocument({
  locale,
  doc,
  effectiveDate,
}: {
  locale: LegalLocale;
  doc: PolicyDoc;
  effectiveDate: string;
}) {
  const headingFormat = doc.headingFormat ?? "{n}. {title}";

  return (
    <div className="pt-20 min-h-screen bg-silver-50">
      <div className="bg-ti-950 py-16">
        <div className="container-pad">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">{doc.eyebrow}</p>
          <h1 className="text-4xl md:text-5xl font-black text-silver-200 mb-4">{doc.title}</h1>
          <p className="text-silver-500 text-lg max-w-2xl">{doc.lead}</p>
        </div>
      </div>

      <div className="container-pad py-12">
        {/* 국문은 어절 단위로 줄바꿈 — 일문은 띄어쓰기가 없어 넘치므로 제외 */}
        <article className={`max-w-3xl mx-auto bg-white rounded-2xl border border-silver-100 p-6 md:p-10 space-y-10 ${locale === "ko" ? "break-keep" : ""}`}>
          <div className="space-y-3">
            <p className="text-sm text-ink-muted leading-relaxed">{doc.intro}</p>
            <p className="text-xs text-ink-subtle">
              {doc.effectiveLabel}: {effectiveDate}
            </p>
            {doc.translationNote && <p className="text-xs text-ink-subtle">{doc.translationNote}</p>}
          </div>

          {doc.sections.map((section, i) => (
            <section key={section.title} id={section.id} className="space-y-3 scroll-mt-28">
              <h2 className="text-lg font-bold text-ink">
                {headingFormat.replace("{n}", String(i + 1)).replace("{title}", section.title)}
              </h2>
              {section.blocks.map((block, j) => (
                <Block key={j} block={block} />
              ))}
            </section>
          ))}

          {doc.closing && (
            <p className="text-sm text-ink-muted leading-relaxed pt-6 border-t border-silver-100">{doc.closing}</p>
          )}
        </article>
      </div>
    </div>
  );
}
