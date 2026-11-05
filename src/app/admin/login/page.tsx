"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "로그인하지 못했습니다.");
        return;
      }
      router.push("/admin/orders");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-white rounded-2xl border border-silver-100 p-8">
        <Lock className="w-8 h-8 text-accent mb-4" />
        <h1 className="text-xl font-bold mb-1">관리자 로그인</h1>
        <p className="text-sm text-ink-muted mb-6">ATX 티타늄 주름관 온라인 구매 관리</p>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          autoFocus
          className="w-full px-4 py-2.5 rounded-lg border border-silver-100 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
        />
        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
        <button type="submit" disabled={loading || !password} className="btn-primary w-full justify-center disabled:opacity-50">
          {loading ? "확인 중…" : "로그인"}
        </button>
      </form>
    </div>
  );
}
