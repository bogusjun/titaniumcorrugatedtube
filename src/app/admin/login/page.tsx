'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        const data = await res.json() as { error?: string };
        setError(data.error ?? '로그인에 실패했습니다.');
      }
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <p className="text-xs tracking-widest uppercase text-[#999] mb-2">ATX Admin</p>
          <h1 className="text-xl font-semibold text-[#1a1a1a]">관리자 로그인</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-[#E8E4DC] rounded-lg p-8">
          <div className="mb-5">
            <label className="block text-xs tracking-widest uppercase text-[#999] mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="관리자 비밀번호 입력"
              required
              autoFocus
              className="w-full border border-[#E8E4DC] rounded px-3 py-2.5 text-sm text-[#1a1a1a] placeholder-[#bbb] focus:outline-none focus:border-[#1a1a1a] transition-colors"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 mb-4">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a1a1a] text-white text-sm font-medium py-2.5 rounded hover:bg-[#333] disabled:opacity-50 transition-colors"
          >
            {loading ? '확인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
}
