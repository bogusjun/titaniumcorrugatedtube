'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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

export default function ProductsTable({ products: initial }: { products: Product[] }) {
  const [products, setProducts] = useState(initial);
  const [toggling, setToggling] = useState<string | null>(null);

  async function toggleActive(id: string, current: boolean) {
    setToggling(id);
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !current }),
    });
    if (res.ok) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_active: !current } : p))
      );
    }
    setToggling(null);
  }

  if (products.length === 0) {
    return (
      <div className="bg-white border border-[#E8E4DC] rounded-lg p-12 text-center">
        <p className="text-[#999] text-sm">등록된 상품이 없습니다.</p>
        <Link
          href="/admin/products/new"
          className="mt-4 inline-block text-sm text-[#1a1a1a] underline underline-offset-2"
        >
          첫 상품 등록하기
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E8E4DC] rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#E8E4DC]">
            <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-[#999] font-medium w-16">
              썸네일
            </th>
            <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-[#999] font-medium">
              상품명
            </th>
            <th className="text-right px-4 py-3 text-xs tracking-widest uppercase text-[#999] font-medium">
              가격
            </th>
            <th className="text-center px-4 py-3 text-xs tracking-widest uppercase text-[#999] font-medium">
              뱃지
            </th>
            <th className="text-center px-4 py-3 text-xs tracking-widest uppercase text-[#999] font-medium">
              노출
            </th>
            <th className="text-center px-4 py-3 text-xs tracking-widest uppercase text-[#999] font-medium">
              관리
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const thumb = product.images[0];
            return (
              <tr
                key={product.id}
                className={`border-b border-[#E8E4DC] last:border-0 ${
                  !product.is_active ? 'opacity-50' : ''
                }`}
              >
                <td className="px-4 py-3">
                  <div className="w-10 h-10 bg-[#F8F7F4] rounded overflow-hidden">
                    {thumb ? (
                      <Image
                        src={thumb.src}
                        alt={thumb.alt}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-[#1a1a1a]">{product.name}</p>
                  <p className="text-xs text-[#999] mt-0.5">{product.slug}</p>
                </td>
                <td className="px-4 py-3 text-right text-[#1a1a1a]">
                  {product.price > 0 ? `${product.price.toLocaleString()}원` : '—'}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-flex gap-1">
                    {product.is_new && (
                      <span className="text-[10px] font-semibold bg-[#1a1a1a] text-white px-1.5 py-0.5 rounded">
                        N
                      </span>
                    )}
                    {product.is_bestseller && (
                      <span className="text-[10px] font-semibold bg-amber-500 text-white px-1.5 py-0.5 rounded">
                        B
                      </span>
                    )}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => toggleActive(product.id, product.is_active)}
                    disabled={toggling === product.id}
                    className={`relative w-10 h-5 rounded-full transition-colors focus:outline-none ${
                      product.is_active ? 'bg-[#1a1a1a]' : 'bg-[#E8E4DC]'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                        product.is_active ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-xs text-[#666] hover:text-[#1a1a1a] underline underline-offset-2"
                    >
                      수정
                    </Link>
                    <Link
                      href={`/admin/inventory?productId=${product.id}`}
                      className="text-xs text-[#666] hover:text-[#1a1a1a] underline underline-offset-2"
                    >
                      재고
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
