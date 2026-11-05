/**
 * 홈페이지 이용약관 (ko/en/ja)
 *
 * 회원가입 없는 B2B 정보·견적 문의 사이트 + 일부 제품(표준품·소켓) 비회원 온라인 구매(국문만) 기준이다.
 * 구매 조항의 배송비·무료 기준은 @/lib/shop/config 값을 그대로 쓴다. 국문이 기준본 — 내용을 바꾸면 영문·일문도 고치고
 * TERMS_EFFECTIVE_DATE 와 부칙 날짜를 새 시행일로 올린다(이용자에게 불리한 변경은 30일 전 공지).
 */

import type { LegalLocale, PolicyDoc } from "./types";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, SHOP_CONTACT } from "@/lib/shop/config";

const won = (n: number) => n.toLocaleString("ko-KR");

// 2026-11-12: 온라인 구매 조항 신설 (공지 7일)
export const TERMS_EFFECTIVE_DATE = "2026-11-12";

export const TERMS: Record<LegalLocale, PolicyDoc> = {
  ko: {
    eyebrow: "Terms of Use",
    title: "이용약관",
    lead: "티타늄 주름관 홈페이지를 이용할 때 지켜야 할 조건을 안내합니다.",
    intro:
      "이 약관은 (주)에이티엑스(ATX Co., Ltd., 사업자등록번호 131-86-09143, 이하 「회사」)가 운영하는 티타늄 주름관 홈페이지(tube.atx.kr, 이하 「홈페이지」)의 이용 조건을 정합니다.",
    effectiveLabel: "시행일",
    headingFormat: "제{n}조 ({title})",
    sections: [
      {
        title: "목적",
        blocks: [
          { p: "이 약관은 회사가 홈페이지에서 제공하는 정보와 견적 문의 기능, 일부 제품의 온라인 구매에 관한 이용 조건, 회사와 이용자의 권리·의무 및 책임을 정하는 것을 목적으로 합니다." },
        ],
      },
      {
        title: "정의",
        blocks: [
          {
            ul: [
              "「이용자」란 홈페이지에 접속하여 이 약관에 따라 회사가 제공하는 정보와 기능을 이용하는 개인 또는 법인을 말합니다.",
              "「견적 문의」란 이용자가 견적 문의 양식, 이메일 또는 전화로 제품 견적이나 기술 상담을 요청하는 것을 말합니다.",
              "「온라인 구매」란 이용자가 홈페이지에서 회사가 온라인 판매로 표시한 제품을 골라 결제하는 것을 말하며, 이때의 이용자를 「구매자」라 합니다.",
            ],
          },
        ],
      },
      {
        title: "약관의 게시와 변경",
        blocks: [
          {
            ul: [
              "회사는 이 약관을 홈페이지에 게시하며, 이용자는 홈페이지를 이용함으로써 이 약관에 동의한 것으로 봅니다.",
              "회사는 관련 법령을 위반하지 않는 범위에서 약관을 변경할 수 있습니다. 변경할 때는 적용일과 변경 내용을 적용일 7일 전부터 홈페이지에 공지하며, 이용자에게 불리한 변경은 30일 전부터 공지합니다.",
            ],
          },
        ],
      },
      {
        title: "제공하는 서비스",
        blocks: [
          {
            ul: [
              "제품·기술·적용 사례 등 회사와 제품에 관한 정보 제공",
              "견적 문의 접수와 상담",
              "티타늄 주름관 표준품·주름관 소켓 등 일부 제품의 온라인 판매(국문 홈페이지)",
              "그 밖에 회사가 정하는 기능",
            ],
          },
          { p: "홈페이지는 회원가입 없이 무료로 이용할 수 있으며, 온라인 구매도 회원가입 없이 합니다." },
        ],
      },
      {
        title: "견적 문의와 계약",
        blocks: [
          {
            ul: [
              "견적 문의는 계약의 청약이 아니며, 회사의 답변은 별도로 표시하지 않는 한 참고를 위한 안내입니다.",
              "실제 거래 조건(사양, 수량, 가격, 납기, 대금 지급 등)은 회사가 발행한 견적서와 당사자가 합의한 계약서 또는 발주서에 따릅니다.",
              "이용자가 견적 문의와 함께 보낸 도면·기술 정보는 견적과 상담 목적으로만 사용합니다.",
            ],
          },
        ],
      },
      {
        title: "온라인 구매",
        id: "purchase",
        blocks: [
          {
            ul: [
              "대상: 회사가 온라인 판매로 표시한 제품(재고 표준품·소켓 등)만 구매할 수 있습니다. 그 밖의 제품과 대량·맞춤 사양은 제5조의 견적 문의로 거래합니다.",
              "계약 성립: 구매자가 결제를 마치면 계약이 성립합니다. 재고 부족, 가격·표시 오류 등으로 공급할 수 없으면 회사는 지체 없이 알리고 결제 금액 전액을 환불합니다.",
              `가격과 배송비: 표시 가격은 부가가치세를 포함합니다. 배송비는 주문당 ${won(SHIPPING_FEE)}원이며, 제품 금액이 ${won(FREE_SHIPPING_THRESHOLD)}원 이상이면 무료입니다.`,
              "결제: 신용카드·간편결제로 하며 결제대행사(포트원과 연동된 결제대행사)를 통해 처리됩니다. 회사는 카드번호를 저장하지 않습니다. 카드 결제분은 카드 매출전표가 증빙이 되며, 같은 거래에 세금계산서를 따로 발행하지 않습니다.",
              "배송: 결제 확인 후 영업일 기준 1~2일 안에 국내 택배로 출고하고, 출고하면 송장번호를 이메일로 알립니다. 재고 사정 등으로 늦어지면 미리 알립니다.",
              "청약철회(교환·반품): 제품을 받은 날부터 7일 안에 할 수 있습니다. 다만 제품을 사용했거나 절단·가공·조립하여 가치가 현저히 줄어든 경우, 구매자의 요청에 따라 따로 제작한 경우 등 「전자상거래 등에서의 소비자보호에 관한 법률」 제17조제2항에 해당하면 청약철회가 제한됩니다.",
              "표시·광고와 다른 경우: 제품이 표시·광고 내용과 다르거나 계약과 다르게 이행된 경우에는 받은 날부터 3개월 안에, 그 사실을 안 날 또는 알 수 있었던 날부터 30일 안에 청약철회할 수 있습니다.",
              "반품 비용: 단순 변심에 따른 반품 배송비는 구매자가, 제품 하자·오배송에 따른 반품·교환 비용은 회사가 부담합니다.",
              "환불: 반품된 제품을 받은 날부터 3영업일 안에 결제를 취소합니다. 카드 결제 취소가 실제로 반영되기까지는 카드사에 따라 며칠 걸릴 수 있습니다. 출고 전 주문은 바로 취소할 수 있습니다.",
              `주문 조회와 신청: 주문 상태와 송장번호는 「주문 조회」 화면에서 주문번호와 휴대폰 번호로 확인할 수 있고, 취소·교환·반품은 ${SHOP_CONTACT.phone} 또는 ${SHOP_CONTACT.email}로 신청합니다.`,
              "분쟁 처리: 회사는 구매자의 불만과 분쟁을 성실히 처리하며, 해결되지 않으면 구매자는 한국소비자원 등 분쟁조정기관에 조정을 신청할 수 있습니다.",
            ],
          },
        ],
      },
      {
        title: "제품 정보의 성격",
        blocks: [
          {
            ul: [
              "홈페이지에 게시된 사양, 성능, 사진, 적용 사례, 절감 효과 계산 결과 등은 일반적인 안내를 위한 것으로, 유체·온도·압력·설치 환경 등 실제 사용 조건에 따라 달라질 수 있습니다.",
              "회사는 제품 개선을 위해 사양을 변경할 수 있으며, 최종 사양은 견적서와 계약서를 기준으로 합니다.",
              "이용자는 제품을 실제로 적용하기 전에 사용 조건을 회사와 협의해야 합니다.",
            ],
          },
        ],
      },
      {
        title: "이용자의 의무",
        blocks: [
          { p: "이용자는 다음 행위를 해서는 안 됩니다." },
          {
            ul: [
              "허위 정보나 다른 사람의 정보로 견적 문의를 하는 행위",
              "과도한 자동 요청, 악성코드 유포, 취약점 공격 등 홈페이지 운영을 방해하는 행위",
              "견적 문의 양식을 광고·스팸 발송에 이용하는 행위",
              "회사의 사전 동의 없이 홈페이지 콘텐츠를 복제·배포하거나 상업적으로 이용하는 행위",
              "회사나 제3자의 권리를 침해하거나 명예를 훼손하는 행위",
            ],
          },
        ],
      },
      {
        title: "저작권",
        blocks: [
          {
            p: "홈페이지의 글, 사진, 도면, 영상, 디자인, 로고 등 모든 콘텐츠의 저작권과 지식재산권은 회사 또는 정당한 권리자에게 있습니다. 이용자는 회사의 서면 동의 없이 이를 복제·전송·배포·변경할 수 없습니다. 다만 제품 검토를 위해 내부에서 열람하거나 인쇄하는 것은 허용합니다.",
          },
        ],
      },
      {
        title: "서비스의 변경과 중단",
        blocks: [
          {
            p: "회사는 설비 점검, 시스템 장애, 천재지변 등 부득이한 사유가 있으면 홈페이지의 전부 또는 일부를 변경하거나 일시 중단할 수 있습니다. 홈페이지는 무료로 제공되므로, 회사의 고의 또는 중대한 과실이 없는 한 이로 인한 손해를 책임지지 않습니다.",
          },
        ],
      },
      {
        title: "외부 링크",
        blocks: [
          { p: "홈페이지에 연결된 외부 사이트는 회사가 관리하지 않으며, 그 내용과 개인정보 처리에 대해서는 해당 사이트의 정책이 적용됩니다." },
        ],
      },
      {
        title: "책임의 제한",
        blocks: [
          {
            ul: [
              "회사는 고의 또는 중대한 과실이 없는 한, 이용자가 홈페이지의 정보를 이용하여 내린 판단으로 생긴 손해에 대해 책임지지 않습니다. 다만 관련 법령에서 달리 정한 경우에는 그에 따릅니다.",
              "제품의 품질과 보증은 개별 계약에서 정한 바에 따릅니다.",
            ],
          },
        ],
      },
      {
        title: "개인정보 보호",
        blocks: [
          { p: "회사는 견적 문의 등으로 받은 개인정보를 관련 법령과 회사의 개인정보처리방침에 따라 보호합니다." },
        ],
      },
      {
        title: "준거법과 관할",
        blocks: [
          { p: "이 약관은 대한민국 법률에 따라 해석되며, 홈페이지 이용과 관련한 분쟁은 「민사소송법」에 따른 관할 법원에서 해결합니다." },
        ],
      },
    ],
    closing: "부칙 — 이 약관은 2026년 11월 12일부터 시행합니다(제6조 온라인 구매 신설). 종전 약관은 2026년 10월 27일부터 시행되었습니다.",
  },

  en: {
    eyebrow: "Terms of Use",
    title: "Terms of Use",
    lead: "The conditions that apply when you use the titanium corrugated tube website.",
    intro:
      "These Terms govern the use of the titanium corrugated tube website (tube.atx.kr, the \"Website\") operated by ATX Co., Ltd. (Korean business registration no. 131-86-09143, the \"Company\").",
    effectiveLabel: "Effective date",
    translationNote: "This English version is provided for convenience. If it differs from the Korean version, the Korean version prevails.",
    headingFormat: "Article {n}. {title}",
    sections: [
      {
        title: "Purpose",
        blocks: [
          { p: "These Terms set out the conditions for using the information and quote request features on the Website, and the rights, obligations and responsibilities of the Company and users." },
        ],
      },
      {
        title: "Definitions",
        blocks: [
          {
            ul: [
              "\"User\" means any individual or company that accesses the Website and uses the information and features it provides under these Terms.",
              "\"Quote request\" means a request for a product quotation or technical consultation made through the quote form, by email or by phone.",
            ],
          },
        ],
      },
      {
        title: "Posting and amendment",
        blocks: [
          {
            ul: [
              "The Company posts these Terms on the Website. By using the Website, you agree to these Terms.",
              "The Company may amend these Terms to the extent permitted by law. Amendments will be announced on the Website 7 days before they take effect, or 30 days before if they are unfavorable to users.",
            ],
          },
        ],
      },
      {
        title: "Services",
        blocks: [
          {
            ul: [
              "Information about the Company and its products, technology and application cases",
              "Receiving and answering quote requests",
              "Other features designated by the Company",
            ],
          },
          { p: "The Website is free to use and requires no registration." },
        ],
      },
      {
        title: "Quote requests and contracts",
        blocks: [
          {
            ul: [
              "A quote request is not an offer to contract, and the Company's reply is for guidance only unless stated otherwise.",
              "Actual terms of trade (specifications, quantity, price, delivery, payment, etc.) are governed by the quotation issued by the Company and the contract or purchase order agreed by the parties.",
              "Drawings and technical information sent with a quote request are used only for quotation and consultation.",
            ],
          },
        ],
      },
      {
        title: "Online purchase (Korean site)",
        id: "purchase",
        blocks: [
          {
            ul: [
              "Some ready-stock products (standard corrugated tubes, sockets) can be bought online on the Korean-language site with domestic (Korean) delivery and card payment in KRW. Other products, bulk orders and custom specifications are handled through quote requests.",
              "A purchase contract is formed when payment is completed. If the Company cannot supply the product (e.g., out of stock or a pricing error), it will notify the buyer and refund the full amount without delay.",
              `Prices include VAT. Shipping is KRW ${won(SHIPPING_FEE)} per order and free for product totals of KRW ${won(FREE_SHIPPING_THRESHOLD)} or more. Orders ship within 1–2 business days after payment.`,
              "Buyers may withdraw (return) within 7 days of receipt, except where withdrawal is restricted under the Korean Act on Consumer Protection in Electronic Commerce (e.g., products used, cut or processed, or made to the buyer's request). The full purchase terms in the Korean version prevail.",
            ],
          },
        ],
      },
      {
        title: "Nature of product information",
        blocks: [
          {
            ul: [
              "Specifications, performance data, photos, application cases and savings estimates on the Website are general guidance and may vary with actual conditions such as fluid, temperature, pressure and installation environment.",
              "The Company may change specifications to improve its products; final specifications are those in the quotation and contract.",
              "Users must confirm operating conditions with the Company before applying a product.",
            ],
          },
        ],
      },
      {
        title: "User obligations",
        blocks: [
          { p: "Users must not:" },
          {
            ul: [
              "Submit quote requests with false information or another person's information",
              "Interfere with the Website, including excessive automated requests, distributing malware or exploiting vulnerabilities",
              "Use the quote form to send advertising or spam",
              "Copy, distribute or commercially use Website content without the Company's prior consent",
              "Infringe the rights of, or defame, the Company or any third party",
            ],
          },
        ],
      },
      {
        title: "Copyright",
        blocks: [
          {
            p: "All content on the Website, including text, photos, drawings, videos, designs and logos, belongs to the Company or its rightful owners. Users may not copy, transmit, distribute or modify it without the Company's written consent, except for viewing or printing for internal product evaluation.",
          },
        ],
      },
      {
        title: "Changes and interruption",
        blocks: [
          {
            p: "The Company may change or temporarily suspend all or part of the Website for maintenance, system failures, natural disasters or other unavoidable reasons. As the Website is provided free of charge, the Company is not liable for resulting damage unless caused by its intent or gross negligence.",
          },
        ],
      },
      {
        title: "External links",
        blocks: [
          { p: "External sites linked from the Website are not managed by the Company, and their own policies apply to their content and handling of personal information." },
        ],
      },
      {
        title: "Limitation of liability",
        blocks: [
          {
            ul: [
              "Except in cases of intent or gross negligence, the Company is not liable for damage arising from decisions users make based on information on the Website, unless otherwise required by law.",
              "Product quality and warranties are governed by the individual contract.",
            ],
          },
        ],
      },
      {
        title: "Personal information",
        blocks: [
          { p: "The Company protects personal information received through quote requests in accordance with applicable law and its Privacy Policy." },
        ],
      },
      {
        title: "Governing law and jurisdiction",
        blocks: [
          { p: "These Terms are governed by the laws of the Republic of Korea, and disputes relating to the Website are resolved by the competent court under the Korean Civil Procedure Act." },
        ],
      },
    ],
    closing: "Addendum — These Terms take effect on November 12, 2026 (online purchase article added). The previous version took effect on October 27, 2026.",
  },

  ja: {
    eyebrow: "Terms of Use",
    title: "利用規約",
    lead: "チタン波管ウェブサイトをご利用いただく際の条件をご案内します。",
    intro:
      "本規約は、ATX Co., Ltd.（韓国事業者登録番号 131-86-09143、以下「当社」）が運営するチタン波管ウェブサイト（tube.atx.kr、以下「本サイト」）の利用条件を定めるものです。",
    effectiveLabel: "施行日",
    translationNote: "本日本語版は参考訳です。韓国語版と内容が異なる場合は韓国語版が優先します。",
    headingFormat: "第{n}条（{title}）",
    sections: [
      {
        title: "目的",
        blocks: [
          { p: "本規約は、本サイトで提供する情報およびお見積り依頼機能の利用条件と、当社と利用者の権利・義務・責任を定めることを目的とします。" },
        ],
      },
      {
        title: "定義",
        blocks: [
          {
            ul: [
              "「利用者」とは、本サイトにアクセスし、本規約に従って当社が提供する情報と機能を利用する個人または法人をいいます。",
              "「お見積り依頼」とは、利用者がお見積りフォーム、メールまたはお電話で製品の見積りや技術相談を依頼することをいいます。",
            ],
          },
        ],
      },
      {
        title: "規約の掲示と変更",
        blocks: [
          {
            ul: [
              "当社は本規約を本サイトに掲示し、利用者は本サイトを利用することで本規約に同意したものとみなします。",
              "当社は法令に反しない範囲で本規約を変更できます。変更する場合は適用日の7日前から、利用者に不利な変更は30日前から本サイトでお知らせします。",
            ],
          },
        ],
      },
      {
        title: "提供するサービス",
        blocks: [
          {
            ul: [
              "当社および製品・技術・適用事例に関する情報の提供",
              "お見積り依頼の受付とご相談",
              "その他当社が定める機能",
            ],
          },
          { p: "本サイトは会員登録不要・無料でご利用いただけます。" },
        ],
      },
      {
        title: "お見積り依頼と契約",
        blocks: [
          {
            ul: [
              "お見積り依頼は契約の申込みではなく、当社の回答は別途明示しない限り参考のためのご案内です。",
              "実際の取引条件（仕様・数量・価格・納期・支払いなど）は、当社が発行する見積書と当事者が合意した契約書または発注書によります。",
              "お見積り依頼とともにお送りいただいた図面・技術情報は、見積りとご相談の目的にのみ使用します。",
            ],
          },
        ],
      },
      {
        title: "オンライン購入（韓国語サイト）",
        id: "purchase",
        blocks: [
          {
            ul: [
              "一部の在庫品（波管標準品・ソケット）は、韓国語サイトで韓国国内配送・ウォン建てカード決済によりオンラインで購入できます。その他の製品、大量注文、特注仕様はお見積り依頼で承ります。",
              "決済が完了した時点で売買契約が成立します。在庫不足や価格表示の誤り等で供給できない場合、当社は遅滞なく通知し、決済金額の全額を返金します。",
              `表示価格は付加価値税込みです。送料は1注文あたり${won(SHIPPING_FEE)}ウォンで、製品金額${won(FREE_SHIPPING_THRESHOLD)}ウォン以上は無料です。決済確認後、営業日1〜2日以内に出荷します。`,
              "受領日から7日以内であれば申込みの撤回（返品）ができます。ただし、使用・切断・加工した製品、購入者の依頼で製作した製品など、韓国「電子商取引等における消費者保護に関する法律」により撤回が制限される場合を除きます。購入条件の詳細は韓国語版が優先します。",
            ],
          },
        ],
      },
      {
        title: "製品情報の性質",
        blocks: [
          {
            ul: [
              "本サイトに掲載している仕様・性能・写真・適用事例・削減効果の試算結果などは一般的なご案内であり、流体・温度・圧力・設置環境など実際の使用条件により異なる場合があります。",
              "当社は製品改良のため仕様を変更することがあり、最終仕様は見積書と契約書を基準とします。",
              "利用者は製品を実際に適用する前に、使用条件を当社とご確認ください。",
            ],
          },
        ],
      },
      {
        title: "利用者の義務",
        blocks: [
          { p: "利用者は次の行為をしてはなりません。" },
          {
            ul: [
              "虚偽の情報または他人の情報でお見積りを依頼する行為",
              "過度な自動アクセス、マルウェアの配布、脆弱性への攻撃など本サイトの運営を妨げる行為",
              "お見積りフォームを広告・スパムの送信に利用する行為",
              "当社の事前の同意なく本サイトのコンテンツを複製・配布し、または商業的に利用する行為",
              "当社または第三者の権利を侵害し、名誉を毀損する行為",
            ],
          },
        ],
      },
      {
        title: "著作権",
        blocks: [
          {
            p: "本サイトの文章・写真・図面・動画・デザイン・ロゴなどすべてのコンテンツの著作権および知的財産権は、当社または正当な権利者に帰属します。利用者は当社の書面による同意なくこれらを複製・送信・配布・改変することはできません。ただし、製品検討のために社内で閲覧・印刷することは差し支えありません。",
          },
        ],
      },
      {
        title: "サービスの変更と中断",
        blocks: [
          {
            p: "当社は設備点検、システム障害、天災などやむを得ない事由がある場合、本サイトの全部または一部を変更し、または一時的に中断することがあります。本サイトは無料で提供しているため、当社の故意または重大な過失による場合を除き、これにより生じた損害について責任を負いません。",
          },
        ],
      },
      {
        title: "外部リンク",
        blocks: [
          { p: "本サイトからリンクしている外部サイトは当社の管理外であり、その内容および個人情報の取り扱いには当該サイトの方針が適用されます。" },
        ],
      },
      {
        title: "責任の制限",
        blocks: [
          {
            ul: [
              "当社は、故意または重大な過失がある場合を除き、利用者が本サイトの情報に基づいて行った判断により生じた損害について責任を負いません。ただし、法令に別段の定めがある場合はそれに従います。",
              "製品の品質と保証は、個別の契約で定めるところによります。",
            ],
          },
        ],
      },
      {
        title: "個人情報の保護",
        blocks: [
          { p: "当社はお見積り依頼などでお預かりした個人情報を、関係法令および当社のプライバシーポリシーに従って保護します。" },
        ],
      },
      {
        title: "準拠法と管轄",
        blocks: [
          { p: "本規約は大韓民国の法律に準拠し、本サイトの利用に関する紛争は韓国「民事訴訟法」に基づく管轄裁判所で解決します。" },
        ],
      },
    ],
    closing: "附則 — 本規約は2026年11月12日から施行します（オンライン購入の条項を新設）。従前の規約は2026年10月27日から施行されました。",
  },
};
