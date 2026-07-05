import { checkAdminAuthFromCookies } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase';
import { redirect, notFound } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';
import ProductForm from '@/components/admin/ProductForm';

type Params = Promise<{ id: string }>;

async function getProduct(id: string) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data;
}

export default async function EditProductPage({ params }: { params: Params }) {
  const isAuth = await checkAdminAuthFromCookies();
  if (!isAuth) redirect('/admin/login');

  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  return (
    <>
      <AdminNav />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="text-xs tracking-widest uppercase text-[#999] mb-1">Products / Edit</p>
          <h1 className="text-2xl font-semibold text-[#1a1a1a]">{product.name}</h1>
        </div>
        <ProductForm mode="edit" productId={id} initialData={product} />
      </main>
    </>
  );
}
