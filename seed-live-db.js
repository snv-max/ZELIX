const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Read environment variables from .env.local
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('Error: .env.local file not found. Please create it first.');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.substring(1, value.length - 1);
    }
    env[key] = value.trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY missing in .env.local');
  process.exit(1);
}

console.log('Connecting to Supabase:', supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 2. Define data collections
const CATEGORIES = [
  { id: '550e8400-e29b-41d4-a716-446655440001', name: 'T-Shirts', slug: 'tshirt', description: 'Minimalist unisex tees featuring premium heavy combed cotton construction.' },
  { id: '550e8400-e29b-41d4-a716-446655440002', name: 'Tracksuits', slug: 'track', description: 'Technical track jackets, windbreakers, fusion kurtas, and streetwear hoodies.' },
  { id: '550e8400-e29b-41d4-a716-446655440003', name: 'Pants', slug: 'pants', description: 'Functional cargo trousers, parachute balloon pants, and tech joggers.' },
  { id: '550e8400-e29b-41d4-a716-446655440004', name: 'Accessories', slug: 'accessories', description: 'Avant-garde visor sunglasses, Cuban links, tactical chest rigs, and cuff beanies.' },
  { id: '550e8400-e29b-41d4-a716-446655440005', name: 'Shoes', slug: 'shoes', description: 'Futuristic runner silhouettes, cyber high-tops, and cushioned knit slides.' }
];

// Read MOCK_PRODUCTS from src/lib/mockData.ts
// To keep the script standalone, we define the products directly here.
const PRODUCTS = [
  {
    id: '550e8400-e29b-41d4-a716-446655440011',
    name: 'ZELIX Heavyweight Oversized Hoodie',
    slug: 'zelix-heavyweight-oversized-hoodie',
    description: 'Crafted from 500GSM ultra-soft brushed French terry cotton. Features a double-lined hood without drawstrings, dropped shoulders, and reactive dyed for long-lasting color depth. Unisex boxy streetwear fit.',
    price: 3499,
    images: ['/products/hoodie.png'],
    category_id: '550e8400-e29b-41d4-a716-446655440002',
    inventory: 45,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Charcoal', 'Obsidian Black', 'Chalk White']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440012',
    name: 'ZELIX Technical Cargo Pants',
    slug: 'zelix-technical-cargo-pants',
    description: 'Constructed from lightweight, water-resistant ripstop nylon. Designed with modular utility pockets, adjustable drawstrings at the ankles, and an integrated nylon belt with a quick-release magnetic buckle.',
    price: 2999,
    images: ['/products/cargo.png'],
    category_id: '550e8400-e29b-41d4-a716-446655440003',
    inventory: 32,
    sizes: ['30', '32', '34', '36'],
    colors: ['Matte Black', 'Olive Drab', 'Concrete Gray']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440013',
    name: 'ZELIX Futuristic Shield Sunglasses',
    slug: 'zelix-futuristic-shield-sunglasses',
    description: 'Statement accessory featuring an aerodynamic wrapped single-lens design. Provides UV400 protection with anti-scratch and anti-fog obsidian coating. Finished with lightweight matte polymer temples.',
    price: 1899,
    images: ['/products/sunglasses.png'],
    category_id: '550e8400-e29b-41d4-a716-446655440004',
    inventory: 15,
    sizes: ['OS'],
    colors: ['Obsidian Black', 'Silver Metallic']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440014',
    name: 'ZELIX Cyber High-Top Sneakers',
    slug: 'zelix-cyber-high-top-sneakers',
    description: 'Engineered for high comfort and futuristic appeal. Features a multi-layered panel construction of neoprene, breathable mesh, and waterproof leather overlays. Supported by a chunky vulcanized rubber sole.',
    price: 5999,
    images: ['/products/sneakers.png'],
    category_id: '550e8400-e29b-41d4-a716-446655440005',
    inventory: 20,
    sizes: ['8', '9', '10', '11'],
    colors: ['Stealth Black', 'Ghost Grey']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440015',
    name: 'ZELIX Core Minimalist Tee',
    slug: 'zelix-core-minimalist-tee',
    description: 'A daily essential constructed from 280GSM heavy combed cotton. Featuring a tight mock-neck collar and slightly elongated sleeves for a contemporary boxy fit. Custom printed tone-on-tone logo.',
    price: 1299,
    images: ['/products/hoodie.png'],
    category_id: '550e8400-e29b-41d4-a716-446655440001',
    inventory: 80,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Obsidian Black', 'Off-White', 'Stone']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440016',
    name: 'ZELIX Devanagari Cyberpunk Tee',
    slug: 'zelix-devanagari-cyberpunk-tee',
    description: 'Expressive graphic tee featuring screen-printed neon typography and cybernetic Devanagari lettering. Heavyweight 240GSM cotton, dropped shoulders, relaxed fit.',
    price: 1499,
    images: ['/products/hoodie.png'],
    category_id: '550e8400-e29b-41d4-a716-446655440001',
    inventory: 50,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Stealth Black', 'Acid Lime']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440017',
    name: 'ZELIX Bengaluru Tech Joggers',
    slug: 'zelix-bengaluru-tech-joggers',
    description: 'Urban mobility joggers crafted from four-way stretch nylon blend. Includes dual zipper utility pockets, elasticated waistband, and custom chrome toggle pulls.',
    price: 2799,
    images: ['/products/cargo.png'],
    category_id: '550e8400-e29b-41d4-a716-446655440003',
    inventory: 40,
    sizes: ['30', '32', '34', '36'],
    colors: ['Concrete Gray', 'Stealth Black']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440018',
    name: 'ZELIX Mumbai Rain Windbreaker',
    slug: 'zelix-mumbai-rain-windbreaker',
    description: 'Fully seam-sealed waterproof windbreaker. Engineered to withstand monsoon showers, featuring breathable mesh lining, reflective tape strips, and a packable visor hood.',
    price: 3999,
    images: ['/products/cargo.png'],
    category_id: '550e8400-e29b-41d4-a716-446655440002',
    inventory: 25,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Cyber Yellow', 'Stealth Black']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440019',
    name: 'ZELIX Chrome Cuban Link Chain',
    slug: 'zelix-chrome-cuban-link-chain',
    description: 'High-polished 10mm flat Cuban link chain. Constructed from 316L solid surgical stainless steel. Finished with a heavy-duty box clasp and engraved ZELIX logo.',
    price: 1200,
    images: ['/products/sunglasses.png'],
    category_id: '550e8400-e29b-41d4-a716-446655440004',
    inventory: 35,
    sizes: ['OS'],
    colors: ['Silver Chrome', 'Stealth Black']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440020',
    name: 'ZELIX Modular Chest Rig Vest',
    slug: 'zelix-modular-chest-rig-vest',
    description: 'Tactical chest rig vest constructed from Cordura nylon. Equipped with modular pockets, adjustable mesh backing, and key rings for quick-release configurations.',
    price: 2499,
    images: ['/products/sunglasses.png'],
    category_id: '550e8400-e29b-41d4-a716-446655440004',
    inventory: 18,
    sizes: ['OS'],
    colors: ['Matte Black', 'Desert Camo']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440021',
    name: 'ZELIX Parachute Balloon Pants',
    slug: 'zelix-parachute-balloon-pants',
    description: 'Ultra-baggy balloon pants crafted from lightweight parachute nylon. Designed with elastic toggles at the waist and ankles to adjust the volume. Extremely breathable.',
    price: 3200,
    images: ['/products/cargo.png'],
    category_id: '550e8400-e29b-41d4-a716-446655440003',
    inventory: 30,
    sizes: ['30', '32', '34', '36'],
    colors: ['Sand Beige', 'Obsidian Black', 'Sage Green']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440022',
    name: 'ZELIX Streetwear Kurta Jacket',
    slug: 'zelix-streetwear-kurta-jacket',
    description: 'A contemporary fusion piece merging traditional Kurta collar patterns and elongated silhouettes with high-performance windbreaker nylon fabrics and zip pockets.',
    price: 4200,
    images: ['/products/hoodie.png'],
    category_id: '550e8400-e29b-41d4-a716-446655440002',
    inventory: 15,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Off-White', 'Obsidian Black']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440023',
    name: 'ZELIX Cyber Knit Slides',
    slug: 'zelix-cyber-knit-slides',
    description: 'Premium slides featuring a breathable, flexible knit upper strap. Mounted on a double-density cushioned EVA foam sole for maximum recovery comfort.',
    price: 2200,
    images: ['/products/sneakers.png'],
    category_id: '550e8400-e29b-41d4-a716-446655440005',
    inventory: 35,
    sizes: ['7', '8', '9', '10', '11'],
    colors: ['Stealth Black', 'Ghost Grey']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440024',
    name: 'ZELIX Ribbed Cuff Beanie',
    slug: 'zelix-ribbed-cuff-beanie',
    description: 'Classic ribbed knit beanie. Soft acrylic blend structure, folding cuff design, and custom embroidered ZELIX logo patch at the center front.',
    price: 799,
    images: ['/products/sunglasses.png'],
    category_id: '550e8400-e29b-41d4-a716-446655440004',
    inventory: 60,
    sizes: ['OS'],
    colors: ['Obsidian Black', 'Heather Grey', 'Safety Orange']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440025',
    name: 'ZELIX Retro Mesh Trainers',
    slug: 'zelix-retro-mesh-trainers',
    description: 'Chunky sneakers featuring breathable athletic mesh panels and premium synthetic suede overlays. Supported by a shock-absorbing lightweight midsole.',
    price: 4499,
    images: ['/products/sneakers.png'],
    category_id: '550e8400-e29b-41d4-a716-446655440005',
    inventory: 22,
    sizes: ['8', '9', '10', '11'],
    colors: ['Bone White', 'Stealth Black']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440026',
    name: 'ZELIX Tactical Parachute Shorts',
    slug: 'zelix-tactical-parachute-shorts',
    description: 'Water-resistant parachute shorts designed with a relaxed knee-length cut. Features multi-pocket cargo spaces, key clip, and adjustable elastic belt.',
    price: 1999,
    images: ['/products/cargo.png'],
    category_id: '550e8400-e29b-41d4-a716-446655440003',
    inventory: 40,
    sizes: ['30', '32', '34', '36'],
    colors: ['Stealth Black', 'Olive Drab']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440027',
    name: "ZELIX 'Chakra' Oversized Tee",
    slug: 'zelix-chakra-oversized-tee',
    description: 'Premium 260GSM combed cotton tee featuring a high-density, screen-printed minimalist representation of the cosmic Chakra in neon ultraviolet active inks. Dropped shoulders, boxy fit.',
    price: 1699,
    images: ['/products/hoodie.png'],
    category_id: '550e8400-e29b-41d4-a716-446655440001',
    inventory: 50,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Obsidian Black', 'Chalk White']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440028',
    name: "ZELIX 'Bandra' Utility Vest",
    slug: 'zelix-bandra-utility-vest',
    description: 'Technical streetwear vest inspired by Mumbai\'s street culture. Features modular 3D utility cargo pockets, heavy-duty tactical D-rings, adjustable side-release webbing straps, and mesh lining for breathability.',
    price: 2999,
    images: ['/products/sunglasses.png'],
    category_id: '550e8400-e29b-41d4-a716-446655440004',
    inventory: 12,
    sizes: ['OS'],
    colors: ['Stealth Black', 'Olive Drab']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440029',
    name: "ZELIX 'Nirvana' Tie-Dye Hoodie",
    slug: 'zelix-nirvana-tie-dye-hoodie',
    description: '450GSM ultra-thick French terry cotton hoodie featuring a custom hand-dyed dark pastel tie-dye pattern symbolizing spiritual transcendence. Double-lined hood, kangaroo pocket, relaxed silhouette.',
    price: 3899,
    images: ['/products/hoodie.png'],
    category_id: '550e8400-e29b-41d4-a716-446655440002',
    inventory: 25,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Sage & Shadow', 'Midnight Blue']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440030',
    name: "ZELIX 'Rajputana' Bomber Jacket",
    slug: 'zelix-rajputana-bomber-jacket',
    description: 'A luxury fusion jacket blending traditional royal geometric patterns with a technical flight bomber silhouette. Built from weather-resistant heavy nylon shell with a custom quilted lining and utility arm pocket.',
    price: 4999,
    images: ['/products/hoodie.png'],
    category_id: '550e8400-e29b-41d4-a716-446655440002',
    inventory: 18,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Imperial Gold & Black', 'Crimson & Charcoal']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440031',
    name: "ZELIX 'Moksha' Distressed Knit Sweater",
    slug: 'zelix-moksha-distressed-knit-sweater',
    description: 'Avant-garde open-weave knit sweater in a premium cotton-acrylic blend. Features subtle hand-distressed detailing at the collar, hem, and cuffs with jacquard-knit abstract patterns.',
    price: 3499,
    images: ['/products/hoodie.png'],
    category_id: '550e8400-e29b-41d4-a716-446655440002',
    inventory: 20,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Sandstone', 'Charcoal']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440032',
    name: "ZELIX 'Kora' Organic Cotton Kimono",
    slug: 'zelix-kora-organic-cotton-kimono',
    description: 'Unbleached, raw organic cotton open-front kimono jacket. Fuses traditional Japanese streetwear vibes with Indian khadi-inspired textures. Dropped shoulders, wide-cut sleeves, patch pockets.',
    price: 2899,
    images: ['/products/hoodie.png'],
    category_id: '550e8400-e29b-41d4-a716-446655440002',
    inventory: 15,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Natural Ecru', 'Slate Gray']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440033',
    name: "ZELIX 'Gully' Cargo Joggers",
    slug: 'zelix-gully-cargo-joggers',
    description: 'High-utility jogger pants with a relaxed thigh-fit tapering at the ribbed ankles. Engineered with dual-entry expandable cargo side pockets, tactical key hook, and reflective drawstring tips.',
    price: 2599,
    images: ['/products/cargo.png'],
    category_id: '550e8400-e29b-41d4-a716-446655440003',
    inventory: 35,
    sizes: ['30', '32', '34', '36'],
    colors: ['Stealth Black', 'Concrete Gray', 'Khaki']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440034',
    name: "ZELIX 'Himalayan' Tech Shell Jacket",
    slug: 'zelix-himalayan-tech-shell-jacket',
    description: 'Extreme performance 3-layer laminated shell jacket featuring a topographic line pattern of the Himalayas. 15k waterproof rating, fully taped seams, underarm zip vents, and YKK AquaGuard zippers.',
    price: 5499,
    images: ['/products/cargo.png'],
    category_id: '550e8400-e29b-41d4-a716-446655440002',
    inventory: 14,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Glacier White', 'Summit Blue', 'Obsidian Black']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440035',
    name: "ZELIX 'Rickshaw' Pop-Art Sweatshirt",
    slug: 'zelix-rickshaw-pop-art-sweatshirt',
    description: 'Heavyweight 360GSM loopback cotton sweatshirt featuring a premium neon-colored cyberpunk graphic of the iconic Indian auto-rickshaw. Ribbed side panels for flexibility and comfort.',
    price: 2299,
    images: ['/products/hoodie.png'],
    category_id: '550e8400-e29b-41d4-a716-446655440002',
    inventory: 30,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Stealth Black', 'Off-White']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440036',
    name: "ZELIX 'Sanskrit' Script Sock Set",
    slug: 'zelix-sanskrit-script-sock-set',
    description: 'Set of three premium ribbed crew-length socks made from organic cotton with reinforced heels. Features knit Devanagari lettering ("ऊर्जा", "गति", "स्थिरता") running down the calf.',
    price: 899,
    images: ['/products/sunglasses.png'],
    category_id: '550e8400-e29b-41d4-a716-446655440004',
    inventory: 100,
    sizes: ['OS'],
    colors: ['Tri-pack (Black, White, Gray)']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440037',
    name: "ZELIX 'Taj' Marble Print Silk Bandana",
    slug: 'zelix-taj-marble-print-silk-bandana',
    description: '100% premium mulberry silk bandana featuring an abstract flowing marble texture print in deep obsidian and white gold, inspired by the intricate marble carvings of the Taj Mahal.',
    price: 999,
    images: ['/products/sunglasses.png'],
    category_id: '550e8400-e29b-41d4-a716-446655440004',
    inventory: 45,
    sizes: ['OS'],
    colors: ['Gold & Obsidian', 'Silver & Chalk']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440038',
    name: "ZELIX 'Masala' Cyberpunk Utility Pouch",
    slug: 'zelix-masala-cyberpunk-utility-pouch',
    description: 'A cross-body modular mini bag constructed from ballistic Cordura nylon. Equipped with waterproof zippers, a clear phone sleeve, and neon orange custom hardware tags.',
    price: 1499,
    images: ['/products/sunglasses.png'],
    category_id: '550e8400-e29b-41d4-a716-446655440004',
    inventory: 28,
    sizes: ['OS'],
    colors: ['Neon Orange Accent', 'Stealth Black']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440039',
    name: "ZELIX 'Karma' Chunky High-Tops",
    slug: 'zelix-karma-chunky-high-tops',
    description: 'Multi-paneled high-top sneakers combining distressed canvas panels with soft full-grain leather overlays. Features a thick, lightweight sculpted EVA foam platform sole and a speed-lacing system.',
    price: 6499,
    images: ['/products/sneakers.png'],
    category_id: '550e8400-e29b-41d4-a716-446655440005',
    inventory: 15,
    sizes: ['8', '9', '10', '11'],
    colors: ['Crimson & Sand', 'Shadow Black']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440040',
    name: "ZELIX 'Lotus' Neon Visor Hat",
    slug: 'zelix-lotus-neon-visor-hat',
    description: 'Translucent visor panels paired with a structured 5-panel performance crown. Features a 3D-embroidered Lotus emblem on the front panel and a quick-adjust toggle strap at the back.',
    price: 1199,
    images: ['/products/sunglasses.png'],
    category_id: '550e8400-e29b-41d4-a716-446655440004',
    inventory: 40,
    sizes: ['OS'],
    colors: ['Neon Green', 'Cyber Pink', 'Matte Black']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440041',
    name: "ZELIX 'Ganga' Blue Ombre Windbreaker",
    slug: 'zelix-ganga-blue-ombre-windbreaker',
    description: 'Ultra-lightweight packable windbreaker with a custom blue gradient ombre wash representing the flow of the sacred river. Finished with DWR water-repellent coating and zip pockets.',
    price: 4199,
    images: ['/products/cargo.png'],
    category_id: '550e8400-e29b-41d4-a716-446655440002',
    inventory: 22,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['River Gradient', 'Ocean Blue']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440042',
    name: "ZELIX 'Delhi 6' Corduroy Overshirt",
    slug: 'zelix-delhi-6-corduroy-overshirt',
    description: 'Vintage-inspired 8-whale corduroy button-up shirt in a contemporary boxy fit. Heavyweight texture, tortoiseshell buttons, dual breast pockets, and raw-edged bottom hem detail.',
    price: 2699,
    images: ['/products/hoodie.png'],
    category_id: '550e8400-e29b-41d4-a716-446655440001',
    inventory: 35,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Mustard Yellow', 'Forest Green', 'Espresso Brown']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440043',
    name: "ZELIX 'Indus' Denim Cargo Pants",
    slug: 'zelix-indus-denim-cargo-pants',
    description: '14oz heavy-indigo dyed denim pants with double-knee panels and utility hammer loops. Designed with a loose skate fit and large cargo flap pockets on both thighs.',
    price: 3499,
    images: ['/products/cargo.png'],
    category_id: '550e8400-e29b-41d4-a716-446655440003',
    inventory: 25,
    sizes: ['30', '32', '34', '36'],
    colors: ['Raw Indigo', 'Stone Washed Blue']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440044',
    name: "ZELIX 'Jaisalmer' Sand-Wash Tee",
    slug: 'zelix-jaisalmer-sand-wash-tee',
    description: 'Heavily acid-washed sand-colored t-shirt made of 240GSM cotton. Hand-distressed details along the ribbing and hemline give a worn, post-apocalyptic desert feel.',
    price: 1599,
    images: ['/products/hoodie.png'],
    category_id: '550e8400-e29b-41d4-a716-446655440001',
    inventory: 40,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Dune Sand', 'Desert Dust']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440045',
    name: "ZELIX 'Monsoon' Waterproof Tote Bag",
    slug: 'zelix-monsoon-waterproof-tote-bag',
    description: 'Roll-top waterproof dry-bag designed to withstand the heaviest monsoons. Features high-frequency welded seams, reflective ZELIX side panel branding, and a padded mesh shoulder strap.',
    price: 1799,
    images: ['/products/sunglasses.png'],
    category_id: '550e8400-e29b-41d4-a716-446655440004',
    inventory: 30,
    sizes: ['OS'],
    colors: ['Matte Black', 'Clear Ice']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440046',
    name: "ZELIX 'Jaipur' Pink City Utility Shorts",
    slug: 'zelix-jaipur-pink-city-utility-shorts',
    description: 'Relaxed knee-length utility shorts inspired by the historic Pink City. Crafted from quick-dry nylon ripstop, featuring multiple mesh utility pockets, D-ring loops, and an integrated canvas belt.',
    price: 2199,
    images: ['/products/cargo.png'],
    category_id: '550e8400-e29b-41d4-a716-446655440003',
    inventory: 30,
    sizes: ['30', '32', '34', '36'],
    colors: ['Terracotta Pink', 'Slate Black']
  }
];

async function seedDatabase() {
  try {
    // 3. Create or login Admin Account to bypass RLS in standard operations if needed
    // But wait, the categories and products tables can only be modified by admins.
    // So we sign in as admin first.
    const adminEmail = 'admin@zelix.com';
    const adminPassword = 'AdminPassword123!';

    console.log(`Authenticating seeder as: ${adminEmail}...`);
    let { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword
    });

    if (authError) {
      console.log('Admin account not found. Registering first...');
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: adminEmail,
        password: adminPassword,
        options: {
          data: {
            full_name: 'ZELIX Administrator'
          }
        }
      });

      if (signUpError) {
        throw new Error(`Failed to create admin auth: ${signUpError.message}`);
      }

      console.log('Admin registration submitted. Waiting 3s for DB triggers...');
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Sign in now
      const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: adminPassword
      });

      if (retryError) {
        throw new Error(`Failed to login after registration: ${retryError.message}`);
      }

      console.log('Login successful.');
    } else {
      console.log('Login successful.');
    }

    // Double check: promote the user to admin just in case triggers failed or were run out of order
    // Note: Standard API key might not allow updating profiles table directly unless RLS permits.
    // Let's verify RLS on profiles:
    // "Admins can update any profile" -> but we are admin, so it's fine.
    // If the database trigger handles it, it will already be set.
    const { data: userSession } = await supabase.auth.getUser();
    const currentUserId = userSession.user.id;
    
    // Promote user if not already admin
    const { data: profileCheck } = await supabase.from('profiles').select('role').eq('id', currentUserId).single();
    if (profileCheck && profileCheck.role !== 'admin') {
      console.log('Updating user role to admin...');
      await supabase.from('profiles').update({ role: 'admin' }).eq('id', currentUserId);
    }

    // 4. Bulk upsert Categories
    console.log('Upserting categories...');
    const { error: catError } = await supabase
      .from('categories')
      .upsert(CATEGORIES, { onConflict: 'slug' });

    if (catError) {
      throw new Error(`Categories upsert error: ${catError.message}`);
    }
    console.log('Categories upserted successfully.');

    // 5. Bulk upsert Products
    console.log('Upserting 36 products...');
    const { error: prodError } = await supabase
      .from('products')
      .upsert(PRODUCTS, { onConflict: 'slug' });

    if (prodError) {
      throw new Error(`Products upsert error: ${prodError.message}`);
    }
    console.log('Products upserted successfully!');
    
    console.log('\nSeeding completed successfully! Your live database is fully synchronized.');
    process.exit(0);

  } catch (err) {
    console.error('\nDatabase seeding failed:', err.message);
    process.exit(1);
  }
}

seedDatabase();
