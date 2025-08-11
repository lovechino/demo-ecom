"use client";
import { useCart } from "@/app/components/CartContext";

export default function CartPage() {
  const { items, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-semibold">Giỏ hàng</h1>
      {items.length === 0 ? (
        <div className="text-sm text-neutral-500">Chưa có sản phẩm nào.</div>
      ) : (
        <div className="grid gap-4">
          {items.map((it) => (
            <div key={it.id} className="flex items-center gap-4 rounded border p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.imageUrl} alt={it.name} className="h-16 w-16 rounded object-cover" />
              <div className="flex-1">
                <div className="font-medium">{it.name}</div>
                <div className="text-sm text-neutral-500">{it.price.toLocaleString()} đ</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="rounded border px-2 py-1" onClick={() => updateQuantity(it.id, it.quantity - 1)}>-</button>
                <span>{it.quantity}</span>
                <button className="rounded border px-2 py-1" onClick={() => updateQuantity(it.id, it.quantity + 1)}>+</button>
              </div>
              <button className="rounded border px-2 py-1" onClick={() => removeFromCart(it.id)}>Xóa</button>
            </div>
          ))}
          <div className="flex items-center justify-between border-t pt-4">
            <div className="text-lg font-semibold">Tổng: {totalPrice.toLocaleString()} đ</div>
            <button className="rounded bg-black px-4 py-2 text-white" onClick={clearCart}>Xóa giỏ hàng</button>
          </div>
        </div>
      )}
    </main>
  );
}



