import type { Metadata } from "next";
import LocalizedProductDetail, {
  localizedProductMetadata,
  localizedProductParams,
} from "@/components/product/LocalizedProductDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

// products.json 에 없는 주소는 404
export const dynamicParams = false;

export function generateStaticParams() {
  return localizedProductParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return localizedProductMetadata(slug, "en");
}

export default async function EnProductDetailPage({ params }: Props) {
  const { slug } = await params;
  return <LocalizedProductDetail slug={slug} locale="en" />;
}
