"use client";

import { useState, useEffect, useRef, type FormEvent, type ChangeEvent } from "react";
import Image from "next/image";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getProducts, addProduct, updateProduct, deleteProduct, uploadProductImage } from "@/lib/products";
import type { Product, Category } from "@/types";
import { Plus, Pencil, Trash2, LogOut, X, ImagePlus, Star, Eye, EyeOff, Package } from "lucide-react";

const CATEGORIES: Exclude<Category, "Todos">[] = ["Desayunos", "Flores", "Boxes", "Dulces", "Combos"];

const fmt = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(n);

const EMPTY_FORM = {
  name: "", description: "", price: "",
  category: "Desayunos" as Exclude<Category, "Todos">,
  featured: false, active: true, stock: "10",
};

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [prodLoading, setProdLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => { setUser(u); setAuthLoading(false); });
    return unsub;
  }, []);

  useEffect(() => { if (user) loadProducts(); }, [user]);

  async function loadProducts() {
    setProdLoading(true);
    const p = await getProducts(false);
    setProducts(p);
    setProdLoading(false);
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setLoginError("Credenciales incorrectas. Verifica tu email y contraseña.");
    } finally {
      setLoginLoading(false);
    }
  }

  function openCreate() {
    setEditingId(null); setForm(EMPTY_FORM);
    setImageFiles([]); setImagePreviews([]); setExistingImages([]);
    setModalOpen(true);
  }

  function openEdit(p: Product) {
    setEditingId(p.id);
    setForm({ name: p.name, description: p.description, price: String(p.price), category: p.category as Exclude<Category, "Todos">, featured: p.featured, active: p.active, stock: String(p.stock ?? 10) });
    setImageFiles([]); setImagePreviews([]); setExistingImages(p.images ?? []);
    setModalOpen(true);
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setImageFiles((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  }

  function removeNewImage(idx: number) {
    setImageFiles((prev) => prev.filter((_, i) => i !== idx));
    setImagePreviews((prev) => { URL.revokeObjectURL(prev[idx]); return prev.filter((_, i) => i !== idx); });
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const tempId = editingId ?? `temp_${Date.now()}`;
      const uploadedUrls: string[] = [];
      for (const file of imageFiles) {
        uploadedUrls.push(await uploadProductImage(file, tempId));
      }
      const data = {
        name: form.name.trim(), description: form.description.trim(),
        price: Number(form.price), category: form.category,
        featured: form.featured, active: form.active,
        stock: Number(form.stock), images: [...existingImages, ...uploadedUrls],
      };
      if (editingId) { await updateProduct(editingId, data); }
      else { await addProduct(data); }
      setModalOpen(false);
      await loadProducts();
    } catch (err) {
      console.error(err);
      alert("Error al guardar. Revisa la consola.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try { await deleteProduct(id); setDeleteConfirm(null); await loadProducts(); }
    catch { alert("Error al eliminar el producto."); }
  }

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#FDF6F0]"><p className="text-[#D4879E] text-lg font-display">Cargando...</p></div>;
  }

  // ── LOGIN ──
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FDF6F0] to-[#F5E6D8] px-4">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🌸</div>
            <h1 className="font-display font-bold text-2xl text-[#8B5E52]">Magna Regalos</h1>
            <p className="text-[#C4A882] text-sm mt-1">Panel de administración</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#8B6F5E] mb-1.5">Correo electrónico</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full px-4 py-3 border border-[#E8D5C4] rounded-xl text-[#8B5E52] focus:outline-none focus:border-[#D4879E] bg-[#FDF6F0]"
                placeholder="admin@ejemplo.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#8B6F5E] mb-1.5">Contraseña</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full px-4 py-3 border border-[#E8D5C4] rounded-xl text-[#8B5E52] focus:outline-none focus:border-[#D4879E] bg-[#FDF6F0]"
                placeholder="••••••••" />
            </div>
            {loginError && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{loginError}</p>}
            <button type="submit" disabled={loginLoading}
              className="w-full bg-[#D4879E] text-white py-3.5 rounded-xl font-semibold hover:bg-[#C4687E] transition-colors disabled:opacity-60">
              {loginLoading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── DASHBOARD ──
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#D4879E]/10 flex items-center justify-center text-lg">🌸</div>
          <div>
            <h1 className="font-display font-bold text-[#8B5E52] text-lg leading-none">Magna Regalos</h1>
            <p className="text-xs text-[#C4A882]">Panel de administración</p>
          </div>
        </div>
        <button onClick={() => signOut(auth)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors">
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Cerrar sesión</span>
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
          <div>
            <h2 className="font-display font-bold text-2xl text-gray-800">Productos</h2>
            <p className="text-gray-500 text-sm mt-0.5">{products.length} productos en total</p>
          </div>
          <button onClick={openCreate}
            className="flex items-center gap-2 bg-[#D4879E] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#C4687E] transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Nuevo producto
          </button>
        </div>

        {prodLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="bg-white rounded-2xl h-48 animate-pulse" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No hay productos. Crea el primero.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-44 bg-gray-100">
                  {p.images?.[0] ? (
                    <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-4xl">🎁</div>
                  )}
                  <div className="absolute top-2 left-2 flex gap-1.5">
                    {p.featured && <span className="bg-[#D4879E] text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1"><Star className="w-2.5 h-2.5 fill-white" />Dest.</span>}
                    {!p.active && <span className="bg-gray-500 text-white text-[10px] px-2 py-0.5 rounded-full">Inactivo</span>}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate">{p.name}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">{p.category}</p>
                      <p className="font-bold text-[#D4879E] text-lg mt-1">{fmt(p.price)}</p>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button onClick={() => openEdit(p)} className="p-2 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-100 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDeleteConfirm(p.id)} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                    <span>Stock: {p.stock ?? "—"}</span>
                    <button onClick={() => updateProduct(p.id, { active: !p.active }).then(loadProducts)}
                      className="flex items-center gap-1 hover:text-[#D4879E] transition-colors">
                      {p.active ? <><Eye className="w-3.5 h-3.5" /> Visible</> : <><EyeOff className="w-3.5 h-3.5" /> Oculto</>}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL FORMULARIO */}
      {modalOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => !saving && setModalOpen(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl z-10">
                <h2 className="font-display font-bold text-xl text-[#8B5E52]">{editingId ? "Editar producto" : "Nuevo producto"}</h2>
                <button onClick={() => !saving && setModalOpen(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors" disabled={saving}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre del producto *</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-[#D4879E]"
                    placeholder="Ej: Desayuno Mesita" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripción *</label>
                  <textarea required rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-[#D4879E] resize-none"
                    placeholder="Incluye: ..." />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Precio (COP) *</label>
                    <input type="number" required min="0" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-[#D4879E]"
                      placeholder="90000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock</label>
                    <input type="number" min="0" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-[#D4879E]" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Categoría *</label>
                  <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as Exclude<Category, "Todos"> }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-[#D4879E] bg-white">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <div onClick={() => setForm((f) => ({ ...f, featured: !f.featured }))}
                      className={`w-11 h-6 rounded-full transition-colors relative ${form.featured ? "bg-[#D4879E]" : "bg-gray-200"}`}>
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.featured ? "translate-x-5" : ""}`} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Destacado</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <div onClick={() => setForm((f) => ({ ...f, active: !f.active }))}
                      className={`w-11 h-6 rounded-full transition-colors relative ${form.active ? "bg-green-500" : "bg-gray-200"}`}>
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.active ? "translate-x-5" : ""}`} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Activo / Visible</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Imágenes del producto</label>
                  {existingImages.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {existingImages.map((url, i) => (
                        <div key={i} className="relative w-20 h-20">
                          <Image src={url} alt={`img-${i}`} fill className="object-cover rounded-xl" />
                          <button type="button" onClick={() => setExistingImages((prev) => prev.filter((_, j) => j !== i))}
                            className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {imagePreviews.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {imagePreviews.map((url, i) => (
                        <div key={i} className="relative w-20 h-20">
                          <Image src={url} alt={`new-${i}`} fill className="object-cover rounded-xl opacity-80" />
                          <button type="button" onClick={() => removeNewImage(i)}
                            className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <button type="button" onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-2 border-2 border-dashed border-gray-200 text-gray-500 hover:border-[#D4879E] hover:text-[#D4879E] transition-colors px-4 py-3 rounded-xl w-full justify-center text-sm font-medium">
                    <ImagePlus className="w-4 h-4" /> Subir imágenes
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModalOpen(false)} disabled={saving}
                    className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors disabled:opacity-60">
                    Cancelar
                  </button>
                  <button type="submit" disabled={saving}
                    className="flex-1 py-3 rounded-xl bg-[#D4879E] text-white font-bold hover:bg-[#C4687E] transition-colors disabled:opacity-60">
                    {saving ? "Guardando..." : editingId ? "Actualizar" : "Crear producto"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* CONFIRMAR ELIMINAR */}
      {deleteConfirm && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
              <div className="text-4xl mb-4">🗑️</div>
              <h3 className="font-display font-bold text-xl text-gray-800 mb-2">¿Eliminar producto?</h3>
              <p className="text-gray-500 text-sm mb-6">Esta acción no se puede deshacer.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}