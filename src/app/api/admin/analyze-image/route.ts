export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/admin-auth';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface AnalyzeRequest {
  imageBase64: string;
  mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
}

interface AnalyzeResult {
  tagline: string;
  description: string;
  longDescription: string;
  suggestedName: string;
  suggestedNameEn: string;
}

const SYSTEM_PROMPT = `당신은 ATX 티타늄 주름관 브랜드의 제품 문구 전문가입니다.
ATX는 반도체·화학·항공·해양 산업을 위한 고품질 티타늄 주름관(Corrugated Tube) 및 플렉시블 호스 전문 제조사입니다.

브랜드 문체 가이드:
- 절제되고 전문적인 B2B 톤앤매너
- 기술적 신뢰감과 내구성 강조
- 과장이나 수식어 최소화, 핵심 특성만 간결하게
- 한국어 문구는 자연스럽고 격식있게
- 영문 상품명은 대문자 약어나 기술 용어 활용

응답은 반드시 순수 JSON만 반환하세요. 마크다운 코드블록 없이.`;

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!(await checkAdminAuth(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { imageBase64, mediaType } = await req.json() as AnalyzeRequest;

  if (!imageBase64 || !mediaType) {
    return NextResponse.json({ error: 'imageBase64와 mediaType이 필요합니다.' }, { status: 400 });
  }

  const message = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 512,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: imageBase64,
            },
          },
          {
            type: 'text',
            text: `이 티타늄 주름관 제품 이미지를 분석하고 다음 JSON 형식으로만 응답하세요:
{
  "tagline": "15자 이내 핵심 가치 문구",
  "description": "40자 이내 짧은 제품 소개",
  "longDescription": "80자 이내 상세 제품 설명",
  "suggestedName": "한글 제품명",
  "suggestedNameEn": "ENGLISH PRODUCT NAME IN CAPS"
}`,
          },
        ],
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    return NextResponse.json({ error: 'Claude 응답 오류' }, { status: 500 });
  }

  try {
    const result = JSON.parse(content.text) as AnalyzeResult;
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'JSON 파싱 실패', raw: content.text }, { status: 500 });
  }
}
