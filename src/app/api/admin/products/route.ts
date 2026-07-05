import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest): Promise<NextResponse> {
  if (!(await checkAdminAuth(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!(await checkAdminAuth(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  const {
    slug, name, name_en, tagline, description, long_description,
    price, images, specs, external_url, is_new, is_bestseller, is_active,
  } = body;

  if (!slug || !name) {
    return NextResponse.json({ error: 'slug와 name은 필수입니다.' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('products')
    .insert({
      slug,
      name,
      name_en: name_en ?? '',
      tagline: tagline ?? '',
      description: description ?? '',
      long_description: long_description ?? '',
      price: price ?? 0,
      images: images ?? [],
      specs: specs ?? [],
      external_url: external_url ?? null,
      is_new: is_new ?? false,
      is_bestseller: is_bestseller ?? false,
      is_active: is_active ?? true,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
