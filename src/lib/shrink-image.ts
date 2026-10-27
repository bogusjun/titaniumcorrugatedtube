/**
 * 첨부 사진 줄이기 (브라우저 전용) — 1MB 넘는 JPG·PNG 를 긴 변 2400px JPEG 로 다시 굽는다.
 * 줄여도 작아지지 않거나 실패하면 원본을 그대로 돌려준다.
 */

const SHRINK_OVER_BYTES = 1024 * 1024;
const MAX_EDGE = 2400;

export async function shrinkImage(file: File): Promise<File> {
  if (!/\.(jpe?g|png)$/i.test(file.name) || file.size <= SHRINK_OVER_BYTES) return file;

  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = url;
    });

    const scale = Math.min(1, MAX_EDGE / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    // PNG 투명 배경이 JPEG 에서 검게 되지 않도록 흰 바탕을 깐다
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.(jpe?g|png)$/i, ".jpg"), { type: "image/jpeg" });
  } catch {
    return file;
  } finally {
    URL.revokeObjectURL(url);
  }
}
