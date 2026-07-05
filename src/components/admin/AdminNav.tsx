'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/products', label: '상품 관리' },
  { href: '/admin/inventory', label: '재고 관리' },
  { href: '/admin/orders', label: '주문 목록' },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/login', { method: 'DELETE' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <header className="bg-white border-b border-[#E8E4DC] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 flex items-center h-14 gap-6">
        <span className="text-xs tracking-widest uppercase font-semibold text-[#1a1a1a] shrink-0">
          ATX Admin
        </span>

        <nav className="flex items-center gap-1 flex-1">
          {NAV_ITEMS.map(({ href, label, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                  active
                    ? 'bg-[#1a1a1a] text-white'
                    : 'text-[#666] hover:text-[#1a1a1a] hover:bg-[#F8F7F4]'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="text-xs text-[#999] hover:text-[#1a1a1a] transition-colors"
        >
          로그아웃
        </button>
      </div>
    </header>
  );
}
