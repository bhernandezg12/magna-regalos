import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "./firebase";
import type { Product } from "@/types";

const COL = "products";

export async function getProducts(onlyActive = true): Promise<Product[]> {
  try {
    const constraints = onlyActive
      ? [where("active", "==", true), orderBy("createdAt", "desc")]
      : [orderBy("createdAt", "desc")];
    const q = query(collection(db, COL), ...constraints);
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Product);
  } catch (error) {
    console.error("ERROR EN GETPRODUCTS:", error); // ← solo agrega esto
    return [];
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const q = query(
      collection(db, COL),
      where("active", "==", true),
      where("featured", "==", true),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Product);
  } catch {
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const snap = await getDoc(doc(db, COL, id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Product;
  } catch {
    return null;
  }
}

export async function addProduct(data: Omit<Product, "id">): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateProduct(
  id: string,
  data: Partial<Omit<Product, "id">>
): Promise<void> {
  await updateDoc(doc(db, COL, id), data);
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}

export async function uploadProductImage(
  file: File,
  productId: string
): Promise<string> {
  const storageRef = ref(
    storage,
    `products/${productId}/${Date.now()}_${file.name}`
  );
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

export async function deleteProductImage(url: string): Promise<void> {
  try {
    const imageRef = ref(storage, url);
    await deleteObject(imageRef);
  } catch {
    // La imagen puede que ya no exista, ignorar
  }
}