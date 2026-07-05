import { checkAdminAuthFromCookies } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';
import InventoryClient from './InventoryClient';

interface Product {
  id: string;
  name: string;
  slug: string;
}

async function getProducts(): Promise<Product[]> {
  const { data } = await supabaseAdmin
    .from('products')
    .select('id, name, slug')
    .eq('is_active', true)
    .order('name');
  return (data ?? []) as Product[];
}

export default async function InventoryPage() {
  const isAuth = await checkAdminAuthFromCookies();
  if (!isAuth) redirect('/admin/login');

  const products = await getProducts();

  return (
    <>
      <AdminNav />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="text-xs tracking-widest uppercase text-[#999] mb-1">Inventory</p>
          <h1 className="text-2xl font-semibold text-[#1a1a1a]">재고 관리</h1>
        </div>
        <InventoryClient products={products} />
      </main>
    </>
  );
}
