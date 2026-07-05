import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, Download, FileText, ChevronDown } from "lucide-react";
import EnContactForm from "./ContactForm";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Contact & Support",
  description: "Titanium corrugated tube quote requests, technical document downloads, and FAQ.",
};

const faqs = [
  {
    q: "Is there a minimum order quantity (MOQ)?",
    a: "Standard stock items have no MOQ — order from a single piece. Custom products are determined through separate consultation.",
  },
  {
    q: "What is the typical lead time?",
    a: "Standard stock items ship same day. Manufactured items generally take 2–4 weeks. Please contact us separately for urgent orders.",
  },
  {
    q: "Which grade should I choose?",
    a: "We recommend Grade 2 for general chemical and marine piping, Grade 1 for semiconductor and medical, and Grade 7 (Pd alloy) for HCl and H₂SO₄ environments. The optimal grade is determined through technical consultation.",
  },
  {
    q: "Can you manufacture custom specifications?",
    a: "Yes, we custom-manufacture all sizes from 6A to 100A based on your drawings. We also accommodate special connection methods, non-standard lengths, and customer certification requirements.",
  },
  {
    q: "Can I receive a Mill Certificate / Test Report?",
    a: "All products come with an EN 10204 3.1 mill sheet and product test report. Third-party inspection is also available upon request.",
  },
  {
    q: "Do you export internationally?",
    a: "We have export experience to more than 20 countries. We provide full export documentation support (C/O, Packing List, etc.).",
  },
];

const downloads = [
  { name: "Product Catalog (English)",  size: "7.8 MB", type: "PDF" },
  { name: "Product Catalog (Korean)",   size: "8.2 MB", type: "PDF" },
  { name: "Specification Table (All Products)", size: "1.2 MB", type: "PDF" },
  { name: "ISO 9001 Certificate",       size: "0.3 MB", type: "PDF" },
  { name: "Titanium Grade Properties",  size: "0.5 MB", type: "PDF" },
  { name: "Installation & Maintenance Guide", size: "2.1 MB", type: "PDF" },
];

export default function EnSupportPage() {
  return (
    <div className="pt-20 min-h-screen bg-silver-50">
      <div className="bg-ti-950 py-20">
        <div className="container-pad">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">
            Customer Support
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-silver-200 mb-4">
            Contact & Support
          </h1>
          <p className="text-silver-500 text-lg max-w-2xl">
            Quote requests, technical consultation, document downloads — feel free to reach out about anything.
          </p>
        </div>
      </div>

      <div className="container-pad py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2">
            <ScrollReveal>
              <div className="bg-white rounded-2xl border border-silver-100 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-ink mb-2">Quote & Inquiry Form</h2>
                <p className="text-ink-subtle text-sm mb-8">
                  The more detailed specifications you provide, the more accurate our quote will be.
                </p>
                <EnContactForm />
              </div>
            </ScrollReveal>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <ScrollReveal delay={100}>
              <div className="bg-ti-950 rounded-2xl p-6">
                <h3 className="font-bold text-silver-200 text-lg mb-5">Contact Information</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-silver-500 text-xs mb-0.5">Phone</p>
                      <a href="tel:+82-1544-1909" className="text-silver-200 hover:text-accent transition-colors font-medium">
                        +82-1544-1909
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-silver-500 text-xs mb-0.5">Email Address</p>
                      <a href="mailto:777@atx.kr" className="text-silver-200 hover:text-accent transition-colors font-medium text-xs">
                        777@atx.kr
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-silver-500 text-xs mb-0.5">Address</p>
                      <p className="text-silver-200 leading-relaxed">
                        44-gil 2, Beonyeong-ro, Danwon-gu<br />
                        Ansan-si, Gyeonggi-do, Korea
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-silver-500 text-xs mb-0.5">Business Hours</p>
                      <p className="text-silver-200">Mon–Fri 09:00–18:00 KST</p>
                      <p className="text-silver-500 text-xs">Closed on weekends and public holidays</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Downloads */}
            <ScrollReveal delay={150}>
              <div className="bg-white rounded-2xl border border-silver-100 shadow-sm p-6">
                <h3 className="font-bold text-ink text-lg mb-4">Technical Document Downloads</h3>
                <div className="space-y-2">
                  {downloads.map((doc) => (
                    <a
                      key={doc.name}
                      href="#"
                      download
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-silver-50 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-red-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink-muted group-hover:text-accent transition-colors truncate">
                          {doc.name}
                        </p>
                        <p className="text-xs text-ink-subtle">{doc.type} · {doc.size}</p>
                      </div>
                      <Download className="w-4 h-4 text-ink-subtle group-hover:text-accent transition-colors flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* FAQ */}
        <ScrollReveal delay={100}>
          <div className="mt-16 bg-white rounded-2xl border border-silver-100 shadow-sm overflow-hidden">
            <div className="bg-ti-950 px-8 py-5">
              <h2 className="text-silver-200 font-bold text-xl">Frequently Asked Questions (FAQ)</h2>
            </div>
            <div className="divide-y divide-silver-100">
              {faqs.map((faq, i) => (
                <details key={i} className="group px-8 py-5 cursor-pointer">
                  <summary className="flex items-center justify-between list-none font-semibold text-ink text-sm">
                    <span className="pr-4">Q. {faq.q}</span>
                    <ChevronDown className="w-5 h-5 text-ink-subtle flex-shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-ink-muted text-sm leading-relaxed pl-4 border-l-2 border-accent">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
