"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/types";
import { useCart } from "@/context/CartContext";

const fmt = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(n);

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <Link href={`/productos/${product.id}`} className="group block">
      <article className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="relative h-56 bg-[#F5E6D8] overflow-hidden">
          {product.images?.[0] ? (
            <Image src={product.images[0]} alt={product.name} fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
          ) : (
            <div className="flex items-center justify-center h-full text-5xl select-none">🎁</div>
          )}
          {product.featured && (
            <span className="absolute top-3 left-3 bg-[#D4879E] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3 fill-white" /> Destacado
            </span>
          )}
          <button onClick={handleAdd}
            className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-[#D4879E] p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-[#D4879E] hover:text-white shadow-md">
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4">
          <span className="text-[11px] text-[#C4A882] font-semibold uppercase tracking-widest">{product.category}</span>
          <h3 className="font-display font-bold text-[#8B5E52] text-lg leading-tight mt-0.5">{product.name}</h3>
          <p className="text-[#A08070] text-sm mt-1.5 line-clamp-2 leading-relaxed">{product.description}</p>
          <div className="flex items-center justify-between mt-4">
            <span className="font-display font-bold text-[#D4879E] text-2xl">{fmt(product.price)}</span>
            <button onClick={handleAdd}
              className={`text-sm px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
                added ? "bg-green-100 text-green-700" : "bg-[#F5E6D8] text-[#8B5E52] hover:bg-[#D4879E] hover:text-white"
              }`}>
              {added ? "✓ Listo" : "Agregar"}
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}