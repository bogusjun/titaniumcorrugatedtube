'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Suspense } from 'react';

interface Product {
  id: string;
  name: string;
  slug: string;
}

interface InventoryItem {
  id: string;
  product_id: string;
  size: string;
  quantity: number;
  products?: { id: string; name: string; slug: string };
}

interface GroupedInventory {
  product: Product;
  items: InventoryItem[];
  total: number;
}

function InventoryContent({ products }: { products: Product[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId') ?? '';

  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    const url = productId
      ? `/api/admin/inventory?productId=${productId}`
      : '/api/admin/inventory';
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json() as InventoryItem[];
      setInventory(data);
    }
    setLoading(false);
  }, [productId]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  async function handleQuantityBlur(item: InventoryItem, newQty: number) {
    if (newQty === item.quantity) return;
    if (newQty < 0) return;
    setSaving(item.id);
    await fetch('/api/admin/inventory', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, quantity: newQty }),
    });
    setInventory((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, quantity: newQty } : i))
    );
    setSaving(null);
  }

  // 상품별 그룹핑
  const grouped: GroupedInventory[] = (() => {
    const map = new Map<string, GroupedInventory>();
    for (const item of inventory) {
      const pid = item.product_id;
      if (!map.has(pid)) {
        const product =
          products.find((p) => p.id === pid) ??
          (item.products
            ? { id: pid, name: item.products.name, slug: item.products.slug }
            : { id: pid, name: pid, slug: '' });
        map.set(pid, { product, items: [], total: 0 });
      }
      const group = map.get(pid)!;
      group.items.push(item);
      group.total += item.quantity;
    }
    return Array.from(map.values()).sort((a, b) =>
      a.product.name.localeCompare(b.product.name)
    );
  })();

  function handleProductFilter(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      params.set('productId', e.target.value);
    } else {
      params.delete('productId');
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <>
      {/* 상품 드롭다운 필터 */}
      <div className="mb-6">
        <select
          value={productId}
          onChange={handleProductFilter}
          className="border border-[#E8E4DC] rounded px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] transition-colors bg-white"
        >
          <option value="">전체 상품</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-[#999]">불러오는 중...</p>
      ) : grouped.length === 0 ? (
        <p className="text-sm text-[#999]">재고 데이터가 없습니다.</p>
      ) : (
        <div className="space-y-6">
          {grouped.map(({ product, items, total }) => (
            <div key={product.id} className="bg-white border border-[#E8E4DC] rounded-lg p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-sm font-semibold text-[#1a1a1a]">{product.name}</h2>
                  <p className="text-xs text-[#999] mt-0.5">{product.slug}</p>
                </div>
                {total === 0 ? (
                  <span className="text-xs font-medium bg-red-50 text-red-500 border border-red-200 px-2 py-1 rounded">
                    재고 없음
                  </span>
                ) : (
                  <span className="text-xs text-[#999]">총 {total}개</span>
                )}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {items
                  .sort((a, b) => {
                    const na = parseInt(a.size);
                    const nb = parseInt(b.size);
                    return na - nb;
                  })
                  .map((item) => {
                    const isLow = item.quantity <= 3;
                    return (
                      <div key={item.id} className="text-center">
                        <p className="text-xs text-[#999] mb-1">{item.size}</p>
                        <input
                          type="number"
                          defaultValue={item.quantity}
                          min={0}
                          onBlur={(e) =>
                            handleQuantityBlur(item, parseInt(e.target.value) || 0)
                          }
                          className={`w-full text-center border rounded px-1 py-1.5 text-sm focus:outline-none transition-colors ${
                            isLow
                              ? 'border-red-400 focus:border-red-500 text-red-600'
                              : 'border-[#E8E4DC] focus:border-[#1a1a1a] text-[#1a1a1a]'
                          } ${saving === item.id ? 'opacity-50' : ''}`}
                        />
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default function InventoryClient({ products }: { products: Product[] }) {
  return (
    <Suspense fallback={<p className="text-sm text-[#999]">불러오는 중...</p>}>
      <InventoryContent products={products} />
    </Suspense>
  );
}
