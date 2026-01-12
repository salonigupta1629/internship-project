import { create } from 'zustand';
import { fetchWithCache } from '@/utils/api';

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  rating: number;
  images: string[];
  description: string;
  brand?: string;
  stock?: number;
}

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  categories: string[];
  loading: boolean;
  total: number;
  fetchProducts: (skip: number, search?: string, category?: string) => Promise<void>;
  fetchProductById: (id: number) => Promise<void>;
  fetchCategories: () => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  currentProduct: null,
  categories: [],
  loading: false,
  total: 0,
  
  fetchProducts: async (skip = 0, search = '', category = '') => {
    set({ loading: true });
    try {
      let url = 'https://dummyjson.com/products';
      if (search) {
        url = `https://dummyjson.com/products/search?q=${search}`;
      } else if (category) {
        url = `https://dummyjson.com/products/category/${category}`;
      } else {
        url += `?limit=10&skip=${skip}`;
      }
      
      const data = await fetchWithCache(url);
      set({ products: data.products, total: data.total, loading: false });
    } catch (error) {
      console.error('Error fetching products:', error);
      set({ loading: false });
    }
  },
  
  fetchProductById: async (id: number) => {
    set({ loading: true });
    try {
      const data = await fetchWithCache(`https://dummyjson.com/products/${id}`);
      set({ currentProduct: data, loading: false });
    } catch (error) {
      console.error('Error fetching product:', error);
      set({ loading: false });
    }
  },
  
  fetchCategories: async () => {
    try {
      const data = await fetchWithCache('https://dummyjson.com/products/categories');
      
      let categoriesArray: string[] = [];
      
      if (Array.isArray(data)) {
        categoriesArray = data.filter(item => typeof item === 'string');
      } else if (typeof data === 'object' && data !== null) {
        categoriesArray = Object.values(data).filter(item => typeof item === 'string');
      }
      
      if (categoriesArray.length === 0) {
        categoriesArray = [
          'smartphones', 'laptops', 'fragrances', 'skincare', 
          'groceries', 'home-decoration', 'furniture', 'tops', 
          'womens-dresses', 'womens-shoes', 'mens-shirts', 
          'mens-shoes', 'mens-watches', 'womens-watches', 
          'womens-bags', 'womens-jewellery', 'sunglasses', 
          'automotive', 'motorcycle', 'lighting'
        ];
      }
      
      set({ categories: categoriesArray });
    } catch (error) {
      console.error('Error fetching categories:', error);
      set({ 
        categories: [
          'smartphones', 'laptops', 'fragrances', 'skincare', 
          'groceries', 'home-decoration', 'furniture', 'tops', 
          'womens-dresses', 'womens-shoes', 'mens-shirts', 
          'mens-shoes', 'mens-watches', 'womens-watches', 
          'womens-bags', 'womens-jewellery', 'sunglasses', 
          'automotive', 'motorcycle', 'lighting'
        ] 
      });
    }
  },
}));