"use client";

import Link from "next/link";
import { ShoppingCart, Menu, X, Heart } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { itemCount, setIsOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-[#FDF6F0]/95 backdrop-blur-sm border-b border-[#E8D5C4]">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Heart className="w-5 h-5 text-[#D4879E] fill-[#D4879E] group-hover:scale-110 transition-transform" />
          <span className="font-display font-bold text-xl text-[#8B5E52]">
            Magna Regalos
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          <Link href="/" className="text-sm font-medium text-[#8B6F5E] hover:text-[#D4879E] transition-colors">
            Inicio
          </Link>
          <Link href="/productos" className="text-sm font-medium text-[#8B6F5E] hover:text-[#D4879E] transition-colors">
            Catálogo
          </Link>
          <a href="https://instagram.com/magnaregalos/" target="_blank" rel="noopener noreferrer"
            className="text-sm font-medium text-[#8B6F5E] hover:text-[#D4879E] transition-colors">
            Instagram
          </a>
          <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}`} target="_blank" rel="noopener noreferrer"
            className="bg-[#D4879E] text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-[#C4687E] transition-colors">
            Pedir ahora
          </a>
        </nav>

        <div className="flex items-center gap-1">
          <button onClick={() => setIsOpen(true)}
            className="relative p-2.5 text-[#8B5E52] hover:text-[#D4879E] transition-colors"
            aria-label="Carrito">
            <ShoppingCart className="w-6 h-6" />
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#D4879E] text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>
          <button onClick={() => setOpen(!open)} className="md:hidden p-2.5 text-[#8B5E52]" aria-label="Menú">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-[#E8D5C4] bg-[#FDF6F0] px-4 py-4 space-y-1">
          <Link href="/" onClick={() => setOpen(false)} className="block py-2.5 text-[#8B6F5E] font-medium border-b border-[#F5E6D8]">Inicio</Link>
          <Link href="/productos" onClick={() => setOpen(false)} className="block py-2.5 text-[#8B6F5E] font-medium border-b border-[#F5E6D8]">Catálogo</Link>
          <a href="https://instagram.com/magnaregalos/" target="_blank" rel="noopener noreferrer" className="block py-2.5 text-[#8B6F5E] font-medium border-b border-[#F5E6D8]">Instagram</a>
          <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}`} target="_blank" rel="noopener noreferrer"
            className="block mt-3 bg-[#D4879E] text-white text-center py-3 rounded-2xl font-semibold">
            Pedir por WhatsApp 💬
          </a>
        </div>
      )}
    </header>
  );
}