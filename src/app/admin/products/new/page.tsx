import { checkAdminAuthFromCookies } from '@/lib/admin-auth';
import { redirect } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';
import ProductForm from '@/components/admin/ProductForm';

export default async function NewProductPage() {
  const isAuth = await checkAdminAuthFromCookies();
  if (!isAuth) redirect('/admin/login');

  return (
    <>
      <AdminNav />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="text-xs tracking-widest uppercase text-[#999] mb-1">Products / New</p>
          <h1 className="text-2xl font-semibold text-[#1a1a1a]">상품 등록</h1>
        </div>
        <ProductForm mode="new" />
      </main>
    </>
  );
}
