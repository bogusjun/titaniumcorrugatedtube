import { supabaseAdmin } from '@/lib/supabase';
import { checkAdminAuthFromCookies } from '@/lib/admin-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import AdminNav from '@/components/admin/AdminNav';
import ProductsTable from './ProductsTable';

interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  images: { src: string; alt: string }[];
  is_new: boolean;
  is_bestseller: boolean;
  is_active: boolean;
  created_at: string;
}

async function getProducts(): Promise<Product[]> {
  const { data } = await supabaseAdmin
    .from('products')
    .select('id, slug, name, price, images, is_new, is_bestseller, is_active, created_at')
    .order('created_at', { ascending: false });
  return (data ?? []) as Product[];
}

export default async function AdminProductsPage() {
  const isAuth = await checkAdminAuthFromCookies();
  if (!isAuth) redirect('/admin/login');

  const products = await getProducts();

  return (
    <>
      <AdminNav />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs tracking-widest uppercase text-[#999] mb-1">Products</p>
            <h1 className="text-2xl font-semibold text-[#1a1a1a]">상품 목록</h1>
          </div>
          <Link
            href="/admin/products/new"
            className="bg-[#1a1a1a] text-white text-sm font-medium px-4 py-2 rounded hover:bg-[#333] transition-colors"
          >
            + 상품 등록
          </Link>
        </div>

        <ProductsTable products={products} />
      </main>
    </>
  );
}
