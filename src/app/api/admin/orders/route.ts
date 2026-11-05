import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth";
import { listOrders, updateOrderByAdmin } from "@/lib/shop/orders";
import { errorResponse } from "@/lib/shop/http";

const LIMIT = 20;

export async function GET(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const sp = req.nextUrl.searchParams;
    const page = Math.max(1, parseInt(sp.get("page") ?? "1") || 1);
    const { data, total } = await listOrders({
      status: sp.get("status") ?? "active",
      q: sp.get("q") ?? "",
      page,
      limit: LIMIT,
    });
    return NextResponse.json({ data, total, page, limit: LIMIT });
  } catch (err) {
    return errorResponse(err);
  }
}

// 배송 상태·송장·메모 변경: { id, status?, courier?, trackingNumber?, adminMemo? }
export async function PATCH(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id, status, courier, trackingNumber, adminMemo } = await req.json();
    const order = await updateOrderByAdmin(String(id), { status, courier, trackingNumber, adminMemo });
    return NextResponse.json(order);
  } catch (err) {
    return errorResponse(err);
  }
}
