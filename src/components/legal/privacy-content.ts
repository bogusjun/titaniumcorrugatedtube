/**
 * 개인정보처리방침·견적 폼 동의 문구 (ko/en/ja)
 *
 * 국문이 기준본이다 — 내용을 바꾸면 영문·일문과 견적 폼 동의 요약(CONSENT)도 같이 고치고,
 * PRIVACY_EFFECTIVE_DATE 를 새 시행일로 올린다. 보유 기간·위탁사가 바뀌면 /api/contact 흐름과도 맞춘다.
 */

import type { LegalLocale, PolicyDoc } from "./types";

export const PRIVACY_EFFECTIVE_DATE = "2026-10-27";

export const PRIVACY_PATH: Record<LegalLocale, string> = {
  ko: "/privacy",
  en: "/en/privacy",
  ja: "/ja/privacy",
};

export const PRIVACY_POLICY: Record<LegalLocale, PolicyDoc> = {
  ko: {
    eyebrow: "Privacy Policy",
    title: "개인정보처리방침",
    lead: "견적 문의로 받은 개인정보를 어떻게 쓰고 보호하는지 안내합니다.",
    intro:
      "(주)에이티엑스(ATX Co., Ltd., 이하 「회사」)는 「개인정보 보호법」에 따라 정보주체의 개인정보를 보호하고 관련 고충을 신속하게 처리하기 위해 다음과 같이 개인정보처리방침을 수립·공개합니다. 이 방침은 티타늄 주름관 홈페이지(tube.atx.kr)에 적용됩니다.",
    effectiveLabel: "시행일",
    sections: [
      {
        title: "개인정보의 처리 목적",
        blocks: [
          { p: "회사는 다음 목적을 위해서만 개인정보를 처리하며, 목적이 바뀌면 별도 동의를 받는 등 필요한 조치를 합니다." },
          {
            ul: [
              "견적·제품 문의 접수와 답변: 문의 내용 확인, 견적서 작성·발송, 담당자 연락",
              "문의 이력 관리: 후속 상담과 거래 진행을 위한 문의 기록 관리",
              "홈페이지 이용 통계와 유입 경로 분석: 홈페이지 개선과 광고 효과 측정",
            ],
          },
        ],
      },
      {
        title: "처리하는 개인정보 항목",
        blocks: [
          {
            table: {
              head: ["구분", "항목", "수집 방법"],
              rows: [
                ["견적 문의 (필수)", "회사명, 담당자명, 이메일", "견적 문의 양식"],
                ["견적 문의 (선택)", "연락처(전화번호), 제품 사양·수량·사용 유체 등 문의 내용, 첨부 파일(도면·사진 등)", "견적 문의 양식"],
                [
                  "자동 수집",
                  "유입 경로(광고 매체·캠페인·검색어, 처음 방문한 페이지, 이전 사이트 주소, 방문 시각), 접속 IP·접속 기록, 쿠키, 브라우저·기기 정보",
                  "홈페이지 이용 시 자동 생성",
                ],
              ],
            },
          },
        ],
      },
      {
        title: "개인정보의 처리 및 보유 기간",
        blocks: [
          {
            ul: [
              "견적 문의 정보: 문의 처리 완료 후 3년간 보관한 뒤 파기합니다. 거래로 이어진 경우에는 상법·국세기본법 등 관계 법령에서 정한 기간 동안 보관합니다.",
              "유입 경로 쿠키: 이용자의 브라우저에 최대 90일간 저장됩니다.",
              "방문 통계: 분석 도구에 설정한 보관 기간(최대 14개월)이 지나면 삭제됩니다.",
            ],
          },
        ],
      },
      {
        title: "개인정보의 제3자 제공",
        blocks: [
          {
            p: "회사는 정보주체의 개인정보를 제1항의 목적 범위에서만 처리하며, 정보주체의 동의나 법률의 특별한 규정 등 「개인정보 보호법」 제17조·제18조에 해당하는 경우 외에는 제3자에게 제공하지 않습니다.",
          },
        ],
      },
      {
        title: "개인정보 처리업무의 위탁과 국외 이전",
        blocks: [
          { p: "회사는 문의 처리를 위해 다음과 같이 개인정보 처리업무를 위탁합니다. 이 중 국외 사업자에게 위탁하는 경우 개인정보가 해당 국가로 이전됩니다." },
          {
            table: {
              head: ["수탁자 (연락처)", "국가", "위탁 업무", "이전 항목"],
              rows: [
                ["Vercel Inc. (vercel.com)", "미국", "홈페이지 호스팅, 견적 문의 양식 전송 처리", "견적 문의 정보, 접속 기록"],
                ["Google LLC (google.com)", "미국", "문의 메일 수신·보관(Gmail), 방문 통계 분석(Google 애널리틱스)", "견적 문의 정보, 유입 경로·이용 기록"],
                ["Notion Labs, Inc. (notion.com)", "미국", "영업 문의 내역 기록·관리", "견적 문의 정보, 유입 경로"],
                ["NAVER Corp. (navercorp.com)", "대한민국", "방문 통계 분석(네이버 애널리틱스)", "이용 기록, 쿠키"],
              ],
            },
          },
          {
            ul: [
              "이전 시기와 방법: 견적 문의 양식을 보내거나 홈페이지를 이용할 때 암호화된 네트워크로 전송됩니다.",
              "보유·이용 기간: 위탁 계약이 끝나거나 제3항의 보유 기간이 지날 때까지입니다.",
              "국외 이전을 원하지 않으면 양식 대신 전화(1544-1909)로 문의할 수 있으며, 이로 인한 불이익은 없습니다.",
            ],
          },
        ],
      },
      {
        title: "개인정보의 파기 절차와 방법",
        blocks: [
          {
            ul: [
              "보유 기간이 지나거나 처리 목적을 달성한 개인정보는 지체 없이 파기합니다.",
              "전자 파일은 복구할 수 없는 방법으로 삭제하고, 종이 문서는 분쇄하거나 소각합니다.",
            ],
          },
        ],
      },
      {
        title: "정보주체의 권리와 행사 방법",
        blocks: [
          {
            ul: [
              "정보주체는 언제든지 개인정보 열람·정정·삭제·처리정지와 동의 철회를 요구할 수 있습니다.",
              "이메일(777@atx.kr)이나 전화(1544-1909)로 요구하시면 회사는 지체 없이 조치합니다.",
              "법정대리인이나 위임받은 사람을 통해서도 요구할 수 있으며, 이때는 위임장을 제출해야 합니다.",
              "다른 법령에서 보관하도록 정한 개인정보는 그 기간 동안 삭제를 요구할 수 없습니다.",
            ],
          },
        ],
      },
      {
        title: "개인정보의 안전성 확보 조치",
        blocks: [
          {
            ul: [
              "관리적 조치: 개인정보를 다루는 담당자를 최소한으로 지정하고 관리합니다.",
              "기술적 조치: 모든 전송 구간을 암호화(HTTPS)하고, 문의 기록에 대한 접근 권한을 관리합니다.",
              "물리적 조치: 출력 문서는 잠금 장치가 있는 곳에 보관합니다.",
            ],
          },
        ],
      },
      {
        title: "자동 수집 장치(쿠키)의 설치·운영과 거부",
        blocks: [
          { p: "회사는 유입 경로 확인과 방문 통계를 위해 다음 쿠키를 사용합니다." },
          {
            table: {
              head: ["쿠키", "목적", "보관 기간"],
              rows: [
                ["atx_src_f, atx_src_l", "처음·마지막 유입 경로 기록 — 견적 문의 시 문의 내용과 함께 전달", "90일"],
                ["Google 애널리틱스 (_ga 등)", "방문자 수와 이용 행태 통계", "최대 2년"],
                ["네이버 애널리틱스", "방문 통계와 검색광고 효과 측정", "네이버 정책에 따름"],
              ],
            },
          },
          {
            ul: [
              "웹 브라우저 설정에서 쿠키 저장을 거부하거나 삭제할 수 있습니다.",
              "Google 애널리틱스는 Google의 차단 부가기능(tools.google.com/dlpage/gaoptout)으로도 거부할 수 있습니다.",
              "쿠키를 거부해도 홈페이지 이용과 견적 문의에는 제한이 없습니다.",
            ],
          },
        ],
      },
      {
        title: "개인정보 보호책임자",
        blocks: [
          { p: "개인정보 처리에 관한 문의, 불만 처리, 피해 구제는 아래 창구로 연락해 주십시오." },
          {
            ul: [
              "담당: (주)에이티엑스 고객지원",
              "전화: 1544-1909 (평일 09:00~18:00)",
              "이메일: 777@atx.kr",
            ],
          },
        ],
      },
      {
        title: "권익침해 구제 방법",
        blocks: [
          { p: "개인정보 침해에 대한 신고나 상담이 필요하면 아래 기관에 문의할 수 있습니다." },
          {
            ul: [
              "개인정보분쟁조정위원회: (국번없이) 1833-6972 (www.kopico.go.kr)",
              "개인정보침해신고센터: (국번없이) 118 (privacy.kisa.or.kr)",
              "대검찰청: (국번없이) 1301 (www.spo.go.kr)",
              "경찰청: (국번없이) 182 (ecrm.police.go.kr)",
            ],
          },
        ],
      },
      {
        title: "개인정보처리방침의 변경",
        blocks: [
          { p: "이 방침은 2026년 10월 27일부터 적용됩니다. 내용이 바뀌면 시행 전에 이 페이지로 알립니다." },
        ],
      },
    ],
  },

  en: {
    eyebrow: "Privacy Policy",
    title: "Privacy Policy",
    lead: "How we use and protect the personal information you send with a quote request.",
    intro:
      "ATX Co., Ltd. (the \"Company\") establishes and discloses this Privacy Policy under the Personal Information Protection Act of Korea to protect your personal information and to handle related requests promptly. This policy applies to the titanium corrugated tube website (tube.atx.kr).",
    effectiveLabel: "Effective date",
    translationNote: "This English version is provided for convenience. If it differs from the Korean version, the Korean version prevails.",
    sections: [
      {
        title: "Purposes of processing",
        blocks: [
          { p: "We process personal information only for the purposes below and will take the required steps, such as obtaining new consent, if a purpose changes." },
          {
            ul: [
              "Receiving and answering quote and product inquiries: reviewing your request, preparing and sending quotations, contacting you",
              "Inquiry records: keeping a record of inquiries for follow-up and transactions",
              "Website statistics and traffic-source analysis: improving the website and measuring advertising performance",
            ],
          },
        ],
      },
      {
        title: "Personal information we collect",
        blocks: [
          {
            table: {
              head: ["Category", "Items", "How collected"],
              rows: [
                ["Quote request (required)", "Company name, contact person, email address", "Quote request form"],
                ["Quote request (optional)", "Phone number; inquiry details such as specifications, quantity and fluid; attached files (drawings, photos, etc.)", "Quote request form"],
                [
                  "Collected automatically",
                  "Traffic source (ad medium, campaign, search keyword, landing page, referring site, visit time), IP address and access logs, cookies, browser and device information",
                  "Generated automatically when you use the website",
                ],
              ],
            },
          },
        ],
      },
      {
        title: "Retention period",
        blocks: [
          {
            ul: [
              "Quote request information: kept for 3 years after the inquiry is resolved, then destroyed. If a transaction follows, it is kept for the period required by Korean law (e.g. the Commercial Act and the Framework Act on National Taxes).",
              "Traffic-source cookies: stored in your browser for up to 90 days.",
              "Website statistics: deleted after the retention period set in the analytics tool (up to 14 months).",
            ],
          },
        ],
      },
      {
        title: "Provision to third parties",
        blocks: [
          {
            p: "We process personal information only within the purposes in Section 1 and do not provide it to third parties except with your consent or where permitted by law, as set out in Articles 17 and 18 of the Personal Information Protection Act.",
          },
        ],
      },
      {
        title: "Processors and international transfers",
        blocks: [
          { p: "We use the following service providers to handle inquiries. Where a provider is located outside Korea, personal information is transferred to that country." },
          {
            table: {
              head: ["Provider (contact)", "Country", "Service", "Data transferred"],
              rows: [
                ["Vercel Inc. (vercel.com)", "USA", "Website hosting, quote form delivery", "Quote request information, access logs"],
                ["Google LLC (google.com)", "USA", "Receiving and storing inquiry email (Gmail), website statistics (Google Analytics)", "Quote request information, traffic source and usage records"],
                ["Notion Labs, Inc. (notion.com)", "USA", "Recording and managing sales inquiries", "Quote request information, traffic source"],
                ["NAVER Corp. (navercorp.com)", "Korea", "Website statistics (Naver Analytics)", "Usage records, cookies"],
              ],
            },
          },
          {
            ul: [
              "Timing and method: transmitted over an encrypted network when you submit the form or use the website.",
              "Retention: until the service contract ends or the retention period in Section 3 expires.",
              "If you do not want your information transferred abroad, you may contact us by phone (+82-1544-1909) instead of the form, without any disadvantage.",
            ],
          },
        ],
      },
      {
        title: "Destruction",
        blocks: [
          {
            ul: [
              "Personal information is destroyed without delay once the retention period expires or the purpose is achieved.",
              "Electronic files are deleted so they cannot be recovered; paper documents are shredded or incinerated.",
            ],
          },
        ],
      },
      {
        title: "Your rights",
        blocks: [
          {
            ul: [
              "You may at any time request access to, correction, deletion or suspension of processing of your personal information, or withdraw your consent.",
              "Send your request to 777@atx.kr or call +82-1544-1909, and we will act on it without delay.",
              "A legal representative or authorized person may make the request on your behalf with a power of attorney.",
              "Information that other laws require us to keep cannot be deleted during that period.",
            ],
          },
        ],
      },
      {
        title: "Security measures",
        blocks: [
          {
            ul: [
              "Administrative: we keep the number of staff handling personal information to a minimum.",
              "Technical: all transmission is encrypted (HTTPS) and access to inquiry records is restricted.",
              "Physical: printed documents are kept in locked storage.",
            ],
          },
        ],
      },
      {
        title: "Cookies",
        blocks: [
          { p: "We use the following cookies to identify traffic sources and measure website statistics." },
          {
            table: {
              head: ["Cookie", "Purpose", "Duration"],
              rows: [
                ["atx_src_f, atx_src_l", "First and latest traffic source, sent along with a quote request", "90 days"],
                ["Google Analytics (_ga, etc.)", "Visitor counts and usage statistics", "Up to 2 years"],
                ["Naver Analytics", "Website statistics and search-ad performance", "Per Naver's policy"],
              ],
            },
          },
          {
            ul: [
              "You can block or delete cookies in your browser settings.",
              "You can also opt out of Google Analytics with Google's opt-out add-on (tools.google.com/dlpage/gaoptout).",
              "Blocking cookies does not limit your use of the website or the quote form.",
            ],
          },
        ],
      },
      {
        title: "Privacy contact",
        blocks: [
          { p: "For questions, complaints or remedies regarding personal information, please contact:" },
          {
            ul: [
              "ATX Co., Ltd. Customer Support",
              "Phone: +82-1544-1909 (weekdays 09:00–18:00 KST)",
              "Email: 777@atx.kr",
            ],
          },
        ],
      },
      {
        title: "Remedies",
        blocks: [
          { p: "You may also contact the following Korean authorities about a privacy infringement." },
          {
            ul: [
              "Personal Information Dispute Mediation Committee: 1833-6972 (www.kopico.go.kr)",
              "Personal Information Infringement Report Center: 118 (privacy.kisa.or.kr)",
            ],
          },
        ],
      },
      {
        title: "Changes to this policy",
        blocks: [
          { p: "This policy takes effect on October 27, 2026. We will announce any changes on this page before they take effect." },
        ],
      },
    ],
  },

  ja: {
    eyebrow: "Privacy Policy",
    title: "プライバシーポリシー",
    lead: "お見積りのお問い合わせでお預かりする個人情報の利用と保護についてご案内します。",
    intro:
      "ATX Co., Ltd.（以下「当社」）は、韓国「個人情報保護法」に基づき、お客様の個人情報を保護し、関連するお問い合わせに迅速に対応するため、本プライバシーポリシーを定めて公開します。本ポリシーはチタン波管ウェブサイト（tube.atx.kr）に適用されます。",
    effectiveLabel: "施行日",
    translationNote: "本日本語版は参考訳です。韓国語版と内容が異なる場合は韓国語版が優先します。",
    sections: [
      {
        title: "個人情報の利用目的",
        blocks: [
          { p: "当社は以下の目的に限って個人情報を取り扱い、目的を変更する場合は改めて同意をいただくなど必要な措置を講じます。" },
          {
            ul: [
              "お見積り・製品に関するお問い合わせの受付と回答：内容の確認、見積書の作成・送付、ご担当者様へのご連絡",
              "お問い合わせ履歴の管理：その後のご相談・お取引のための記録管理",
              "ウェブサイトの利用統計と流入経路の分析：サイトの改善と広告効果の測定",
            ],
          },
        ],
      },
      {
        title: "取得する個人情報",
        blocks: [
          {
            table: {
              head: ["区分", "項目", "取得方法"],
              rows: [
                ["お見積り依頼（必須）", "会社名、ご担当者名、メールアドレス", "お見積りフォーム"],
                ["お見積り依頼（任意）", "電話番号、仕様・数量・使用流体などのお問い合わせ内容、添付ファイル（図面・写真など）", "お見積りフォーム"],
                [
                  "自動取得",
                  "流入経路（広告媒体・キャンペーン・検索語、最初に閲覧したページ、参照元サイト、訪問日時）、IPアドレス・アクセス記録、Cookie、ブラウザ・端末情報",
                  "ウェブサイト利用時に自動生成",
                ],
              ],
            },
          },
        ],
      },
      {
        title: "保有期間",
        blocks: [
          {
            ul: [
              "お見積り依頼の情報：対応完了後3年間保管した後に廃棄します。お取引に至った場合は、韓国の関係法令（商法・国税基本法など）で定める期間保管します。",
              "流入経路Cookie：お客様のブラウザに最長90日間保存されます。",
              "利用統計：分析ツールで設定した保管期間（最長14か月）の経過後に削除されます。",
            ],
          },
        ],
      },
      {
        title: "第三者提供",
        blocks: [
          {
            p: "当社は個人情報を第1項の目的の範囲内でのみ取り扱い、ご本人の同意がある場合や法令に基づく場合（個人情報保護法第17条・第18条）を除き、第三者に提供しません。",
          },
        ],
      },
      {
        title: "業務委託と国外移転",
        blocks: [
          { p: "当社はお問い合わせへの対応のため、以下の事業者に業務を委託しています。国外の事業者に委託する場合、個人情報は当該国へ移転されます。" },
          {
            table: {
              head: ["委託先（連絡先）", "国", "委託業務", "移転する項目"],
              rows: [
                ["Vercel Inc.（vercel.com）", "米国", "ウェブサイトのホスティング、お見積りフォームの送信処理", "お見積り依頼の情報、アクセス記録"],
                ["Google LLC（google.com）", "米国", "お問い合わせメールの受信・保管（Gmail）、利用統計（Google アナリティクス）", "お見積り依頼の情報、流入経路・利用記録"],
                ["Notion Labs, Inc.（notion.com）", "米国", "営業お問い合わせの記録・管理", "お見積り依頼の情報、流入経路"],
                ["NAVER Corp.（navercorp.com）", "韓国", "利用統計（NAVER アナリティクス）", "利用記録、Cookie"],
              ],
            },
          },
          {
            ul: [
              "移転の時期と方法：フォーム送信時またはウェブサイト利用時に、暗号化された通信で送信されます。",
              "保有期間：委託契約の終了時または第3項の保有期間の満了時までです。",
              "国外移転を希望されない場合は、フォームの代わりにお電話（+82-1544-1909）でお問い合わせいただけます。これによる不利益はありません。",
            ],
          },
        ],
      },
      {
        title: "廃棄の手続きと方法",
        blocks: [
          {
            ul: [
              "保有期間の満了または利用目的の達成後、遅滞なく廃棄します。",
              "電子ファイルは復元できない方法で削除し、紙の書類はシュレッダーまたは焼却により廃棄します。",
            ],
          },
        ],
      },
      {
        title: "お客様の権利",
        blocks: [
          {
            ul: [
              "お客様はいつでも、個人情報の開示・訂正・削除・利用停止および同意の撤回を求めることができます。",
              "777@atx.kr またはお電話（+82-1544-1909）でご請求いただければ、遅滞なく対応します。",
              "法定代理人または委任を受けた方を通じてご請求いただくこともでき、その場合は委任状が必要です。",
              "他の法令で保管が義務付けられている情報は、その期間中は削除できません。",
            ],
          },
        ],
      },
      {
        title: "安全管理措置",
        blocks: [
          {
            ul: [
              "組織的措置：個人情報を取り扱う担当者を必要最小限に限定しています。",
              "技術的措置：すべての通信を暗号化（HTTPS）し、お問い合わせ記録へのアクセス権限を管理しています。",
              "物理的措置：印刷した書類は施錠できる場所に保管しています。",
            ],
          },
        ],
      },
      {
        title: "Cookie の利用",
        blocks: [
          { p: "当社は流入経路の確認と利用統計のため、以下の Cookie を使用します。" },
          {
            table: {
              head: ["Cookie", "目的", "保存期間"],
              rows: [
                ["atx_src_f, atx_src_l", "最初と最新の流入経路を記録し、お見積り依頼時に内容と併せて送信", "90日"],
                ["Google アナリティクス（_ga など）", "訪問者数と利用状況の統計", "最長2年"],
                ["NAVER アナリティクス", "利用統計と検索広告の効果測定", "NAVER の規定による"],
              ],
            },
          },
          {
            ul: [
              "ブラウザの設定で Cookie の保存を拒否または削除できます。",
              "Google アナリティクスは Google のオプトアウト アドオン（tools.google.com/dlpage/gaoptout）でも無効にできます。",
              "Cookie を拒否しても、ウェブサイトやお見積りフォームのご利用に制限はありません。",
            ],
          },
        ],
      },
      {
        title: "お問い合わせ窓口",
        blocks: [
          { p: "個人情報の取り扱いに関するご質問・苦情・救済のご相談は、以下までご連絡ください。" },
          {
            ul: [
              "ATX Co., Ltd. カスタマーサポート",
              "電話：+82-1544-1909（平日 09:00〜18:00 韓国時間）",
              "メール：777@atx.kr",
            ],
          },
        ],
      },
      {
        title: "権利侵害の救済",
        blocks: [
          { p: "個人情報の侵害については、以下の韓国の機関にもご相談いただけます。" },
          {
            ul: [
              "個人情報紛争調停委員会：1833-6972（www.kopico.go.kr）",
              "個人情報侵害申告センター：118（privacy.kisa.or.kr）",
            ],
          },
        ],
      },
      {
        title: "本ポリシーの変更",
        blocks: [
          { p: "本ポリシーは2026年10月27日から適用されます。内容を変更する場合は、施行前に本ページでお知らせします。" },
        ],
      },
    ],
  },
};

