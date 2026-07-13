import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: {
    default: 'ATX Admin',
    template: '%s | ATX Admin',
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{ fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif" }}
      className="min-h-screen bg-[#F8F7F4]"
    >
      {children}
    </div>
  );
}
