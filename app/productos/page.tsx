"use client";

import { useEffect, useState, useMemo } from "react";
import { Search } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/products";
import type { Product, Category } from "@/types";

const CATEGORIES: Category[] = ["Todos", "Desayunos", "Flores", "Boxes", "Dulces", "Combos"];

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("Todos");

  useEffect(() => {
    getProducts().then((p) => { setProducts(p); setLoading(false); });
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = activeCategory === "Todos" || p.category === activeCategory;
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, search, activeCategory]);

  return (
    <div className="min-h-screen bg-[#FDF6F0]">
      <div className="bg-white border-b border-[#E8D5C4] py-10 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <span className="text-[#D4879E] font-semibold text-sm uppercase tracking-widest">Magna Regalos</span>
          <h1 className="font-display font-bold text-4xl text-[#8B5E52] mt-2">Catálogo de regalos</h1>
          <p className="text-[#A08070] mt-2 max-w-md mx-auto">Todos nuestros productos para el Día de la Madre y ocasiones especiales</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="relative max-w-md mx-auto mb-7">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C4A882]" />
          <input type="search" placeholder="Buscar regalo..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-[#E8D5C4] rounded-full text-sm text-[#8B5E52] placeholder:text-[#C4A882] focus:outline-none focus:border-[#D4879E] transition-colors" />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat ? "bg-[#D4879E] text-white shadow-sm" : "bg-white text-[#8B6F5E] border border-[#E8D5C4] hover:border-[#D4879E]"
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="bg-white rounded-3xl h-80 animate-pulse" />)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-[#A08070] text-lg mb-2">No encontramos "{search}"</p>
            <button onClick={() => { setSearch(""); setActiveCategory("Todos"); }}
              className="text-[#D4879E] font-medium hover:underline">
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}