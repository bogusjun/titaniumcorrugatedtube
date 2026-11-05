import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth";
import { cancelOrderByAdmin } from "@/lib/shop/orders";
import { errorResponse } from "@/lib/shop/http";

// 주문 취소 + (결제된 경우) 포트원 전액 환불: { reason, restock }
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const { reason, restock } = await req.json();
    const result = await cancelOrderByAdmin(id, String(reason ?? ""), restock !== false);
    return NextResponse.json(result);
  } catch (err) {
    return errorResponse(err);
  }
}
