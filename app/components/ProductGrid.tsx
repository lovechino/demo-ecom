"use client";
import { useEffect, useMemo, useState } from "react";
import { ProductViewModel } from "@/viewmodels/ProductViewModel";
import ProductCard from "./ProductCard";
import { useSearchParams } from "next/navigation";

export default function ProductGrid() {
  const [vm] = useState(() => new ProductViewModel());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const categoryId = searchParams.get("category");

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        setLoading(true);
        await vm.getProducts();
        if (mounted) setError(vm.error);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [vm]);

  const products = useMemo(() => {
    const list = vm.products ?? [];
    if (!categoryId) return list;
    return list.filter((p) => p.getCategoryId() === categoryId);
  }, [vm.products, categoryId]);

  if (loading) return <div className="p-4 text-sm text-neutral-500">Đang tải sản phẩm...</div>;
  if (error) return <div className="p-4 text-sm text-red-600">{String(error)}</div>;

  return (
    <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {products.map((p) => (
        <ProductCard key={p.getId()} product={p} />
      ))}
    </div>
  );
}


