import { Product, Category, Profile, Order, OrderItem } from '@/types/database.types';

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'T-Shirts',
    slug: 'tshirt',
    description: 'Minimalist unisex tees featuring premium heavy cotton construction.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'cat-2',
    name: 'Tracksuits',
    slug: 'track',
    description: 'Technical track jackets, windbreakers, and streetwear hoodies.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'cat-3',
    name: 'Pants',
    slug: 'pants',
    description: 'Functional cargo trousers, joggers, and tech parachute pants.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'cat-4',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Avant-garde sunglasses, utility bags, and minimalist jewelry.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'cat-5',
    name: 'Shoes',
    slug: 'shoes',
    description: 'Futuristic silhouettes and premium materials for daily wear.',
    created_at: new Date().toISOString(),
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'ZELIX Heavyweight Oversized Hoodie',
    slug: 'zelix-heavyweight-oversized-hoodie',
    description: 'Crafted from 500GSM ultra-soft brushed French terry cotton. Features a double-lined hood without drawstrings, dropped shoulders, and ribbed cuffs for the ultimate slouchy streetwear silhouette. Unisex fit, pre-shrunk, and reactive dyed for long-lasting color depth.',
    price: 120,
    images: ['/products/hoodie.png'],
    category_id: 'cat-2',
    inventory: 45,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Charcoal', 'Obsidian Black', 'Chalk White'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-2',
    name: 'ZELIX Technical Cargo Pants',
    slug: 'zelix-technical-cargo-pants',
    description: 'Constructed from lightweight, water-resistant ripstop nylon. Designed with modular utility pockets, adjustable drawstrings at the ankles, and an integrated nylon belt with a quick-release magnetic buckle. Designed for functional mobility in urban terrains.',
    price: 145,
    images: ['/products/cargo.png'],
    category_id: 'cat-3',
    inventory: 32,
    sizes: ['30', '32', '34', '36'],
    colors: ['Matte Black', 'Olive Drab', 'Concrete Gray'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-3',
    name: 'ZELIX Futuristic Shield Sunglasses',
    slug: 'zelix-futuristic-shield-sunglasses',
    description: 'Statement accessory featuring an aerodynamic wrapped single-lens design. Provides UV400 protection with anti-scratch and anti-fog obsidian coating. Finished with lightweight matte polymer temples and debossed ZELIX chrome accents.',
    price: 85,
    images: ['/products/sunglasses.png'],
    category_id: 'cat-4',
    inventory: 15,
    sizes: ['OS'],
    colors: ['Obsidian Black', 'Silver Metallic'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-4',
    name: 'ZELIX Cyber High-Top Sneakers',
    slug: 'zelix-cyber-high-top-sneakers',
    description: 'Engineered for high comfort and futuristic appeal. Features a multi-layered panel construction of neoprene, breathable mesh, and waterproof leather overlays. Supported by a chunky vulcanized rubber sole with geometric treads.',
    price: 240,
    images: ['/products/sneakers.png'],
    category_id: 'cat-5',
    inventory: 20,
    sizes: ['8', '9', '10', '11'],
    colors: ['Stealth Black', 'Ghost Grey'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-5',
    name: 'ZELIX Core Minimalist Tee',
    slug: 'zelix-core-minimalist-tee',
    description: 'A daily essential constructed from 280GSM heavy combed cotton. Featuring a tight mock-neck collar and slightly elongated sleeves for a contemporary boxy fit. Custom printed tone-on-tone ZELIX logo at the center back.',
    price: 48,
    images: ['/products/hoodie.png'], // Reusing hoodie.png for demo purposes
    category_id: 'cat-1',
    inventory: 80,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Obsidian Black', 'Off-White', 'Stone'],
    created_at: new Date().toISOString(),
  },
];

// Helper database services using LocalStorage
class MockDatabase {
  private getStorageItem<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  }

  private setStorageItem<T>(key: string, value: T): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  // Products
  getProducts(): Product[] {
    return this.getStorageItem<Product[]>('zelix_products', MOCK_PRODUCTS);
  }

  getProductBySlug(slug: string): Product | undefined {
    return this.getProducts().find(p => p.slug === slug);
  }

  saveProduct(product: Product): void {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.push(product);
    }
    this.setStorageItem('zelix_products', products);
  }

  deleteProduct(id: string): void {
    const products = this.getProducts().filter(p => p.id !== id);
    this.setStorageItem('zelix_products', products);
  }

  // Categories
  getCategories(): Category[] {
    return this.getStorageItem<Category[]>('zelix_categories', MOCK_CATEGORIES);
  }

  saveCategory(category: Category): void {
    const categories = this.getCategories();
    const index = categories.findIndex(c => c.id === category.id);
    if (index >= 0) {
      categories[index] = category;
    } else {
      categories.push(category);
    }
    this.setStorageItem('zelix_categories', categories);
  }

  deleteCategory(id: string): void {
    const categories = this.getCategories().filter(c => c.id !== id);
    this.setStorageItem('zelix_categories', categories);
  }

  // Orders
  getOrders(userId?: string): Order[] {
    const orders = this.getStorageItem<Order[]>('zelix_orders', []);
    if (userId) {
      return orders.filter(o => o.user_id === userId);
    }
    return orders;
  }

  getOrderItems(orderId: string): OrderItem[] {
    const items = this.getStorageItem<OrderItem[]>('zelix_order_items', []);
    return items.filter(item => item.order_id === orderId).map(item => {
      const product = this.getProducts().find(p => p.id === item.product_id);
      return { ...item, product };
    });
  }

  createOrder(order: Omit<Order, 'id' | 'created_at'>, items: Omit<OrderItem, 'id' | 'order_id'>[]): Order {
    const newOrder: Order = {
      ...order,
      id: 'ord-' + Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
    };

    const orders = this.getOrders();
    orders.unshift(newOrder); // Add to beginning
    this.setStorageItem('zelix_orders', orders);

    const orderItems = this.getStorageItem<OrderItem[]>('zelix_order_items', []);
    const newItems = items.map(item => ({
      ...item,
      id: 'orditem-' + Math.random().toString(36).substr(2, 9),
      order_id: newOrder.id,
    }));

    this.setStorageItem('zelix_order_items', [...orderItems, ...newItems]);

    // Decrease Inventory
    const products = this.getProducts();
    newItems.forEach(item => {
      const prod = products.find(p => p.id === item.product_id);
      if (prod) {
        prod.inventory = Math.max(0, prod.inventory - item.quantity);
      }
    });
    this.setStorageItem('zelix_products', products);

    return newOrder;
  }

  updateOrderStatus(orderId: string, status: Order['status']): void {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index >= 0) {
      orders[index].status = status;
      this.setStorageItem('zelix_orders', orders);
    }
  }

  // Wishlist
  getWishlist(userId: string): Product[] {
    const wishlists = this.getStorageItem<{userId: string, productId: string}[]>('zelix_wishlists', []);
    const userWishlist = wishlists.filter(w => w.userId === userId);
    const products = this.getProducts();
    return userWishlist.map(w => products.find(p => p.id === w.productId)).filter(Boolean) as Product[];
  }

  toggleWishlist(userId: string, productId: string): boolean {
    const wishlists = this.getStorageItem<{userId: string, productId: string}[]>('zelix_wishlists', []);
    const index = wishlists.findIndex(w => w.userId === userId && w.productId === productId);
    let added = false;
    if (index >= 0) {
      wishlists.splice(index, 1);
    } else {
      wishlists.push({ userId, productId });
      added = true;
    }
    this.setStorageItem('zelix_wishlists', wishlists);
    return added;
  }
}

export const mockDb = new MockDatabase();
export const MOCK_ADMIN_USER: Profile = {
  id: 'usr-admin',
  email: 'admin@zelix.com',
  full_name: 'ZELIX Administrator',
  avatar_url: null,
  role: 'admin',
  created_at: new Date().toISOString(),
};

export const MOCK_CUSTOMER_USER: Profile = {
  id: 'usr-customer',
  email: 'customer@zelix.com',
  full_name: 'Alex Mercer',
  avatar_url: null,
  role: 'customer',
  created_at: new Date().toISOString(),
};
