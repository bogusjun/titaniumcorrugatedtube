import { supabaseAdmin } from '@/lib/supabase';
import { checkAdminAuthFromCookies } from '@/lib/admin-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import AdminNav from '@/components/admin/AdminNav';

async function getStats() {
  const [productsRes, ordersRes, inventoryRes] = await Promise.all([
    supabaseAdmin.from('products').select('id', { count: 'exact' }).eq('is_active', true),
    supabaseAdmin.from('orders').select('id', { count: 'exact' }),
    supabaseAdmin.from('inventory').select('quantity').lte('quantity', 3),
  ]);

  return {
    products: productsRes.count ?? 0,
    orders: ordersRes.count ?? 0,
    lowStock: inventoryRes.data?.length ?? 0,
  };
}

const SHORTCUTS = [
  { href: '/admin/products/new', label: '상품 등록', desc: '새 상품 추가' },
  { href: '/admin/products', label: '상품 목록', desc: '전체 상품 보기' },
  { href: '/admin/inventory', label: '재고 관리', desc: '사이즈별 수량' },
  { href: '/admin/orders', label: '주문 목록', desc: '주문 현황 확인' },
];

export default async function AdminDashboardPage() {
  const isAuth = await checkAdminAuthFromCookies();
  if (!isAuth) redirect('/admin/login');

  const stats = await getStats();

  return (
    <>
      <AdminNav />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="text-xs tracking-widest uppercase text-[#999] mb-1">Dashboard</p>
          <h1 className="text-2xl font-semibold text-[#1a1a1a]">관리자 대시보드</h1>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <StatCard label="등록 상품" value={stats.products} unit="개" />
          <StatCard label="전체 주문" value={stats.orders} unit="건" />
          <StatCard
            label="재고 부족"
            value={stats.lowStock}
            unit="항목"
            highlight={stats.lowStock > 0}
          />
        </div>

        {/* 바로가기 메뉴 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {SHORTCUTS.map(({ href, label, desc }) => (
            <Link
              key={href}
              href={href}
              className="bg-white border border-[#E8E4DC] rounded-lg p-5 hover:border-[#1a1a1a] hover:shadow-sm transition-all group"
            >
              <p className="text-sm font-semibold text-[#1a1a1a] group-hover:text-[#333] mb-1">
                {label}
              </p>
              <p className="text-xs text-[#999]">{desc}</p>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

function StatCard({
  label,
  value,
  unit,
  highlight,
}: {
  label: string;
  value: number;
  unit: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`bg-white border rounded-lg px-6 py-5 ${
        highlight ? 'border-red-300' : 'border-[#E8E4DC]'
      }`}
    >
      <p className="text-xs tracking-widest uppercase text-[#999] mb-3">{label}</p>
      <p className={`text-3xl font-semibold ${highlight ? 'text-red-500' : 'text-[#1a1a1a]'}`}>
        {value.toLocaleString()}
        <span className="text-sm font-normal text-[#999] ml-1">{unit}</span>
      </p>
    </div>
  );
}
