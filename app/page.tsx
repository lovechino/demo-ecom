"use client";
import ProductGrid from "./components/ProductGrid";
import BannerSlide from "./components/BannerSlide";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl">
      {/* Banner Slide Section */}
      <Suspense fallback={<div className="w-full h-64 bg-gray-200 animate-pulse flex items-center justify-center">
        <div className="text-gray-500">Đang tải banner...</div>
      </div>}>
        <BannerSlide />
      </Suspense>
      
      {/* Product Grid Section */}
      <Suspense fallback={<div className="p-4 text-sm text-neutral-500">Đang tải sản phẩm...</div>}>
        <ProductGrid />
      </Suspense>
    </main>
  );
}
