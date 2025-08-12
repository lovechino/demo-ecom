"use client";
import { ProductModel } from "@/models/product.model";
import { CartViewModel } from "@/viewmodels/CartViewModel";
import { useState } from "react";
import Link from "next/link";

export default function ProductCard({ product }: { product: ProductModel }) {
  const [vm] = useState(() => new CartViewModel());
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await vm.insertCart(product.getId(), 1);
      // Có thể thêm thông báo thành công ở đây
    } catch (error) {
      console.error("Error adding to cart:", error);
      // Có thể thêm thông báo lỗi ở đây
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="flex flex-col rounded-lg border p-3">
      <Link
        href={`/products/${product.getId()}`}
        className="relative mb-3 block aspect-square w-full overflow-hidden rounded-md bg-neutral-100"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.getImageUrl()}
          alt={product.getName()}
          className="h-full w-full object-cover"
        />
      </Link>
      <div className="flex-1">
        <Link
          href={`/products/${product.getId()}`}
          className="line-clamp-2 text-sm font-medium hover:underline"
        >
          {product.getName()}
        </Link>
        <div className="mt-1 text-xs text-neutral-500">{product.getCategory()}</div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="text-base font-semibold">{product.getPrice().toLocaleString()} đ</div>
        <button
          className="rounded bg-black px-3 py-1.5 text-sm text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          {isAdding ? "Đang thêm..." : "Thêm vào giỏ"}
        </button>
      </div>
    </div>
  );
}


