'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const SIZES = [
  '14호', '15호', '16호', '17호', '18호', '19호', '20호',
  '21호', '22호', '23호', '24호', '25호', '26호', '27호',
];

interface ImageItem {
  src: string;
  alt: string;
  fileName?: string;
}

interface SpecItem {
  label: string;
  value: string;
}

interface ClaudeResult {
  tagline: string;
  description: string;
  longDescription: string;
  suggestedName: string;
  suggestedNameEn: string;
}

interface ProductData {
  slug: string;
  name: string;
  name_en: string;
  tagline: string;
  description: string;
  long_description: string;
  price: number;
  images: ImageItem[];
  specs: SpecItem[];
  external_url: string;
  is_new: boolean;
  is_bestseller: boolean;
  is_active: boolean;
}

interface Props {
  mode: 'new' | 'edit';
  productId?: string;
  initialData?: Partial<ProductData>;
}

function initInventory() {
  return Object.fromEntries(SIZES.map((s) => [s, 0]));
}

export default function ProductForm({ mode, productId, initialData }: Props) {
  const router = useRouter();

  const [slug, setSlug] = useState(initialData?.slug ?? '');
  const [slugLocked, setSlugLocked] = useState(mode === 'edit');
  const [images, setImages] = useState<ImageItem[]>(initialData?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [claudeResult, setClaudeResult] = useState<ClaudeResult | null>(null);

  const [name, setName] = useState(initialData?.name ?? '');
  const [nameEn, setNameEn] = useState(initialData?.name_en ?? '');
  const [tagline, setTagline] = useState(initialData?.tagline ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [longDescription, setLongDescription] = useState(initialData?.long_description ?? '');
  const [price, setPrice] = useState(initialData?.price?.toString() ?? '');
  const [externalUrl, setExternalUrl] = useState(initialData?.external_url ?? '');
  const [isNew, setIsNew] = useState(initialData?.is_new ?? false);
  const [isBestseller, setIsBestseller] = useState(initialData?.is_bestseller ?? false);
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);

  const [specs, setSpecs] = useState<SpecItem[]>(
    initialData?.specs && (initialData.specs as SpecItem[]).length > 0
      ? (initialData.specs as SpecItem[])
      : [{ label: '', value: '' }]
  );

  const [inventory, setInventory] = useState<Record<string, number>>(initInventory());

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    if (!slug) {
      setError('slug를 먼저 입력해주세요.');
      return;
    }

    setUploading(true);
    setError('');

    const uploaded: ImageItem[] = [];
    let firstFile: File | null = null;

    for (const file of files) {
      if (images.length === 0 && uploaded.length === 0 && !firstFile) {
        firstFile = file;
      }
      const fd = new FormData();
      fd.append('file', file);
      fd.append('slug', slug);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      if (res.ok) {
        const data = await res.json() as { url: string; fileName: string };
        uploaded.push({ src: data.url, alt: file.name.split('.')[0], fileName: data.fileName });
      }
    }

    setImages((prev) => [...prev, ...uploaded]);
    setUploading(false);

    // 첫 업로드 시 자동 Claude 분석 — 이미 메모리에 있는 File 객체 직접 사용
    if (images.length === 0 && firstFile) {
      await analyzeFirstImage(firstFile);
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function analyzeFirstImage(file: File) {
    setAnalyzing(true);
    try {
      const base64 = await blobToBase64(file);
      const mediaType = file.type as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';

      const res = await fetch('/api/admin/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mediaType }),
      });

      if (res.ok) {
        const result = await res.json() as ClaudeResult;
        setClaudeResult(result);
      }
    } catch {
      // 분석 실패는 무시
    } finally {
      setAnalyzing(false);
    }
  }

  function applyClaudeResult() {
    if (!claudeResult) return;
    setName(claudeResult.suggestedName);
    setNameEn(claudeResult.suggestedNameEn);
    setTagline(claudeResult.tagline);
    setDescription(claudeResult.description);
    setLongDescription(claudeResult.longDescription);
  }

  function updateImageAlt(idx: number, alt: string) {
    setImages((prev) => prev.map((img, i) => (i === idx ? { ...img, alt } : img)));
  }

  function removeImage(idx: number) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }

  function addSpec() {
    setSpecs((prev) => [...prev, { label: '', value: '' }]);
  }

  function updateSpec(idx: number, field: 'label' | 'value', val: string) {
    setSpecs((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: val } : s)));
  }

  function removeSpec(idx: number) {
    setSpecs((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSave() {
    setError('');
    if (!slug || !name) {
      setError('slug와 상품명은 필수입니다.');
      return;
    }

    setSaving(true);
    const payload = {
      slug,
      name,
      name_en: nameEn,
      tagline,
      description,
      long_description: longDescription,
      price: parseInt(price) || 0,
      images,
      specs: specs.filter((s) => s.label && s.value),
      external_url: externalUrl || null,
      is_new: isNew,
      is_bestseller: isBestseller,
      is_active: isActive,
    };

    const url = mode === 'new' ? '/api/admin/products' : `/api/admin/products/${productId}`;
    const method = mode === 'new' ? 'POST' : 'PATCH';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json() as { error?: string };
      setError(data.error ?? '저장 실패');
      setSaving(false);
      return;
    }

    const product = await res.json() as { id: string };

    // 재고 일괄 upsert (new 모드에서만)
    if (mode === 'new') {
      const inventoryItems = SIZES.map((size) => ({
        product_id: product.id,
        size,
        quantity: inventory[size] ?? 0,
      }));

      await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inventoryItems),
      });
    }

    router.push('/admin/products');
  }

  return (
    <div className="space-y-8">
      {/* STEP 1: Slug */}
      <Section label="Slug" step={1}>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={slug}
            onChange={(e) => !slugLocked && setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
            disabled={slugLocked}
            placeholder="product-slug-en"
            className="flex-1 border border-[#E8E4DC] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1a1a1a] disabled:bg-[#F8F7F4] disabled:text-[#999] transition-colors"
          />
          {mode === 'edit' && (
            <button
              onClick={() => setSlugLocked((v) => !v)}
              className="text-xs text-[#999] underline underline-offset-2"
            >
              {slugLocked ? '수정' : '잠금'}
            </button>
          )}
        </div>
        <p className="text-xs text-[#999] mt-1.5">이미지 업로드 경로에 사용됩니다. 영문 소문자, 하이픈만 허용.</p>
      </Section>

      {/* STEP 2: 이미지 업로드 */}
      <Section label="이미지 업로드" step={2}>
        <div className="flex flex-wrap gap-3 mb-3">
          {images.map((img, idx) => (
            <div key={idx} className="relative group">
              <div className="w-24 h-24 bg-[#F8F7F4] rounded border border-[#E8E4DC] overflow-hidden">
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <input
                type="text"
                value={img.alt}
                onChange={(e) => updateImageAlt(idx, e.target.value)}
                placeholder="alt 텍스트"
                className="mt-1 w-24 text-xs border border-[#E8E4DC] rounded px-1.5 py-1 focus:outline-none focus:border-[#1a1a1a]"
              />
              <button
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full text-xs hidden group-hover:flex items-center justify-center"
              >
                x
              </button>
            </div>
          ))}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => {
            if (!slug) { setError('slug를 먼저 입력해주세요.'); return; }
            fileInputRef.current?.click();
          }}
          disabled={uploading}
          className="border border-[#E8E4DC] rounded px-4 py-2 text-sm text-[#666] hover:border-[#1a1a1a] hover:text-[#1a1a1a] disabled:opacity-50 transition-colors"
        >
          {uploading ? '업로드 중...' : '이미지 선택'}
        </button>
      </Section>

      {/* STEP 3: Claude 분석 결과 */}
      {(analyzing || claudeResult) && (
        <Section label="Claude 추천 결과" step={3}>
          {analyzing ? (
            <p className="text-sm text-[#999]">이미지 분석 중...</p>
          ) : claudeResult ? (
            <div className="bg-[#F8F7F4] border border-[#E8E4DC] rounded-lg p-4 space-y-2">
              <Row label="추천 이름" value={claudeResult.suggestedName} />
              <Row label="영문명" value={claudeResult.suggestedNameEn} />
              <Row label="태그라인" value={claudeResult.tagline} />
              <Row label="짧은 소개" value={claudeResult.description} />
              <Row label="상세 소개" value={claudeResult.longDescription} />
              <button
                onClick={applyClaudeResult}
                className="mt-3 bg-[#1a1a1a] text-white text-xs font-medium px-4 py-2 rounded hover:bg-[#333] transition-colors"
              >
                전체 적용
              </button>
            </div>
          ) : null}
        </Section>
      )}

      {/* STEP 4: 상품 정보 */}
      <Section label="상품 정보" step={4}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="상품명 (한글)" required>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="티타늄 플렉시블 주름관"
            />
          </Field>
          <Field label="상품명 (영문)">
            <input
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              className={inputClass}
              placeholder="TITANIUM FLEXIBLE TUBE"
            />
          </Field>
        </div>

        <Field label="태그라인" className="mt-4">
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className={inputClass}
            placeholder="15자 이내 핵심 가치"
            maxLength={15}
          />
        </Field>

        <Field label="짧은 소개" className="mt-4">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${inputClass} resize-none`}
            rows={2}
            placeholder="40자 이내 제품 소개"
            maxLength={40}
          />
        </Field>

        <Field label="상세 소개" className="mt-4">
          <textarea
            value={longDescription}
            onChange={(e) => setLongDescription(e.target.value)}
            className={`${inputClass} resize-none`}
            rows={3}
            placeholder="80자 이내 상세 설명"
            maxLength={80}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <Field label="가격 (원)">
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={inputClass}
              placeholder="0"
              min={0}
            />
          </Field>
          <Field label="외부 URL">
            <input
              type="url"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              className={inputClass}
              placeholder="https://..."
            />
          </Field>
        </div>

        <div className="flex items-center gap-6 mt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isNew}
              onChange={(e) => setIsNew(e.target.checked)}
              className="w-4 h-4 rounded border-[#E8E4DC]"
            />
            <span className="text-sm text-[#1a1a1a]">NEW 뱃지</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isBestseller}
              onChange={(e) => setIsBestseller(e.target.checked)}
              className="w-4 h-4 rounded border-[#E8E4DC]"
            />
            <span className="text-sm text-[#1a1a1a]">BESTSELLER 뱃지</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded border-[#E8E4DC]"
            />
            <span className="text-sm text-[#1a1a1a]">노출 활성화</span>
          </label>
        </div>
      </Section>

      {/* STEP 5: 스펙 */}
      <Section label="스펙" step={5}>
        <div className="space-y-2">
          {specs.map((spec, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={spec.label}
                onChange={(e) => updateSpec(idx, 'label', e.target.value)}
                placeholder="항목 (예: 재질)"
                className={`${inputClass} flex-1`}
              />
              <input
                type="text"
                value={spec.value}
                onChange={(e) => updateSpec(idx, 'value', e.target.value)}
                placeholder="값 (예: Grade 2 Titanium)"
                className={`${inputClass} flex-[2]`}
              />
              <button
                onClick={() => removeSpec(idx)}
                disabled={specs.length === 1}
                className="text-[#999] hover:text-red-500 disabled:opacity-30 text-lg leading-none px-1"
              >
                x
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addSpec}
          className="mt-3 text-xs text-[#666] border border-[#E8E4DC] rounded px-3 py-1.5 hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors"
        >
          + 스펙 추가
        </button>
      </Section>

      {/* STEP 6: 초기 재고 (new 모드만) */}
      {mode === 'new' && (
        <Section label="초기 재고" step={6}>
          <div className="grid grid-cols-7 gap-2">
            {SIZES.map((size) => (
              <div key={size} className="text-center">
                <p className="text-xs text-[#999] mb-1">{size}</p>
                <input
                  type="number"
                  value={inventory[size] ?? 0}
                  onChange={(e) =>
                    setInventory((prev) => ({
                      ...prev,
                      [size]: Math.max(0, parseInt(e.target.value) || 0),
                    }))
                  }
                  min={0}
                  className="w-full text-center border border-[#E8E4DC] rounded px-1 py-1.5 text-sm focus:outline-none focus:border-[#1a1a1a] transition-colors"
                />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* 에러 + 저장 */}
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#1a1a1a] text-white text-sm font-medium px-6 py-2.5 rounded hover:bg-[#333] disabled:opacity-50 transition-colors"
        >
          {saving ? '저장 중...' : mode === 'new' ? '상품 등록' : '변경 저장'}
        </button>
        <button
          onClick={() => router.back()}
          className="text-sm text-[#999] hover:text-[#1a1a1a] transition-colors"
        >
          취소
        </button>
      </div>
    </div>
  );
}

// ── 헬퍼 컴포넌트

function Section({
  label,
  step,
  children,
}: {
  label: string;
  step: number;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-[#E8E4DC] rounded-lg p-6">
      <div className="flex items-center gap-3 mb-5">
        <span className="w-6 h-6 rounded-full bg-[#1a1a1a] text-white text-xs flex items-center justify-center font-semibold shrink-0">
          {step}
        </span>
        <h2 className="text-xs tracking-widest uppercase text-[#1a1a1a] font-semibold">{label}</h2>
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  required,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="block text-xs tracking-widest uppercase text-[#999] mb-1.5">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className="text-xs text-[#999] w-20 shrink-0 pt-0.5">{label}</span>
      <span className="text-[#1a1a1a]">{value}</span>
    </div>
  );
}

const inputClass =
  'w-full border border-[#E8E4DC] rounded px-3 py-2 text-sm text-[#1a1a1a] placeholder-[#bbb] focus:outline-none focus:border-[#1a1a1a] transition-colors';

// base64 변환 헬퍼
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // data:image/...;base64, 접두사 제거
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
