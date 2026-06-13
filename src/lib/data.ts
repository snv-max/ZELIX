import { supabase, isSupabaseConfigured } from './supabase';
import { mockDb } from './mockData';
import { Product, Category } from '@/types/database.types';

export async function fetchCategories(): Promise<Category[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data as Category[];
    } catch (err) {
      console.error('Failed to fetch categories from Supabase, using mock:', err);
      return mockDb.getCategories();
    }
  }
  return mockDb.getCategories();
}

export async function fetchProducts(options?: { categorySlug?: string; search?: string }): Promise<Product[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('products').select('*, categories(*)');

      if (options?.categorySlug) {
        // First get the category ID
        const { data: catData } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', options.categorySlug)
          .single();
        
        if (catData) {
          query = query.eq('category_id', catData.id);
        }
      }

      const { data, error } = await query;
      if (error) throw error;

      let products = data as Product[];

      if (options?.search) {
        const searchLower = options.search.toLowerCase();
        products = products.filter(
          p => p.name.toLowerCase().includes(searchLower) || p.description.toLowerCase().includes(searchLower)
        );
      }

      return products;
    } catch (err) {
      console.error('Failed to fetch products from Supabase, using mock:', err);
    }
  }

  // Local mock fallback
  let products = mockDb.getProducts();

  if (options?.categorySlug) {
    const categories = mockDb.getCategories();
    const cat = categories.find(c => c.slug === options.categorySlug);
    if (cat) {
      products = products.filter(p => p.category_id === cat.id);
    }
  }

  if (options?.search) {
    const searchLower = options.search.toLowerCase();
    products = products.filter(
      p => p.name.toLowerCase().includes(searchLower) || p.description.toLowerCase().includes(searchLower)
    );
  }

  return products;
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(*)')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data as Product;
    } catch (err) {
      console.error(`Failed to fetch product by slug ${slug} from Supabase, using mock:`, err);
    }
  }
  return mockDb.getProductBySlug(slug) || null;
}

export async function fetchProductById(id: string): Promise<Product | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Product;
    } catch (err) {
      console.error(`Failed to fetch product by id ${id} from Supabase, using mock:`, err);
    }
  }
  const products = mockDb.getProducts();
  return products.find(p => p.id === id) || null;
}