/** 견적 폼 동의 요약 — 「개인정보 보호법」 제15조 제2항의 고지 4가지(항목·목적·기간·거부권)를 담는다 */
export const CONSENT: Record<
  LegalLocale,
  { heading: string; rows: [string, string][]; refusal: string; checkbox: string; viewPolicy: string; required: string }
> = {
  ko: {
    heading: "개인정보 수집·이용 동의",
    rows: [
      ["수집 항목", "회사명, 담당자명, 이메일, 연락처(선택), 문의 내용, 첨부 파일(선택)"],
      ["이용 목적", "견적·문의 답변과 상담 연락"],
      ["보유 기간", "문의 처리 완료 후 3년"],
    ],
    refusal: "동의를 거부할 수 있으며, 거부하면 양식으로는 문의할 수 없습니다(전화 1544-1909로 문의 가능). 문의 내용은 국외 위탁사(Vercel·Google·Notion, 미국)를 거쳐 처리됩니다.",
    checkbox: "위 내용을 확인했으며 개인정보 수집·이용에 동의합니다.",
    viewPolicy: "개인정보처리방침 전문 보기",
    required: "(필수)",
  },
  en: {
    heading: "Consent to collection and use of personal information",
    rows: [
      ["Items", "Company name, contact person, email, phone (optional), inquiry details, attached files (optional)"],
      ["Purpose", "Answering your quote request and contacting you"],
      ["Retention", "3 years after the inquiry is resolved"],
    ],
    refusal: "You may refuse, but the form cannot be submitted without consent (you can still call +82-1544-1909). Inquiries are processed through service providers in the USA (Vercel, Google, Notion).",
    checkbox: "I have read the above and agree to the collection and use of my personal information.",
    viewPolicy: "Read the full Privacy Policy",
    required: "(required)",
  },
  ja: {
    heading: "個人情報の取得・利用への同意",
    rows: [
      ["取得項目", "会社名、ご担当者名、メールアドレス、電話番号（任意）、お問い合わせ内容、添付ファイル（任意）"],
      ["利用目的", "お見積り・お問い合わせへの回答とご連絡"],
      ["保有期間", "対応完了後3年間"],
    ],
    refusal: "同意を拒否することもできますが、その場合フォームは送信できません（お電話 +82-1544-1909 でのお問い合わせは可能です）。お問い合わせ内容は米国の委託先（Vercel・Google・Notion）を経由して処理されます。",
    checkbox: "上記の内容を確認し、個人情報の取得・利用に同意します。",
    viewPolicy: "プライバシーポリシー全文を見る",
    required: "（必須）",
  },
};
