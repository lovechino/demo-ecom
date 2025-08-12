import type { Metadata } from "next";
import ProductDetailClient from "./ProductDetailClient";
import { ProductService } from "@/services/products.services";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const service = new ProductService();
  try {
    const list = await service.getProductDetail(id);
    const product = list[0];
    if (product) {
      return {
        title: product.getName(),
        description: product.getDescription(),
        openGraph: {
          title: product.getName(),
          description: product.getDescription(),
          images: [{ url: product.getImageUrl() }],
        },
        alternates: {
          canonical: `/products/${id}`,
        },
      };
    }
  } catch {}
  return { title: "Sản phẩm", description: "Chi tiết sản phẩm" };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductDetailClient id={id} />;
}


