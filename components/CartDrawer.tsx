"use client";

import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

const fmt = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(n);

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, total, itemCount, clearCart } = useCart();

  const handleWhatsApp = () => {
    const wa = process.env.NEXT_PUBLIC_WHATSAPP;
    let msg = "🌸 *Hola! Quiero hacer un pedido en Magna Regalos* 🌸\n\n";
    msg += "*Productos:*\n";
    items.forEach((i) => {
      msg += `• ${i.product.name} ×${i.quantity} → ${fmt(i.product.price * i.quantity)}\n`;
    });
    msg += `\n*Total productos:* ${fmt(total)}`;
    msg += "\n\n_El costo del envío se coordina por WhatsApp según tu ciudad._";
    msg += "\n\n*Mis datos de entrega:*\n• Nombre: \n• Ciudad: \n• Dirección: ";
    window.open(`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      <aside className="fixed right-0 top-0 h-full w-full max-w-[420px] z-50 bg-[#FDF6F0] shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8D5C4]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#D4879E]" />
            <h2 className="font-display font-bold text-[#8B5E52] text-lg">Tu carrito ({itemCount})</h2>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-[#F5E6D8] transition-colors">
            <X className="w-5 h-5 text-[#8B5E52]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="text-6xl">🛍️</div>
              <p className="text-[#C4A882] font-medium">Tu carrito está vacío</p>
              <Link href="/productos" onClick={() => setIsOpen(false)}
                className="bg-[#D4879E] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#C4687E] transition-colors">
                Ver catálogo →
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="flex gap-3 bg-white rounded-2xl p-3 shadow-sm">
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-[#F5E6D8]">
                  {item.product.images?.[0] ? (
                    <Image src={item.product.images[0]} alt={item.product.name} width={80} height={80} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">🎁</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#8B5E52] text-sm leading-tight line-clamp-1">{item.product.name}</h3>
                  <p className="text-[#D4879E] font-bold text-sm mt-0.5">{fmt(item.product.price)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-7 h-7 bg-[#F5E6D8] rounded-full flex items-center justify-center hover:bg-[#E8D5C4] transition-colors">
                      <Minus className="w-3 h-3 text-[#8B5E52]" />
                    </button>
                    <span className="text-[#8B5E52] font-semibold text-sm w-5 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-7 h-7 bg-[#F5E6D8] rounded-full flex items-center justify-center hover:bg-[#E8D5C4] transition-colors">
                      <Plus className="w-3 h-3 text-[#8B5E52]" />
                    </button>
                    <button onClick={() => removeItem(item.product.id)} className="ml-auto p-1 text-[#C4A882] hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t border-[#E8D5C4] space-y-3 bg-white">
            <div className="flex justify-between items-center">
              <span className="text-[#8B6F5E] font-medium text-sm">Subtotal productos</span>
              <span className="font-display font-bold text-[#8B5E52] text-xl">{fmt(total)}</span>
            </div>
            <p className="text-xs text-[#A08070] bg-[#FDF6F0] rounded-xl p-3 leading-relaxed">
              🚚 El costo del envío se coordina por WhatsApp según tu ciudad y dirección.
            </p>
            <button onClick={handleWhatsApp}
              className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-bold text-sm hover:bg-[#1ebe5d] transition-colors flex items-center justify-center gap-2">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white flex-shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Finalizar pedido por WhatsApp
            </button>
            <button onClick={clearCart} className="w-full text-[#C4A882] text-xs py-1 hover:text-red-400 transition-colors">
              Vaciar carrito
            </button>
          </div>
        )}
      </aside>
    </>
  );
}