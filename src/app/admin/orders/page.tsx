import { checkAdminAuthFromCookies } from '@/lib/admin-auth';
import { redirect } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';
import OrdersClient from './OrdersClient';

export default async function OrdersPage() {
  const isAuth = await checkAdminAuthFromCookies();
  if (!isAuth) redirect('/admin/login');

  return (
    <>
      <AdminNav />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="text-xs tracking-widest uppercase text-[#999] mb-1">Orders</p>
          <h1 className="text-2xl font-semibold text-[#1a1a1a]">주문 목록</h1>
        </div>
        <OrdersClient />
      </main>
    </>
  );
}
