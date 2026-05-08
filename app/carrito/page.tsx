"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

const fmt = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(n);

export default function CarritoPage() {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();

  const handleWhatsApp = () => {
    const wa = process.env.NEXT_PUBLIC_WHATSAPP;
    let msg = "🌸 *Hola! Quiero hacer un pedido en Magna Regalos* 🌸\n\n";
    msg += "*Mis productos:*\n";
    items.forEach((i) => { msg += `• ${i.product.name} ×${i.quantity} = ${fmt(i.product.price * i.quantity)}\n`; });
    msg += `\n*Total productos:* ${fmt(total)}`;
    msg += "\n\n_El envío se coordina por este medio según tu ciudad._";
    msg += "\n\n*Datos de entrega:*\n• Nombre: \n• Ciudad: \n• Dirección: \n• Teléfono: ";
    window.open(`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#FDF6F0] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/productos" className="inline-flex items-center gap-1.5 text-[#A08070] hover:text-[#D4879E] text-sm font-medium transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Seguir comprando
        </Link>
        <h1 className="font-display font-bold text-3xl text-[#8B5E52] mb-8">Mi carrito</h1>

        {items.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl">
            <ShoppingBag className="w-16 h-16 text-[#E8D5C4] mx-auto mb-4" />
            <p className="text-[#A08070] text-lg mb-6">Tu carrito está vacío</p>
            <Link href="/productos" className="inline-flex items-center gap-2 bg-[#D4879E] text-white px-7 py-3 rounded-full font-semibold hover:bg-[#C4687E] transition-colors">
              Ver catálogo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="bg-white rounded-2xl p-4 shadow-sm flex gap-4">
                  <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-[#F5E6D8]">
                    {item.product.images?.[0] ? (
                      <Image src={item.product.images[0]} alt={item.product.name} width={96} height={96} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">🎁</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-[#8B5E52] text-base">{item.product.name}</h3>
                    <p className="text-[#C4A882] text-sm">{item.product.category}</p>
                    <p className="text-[#D4879E] font-bold text-lg mt-1">{fmt(item.product.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 bg-[#F5E6D8] rounded-full flex items-center justify-center hover:bg-[#E8D5C4] transition-colors">
                        <Minus className="w-3.5 h-3.5 text-[#8B5E52]" />
                      </button>
                      <span className="w-8 text-center font-semibold text-[#8B5E52]">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 bg-[#F5E6D8] rounded-full flex items-center justify-center hover:bg-[#E8D5C4] transition-colors">
                        <Plus className="w-3.5 h-3.5 text-[#8B5E52]" />
                      </button>
                      <span className="ml-3 text-[#8B5E52] font-medium text-sm">= {fmt(item.product.price * item.quantity)}</span>
                      <button onClick={() => removeItem(item.product.id)} className="ml-auto text-[#C4A882] hover:text-red-500 transition-colors p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={clearCart} className="text-sm text-[#C4A882] hover:text-red-400 transition-colors">Vaciar carrito</button>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                <h2 className="font-display font-bold text-[#8B5E52] text-xl mb-5">Resumen</h2>
                <div className="space-y-2 mb-4">
                  {items.map((i) => (
                    <div key={i.product.id} className="flex justify-between text-sm text-[#A08070]">
                      <span className="truncate mr-2">{i.product.name} ×{i.quantity}</span>
                      <span className="flex-shrink-0">{fmt(i.product.price * i.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#E8D5C4] pt-4 mb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-[#8B5E52]">Total productos</span>
                    <span className="font-display font-bold text-[#D4879E] text-2xl">{fmt(total)}</span>
                  </div>
                </div>
                <p className="text-xs text-[#C4A882] mb-5">+ Envío a coordinar por WhatsApp</p>
                <button onClick={handleWhatsApp}
                  className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#1ebe5d] transition-colors">
                  💬 Finalizar pedido por WhatsApp
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}