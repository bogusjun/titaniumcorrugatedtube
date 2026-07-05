import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase';

interface InventoryUpsertItem {
  product_id: string;
  size: string;
  quantity: number;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  if (!(await checkAdminAuth(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('productId');

  let query = supabaseAdmin
    .from('inventory')
    .select('*, products(id, name, slug)')
    .order('size');

  if (productId) {
    query = query.eq('product_id', productId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  if (!(await checkAdminAuth(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, quantity } = await req.json() as { id: string; quantity: number };

  if (!id || quantity === undefined) {
    return NextResponse.json({ error: 'id와 quantity가 필요합니다.' }, { status: 400 });
  }

  if (quantity < 0) {
    return NextResponse.json({ error: 'quantity는 0 이상이어야 합니다.' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('inventory')
    .update({ quantity })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!(await checkAdminAuth(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const items = await req.json() as InventoryUpsertItem[];

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: '빈 배열입니다.' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('inventory')
    .upsert(items, { onConflict: 'product_id,size' })
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
