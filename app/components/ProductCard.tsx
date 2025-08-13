"use client";
import { ProductModel } from "@/models/product.model";
import { CartViewModel } from "@/viewmodels/CartViewModel";
import { useState, useCallback, memo } from "react";
import Link from "next/link";
import Image from "next/image";

// Memoized ProductCard for better performance
const ProductCard = memo(({ product }: { product: ProductModel }) => {
  const [vm] = useState(() => new CartViewModel());
  const [isAdding, setIsAdding] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Optimized add to cart function
  const handleAddToCart = useCallback(async () => {
    if (isAdding) return;
    
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
  }, [isAdding, vm, product]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  return (
    <div className="flex flex-col rounded-lg border p-3 hover:shadow-lg transition-shadow duration-200">
      <Link
        href={`/products/${product.getId()}`}
        className="relative mb-3 block aspect-square w-full overflow-hidden rounded-md bg-neutral-100"
      >
        {/* Optimized image loading with Next.js Image */}
        <div className="relative h-full w-full">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-md" />
          )}
          <Image
            src={product.getImageUrl()}
            alt={product.getName()}
            fill
            className={`object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleImageLoad}
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            priority={false}
            loading="lazy"
          />
        </div>
      </Link>
      
      <div className="flex-1">
        <Link
          href={`/products/${product.getId()}`}
          className="line-clamp-2 text-sm font-medium hover:underline transition-colors duration-200"
        >
          {product.getName()}
        </Link>
        <div className="mt-1 text-xs text-neutral-500">{product.getCategory()}</div>
      </div>
      
      <div className="mt-2 flex items-center justify-between">
        <div className="text-base font-semibold text-green-600">
          {product.getPrice().toLocaleString('vi-VN')} ₫
        </div>
        <button
          className="rounded bg-black px-3 py-1.5 text-sm text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          {isAdding ? "Đang thêm..." : "Thêm vào giỏ"}
        </button>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;


