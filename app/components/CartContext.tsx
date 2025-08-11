"use client";
import React, { createContext, useContext, useMemo, useState } from "react";
import { ProductModel } from "@/models/product.model";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
  addToCart: (product: ProductModel, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: ProductModel, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((it) => it.id === product.getId());
      if (existing) {
        return prev.map((it) =>
          it.id === product.getId()
            ? { ...it, quantity: it.quantity + quantity }
            : it
        );
      }
      return [
        ...prev,
        {
          id: product.getId(),
          name: product.getName(),
          price: product.getPrice(),
          imageUrl: product.getImageUrl(),
          quantity,
        },
      ];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((it) => it.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((it) => (it.id === productId ? { ...it, quantity } : it))
        .filter((it) => it.quantity > 0)
    );
  };

  const clearCart = () => setItems([]);

  const { totalPrice, totalQuantity } = useMemo(() => {
    return items.reduce(
      (acc, it) => {
        acc.totalQuantity += it.quantity;
        acc.totalPrice += it.price * it.quantity;
        return acc;
      },
      { totalQuantity: 0, totalPrice: 0 }
    );
  }, [items]);

  const value: CartContextValue = {
    items,
    totalPrice,
    totalQuantity,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}


