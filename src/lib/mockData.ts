import { Product, Category, Order, OrderItem } from '@/types/database.types';

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'T-Shirts',
    slug: 'tshirt',
    description: 'Minimalist unisex tees featuring premium heavy combed cotton construction.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'cat-2',
    name: 'Tracksuits',
    slug: 'track',
    description: 'Technical track jackets, windbreakers, fusion kurtas, and streetwear hoodies.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'cat-3',
    name: 'Pants',
    slug: 'pants',
    description: 'Functional cargo trousers, parachute balloon pants, and tech joggers.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'cat-4',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Avant-garde visor sunglasses, Cuban links, tactical chest rigs, and cuff beanies.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'cat-5',
    name: 'Shoes',
    slug: 'shoes',
    description: 'Futuristic runner silhouettes, cyber high-tops, and cushioned knit slides.',
    created_at: new Date().toISOString(),
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'ZELIX Heavyweight Oversized Hoodie',
    slug: 'zelix-heavyweight-oversized-hoodie',
    description: 'Crafted from 500GSM ultra-soft brushed French terry cotton. Features a double-lined hood without drawstrings, dropped shoulders, and reactive dyed for long-lasting color depth. Unisex boxy streetwear fit.',
    price: 3499,
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
    description: 'Constructed from lightweight, water-resistant ripstop nylon. Designed with modular utility pockets, adjustable drawstrings at the ankles, and an integrated nylon belt with a quick-release magnetic buckle.',
    price: 2999,
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
    description: 'Statement accessory featuring an aerodynamic wrapped single-lens design. Provides UV400 protection with anti-scratch and anti-fog obsidian coating. Finished with lightweight matte polymer temples.',
    price: 1899,
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
    description: 'Engineered for high comfort and futuristic appeal. Features a multi-layered panel construction of neoprene, breathable mesh, and waterproof leather overlays. Supported by a chunky vulcanized rubber sole.',
    price: 5999,
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
    description: 'A daily essential constructed from 280GSM heavy combed cotton. Featuring a tight mock-neck collar and slightly elongated sleeves for a contemporary boxy fit. Custom printed tone-on-tone logo.',
    price: 1299,
    images: ['/products/hoodie.png'],
    category_id: 'cat-1',
    inventory: 80,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Obsidian Black', 'Off-White', 'Stone'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-6',
    name: 'ZELIX Devanagari Cyberpunk Tee',
    slug: 'zelix-devanagari-cyberpunk-tee',
    description: 'Expressive graphic tee featuring screen-printed neon typography and cybernetic Devanagari lettering. Heavyweight 240GSM cotton, dropped shoulders, relaxed fit.',
    price: 1499,
    images: ['/products/hoodie.png'],
    category_id: 'cat-1',
    inventory: 50,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Stealth Black', 'Acid Lime'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-7',
    name: 'ZELIX Bengaluru Tech Joggers',
    slug: 'zelix-bengaluru-tech-joggers',
    description: 'Urban mobility joggers crafted from four-way stretch nylon blend. Includes dual zipper utility pockets, elasticated waistband, and custom chrome toggle pulls.',
    price: 2799,
    images: ['/products/cargo.png'],
    category_id: 'cat-3',
    inventory: 40,
    sizes: ['30', '32', '34', '36'],
    colors: ['Concrete Gray', 'Stealth Black'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-8',
    name: 'ZELIX Mumbai Rain Windbreaker',
    slug: 'zelix-mumbai-rain-windbreaker',
    description: 'Fully seam-sealed waterproof windbreaker. Engineered to withstand monsoon showers, featuring breathable mesh lining, reflective tape strips, and a packable visor hood.',
    price: 3999,
    images: ['/products/cargo.png'],
    category_id: 'cat-2',
    inventory: 25,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Cyber Yellow', 'Stealth Black'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-9',
    name: 'ZELIX Chrome Cuban Link Chain',
    slug: 'zelix-chrome-cuban-link-chain',
    description: 'High-polished 10mm flat Cuban link chain. Constructed from 316L solid surgical stainless steel. Finished with a heavy-duty box clasp and engraved ZELIX logo.',
    price: 1200,
    images: ['/products/sunglasses.png'],
    category_id: 'cat-4',
    inventory: 35,
    sizes: ['OS'],
    colors: ['Silver Chrome', 'Stealth Black'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-10',
    name: 'ZELIX Modular Chest Rig Vest',
    slug: 'zelix-modular-chest-rig-vest',
    description: 'Tactical chest rig vest constructed from Cordura nylon. Equipped with modular pockets, adjustable mesh backing, and key rings for quick-release configurations.',
    price: 2499,
    images: ['/products/sunglasses.png'],
    category_id: 'cat-4',
    inventory: 18,
    sizes: ['OS'],
    colors: ['Matte Black', 'Desert Camo'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-11',
    name: 'ZELIX Parachute Balloon Pants',
    slug: 'zelix-parachute-balloon-pants',
    description: 'Ultra-baggy balloon pants crafted from lightweight parachute nylon. Designed with elastic toggles at the waist and ankles to adjust the volume. Extremely breathable.',
    price: 3200,
    images: ['/products/cargo.png'],
    category_id: 'cat-3',
    inventory: 30,
    sizes: ['30', '32', '34', '36'],
    colors: ['Sand Beige', 'Obsidian Black', 'Sage Green'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-12',
    name: 'ZELIX Streetwear Kurta Jacket',
    slug: 'zelix-streetwear-kurta-jacket',
    description: 'A contemporary fusion piece merging traditional Kurta collar patterns and elongated silhouettes with high-performance windbreaker nylon fabrics and zip pockets.',
    price: 4200,
    images: ['/products/hoodie.png'],
    category_id: 'cat-2',
    inventory: 15,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Off-White', 'Obsidian Black'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-13',
    name: 'ZELIX Cyber Knit Slides',
    slug: 'zelix-cyber-knit-slides',
    description: 'Premium slides featuring a breathable, flexible knit upper strap. Mounted on a double-density cushioned EVA foam sole for maximum recovery comfort.',
    price: 2200,
    images: ['/products/sneakers.png'],
    category_id: 'cat-5',
    inventory: 35,
    sizes: ['7', '8', '9', '10', '11'],
    colors: ['Stealth Black', 'Ghost Grey'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-14',
    name: 'ZELIX Ribbed cuff Beanie',
    slug: 'zelix-ribbed-cuff-beanie',
    description: 'Classic ribbed knit beanie. Soft acrylic blend structure, folding cuff design, and custom embroidered ZELIX logo patch at the center front.',
    price: 799,
    images: ['/products/sunglasses.png'],
    category_id: 'cat-4',
    inventory: 60,
    sizes: ['OS'],
    colors: ['Obsidian Black', 'Heather Grey', 'Safety Orange'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-15',
    name: 'ZELIX Retro Mesh Trainers',
    slug: 'zelix-retro-mesh-trainers',
    description: 'Chunky sneakers featuring breathable athletic mesh panels and premium synthetic suede overlays. Supported by an shock-absorbing lightweight midsole.',
    price: 4499,
    images: ['/products/sneakers.png'],
    category_id: 'cat-5',
    inventory: 22,
    sizes: ['8', '9', '10', '11'],
    colors: ['Bone White', 'Stealth Black'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-16',
    name: 'ZELIX Tactical Parachute Shorts',
    slug: 'zelix-tactical-parachute-shorts',
    description: 'Water-resistant parachute shorts designed with a relaxed knee-length cut. Features multi-pocket cargo spaces, key clip, and adjustable elastic belt.',
    price: 1999,
    images: ['/products/cargo.png'],
    category_id: 'cat-3',
    inventory: 40,
    sizes: ['30', '32', '34', '36'],
    colors: ['Stealth Black', 'Olive Drab'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-17',
    name: "ZELIX 'Chakra' Oversized Tee",
    slug: 'zelix-chakra-oversized-tee',
    description: 'Premium 260GSM combed cotton tee featuring a high-density, screen-printed minimalist representation of the cosmic Chakra in neon ultraviolet active inks. Dropped shoulders, boxy fit.',
    price: 1699,
    images: ['/products/hoodie.png'],
    category_id: 'cat-1',
    inventory: 50,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Obsidian Black', 'Chalk White'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-18',
    name: "ZELIX 'Bandra' Utility Vest",
    slug: 'zelix-bandra-utility-vest',
    description: 'Technical streetwear vest inspired by Mumbai\'s street culture. Features modular 3D utility cargo pockets, heavy-duty tactical D-rings, adjustable side-release webbing straps, and mesh lining for breathability.',
    price: 2999,
    images: ['/products/sunglasses.png'],
    category_id: 'cat-4',
    inventory: 12,
    sizes: ['OS'],
    colors: ['Stealth Black', 'Olive Drab'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-19',
    name: "ZELIX 'Nirvana' Tie-Dye Hoodie",
    slug: 'zelix-nirvana-tie-dye-hoodie',
    description: '450GSM ultra-thick French terry cotton hoodie featuring a custom hand-dyed dark pastel tie-dye pattern symbolizing spiritual transcendence. Double-lined hood, kangaroo pocket, relaxed silhouette.',
    price: 3899,
    images: ['/products/hoodie.png'],
    category_id: 'cat-2',
    inventory: 25,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Sage & Shadow', 'Midnight Blue'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-20',
    name: "ZELIX 'Rajputana' Bomber Jacket",
    slug: 'zelix-rajputana-bomber-jacket',
    description: 'A luxury fusion jacket blending traditional royal geometric patterns with a technical flight bomber silhouette. Built from weather-resistant heavy nylon shell with a custom quilted lining and utility arm pocket.',
    price: 4999,
    images: ['/products/hoodie.png'],
    category_id: 'cat-2',
    inventory: 18,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Imperial Gold & Black', 'Crimson & Charcoal'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-21',
    name: "ZELIX 'Moksha' Distressed Knit Sweater",
    slug: 'zelix-moksha-distressed-knit-sweater',
    description: 'Avant-garde open-weave knit sweater in a premium cotton-acrylic blend. Features subtle hand-distressed detailing at the collar, hem, and cuffs with jacquard-knit abstract patterns.',
    price: 3499,
    images: ['/products/hoodie.png'],
    category_id: 'cat-2',
    inventory: 20,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Sandstone', 'Charcoal'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-22',
    name: "ZELIX 'Kora' Organic Cotton Kimono",
    slug: 'zelix-kora-organic-cotton-kimono',
    description: 'Unbleached, raw organic cotton open-front kimono jacket. Fuses traditional Japanese streetwear vibes with Indian khadi-inspired textures. Dropped shoulders, wide-cut sleeves, patch pockets.',
    price: 2899,
    images: ['/products/hoodie.png'],
    category_id: 'cat-2',
    inventory: 15,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Natural Ecru', 'Slate Gray'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-23',
    name: "ZELIX 'Gully' Cargo Joggers",
    slug: 'zelix-gully-cargo-joggers',
    description: 'High-utility jogger pants with a relaxed thigh-fit tapering at the ribbed ankles. Engineered with dual-entry expandable cargo side pockets, tactical key hook, and reflective drawstring tips.',
    price: 2599,
    images: ['/products/cargo.png'],
    category_id: 'cat-3',
    inventory: 35,
    sizes: ['30', '32', '34', '36'],
    colors: ['Stealth Black', 'Concrete Gray', 'Khaki'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-24',
    name: "ZELIX 'Himalayan' Tech Shell Jacket",
    slug: 'zelix-himalayan-tech-shell-jacket',
    description: 'Extreme performance 3-layer laminated shell jacket featuring a topographic line pattern of the Himalayas. 15k waterproof rating, fully taped seams, underarm zip vents, and YKK AquaGuard zippers.',
    price: 5499,
    images: ['/products/cargo.png'],
    category_id: 'cat-2',
    inventory: 14,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Glacier White', 'Summit Blue', 'Obsidian Black'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-25',
    name: "ZELIX 'Rickshaw' Pop-Art Sweatshirt",
    slug: 'zelix-rickshaw-pop-art-sweatshirt',
    description: 'Heavyweight 360GSM loopback cotton sweatshirt featuring a premium neon-colored cyberpunk graphic of the iconic Indian auto-rickshaw. Ribbed side panels for flexibility and comfort.',
    price: 2299,
    images: ['/products/hoodie.png'],
    category_id: 'cat-2',
    inventory: 30,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Stealth Black', 'Off-White'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-26',
    name: "ZELIX 'Sanskrit' Script Sock Set",
    slug: 'zelix-sanskrit-script-sock-set',
    description: 'Set of three premium ribbed crew-length socks made from organic cotton with reinforced heels. Features knit Devanagari lettering ("ऊर्जा", "गति", "स्थिरता") running down the calf.',
    price: 899,
    images: ['/products/sunglasses.png'],
    category_id: 'cat-4',
    inventory: 100,
    sizes: ['OS'],
    colors: ['Tri-pack (Black, White, Gray)'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-27',
    name: "ZELIX 'Taj' Marble Print Silk Bandana",
    slug: 'zelix-taj-marble-print-silk-bandana',
    description: '100% premium mulberry silk bandana featuring an abstract flowing marble texture print in deep obsidian and white gold, inspired by the intricate marble carvings of the Taj Mahal.',
    price: 999,
    images: ['/products/sunglasses.png'],
    category_id: 'cat-4',
    inventory: 45,
    sizes: ['OS'],
    colors: ['Gold & Obsidian', 'Silver & Chalk'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-28',
    name: "ZELIX 'Masala' Cyberpunk Utility Pouch",
    slug: 'zelix-masala-cyberpunk-utility-pouch',
    description: 'A cross-body modular mini bag constructed from ballistic Cordura nylon. Equipped with waterproof zippers, a clear phone sleeve, and neon orange custom hardware tags.',
    price: 1499,
    images: ['/products/sunglasses.png'],
    category_id: 'cat-4',
    inventory: 28,
    sizes: ['OS'],
    colors: ['Neon Orange Accent', 'Stealth Black'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-29',
    name: "ZELIX 'Karma' Chunky High-Tops",
    slug: 'zelix-karma-chunky-high-tops',
    description: 'Multi-paneled high-top sneakers combining distressed canvas panels with soft full-grain leather overlays. Features a thick, lightweight sculpted EVA foam platform sole and a speed-lacing system.',
    price: 6499,
    images: ['/products/sneakers.png'],
    category_id: 'cat-5',
    inventory: 15,
    sizes: ['8', '9', '10', '11'],
    colors: ['Crimson & Sand', 'Shadow Black'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-30',
    name: "ZELIX 'Lotus' Neon Visor Hat",
    slug: 'zelix-lotus-neon-visor-hat',
    description: 'Translucent visor panels paired with a structured 5-panel performance crown. Features a 3D-embroidered Lotus emblem on the front panel and a quick-adjust toggle strap at the back.',
    price: 1199,
    images: ['/products/sunglasses.png'],
    category_id: 'cat-4',
    inventory: 40,
    sizes: ['OS'],
    colors: ['Neon Green', 'Cyber Pink', 'Matte Black'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-31',
    name: "ZELIX 'Ganga' Blue Ombre Windbreaker",
    slug: 'zelix-ganga-blue-ombre-windbreaker',
    description: 'Ultra-lightweight packable windbreaker with a custom blue gradient ombre wash representing the flow of the sacred river. Finished with DWR water-repellent coating and zip pockets.',
    price: 4199,
    images: ['/products/cargo.png'],
    category_id: 'cat-2',
    inventory: 22,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['River Gradient', 'Ocean Blue'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-32',
    name: "ZELIX 'Delhi 6' Corduroy Overshirt",
    slug: 'zelix-delhi-6-corduroy-overshirt',
    description: 'Vintage-inspired 8-whale corduroy button-up shirt in a contemporary boxy fit. Heavyweight texture, tortoiseshell buttons, dual breast pockets, and raw-edged bottom hem detail.',
    price: 2699,
    images: ['/products/hoodie.png'],
    category_id: 'cat-1',
    inventory: 35,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Mustard Yellow', 'Forest Green', 'Espresso Brown'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-33',
    name: "ZELIX 'Indus' Denim Cargo Pants",
    slug: 'zelix-indus-denim-cargo-pants',
    description: '14oz heavy-indigo dyed denim pants with double-knee panels and utility hammer loops. Designed with a loose skate fit and large cargo flap pockets on both thighs.',
    price: 3499,
    images: ['/products/cargo.png'],
    category_id: 'cat-3',
    inventory: 25,
    sizes: ['30', '32', '34', '36'],
    colors: ['Raw Indigo', 'Stone Washed Blue'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-34',
    name: "ZELIX 'Jaisalmer' Sand-Wash Tee",
    slug: 'zelix-jaisalmer-sand-wash-tee',
    description: 'Heavily acid-washed sand-colored t-shirt made of 240GSM cotton. Hand-distressed details along the ribbing and hemline give a worn, post-apocalyptic desert feel.',
    price: 1599,
    images: ['/products/hoodie.png'],
    category_id: 'cat-1',
    inventory: 40,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Dune Sand', 'Desert Dust'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-35',
    name: "ZELIX 'Monsoon' Waterproof Tote Bag",
    slug: 'zelix-monsoon-waterproof-tote-bag',
    description: 'Roll-top waterproof dry-bag designed to withstand the heaviest monsoons. Features high-frequency welded seams, reflective ZELIX side panel branding, and a padded mesh shoulder strap.',
    price: 1799,
    images: ['/products/sunglasses.png'],
    category_id: 'cat-4',
    inventory: 30,
    sizes: ['OS'],
    colors: ['Matte Black', 'Clear Ice'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-36',
    name: "ZELIX 'Jaipur' Pink City Utility Shorts",
    slug: 'zelix-jaipur-pink-city-utility-shorts',
    description: 'Relaxed knee-length utility shorts inspired by the historic Pink City. Crafted from quick-dry nylon ripstop, featuring multiple mesh utility pockets, D-ring loops, and an integrated canvas belt.',
    price: 2199,
    images: ['/products/cargo.png'],
    category_id: 'cat-3',
    inventory: 30,
    sizes: ['30', '32', '34', '36'],
    colors: ['Terracotta Pink', 'Slate Black'],
    created_at: new Date().toISOString(),
  },
];

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
    orders.unshift(newOrder);
    this.setStorageItem('zelix_orders', orders);

    const orderItems = this.getStorageItem<OrderItem[]>('zelix_order_items', []);
    const newItems = items.map(item => ({
      ...item,
      id: 'orditem-' + Math.random().toString(36).substr(2, 9),
      order_id: newOrder.id,
    }));

    this.setStorageItem('zelix_order_items', [...orderItems, ...newItems]);

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

