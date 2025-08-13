"use client";
import { useEffect, useMemo, useState, useCallback } from "react";
import { ProductViewModel } from "@/viewmodels/ProductViewModel";
import ProductCard from "./ProductCard";
import { useSearchParams } from "next/navigation";

// Memoized ProductGrid for better performance
const ProductGrid = () => {
  const [vm] = useState(() => new ProductViewModel());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const categoryId = searchParams?.get("category") || null;

  // Memoized products filtering
  const products = useMemo(() => {
    const list = vm.products ?? [];
    if (!categoryId) return list;
    return list.filter((p) => p.getCategoryId() === categoryId);
  }, [vm.products, categoryId]);

  // Optimized loading function
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      await vm.getProducts();
      setError(vm.error);
    } finally {
      setLoading(false);
    }
  }, [vm]);

  useEffect(() => {
    let mounted = true;
    
    const run = async () => {
      if (mounted) {
        await loadProducts();
      }
    };
    
    run();
    
    return () => {
      mounted = false;
    };
  }, [loadProducts]);

  // Loading skeleton with better UX
  if (loading) {
    return (
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 h-32 rounded-lg mb-2"></div>
              <div className="bg-gray-200 h-4 rounded mb-1"></div>
              <div className="bg-gray-200 h-3 rounded mb-2 w-2/3"></div>
              <div className="bg-gray-200 h-8 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="text-red-600 mb-2">Có lỗi xảy ra khi tải sản phẩm</div>
        <button 
          onClick={loadProducts}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Không tìm thấy sản phẩm nào
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {products.map((product) => (
        <ProductCard key={product.getId()} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;


