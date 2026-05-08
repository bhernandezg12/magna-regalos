export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  images: string[];
  featured: boolean;
  active: boolean;
  stock: number;
  createdAt?: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type Category =
  | "Todos"
  | "Desayunos"
  | "Flores"
  | "Boxes"
  | "Dulces"
  | "Combos";