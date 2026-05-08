"use client";

import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handle = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <button onClick={handle} disabled={product.stock === 0}
      className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-all ${
        product.stock === 0 ? "bg-gray-100 text-gray-400 cursor-not-allowed"
        : added ? "bg-green-500 text-white"
        : "bg-[#D4879E] text-white hover:bg-[#C4687E] shadow-md shadow-[#D4879E]/30"
      }`}>
      <ShoppingCart className="w-5 h-5" />
      {product.stock === 0 ? "Sin disponibilidad" : added ? "✓ Agregado al carrito" : "Agregar al carrito"}
    </button>
  );
}