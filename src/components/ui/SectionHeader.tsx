"use client";

import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  label?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  light?: boolean;
  className?: string;
}

export default function SectionHeader({
  label,
  title,
  subtitle,
  center = true,
  light = false,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn(center ? "text-center" : "", className)}>
      {label && (
        <span className="section-label justify-center">
          <span className="w-5 h-px bg-accent" />
          {label}
          <span className="w-5 h-px bg-accent" />
        </span>
      )}
      <h2 className={cn(
        "text-3xl md:text-4xl font-black mb-4 tracking-tight",
        light ? "text-silver-200" : "text-ink"
      )}>
        {title}
      </h2>
      {subtitle && (
        <p className={cn(
          "text-lg leading-relaxed",
          center ? "max-w-2xl mx-auto" : "max-w-2xl",
          light ? "text-silver-500" : "text-ink-muted"
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
