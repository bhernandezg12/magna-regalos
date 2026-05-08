import Link from "next/link";
import { ArrowRight, Truck, MessageCircle, CreditCard, Clock } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { getFeaturedProducts, getProducts } from "@/lib/products";

export const revalidate = 60;

export default async function HomePage() {
  const [featured, all] = await Promise.all([getFeaturedProducts(), getProducts()]);
  const showProducts = featured.length > 0 ? featured.slice(0, 4) : all.slice(0, 4);

  const benefits = [
    { icon: <Truck className="w-7 h-7" />, title: "Envíos a toda Colombia", desc: "Llevamos tu regalo a cualquier ciudad del país." },
    { icon: <CreditCard className="w-7 h-7" />, title: "Pago contraentrada", desc: "Pagas cuando recibes tu pedido. Sin riesgo." },
    { icon: <MessageCircle className="w-7 h-7" />, title: "Atención por WhatsApp", desc: "Te asesoramos personalmente para elegir el regalo ideal." },
    { icon: <Clock className="w-7 h-7" />, title: "Pedidos hasta medianoche", desc: "Pide antes de las 12 y lo entregamos al día siguiente." },
  ];

  const steps = [
    { num: "01", title: "Elige tu regalo", desc: "Explora nuestro catálogo y selecciona lo que más le guste a mamá." },
    { num: "02", title: "Agrega al carrito", desc: "Añade uno o varios productos y revisa tu pedido." },
    { num: "03", title: "Pide por WhatsApp", desc: "Con un clic enviamos el resumen a WhatsApp para coordinar la entrega." },
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FDF6F0] via-[#FAF0E8] to-[#F5E6D8] pt-16 pb-20 px-4">
        <span className="absolute top-10 left-8 text-4xl opacity-20 select-none rotate-[-15deg]">🌸</span>
        <span className="absolute top-20 right-10 text-3xl opacity-20 select-none rotate-[10deg]">💐</span>
        <span className="absolute bottom-16 left-1/4 text-2xl opacity-15 select-none">✨</span>
        <span className="absolute bottom-10 right-1/4 text-3xl opacity-20 select-none">🌹</span>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <span className="inline-block bg-[#D4879E]/10 text-[#D4879E] text-sm font-semibold px-4 py-1.5 rounded-full mb-5 border border-[#D4879E]/20">
            🌺 Día de la Madre — Edición especial
          </span>
          <h1 className="font-display font-bold text-5xl md:text-6xl text-[#8B5E52] leading-tight mb-6">
            El regalo perfecto<br />
            <span className="text-[#D4879E]">para mamá</span>
          </h1>
          <p className="text-[#A08070] text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto">
            Desayunos especiales, flores, chocolates y más detalles con amor. Entregas en Manizales, Villamaría y toda Colombia.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/productos"
              className="inline-flex items-center justify-center gap-2 bg-[#D4879E] text-white px-7 py-4 rounded-full font-semibold text-base hover:bg-[#C4687E] transition-colors shadow-md shadow-[#D4879E]/30">
              Ver catálogo <ArrowRight className="w-4 h-4" />
            </Link>
            <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}?text=${encodeURIComponent("¡Hola! Quiero asesoría para elegir un regalo para el Día de la Madre 💝")}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#8B5E52] px-7 py-4 rounded-full font-semibold text-base border-2 border-[#E8D5C4] hover:border-[#D4879E] transition-colors">
              💬 Pedir por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {benefits.map((b) => (
            <div key={b.title} className="text-center group">
              <div className="w-14 h-14 rounded-2xl bg-[#FDF6F0] text-[#D4879E] flex items-center justify-center mx-auto mb-3 group-hover:bg-[#D4879E] group-hover:text-white transition-colors">
                {b.icon}
              </div>
              <h3 className="font-display font-bold text-[#8B5E52] text-sm leading-tight mb-1">{b.title}</h3>
              <p className="text-[#A08070] text-xs leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section className="py-16 px-4 bg-[#FDF6F0]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[#D4879E] font-semibold text-sm uppercase tracking-widest">Catálogo</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-[#8B5E52] mt-2">
              {featured.length > 0 ? "Los más pedidos" : "Nuestros regalos"}
            </h2>
          </div>
          {showProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {showProducts.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
              <div className="text-center mt-10">
                <Link href="/productos"
                  className="inline-flex items-center gap-2 border-2 border-[#D4879E] text-[#D4879E] px-7 py-3 rounded-full font-semibold hover:bg-[#D4879E] hover:text-white transition-colors">
                  Ver todo el catálogo <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-[#C4A882]">
              <p className="text-lg mb-4">Catálogo próximamente disponible 💝</p>
              <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full font-semibold">
                Consultar por WhatsApp
              </a>
            </div>
          )}
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl text-[#8B5E52]">¿Cómo funciona?</h2>
            <p className="text-[#A08070] mt-2">Tres pasos sencillos para sorprender a mamá</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.num} className="text-center">
                <div className="w-14 h-14 rounded-full bg-[#D4879E]/10 text-[#D4879E] font-display font-bold text-xl flex items-center justify-center mx-auto mb-4 border-2 border-[#D4879E]/20">
                  {s.num}
                </div>
                <h3 className="font-display font-bold text-[#8B5E52] text-lg mb-2">{s.title}</h3>
                <p className="text-[#A08070] text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BANNER CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#D4879E] to-[#C4687E] text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">¿Tienes un pedido especial?</h2>
          <p className="text-white/80 text-lg mb-8 leading-relaxed">
            Armamos regalos personalizados para fechas especiales. Escríbenos y creamos algo único para mamá.
          </p>
          <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}?text=${encodeURIComponent("Hola! Quiero un regalo personalizado para el Día de la Madre 💐")}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-[#D4879E] px-8 py-4 rounded-full font-bold text-base hover:bg-[#FDF6F0] transition-colors shadow-lg">
            💬 Chatear ahora
          </a>
        </div>
      </section>
    </>
  );
}