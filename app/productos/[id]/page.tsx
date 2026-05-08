import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getProductById, getProducts } from "@/lib/products";
import AddToCartButton from "./AddToCartButton";

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ id: p.id }));
}

const fmt = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(n);

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product || !product.active) notFound();

  return (
    <div className="min-h-screen bg-[#FDF6F0] py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <Link href="/productos" className="inline-flex items-center gap-1.5 text-[#A08070] hover:text-[#D4879E] text-sm font-medium transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Volver al catálogo
        </Link>

        <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative h-80 md:h-full min-h-[360px] bg-[#F5E6D8]">
              {product.images?.[0] ? (
                <Image src={product.images[0]} alt={product.name} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 50vw" />
              ) : (
                <div className="flex items-center justify-center h-full text-7xl">🎁</div>
              )}
            </div>

            <div className="p-8 md:p-10 flex flex-col justify-between">
              <div>
                <span className="text-[11px] text-[#C4A882] font-semibold uppercase tracking-widest">{product.category}</span>
                <h1 className="font-display font-bold text-3xl md:text-4xl text-[#8B5E52] mt-2 leading-tight">{product.name}</h1>
                <p className="font-display font-bold text-[#D4879E] text-4xl mt-4">{fmt(product.price)}</p>
                <div className="w-12 h-0.5 bg-[#E8D5C4] my-5" />
                <p className="text-[#A08070] leading-relaxed text-base">{product.description}</p>
                {product.stock > 0 && <p className="text-sm text-green-600 font-medium mt-4">✓ Disponible</p>}
                {product.stock === 0 && <p className="text-sm text-red-400 font-medium mt-4">✗ Sin stock disponible</p>}
              </div>
              <div className="mt-8 space-y-3">
                <AddToCartButton product={product} />
                <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}?text=${encodeURIComponent(`Hola! Me interesa el producto: *${product.name}* (${fmt(product.price)}) 💝`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 border-2 border-[#25D366] text-[#25D366] py-4 rounded-2xl font-semibold hover:bg-[#25D366] hover:text-white transition-colors">
                  💬 Pedir este regalo por WhatsApp
                </a>
                <p className="text-xs text-center text-[#C4A882]">🚚 El costo del envío se coordina por WhatsApp</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}