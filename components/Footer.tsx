import Link from "next/link";
import { Heart, MapPin, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#8B5E52] text-[#F5E6D8]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-5 h-5 text-[#E8B4C0] fill-[#E8B4C0]" />
              <span className="font-display text-2xl font-bold text-white">Magna Regalos</span>
            </div>
            <p className="text-[#E8D5C4] text-sm leading-relaxed">
              Creamos momentos únicos con regalos llenos de amor. Especializados en el Día de la Madre y fechas especiales.
            </p>
            <a href="https://instagram.com/magnaregalos/" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-[#E8B4C0] text-sm hover:text-white transition-colors">
              📷 @magnaregalos
            </a>
          </div>

          <div>
            <h4 className="font-display font-bold text-white mb-4">Navegar</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/" className="text-[#E8D5C4] hover:text-white transition-colors">Inicio</Link></li>
              <li><Link href="/productos" className="text-[#E8D5C4] hover:text-white transition-colors">Catálogo</Link></li>
              <li><Link href="/carrito" className="text-[#E8D5C4] hover:text-white transition-colors">Mi carrito</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-white mb-4">Información</h4>
            <div className="space-y-3 text-sm text-[#E8D5C4]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#E8B4C0]" />
                <span>Manizales y Villamaría<br />Envíos a toda Colombia</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#E8B4C0]" />
                <span>Pedidos hasta medianoche<br />para entrega al día siguiente</span>
              </div>
              <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors mt-1">
                💬 316 524 7969
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-[#9B6E62] py-4 text-center text-xs text-[#C4A090]">
        © {new Date().getFullYear()} Magna Regalos · Hecho con ❤️ en Manizales · El cliente asume el costo del envío
      </div>
    </footer>
  );
}