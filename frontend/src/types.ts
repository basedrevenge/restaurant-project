export interface MenuItem {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  is_available: boolean;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  count: number;
}
