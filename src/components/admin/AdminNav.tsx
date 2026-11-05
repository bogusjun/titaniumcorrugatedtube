"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin/orders", label: "주문 관리" },
  { href: "/admin/items", label: "판매 품목·재고" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
  };
  return (
    <header className="bg-ti-950 text-silver-200">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-6">
        <span className="font-bold text-sm">ATX 주름관 관리자</span>
        <nav className="flex gap-1">
          {items.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              className={cn("px-3 py-1.5 rounded-md text-sm", pathname.startsWith(i.href) ? "bg-ti-800 text-white" : "text-silver-400 hover:text-white")}
            >
              {i.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-4 text-sm">
          <Link href="/" className="text-silver-400 hover:text-white" target="_blank">사이트 보기</Link>
          <button onClick={logout} className="text-silver-400 hover:text-white">로그아웃</button>
        </div>
      </div>
    </header>
  );
}
