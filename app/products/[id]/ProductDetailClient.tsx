"use client";
import { useEffect, useState } from "react";
import { ProductModel } from "@/models/product.model";
import { useCart } from "@/app/components/CartContext";
import { ProductViewModel } from "@/viewmodels/ProductViewModel";
import ProductCard from "@/app/components/ProductCard";

export default function ProductDetailClient({ id }: { id: string }) {
  const [product, setProduct] = useState<ProductModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const [vm] = useState(() => new ProductViewModel());
  const [listVm] = useState(() => new ProductViewModel());
  const [related, setRelated] = useState<ProductModel[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!id) return;
      try {
        setLoading(true);
        await vm.getProductDetail(String(id));
        if (mounted) {
          setError(vm.error);
          const detail = Array.isArray(vm.product) ? vm.product[0] ?? null : (vm.product as unknown as ProductModel | null);
          setProduct(detail);
        }
      } catch (err) {
        if (mounted) setError(String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [id, vm]);

  // Load related products after the main product is available
  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!product) return;
      try {
        setRelatedLoading(true);
        await listVm.getProducts();
        const all = listVm.products ?? [];
        const relatedItems = all
          .filter((p) => p.getCategoryId() === product.getCategoryId() && p.getId() !== product.getId())
          .slice(0, 8);
        if (mounted) setRelated(relatedItems);
      } finally {
        if (mounted) setRelatedLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [product, listVm]);

  if (loading) return <div className="p-4 text-sm text-neutral-500">Đang tải...</div>;
  if (error) return <div className="p-4 text-sm text-red-600">{error}</div>;
  if (!product) return null;

  return (
    <main className="mx-auto max-w-6xl p-4">
      <div className="grid gap-8 md:grid-cols-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.getImageUrl()}
          alt={product.getName()}
          className="w-full rounded-xl border object-cover shadow-sm"
        />

        <div className="space-y-5 rounded-xl border p-6 shadow-sm">
          <h1 className="text-3xl font-semibold tracking-tight">{product.getName()}</h1>
          <div className="text-sm text-neutral-500">Danh mục: {product.getCategory()}</div>
          <div className="text-neutral-700 leading-relaxed">{product.getDescription()}</div>
          <div className="text-2xl font-bold">{product.getPrice()?.toLocaleString() || 0} đ</div>
          <div className="flex items-center gap-3">
            <button
              className="rounded bg-black px-5 py-2.5 text-white hover:opacity-90"
              onClick={() => addToCart(product, 1)}
            >
              Thêm vào giỏ
            </button>
          </div>
        </div>
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Sản phẩm liên quan</h2>
        </div>
        {relatedLoading ? (
          <div className="p-2 text-sm text-neutral-500">Đang tải sản phẩm liên quan...</div>
        ) : related.length === 0 ? (
          <div className="p-2 text-sm text-neutral-500">Chưa có sản phẩm liên quan.</div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {related.map((p) => (
              <ProductCard key={p.getId()} product={p} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
