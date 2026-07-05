import type { Metadata } from "next";
import { Calendar, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "News & Updates",
  description: "ATX Titanium exhibitions, new product launches, and company announcements.",
};

const news = [
  {
    id: 1,
    category: "Exhibition",
    title: "2025 Incheon INCHEM KOREA Exhibition — ATX Participation Notice",
    date: "2025-11-05",
    excerpt:
      "ATX will participate in INCHEM KOREA 2025, held at Incheon Songdo Convensia. Come and see our latest titanium corrugated tube lineup and heat exchanger solutions in person.",
    tag: "Exhibition",
    tagColor: "bg-accent/10 text-accent",
    image: "/images/products/tube-coil.jpg",
  },
  {
    id: 2,
    category: "New Product",
    title: "Grade 9 (Ti-3Al-2.5V) Braided Corrugated Tube Now Available",
    date: "2025-09-15",
    excerpt:
      "Responding to demand from aerospace and defense customers, we have launched the Ti-3Al-2.5V (Grade 9) braided corrugated tube — offering 30% higher strength than commercially pure titanium.",
    tag: "New Product",
    tagColor: "bg-green-100 text-green-700",
    image: "/images/products/tube-3.jpg",
  },
  {
    id: 3,
    category: "News",
    title: "2025 WEFTEC (Chicago, USA) Participation Report",
    date: "2025-10-20",
    excerpt:
      "We participated in WEFTEC 2025, the world's largest water treatment and environmental industry exhibition, introducing our titanium corrugated tube solutions to North American customers.",
    tag: "Exhibition",
    tagColor: "bg-accent/10 text-accent",
    image: "/images/products/heat-exchanger.jpg",
  },
  {
    id: 4,
    category: "Certification",
    title: "ISO 9001:2015 Certification Renewal Completed",
    date: "2025-08-01",
    excerpt:
      "ATX has successfully renewed its ISO 9001:2015 Quality Management System certification. We will continue striving for continuous quality improvement and customer satisfaction.",
    tag: "Certification",
    tagColor: "bg-amber-100 text-amber-700",
    image: "/images/products/tube-drawing.png",
  },
  {
    id: 5,
    category: "Delivery Case",
    title: "500 m HF Transfer Piping Supply Completed for Domestic Semiconductor FAB",
    date: "2025-06-30",
    excerpt:
      "Successfully completed the HF transfer piping replacement project for the cleaning process at a major domestic semiconductor manufacturer. 500 m of Grade 1 titanium corrugated tube delivered.",
    tag: "Delivery Case",
    tagColor: "bg-purple-100 text-purple-700",
    image: "/images/products/tube-1.jpg",
  },
  {
    id: 6,
    category: "Notice",
    title: "Summer Holiday Production & Shipping Schedule Notice",
    date: "2025-09-01",
    excerpt:
      "We are announcing the production and shipping schedule during the summer holiday period. Please contact us in advance for any urgent orders.",
    tag: "Notice",
    tagColor: "bg-silver-100 text-ink-muted",
    image: null,
  },
];

export default function EnNewsPage() {
  return (
    <div className="pt-20 min-h-screen bg-silver-50">
      <div className="bg-ti-950 py-20">
        <div className="container-pad">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">
            News & Notice
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-silver-200 mb-4">
            News & Updates
          </h1>
          <p className="text-silver-500 text-lg max-w-2xl">
            Stay up to date with ATX — exhibitions, new product launches, delivery cases, and more.
          </p>
        </div>
      </div>

      <div className="container-pad py-12">
        <div className="flex flex-wrap gap-2 mb-10">
          {["All", "Exhibition", "New Product", "Delivery Case", "Certification", "Notice"].map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                cat === "All"
                  ? "bg-ti-950 text-silver-200"
                  : "bg-white text-ink-muted border border-silver-100 hover:bg-silver-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item, i) => (
            <ScrollReveal key={item.id} delay={i * 60}>
              <article className="bg-white border border-silver-100 rounded-xl shadow-ti-sm overflow-hidden group hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
                {item.image && (
                  <div className="relative h-44 overflow-hidden bg-silver-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ti-950/30 to-transparent" />
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${item.tagColor}`}>
                      {item.tag}
                    </span>
                    <div className="flex items-center gap-1 text-ink-subtle text-xs">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </div>
                  </div>

                  <h2 className="font-bold text-ink text-base mb-2 leading-snug group-hover:text-accent transition-colors line-clamp-2">
                    {item.title}
                  </h2>

                  <p className="text-ink-muted text-sm leading-relaxed line-clamp-3 mb-4">
                    {item.excerpt}
                  </p>

                  <div className="flex items-center text-accent text-sm font-semibold hover:gap-2 gap-1 transition-all">
                    Read More <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>

        <div className="text-center mt-10">
          <button className="btn-dark">
            Load More
          </button>
        </div>
      </div>
    </div>
  );
}
