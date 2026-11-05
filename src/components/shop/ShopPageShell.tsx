/** 장바구니·결제·주문 조회 화면 공통 머리말 */
export default function ShopPageShell({ label, title, desc, children }: { label: string; title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="pt-20 min-h-screen bg-silver-50">
      <div className="bg-ti-950 py-12">
        <div className="container-pad">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">{label}</p>
          <h1 className="text-3xl md:text-4xl font-black text-silver-200">{title}</h1>
          {desc && <p className="text-silver-500 mt-3 max-w-2xl">{desc}</p>}
        </div>
      </div>
      <div className="container-pad py-10">{children}</div>
    </div>
  );
}
