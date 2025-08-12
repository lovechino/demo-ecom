"use client";
import { useEffect, useState } from "react";
import { CartViewModel } from "@/viewmodels/CartViewModel";
import { CartModel } from "@/models/cart.model";
import { ProductService } from "@/services/products.services";
import { ProductModel } from "@/models/product.model";

export default function CartPage() {
  const [vm] = useState(() => new CartViewModel());
  const [productService] = useState(() => new ProductService());
  const [cartItems, setCartItems] = useState<CartModel[]>([]);
  const [productMap, setProductMap] = useState<Record<string, ProductModel>>({});
  const [productsLoading, setProductsLoading] = useState(false);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  // Update selectAll when selectedItems changes
  useEffect(() => {
    if (cartItems.length > 0 && selectedItems.size === cartItems.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedItems, cartItems]);

  const loadCart = async () => {
    await vm.getCart();
    if (vm.cart) {
      setCartItems(vm.cart);
      setSelectedItems(new Set());
      await loadProductDetails(vm.cart);
    }
  };

  const loadProductDetails = async (items: CartModel[]) => {
    const uniqueIds = Array.from(new Set(items.map((it) => it.getProductId())));
    if (uniqueIds.length === 0) {
      setProductMap({});
      return;
    }

    setProductsLoading(true);
    try {
      const results = await Promise.all(
        uniqueIds.map(async (id) => {
          try {
            const list = await productService.getProductDetail(id);
            const product = list[0];
            if (product) return [id, product] as const;
          } catch {}
          return [id, undefined] as const;
        })
      );
      const next: Record<string, ProductModel> = {};
      for (const [id, product] of results) {
        if (product) next[id] = product;
      }
      setProductMap(next);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleAddToCart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId.trim() || quantity <= 0) return;

    try {
      await vm.insertCart(productId.trim(), quantity);
      setProductId("");
      setQuantity(1);
      setShowAddForm(false);
      await loadCart();
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleUpdateQuantity = async (cartId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await vm.deleteCart(cartId);
    } else {
      await vm.updateCart(cartId, newQuantity);
    }
    await loadCart();
  };

  const handleDeleteItem = async (cartId: string) => {
    await vm.deleteCart(cartId);
    await loadCart();
  };

  const handleClearCart = async () => {
    for (const item of cartItems) {
      await vm.deleteCart(item.getId());
    }
    await loadCart();
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartItems.map((item) => item.getId())));
    }
  };

  const handleSelectItem = (cartId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(cartId)) {
      newSelected.delete(cartId);
    } else {
      newSelected.add(cartId);
    }
    setSelectedItems(newSelected);
  };

  const handleCheckout = () => {
    alert("Hệ thống đang bảo trì");
  };

  if (vm.loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="text-center text-neutral-500">Đang tải giỏ hàng...</div>
      </main>
    );
  }

  if (vm.error) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="text-center text-red-600">Lỗi: {vm.error}</div>
        <button
          onClick={loadCart}
          className="mt-4 rounded bg-black px-4 py-2 text-white"
        >
          Thử lại
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Giỏ hàng</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          {showAddForm ? 'Ẩn form' : 'Thêm sản phẩm'}
        </button>
      </div>

      {showAddForm && (
        <div className="mb-6 rounded border p-4 bg-gray-50">
          <h2 className="mb-3 text-lg font-medium">Thêm sản phẩm vào giỏ hàng</h2>
          <form onSubmit={handleAddToCart} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product ID
              </label>
              <input
                type="text"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                placeholder="Nhập Product ID"
                className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="w-32">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số lượng
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                min="1"
                className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={vm.loading || !productId.trim() || quantity <= 0}
              className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {vm.loading ? 'Đang thêm...' : 'Thêm vào giỏ'}
            </button>
          </form>
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="text-sm text-neutral-500">Chưa có sản phẩm nào.</div>
      ) : (
        <div className="grid gap-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded border">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label className="text-sm font-medium text-gray-700">
              Chọn tất cả sản phẩm
            </label>
            <span className="text-sm text-gray-500">
              ({selectedItems.size}/{cartItems.length} sản phẩm được chọn)
            </span>
          </div>

          {cartItems.map((item) => {
            const product = productMap[item.getProductId()];
            return (
              <div key={item.getId()} className="flex items-center gap-4 rounded border p-3">
                <input
                  type="checkbox"
                  checked={selectedItems.has(item.getId())}
                  onChange={() => handleSelectItem(item.getId())}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product?.getImageUrl() || "/vercel.svg"}
                  alt={product?.getName() || item.getProductId()}
                  className="h-16 w-16 rounded object-cover bg-neutral-100"
                />

                <div className="flex-1">
                  <div className="font-medium">
                    {product?.getName() || `Sản phẩm ${item.getProductId()}`}
                  </div>
                  <div className="text-sm text-neutral-500">
                    {productsLoading && !product ? "Đang tải..." : `${product?.getPrice()?.toLocaleString?.() || "—"} đ`}
                  </div>
                  <div className="text-xs text-neutral-400">
                    Added: {item.getCreatedAt().toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="rounded border px-2 py-1"
                    onClick={() => handleUpdateQuantity(item.getId(), item.getQuantity() - 1)}
                    disabled={vm.loading}
                  >
                    -
                  </button>
                  <span>{item.getQuantity()}</span>
                  <button
                    className="rounded border px-2 py-1"
                    onClick={() => handleUpdateQuantity(item.getId(), item.getQuantity() + 1)}
                    disabled={vm.loading}
                  >
                    +
                  </button>
                </div>
                <button
                  className="rounded border px-2 py-1 text-red-600"
                  onClick={() => handleDeleteItem(item.getId())}
                  disabled={vm.loading}
                >
                  Xóa
                </button>
              </div>
            );
          })}

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center gap-4">
              <div className="text-lg font-semibold">
                Tổng: {cartItems.length} sản phẩm
              </div>
              <div className="text-sm text-gray-600">
                Đã chọn: {selectedItems.size} sản phẩm
              </div>
            </div>
            <div className="flex gap-3">
              <button
                className="rounded bg-black px-4 py-2 text-white"
                onClick={handleClearCart}
                disabled={vm.loading}
              >
                {vm.loading ? 'Đang xử lý...' : 'Xóa giỏ hàng'}
              </button>
              <button
                className="rounded bg-green-600 px-6 py-2 text-white font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleCheckout}
                disabled={selectedItems.size === 0 || vm.loading}
              >
                Thanh toán
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}



