"use client";
import ProductGrid from "./components/ProductGrid";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl">
      <Suspense fallback={<div className="p-4 text-sm text-neutral-500">Đang tải sản phẩm...</div>}>
        <ProductGrid />
      </Suspense>
    </main>
  );
}
