export const products = [
  {
    _id: "prod_001",
    name: "Cloud Comfort Sectional Sofa",
    slug: "cloud-comfort-sectional-sofa",
    description: "Sink into luxury with our Cloud Comfort Sectional. This expansive sofa features deep, plush cushions wrapped in premium Italian leather. The modular design allows you to configure it perfectly for your space. Each seat is independently adjustable with power reclining and built-in USB charging ports.",
    shortDescription: "Luxurious Italian leather sectional with power reclining",
    price: 3499.99,
    originalPrice: 4599.99,
    category: "Living Room",
    subcategory: "Sectionals",
    material: "Italian Leather",
    color: "Cognac Brown",
    style: "Modern",
    dimensions: "120\"W x 84\"D x 34\"H",
    weight: "285 lbs",
    inStock: true,
    stock: 8,
    rating: 4.8,
    numReviews: 156,
    images: [
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200",
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=1200",
      "https://images.unsplash.com/photo-1550226891-ef816aed4a98?w=1200"
    ],
    variants: [
      { color: "Cognac Brown", material: "Italian Leather", price: 3499.99, stock: 8 },
      { color: "Charcoal Gray", material: "Italian Leather", price: 3699.99, stock: 5 },
      { color: "Cream White", material: "Premium Fabric", price: 2999.99, stock: 12 },
      { color: "Navy Blue", material: "Velvet", price: 3299.99, stock: 6 }
    ],
    features: [
      "Power reclining with adjustable headrests",
      "Built-in USB charging ports",
      "Modular design for flexible configuration",
      "Premium Italian leather upholstery",
      "Memory foam cushioning",
      "Stainless steel reclining mechanism"
    ],
    reviews: [
      { 
        _id: "rev_001", 
        user: "Jennifer M.", 
        rating: 5, 
        title: "Best sofa I've ever owned",
        comment: "This sectional transformed our living room. The leather is buttery soft and the reclining feature is a game-changer for movie nights. Worth every penny!", 
        date: "2024-03-15",
        verified: true,
        helpful: 42
      },
      { 
        _id: "rev_002", 
        user: "Robert K.", 
        rating: 5, 
        title: "Exceptional quality and comfort",
        comment: "The modular design allowed us to create the perfect configuration for our awkwardly shaped living room. The USB ports are a brilliant addition.", 
        date: "2024-03-10",
        verified: true,
        helpful: 28
      },
      { 
        _id: "rev_003", 
        user: "Amanda S.", 
        rating: 4, 
        title: "Beautiful but heavy",
        comment: "Gorgeous sofa and incredibly comfortable. Only giving 4 stars because it's extremely heavy and difficult to move. Make sure you have help!", 
        date: "2024-02-28",
        verified: true,
        helpful: 15
      }
    ],
    tags: ["sectional", "leather", "recliner", "modern", "living-room", "luxury"],
    featured: true,
    trending: true,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-01-15T08:00:00.000Z",
    updatedAt: "2024-03-20T10:30:00.000Z"
  },
  {
    _id: "prod_002",
    name: "Nordic Minimalist Bed Frame",
    slug: "nordic-minimalist-bed-frame",
    description: "Embrace Scandinavian simplicity with our Nordic Minimalist Bed Frame. Crafted from sustainable solid oak with a natural oiled finish, this bed frame features clean lines, a low profile, and integrated nightstands. The slatted base provides optimal mattress support and ventilation.",
    shortDescription: "Sustainable solid oak bed frame with integrated nightstands",
    price: 1899.99,
    originalPrice: 2399.99,
    category: "Bedroom",
    subcategory: "Beds",
    material: "Solid Oak",
    color: "Natural Oak",
    style: "Scandinavian",
    dimensions: "Queen: 64\"W x 84\"L x 32\"H",
    weight: "180 lbs",
    inStock: true,
    stock: 15,
    rating: 4.7,
    numReviews: 203,
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200",
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=1200",
      "https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=1200",
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200"
    ],
    variants: [
      { size: "Full", color: "Natural Oak", price: 1599.99, stock: 10 },
      { size: "Queen", color: "Natural Oak", price: 1899.99, stock: 15 },
      { size: "King", color: "Natural Oak", price: 2199.99, stock: 8 },
      { size: "Queen", color: "Walnut", price: 2099.99, stock: 6 },
      { size: "King", color: "White Oak", price: 2399.99, stock: 5 }
    ],
    features: [
      "Sustainable solid oak construction",
      "Integrated floating nightstands",
      "Slatted base for mattress ventilation",
      "Low-profile Scandinavian design",
      "Natural oiled finish",
      "No box spring required"
    ],
    reviews: [
      { 
        _id: "rev_004", 
        user: "Marcus T.", 
        rating: 5, 
        title: "Stunning craftsmanship",
        comment: "The quality of the oak is exceptional. Assembly was straightforward and the integrated nightstands are such a clever design feature. My bedroom looks like a luxury hotel now.", 
        date: "2024-03-12",
        verified: true,
        helpful: 35
      },
      { 
        _id: "rev_005", 
        user: "Sarah L.", 
        rating: 4, 
        title: "Beautiful but took time to assemble",
        comment: "Love the minimalist look and the wood grain is gorgeous. Assembly took about 3 hours with two people. The slats are well-made and provide great support.", 
        date: "2024-03-01",
        verified: true,
        helpful: 22
      }
    ],
    tags: ["bed", "oak", "scandinavian", "minimalist", "bedroom", "sustainable"],
    featured: true,
    trending: true,
    bestSeller: false,
    newArrival: false,
    onSale: true,
    createdAt: "2024-01-20T09:00:00.000Z",
    updatedAt: "2024-03-18T11:00:00.000Z"
  },
  {
    _id: "prod_003",
    name: "The Urban Aria Swivel Accent Chair",
    slug: "urban-aria-swivel-accent-chair",
    description: "Add a sculptural touch to your reading nook or living space with the Urban Aria chair. Featuring a fluid, tulip-like silhouette and a 360-degree swivel base, this piece combines ergonomic support with high-design aesthetics. Upholstered in a durable, textured bouclé fabric.",
    shortDescription: "Sculptural bouclé swivel chair with a sleek metal base",
    price: 649.99,
    originalPrice: 899.99,
    category: "Living Room",
    subcategory: "Accent Chairs",
    material: "Bouclé Fabric / Steel",
    color: "Ivory White",
    style: "Mid-Century Modern",
    dimensions: "32\"W x 34\"D x 28\"H",
    weight: "55 lbs",
    inStock: true,
    stock: 25,
    rating: 4.9,
    numReviews: 42,
    images: [
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
"https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
      "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=1200",
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=1200"
    ],
    variants: [
      { color: "Ivory White", material: "Bouclé", price: 649.99, stock: 25 },
      { color: "Sage Green", material: "Velvet", price: 679.99, stock: 12 },
      { color: "Charcoal", material: "Bouclé", price: 649.99, stock: 18 }
    ],
    features: [
      "360-degree smooth swivel mechanism",
      "Durable bouclé fabric (stain resistant)",
      "Splayed metal legs with non-slip pads",
      "High-density foam core",
      "No assembly required"
    ],
    reviews: [
      { 
        _id: "rev_006", 
        user: "Oliver P.", 
        rating: 5, 
        title: "Stunning statement piece", 
        comment: "Looks way more expensive than it is. The swivel is smooth and the fabric is very soft.", 
        date: "2024-03-25", 
        verified: true, 
        helpful: 18 
      }
    ],
    tags: ["accent-chair", "boucle", "swivel", "modern", "living-room"],
    featured: true,
    trending: true,
    bestSeller: false,
    newArrival: true,
    onSale: true,
    createdAt: "2024-02-10T08:00:00.000Z",
    updatedAt: "2024-04-01T10:30:00.000Z"
  },
  {
    _id: "prod_004",
    name: "Hexacomb Geometric Coffee Table",
    slug: "hexacomb-geometric-coffee-table",
    description: "Defy convention with this hexagonal nested coffee table set. Featuring a unique honeycomb design, this set includes two interlocking tables that can be configured together for a large surface or separated for asymmetric styling. The rich oak veneer contrasts beautifully with the powder-coated black iron frame.",
    shortDescription: "Modern hexagonal nesting coffee table set",
    price: 399.99,
    originalPrice: 599.99,
    category: "Living Room",
    subcategory: "Coffee Tables",
    material: "Oak Veneer / Iron",
    color: "Walnut & Black",
    style: "Contemporary",
    dimensions: "Large: 38\"W x 38\"D x 16\"H",
    weight: "65 lbs",
    inStock: true,
    stock: 30,
    rating: 4.7,
    numReviews: 89,
    images: [
     "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200",
     "https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg",
"https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg",
"https://images.pexels.com/photos/2079249/pexels-photo-2079249.jpeg"
    ],
    variants: [
      { color: "Walnut / Black", finish: "Matte", price: 399.99, stock: 30 },
      { color: "Natural Ash / Gold", finish: "Gloss", price: 449.99, stock: 10 }
    ],
    features: [
      "Space-saving nesting design",
      "Powder-coated steel frame",
      "Scratch-resistant veneer top",
      "Industrial felt floor glides",
      "Versatile hexagonal shape"
    ],
    reviews: [
      { 
        _id: "rev_007", 
        user: "Claire F.", 
        rating: 5, 
        title: "Perfect for small spaces", 
        comment: "I love that I can pull them apart for movie nights.", 
        date: "2024-03-20", 
        verified: true, 
        helpful: 32 
      }
    ],
    tags: ["coffee-table", "nesting", "geometric", "modern", "living-room"],
    featured: false,
    trending: true,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-01-25T09:00:00.000Z",
    updatedAt: "2024-03-28T11:00:00.000Z"
  },
  {
    _id: "prod_005",
    name: "The Rhapsody Media Console",
    slug: "rhapsody-media-console",
    description: "Organize your entertainment center in style with The Rhapsody. Featuring a sleek, low-profile silhouette, this console offers ample storage via two sliding rattan doors and a central open compartment for media devices. Cable management cutouts keep unsightly wires hidden.",
    shortDescription: "Mid-century media console with rattan sliding doors",
    price: 799.99,
    originalPrice: 1099.99,
    category: "Living Room",
    subcategory: "TV Stands",
    material: "Solid Mango Wood / Rattan",
    color: "Honey Teak",
    style: "Mid-Century Modern",
    dimensions: "70\"W x 16\"D x 24\"H",
    weight: "110 lbs",
    inStock: true,
    stock: 15,
    rating: 4.8,
    numReviews: 114,
    images: [
      "https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg",
"https://images.pexels.com/photos/3932930/pexels-photo-3932930.jpeg",
"https://images.pexels.com/photos/2544839/pexels-photo-2544839.jpeg",
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200"
    ],
    variants: [
      { color: "Honey Teak", doorStyle: "Natural Rattan", price: 799.99, stock: 15 },
      { color: "Espresso", doorStyle: "Slatted Wood", price: 849.99, stock: 8 }
    ],
    features: [
      "Hand-woven rattan door fronts",
      "Adjustable interior shelves",
      "Vented back panel for airflow",
      "Tapered splayed legs",
      "Cable management system"
    ],
    reviews: [
      { 
        _id: "rev_008", 
        user: "David R.", 
        rating: 5, 
        title: "High quality", 
        comment: "Beautiful wood grain and the rattan adds perfect texture.", 
        date: "2024-03-18", 
        verified: true, 
        helpful: 45 
      }
    ],
    tags: ["tv-stand", "media-console", "rattan", "mid-century", "living-room"],
    featured: true,
    trending: false,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-02-05T08:00:00.000Z",
    updatedAt: "2024-03-22T10:30:00.000Z"
  },
  {
    _id: "prod_006",
    name: "Nebula Glass End Table (Set of 2)",
    slug: "nebula-glass-end-table-set",
    description: "Elevate your living room with the ethereal beauty of the Nebula end tables. Featuring tempered smoked glass tops and a unique, sculptural gold stainless steel base that resembles swirling nebulae, these tables function as art as much as furniture.",
    shortDescription: "Luxury smoked glass side table set with sculptural gold base",
    price: 299.99,
    originalPrice: 450.00,
    category: "Living Room",
    subcategory: "End Tables",
    material: "Tempered Glass / Stainless Steel",
    color: "Smoke & Gold",
    style: "Glam / Luxury",
    dimensions: "22\"W x 22\"D x 22\"H",
    weight: "40 lbs",
    inStock: true,
    stock: 20,
    rating: 4.6,
    numReviews: 37,
    images: [
      "https://images.pexels.com/photos/7534561/pexels-photo-7534561.jpeg",
"https://images.pexels.com/photos/6585757/pexels-photo-6585757.jpeg",
"https://images.pexels.com/photos/6489107/pexels-photo-6489107.jpeg",
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1200"
    ],
    variants: [
      { color: "Smoke & Gold", shape: "Round", price: 299.99, stock: 20 }
    ],
    features: [
      "Tempered safety glass",
      "Rust-proof stainless steel",
      "Scratch-resistant base",
      "Easy assembly"
    ],
    reviews: [
      { 
        _id: "rev_009", 
        user: "Sophia L.", 
        rating: 5, 
        title: "Absolutely gorgeous", 
        comment: "Looks like a $1000 set. Very sturdy.", 
        date: "2024-03-30", 
        verified: true, 
        helpful: 12 
      }
    ],
    tags: ["end-table", "glass", "gold", "luxury", "side-table"],
    featured: true,
    trending: true,
    bestSeller: false,
    newArrival: true,
    onSale: false,
    createdAt: "2024-03-01T08:00:00.000Z",
    updatedAt: "2024-04-02T10:30:00.000Z"
  },
  {
    _id: "prod_007",
    name: "Tidal Wave Chaise Lounge",
    slug: "tidal-wave-chaise-lounge",
    description: "Bring resort-style relaxation to your sunroom or patio (or living room) with the Tidal Wave Chaise. Featuring a continuous hoop base and a gently curved backrest, this piece offers a surprising amount of comfort with its thick, removable cushion.",
    shortDescription: "Indoor/outdoor woven chaise lounge with thick cushion",
    price: 549.99,
    originalPrice: 749.99,
    category: "Living Room",
    subcategory: "Lounge Chairs",
    material: "All-Weather Wicker / Olefin",
    color: "Natural Tan",
    style: "Coastal / Boho",
    dimensions: "65\"L x 28\"W x 30\"H",
    weight: "35 lbs",
    inStock: true,
    stock: 12,
    rating: 4.5,
    numReviews: 28,
    images: [
      "https://images.pexels.com/photos/4846097/pexels-photo-4846097.jpeg",
"https://images.pexels.com/photos/6782567/pexels-photo-6782567.jpeg",
"https://images.pexels.com/photos/7587879/pexels-photo-7587879.jpeg",
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=1200",
    ],
    variants: [
      { color: "Natural Tan", frame: "Brown Wicker", price: 549.99, stock: 12 }
    ],
    features: [
      "UV-resistant wicker",
      "Removable/washable cover",
      "Rust-proof aluminum frame",
      "Lightweight design"
    ],
    reviews: [
      { 
        _id: "rev_010", 
        user: "Lisa M.", 
        rating: 4, 
        title: "Perfect for reading", 
        comment: "Very comfortable. Wish the cushion was a bit thicker.", 
        date: "2024-03-12", 
        verified: true, 
        helpful: 9 
      }
    ],
    tags: ["chaise", "wicker", "boho", "sunroom", "lounge"],
    featured: false,
    trending: false,
    bestSeller: false,
    newArrival: true,
    onSale: true,
    createdAt: "2024-03-10T08:00:00.000Z",
    updatedAt: "2024-03-31T10:30:00.000Z"
  },
  {
    _id: "prod_008",
    name: "The Gilded Age Cabinet",
    slug: "gilded-age-cabinet",
    description: "A maximalist's dream, this bar cabinet features intricate laser-cut floral patterns over a mirrored back. When closed, it's a statement piece; when opened, it reveals an LED-lit interior perfect for displaying glassware and decanters.",
    shortDescription: "Ornate metallic bar cabinet with LED interior lighting",
    price: 1299.99,
    originalPrice: 1699.99,
    category: "Living Room",
    subcategory: "Cabinets",
    material: "Engineered Wood / Tempered Glass",
    color: "Antique Gold",
    style: "Hollywood Regency",
    dimensions: "32\"W x 18\"D x 72\"H",
    weight: "140 lbs",
    inStock: true,
    stock: 6,
    rating: 5.0,
    numReviews: 15,
    images: [
      "https://images.pexels.com/photos/4846461/pexels-photo-4846461.jpeg",
      "https://images.pexels.com/photos/5824901/pexels-photo-5824901.jpeg",
      "https://images.pexels.com/photos/6782567/pexels-photo-6782567.jpeg",
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=1200"
    ],
    variants: [
      { color: "Antique Gold", finish: "Gloss", price: 1299.99, stock: 6 }
    ],
    features: [
      "Laser-cut metal exterior",
      "Adjustable glass shelves",
      "Remote-controlled LED lighting",
      "Soft-close hinges"
    ],
    reviews: [
      { 
        _id: "rev_011", 
        user: "Marcus V.", 
        rating: 5, 
        title: "Showstopper", 
        comment: "Everyone who walks in asks where I got it.", 
        date: "2024-02-28", 
        verified: true, 
        helpful: 55 
      }
    ],
    tags: ["cabinet", "bar", "maximalist", "gold", "storage"],
    featured: true,
    trending: true,
    bestSeller: false,
    newArrival: false,
    onSale: true,
    createdAt: "2024-01-18T08:00:00.000Z",
    updatedAt: "2024-03-25T10:30:00.000Z"
  },
  {
    _id: "prod_009",
    name: "The Cloud Nine Tufted Headboard",
    slug: "cloud-nine-tufted-headboard",
    description: "Transform your bedroom instantly with this oversized, floor-mounted headboard. Featuring deep diamond tufting and a plush, channel-quilted surface, this headboard adds hotel-luxury comfort to your space without replacing your entire bed frame.",
    shortDescription: "Oversized floor-mounted velvet headboard with diamond tufting",
    price: 399.99,
    originalPrice: 599.99,
    category: "Bedroom",
    subcategory: "Headboards",
    material: "Velvet / Plywood",
    color: "Dusty Rose",
    style: "Glam / Luxe",
    dimensions: "Queen: 62\"W x 48\"H",
    weight: "45 lbs",
    inStock: true,
    stock: 22,
    rating: 4.8,
    numReviews: 91,
    images: [
      "https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg",
"https://images.pexels.com/photos/2029694/pexels-photo-2029694.jpeg",
"https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
      "https://images.pexels.com/photos/4846461/pexels-photo-4846461.jpeg",
    ],
    variants: [
      { size: "Queen", color: "Dusty Rose", price: 399.99, stock: 22 },
      { size: "King", color: "Dusty Rose", price: 449.99, stock: 10 },
      { size: "Queen", color: "Emerald Green", price: 399.99, stock: 15 }
    ],
    features: [
      "Deep button tufting",
      "Stand-alone floor design",
      "Wall-mounted bracket included",
      "Stain-resistant fabric"
    ],
    reviews: [
      { 
        _id: "rev_012", 
        user: "Hannah J.", 
        rating: 5, 
        title: "Dramatic difference", 
        comment: "Made my basic bed look like a palace.", 
        date: "2024-03-22", 
        verified: true, 
        helpful: 33 
      }
    ],
    tags: ["headboard", "tufted", "velvet", "bedroom", "luxury"],
    featured: true,
    trending: true,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-01-30T08:00:00.000Z",
    updatedAt: "2024-03-26T10:30:00.000Z"
  },
  {
    _id: "prod_010",
    name: "The Aero Storage Bed",
    slug: "aero-storage-bed",
    description: "Solutions for small spaces. The Aero Storage Bed features four massive, hydraulic-lift drawers integrated into the base, utilizing the often-wasted space under your mattress. The upholstered headboard includes a built-in wireless charger.",
    shortDescription: "Space-saving bed with hydraulic storage and wireless charging",
    price: 1199.99,
    originalPrice: 1599.99,
    category: "Bedroom",
    subcategory: "Beds",
    material: "Linen Fabric / Plywood",
    color: "Oatmeal Beige",
    style: "Scandinavian",
    dimensions: "Queen: 64\"W x 84\"L x 38\"H",
    weight: "200 lbs",
    inStock: true,
    stock: 9,
    rating: 4.9,
    numReviews: 67,
    images: [
      "https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg",
      "https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200",
      "https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=1200"
    ],
    variants: [
      { size: "Full", color: "Oatmeal", price: 999.99, stock: 7 },
      { size: "Queen", color: "Oatmeal", price: 1199.99, stock: 9 },
      { size: "King", color: "Oatmeal", price: 1399.99, stock: 5 }
    ],
    features: [
      "Hydraulic lift mechanism",
      "4 large storage drawers",
      "Built-in USB/Wireless charging",
      "No box spring needed"
    ],
    reviews: [
      { 
        _id: "rev_013", 
        user: "Mike T.", 
        rating: 5, 
        title: "Storage genius", 
        comment: "Decluttered my whole room. The lift is super easy.", 
        date: "2024-03-19", 
        verified: true, 
        helpful: 41 
      }
    ],
    tags: ["storage-bed", "platform-bed", "ottoman", "bedroom", "space-saving"],
    featured: true,
    trending: false,
    bestSeller: false,
    newArrival: true,
    onSale: true,
    createdAt: "2024-02-20T08:00:00.000Z",
    updatedAt: "2024-04-01T10:30:00.000Z"
  },
  {
    _id: "prod_011",
    name: "Prism 6-Drawer Dresser",
    slug: "prism-6-drawer-dresser",
    description: "A modern take on the classic dresser. The Prism features a striking asymmetrical design with mixed materials: three rattan-woven drawers and three matte black drawers. Soft-close glides provide a silent, smooth open and close every time.",
    shortDescription: "Asymmetrical mixed-material dresser with rattan accents",
    price: 899.99,
    originalPrice: 1199.99,
    category: "Bedroom",
    subcategory: "Dressers",
    material: "Rattan / Wood Composite",
    color: "Black & Natural",
    style: "Modern Eclectic",
    dimensions: "58\"W x 18\"D x 32\"H",
    weight: "130 lbs",
    inStock: true,
    stock: 14,
    rating: 4.7,
    numReviews: 43,
    images: [
      "https://images.pexels.com/photos/6585759/pexels-photo-6585759.jpeg",
"https://images.pexels.com/photos/6186513/pexels-photo-6186513.jpeg",
"https://images.pexels.com/photos/7534567/pexels-photo-7534567.jpeg",
      "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=1200"
    ],
    variants: [
      { color: "Black/Natural", drawers: "Mixed", price: 899.99, stock: 14 }
    ],
    features: [
      "Soft-close drawer slides",
      "Mixed material design",
      "Sturdy particleboard frame",
      "Anti-tip hardware included"
    ],
    reviews: [
      { 
        _id: "rev_014", 
        user: "Elena C.", 
        rating: 5, 
        title: "Design forward", 
        comment: "The asymmetry is so stylish. Holds a ton of clothes.", 
        date: "2024-03-27", 
        verified: true, 
        helpful: 21 
      }
    ],
    tags: ["dresser", "chest", "rattan", "asymmetrical", "storage"],
    featured: false,
    trending: true,
    bestSeller: false,
    newArrival: true,
    onSale: false,
    createdAt: "2024-03-05T08:00:00.000Z",
    updatedAt: "2024-03-30T10:30:00.000Z"
  },
  {
    _id: "prod_012",
    name: "Lunar Nightstand with LED",
    slug: "lunar-nightstand-led",
    description: "Combining smart home features with sleek design, the Lunar nightstand features a floating silhouette with integrated RGB LED lighting on the underside. It includes a hidden Qi wireless charging pad in the top surface and a pull-out tray in the drawer.",
    shortDescription: "Floating nightstand with RGB mood lighting and wireless charging",
    price: 199.99,
    originalPrice: 299.99,
    category: "Bedroom",
    subcategory: "Nightstands",
    material: "MDF / Acrylic",
    color: "High-Gloss White",
    style: "Futuristic / Minimalist",
    dimensions: "20\"W x 16\"D x 24\"H",
    weight: "25 lbs",
    inStock: true,
    stock: 35,
    rating: 4.6,
    numReviews: 118,
    images: [
      "https://images.pexels.com/photos/4846094/pexels-photo-4846094.jpeg",
"https://images.pexels.com/photos/5824888/pexels-photo-5824888.jpeg",
"https://images.pexels.com/photos/3144581/pexels-photo-3144581.jpeg",
      "https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?w=1200",
    ],
    variants: [
      { color: "White", finish: "Gloss", price: 199.99, stock: 35 },
      { color: "Black", finish: "Matte", price: 199.99, stock: 28 }
    ],
    features: [
      "RGB App-controlled lighting",
      "Wireless charging (10W)",
      "Hidden pull-out tray",
      "Floating mount"
    ],
    reviews: [
      { 
        _id: "rev_015", 
        user: "TechGuy88", 
        rating: 4, 
        title: "Love the lights", 
        comment: "The app is a bit buggy but the hardware is great.", 
        date: "2024-03-15", 
        verified: true, 
        helpful: 27 
      }
    ],
    tags: ["nightstand", "led", "smart-furniture", "floating", "modern"],
    featured: false,
    trending: true,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-02-12T08:00:00.000Z",
    updatedAt: "2024-03-29T10:30:00.000Z"
  },
  {
    _id: "prod_013",
    name: "The Haven Bed Canopy",
    slug: "haven-bed-canopy",
    description: "Create a cozy, bohemian sanctuary with The Haven Canopy. Unlike cheap curtains, this system features a sturdy, ceiling-mounted brass rod and heavy-weight, 100% linen drapes that frame your bed perfectly. Includes integrated string lights for a magical glow.",
    shortDescription: "Bohemian canopy system with brass hardware and linen drapes",
    price: 249.99,
    originalPrice: 380.00,
    category: "Bedroom",
    subcategory: "Bedding",
    material: "French Linen / Brass",
    color: "Natural Beige",
    style: "Bohemian",
    dimensions: "Adjustable (Fits Queen/King)",
    weight: "18 lbs",
    inStock: true,
    stock: 18,
    rating: 4.9,
    numReviews: 52,
    images: [
      "https://images.pexels.com/photos/6476587/pexels-photo-6476587.jpeg",
"https://images.pexels.com/photos/6508356/pexels-photo-6508356.jpeg",
"https://images.pexels.com/photos/5824895/pexels-photo-5824895.jpeg",
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=1200"
    ],
    variants: [
      { color: "Natural Beige", fabric: "Linen", price: 249.99, stock: 18 }
    ],
    features: [
      "100% French linen",
      "Tarnish-proof brass rod",
      "Integrated fairy lights",
      "Ceiling mount required"
    ],
    reviews: [
      { 
        _id: "rev_016", 
        user: "Wanderlust_Wendy", 
        rating: 5, 
        title: "Magical vibes", 
        comment: "Makes my rental feel like a boutique hotel.", 
        date: "2024-03-21", 
        verified: true, 
        helpful: 38 
      }
    ],
    tags: ["canopy", "bohemian", "linen", "bedroom", "lighting"],
    featured: true,
    trending: true,
    bestSeller: false,
    newArrival: false,
    onSale: true,
    createdAt: "2024-01-22T08:00:00.000Z",
    updatedAt: "2024-03-24T10:30:00.000Z"
  },
  {
    _id: "prod_014",
    name: "The Origami Vanity Desk",
    slug: "origami-vanity-desk",
    description: "A masterpiece of geometry, this vanity desk features a hinged top that reveals a hidden mirror and jewelry tray. The triangular, origami-like base is made of solid walnut, while the top is a matte laminate resistant to makeup stains.",
    shortDescription: "Space-saving vanity desk with hidden mirror and geometric base",
    price: 549.99,
    originalPrice: 699.99,
    category: "Bedroom",
    subcategory: "Vanities",
    material: "Walnut Wood / Laminate",
    color: "Espresso / White",
    style: "Scandinavian / Japandi",
    dimensions: "32\"W x 16\"D x 30\"H",
    weight: "50 lbs",
    inStock: true,
    stock: 11,
    rating: 4.8,
    numReviews: 34,
    images: [
      "https://images.pexels.com/photos/6186514/pexels-photo-6186514.jpeg",
"https://images.pexels.com/photos/7534565/pexels-photo-7534565.jpeg",
      "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=1200",
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1200"
    ],
    variants: [
      { color: "Walnut/White", style: "Foldable", price: 549.99, stock: 11 }
    ],
    features: [
      "Folding mirror mechanism",
      "Hidden storage compartments",
      "Scratch-resistant top",
      "Sleek triangular legs"
    ],
    reviews: [
      { 
        _id: "rev_017", 
        user: "MakeupMaven", 
        rating: 5, 
        title: "Genius design", 
        comment: "Saves so much space in my small apartment.", 
        date: "2024-03-14", 
        verified: true, 
        helpful: 19 
      }
    ],
    tags: ["vanity", "desk", "japandi", "storage", "mirror"],
    featured: false,
    trending: false,
    bestSeller: true,
    newArrival: false,
    onSale: false,
    createdAt: "2024-02-18T08:00:00.000Z",
    updatedAt: "2024-03-27T10:30:00.000Z"
  },
  {
    _id: "prod_015",
    name: "The Hideaway Corner Desk",
    slug: "hideaway-corner-desk",
    description: "Designed for the work-from-home era, this corner desk maximizes dead space. It features a natural woodgrain work surface with a built-in cable management gutter and a clever magnetic whiteboard panel that hides a cork board on the reverse side.",
    shortDescription: "Space-efficient corner desk with reversible whiteboard/cork panel",
    price: 379.99,
    originalPrice: 499.99,
    category: "Bedroom",
    subcategory: "Desks",
    material: "Engineered Wood / Steel",
    color: "Rustic Oak",
    style: "Industrial",
    dimensions: "48\"W x 48\"D x 29\"H",
    weight: "70 lbs",
    inStock: true,
    stock: 24,
    rating: 4.7,
    numReviews: 88,
    images: [
      "https://images.pexels.com/photos/7534569/pexels-photo-7534569.jpeg",
"https://images.pexels.com/photos/6580227/pexels-photo-6580227.jpeg",
"https://images.pexels.com/photos/6508357/pexels-photo-6508357.jpeg",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200"
    ],
    variants: [
      { color: "Rustic Oak", legStyle: "Black Steel", price: 379.99, stock: 24 }
    ],
    features: [
      "Corner-maximizing shape",
      "Magnetic accessories included",
      "Cable management gutter",
      "Tilt-adjustable feet"
    ],
    reviews: [
      { 
        _id: "rev_018", 
        user: "Wfh_Dan", 
        rating: 5, 
        title: "Fits perfectly", 
        comment: "Finally a desk that uses my wasted corner space.", 
        date: "2024-03-28", 
        verified: true, 
        helpful: 15 
      }
    ],
    tags: ["desk", "corner-desk", "office", "work-from-home", "industrial"],
    featured: false,
    trending: true,
    bestSeller: false,
    newArrival: true,
    onSale: true,
    createdAt: "2024-03-08T08:00:00.000Z",
    updatedAt: "2024-04-02T10:30:00.000Z"
  },
  {
    _id: "prod_016",
    name: "The Cocoon Upholstered Bench",
    slug: "cocoon-upholstered-bench",
    description: "A versatile accent piece for the foot of your bed or entryway. The Cocoon bench features a deep, channel-tufted seat cushion wrapped in performance velvet, supported by solid walnut tapered legs. The hinged seat lifts to reveal hidden storage for blankets or shoes.",
    shortDescription: "Channel-tufted storage bench with velvet upholstery and walnut legs",
    price: 329.99,
    originalPrice: 449.99,
    category: "Bedroom",
    subcategory: "Benches",
    material: "Performance Velvet / Solid Walnut",
    color: "Moss Green",
    style: "Modern Classic",
    dimensions: "48\"W x 18\"D x 20\"H",
    weight: "42 lbs",
    inStock: true,
    stock: 16,
    rating: 4.8,
    numReviews: 47,
    images: [
      "https://images.pexels.com/photos/5824896/pexels-photo-5824896.jpeg",
      "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=1200",
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1200",
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=1200"
    ],
    variants: [
      { color: "Moss Green", fabric: "Velvet", price: 329.99, stock: 16 },
      { color: "Charcoal Gray", fabric: "Velvet", price: 329.99, stock: 12 },
      { color: "Blush Pink", fabric: "Performance Fabric", price: 299.99, stock: 8 }
    ],
    features: [
      "Hidden storage compartment",
      "Channel tufting detail",
      "Solid walnut legs with non-marking feet",
      "High-density foam cushion",
      "Stain-resistant performance fabric"
    ],
    reviews: [
      { 
        _id: "rev_019", 
        user: "Natalie R.", 
        rating: 5, 
        title: "Beautiful and functional", 
        comment: "Perfect at the foot of our bed. Stores extra blankets beautifully.", 
        date: "2024-03-25", 
        verified: true, 
        helpful: 23 
      }
    ],
    tags: ["bench", "storage-bench", "velvet", "bedroom", "entryway"],
    featured: false,
    trending: true,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-02-08T08:00:00.000Z",
    updatedAt: "2024-03-28T10:30:00.000Z"
  },
  {
    _id: "prod_017",
    name: "The Aurora Floor Mirror",
    slug: "aurora-floor-mirror",
    description: "Make a statement with this oversized arched floor mirror. The Aurora features a thin, beveled glass profile within a solid oak frame, available in natural or black stain. A slight forward lean creates the perfect angle for full-body viewing while adding architectural interest to any room.",
    shortDescription: "Oversized arched floor mirror with solid oak frame",
    price: 449.99,
    originalPrice: 599.99,
    category: "Bedroom",
    subcategory: "Mirrors",
    material: "Solid Oak / Beveled Glass",
    color: "Natural Oak",
    style: "Scandinavian / Organic",
    dimensions: "32\"W x 72\"H",
    weight: "38 lbs",
    inStock: true,
    stock: 20,
    rating: 4.9,
    numReviews: 103,
    images: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200",
      "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=1200",
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=1200",
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1200"
    ],
    variants: [
      { color: "Natural Oak", frame: "Solid Wood", price: 449.99, stock: 20 },
      { color: "Black Stain", frame: "Solid Wood", price: 469.99, stock: 10 },
      { color: "Walnut", frame: "Solid Wood", price: 479.99, stock: 8 }
    ],
    features: [
      "Full-length beveled mirror",
      "Solid oak construction",
      "Slight forward lean for optimal viewing",
      "Wall anchor included for safety",
      "Scratch-resistant glass coating"
    ],
    reviews: [
      { 
        _id: "rev_020", 
        user: "Olivia P.", 
        rating: 5, 
        title: "Stunning quality", 
        comment: "The wood grain is beautiful and it makes my room feel so much bigger.", 
        date: "2024-03-20", 
        verified: true, 
        helpful: 45 
      }
    ],
    tags: ["mirror", "floor-mirror", "arched", "oak", "dressing"],
    featured: true,
    trending: true,
    bestSeller: false,
    newArrival: false,
    onSale: true,
    createdAt: "2024-01-28T08:00:00.000Z",
    updatedAt: "2024-03-26T10:30:00.000Z"
  },
  {
    _id: "prod_018",
    name: "The Ember Leather Ottoman",
    slug: "ember-leather-ottoman",
    description: "A versatile leather ottoman that works as a footrest, coffee table, or extra seating. The round silhouette features a richly burnished cognac leather that develops a beautiful patina over time. The interior offers generous hidden storage for throws and magazines.",
    shortDescription: "Round leather storage ottoman with burnished cognac finish",
    price: 279.99,
    originalPrice: 399.99,
    category: "Living Room",
    subcategory: "Ottomans",
    material: "Top-Grain Leather / Plywood",
    color: "Burnished Cognac",
    style: "Traditional / Rustic",
    dimensions: "36\"W x 36\"D x 18\"H",
    weight: "32 lbs",
    inStock: true,
    stock: 25,
    rating: 4.7,
    numReviews: 76,
    images: [
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=1200",
      "https://images.unsplash.com/photo-1550226891-ef816aed4a98?w=1200",
      "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=1200",
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=1200"
    ],
    variants: [
      { color: "Burnished Cognac", material: "Top-Grain Leather", price: 279.99, stock: 25 },
      { color: "Espresso", material: "Top-Grain Leather", price: 299.99, stock: 15 },
      { color: "Charcoal", material: "Performance Fabric", price: 199.99, stock: 30 }
    ],
    features: [
      "Hidden storage compartment",
      "Top-grain leather upholstery",
      "Button tufted top",
      "Reversible lid",
      "Non-slip bottom"
    ],
    reviews: [
      { 
        _id: "rev_021", 
        user: "Thomas L.", 
        rating: 5, 
        title: "Great value", 
        comment: "The leather is soft and the storage is a game changer.", 
        date: "2024-03-18", 
        verified: true, 
        helpful: 31 
      }
    ],
    tags: ["ottoman", "storage", "leather", "footrest", "living-room"],
    featured: false,
    trending: false,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-02-14T08:00:00.000Z",
    updatedAt: "2024-03-30T10:30:00.000Z"
  },
  {
    _id: "prod_019",
    name: "The Prism Modular Shelf System",
    slug: "prism-modular-shelf-system",
    description: "Create your perfect wall arrangement with this customizable modular shelf system. Each set includes six geometric shelves in three sizes that can be configured in countless layouts. The matte powder-coated steel frames support heavy books and decor items.",
    shortDescription: "Customizable geometric wall shelf system in matte black",
    price: 249.99,
    originalPrice: 349.99,
    category: "Living Room",
    subcategory: "Shelving",
    material: "Powder-Coated Steel",
    color: "Matte Black",
    style: "Industrial / Modern",
    dimensions: "Various (Set covers approx 48\"W x 36\"H)",
    weight: "28 lbs",
    inStock: true,
    stock: 40,
    rating: 4.6,
    numReviews: 92,
    images: [
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200",
      "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=1200",
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1200",
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=1200"
    ],
    variants: [
      { color: "Matte Black", finish: "Powder-Coated", price: 249.99, stock: 40 },
      { color: "Brass", finish: "Polished", price: 299.99, stock: 12 },
      { color: "White", finish: "Matte", price: 249.99, stock: 25 }
    ],
    features: [
      "6 modular pieces in 3 sizes",
      "Tool-free assembly with cam locks",
      "Wall mounting hardware included",
      "20lb weight capacity per shelf",
      "Scratch-resistant powder coating"
    ],
    reviews: [
      { 
        _id: "rev_022", 
        user: "Jessica W.", 
        rating: 4, 
        title: "So many possibilities", 
        comment: "I've re-arranged it three times already. Love the versatility.", 
        date: "2024-03-22", 
        verified: true, 
        helpful: 27 
      }
    ],
    tags: ["shelving", "modular", "wall-shelf", "industrial", "storage"],
    featured: true,
    trending: true,
    bestSeller: false,
    newArrival: true,
    onSale: false,
    createdAt: "2024-03-01T08:00:00.000Z",
    updatedAt: "2024-04-01T10:30:00.000Z"
  },
  {
    _id: "prod_020",
    name: "The Sunset Swivel Rocker",
    slug: "sunset-swivel-rocker",
    description: "The perfect nursery or reading chair that transitions beautifully into your living room. This swivel rocker features a smooth 360-degree rotation, gentle rocking motion, and a deep seat cushion wrapped in machine-washable performance fabric. The oak base adds organic warmth.",
    shortDescription: "Versatile swivel rocker with washable performance fabric",
    price: 549.99,
    originalPrice: 699.99,
    category: "Living Room",
    subcategory: "Rocking Chairs",
    material: "Performance Fabric / Solid Oak",
    color: "Dusty Blue",
    style: "Transitional",
    dimensions: "30\"W x 34\"D x 38\"H",
    weight: "55 lbs",
    inStock: true,
    stock: 14,
    rating: 4.9,
    numReviews: 128,
    images: [
      "https://images.pexels.com/photos/2762247/pexels-photo-2762247.jpeg",
      "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=1200",
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=1200",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200"
    ],
    variants: [
      { color: "Dusty Blue", fabric: "Performance", price: 549.99, stock: 14 },
      { color: "Cream", fabric: "Performance", price: 549.99, stock: 10 },
      { color: "Terracotta", fabric: "Velvet", price: 579.99, stock: 6 }
    ],
    features: [
      "360-degree swivel + rocker combo",
      "Removable machine-washable cover",
      "Solid oak exposed legs",
      "High-resiliency foam cushions",
      "Quiet ball-bearing mechanism"
    ],
    reviews: [
      { 
        _id: "rev_023", 
        user: "Emily C.", 
        rating: 5, 
        title: "Nursery hero", 
        comment: "So comfortable for late-night feedings. Spills wipe right off.", 
        date: "2024-03-29", 
        verified: true, 
        helpful: 52 
      }
    ],
    tags: ["rocker", "swivel", "nursery", "performance-fabric", "chair"],
    featured: true,
    trending: true,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-01-10T08:00:00.000Z",
    updatedAt: "2024-03-25T10:30:00.000Z"
  },
  {
    _id: "prod_021",
    name: "The Metro Industrial Bookshelf",
    slug: "metro-industrial-bookshelf",
    description: "Channel urban loft vibes with this industrial pipe bookshelf. Constructed from heavy-gauge iron piping and solid reclaimed pine shelves, this unit is built to last. Each shelf holds up to 75lbs, making it perfect for large book collections or heavy decor.",
    shortDescription: "Heavy-duty industrial pipe bookshelf with reclaimed pine",
    price: 599.99,
    originalPrice: 799.99,
    category: "Living Room",
    subcategory: "Bookcases",
    material: "Reclaimed Pine / Iron Pipe",
    color: "Weathered Gray / Black",
    style: "Industrial / Rustic",
    dimensions: "36\"W x 14\"D x 72\"H",
    weight: "95 lbs",
    inStock: true,
    stock: 9,
    rating: 4.8,
    numReviews: 64,
    images: [
      "https://images.pexels.com/photos/6580229/pexels-photo-6580229.jpeg",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200",
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1200"
    ],
    variants: [
      { color: "Weathered Gray / Black", shelves: "Reclaimed Pine", price: 599.99, stock: 9 },
      { color: "Natural Wood / Brass", shelves: "Solid Oak", price: 699.99, stock: 5 }
    ],
    features: [
      "Solid reclaimed pine shelves",
      "Heavy-gauge iron pipe frame",
      "75lb weight capacity per shelf",
      "Adjustable leveling feet",
      "Pre-assembled pipe sections"
    ],
    reviews: [
      { 
        _id: "rev_024", 
        user: "Chris D.", 
        rating: 5, 
        title: "Tank", 
        comment: "This thing is a beast. Holds my entire library no problem.", 
        date: "2024-03-17", 
        verified: true, 
        helpful: 38 
      }
    ],
    tags: ["bookshelf", "industrial", "pipe", "reclaimed-wood", "storage"],
    featured: false,
    trending: false,
    bestSeller: false,
    newArrival: true,
    onSale: true,
    createdAt: "2024-03-12T08:00:00.000Z",
    updatedAt: "2024-03-31T10:30:00.000Z"
  },
  {
    _id: "prod_022",
    name: "The Mirage Glass Display Cabinet",
    slug: "mirage-glass-display-cabinet",
    description: "Showcase your collectibles with this elegant glass display cabinet. The Mirage features four tempered glass shelves with integrated LED lighting that illuminates your items. The slim-profile aluminum frame keeps the focus on your displayed objects.",
    shortDescription: "Slim-profile glass display cabinet with integrated LED lighting",
    price: 399.99,
    originalPrice: 549.99,
    category: "Living Room",
    subcategory: "Display Cabinets",
    material: "Tempered Glass / Aluminum",
    color: "Silver / Clear",
    style: "Contemporary / Minimalist",
    dimensions: "24\"W x 18\"D x 68\"H",
    weight: "65 lbs",
    inStock: true,
    stock: 12,
    rating: 4.7,
    numReviews: 41,
    images: [
      "https://images.pexels.com/photos/2082090/pexels-photo-2082090.jpeg",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200",
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1200",
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=1200"
    ],
    variants: [
      { color: "Silver / Clear", frame: "Aluminum", price: 399.99, stock: 12 },
      { color: "Black / Clear", frame: "Aluminum", price: 399.99, stock: 8 },
      { color: "Gold / Clear", frame: "Brass", price: 449.99, stock: 5 }
    ],
    features: [
      "4 adjustable tempered glass shelves",
      "Integrated LED strip lighting (remote included)",
      "Magnetic door closure",
      "Slim-profile aluminum frame",
      "Visible from all angles"
    ],
    reviews: [
      { 
        _id: "rev_025", 
        user: "Collector_Ken", 
        rating: 5, 
        title: "Showcase quality", 
        comment: "The lights make my collection pop. Looks like a museum piece.", 
        date: "2024-03-24", 
        verified: true, 
        helpful: 19 
      }
    ],
    tags: ["display-cabinet", "glass", "led", "collectibles", "curio"],
    featured: false,
    trending: true,
    bestSeller: false,
    newArrival: true,
    onSale: false,
    createdAt: "2024-03-15T08:00:00.000Z",
    updatedAt: "2024-04-02T10:30:00.000Z"
  },
    {
    _id: "prod_023",
    name: "The Haven Upholstered Platform Bed",
    slug: "haven-upholstered-platform-bed",
    description: "Transform your bedroom into a serene retreat with The Haven Platform Bed. Featuring a tall, wingback headboard with deep button tufting and premium linen-blend upholstery, this bed brings hotel luxury home. The solid wood slat system eliminates the need for a box spring while providing exceptional mattress support.",
    shortDescription: "Luxury upholstered platform bed with wingback headboard",
    price: 1099.99,
    originalPrice: 1499.99,
    category: "Bedroom",
    subcategory: "Beds",
    material: "Linen-Blend Fabric / Solid Wood",
    color: "Oatmeal Beige",
    style: "Traditional / Transitional",
    dimensions: "Queen: 64\"W x 88\"L x 54\"H",
    weight: "165 lbs",
    inStock: true,
    stock: 12,
    rating: 4.8,
    numReviews: 89,
    images: [
      "https://images.pexels.com/photos/6480707/pexels-photo-6480707.jpeg",
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200",
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=1200",
      "https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=1200"
    ],
    variants: [
      { size: "Twin", color: "Oatmeal Beige", price: 799.99, stock: 8 },
      { size: "Full", color: "Oatmeal Beige", price: 949.99, stock: 10 },
      { size: "Queen", color: "Oatmeal Beige", price: 1099.99, stock: 12 },
      { size: "King", color: "Oatmeal Beige", price: 1299.99, stock: 6 },
      { size: "Queen", color: "Charcoal Gray", price: 1149.99, stock: 8 },
      { size: "Queen", color: "Blush Pink", price: 1099.99, stock: 5 }
    ],
    features: [
      "Deep button-tufted wingback headboard",
      "Linen-blend performance fabric",
      "Solid wood slat system (no box spring needed)",
      "Pillow-top padded headboard",
      "Strong wooden frame construction",
      "Non-slip tape on slats"
    ],
    reviews: [
      { 
        _id: "rev_026", 
        user: "Rebecca T.", 
        rating: 5, 
        title: "Dream bed!",
        comment: "The headboard is incredibly comfortable for reading in bed. Assembly was straightforward and the quality is outstanding.", 
        date: "2024-04-05",
        verified: true,
        helpful: 34
      },
      { 
        _id: "rev_027", 
        user: "Jonathan L.", 
        rating: 4, 
        title: "Beautiful but heavy",
        comment: "Love the look and feel. Just be prepared for a heavy delivery.", 
        date: "2024-03-28",
        verified: true,
        helpful: 18
      }
    ],
    tags: ["platform-bed", "upholstered-bed", "wingback", "tufted", "bedroom", "luxury"],
    featured: true,
    trending: true,
    bestSeller: true,
    newArrival: true,
    onSale: true,
    createdAt: "2024-03-01T08:00:00.000Z",
    updatedAt: "2024-04-05T10:30:00.000Z"
  },
  {
    _id: "prod_024",
    name: "The Driftwood Canopy Bed",
    slug: "driftwood-canopy-bed",
    description: "Make a dramatic statement with our Driftwood Canopy Bed. Crafted from solid reclaimed pine with a distressed gray wash finish, this four-poster bed features a removable canopy frame that allows you to drape sheer curtains for a romantic, bohemian vibe. The rustic finish adds warmth and character to any bedroom.",
    shortDescription: "Rustic four-poster canopy bed made from reclaimed pine",
    price: 1599.99,
    originalPrice: 1999.99,
    category: "Bedroom",
    subcategory: "Beds",
    material: "Reclaimed Pine",
    color: "Driftwood Gray",
    style: "Rustic / Farmhouse",
    dimensions: "Queen: 66\"W x 86\"L x 86\"H",
    weight: "210 lbs",
    inStock: true,
    stock: 7,
    rating: 4.7,
    numReviews: 54,
    images: [
      "https://images.pexels.com/photos/6585758/pexels-photo-6585758.jpeg",
"https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg",
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=1200",
      "https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=1200"
    ],
    variants: [
      { size: "Full", color: "Driftwood Gray", price: 1399.99, stock: 5 },
      { size: "Queen", color: "Driftwood Gray", price: 1599.99, stock: 7 },
      { size: "King", color: "Driftwood Gray", price: 1899.99, stock: 4 },
      { size: "Queen", color: "Espresso Stain", price: 1699.99, stock: 6 }
    ],
    features: [
      "Solid reclaimed pine construction",
      "Removable canopy frame",
      "Distressed gray wash finish",
      "Slatted base (no box spring required)",
      "Knockdown design for easy moving",
      "Hardware hidden for clean look"
    ],
    reviews: [
      { 
        _id: "rev_028", 
        user: "Amber W.", 
        rating: 5, 
        title: "Fairytale vibes",
        comment: "I added sheer curtains and it looks magical. The reclaimed wood has so much character!", 
        date: "2024-03-30",
        verified: true,
        helpful: 42
      }
    ],
    tags: ["canopy-bed", "four-poster", "reclaimed-wood", "rustic", "farmhouse", "bedroom"],
    featured: true,
    trending: false,
    bestSeller: false,
    newArrival: false,
    onSale: false,
    createdAt: "2024-02-10T08:00:00.000Z",
    updatedAt: "2024-03-28T10:30:00.000Z"
  },
  {
    _id: "prod_025",
    name: "The Zenith Adjustable Bed Base",
    slug: "zenith-adjustable-bed-base",
    description: "Experience ultimate relaxation with The Zenith Adjustable Bed Base. Featuring independent head and foot incline controls, zero-gravity preset, and under-bed LED lighting, this smart base transforms your sleep experience. The wireless remote and app control make finding your perfect position effortless.",
    shortDescription: "Smart adjustable bed base with zero-gravity preset and app control",
    price: 899.99,
    originalPrice: 1299.99,
    category: "Bedroom",
    subcategory: "Beds",
    material: "Steel Frame / Fabric Cover",
    color: "Charcoal Gray",
    style: "Modern / Smart",
    dimensions: "Queen: 60\"W x 80\"L x 15\"H",
    weight: "145 lbs",
    inStock: true,
    stock: 18,
    rating: 4.9,
    numReviews: 112,
    images: [
      "https://images.pexels.com/photos/4846457/pexels-photo-4846457.jpeg",
"https://images.pexels.com/photos/6508399/pexels-photo-6508399.jpeg",
      "https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=1200",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200"
    ],
    variants: [
      { size: "Twin XL", color: "Charcoal Gray", price: 699.99, stock: 10 },
      { size: "Full", color: "Charcoal Gray", price: 799.99, stock: 12 },
      { size: "Queen", color: "Charcoal Gray", price: 899.99, stock: 18 },
      { size: "King", color: "Charcoal Gray", price: 1299.99, stock: 8 },
      { size: "Split King", color: "Charcoal Gray", price: 1599.99, stock: 5 }
    ],
    features: [
      "Independent head and foot incline",
      "Zero-gravity preset position",
      "Wireless remote + smartphone app control",
      "Under-bed USB charging ports",
      "Programmable memory positions",
      "Under-bed LED night lights"
    ],
    reviews: [
      { 
        _id: "rev_029", 
        user: "Dr. Michael R.", 
        rating: 5, 
        title: "Game changer for back pain",
        comment: "The zero-gravity position has eliminated my morning back pain. Worth every penny.", 
        date: "2024-04-01",
        verified: true,
        helpful: 67
      }
    ],
    tags: ["adjustable-bed", "smart-bed", "zero-gravity", "electric-bed", "bedroom", "health"],
    featured: true,
    trending: true,
    bestSeller: true,
    newArrival: true,
    onSale: true,
    createdAt: "2024-03-15T08:00:00.000Z",
    updatedAt: "2024-04-05T10:30:00.000Z"
  },
  {
    _id: "prod_026",
    name: "The Heritage Iron Bed Frame",
    slug: "heritage-iron-bed-frame",
    description: "Timeless elegance meets durability with our Heritage Iron Bed Frame. Hand-forged from solid wrought iron with intricate scrollwork and finial details, this bed is built to last generations. The antique black finish complements both traditional and modern farmhouse aesthetics.",
    shortDescription: "Hand-forged wrought iron bed frame with ornate scrollwork",
    price: 799.99,
    originalPrice: 1099.99,
    category: "Bedroom",
    subcategory: "Beds",
    material: "Wrought Iron",
    color: "Antique Black",
    style: "Traditional / French Country",
    dimensions: "Queen: 62\"W x 84\"L x 52\"H",
    weight: "120 lbs",
    inStock: true,
    stock: 14,
    rating: 4.8,
    numReviews: 78,
    images: [
      "https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg",
"https://images.pexels.com/photos/2029694/pexels-photo-2029694.jpeg",
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=1200",
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200"
    ],
    variants: [
      { size: "Full", color: "Antique Black", price: 699.99, stock: 10 },
      { size: "Queen", color: "Antique Black", price: 799.99, stock: 14 },
      { size: "King", color: "Antique Black", price: 999.99, stock: 6 },
      { size: "Queen", color: "Matte White", price: 849.99, stock: 8 },
      { size: "Queen", color: "Bronze", price: 899.99, stock: 5 }
    ],
    features: [
      "Hand-forged solid wrought iron",
      "Ornate scrollwork and finial details",
      "Rust-resistant powder coating",
      "Includes metal slats (no box spring)",
      "Heavy-duty construction",
      "Easy assembly with included tools"
    ],
    reviews: [
      { 
        _id: "rev_030", 
        user: "Eleanor H.", 
        rating: 5, 
        title: "Heirloom quality",
        comment: "This bed is incredibly sturdy. The scrollwork is beautiful and the finish is flawless.", 
        date: "2024-03-25",
        verified: true,
        helpful: 29
      }
    ],
    tags: ["iron-bed", "wrought-iron", "metal-bed", "traditional", "bedroom", "heirloom"],
    featured: false,
    trending: false,
    bestSeller: false,
    newArrival: false,
    onSale: true,
    createdAt: "2024-02-20T08:00:00.000Z",
    updatedAt: "2024-03-30T10:30:00.000Z"
  },
  {
    _id: "prod_027",
    name: "The Breeze Low-Profile Bed",
    slug: "breeze-low-profile-bed",
    description: "Perfect for modern and Japanese-inspired interiors, The Breeze Low-Profile Bed sits just 8 inches off the ground. The solid oak frame features clean lines, rounded corners, and a natural oil finish that highlights the wood's organic grain pattern. The platform design works with or without a box spring.",
    shortDescription: "Japanese-inspired low-profile platform bed with solid oak frame",
    price: 1299.99,
    originalPrice: 1699.99,
    category: "Bedroom",
    subcategory: "Beds",
    material: "Solid Oak",
    color: "Natural Oil Finish",
    style: "Japanese / Zen",
    dimensions: "Queen: 64\"W x 82\"L x 8\"H",
    weight: "140 lbs",
    inStock: true,
    stock: 10,
    rating: 4.9,
    numReviews: 45,
    images: [
      "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
      "https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=1200",
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=1200",
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200"
    ],
    variants: [
      { size: "Full", color: "Natural Oak", price: 1099.99, stock: 8 },
      { size: "Queen", color: "Natural Oak", price: 1299.99, stock: 10 },
      { size: "King", color: "Natural Oak", price: 1599.99, stock: 6 },
      { size: "Queen", color: "Walnut", price: 1499.99, stock: 5 }
    ],
    features: [
      "Ultra-low 8-inch profile",
      "Solid oak construction with rounded corners",
      "Natural oil finish (non-toxic)",
      "Integrated slat system",
      "Soft-close wood-on-wood joinery",
      "Felt pads protect floors"
    ],
    reviews: [
      { 
        _id: "rev_031", 
        user: "Kenji T.", 
        rating: 5, 
        title: "Clean and minimalist",
        comment: "Exactly what I wanted for my Japanese-inspired apartment. The quality is superb.", 
        date: "2024-04-02",
        verified: true,
        helpful: 23
      }
    ],
    tags: ["low-profile", "platform-bed", "japanese", "zen", "minimalist", "bedroom"],
    featured: true,
    trending: true,
    bestSeller: false,
    newArrival: true,
    onSale: false,
    createdAt: "2024-03-10T08:00:00.000Z",
    updatedAt: "2024-04-03T10:30:00.000Z"
  },
  {
    _id: "prod_028",
    name: "The Coastal Escape Bed",
    slug: "coastal-escape-bed",
    description: "Bring the serenity of the beach to your bedroom with our Coastal Escape Bed. Featuring a panel headboard with rope-wrapped accents and a whitewashed oak finish, this bed captures the essence of coastal living. The arched headboard silhouette adds architectural interest while maintaining a relaxed vibe.",
    shortDescription: "Coastal-style bed with rope accents and whitewashed oak finish",
    price: 1199.99,
    originalPrice: 1599.99,
    category: "Bedroom",
    subcategory: "Beds",
    material: "Oak / Rope",
    color: "Whitewashed Oak",
    style: "Coastal / Hamptons",
    dimensions: "Queen: 66\"W x 86\"L x 52\"H",
    weight: "155 lbs",
    inStock: true,
    stock: 9,
    rating: 4.7,
    numReviews: 62,
    images: [
      "https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg",
      "https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg",
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=1200",
      "https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=1200"
    ],
    variants: [
      { size: "Full", color: "Whitewashed Oak", price: 1049.99, stock: 7 },
      { size: "Queen", color: "Whitewashed Oak", price: 1199.99, stock: 9 },
      { size: "King", color: "Whitewashed Oak", price: 1499.99, stock: 5 },
      { size: "Queen", color: "Weathered Gray", price: 1249.99, stock: 6 }
    ],
    features: [
      "Arched panel headboard",
      "Hand-wrapped rope accents",
      "Whitewashed oak finish",
      "Slatted base for ventilation",
      "Block legs with non-marking feet",
      "Coastal-inspired design"
    ],
    reviews: [
      { 
        _id: "rev_032", 
        user: "Catherine M.", 
        rating: 5, 
        title: "Beach cottage dream",
        comment: "The rope details are stunning. My room feels like a Nantucket getaway now.", 
        date: "2024-03-27",
        verified: true,
        helpful: 31
      }
    ],
    tags: ["coastal", "beach-style", "rope", "whitewashed", "bedroom", "hamptons"],
    featured: false,
    trending: true,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-02-05T08:00:00.000Z",
    updatedAt: "2024-03-29T10:30:00.000Z"
  },
  {
    _id: "prod_029",
    name: "The Modernist Sled Bed",
    slug: "modernist-sled-bed",
    description: "Mid-century modern meets contemporary design in our Modernist Sled Bed. The continuous curved headboard and footboard create a sleek sled silhouette, while walnut veneer and tapered solid wood legs complete the iconic look. The floating effect adds visual lightness to your bedroom.",
    shortDescription: "Mid-century modern sled bed with walnut veneer and tapered legs",
    price: 999.99,
    originalPrice: 1399.99,
    category: "Bedroom",
    subcategory: "Beds",
    material: "Walnut Veneer / Solid Wood",
    color: "Walnut",
    style: "Mid-Century Modern",
    dimensions: "Queen: 62\"W x 82\"L x 38\"H",
    weight: "125 lbs",
    inStock: true,
    stock: 16,
    rating: 4.8,
    numReviews: 94,
    images: [
      "https://images.pexels.com/photos/6585759/pexels-photo-6585759.jpeg",
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200",
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=1200",
      "https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=1200"
    ],
    variants: [
      { size: "Full", color: "Walnut", price: 869.99, stock: 12 },
      { size: "Queen", color: "Walnut", price: 999.99, stock: 16 },
      { size: "King", color: "Walnut", price: 1199.99, stock: 8 },
      { size: "Queen", color: "Teak", price: 1049.99, stock: 6 },
      { size: "Queen", color: "Espresso", price: 949.99, stock: 10 }
    ],
    features: [
      "Sled-style continuous curve design",
      "Tapered solid wood legs",
      "Walnut veneer with natural grain",
      "Floating floor clearance",
      "Slat support system included",
      "Non-marking foot caps"
    ],
    reviews: [
      { 
        _id: "rev_033", 
        user: "Gregory P.", 
        rating: 5, 
        title: "Classic mid-century style",
        comment: "The curves are beautiful and the quality is excellent. Matches my vintage nightstands perfectly.", 
        date: "2024-03-31",
        verified: true,
        helpful: 27
      }
    ],
    tags: ["mid-century", "sled-bed", "walnut", "modern", "bedroom", "vintage"],
    featured: true,
    trending: false,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-01-25T08:00:00.000Z",
    updatedAt: "2024-03-28T10:30:00.000Z"
  },
  {
    _id: "prod_030",
    name: "The Industrial Loft Bed",
    slug: "industrial-loft-bed",
    description: "Maximize space in your urban apartment with our Industrial Loft Bed. This elevated bed features a powder-coated steel frame with a built-in desk, shelves, and clothing rod underneath. The industrial design pays homage to converted warehouse lofts while providing functional vertical storage.",
    shortDescription: "Space-saving loft bed with built-in desk and storage",
    price: 899.99,
    originalPrice: 1249.99,
    category: "Bedroom",
    subcategory: "Beds",
    material: "Powder-Coated Steel / MDF",
    color: "Matte Black",
    style: "Industrial / Urban",
    dimensions: "Twin: 42\"W x 80\"L x 72\"H",
    weight: "185 lbs",
    inStock: true,
    stock: 11,
    rating: 4.6,
    numReviews: 83,
    images: [
      "https://images.pexels.com/photos/6186513/pexels-photo-6186513.jpeg",
"https://images.pexels.com/photos/7534567/pexels-photo-7534567.jpeg",
      "https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=1200",
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=1200"
    ],
    variants: [
      { size: "Twin", color: "Matte Black", price: 899.99, stock: 11 },
      { size: "Full", color: "Matte Black", price: 1099.99, stock: 7 },
      { size: "Twin", color: "Matte White", price: 899.99, stock: 8 }
    ],
    features: [
      "Elevated design saves floor space",
      "Built-in desk with drawer",
      "Open shelving for storage",
      "Clothing rod with hanging space",
      "Guardrails for safety",
      "Ladder with anti-slip treads"
    ],
    reviews: [
      { 
        _id: "rev_034", 
        user: "StudioCitySam", 
        rating: 4, 
        title: "Perfect for small apartments",
        comment: "Transformed my 400sq ft studio. Assembly took a weekend but worth it.", 
        date: "2024-03-26",
        verified: true,
        helpful: 44
      }
    ],
    tags: ["loft-bed", "space-saving", "industrial", "small-space", "dorm", "bedroom"],
    featured: false,
    trending: true,
    bestSeller: false,
    newArrival: true,
    onSale: true,
    createdAt: "2024-03-05T08:00:00.000Z",
    updatedAt: "2024-04-01T10:30:00.000Z"
  },
  {
    _id: "prod_031",
    name: "The Velvet Royal Bed",
    slug: "velvet-royal-bed",
    description: "Indulge in opulence with our Velvet Royal Bed. The oversized upholstered headboard features diamond button tufting and is wrapped in sumptuous velvet. Crystal button accents and antique gold legs add regal touches. Perfect for creating a glamorous master suite.",
    shortDescription: "Oversized velvet tufted bed with crystal accents and gold legs",
    price: 1799.99,
    originalPrice: 2499.99,
    category: "Bedroom",
    subcategory: "Beds",
    material: "Velvet / Crystal / Gold-Finished Steel",
    color: "Emerald Green",
    style: "Hollywood Regency / Glam",
    dimensions: "Queen: 68\"W x 88\"L x 60\"H",
    weight: "195 lbs",
    inStock: true,
    stock: 6,
    rating: 4.9,
    numReviews: 67,
    images: [
      "https://images.pexels.com/photos/4846094/pexels-photo-4846094.jpeg",
"https://images.pexels.com/photos/5824888/pexels-photo-5824888.jpeg",
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200",
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=1200"
    ],
    variants: [
      { size: "Queen", color: "Emerald Green", price: 1799.99, stock: 6 },
      { size: "King", color: "Emerald Green", price: 2099.99, stock: 4 },
      { size: "Queen", color: "Sapphire Blue", price: 1799.99, stock: 5 },
      { size: "Queen", color: "Dusty Rose", price: 1699.99, stock: 7 },
      { size: "Queen", color: "Charcoal Velvet", price: 1749.99, stock: 8 }
    ],
    features: [
      "Oversized diamond-tufted headboard",
      "Premium velvet upholstery",
      "Crystal button accents",
      "Antique gold-finished legs",
      "Solid wood frame construction",
      "Slat system included"
    ],
    reviews: [
      { 
        _id: "rev_035", 
        user: "Victoria S.", 
        rating: 5, 
        title: "Absolute showstopper",
        comment: "My bedroom feels like a palace. The velvet is so rich and the crystal details are gorgeous.", 
        date: "2024-04-03",
        verified: true,
        helpful: 51
      }
    ],
    tags: ["velvet-bed", "tufted", "glam", "hollywood-regency", "luxury", "bedroom"],
    featured: true,
    trending: true,
    bestSeller: false,
    newArrival: true,
    onSale: false,
    createdAt: "2024-03-20T08:00:00.000Z",
    updatedAt: "2024-04-05T10:30:00.000Z"
  },
  {
    _id: "prod_032",
    name: "The Eco Natural Bed",
    slug: "eco-natural-bed",
    description: "Sleep sustainably with our Eco Natural Bed. Crafted from FSC-certified bamboo and organic cotton, this bed is free from VOCs and harmful chemicals. The minimalist platform design features a natural bamboo frame with woven rattan panels on the headboard, creating a warm, organic aesthetic.",
    shortDescription: "Sustainable bamboo bed with rattan panels and organic cotton",
    price: 1399.99,
    originalPrice: 1799.99,
    category: "Bedroom",
    subcategory: "Beds",
    material: "Bamboo / Rattan / Organic Cotton",
    color: "Natural Bamboo",
    style: "Organic / Bohemian",
    dimensions: "Queen: 64\"W x 84\"L x 42\"H",
    weight: "130 lbs",
    inStock: true,
    stock: 9,
    rating: 4.8,
    numReviews: 38,
    images: [
      "https://images.pexels.com/photos/3144581/pexels-photo-3144581.jpeg",
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=1200",
      "https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=1200",
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200"
    ],
    variants: [
      { size: "Full", color: "Natural Bamboo", price: 1199.99, stock: 7 },
      { size: "Queen", color: "Natural Bamboo", price: 1399.99, stock: 9 },
      { size: "King", color: "Natural Bamboo", price: 1699.99, stock: 5 }
    ],
    features: [
      "FSC-certified bamboo construction",
      "Hand-woven rattan headboard panels",
      "Zero VOC finish",
      "Organic cotton dust cover",
      "Renewable and sustainable materials",
      "Easy tool-free assembly"
    ],
    reviews: [
      { 
        _id: "rev_036", 
        user: "EcoWarrior88", 
        rating: 5, 
        title: "Beautiful and sustainable",
        comment: "Love knowing my bed is eco-friendly. The rattan detail is beautiful and the bamboo is solid.", 
        date: "2024-03-29",
        verified: true,
        helpful: 26
      }
    ],
    tags: ["eco-friendly", "bamboo", "sustainable", "rattan", "organic", "bedroom"],
    featured: false,
    trending: true,
    bestSeller: true,
    newArrival: true,
    onSale: true,
    createdAt: "2024-03-08T08:00:00.000Z",
    updatedAt: "2024-04-04T10:30:00.000Z"
  },



    {
    _id: "prod_033",
    name: "The Velvet Lounge Dining Chair (Set of 2)",
    slug: "velvet-lounge-dining-chair-set-of-2",
    description: "Elevate your dining experience with our Velvet Lounge Dining Chairs. These generously padded chairs feature a deep seat, curved backrest, and elegant channel tufting. Wrapped in sumptuous velvet with brushed brass legs, they bring hotel-luxury comfort to everyday meals.",
    shortDescription: "Luxury velvet dining chairs with channel tufting and brass legs",
    price: 499.99,
    originalPrice: 699.99,
    category: "Dining Room",
    subcategory: "Chairs",
    material: "Velvet / Brass-Finished Steel",
    color: "Sapphire Blue",
    style: "Glam / Contemporary",
    dimensions: "22\"W x 24\"D x 32\"H",
    weight: "28 lbs (set)",
    inStock: true,
    stock: 24,
    rating: 4.8,
    numReviews: 56,
    images: [
      "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=1200",
"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200",
"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200",
"https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=1200"
    ],
    variants: [
      { color: "Sapphire Blue", material: "Velvet", price: 499.99, stock: 24 },
      { color: "Emerald Green", material: "Velvet", price: 499.99, stock: 18 },
      { color: "Dusty Rose", material: "Velvet", price: 499.99, stock: 20 },
      { color: "Charcoal Gray", material: "Velvet", price: 499.99, stock: 22 }
    ],
    features: [
      "Channel tufted backrest",
      "High-density foam cushioning",
      "Brushed brass-finished legs",
      "Velvet upholstery (stain resistant)",
      "Non-marking floor glides",
      "Set includes 2 chairs"
    ],
    reviews: [
      { 
        _id: "rev_037", 
        user: "Isabella L.", 
        rating: 5, 
        title: "So comfortable and chic", 
        comment: "These chairs make every meal feel like fine dining. The velvet is so soft and the brass legs add the perfect touch of glam.", 
        date: "2024-04-02",
        verified: true,
        helpful: 34
      },
      { 
        _id: "rev_038", 
        user: "Marcus W.", 
        rating: 4, 
        title: "Great quality", 
        comment: "Very sturdy and comfortable. Assembly was easy. Would buy again.", 
        date: "2024-03-28",
        verified: true,
        helpful: 19
      }
    ],
    tags: ["dining-chair", "velvet", "brass", "glam", "dining-room", "set-of-2"],
    featured: true,
    trending: true,
    bestSeller: true,
    newArrival: true,
    onSale: true,
    createdAt: "2024-03-01T08:00:00.000Z",
    updatedAt: "2024-04-05T10:30:00.000Z"
  },
  {
    _id: "prod_034",
    name: "The Radiant Glass Dining Table",
    slug: "radiant-glass-dining-table",
    description: "Create an airy, spacious feel with our Radiant Glass Dining Table. The 12mm tempered glass top appears to float above the sculptural chrome base, which features an elegant sunburst design. This table reflects light beautifully and makes small dining areas feel significantly larger.",
    shortDescription: "Tempered glass dining table with sculptural chrome sunburst base",
    price: 899.99,
    originalPrice: 1299.99,
    category: "Dining Room",
    subcategory: "Tables",
    material: "Tempered Glass / Chrome Steel",
    color: "Clear / Silver",
    style: "Modern / Minimalist",
    dimensions: "72\"L x 36\"W x 30\"H",
    weight: "145 lbs",
    inStock: true,
    stock: 10,
    rating: 4.7,
    numReviews: 43,
    images: [
      "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=1200",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200",
      "https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=1200",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200"
    ],
    variants: [
      { size: "60\"L x 36\"W", color: "Clear/Silver", price: 749.99, stock: 12 },
      { size: "72\"L x 36\"W", color: "Clear/Silver", price: 899.99, stock: 10 },
      { size: "84\"L x 42\"W", color: "Clear/Silver", price: 1099.99, stock: 6 },
      { size: "72\"L x 36\"W", color: "Smoke/Gold", price: 999.99, stock: 8 }
    ],
    features: [
      "12mm tempered safety glass",
      "Sculptural sunburst chrome base",
      "Shatter-resistant glass technology",
      "Easy-clean surface",
      "Leveling feet for stability",
      "Reflective surface brightens room"
    ],
    reviews: [
      { 
        _id: "rev_039", 
        user: "Nathan C.", 
        rating: 5, 
        title: "Makes my space look huge", 
        comment: "The glass top really opens up my small dining area. The base is a work of art.", 
        date: "2024-03-30",
        verified: true,
        helpful: 28
      }
    ],
    tags: ["glass-table", "dining-table", "modern", "chrome", "small-space", "dining-room"],
    featured: true,
    trending: false,
    bestSeller: false,
    newArrival: true,
    onSale: true,
    createdAt: "2024-02-15T08:00:00.000Z",
    updatedAt: "2024-03-28T10:30:00.000Z"
  },
  {
    _id: "prod_035",
    name: "The Farmhouse Trestle Dining Table",
    slug: "farmhouse-trestle-dining-table",
    description: "Bring warmth and hospitality to your home with our Farmhouse Trestle Dining Table. Crafted from solid reclaimed barn wood with a distressed white finish, this table features a classic trestle base with turned legs. Wide enough for family-style meals and sturdy enough for everyday use.",
    shortDescription: "Reclaimed barn wood trestle table with distressed white finish",
    price: 1599.99,
    originalPrice: 2099.99,
    category: "Dining Room",
    subcategory: "Tables",
    material: "Reclaimed Pine",
    color: "Distressed White",
    style: "Farmhouse / Rustic",
    dimensions: "84\"L x 40\"W x 30\"H",
    weight: "195 lbs",
    inStock: true,
    stock: 8,
    rating: 4.9,
    numReviews: 112,
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200",
      "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=1200",
      "https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=1200",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200"
    ],
    variants: [
      { size: "72\"L x 38\"W", color: "Distressed White", price: 1399.99, stock: 6 },
      { size: "84\"L x 40\"W", color: "Distressed White", price: 1599.99, stock: 8 },
      { size: "96\"L x 42\"W", color: "Distressed White", price: 1899.99, stock: 4 },
      { size: "84\"L x 40\"W", color: "Weathered Gray", price: 1699.99, stock: 5 }
    ],
    features: [
      "Solid reclaimed barn wood",
      "Classic trestle base with turned legs",
      "Distressed finish shows wood history",
      "Seats 8-10 comfortably",
      "Butcher block style top",
      "Pre-assembled legs for stability"
    ],
    reviews: [
      { 
        _id: "rev_040", 
        user: "Martha S.", 
        rating: 5, 
        title: "Heart of our home", 
        comment: "This table has so much character. The reclaimed wood tells a story and the white finish is perfect for our farmhouse.", 
        date: "2024-04-01",
        verified: true,
        helpful: 56
      }
    ],
    tags: ["farmhouse", "trestle-table", "reclaimed-wood", "rustic", "dining-table", "dining-room"],
    featured: true,
    trending: true,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-01-10T08:00:00.000Z",
    updatedAt: "2024-03-25T10:30:00.000Z"
  },
  {
    _id: "prod_036",
    name: "The Scandinavian Dining Chair (Set of 4)",
    slug: "scandinavian-dining-chair-set-of-4",
    description: "Embrace Danish design with our Scandinavian Dining Chair. The bentwood beech frame offers ergonomic support, while the woven paper cord seat adds texture and breathability. These chairs pair perfectly with any table style and are lightweight enough for daily use.",
    shortDescription: "Classic bentwood dining chair with woven paper cord seat",
    price: 399.99,
    originalPrice: 599.99,
    category: "Dining Room",
    subcategory: "Chairs",
    material: "Beech Wood / Paper Cord",
    color: "Natural Beech",
    style: "Scandinavian / Modern",
    dimensions: "19\"W x 20\"D x 31\"H",
    weight: "32 lbs (set)",
    inStock: true,
    stock: 30,
    rating: 4.8,
    numReviews: 98,
    images: [
      "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=1200",
"https://images.unsplash.com/photo-1592078615290-033ee584e267?w=1200",
"https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200",
"https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=1200"
    ],
    variants: [
      { color: "Natural Beech", seat: "Paper Cord", price: 399.99, stock: 30 },
      { color: "Walnut", seat: "Paper Cord", price: 449.99, stock: 20 },
      { color: "Black", seat: "Paper Cord", price: 399.99, stock: 25 },
      { color: "Natural Beech", seat: "Leather Cushion", price: 499.99, stock: 15 }
    ],
    features: [
      "Bentwood beech frame",
      "Hand-woven paper cord seat",
      "Ergonomic curved backrest",
      "Lightweight yet durable",
      "Stackable up to 4 chairs",
      "Floor-protecting felt pads"
    ],
    reviews: [
      { 
        _id: "rev_041", 
        user: "Klaus D.", 
        rating: 5, 
        title: "True Scandinavian design", 
        comment: "Beautiful, comfortable, and well-made. The paper cord seat is surprisingly comfortable for long dinners.", 
        date: "2024-03-27",
        verified: true,
        helpful: 31
      }
    ],
    tags: ["dining-chair", "scandinavian", "bentwood", "paper-cord", "minimalist", "dining-room"],
    featured: true,
    trending: true,
    bestSeller: true,
    newArrival: false,
    onSale: false,
    createdAt: "2024-02-05T08:00:00.000Z",
    updatedAt: "2024-03-30T10:30:00.000Z"
  },
  {
    _id: "prod_037",
    name: "The Buffet Grande Sideboard",
    slug: "buffet-grande-sideboard",
    description: "Store and display with elegance using our Buffet Grande Sideboard. This substantial piece features six soft-close drawers and two adjustable shelves behind glass-front cabinets. The mahogany wood with hand-rubbed lacquer finish and brushed nickel hardware makes it a timeless addition.",
    shortDescription: "Large mahogany sideboard with glass-front cabinets and soft-close drawers",
    price: 1899.99,
    originalPrice: 2499.99,
    category: "Dining Room",
    subcategory: "Sideboards",
    material: "Solid Mahogany / Glass",
    color: "Mahogany",
    style: "Traditional / Classic",
    dimensions: "72\"W x 18\"D x 36\"H",
    weight: "210 lbs",
    inStock: true,
    stock: 7,
    rating: 4.9,
    numReviews: 51,
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200",
      "https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=1200",
      "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=1200",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200"
    ],
    variants: [
      { color: "Mahogany", finish: "Lacquer", price: 1899.99, stock: 7 },
      { color: "Cherry", finish: "Satin", price: 1999.99, stock: 5 },
      { color: "Dark Walnut", finish: "Matte", price: 1799.99, stock: 8 }
    ],
    features: [
      "Solid mahogany construction",
      "6 soft-close drawers (dovetail joinery)",
      "2 glass-front adjustable shelves",
      "Hand-rubbed lacquer finish",
      "Brushed nickel hardware",
      "Removable velvet lining in drawers"
    ],
    reviews: [
      { 
        _id: "rev_042", 
        user: "Patricia H.", 
        rating: 5, 
        title: "Worth every penny", 
        comment: "This sideboard is heirloom quality. The wood is gorgeous and the storage is incredible.", 
        date: "2024-03-25",
        verified: true,
        helpful: 43
      }
    ],
    tags: ["sideboard", "buffet", "mahogany", "storage", "traditional", "dining-room"],
    featured: true,
    trending: false,
    bestSeller: false,
    newArrival: false,
    onSale: true,
    createdAt: "2024-01-20T08:00:00.000Z",
    updatedAt: "2024-03-22T10:30:00.000Z"
  },
  {
    _id: "prod_038",
    name: "The Tiered Serving Cart",
    slug: "tiered-serving-cart",
    description: "Roll in style with our Tiered Serving Cart. The three-tiered design features smoked glass shelves and a gold-finished steel frame with locking caster wheels. Perfect for tea service, cocktail parties, or as a movable bar cart. The included wine rack holds up to 6 bottles.",
    shortDescription: "Three-tier gold serving cart with smoked glass and locking wheels",
    price: 249.99,
    originalPrice: 379.99,
    category: "Dining Room",
    subcategory: "Serving Carts",
    material: "Smoked Glass / Gold Steel",
    color: "Gold / Smoke",
    style: "Art Deco / Glam",
    dimensions: "30\"W x 18\"D x 32\"H",
    weight: "28 lbs",
    inStock: true,
    stock: 35,
    rating: 4.7,
    numReviews: 89,
    images: [
      "https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg",
"https://images.pexels.com/photos/2343468/pexels-photo-2343468.jpeg",
"https://images.pexels.com/photos/3209049/pexels-photo-3209049.jpeg",
"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200"
    ],
    variants: [
      { color: "Gold/Smoke", shelves: "Smoked Glass", price: 249.99, stock: 35 },
      { color: "Silver/Clear", shelves: "Clear Glass", price: 229.99, stock: 28 },
      { color: "Brass/Smoke", shelves: "Smoked Glass", price: 269.99, stock: 20 }
    ],
    features: [
      "3-tier smoked glass shelves",
      "Gold-finished steel frame",
      "Built-in 6-bottle wine rack",
      "Serving tray rim on top shelf",
      "Locking caster wheels (2 locks)",
      "Quick-fold assembly"
    ],
    reviews: [
      { 
        _id: "rev_043", 
        user: "CocktailCourtney", 
        rating: 5, 
        title: "Party essential", 
        comment: "This cart is gorgeous and functional. Rolls smoothly and the wine rack is a nice touch.", 
        date: "2024-04-03",
        verified: true,
        helpful: 37
      }
    ],
    tags: ["bar-cart", "serving-cart", "gold", "glass", "entertaining", "dining-room"],
    featured: true,
    trending: true,
    bestSeller: true,
    newArrival: true,
    onSale: true,
    createdAt: "2024-03-10T08:00:00.000Z",
    updatedAt: "2024-04-04T10:30:00.000Z"
  },
  {
    _id: "prod_039",
    name: "The Marble Top Pedestal Table",
    slug: "marble-top-pedestal-table",
    description: "Add sculptural elegance to your dining space with our Marble Top Pedestal Table. The genuine Carrara marble top features subtle gray veining, while the solid oak pedestal base with three turned legs provides stability and visual interest. Perfect for breakfast nooks or formal dining.",
    shortDescription: "Genuine Carrara marble table with oak pedestal base",
    price: 1499.99,
    originalPrice: 1999.99,
    category: "Dining Room",
    subcategory: "Tables",
    material: "Carrara Marble / Solid Oak",
    color: "White/Gray / Natural Oak",
    style: "Traditional / Transitional",
    dimensions: "48\"Diameter x 30\"H (Seats 4)",
    weight: "235 lbs",
    inStock: true,
    stock: 6,
    rating: 4.9,
    numReviews: 47,
    images: [
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200",
"https://images.unsplash.com/photo-1592078615290-033ee584e267?w=1200",
"https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=1200",
"https://images.pexels.com/photos/3209049/pexels-photo-3209049.jpeg"
    ],
    variants: [
      { size: "48\" Round", color: "Carrara/Oak", price: 1499.99, stock: 6 },
      { size: "54\" Round", color: "Carrara/Oak", price: 1799.99, stock: 4 },
      { size: "48\" Round", color: "Calacatta/Walnut", price: 1999.99, stock: 3 }
    ],
    features: [
      "Genuine Carrara marble top",
      "Solid oak pedestal base",
      "Triple turned leg design",
      "Seals to prevent staining",
      "Floor protectors on all feet",
      "Professional installation recommended"
    ],
    reviews: [
      { 
        _id: "rev_044", 
        user: "Grace L.", 
        rating: 5, 
        title: "Stunning statement piece", 
        comment: "The marble is absolutely beautiful. Looks like a piece of art in our dining room.", 
        date: "2024-03-28",
        verified: true,
        helpful: 41
      }
    ],
    tags: ["marble-table", "pedestal-table", "carrara", "round-table", "luxury", "dining-room"],
    featured: true,
    trending: true,
    bestSeller: false,
    newArrival: false,
    onSale: true,
    createdAt: "2024-02-10T08:00:00.000Z",
    updatedAt: "2024-03-26T10:30:00.000Z"
  },
  {
    _id: "prod_040",
    name: "The Industrial Pantry Cabinet",
    slug: "industrial-pantry-cabinet",
    description: "Maximize storage with our Industrial Pantry Cabinet. This tall cabinet features mesh metal doors, adjustable interior shelves, and a sliding barn door design. The combination of reclaimed pine and black iron creates a rustic-industrial look perfect for farmhouse or urban kitchens and dining rooms.",
    shortDescription: "Tall industrial pantry with mesh barn doors and adjustable shelves",
    price: 799.99,
    originalPrice: 1099.99,
    category: "Dining Room",
    subcategory: "Cabinets",
    material: "Reclaimed Pine / Iron Mesh",
    color: "Weathered Gray / Black",
    style: "Industrial / Farmhouse",
    dimensions: "30\"W x 16\"D x 72\"H",
    weight: "110 lbs",
    inStock: true,
    stock: 12,
    rating: 4.7,
    numReviews: 64,
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200",
      "https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=1200",
      "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=1200",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200"
    ],
    variants: [
      { color: "Weathered Gray/Black", doors: "Mesh Barn", price: 799.99, stock: 12 },
      { color: "Natural Wood/White", doors: "Glass Barn", price: 899.99, stock: 8 },
      { color: "Espresso/Black", doors: "Solid Wood", price: 749.99, stock: 10 }
    ],
    features: [
      "Sliding barn door design",
      "Powder-coated iron mesh",
      "4 adjustable interior shelves",
      "Solid reclaimed pine frame",
      "Industrial pipe handles",
      "Anti-tip hardware included"
    ],
    reviews: [
      { 
        _id: "rev_045", 
        user: "Henry B.", 
        rating: 5, 
        title: "Great for small spaces", 
        comment: "This cabinet holds so much and looks amazing. The barn doors slide smoothly.", 
        date: "2024-03-29",
        verified: true,
        helpful: 26
      }
    ],
    tags: ["pantry", "storage-cabinet", "industrial", "barn-door", "rustic", "dining-room"],
    featured: false,
    trending: true,
    bestSeller: false,
    newArrival: true,
    onSale: true,
    createdAt: "2024-03-05T08:00:00.000Z",
    updatedAt: "2024-04-01T10:30:00.000Z"
  },
  {
    _id: "prod_041",
    name: "The Mid-Century Credenza",
    slug: "mid-century-credenza",
    description: "A true design icon, our Mid-Century Credenza features clean lines, tapered walnut legs, and slatted sliding doors. The interior includes adjustable shelving and a felt-lined drawer for silverware. The rich walnut veneer and oil-rubbed brass pulls complete the retro-modern look.",
    shortDescription: "Mid-century credenza with walnut veneer and slatted doors",
    price: 1199.99,
    originalPrice: 1599.99,
    category: "Dining Room",
    subcategory: "Sideboards",
    material: "Walnut Veneer / Solid Wood",
    color: "Rich Walnut",
    style: "Mid-Century Modern",
    dimensions: "60\"W x 18\"D x 32\"H",
    weight: "135 lbs",
    inStock: true,
    stock: 9,
    rating: 4.8,
    numReviews: 73,
    images: [
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200",
"https://images.unsplash.com/photo-1592078615290-033ee584e267?w=1200",
"https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=1200",
"https://images.pexels.com/photos/3209049/pexels-photo-3209049.jpeg"
    ],
    variants: [
      { size: "60\"", color: "Rich Walnut", price: 1199.99, stock: 9 },
      { size: "72\"", color: "Rich Walnut", price: 1399.99, stock: 6 },
      { size: "60\"", color: "Teak", price: 1299.99, stock: 5 }
    ],
    features: [
      "Slatted sliding door design",
      "Tapered solid walnut legs",
      "Adjustable interior shelves",
      "Felt-lined silverware drawer",
      "Oil-rubbed brass pulls",
      "Satin lacquer finish"
    ],
    reviews: [
      { 
        _id: "rev_046", 
        user: "Diana F.", 
        rating: 5, 
        title: "Perfect MCM piece", 
        comment: "Exactly what I wanted for my mid-century dining room. Quality is outstanding.", 
        date: "2024-03-26",
        verified: true,
        helpful: 38
      }
    ],
    tags: ["credenza", "mid-century", "sideboard", "walnut", "storage", "dining-room"],
    featured: true,
    trending: false,
    bestSeller: true,
    newArrival: false,
    onSale: false,
    createdAt: "2024-02-18T08:00:00.000Z",
    updatedAt: "2024-03-29T10:30:00.000Z"
  },
  {
    _id: "prod_042",
    name: "The Extendable Bamboo Table",
    slug: "extendable-bamboo-table",
    description: "Adapt to any gathering with our Extendable Bamboo Table. This eco-friendly table seats 4-6 in its compact form and extends to seat 8-10 with the included leaf. The sustainable bamboo construction features a warm honey finish and butterfly extension mechanism for effortless operation.",
    shortDescription: "Sustainable bamboo extendable dining table with butterfly leaf",
    price: 999.99,
    originalPrice: 1399.99,
    category: "Dining Room",
    subcategory: "Tables",
    material: "Solid Bamboo",
    color: "Honey Bamboo",
    style: "Contemporary / Eco",
    dimensions: "60\"L x 36\"W x 30\"H (Extends to 84\")",
    weight: "115 lbs",
    inStock: true,
    stock: 14,
    rating: 4.8,
    numReviews: 59,
    images: [
      "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=1200",
"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200",
"https://images.pexels.com/photos/2343468/pexels-photo-2343468.jpeg",
"https://images.pexels.com/photos/6489118/pexels-photo-6489118.jpeg"
    ],
    variants: [
      { size: "60\"-84\"", color: "Honey Bamboo", price: 999.99, stock: 14 },
      { size: "60\"-84\"", color: "Espresso Bamboo", price: 1049.99, stock: 10 },
      { size: "72\"-96\"", color: "Honey Bamboo", price: 1199.99, stock: 8 }
    ],
    features: [
      "Sustainable bamboo construction",
      "Butterfly leaf extension mechanism",
      "Seats 8-10 when extended",
      "Scratch-resistant finish",
      "Tapered legs with non-skid pads",
      "Includes self-storing leaf"
    ],
    reviews: [
      { 
        _id: "rev_047", 
        user: "EcoHostess", 
        rating: 5, 
        title: "Perfect for small spaces", 
        comment: "I love that I can keep it small for daily use but extend it for holidays. Beautiful wood.", 
        date: "2024-04-04",
        verified: true,
        helpful: 33
      }
    ],
    tags: ["extendable-table", "bamboo", "eco-friendly", "space-saving", "dining-table", "dining-room"],
    featured: false,
    trending: true,
    bestSeller: true,
    newArrival: true,
    onSale: true,
    createdAt: "2024-03-12T08:00:00.000Z",
    updatedAt: "2024-04-05T10:30:00.000Z"
  },
    {
    _id: "prod_048",
    name: "The Executive Oak Desk",
    slug: "executive-oak-desk",
    description: "Command your home office with our Executive Oak Desk. Crafted from solid American white oak with a rich espresso finish, this desk features a spacious 72\" work surface, three built-in drawers with soft-close slides, and a cable management channel. The double-pedestal design provides exceptional stability and storage.",
    shortDescription: "Solid oak executive desk with soft-close drawers and cable management",
    price: 1499.99,
    originalPrice: 1999.99,
    category: "Office",
    subcategory: "Desks",
    material: "Solid White Oak",
    color: "Espresso",
    style: "Traditional / Executive",
    dimensions: "72\"W x 36\"D x 30\"H",
    weight: "185 lbs",
    inStock: true,
    stock: 8,
    rating: 4.9,
    numReviews: 67,
    images: [
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200",
"https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1200",
"https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=1200",
"https://images.unsplash.com/photo-1592078615290-033ee584e267?w=1200"
    ],
    variants: [
      { size: "60\"W", color: "Espresso", price: 1199.99, stock: 10 },
      { size: "72\"W", color: "Espresso", price: 1499.99, stock: 8 },
      { size: "72\"W", color: "Natural Oak", price: 1599.99, stock: 6 },
      { size: "72\"W", color: "Walnut", price: 1699.99, stock: 5 }
    ],
    features: [
      "Solid white oak construction",
      "3 soft-close drawers (dovetail joinery)",
      "Hidden cable management channel",
      "Double-pedestal design",
      "Pencil drawer with felt lining",
      "File drawer holds letter/legal"
    ],
    reviews: [
      { 
        _id: "rev_048", 
        user: "Richard P.", 
        rating: 5, 
        title: "Heirloom quality desk", 
        comment: "This desk is massive and beautifully built. The soft-close drawers are buttery smooth. Worth every penny.", 
        date: "2024-04-01",
        verified: true,
        helpful: 42
      },
      { 
        _id: "rev_049", 
        user: "Catherine W.", 
        rating: 5, 
        title: "Perfect for my law practice", 
        comment: "Impresses clients in my home office. Excellent craftsmanship.", 
        date: "2024-03-28",
        verified: true,
        helpful: 28
      }
    ],
    tags: ["executive-desk", "oak-desk", "office-desk", "traditional", "home-office", "storage"],
    featured: true,
    trending: true,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-02-10T08:00:00.000Z",
    updatedAt: "2024-03-28T10:30:00.000Z"
  },
  {
    _id: "prod_049",
    name: "The Floating Wall Desk",
    slug: "floating-wall-desk",
    description: "Maximize floor space with our Floating Wall Desk. This sleek, space-saving solution mounts directly to your wall, creating a clean, modern workspace that appears to float. The desk includes a flip-down front panel that hides cords and supplies, plus a built-in wireless charger and USB ports.",
    shortDescription: "Space-saving wall-mounted desk with hidden storage and wireless charging",
    price: 399.99,
    originalPrice: 549.99,
    category: "Office",
    subcategory: "Desks",
    material: "MDF / Steel",
    color: "Matte White",
    style: "Modern / Minimalist",
    dimensions: "42\"W x 24\"D x 4\"H (closed), 28\"H (open)",
    weight: "38 lbs",
    inStock: true,
    stock: 32,
    rating: 4.7,
    numReviews: 143,
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200",
"https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=1200",
"https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
"https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg"
    ],
    variants: [
      { color: "Matte White", finish: "Laminate", price: 399.99, stock: 32 },
      { color: "Matte Black", finish: "Laminate", price: 399.99, stock: 28 },
      { color: "Natural Wood", finish: "Walnut Veneer", price: 449.99, stock: 20 }
    ],
    features: [
      "Space-saving wall-mounted design",
      "Flip-down front for hidden storage",
      "Built-in wireless charging pad",
      "2 USB-A and 1 USB-C ports",
      "Cable management tray",
      "Easy wall-mount installation"
    ],
    reviews: [
      { 
        _id: "rev_050", 
        user: "Sarah K.", 
        rating: 5, 
        title: "Game changer for small apartments", 
        comment: "My studio feels so much bigger now. When closed, it's only 4 inches deep!", 
        date: "2024-04-03",
        verified: true,
        helpful: 51
      }
    ],
    tags: ["floating-desk", "wall-desk", "small-space", "modern", "home-office", "space-saving"],
    featured: true,
    trending: true,
    bestSeller: true,
    newArrival: true,
    onSale: true,
    createdAt: "2024-03-01T08:00:00.000Z",
    updatedAt: "2024-04-05T10:30:00.000Z"
  },
  {
    _id: "prod_050",
    name: "The Mesh Task Chair",
    slug: "mesh-task-chair",
    description: "Reliable comfort for everyday work. The Mesh Task Chair features a breathable mesh back, adjustable seat height, and 2D armrests. The synchronized tilting mechanism allows you to recline while keeping your feet flat. An affordable ergonomic solution for any home office.",
    shortDescription: "Breathable mesh task chair with adjustable lumbar and tilt",
    price: 299.99,
    originalPrice: 399.99,
    category: "Office",
    subcategory: "Chairs",
    material: "Mesh / Nylon",
    color: "Black",
    style: "Modern Ergonomic",
    dimensions: "25\"W x 25\"D x 38\"H (adjustable)",
    weight: "32 lbs",
    inStock: true,
    stock: 45,
    rating: 4.6,
    numReviews: 278,
    images: [
      "https://images.pexels.com/photos/3740747/pexels-photo-3740747.jpeg",
"https://images.pexels.com/photos/6585601/pexels-photo-6585601.jpeg",
"https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1200",
"https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200"
    ],
    variants: [
      { color: "Black", armrests: "2D Adjustable", price: 299.99, stock: 45 },
      { color: "Gray", armrests: "Fixed", price: 269.99, stock: 30 },
      { color: "Blue", armrests: "2D Adjustable", price: 299.99, stock: 20 }
    ],
    features: [
      "Breathable mesh backrest",
      "Adjustable lumbar support",
      "2D adjustable armrests",
      "Synchronized tilt mechanism",
      "Pneumatic seat height adjustment",
      "350 lbs weight capacity"
    ],
    reviews: [
      { 
        _id: "rev_051", 
        user: "James H.", 
        rating: 5, 
        title: "Best value chair", 
        comment: "For under $300, this chair is unbeatable. Mesh back keeps me cool during long Zoom calls.", 
        date: "2024-03-30",
        verified: true,
        helpful: 63
      }
    ],
    tags: ["task-chair", "mesh-chair", "ergonomic", "home-office", "budget", "office-chair"],
    featured: false,
    trending: true,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-02-05T08:00:00.000Z",
    updatedAt: "2024-03-25T10:30:00.000Z"
  },
  {
    _id: "prod_051",
    name: "The Industrial Bookshelf",
    slug: "industrial-bookshelf-office",
    description: "Organize your office library with our Industrial Bookshelf. The combination of solid reclaimed pine shelves and black iron pipe frame creates a rugged, urban aesthetic. Each of the 5 adjustable shelves holds up to 100 lbs, perfect for heavy law books, binders, and decor.",
    shortDescription: "Industrial pipe bookshelf with 5 adjustable reclaimed wood shelves",
    price: 649.99,
    originalPrice: 899.99,
    category: "Office",
    subcategory: "Shelving",
    material: "Reclaimed Pine / Iron Pipe",
    color: "Weathered Wood / Black",
    style: "Industrial / Rustic",
    dimensions: "36\"W x 14\"D x 72\"H",
    weight: "88 lbs",
    inStock: true,
    stock: 12,
    rating: 4.8,
    numReviews: 76,
    images: [
      "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=1200",
"https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=1200",
"https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
"https://images.pexels.com/photos/3740747/pexels-photo-3740747.jpeg"
    ],
    variants: [
      { size: "36\"W", color: "Weathered Wood/Black", price: 649.99, stock: 12 },
      { size: "48\"W", color: "Weathered Wood/Black", price: 799.99, stock: 8 },
      { size: "36\"W", color: "Walnut/Brass", price: 749.99, stock: 6 }
    ],
    features: [
      "5 adjustable shelves",
      "Solid reclaimed pine",
      "Heavy-gauge iron pipe frame",
      "100 lb shelf capacity",
      "Industrial pipe fittings",
      "Floor leveling feet"
    ],
    reviews: [
      { 
        _id: "rev_052", 
        user: "Prof. Anderson", 
        rating: 5, 
        title: "Holds my entire library", 
        comment: "This shelf is incredibly sturdy. No bowing even with heavy textbooks. Looks amazing too.", 
        date: "2024-03-29",
        verified: true,
        helpful: 44
      }
    ],
    tags: ["bookshelf", "industrial", "pipe-shelf", "reclaimed-wood", "office-storage"],
    featured: true,
    trending: false,
    bestSeller: false,
    newArrival: false,
    onSale: false,
    createdAt: "2024-02-20T08:00:00.000Z",
    updatedAt: "2024-03-30T10:30:00.000Z"
  },
  {
    _id: "prod_052",
    name: "The Standing Desk Pro",
    slug: "standing-desk-pro",
    description: "Improve your posture and energy with our Standing Desk Pro. The dual-motor electric lift system smoothly adjusts from 25\" to 51\" at 1.5 inches per second. The 60\" wide bamboo top is eco-friendly and naturally antibacterial. Four programmable memory presets save your preferred heights.",
    shortDescription: "Dual-motor electric standing desk with bamboo top and memory presets",
    price: 699.99,
    originalPrice: 949.99,
    category: "Office",
    subcategory: "Desks",
    material: "Bamboo / Steel",
    color: "Natural Bamboo",
    style: "Modern / Ergonomic",
    dimensions: "60\"W x 30\"D x 25-51\"H",
    weight: "85 lbs",
    inStock: true,
    stock: 18,
    rating: 4.9,
    numReviews: 204,
    images: [
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200",
"https://images.unsplash.com/photo-1592078615290-033ee584e267?w=1200",
"https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg",
"https://images.pexels.com/photos/6585601/pexels-photo-6585601.jpeg"
    ],
    variants: [
      { size: "55\"W", color: "Natural Bamboo", price: 599.99, stock: 15 },
      { size: "60\"W", color: "Natural Bamboo", price: 699.99, stock: 18 },
      { size: "70\"W", color: "Natural Bamboo", price: 799.99, stock: 10 },
      { size: "60\"W", color: "Dark Bamboo", price: 749.99, stock: 12 }
    ],
    features: [
      "Dual-motor electric lift system",
      "4 programmable height presets",
      "Anti-collision safety technology",
      "Sustainable bamboo top",
      "Cable management tray included",
      "275 lbs weight capacity"
    ],
    reviews: [
      { 
        _id: "rev_053", 
        user: "WellnessWarrior", 
        rating: 5, 
        title: "Back pain is gone", 
        comment: "Alternating between sitting and standing has changed my work life. The motor is quiet and smooth.", 
        date: "2024-04-02",
        verified: true,
        helpful: 87
      }
    ],
    tags: ["standing-desk", "electric-desk", "bamboo", "ergonomic", "home-office", "health"],
    featured: true,
    trending: true,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-01-25T08:00:00.000Z",
    updatedAt: "2024-03-27T10:30:00.000Z"
  },
  {
    _id: "prod_053",
    name: "The Mobile Filing Cabinet",
    slug: "mobile-filing-cabinet",
    description: "Keep documents organized with our Mobile Filing Cabinet. This 2-drawer lateral file features full-extension slides, lockable drawers, and a removable top shelf. The powder-coated steel construction and smooth-rolling casters (2 locking) let you move it anywhere. Fits both letter and legal hanging files.",
    shortDescription: "Lockable 2-drawer mobile filing cabinet on casters",
    price: 199.99,
    originalPrice: 279.99,
    category: "Office",
    subcategory: "Storage",
    material: "Powder-Coated Steel",
    color: "Matte Black",
    style: "Modern / Functional",
    dimensions: "18\"W x 22\"D x 28\"H",
    weight: "42 lbs",
    inStock: true,
    stock: 35,
    rating: 4.7,
    numReviews: 118,
    images: [
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1200",
"https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200",
"https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=1200",
"https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg"
    ],
    variants: [
      { color: "Matte Black", drawers: "2 Drawer", price: 199.99, stock: 35 },
      { color: "Matte White", drawers: "2 Drawer", price: 199.99, stock: 28 },
      { color: "Matte Black", drawers: "3 Drawer", price: 249.99, stock: 20 }
    ],
    features: [
      "Full-extension drawer slides",
      "Lockable drawers (key included)",
      "Removable top shelf",
      "5 smooth-rolling casters (2 lock)",
      "Holds letter/legal files",
      "Ventilated back panel"
    ],
    reviews: [
      { 
        _id: "rev_054", 
        user: "Linda M.", 
        rating: 5, 
        title: "Perfect under-desk storage", 
        comment: "Rolls easily and holds everything. The lock is a nice security feature.", 
        date: "2024-03-31",
        verified: true,
        helpful: 32
      }
    ],
    tags: ["filing-cabinet", "mobile", "locking", "steel", "office-storage", "under-desk"],
    featured: false,
    trending: true,
    bestSeller: true,
    newArrival: true,
    onSale: true,
    createdAt: "2024-03-05T08:00:00.000Z",
    updatedAt: "2024-04-03T10:30:00.000Z"
  },
  {
    _id: "prod_054",
    name: "The Glass Monitor Riser",
    slug: "glass-monitor-riser",
    description: "Elevate your screens to eye level with our Glass Monitor Riser. The 8mm tempered glass top supports up to 50 lbs, while the bamboo base provides natural warmth. An integrated slot holds your phone or tablet, and the hollow design stores your keyboard underneath when not in use.",
    shortDescription: "Tempered glass monitor riser with bamboo base and phone slot",
    price: 59.99,
    originalPrice: 89.99,
    category: "Office",
    subcategory: "Accessories",
    material: "Tempered Glass / Bamboo",
    color: "Clear / Natural",
    style: "Modern / Minimalist",
    dimensions: "36\"W x 10\"D x 4\"H",
    weight: "9 lbs",
    inStock: true,
    stock: 60,
    rating: 4.8,
    numReviews: 215,
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200",
"https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=1200",
"https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
"https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg"
    ],
    variants: [
      { size: "36\"W", color: "Clear/Natural", price: 59.99, stock: 60 },
      { size: "36\"W", color: "Frosted/Black", price: 64.99, stock: 45 },
      { size: "48\"W", color: "Clear/Natural", price: 79.99, stock: 30 }
    ],
    features: [
      "8mm tempered glass top",
      "Solid bamboo base",
      "Integrated phone/tablet slot",
      "Scratch-resistant rubber feet",
      "Holds up to 50 lbs",
      "Quick assembly"
    ],
    reviews: [
      { 
        _id: "rev_055", 
        user: "TechSophie", 
        rating: 5, 
        title: "Simple but effective", 
        comment: "My neck pain disappeared after raising my monitors. The phone slot is genius.", 
        date: "2024-04-01",
        verified: true,
        helpful: 48
      }
    ],
    tags: ["monitor-stand", "riser", "glass", "bamboo", "accessory", "ergonomic"],
    featured: false,
    trending: true,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-02-15T08:00:00.000Z",
    updatedAt: "2024-03-26T10:30:00.000Z"
  },
  {
    _id: "prod_055",
    name: "The L-Shaped Corner Desk",
    slug: "l-shaped-corner-desk",
    description: "Maximize corner space with our L-Shaped Corner Desk. The reversible design fits any room layout, offering 72 inches of continuous workspace with a 52-inch return. The industrial pipe frame supports a solid acacia wood top, and the included monitor stand adds a second tier for screens.",
    shortDescription: "Reversible L-shaped corner desk with pipe frame and monitor stand",
    price: 849.99,
    originalPrice: 1149.99,
    category: "Office",
    subcategory: "Desks",
    material: "Acacia Wood / Iron Pipe",
    color: "Natural Acacia / Black",
    style: "Industrial / Modern",
    dimensions: "72\"W x 52\"D x 30\"H",
    weight: "125 lbs",
    inStock: true,
    stock: 9,
    rating: 4.8,
    numReviews: 94,
    images: [
      "https://images.pexels.com/photos/3740747/pexels-photo-3740747.jpeg",
"https://images.pexels.com/photos/6585601/pexels-photo-6585601.jpeg",
"https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1200",
"https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200"
    ],
    variants: [
      { color: "Natural Acacia/Black", finish: "Matte", price: 849.99, stock: 9 },
      { color: "Walnut/Brass", finish: "Polished", price: 949.99, stock: 6 },
      { color: "Weathered Gray/Black", finish: "Matte", price: 799.99, stock: 8 }
    ],
    features: [
      "Reversible L-shape design",
      "Solid acacia wood top",
      "Industrial iron pipe frame",
      "Included 2-tier monitor stand",
      "Built-in cable management",
      "Floor leveling feet"
    ],
    reviews: [
      { 
        _id: "rev_056", 
        user: "GamerDad", 
        rating: 5, 
        title: "Perfect gaming setup", 
        comment: "Holds three monitors, my PC, and still has room. The pipe frame is rock solid.", 
        date: "2024-03-28",
        verified: true,
        helpful: 73
      }
    ],
    tags: ["corner-desk", "l-shaped", "gaming-desk", "industrial", "home-office", "spacious"],
    featured: true,
    trending: true,
    bestSeller: false,
    newArrival: false,
    onSale: true,
    createdAt: "2024-02-28T08:00:00.000Z",
    updatedAt: "2024-03-29T10:30:00.000Z"
  },
  {
    _id: "prod_056",
    name: "The Velvet Office Guest Chair",
    slug: "velvet-office-guest-chair",
    description: "Welcome clients in style with our Velvet Office Guest Chair. The mid-century-inspired silhouette features a rich velvet upholstery, polished brass legs, and a generous seat cushion. Perfect for executive offices or as an accent chair in home workspaces.",
    shortDescription: "Elegant velvet guest chair with brass legs for executive offices",
    price: 299.99,
    originalPrice: 429.99,
    category: "Office",
    subcategory: "Chairs",
    material: "Velvet / Brass-Finished Steel",
    color: "Emerald Green",
    style: "Mid-Century / Glam",
    dimensions: "27\"W x 30\"D x 32\"H",
    weight: "28 lbs",
    inStock: true,
    stock: 22,
    rating: 4.8,
    numReviews: 53,
    images: [
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200",
"https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1200",
"https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=1200",
"https://images.unsplash.com/photo-1592078615290-033ee584e267?w=1200"
    ],
    variants: [
      { color: "Emerald Green", material: "Velvet", price: 299.99, stock: 22 },
      { color: "Sapphire Blue", material: "Velvet", price: 299.99, stock: 18 },
      { color: "Blush Pink", material: "Velvet", price: 299.99, stock: 15 },
      { color: "Charcoal Gray", material: "Velvet", price: 299.99, stock: 20 }
    ],
    features: [
      "Premium velvet upholstery",
      "Polished brass-finished legs",
      "High-density foam cushion",
      "Mid-century modern silhouette",
      "Non-marking floor glides",
      "Easy assembly (screw-on legs)"
    ],
    reviews: [
      { 
        _id: "rev_057", 
        user: "InteriorDesignPro", 
        rating: 5, 
        title: "Clients love these", 
        comment: "Added two to my reception area and they look so expensive. Very comfortable too.", 
        date: "2024-04-02",
        verified: true,
        helpful: 35
      }
    ],
    tags: ["guest-chair", "velvet", "executive-chair", "mid-century", "accent-chair", "office"],
    featured: true,
    trending: false,
    bestSeller: false,
    newArrival: true,
    onSale: false,
    createdAt: "2024-03-10T08:00:00.000Z",
    updatedAt: "2024-04-04T10:30:00.000Z"
  },
  {
    _id: "prod_057",
    name: "The Accordion Wall Organizer",
    slug: "accordion-wall-organizer",
    description: "Declutter your desk with our Accordion Wall Organizer. This expandable pegboard system mounts to your wall and includes shelves, hooks, and magnetic strips. The powder-coated steel panel works with standard pegboard accessories, allowing you to customize your layout as your needs change.",
    shortDescription: "Expandable pegboard wall organizer with shelves and accessories",
    price: 89.99,
    originalPrice: 129.99,
    category: "Office",
    subcategory: "Storage",
    material: "Powder-Coated Steel",
    color: "White",
    style: "Functional / Modern",
    dimensions: "24\"W x 24\"H (expands to 48\"W)",
    weight: "12 lbs",
    inStock: true,
    stock: 50,
    rating: 4.7,
    numReviews: 98,
    images: [
      "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=1200",
"https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=1200",
"https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
"https://images.pexels.com/photos/3740747/pexels-photo-3740747.jpeg"
    ],
    variants: [
      { color: "White", accessories: "6-piece set", price: 89.99, stock: 50 },
      { color: "Black", accessories: "6-piece set", price: 89.99, stock: 45 },
      { color: "Gray", accessories: "12-piece set", price: 129.99, stock: 30 }
    ],
    features: [
      "Expandable accordion design",
      "Compatible with standard pegboard",
      "Includes 6 accessories",
      "Magnetic strip for metal items",
      "Easy wall-mount installation",
      "Powder-coated steel construction"
    ],
    reviews: [
      { 
        _id: "rev_058", 
        user: "OrganizationQueen", 
        rating: 5, 
        title: "Finally got my desk clean", 
        comment: "Everything has a place now. Love that I can rearrange the accessories.", 
        date: "2024-03-30",
        verified: true,
        helpful: 41
      }
    ],
    tags: ["wall-organizer", "pegboard", "storage", "desk-accessories", "office-organization"],
    featured: false,
    trending: true,
    bestSeller: true,
    newArrival: true,
    onSale: true,
    createdAt: "2024-03-15T08:00:00.000Z",
    updatedAt: "2024-04-05T10:30:00.000Z"
  },
  {
    _id: "prod_058",
    name: "The Boulevard Leather Armchair",
    slug: "boulevard-leather-armchair",
    description: "Classic sophistication meets modern comfort in our Boulevard Leather Armchair. Handcrafted from full-grain Italian leather with a rich cognac finish, this chair features deep button tufting on the backrest and rolled arms. The sinuous spring suspension and high-density foam cushions provide lasting comfort that only improves with age.",
    shortDescription: "Handcrafted Italian leather armchair with button tufting",
    price: 1299.99,
    originalPrice: 1799.99,
    category: "Living Room",
    subcategory: "Accent Chairs",
    material: "Italian Leather",
    color: "Cognac",
    style: "Traditional / Club",
    dimensions: "34\"W x 36\"D x 34\"H",
    weight: "65 lbs",
    inStock: true,
    stock: 8,
    rating: 4.9,
    numReviews: 64,
    images: [
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200",
"https://images.unsplash.com/photo-1592078615290-033ee584e267?w=1200",
"https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg",
"https://images.pexels.com/photos/6585601/pexels-photo-6585601.jpeg"
    ],
    variants: [
      { color: "Cognac", material: "Full-Grain Leather", price: 1299.99, stock: 8 },
      { color: "Espresso", material: "Full-Grain Leather", price: 1299.99, stock: 6 },
      { color: "Oxford Tan", material: "Full-Grain Leather", price: 1399.99, stock: 5 },
      { color: "Charcoal", material: "Top-Grain Leather", price: 1099.99, stock: 10 }
    ],
    features: [
      "Full-grain Italian leather",
      "Deep button tufted backrest",
      "Rolled arms with nailhead trim",
      "Sinuous spring suspension",
      "High-density foam cushions",
      "Solid hardwood frame"
    ],
    reviews: [
      { 
        _id: "rev_059", 
        user: "William H.", 
        rating: 5, 
        title: "Heirloom quality chair", 
        comment: "The leather is absolutely beautiful and already developing a nice patina. Very comfortable and sturdy.", 
        date: "2024-04-02",
        verified: true,
        helpful: 38
      }
    ],
    tags: ["armchair", "leather", "club-chair", "traditional", "tufted", "living-room"],
    featured: true,
    trending: false,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-02-10T08:00:00.000Z",
    updatedAt: "2024-03-28T10:30:00.000Z"
  },
  {
    _id: "prod_059",
    name: "The Coastal Rattan Armchair",
    slug: "coastal-rattan-armchair",
    description: "Bring breezy coastal vibes to your living space with our Coastal Rattan Armchair. Handwoven from natural rattan with a light honey finish, this chair features a rounded silhouette and plush cotton-blend cushion. The open weave keeps the look airy and light, perfect for sunrooms or beach-inspired interiors.",
    shortDescription: "Handwoven rattan armchair with plush cotton cushions",
    price: 549.99,
    originalPrice: 749.99,
    category: "Living Room",
    subcategory: "Accent Chairs",
    material: "Rattan / Cotton Blend",
    color: "Natural Honey",
    style: "Coastal / Bohemian",
    dimensions: "28\"W x 32\"D x 34\"H",
    weight: "28 lbs",
    inStock: true,
    stock: 16,
    rating: 4.7,
    numReviews: 52,
    images: [
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
"https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
"https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg",
"https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg"
    ],
    variants: [
      { color: "Natural Honey", cushion: "White Cotton", price: 549.99, stock: 16 },
      { color: "Dark Espresso", cushion: "Beige Cotton", price: 579.99, stock: 10 },
      { color: "Natural Honey", cushion: "Navy Blue", price: 569.99, stock: 12 }
    ],
    features: [
      "Handwoven natural rattan",
      "Plush cotton-blend cushion",
      "Removable/washable cushion cover",
      "Lightweight and movable",
      "Rubber feet protect floors",
      "No assembly required"
    ],
    reviews: [
      { 
        _id: "rev_060", 
        user: "BeachLover88", 
        rating: 5, 
        title: "Perfect for my sunroom", 
        comment: "So light and airy! The rattan is beautiful and the cushion is comfy.", 
        date: "2024-03-30",
        verified: true,
        helpful: 27
      }
    ],
    tags: ["rattan", "coastal", "boho", "accent-chair", "sunroom", "living-room"],
    featured: false,
    trending: true,
    bestSeller: false,
    newArrival: true,
    onSale: true,
    createdAt: "2024-03-05T08:00:00.000Z",
    updatedAt: "2024-04-02T10:30:00.000Z"
  },
  {
    _id: "prod_060",
    name: "The Minimalist Boucle Armchair",
    slug: "minimalist-boucle-armchair",
    description: "Embrace cozy minimalism with our Minimalist Boucle Armchair. Wrapped in creamy white bouclé fabric with a sculptural oak frame, this chair is as comfortable as it is beautiful. The rounded silhouette and plush texture invite you to sink in, while the solid wood legs add organic warmth.",
    shortDescription: "Sculptural bouclé armchair with solid oak frame",
    price: 749.99,
    originalPrice: 999.99,
    category: "Living Room",
    subcategory: "Accent Chairs",
    material: "Bouclé Fabric / Solid Oak",
    color: "Cream",
    style: "Minimalist / Scandinavian",
    dimensions: "29\"W x 31\"D x 28\"H",
    weight: "48 lbs",
    inStock: true,
    stock: 14,
    rating: 4.9,
    numReviews: 89,
    images: [
      "https://images.pexels.com/photos/2079249/pexels-photo-2079249.jpeg",
"https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg",
"https://images.pexels.com/photos/3932930/pexels-photo-3932930.jpeg",
"https://images.pexels.com/photos/2544839/pexels-photo-2544839.jpeg"
    ],
    variants: [
      { color: "Cream", material: "Bouclé", price: 749.99, stock: 14 },
      { color: "Charcoal", material: "Bouclé", price: 749.99, stock: 10 },
      { color: "Sage", material: "Bouclé", price: 749.99, stock: 8 }
    ],
    features: [
      "Textured bouclé fabric",
      "Solid oak frame and legs",
      "Sculptural rounded silhouette",
      "High-resiliency foam fill",
      "Removable seat cushion",
      "Non-marking felt feet"
    ],
    reviews: [
      { 
        _id: "rev_061", 
        user: "DesignHunter", 
        rating: 5, 
        title: "So chic and comfy", 
        comment: "The bouclé is incredibly soft and the shape is gorgeous. Fits perfectly in my minimalist living room.", 
        date: "2024-04-04",
        verified: true,
        helpful: 44
      }
    ],
    tags: ["boucle", "minimalist", "scandinavian", "accent-chair", "cozy", "living-room"],
    featured: true,
    trending: true,
    bestSeller: true,
    newArrival: true,
    onSale: false,
    createdAt: "2024-03-15T08:00:00.000Z",
    updatedAt: "2024-04-05T10:30:00.000Z"
  },
  {
    _id: "prod_061",
    name: "The Wingback Wing Chair",
    slug: "wingback-wing-chair",
    description: "A timeless classic reimagined for modern living. Our Wingback Wing Chair features tall sides that provide warmth and privacy, perfect for cozy reading nooks. Upholstered in durable performance fabric with antique brass nailhead trim and turned mahogany legs.",
    shortDescription: "Classic wingback chair with nailhead trim and mahogany legs",
    price: 849.99,
    originalPrice: 1199.99,
    category: "Living Room",
    subcategory: "Accent Chairs",
    material: "Performance Fabric / Mahogany",
    color: "Dusty Blue",
    style: "Traditional / English",
    dimensions: "32\"W x 34\"D x 42\"H",
    weight: "58 lbs",
    inStock: true,
    stock: 11,
    rating: 4.8,
    numReviews: 73,
    images: [
      "https://images.pexels.com/photos/6782567/pexels-photo-6782567.jpeg",
"https://images.pexels.com/photos/7587879/pexels-photo-7587879.jpeg",
"https://images.pexels.com/photos/4846461/pexels-photo-4846461.jpeg",
"https://images.pexels.com/photos/5824901/pexels-photo-5824901.jpeg"
    ],
    variants: [
      { color: "Dusty Blue", fabric: "Performance", price: 849.99, stock: 11 },
      { color: "Taupe", fabric: "Performance", price: 849.99, stock: 9 },
      { color: "Hunter Green", fabric: "Velvet", price: 899.99, stock: 7 }
    ],
    features: [
      "Tall wingback design",
      "Antique brass nailhead trim",
      "Turned mahogany legs",
      "Stain-resistant performance fabric",
      "Pocket coil seat construction",
      "Eco-friendly padding"
    ],
    reviews: [
      { 
        _id: "rev_062", 
        user: "Margaret R.", 
        rating: 5, 
        title: "Beautiful and well-made", 
        comment: "This chair is a classic. The fabric is durable (cat-tested!) and it's very comfortable for reading.", 
        date: "2024-03-28",
        verified: true,
        helpful: 35
      }
    ],
    tags: ["wingback", "traditional", "wing-chair", "reading-chair", "nailhead", "living-room"],
    featured: false,
    trending: false,
    bestSeller: false,
    newArrival: false,
    onSale: true,
    createdAt: "2024-02-20T08:00:00.000Z",
    updatedAt: "2024-03-27T10:30:00.000Z"
  },
  {
    _id: "prod_062",
    name: "The Retro Swivel Accent Chair",
    slug: "retro-swivel-accent-chair",
    description: "Groovy meets glam with our Retro Swivel Accent Chair. The iconic egg-shaped silhouette features a plush velvet upholstery in mustard yellow, a 360-degree polished aluminum swivel base, and a matching ottoman. Perfect for adding a pop of color and personality to any room.",
    shortDescription: "Retro egg-shaped swivel chair with matching ottoman",
    price: 799.99,
    originalPrice: 1099.99,
    category: "Living Room",
    subcategory: "Accent Chairs",
    material: "Velvet / Aluminum",
    color: "Mustard Yellow",
    style: "Retro / Mid-Century",
    dimensions: "33\"W x 30\"D x 31\"H",
    weight: "62 lbs",
    inStock: true,
    stock: 9,
    rating: 4.8,
    numReviews: 45,
    images: [
      "https://images.pexels.com/photos/6508399/pexels-photo-6508399.jpeg",
"https://images.pexels.com/photos/7534570/pexels-photo-7534570.jpeg",
"https://images.pexels.com/photos/6816860/pexels-photo-6816860.jpeg",
"https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
    ],
    variants: [
      { color: "Mustard Yellow", base: "Aluminum", price: 799.99, stock: 9 },
      { color: "Teal", base: "Aluminum", price: 799.99, stock: 7 },
      { color: "Blush Pink", base: "Gold", price: 849.99, stock: 5 },
      { color: "Charcoal", base: "Aluminum", price: 799.99, stock: 8 }
    ],
    features: [
      "Iconic egg-shaped silhouette",
      "360-degree swivel base",
      "Matching ottoman included",
      "Plush velvet upholstery",
      "Polished aluminum or gold base",
      "Padded armless design"
    ],
    reviews: [
      { 
        _id: "rev_063", 
        user: "MidCenturyMike", 
        rating: 5, 
        title: "Ultimate statement chair", 
        comment: "Everyone who visits wants to sit in it. The swivel is buttery smooth and the color is perfect.", 
        date: "2024-04-01",
        verified: true,
        helpful: 42
      }
    ],
    tags: ["swivel-chair", "retro", "mid-century", "egg-chair", "velvet", "living-room"],
    featured: true,
    trending: true,
    bestSeller: false,
    newArrival: true,
    onSale: true,
    createdAt: "2024-03-08T08:00:00.000Z",
    updatedAt: "2024-04-03T10:30:00.000Z"
  },
  {
    _id: "prod_063",
    name: "The Industrial Sling Chair",
    slug: "industrial-sling-chair",
    description: "Urban industrial style meets comfort in our Industrial Sling Chair. The matte black powder-coated steel frame supports a suspended leather sling seat that molds to your body. The minimalist design takes up minimal visual space while providing surprisingly comfortable support.",
    shortDescription: "Industrial leather sling chair with powder-coated steel frame",
    price: 449.99,
    originalPrice: 629.99,
    category: "Living Room",
    subcategory: "Accent Chairs",
    material: "Leather / Powder-Coated Steel",
    color: "Black / Brown",
    style: "Industrial / Minimalist",
    dimensions: "26\"W x 30\"D x 32\"H",
    weight: "35 lbs",
    inStock: true,
    stock: 20,
    rating: 4.6,
    numReviews: 61,
    images: [
     "https://images.pexels.com/photos/6480707/pexels-photo-6480707.jpeg",
"https://images.pexels.com/photos/6585758/pexels-photo-6585758.jpeg",
"https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg",
"https://images.pexels.com/photos/4846457/pexels-photo-4846457.jpeg"
    ],
    variants: [
      { color: "Black/Brown", frame: "Matte Black", price: 449.99, stock: 20 },
      { color: "White/Tan", frame: "Matte White", price: 449.99, stock: 15 },
      { "color": "Black/Black", frame: "Matte Black", price: 469.99, stock: 12 }
    ],
    features: [
      "Suspended leather sling seat",
      "Powder-coated steel frame",
      "Minimalist industrial design",
      "Breathable leather construction",
      "Lightweight and movable",
      "Easy assembly"
    ],
    reviews: [
      { 
        _id: "rev_064", 
        user: "LoftLiving", 
        rating: 4, 
        title: "Cool industrial vibe", 
        comment: "Perfect for my apartment. The sling is comfortable and the chair looks very expensive.", 
        date: "2024-03-29",
        verified: true,
        helpful: 23
      }
    ],
    tags: ["industrial", "sling-chair", "leather", "minimalist", "urban", "living-room"],
    featured: false,
    trending: true,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-02-25T08:00:00.000Z",
    updatedAt: "2024-03-30T10:30:00.000Z"
  },
  {
    _id: "prod_064",
    name: "The Grandmillennial Floral Chair",
    slug: "grandmillennial-floral-chair",
    description: "The apron-front silhouette, turned legs, and charming floral pattern capture the essence of modern-traditional style.",
    shortDescription: "upholstered accent chair",
    price: 599.99,
    originalPrice: 849.99,
    category: "Living Room",
    subcategory: "Accent Chairs",
    material: "Linen-Blend / Rubberwood",
    color: "Multi Floral",
    style: "Grandmillennial / Traditional",
    dimensions: "29\"W x 31\"D x 35\"H",
    weight: "42 lbs",
    inStock: true,
    stock: 10,
    rating: 4.8,
    numReviews: 38,
    images: [
      "https://images.pexels.com/photos/6508399/pexels-photo-6508399.jpeg",
"https://images.pexels.com/photos/7534570/pexels-photo-7534570.jpeg",
"https://images.pexels.com/photos/6816860/pexels-photo-6816860.jpeg",
"https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
    ],
    variants: [
      { color: "Multi Floral", fabric: "Linen-Blend", price: 599.99, stock: 10 },
      { color: "Blue Toile", fabric: "Cotton", price: 649.99, stock: 7 },
      { color: "Rose Chintz", fabric: "Linen-Blend", price: 599.99, stock: 8 }
    ],
    features: [
      "Floral linen-blend upholstery",
      "Apron front with skirt",
      "Turned rubberwood legs",
      "High-density foam cushion",
      "Accent piping detail",
      "No assembly required"
    ],
    reviews: [
      { 
        _id: "rev_065", 
        user: "VintageVera", 
        rating: 5, 
        title: "Absolutely charming", 
        comment: "This chair brings so much personality to my living room. The floral pattern is beautiful and the quality is excellent.", 
        date: "2024-04-02",
        verified: true,
        helpful: 31
      }
    ],
    tags: ["floral", "grandmillennial", "traditional", "accent-chair", "cottage", "living-room"],
    featured: true,
    trending: false,
    bestSeller: false,
    newArrival: false,
    onSale: true,
    createdAt: "2024-02-28T08:00:00.000Z",
    updatedAt: "2024-03-31T10:30:00.000Z"
  },
  {
    _id: "prod_065",
    name: "The Cloud Lounge Chair",
    slug: "cloud-lounge-chair",
    description: "Experience weightless comfort with our Cloud Lounge Chair. The oversized, pillow-like silhouette features channel tufting and is filled with a blend of memory foam and down alternative. The low-profile birch wood base keeps the look modern while the deep seat invites hours of relaxation.",
    shortDescription: "Oversized lounge chair with memory foam and channel tufting",
    price: 899.99,
    originalPrice: 1249.99,
    category: "Living Room",
    subcategory: "Accent Chairs",
    material: "Performance Fabric / Birch",
    color: "Cream",
    style: "Modern / Lounge",
    dimensions: "38\"W x 40\"D x 29\"H",
    weight: "72 lbs",
    inStock: true,
    stock: 7,
    rating: 4.9,
    numReviews: 103,
    images: [
      "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
"https://images.pexels.com/photos/2079249/pexels-photo-2079249.jpeg",
"https://images.pexels.com/photos/6782567/pexels-photo-6782567.jpeg",
"https://images.pexels.com/photos/6782567/pexels-photo-6782567.jpeg"
    ],
    variants: [
      { color: "Cream", fabric: "Performance", price: 899.99, stock: 7 },
      { color: "Charcoal", fabric: "Performance", price: 899.99, stock: 5 },
      { color: "Terracotta", fabric: "Velvet", price: 949.99, stock: 4 }
    ],
    features: [
      "Oversized pillow silhouette",
      "Memory foam and down-alternative fill",
      "Channel tufted backrest",
      "Low-profile birch base",
      "Removable/washable cushion covers",
      "Extra deep seat"
    ],
    reviews: [
      { 
        _id: "rev_066", 
        user: "CozyCatherine", 
        rating: 5, 
        title: "Like sitting on a cloud", 
        comment: "This is the most comfortable chair I've ever owned. Perfect for napping and reading.", 
        date: "2024-04-05",
        verified: true,
        helpful: 67
      }
    ],
    tags: ["lounge-chair", "oversized", "cloud", "deep-seat", "comfort", "living-room"],
    featured: true,
    trending: true,
    bestSeller: true,
    newArrival: false,
    onSale: false,
    createdAt: "2024-01-30T08:00:00.000Z",
    updatedAt: "2024-03-25T10:30:00.000Z"
  },
  {
    _id: "prod_066",
    name: "The Scandinavian Paper Cord Chair",
    slug: "scandinavian-paper-cord-chair",
    description: "Iconic Danish design meets modern comfort in our Scandinavian Paper Cord Chair. The oiled walnut frame provides warm contrast to the hand-woven paper cord seat and backrest. The ergonomic curved back and generous seat dimensions make this as comfortable as it is beautiful.",
    shortDescription: "Danish-inspired walnut chair with hand-woven paper cord",
    price: 699.99,
    originalPrice: 949.99,
    category: "Living Room",
    subcategory: "Accent Chairs",
    material: "Walnut / Paper Cord",
    color: "Natural Walnut",
    style: "Scandinavian / Mid-Century",
    dimensions: "28\"W x 30\"D x 31\"H",
    weight: "24 lbs",
    inStock: true,
    stock: 13,
    rating: 4.9,
    numReviews: 56,
    images: [
      "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
"https://images.pexels.com/photos/2079249/pexels-photo-2079249.jpeg",
"https://images.pexels.com/photos/6782567/pexels-photo-6782567.jpeg",
"https://images.pexels.com/photos/6782567/pexels-photo-6782567.jpeg"
    ],
    variants: [
      { color: "Natural Walnut", seat: "Paper Cord", price: 699.99, stock: 13 },
      { color: "Teak", seat: "Paper Cord", price: 749.99, stock: 8 },
      { color: "Black", seat: "Paper Cord", price: 699.99, stock: 10 }
    ],
    features: [
      "Hand-woven paper cord seat and back",
      "Oiled walnut frame",
      "Ergonomic curved backrest",
      "Traditional Scandinavian joinery",
      "Breathable natural material",
      "Sustainable wood sourcing"
    ],
    reviews: [
      { 
        _id: "rev_067", 
        user: "DanishModernFan", 
        rating: 5, 
        title: "True Scandinavian design", 
        comment: "Beautiful craftsmanship. The paper cord is surprisingly comfortable and looks gorgeous.", 
        date: "2024-03-31",
        verified: true,
        helpful: 39
      }
    ],
    tags: ["scandinavian", "paper-cord", "walnut", "danish", "mid-century", "living-room"],
    featured: true,
    trending: true,
    bestSeller: false,
    newArrival: true,
    onSale: true,
    createdAt: "2024-03-01T08:00:00.000Z",
    updatedAt: "2024-04-01T10:30:00.000Z"
  },
    {
    _id: "prod_067",
    name: "The Milano Velvet Storage Bed",
    slug: "milano-velvet-storage-bed",
    description: "Luxury meets functionality in our Milano Velvet Storage Bed. The oversized diamond-tufted headboard is wrapped in sumptuous velvet, while the hydraulic lift mechanism reveals a massive storage compartment beneath the mattress. Perfect for stowing extra bedding, luggage, or seasonal clothing in style.",
    shortDescription: "Velvet upholstered bed with hydraulic lift storage and diamond tufting",
    price: 1899.99,
    originalPrice: 2499.99,
    category: "Bedroom",
    subcategory: "Storage Beds",
    material: "Velvet / Plywood",
    color: "Sapphire Blue",
    style: "Glam / Luxury",
    dimensions: "Queen: 64\"W x 88\"L x 52\"H",
    weight: "195 lbs",
    inStock: true,
    stock: 6,
    rating: 4.9,
    numReviews: 48,
    images: [
      "https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg",
"https://images.pexels.com/photos/2029694/pexels-photo-2029694.jpeg",
"https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
"https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg"
    ],
    variants: [
      { size: "Queen", color: "Sapphire Blue", price: 1899.99, stock: 6 },
      { size: "King", color: "Sapphire Blue", price: 2199.99, stock: 4 },
      { size: "Queen", color: "Emerald Green", price: 1899.99, stock: 5 },
      { size: "Queen", color: "Dusty Rose", price: 1799.99, stock: 7 }
    ],
    features: [
      "Hydraulic lift storage mechanism",
      "Diamond tufted velvet headboard",
      "Large under-bed storage compartment",
      "Gas struts for easy lifting",
      "No box spring needed",
      "Solid wood frame"
    ],
    reviews: [
      { 
        _id: "rev_068", 
        user: "LuxuryLover", 
        rating: 5, 
        title: "Stunning and practical", 
        comment: "The velvet is so rich and the storage is incredible. I can't believe how much fits under there!", 
        date: "2024-04-03",
        verified: true,
        helpful: 42
      }
    ],
    tags: ["storage-bed", "velvet", "hydraulic", "ottoman-bed", "luxury", "bedroom"],
    featured: true,
    trending: true,
    bestSeller: false,
    newArrival: true,
    onSale: true,
    createdAt: "2024-03-10T08:00:00.000Z",
    updatedAt: "2024-04-04T10:30:00.000Z"
  },
  {
    _id: "prod_068",
    name: "The Hemnes Bookcase Bed",
    slug: "hemnes-bookcase-bed",
    description: "Perfect for avid readers and small spaces, our Hemnes Bookcase Bed features built-in bookshelves integrated into the headboard. The solid pine construction comes in a white finish that brightens any room. Two spacious drawers underneath provide additional storage for linens and clothing.",
    shortDescription: "Solid pine bed with integrated headboard bookshelves and storage drawers",
    price: 1199.99,
    originalPrice: 1599.99,
    category: "Bedroom",
    subcategory: "Storage Beds",
    material: "Solid Pine",
    color: "White",
    style: "Scandinavian / Cottage",
    dimensions: "Full: 58\"W x 82\"L x 48\"H",
    weight: "145 lbs",
    inStock: true,
    stock: 12,
    rating: 4.7,
    numReviews: 92,
    images: [
      "https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg",
"https://images.pexels.com/photos/6585759/pexels-photo-6585759.jpeg",
"https://images.pexels.com/photos/6186513/pexels-photo-6186513.jpeg",
"https://images.pexels.com/photos/7534567/pexels-photo-7534567.jpeg"
    ],
    variants: [
      { size: "Full", color: "White", price: 1199.99, stock: 12 },
      { size: "Queen", color: "White", price: 1399.99, stock: 9 },
      { size: "Full", color: "Gray", price: 1249.99, stock: 7 },
      { size: "Full", color: "Natural Pine", price: 1099.99, stock: 8 }
    ],
    features: [
      "Integrated headboard bookshelves",
      "2 under-bed storage drawers",
      "Solid pine construction",
      "Non-toxic white finish",
      "Slatted base included",
      "Compact design for small rooms"
    ],
    reviews: [
      { 
        _id: "rev_069", 
        user: "BookwormBetty", 
        rating: 5, 
        title: "Perfect for my book collection", 
        comment: "I love having my favorite books right above my bed. The drawers hold all my extra blankets too.", 
        date: "2024-03-30",
        verified: true,
        helpful: 36
      }
    ],
    tags: ["bookcase-bed", "storage-bed", "pine", "cottage", "small-space", "bedroom"],
    featured: false,
    trending: true,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-02-15T08:00:00.000Z",
    updatedAt: "2024-03-28T10:30:00.000Z"
  },
  {
    _id: "prod_069",
    name: "The Modular Cube Storage Bed",
    slug: "modular-cube-storage-bed",
    description: "Customize your storage with our Modular Cube Storage Bed. The base consists of individual cube units that can be arranged in multiple configurations for drawers, open cubbies, or cabinet doors. The simple platform top works with any mattress, and the modular design adapts as your needs change.",
    shortDescription: "Customizable modular storage bed with cube configuration options",
    price: 999.99,
    originalPrice: 1399.99,
    category: "Bedroom",
    subcategory: "Storage Beds",
    material: "Engineered Wood / Laminate",
    color: "Walnut",
    style: "Modern / Modular",
    dimensions: "Queen: 64\"W x 84\"L x 18\"H",
    weight: "175 lbs",
    inStock: true,
    stock: 15,
    rating: 4.8,
    numReviews: 67,
    images: [
      "https://images.pexels.com/photos/4846094/pexels-photo-4846094.jpeg",
"https://images.pexels.com/photos/5824888/pexels-photo-5824888.jpeg",
"https://images.pexels.com/photos/3144581/pexels-photo-3144581.jpeg",
"https://images.pexels.com/photos/6476587/pexels-photo-6476587.jpeg"
    ],
    variants: [
      { size: "Full", color: "Walnut", price: 899.99, stock: 10 },
      { size: "Queen", color: "Walnut", price: 999.99, stock: 15 },
      { size: "King", color: "Walnut", price: 1199.99, stock: 8 },
      { size: "Queen", color: "White", price: 949.99, stock: 12 }
    ],
    features: [
      "Modular cube storage system",
      "Choose from drawers, cubbies, or doors",
      "Low-profile platform design",
      "No box spring required",
      "Easy reconfiguration",
      "Scratch-resistant laminate finish"
    ],
    reviews: [
      { 
        _id: "rev_070", 
        user: "DIYDanielle", 
        rating: 5, 
        title: "Love the customization", 
        comment: "I set mine up with 4 drawers and 4 cubbies. Works perfectly for my clothes and books.", 
        date: "2024-03-28",
        verified: true,
        helpful: 44
      }
    ],
    tags: ["modular-bed", "storage-bed", "cube-storage", "platform-bed", "customizable", "bedroom"],
    featured: true,
    trending: false,
    bestSeller: false,
    newArrival: true,
    onSale: true,
    createdAt: "2024-03-01T08:00:00.000Z",
    updatedAt: "2024-03-29T10:30:00.000Z"
  },
  {
    _id: "prod_070",
    name: "The Elevated Loft Bed with Desk",
    slug: "elevated-loft-bed-with-desk",
    description: "Transform a small bedroom into a functional workspace with our Elevated Loft Bed. The sturdy metal frame raises the bed to create a spacious area underneath that fits a desk, shelves, and even a small sofa. The built-in ladder and safety railings ensure secure access for all ages.",
    shortDescription: "Space-saving loft bed with under-bed desk area and storage",
    price: 899.99,
    originalPrice: 1249.99,
    category: "Bedroom",
    subcategory: "Storage Beds",
    material: "Steel / MDF",
    color: "Matte Black",
    style: "Industrial / Space-Saving",
    dimensions: "Twin: 42\"W x 80\"L x 74\"H",
    weight: "155 lbs",
    inStock: true,
    stock: 11,
    rating: 4.7,
    numReviews: 89,
    images: [
     "https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg",
"https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg",
"https://images.pexels.com/photos/4846094/pexels-photo-4846094.jpeg",
"https://images.pexels.com/photos/7534569/pexels-photo-7534569.jpeg"
    ],
    variants: [
      { size: "Twin", color: "Matte Black", price: 899.99, stock: 11 },
      { size: "Twin XL", color: "Matte Black", price: 949.99, stock: 8 },
      { size: "Twin", color: "Matte White", price: 899.99, stock: 9 }
    ],
    features: [
      "Elevated bed with under-desk workspace",
      "Built-in ladder with anti-slip treads",
      "Full-length safety guardrails",
      "Desk and shelves included",
      "Powder-coated steel frame",
      "Supports up to 400 lbs"
    ],
    reviews: [
      { 
        _id: "rev_071", 
        user: "StudioApartmentSteve", 
        rating: 5, 
        title: "Saved my tiny studio", 
        comment: "I now have a bedroom AND an office in 400 sq ft. Sturdy and well-designed.", 
        date: "2024-03-31",
        verified: true,
        helpful: 58
      }
    ],
    tags: ["loft-bed", "space-saving", "desk-under", "dorm", "small-space", "bedroom"],
    featured: true,
    trending: true,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-02-20T08:00:00.000Z",
    updatedAt: "2024-03-27T10:30:00.000Z"
  },
  {
    _id: "prod_071",
    name: "The Side Drawer Captain's Bed",
    slug: "side-drawer-captains-bed",
    description: "Classic captain's bed design meets modern functionality. Our Side Drawer Captain's Bed features six deep drawers along the side, providing ample storage without needing extra dressers. The solid rubberwood construction in a chestnut finish offers durability and timeless style for any bedroom.",
    shortDescription: "Classic captain's bed with 6 deep side drawers in solid rubberwood",
    price: 1299.99,
    originalPrice: 1699.99,
    category: "Bedroom",
    subcategory: "Storage Beds",
    material: "Solid Rubberwood",
    color: "Chestnut",
    style: "Traditional / Classic",
    dimensions: "Twin: 42\"W x 80\"L x 36\"H",
    weight: "165 lbs",
    inStock: true,
    stock: 9,
    rating: 4.8,
    numReviews: 74,
    images: [
      "https://images.pexels.com/photos/7534569/pexels-photo-7534569.jpeg",
"https://images.pexels.com/photos/6580227/pexels-photo-6580227.jpeg",
"https://images.pexels.com/photos/6508357/pexels-photo-6508357.jpeg",
"https://images.pexels.com/photos/5824896/pexels-photo-5824896.jpeg"
    ],
    variants: [
      { size: "Twin", color: "Chestnut", price: 1299.99, stock: 9 },
      { size: "Full", color: "Chestnut", price: 1499.99, stock: 7 },
      { size: "Twin", color: "White", price: 1249.99, stock: 8 }
    ],
    features: [
      "6 deep storage drawers",
      "Solid rubberwood construction",
      "Ball-bearing drawer slides",
      "Dovetail drawer joinery",
      "Classic captain's bed design",
      "No box spring needed"
    ],
    reviews: [
      { 
        _id: "rev_072", 
        user: "MomOfThree", 
        rating: 5, 
        title: "Perfect for kids' rooms", 
        comment: "Each of my children has one. We've eliminated dressers completely and the rooms look so organized.", 
        date: "2024-04-01",
        verified: true,
        helpful: 49
      }
    ],
    tags: ["captains-bed", "drawer-bed", "storage-bed", "solid-wood", "kids-room", "bedroom"],
    featured: false,
    trending: false,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-02-10T08:00:00.000Z",
    updatedAt: "2024-03-28T10:30:00.000Z"
  },
  {
    _id: "prod_072",
    name: "The Rolling Under-Bed Storage Drawers (Set of 4)",
    slug: "rolling-under-bed-storage-drawers",
    description: "Add storage to any bed with our Rolling Under-Bed Storage Drawers. This set of four low-profile drawers glides smoothly on wheels and fits under most bed frames with at least 6 inches of clearance. Perfect for shoes, off-season clothing, or linens. Canvas construction with clear vinyl fronts for easy viewing.",
    shortDescription: "Set of 4 rolling under-bed storage drawers with clear fronts",
    price: 89.99,
    originalPrice: 129.99,
    category: "Bedroom",
    subcategory: "Storage Beds",
    material: "Canvas / Plastic",
    color: "Gray",
    style: "Functional",
    dimensions: "28\"L x 15\"W x 5.5\"H each",
    weight: "12 lbs (set)",
    inStock: true,
    stock: 50,
    rating: 4.5,
    numReviews: 312,
    images: [
      "https://images.pexels.com/photos/6508356/pexels-photo-6508356.jpeg",
"https://images.pexels.com/photos/5824895/pexels-photo-5824895.jpeg",
"https://images.pexels.com/photos/6186514/pexels-photo-6186514.jpeg",
"https://images.pexels.com/photos/7534565/pexels-photo-7534565.jpeg"
    ],
    variants: [
      { size: "Set of 4", color: "Gray", price: 89.99, stock: 50 },
      { size: "Set of 6", color: "Gray", price: 129.99, stock: 35 },
      { size: "Set of 4", color: "Black", price: 89.99, stock: 40 }
    ],
    features: [
      "4 rolling storage drawers",
      "Clear vinyl front for visibility",
      "Sturdy canvas construction",
      "Smooth-rolling wheels (2 locking)",
      "Folds flat when not in use",
      "Reinforced handles"
    ],
    reviews: [
      { 
        _id: "rev_073", 
        user: "OrganizedOlivia", 
        rating: 5, 
        title: "Such a simple solution", 
        comment: "I can't believe I didn't get these sooner. All my shoes now live under the bed neatly.", 
        date: "2024-04-04",
        verified: true,
        helpful: 63
      }
    ],
    tags: ["under-bed-storage", "rolling-drawers", "space-saving", "organization", "bedroom"],
    featured: false,
    trending: true,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-03-01T08:00:00.000Z",
    updatedAt: "2024-04-01T10:30:00.000Z"
  },
  {
    _id: "prod_073",
    name: "The Mid-Century Storage Bed",
    slug: "mid-century-storage-bed",
    description: "Iconic mid-century style meets smart storage in this beautiful platform bed. The walnut veneer frame features two spacious drawers on each side with brushed brass pulls. The tapered wooden legs and clean lines deliver the classic look, while the integrated storage eliminates the need for a bulky dresser.",
    shortDescription: "Mid-century platform bed with 4 storage drawers and walnut veneer",
    price: 1499.99,
    originalPrice: 1999.99,
    category: "Bedroom",
    subcategory: "Storage Beds",
    material: "Walnut Veneer / Solid Wood",
    color: "Rich Walnut",
    style: "Mid-Century Modern",
    dimensions: "Queen: 64\"W x 84\"L x 32\"H",
    weight: "185 lbs",
    inStock: true,
    stock: 8,
    rating: 4.9,
    numReviews: 86,
    images: [
     "https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg",
"https://images.pexels.com/photos/2029694/pexels-photo-2029694.jpeg",
"https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
"https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg"
    ],
    variants: [
      { size: "Full", color: "Walnut", price: 1299.99, stock: 6 },
      { size: "Queen", color: "Walnut", price: 1499.99, stock: 8 },
      { size: "King", color: "Walnut", price: 1799.99, stock: 5 },
      { size: "Queen", color: "Teak", price: 1599.99, stock: 4 }
    ],
    features: [
      "4 spacious storage drawers",
      "Tapered solid wood legs",
      "Walnut veneer finish",
      "Brushed brass hardware",
      "Slatted base included",
      "No box spring required"
    ],
    reviews: [
      { 
        _id: "rev_074", 
        user: "RetroRenovator", 
        rating: 5, 
        title: "Beautiful and functional", 
        comment: "The perfect blend of MCM style and practical storage. Drawers glide smoothly and the wood grain is gorgeous.", 
        date: "2024-04-02",
        verified: true,
        helpful: 51
      }
    ],
    tags: ["mid-century", "storage-bed", "walnut", "drawers", "platform-bed", "bedroom"],
    featured: true,
    trending: true,
    bestSeller: false,
    newArrival: false,
    onSale: true,
    createdAt: "2024-02-05T08:00:00.000Z",
    updatedAt: "2024-03-30T10:30:00.000Z"
  },
    {
    _id: "prod_074",
    name: "The Arc Floor Lamp",
    slug: "arc-floor-lamp",
    description: "Make a dramatic statement with our Arc Floor Lamp. The sweeping matte black arc extends 48 inches, making it perfect for positioning over sofas, reading chairs, or dining tables. The marble-weighted base prevents tipping, while the adjustable shade allows you to direct light exactly where you need it.",
    shortDescription: "Sculptural arc floor lamp with marble base and adjustable shade",
    price: 349.99,
    originalPrice: 499.99,
    category: "Lighting",
    subcategory: "Floor Lamps",
    material: "Steel / Marble",
    color: "Matte Black",
    style: "Modern / Sculptural",
    dimensions: "48\"W x 84\"H",
    weight: "32 lbs",
    inStock: true,
    stock: 18,
    rating: 4.8,
    numReviews: 124,
    images: [
      "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=1200",
"https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=1200",
"https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=1200",
"https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1200"
    ],
    variants: [
      { color: "Matte Black", base: "White Marble", price: 349.99, stock: 18 },
      { color: "Brass", base: "Black Marble", price: 399.99, stock: 10 },
      { color: "Matte White", base: "Gray Marble", price: 349.99, stock: 15 }
    ],
    features: [
      "48-inch arc extension",
      "Solid marble weighted base",
      "Adjustable shade head",
      "Heavy-gauge steel construction",
      "Floor dimmer switch included",
      "Takes standard E26 bulb (max 100W)"
    ],
    reviews: [
      { 
        _id: "rev_075", 
        user: "LightingLover", 
        rating: 5, 
        title: "Perfect over the sofa", 
        comment: "The arc is exactly what our living room needed. The marble base feels very high-end and stable.", 
        date: "2024-04-03",
        verified: true,
        helpful: 38
      }
    ],
    tags: ["arc-lamp", "floor-lamp", "modern", "marble", "living-room", "lighting"],
    featured: true,
    trending: true,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-02-15T08:00:00.000Z",
    updatedAt: "2024-03-28T10:30:00.000Z"
  },
  {
    _id: "prod_075",
    name: "The Industrial Pendant Light",
    slug: "industrial-pendant-light",
    description: "Bring warehouse chic to your home with our Industrial Pendant Light. The vintage-inspired cage design surrounds an Edison bulb, casting warm shadows across your space. The adjustable cord drops allow you to customize the hang height, whether over a kitchen island, dining table, or workspace.",
    shortDescription: "Vintage-inspired cage pendant light with adjustable cord",
    price: 89.99,
    originalPrice: 129.99,
    category: "Lighting",
    subcategory: "Pendant Lights",
    material: "Steel / Glass",
    color: "Matte Black",
    style: "Industrial / Vintage",
    dimensions: "12\"W x 12\"D x 12\"H",
    weight: "5 lbs",
    inStock: true,
    stock: 45,
    rating: 4.8,
    numReviews: 203,
    images: [
      "https://images.pexels.com/photos/1123262/pexels-photo-1123262.jpeg",
"https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg",
"https://images.pexels.com/photos/943150/pexels-photo-943150.jpeg",
"https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=1200"
    ],
    variants: [
      { color: "Matte Black", finish: "Cage", price: 89.99, stock: 45 },
      { color: "Brushed Nickel", finish: "Cage", price: 99.99, stock: 30 },
      { color: "Copper", finish: "Cage", price: 109.99, stock: 25 },
      { color: "Matte Black", finish: "Clear Glass Globe", price: 79.99, stock: 35 }
    ],
    features: [
      "Industrial cage design",
      "Adjustable cord length (up to 60\")",
      "Compatible with Edison bulbs",
      "Easy hardwire installation",
      "All mounting hardware included",
      "UL certified"
    ],
    reviews: [
      { 
        _id: "rev_076", 
        user: "KitchenRenovator", 
        rating: 5, 
        title: "Great value", 
        comment: "Installed three of these over our island. They look amazing and were easy to install.", 
        date: "2024-04-01",
        verified: true,
        helpful: 52
      }
    ],
    tags: ["pendant-light", "industrial", "cage-light", "kitchen-island", "vintage", "lighting"],
    featured: false,
    trending: true,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-02-20T08:00:00.000Z",
    updatedAt: "2024-03-25T10:30:00.000Z"
  },
  {
    _id: "prod_076",
    name: "The Smart LED Strip Light (16ft)",
    slug: "smart-led-strip-light",
    description: "Transform any room with our Smart LED Strip Light. The 16-foot strip offers 16 million colors and is compatible with Alexa, Google Home, and Apple HomeKit. Cut-to-length design and strong adhesive backing make installation effortless behind TVs, under cabinets, or along crown molding.",
    shortDescription: "16ft smart LED strip with app and voice control, 16M colors",
    price: 39.99,
    originalPrice: 59.99,
    category: "Lighting",
    subcategory: "Smart Lighting",
    material: "Silicone / PCB",
    color: "Multi-Color",
    style: "Modern / Smart",
    dimensions: "16ft length",
    weight: "1 lb",
    inStock: true,
    stock: 200,
    rating: 4.7,
    numReviews: 1894,
    images: [
      "https://images.pexels.com/photos/6782571/pexels-photo-6782571.jpeg",
"https://images.pexels.com/photos/6782577/pexels-photo-6782577.jpeg",
"https://images.pexels.com/photos/6782579/pexels-photo-6782579.jpeg",
"https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=1200"
    ],
    variants: [
      { length: "16ft", color: "RGBIC", price: 39.99, stock: 200 },
      { length: "32ft", color: "RGBIC", price: 69.99, stock: 150 },
      { length: "16ft", color: "RGBWW (White Tones)", price: 44.99, stock: 120 }
    ],
    features: [
      "16 million colors + white tones",
      "Voice control (Alexa, Google, HomeKit)",
      "Music sync mode",
      "Cut-to-length every 4 inches",
      "Strong 3M adhesive backing",
      "App control with schedules"
    ],
    reviews: [
      { 
        _id: "rev_077", 
        user: "SmartHomeSteve", 
        rating: 5, 
        title: "Game changer for gaming setup", 
        comment: "The music sync mode is awesome. Easy to install and the app works great.", 
        date: "2024-04-04",
        verified: true,
        helpful: 87
      }
    ],
    tags: ["led-strip", "smart-lighting", "rgb", "voice-control", "accent-lighting", "gaming"],
    featured: false,
    trending: true,
    bestSeller: true,
    newArrival: true,
    onSale: true,
    createdAt: "2024-03-10T08:00:00.000Z",
    updatedAt: "2024-04-05T10:30:00.000Z"
  },
  {
    _id: "prod_077",
    name: "The Globe White Pendant",
    slug: "globe-white-pendant",
    description: "Minimalist elegance at its finest. The Globe White Pendant features a hand-blown opal glass globe suspended from a brushed brass canopy. The soft, diffused light creates a warm, inviting atmosphere perfect for entryways, bedrooms, or dining areas. The simple silhouette complements any decor style.",
    shortDescription: "Hand-blown opal glass globe pendant with brass canopy",
    price: 149.99,
    originalPrice: 229.99,
    category: "Lighting",
    subcategory: "Pendant Lights",
    material: "Opal Glass / Brass",
    color: "White / Brass",
    style: "Minimalist / Scandinavian",
    dimensions: "10\"Diameter x 10\"H",
    weight: "7 lbs",
    inStock: true,
    stock: 28,
    rating: 4.9,
    numReviews: 67,
    images: [
     "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=1200",
"https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1200",
"https://images.pexels.com/photos/1123262/pexels-photo-1123262.jpeg",
"https://images.pexels.com/photos/6782571/pexels-photo-6782571.jpeg"
    ],
    variants: [
      { size: "10\"", color: "White/Brass", price: 149.99, stock: 28 },
      { size: "14\"", color: "White/Brass", price: 199.99, stock: 15 },
      { size: "10\"", color: "White/Nickel", price: 139.99, stock: 20 },
      { size: "10\"", color: "Smoke/Brass", price: 169.99, stock: 12 }
    ],
    features: [
      "Hand-blown opal glass",
      "Brushed brass canopy",
      "Soft, diffused light",
      "Adjustable cord length",
      "Hardwired installation",
      "Dimmable compatible"
    ],
    reviews: [
      { 
        _id: "rev_078", 
        user: "MinimalistMike", 
        rating: 5, 
        title: "Perfect simple elegance", 
        comment: "Exactly what I wanted for my dining room. The light is soft and beautiful.", 
        date: "2024-04-02",
        verified: true,
        helpful: 34
      }
    ],
    tags: ["pendant-light", "globe-light", "minimalist", "glass", "brass", "scandinavian"],
    featured: true,
    trending: false,
    bestSeller: false,
    newArrival: true,
    onSale: false,
    createdAt: "2024-03-05T08:00:00.000Z",
    updatedAt: "2024-03-30T10:30:00.000Z"
  },
  {
    _id: "prod_078",
    name: "The Minimalist Desk Lamp",
    slug: "minimalist-desk-lamp",
    description: "Form meets function in our Minimalist Desk Lamp. The aluminum construction and precision-balanced joints allow effortless positioning in any direction. The built-in LED provides flicker-free, eye-friendly illumination with adjustable brightness and three color temperature presets. USB-C powered.",
    shortDescription: "Precision-balanced LED desk lamp with adjustable brightness and color temp",
    price: 79.99,
    originalPrice: 119.99,
    category: "Lighting",
    subcategory: "Desk Lamps",
    material: "Aluminum",
    color: "Silver",
    style: "Minimalist / Modern",
    dimensions: "20\"H x 6\"W (arm extends to 24\")",
    weight: "3 lbs",
    inStock: true,
    stock: 45,
    rating: 4.9,
    numReviews: 312,
    images: [
      "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=1200",
"https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg",
"https://images.pexels.com/photos/6782577/pexels-photo-6782577.jpeg",
"https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1200"
    ],
    variants: [
      { color: "Silver", finish: "Brushed", price: 79.99, stock: 45 },
      { color: "Matte Black", finish: "Powder-Coated", price: 79.99, stock: 38 },
      { color: "Space Gray", finish: "Anodized", price: 89.99, stock: 25 }
    ],
    features: [
      "Precision-balanced joints",
      "Flicker-free LED (50000 hr life)",
      "Brightness adjustment (5 levels)",
      "3 color temperature presets (3000K-5000K)",
      "USB-C powered (cable included)",
      "Memory function"
    ],
    reviews: [
      { 
        _id: "rev_079", 
        user: "WFH_Wendy", 
        rating: 5, 
        title: "The ultimate desk lamp", 
        comment: "So sleek and the adjustable brightness is perfect for late night work. Love it!", 
        date: "2024-04-05",
        verified: true,
        helpful: 46
      }
    ],
    tags: ["desk-lamp", "led", "minimalist", "adjustable", "home-office", "lighting"],
    featured: false,
    trending: true,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-02-25T08:00:00.000Z",
    updatedAt: "2024-03-28T10:30:00.000Z"
  },
  {
    _id: "prod_079",
    name: "The Sputnik Chandelier",
    slug: "sputnik-chandelier",
    description: "Mid-century modern meets atomic age design in our Sputnik Chandelier. The iconic starburst design features 12 arms terminating in gold-finished sockets, perfect for exposed Edison bulbs. The brass frame and vintage styling make this a showstopper in any entryway, dining room, or living space.",
    shortDescription: "Mid-century starburst chandelier with 12 arms and brass finish",
    price: 299.99,
    originalPrice: 449.99,
    category: "Lighting",
    subcategory: "Chandeliers",
    material: "Brass / Steel",
    color: "Gold",
    style: "Mid-Century / Atomic",
    dimensions: "28\"W x 28\"D x 18\"H",
    weight: "12 lbs",
    inStock: true,
    stock: 15,
    rating: 4.8,
    numReviews: 89,
    images: [
      "https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=1200",
"https://images.pexels.com/photos/943150/pexels-photo-943150.jpeg",
"https://images.pexels.com/photos/6782579/pexels-photo-6782579.jpeg",
"https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=1200"
    ],
    variants: [
      { size: "28\"", arms: "12", finish: "Gold", price: 299.99, stock: 15 },
      { size: "32\"", arms: "16", finish: "Gold", price: 399.99, stock: 10 },
      { size: "28\"", arms: "12", finish: "Black", price: 279.99, stock: 12 }
    ],
    features: [
      "12-arm starburst design",
      "Brass finish",
      "Compatible with Edison bulbs",
      "Adjustable cord length",
      "Hardwired installation",
      "Mid-century atomic design"
    ],
    reviews: [
      { 
        _id: "rev_080", 
        user: "MadMenFan", 
        rating: 5, 
        title: "Retro perfection", 
        comment: "This chandelier completes our mid-century living room. Looks incredible with Edison bulbs.", 
        date: "2024-03-30",
        verified: true,
        helpful: 53
      }
    ],
    tags: ["sputnik", "chandelier", "mid-century", "atomic", "brass", "starburst"],
    featured: true,
    trending: true,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-02-10T08:00:00.000Z",
    updatedAt: "2024-03-27T10:30:00.000Z"
  },
  {
    _id: "prod_080",
    name: "The Solar Garden Path Lights (Set of 6)",
    slug: "solar-garden-path-lights",
    description: "Light your outdoor pathways with our Solar Garden Path Lights. Each stake-mounted light features a stainless steel body and frosted glass lens. The automatic dusk-to-dawn sensor turns lights on at night and charges via high-efficiency solar panel during the day. No wiring required.",
    shortDescription: "Set of 6 solar-powered pathway lights with dusk-to-dawn sensor",
    price: 49.99,
    originalPrice: 79.99,
    category: "Lighting",
    subcategory: "Outdoor Lighting",
    material: "Stainless Steel / Glass",
    color: "Black / Clear",
    style: "Traditional / Outdoor",
    dimensions: "16\"H x 4\"W each",
    weight: "6 lbs (set)",
    inStock: true,
    stock: 85,
    rating: 4.6,
    numReviews: 567,
    images: [
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=1200",
"https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1200",
"https://images.pexels.com/photos/1123262/pexels-photo-1123262.jpeg",
"https://images.pexels.com/photos/6782571/pexels-photo-6782571.jpeg"
    ],
    variants: [
      { quantity: "6-pack", color: "Black", price: 49.99, stock: 85 },
      { quantity: "12-pack", color: "Black", price: 89.99, stock: 50 },
      { quantity: "6-pack", color: "Bronze", price: 54.99, stock: 40 }
    ],
    features: [
      "Solar-powered (no wiring)",
      "Automatic dusk-to-dawn sensor",
      "Frosted glass lens",
      "Weather-resistant stainless steel",
      "8 hours of light on full charge",
      "Easy stake installation"
    ],
    reviews: [
      { 
        _id: "rev_081", 
        user: "GardenerGary", 
        rating: 5, 
        title: "Beautiful pathway lighting", 
        comment: "So easy to install. Just stake them in the ground. They light up automatically and look great.", 
        date: "2024-04-02",
        verified: true,
        helpful: 64
      }
    ],
    tags: ["solar-lights", "pathway-lights", "outdoor-lighting", "garden", "landscape", "dusk-to-dawn"],
    featured: false,
    trending: true,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-03-01T08:00:00.000Z",
    updatedAt: "2024-04-01T10:30:00.000Z"
  },
  {
    _id: "prod_081",
    name: "The Swivel Picture Light",
    slug: "swivel-picture-light",
    description: "Showcase your artwork with our Swivel Picture Light. The brushed brass finish and adjustable light head direct warm LED light exactly where you need it. The battery-powered design (USB rechargeable) means no visible cords to distract from your gallery wall. Motion sensor option available.",
    shortDescription: "Rechargeable battery-powered picture light with adjustable head",
    price: 59.99,
    originalPrice: 89.99,
    category: "Lighting",
    subcategory: "Accent Lighting",
    material: "Brass / Aluminum",
    color: "Brushed Brass",
    style: "Traditional / Gallery",
    dimensions: "16\"W x 4\"D x 3\"H",
    weight: "1.5 lbs",
    inStock: true,
    stock: 35,
    rating: 4.7,
    numReviews: 128,
    images: [
     "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=1200",
"https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=1200",
"https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=1200",
"https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1200"
    ],
    variants: [
      { size: "16\"", finish: "Brushed Brass", price: 59.99, stock: 35 },
      { size: "24\"", finish: "Brushed Brass", price: 79.99, stock: 20 },
      { size: "16\"", finish: "Matte Black", price: 54.99, stock: 28 }
    ],
    features: [
      "USB rechargeable battery (8-12 hours)",
      "Motion sensor option",
      "Adjustable light angle",
      "Warm white LED (3000K)",
      "No wiring required",
      "Mounting hardware included"
    ],
    reviews: [
      { 
        _id: "rev_082", 
        user: "ArtCollector", 
        rating: 5, 
        title: "Perfect for my gallery wall", 
        comment: "No cords means my art looks clean. The light quality is excellent and the battery lasts a long time.", 
        date: "2024-04-03",
        verified: true,
        helpful: 31
      }
    ],
    tags: ["picture-light", "art-light", "battery-powered", "brass", "gallery", "accent-lighting"],
    featured: true,
    trending: false,
    bestSeller: false,
    newArrival: true,
    onSale: true,
    createdAt: "2024-03-12T08:00:00.000Z",
    updatedAt: "2024-04-04T10:30:00.000Z"
  },
  {
    _id: "prod_082",
    name: "The Tripod Floor Lamp",
    slug: "tripod-floor-lamp",
    description: "Add Scandinavian warmth with our Tripod Floor Lamp. The solid oak legs form a stable tripod base, while the natural linen shade diffuses light softly. The brass hardware and fabric cord add vintage charm. Perfect for reading corners, next to sofas, or in bedrooms.",
    shortDescription: "Solid oak tripod floor lamp with linen shade and brass details",
    price: 199.99,
    originalPrice: 289.99,
    category: "Lighting",
    subcategory: "Floor Lamps",
    material: "Oak / Linen / Brass",
    color: "Natural Oak / Cream",
    style: "Scandinavian / Mid-Century",
    dimensions: "60\"H x 24\"W",
    weight: "12 lbs",
    inStock: true,
    stock: 22,
    rating: 4.9,
    numReviews: 104,
    images: [
      "https://images.pexels.com/photos/6782571/pexels-photo-6782571.jpeg",
"https://images.pexels.com/photos/6782577/pexels-photo-6782577.jpeg",
"https://images.pexels.com/photos/6782579/pexels-photo-6782579.jpeg",
"https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=1200"
    ],
    variants: [
      { color: "Natural Oak / Cream", shade: "Linen", price: 199.99, stock: 22 },
      { color: "Walnut / Gray", shade: "Linen", price: 219.99, stock: 15 },
      { color: "Black / Cream", shade: "Linen", price: 189.99, stock: 18 }
    ],
    features: [
      "Solid oak tripod legs",
      "Natural linen shade",
      "Brass hardware details",
      "Fabric-covered cord",
      "Foot-switch on cord",
      "Takes standard E26 bulb"
    ],
    reviews: [
      { 
        _id: "rev_083", 
        user: "ScandiStyle", 
        rating: 5, 
        title: "Beautiful craftsmanship", 
        comment: "The wood is gorgeous and the linen shade gives the perfect warm glow. Very well made.", 
        date: "2024-04-04",
        verified: true,
        helpful: 42
      }
    ],
    tags: ["tripod-lamp", "floor-lamp", "scandinavian", "oak", "linen-shade", "mid-century"],
    featured: true,
    trending: true,
    bestSeller: true,
    newArrival: false,
    onSale: false,
    createdAt: "2024-02-08T08:00:00.000Z",
    updatedAt: "2024-03-29T10:30:00.000Z"
  },
    {
    _id: "prod_083",
    name: "The Coastal Bistro Set",
    slug: "coastal-bistro-set",
    description: "Enjoy your morning coffee in style with our Coastal Bistro Set. This 3-piece set includes two weather-resistant wicker chairs with plush cushions and a round tempered glass bistro table. The natural rattan-look finish and cream cushions bring breezy coastal charm to any patio, balcony, or sunroom.",
    shortDescription: "3-piece wicker bistro set with cushions and glass table",
    price: 299.99,
    originalPrice: 449.99,
    category: "Outdoor",
    subcategory: "Bistro Sets",
    material: "Resin Wicker / Tempered Glass",
    color: "Natural / Cream",
    style: "Coastal / Traditional",
    dimensions: "Chair: 23\"W x 25\"D x 34\"H, Table: 24\"Diameter x 28\"H",
    weight: "35 lbs",
    inStock: true,
    stock: 25,
    rating: 4.7,
    numReviews: 143,
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200"
    ],
    variants: [
      { color: "Natural/Cream", material: "Resin Wicker", price: 299.99, stock: 25 },
      { color: "Espresso/Beige", material: "Resin Wicker", price: 299.99, stock: 20 },
      { color: "Gray/Charcoal", material: "Resin Wicker", price: 279.99, stock: 18 }
    ],
    features: [
      "All-weather resin wicker",
      "Tempered glass table top",
      "Removable/washable cushion covers",
      "Rust-proof steel frames",
      "Folds for storage (chairs)",
      "Easy assembly"
    ],
    reviews: [
      { 
        _id: "rev_084", 
        user: "BalconyBetty", 
        rating: 5, 
        title: "Perfect for small spaces", 
        comment: "Fits perfectly on my apartment balcony. The cushions are comfy and the set looks much more expensive than it is.", 
        date: "2024-04-02",
        verified: true,
        helpful: 41
      }
    ],
    tags: ["bistro-set", "wicker", "patio-set", "small-space", "coastal", "outdoor"],
    featured: true,
    trending: true,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-02-15T08:00:00.000Z",
    updatedAt: "2024-03-28T10:30:00.000Z"
  },
  {
    _id: "prod_084",
    name: "The Solar Umbrella",
    slug: "solar-umbrella",
    description: "Stay cool and powered up with our Solar Umbrella. The 9-foot cantilever design provides 360-degree shade adjustment, while integrated solar panels power LED lights and USB charging ports. The durable solution-dyed acrylic fabric is UV and fade resistant, and the powder-coated aluminum frame withstands strong winds.",
    shortDescription: "9ft solar-powered cantilever umbrella with LED lights and USB ports",
    price: 599.99,
    originalPrice: 799.99,
    category: "Outdoor",
    subcategory: "Umbrellas",
    material: "Acrylic Fabric / Aluminum",
    color: "Terracotta",
    style: "Modern / Functional",
    dimensions: "9ft diameter, 8ft height",
    weight: "55 lbs",
    inStock: true,
    stock: 12,
    rating: 4.8,
    numReviews: 72,
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200"
    ],
    variants: [
      { color: "Terracotta", fabric: "Solution-Dyed Acrylic", price: 599.99, stock: 12 },
      { color: "Navy", fabric: "Solution-Dyed Acrylic", price: 599.99, stock: 10 },
      { color: "Sand", fabric: "Solution-Dyed Acrylic", price: 599.99, stock: 15 },
      { color: "Forest Green", fabric: "Solution-Dyed Acrylic", price: 599.99, stock: 8 }
    ],
    features: [
      "9-foot cantilever design",
      "Integrated solar panels",
      "LED lights (8-hour battery)",
      "2 USB charging ports",
      "360-degree rotation",
      "Wind vents for stability"
    ],
    reviews: [
      { 
        _id: "rev_085", 
        user: "PoolsidePaul", 
        rating: 5, 
        title: "Love the built-in lights", 
        comment: "The solar lights come on automatically at dusk. Perfect for evening pool parties.", 
        date: "2024-04-01",
        verified: true,
        helpful: 38
      }
    ],
    tags: ["solar-umbrella", "cantilever", "patio-umbrella", "led-lights", "outdoor", "shade"],
    featured: true,
    trending: true,
    bestSeller: false,
    newArrival: true,
    onSale: true,
    createdAt: "2024-03-05T08:00:00.000Z",
    updatedAt: "2024-04-02T10:30:00.000Z"
  },
  {
    _id: "prod_085",
    name: "The Acacia Wood Dining Set (7-Piece)",
    slug: "acacia-wood-dining-set",
    description: "Host unforgettable outdoor dinners with our Acacia Wood Dining Set. The 7-piece set includes a 72-inch rectangular table and six folding chairs crafted from solid acacia wood with a weather-resistant teak oil finish. The chairs fold flat for easy storage, and the table features a built-in umbrella hole.",
    shortDescription: "7-piece solid acacia wood dining set with folding chairs",
    price: 899.99,
    originalPrice: 1199.99,
    category: "Outdoor",
    subcategory: "Dining Sets",
    material: "Solid Acacia Wood",
    color: "Teak Brown",
    style: "Rustic / Farmhouse",
    dimensions: "Table: 72\"L x 38\"W x 30\"H, Chairs: 18\"W x 20\"D x 36\"H",
    weight: "110 lbs",
    inStock: true,
    stock: 9,
    rating: 4.7,
    numReviews: 118,
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200"
    ],
    variants: [
      { size: "7-Piece", color: "Teak Brown", price: 899.99, stock: 9 },
      { size: "5-Piece", color: "Teak Brown", price: 649.99, stock: 12 },
      { size: "7-Piece", color: "Gray Wash", price: 949.99, stock: 6 }
    ],
    features: [
      "Solid acacia wood construction",
      "Weather-resistant teak oil finish",
      "Chairs fold flat for storage",
      "Table has 2\" umbrella hole",
      "Seats 6-8 people",
      "Pre-assembled chairs"
    ],
    reviews: [
      { 
        _id: "rev_086", 
        user: "HostessHeather", 
        rating: 5, 
        title: "Beautiful and sturdy", 
        comment: "We've had this set for two seasons and it still looks new. The acacia wood is gorgeous.", 
        date: "2024-03-30",
        verified: true,
        helpful: 52
      }
    ],
    tags: ["dining-set", "acacia", "farmhouse", "outdoor-dining", "folding-chairs", "patio"],
    featured: true,
    trending: false,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-02-10T08:00:00.000Z",
    updatedAt: "2024-03-27T10:30:00.000Z"
  },
  {
    _id: "prod_086",
    name: "The Zero Gravity Recliner Set (2-Pack)",
    slug: "zero-gravity-recliner-set",
    description: "Experience weightless relaxation with our Zero Gravity Recliner Set. Each chair features a locking reclining mechanism that elevates your legs above your heart, reducing back pressure and improving circulation. The breathable mesh fabric and padded headrest keep you cool, while the cup holder and side tray add convenience.",
    shortDescription: "Set of 2 zero gravity recliners with locking mechanism and cup holders",
    price: 149.99,
    originalPrice: 229.99,
    category: "Outdoor",
    subcategory: "Lounge Chairs",
    material: "Textilene Mesh / Steel",
    color: "Black",
    style: "Functional / Modern",
    dimensions: "28\"W x 38\"D x 45\"H (open)",
    weight: "28 lbs (set)",
    inStock: true,
    stock: 45,
    rating: 4.8,
    numReviews: 892,
    images: [
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200"
    ],
    variants: [
      { color: "Black", material: "Textilene Mesh", price: 149.99, stock: 45 },
      { color: "Blue", material: "Textilene Mesh", price: 149.99, stock: 30 },
      { color: "Graphite", material: "Textilene Mesh", price: 159.99, stock: 35 }
    ],
    features: [
      "Zero gravity positioning",
      "Locking elastic cord system",
      "Removable padded headrest",
      "Breathable mesh fabric",
      "Folds flat for storage",
      "Built-in cup holder and tray"
    ],
    reviews: [
      { 
        _id: "rev_087", 
        user: "RelaxedRick", 
        rating: 5, 
        title: "Best chairs for camping", 
        comment: "So comfortable I fell asleep in minutes. The zero gravity position really works.", 
        date: "2024-04-03",
        verified: true,
        helpful: 67
      }
    ],
    tags: ["zero-gravity", "recliner", "outdoor-chair", "camping-chair", "lounge-chair", "patio"],
    featured: false,
    trending: true,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-02-25T08:00:00.000Z",
    updatedAt: "2024-03-29T10:30:00.000Z"
  },
  {
    _id: "prod_087",
    name: "The Fire Pit Coffee Table",
    slug: "fire-pit-coffee-table",
    description: "Extend your outdoor season with our Fire Pit Coffee Table. This 42-inch square table features a 30,000 BTU propane burner hidden beneath decorative lava rocks. The tempered glass wind guard and push-button ignition make it safe and easy to use. The table includes a hidden propane tank storage compartment.",
    shortDescription: "Propane fire pit coffee table with lava rocks and glass guard",
    price: 499.99,
    originalPrice: 699.99,
    category: "Outdoor",
    subcategory: "Fire Pits",
    material: "Steel / Glass",
    color: "Bronze",
    style: "Contemporary / Rustic",
    dimensions: "42\"W x 42\"D x 18\"H",
    weight: "72 lbs",
    inStock: true,
    stock: 14,
    rating: 4.8,
    numReviews: 156,
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200"
    ],
    variants: [
      { color: "Bronze", finish: "Powder-Coated", price: 499.99, stock: 14 },
      { color: "Black", finish: "Powder-Coated", price: 499.99, stock: 10 },
      { color: "Weathered Gray", finish: "Rustic", price: 529.99, stock: 8 }
    ],
    features: [
      "30,000 BTU propane burner",
      "Hidden tank storage compartment",
      "Push-button ignition",
      "Tempered glass wind guard",
      "Decorative lava rocks included",
      "Weather-resistant steel"
    ],
    reviews: [
      { 
        _id: "rev_088", 
        user: "PatioPete", 
        rating: 5, 
        title: "S'mores every night", 
        comment: "Best purchase ever. The flame is adjustable and the table is the perfect height.", 
        date: "2024-04-04",
        verified: true,
        helpful: 73
      }
    ],
    tags: ["fire-pit", "coffee-table", "propane", "outdoor-heating", "patio", "entertaining"],
    featured: true,
    trending: true,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-02-18T08:00:00.000Z",
    updatedAt: "2024-03-30T10:30:00.000Z"
  },
  {
    _id: "prod_088",
    name: "The Hanging Egg Chair",
    slug: "hanging-egg-chair",
    description: "Create a cozy outdoor nook with our Hanging Egg Chair. The hand-woven rattan shell suspends from a heavy-duty steel stand, gently swaying in the breeze. The thick all-weather cushion provides comfort, while the canopy shade offers protection from afternoon sun. Supports up to 330 lbs.",
    shortDescription: "Rattan hanging egg chair with stand and cushion",
    price: 349.99,
    originalPrice: 499.99,
    category: "Outdoor",
    subcategory: "Hanging Chairs",
    material: "Rattan / Steel",
    color: "Natural Brown",
    style: "Bohemian / Tropical",
    dimensions: "35\"W x 40\"D x 74\"H",
    weight: "55 lbs",
    inStock: true,
    stock: 18,
    rating: 4.7,
    numReviews: 234,
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200"
    ],
    variants: [
      { color: "Natural Brown", cushion: "Cream", price: 349.99, stock: 18 },
      { color: "Gray", cushion: "Charcoal", price: 349.99, stock: 12 },
      { color: "White", cushion: "Teal", price: 369.99, stock: 10 }
    ],
    features: [
      "Hand-woven rattan shell",
      "Heavy-duty steel stand",
      "Thick all-weather cushion",
      "Removable canopy shade",
      "330 lb weight capacity",
      "Smooth-swing design"
    ],
    reviews: [
      { 
        _id: "rev_089", 
        user: "BohoBeachBabe", 
        rating: 5, 
        title: "My reading spot", 
        comment: "This chair is so comfortable. I spend hours swinging and reading. Very well made.", 
        date: "2024-04-01",
        verified: true,
        helpful: 58
      }
    ],
    tags: ["egg-chair", "hanging-chair", "rattan", "swing-chair", "bohemian", "outdoor"],
    featured: true,
    trending: true,
    bestSeller: true,
    newArrival: true,
    onSale: true,
    createdAt: "2024-03-10T08:00:00.000Z",
    updatedAt: "2024-04-03T10:30:00.000Z"
  },
  {
    _id: "prod_089",
    name: "The Outdoor Kitchen Station",
    slug: "outdoor-kitchen-station",
    description: "Take your grilling to the next level with our Outdoor Kitchen Station. This freestanding unit includes a 4-burner propane grill, side burner, refrigerator, and sink. The stainless steel construction resists rust and weather, while the granite-look countertops provide ample prep space. Perfect for the serious outdoor chef.",
    shortDescription: "Complete outdoor kitchen with grill, fridge, sink, and side burner",
    price: 2499.99,
    originalPrice: 3499.99,
    category: "Outdoor",
    subcategory: "Outdoor Kitchens",
    material: "Stainless Steel",
    color: "Silver",
    style: "Modern / Professional",
    dimensions: "72\"W x 24\"D x 36\"H",
    weight: "320 lbs",
    inStock: true,
    stock: 3,
    rating: 4.9,
    numReviews: 28,
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200"
    ],
    variants: [
      { burners: "4 + Side", color: "Silver", price: 2499.99, stock: 3 },
      { burners: "6 + Side", color: "Silver", price: 2999.99, stock: 2 }
    ],
    features: [
      "4-burner propane grill (48,000 BTU)",
      "10,000 BTU side burner",
      "Built-in mini refrigerator",
      "Stainless steel sink with faucet",
      "Granite-look countertops",
      "Propane tank storage"
    ],
    reviews: [
      { 
        _id: "rev_090", 
        user: "GrillMasterGreg", 
        rating: 5, 
        title: "Dream outdoor kitchen", 
        comment: "Expensive but worth it. I use it every weekend. Everything is high quality.", 
        date: "2024-03-28",
        verified: true,
        helpful: 41
      }
    ],
    tags: ["outdoor-kitchen", "grill-station", "propane-grill", "outdoor-cooking", "luxury", "patio"],
    featured: true,
    trending: false,
    bestSeller: false,
    newArrival: true,
    onSale: true,
    createdAt: "2024-03-12T08:00:00.000Z",
    updatedAt: "2024-04-05T10:30:00.000Z"
  },
  {
    _id: "prod_090",
    name: "The Outdoor Storage Deck Box",
    slug: "outdoor-storage-deck-box",
    description: "Keep your outdoor space tidy with our Storage Deck Box. The 120-gallon capacity holds cushions, pool toys, gardening tools, and more. The resin construction is weather-resistant and won't rust or rot. The dual hydraulic pistons keep the lid open safely while you access contents. Seats up to 3 adults.",
    shortDescription: "120-gallon weather-resistant deck box with hydraulic lift lid",
    price: 129.99,
    originalPrice: 179.99,
    category: "Outdoor",
    subcategory: "Storage",
    material: "Resin",
    color: "Dark Brown",
    style: "Functional / Traditional",
    dimensions: "54\"W x 26\"D x 24\"H",
    weight: "32 lbs",
    inStock: true,
    stock: 32,
    rating: 4.7,
    numReviews: 423,
    images: [
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200"
    ],
    variants: [
      { size: "120 Gallon", color: "Dark Brown", price: 129.99, stock: 32 },
      { size: "150 Gallon", color: "Dark Brown", price: 169.99, stock: 20 },
      { size: "120 Gallon", color: "Gray", price: 129.99, stock: 28 },
      { size: "120 Gallon", color: "Black", price: 129.99, stock: 25 }
    ],
    features: [
      "120-gallon storage capacity",
      "Dual hydraulic lift pistons",
      "Weather-resistant resin",
      "Seats up to 3 adults (400 lbs)",
      "Lockable lid (padlock not included)",
      "UV-protected color"
    ],
    reviews: [
      { 
        _id: "rev_091", 
        user: "OrganizedOutdoor", 
        rating: 5, 
        title: "Holds everything", 
        comment: "All my cushions, toys, and tools fit easily. The lid stays up safely.", 
        date: "2024-04-02",
        verified: true,
        helpful: 52
      }
    ],
    tags: ["deck-box", "outdoor-storage", "resin", "weather-resistant", "patio", "organization"],
    featured: false,
    trending: true,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-02-28T08:00:00.000Z",
    updatedAt: "2024-03-31T10:30:00.000Z"
  },
  {
    _id: "prod_091",
    name: "The Inflatable Hot Tub",
    slug: "inflatable-hot-tub",
    description: "Enjoy spa luxury without the permanent installation. Our Inflatable Hot Tub seats up to 6 adults and features 120 air jets for a relaxing massage. The digital control panel adjusts temperature up to 104°F, and the energy-efficient cover retains heat. Sets up in minutes—no tools required.",
    shortDescription: "6-person inflatable hot tub with 120 air jets and digital controls",
    price: 599.99,
    originalPrice: 899.99,
    category: "Outdoor",
    subcategory: "Hot Tubs",
    material: "PVC / Polyester",
    color: "Gray",
    style: "Functional",
    dimensions: "71\"Diameter x 28\"H",
    weight: "78 lbs (empty)",
    inStock: true,
    stock: 10,
    rating: 4.6,
    numReviews: 512,
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200"
    ],
    variants: [
      { size: "6-Person", color: "Gray", price: 599.99, stock: 10 },
      { size: "4-Person", color: "Blue", price: 449.99, stock: 15 },
      { size: "6-Person", color: "Black", price: 649.99, stock: 8 }
    ],
    features: [
      "120 bubble air jets",
      "Heats up to 104°F",
      "Digital control panel",
      "Energy-efficient cover",
      "Built-in water filtration",
      "Includes inflation pump"
    ],
    reviews: [
      { 
        _id: "rev_092", 
        user: "SpaSteve", 
        rating: 5, 
        title: "Better than expected", 
        comment: "We use this almost nightly. Heats up fast and the bubbles are strong. Great value.", 
        date: "2024-04-04",
        verified: true,
        helpful: 89
      }
    ],
    tags: ["hot-tub", "inflatable", "spa", "portable", "backyard", "relaxation"],
    featured: true,
    trending: true,
    bestSeller: false,
    newArrival: true,
    onSale: true,
    createdAt: "2024-03-15T08:00:00.000Z",
    updatedAt: "2024-04-05T10:30:00.000Z"
  },
    {
    _id: "prod_092",
    name: "The Ladder Bookshelf",
    slug: "ladder-bookshelf",
    description: "Add vertical interest to any room with our Ladder Bookshelf. The leaning design features five deep shelves that get progressively wider from top to bottom, creating a stable leaning silhouette. The rustic oak finish and industrial iron frame make it perfect for farmhouse, industrial, or transitional spaces.",
    shortDescription: "Leaning ladder bookshelf with rustic oak shelves and iron frame",
    price: 249.99,
    originalPrice: 349.99,
    category: "Living Room",
    subcategory: "Shelving",
    material: "Oak Veneer / Iron",
    color: "Rustic Oak / Black",
    style: "Industrial / Farmhouse",
    dimensions: "30\"W x 18\"D x 72\"H",
    weight: "38 lbs",
    inStock: true,
    stock: 22,
    rating: 4.8,
    numReviews: 167,
    images: [
      "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=1200",
      "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=1200",
      "https://images.unsplash.com/photo-1585779034823-7e9ac8faec70?w=1200",
      "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=1200"
    ],
    variants: [
      { color: "Rustic Oak/Black", shelves: "5-Tier", price: 249.99, stock: 22 },
      { color: "Walnut/Black", shelves: "5-Tier", price: 269.99, stock: 15 },
      { color: "White/Black", shelves: "5-Tier", price: 229.99, stock: 18 },
      { color: "Rustic Oak/Brass", shelves: "4-Tier", price: 199.99, stock: 20 }
    ],
    features: [
      "Leaning ladder design",
      "5 deep shelves",
      "Rustic oak veneer finish",
      "Industrial iron frame",
      "Anti-tip wall strap included",
      "No assembly required for frame"
    ],
    reviews: [
      { 
        _id: "rev_093", 
        user: "SmallSpaceSaver", 
        rating: 5, 
        title: "Perfect for narrow walls", 
        comment: "Fits perfectly in the corner of our living room. Holds lots of books and decor.", 
        date: "2024-04-01",
        verified: true,
        helpful: 44
      }
    ],
    tags: ["ladder-shelf", "bookshelf", "leaning-shelf", "industrial", "farmhouse", "living-room"],
    featured: false,
    trending: true,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-02-10T08:00:00.000Z",
    updatedAt: "2024-03-28T10:30:00.000Z"
  },
  {
    _id: "prod_093",
    name: "The Geometric Wall Shelf Set (3-Piece)",
    slug: "geometric-wall-shelf-set",
    description: "Create an artistic wall display with our Geometric Wall Shelf Set. The set includes three hexagon-shaped shelves in coordinating sizes that can be arranged in countless configurations. The rich walnut finish and brass hanging hardware make these shelves as decorative as they are functional.",
    shortDescription: "Set of 3 hexagon wall shelves in walnut with brass hardware",
    price: 89.99,
    originalPrice: 139.99,
    category: "Living Room",
    subcategory: "Shelving",
    material: "Walnut / Brass",
    color: "Walnut",
    style: "Modern / Geometric",
    dimensions: "Small: 10\", Medium: 14\", Large: 18\" (width)",
    weight: "8 lbs (set)",
    inStock: true,
    stock: 45,
    rating: 4.9,
    numReviews: 312,
    images: [
      "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=1200",
      "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=1200",
      "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=1200",
      "https://images.unsplash.com/photo-1585779034823-7e9ac8faec70?w=1200"
    ],
    variants: [
      { color: "Walnut", hardware: "Brass", price: 89.99, stock: 45 },
      { color: "White", hardware: "Gold", price: 89.99, stock: 38 },
      { color: "Black", hardware: "Black", price: 79.99, stock: 42 }
    ],
    features: [
      "3 hexagon shelves (3 sizes)",
      "Solid walnut construction",
      "Brass hanging hardware",
      "Hidden mounting system",
      "Easily rearrangeable",
      "Holds up to 15 lbs each"
    ],
    reviews: [
      { 
        _id: "rev_094", 
        user: "GallerWallGina", 
        rating: 5, 
        title: "So many configuration options", 
        comment: "I love that I can rearrange these. They look great with small plants and art prints.", 
        date: "2024-04-03",
        verified: true,
        helpful: 56
      }
    ],
    tags: ["wall-shelf", "hexagon", "geometric", "walnut", "decor", "living-room"],
    featured: true,
    trending: true,
    bestSeller: true,
    newArrival: true,
    onSale: true,
    createdAt: "2024-03-05T08:00:00.000Z",
    updatedAt: "2024-04-04T10:30:00.000Z"
  },
  {
    _id: "prod_094",
    name: "The Industrial Pipe Shelving Unit",
    slug: "industrial-pipe-shelving-unit",
    description: "Transform any wall with our Industrial Pipe Shelving Unit. The customizable system includes four solid pine shelves and black iron pipe brackets that mount directly to wall studs. Each shelf holds up to 50 lbs, making it perfect for books, records, or heavy decor. Mix and match lengths for your space.",
    shortDescription: "DIY industrial pipe shelving system with solid pine shelves",
    price: 199.99,
    originalPrice: 279.99,
    category: "Living Room",
    subcategory: "Shelving",
    material: "Pine / Iron Pipe",
    color: "Natural Pine / Black",
    style: "Industrial / Rustic",
    dimensions: "Customizable (standard: 48\"W x 72\"H)",
    weight: "35 lbs",
    inStock: true,
    stock: 25,
    rating: 4.7,
    numReviews: 128,
    images: [
      "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=1200",
      "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=1200",
      "https://images.unsplash.com/photo-1585779034823-7e9ac8faec70?w=1200",
      "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=1200"
    ],
    variants: [
      { size: "4-Shelf Kit", wood: "Pine", price: 199.99, stock: 25 },
      { size: "3-Shelf Kit", wood: "Pine", price: 149.99, stock: 30 },
      { size: "4-Shelf Kit", wood: "Walnut", price: 249.99, stock: 15 }
    ],
    features: [
      "Customizable pipe configuration",
      "4 solid pine shelves (48\"L each)",
      "Black iron pipe brackets",
      "50 lb weight capacity per shelf",
      "Wall-mount hardware included",
      "DIY installation required"
    ],
    reviews: [
      { 
        _id: "rev_095", 
        user: "DIYDan", 
        rating: 5, 
        title: "Looks amazing in my office", 
        comment: "Took an afternoon to install but totally worth it. Very sturdy and exactly the industrial look I wanted.", 
        date: "2024-03-30",
        verified: true,
        helpful: 38
      }
    ],
    tags: ["pipe-shelf", "industrial", "diy", "wall-shelf", "bookshelf", "living-room"],
    featured: true,
    trending: false,
    bestSeller: false,
    newArrival: false,
    onSale: true,
    createdAt: "2024-02-20T08:00:00.000Z",
    updatedAt: "2024-03-27T10:30:00.000Z"
  },
  {
    _id: "prod_095",
    name: "The Spinning Media Tower",
    slug: "spinning-media-tower",
    description: "Access your media collection from both sides with our Spinning Media Tower. The 360-degree rotating design makes it easy to find movies, games, or vinyl records. Features 6 adjustable shelves and a compact footprint that fits in corners or between furniture. The espresso finish complements any decor.",
    shortDescription: "360-degree rotating media tower with 6 adjustable shelves",
    price: 179.99,
    originalPrice: 249.99,
    category: "Living Room",
    subcategory: "Shelving",
    material: "Laminate / MDF",
    color: "Espresso",
    style: "Functional / Traditional",
    dimensions: "16\"W x 16\"D x 60\"H",
    weight: "42 lbs",
    inStock: true,
    stock: 18,
    rating: 4.8,
    numReviews: 94,
    images: [
      "https://images.unsplash.com/photo-1585779034823-7e9ac8faec70?w=1200",
      "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=1200",
      "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=1200",
      "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=1200"
    ],
    variants: [
      { color: "Espresso", shelves: "6 Adjustable", price: 179.99, stock: 18 },
      { color: "White", shelves: "6 Adjustable", price: 179.99, stock: 15 },
      { color: "Walnut", shelves: "6 Adjustable", price: 199.99, stock: 12 }
    ],
    features: [
      "360-degree rotating design",
      "6 adjustable shelves",
      "Compact 16-inch footprint",
      "Smooth ball-bearing rotation",
      "Holds 400+ DVDs or 200+ books",
      "Floor protectors included"
    ],
    reviews: [
      { 
        _id: "rev_096", 
        user: "GamerGuy", 
        rating: 5, 
        title: "Space-saving genius", 
        comment: "Fits in the corner and holds my entire game collection. Love that it spins.", 
        date: "2024-04-02",
        verified: true,
        helpful: 34
      }
    ],
    tags: ["media-tower", "rotating", "space-saving", "dvd-storage", "game-storage", "living-room"],
    featured: false,
    trending: true,
    bestSeller: false,
    newArrival: true,
    onSale: true,
    createdAt: "2024-03-10T08:00:00.000Z",
    updatedAt: "2024-04-01T10:30:00.000Z"
  },
  {
    _id: "prod_096",
    name: "The Modular Cube Storage System",
    slug: "modular-cube-storage-system",
    description: "Build the perfect storage solution with our Modular Cube Storage System. Each 13-inch cube can be configured vertically or horizontally, and accessories like drawers, doors, and fabric bins let you customize the look. The durable laminate finish resists scratches and wipes clean easily.",
    shortDescription: "Customizable cube storage system with accessory options",
    price: 79.99,
    originalPrice: 109.99,
    category: "Living Room",
    subcategory: "Shelving",
    material: "Laminate / MDF",
    color: "White",
    style: "Modern / Modular",
    dimensions: "13\"W x 13\"D x 13\"H (per cube)",
    weight: "22 lbs (2-cube unit)",
    inStock: true,
    stock: 65,
    rating: 4.8,
    numReviews: 245,
    images: [
      "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=1200",
      "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=1200",
      "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=1200",
      "https://images.unsplash.com/photo-1585779034823-7e9ac8faec70?w=1200"
    ],
    variants: [
      { size: "2-Cube", color: "White", price: 79.99, stock: 65 },
      { size: "4-Cube", color: "White", price: 129.99, stock: 50 },
      { size: "6-Cube", color: "White", price: 179.99, stock: 40 },
      { size: "2-Cube", color: "Walnut", price: 89.99, stock: 35 }
    ],
    features: [
      "Modular cube design",
      "Available accessories: drawers, doors, bins",
      "Scratch-resistant laminate",
      "Assembles in minutes",
      "Can be wall-mounted",
      "Vertical or horizontal configuration"
    ],
    reviews: [
      { 
        _id: "rev_097", 
        user: "OrganizerOlivia", 
        rating: 5, 
        title: "So versatile", 
        comment: "I bought 3 two-cube units and arranged them in different ways. Love the accessory options.", 
        date: "2024-04-04",
        verified: true,
        helpful: 61
      }
    ],
    tags: ["cube-storage", "modular", "shelving-unit", "organization", "living-room", "storage"],
    featured: true,
    trending: true,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-02-25T08:00:00.000Z",
    updatedAt: "2024-03-29T10:30:00.000Z"
  },
  {
    _id: "prod_097",
    name: "The Corner Display Shelf",
    slug: "corner-display-shelf",
    description: "Utilize wasted corner space with our Corner Display Shelf. The curved design fits snugly into any 90-degree corner, creating a graceful display for photos, plants, and collectibles. The five tempered glass shelves are illuminated by integrated LED lights (battery operated). The brushed nickel frame completes the elegant look.",
    shortDescription: "5-tier curved corner shelf with glass shelves and LED lighting",
    price: 149.99,
    originalPrice: 199.99,
    category: "Living Room",
    subcategory: "Shelving",
    material: "Tempered Glass / Nickel",
    color: "Brushed Nickel / Clear",
    style: "Traditional / Glam",
    dimensions: "24\"W x 24\"D x 70\"H",
    weight: "28 lbs",
    inStock: true,
    stock: 20,
    rating: 4.7,
    numReviews: 88,
    images: [
      "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=1200",
      "https://images.unsplash.com/photo-1585779034823-7e9ac8faec70?w=1200",
      "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=1200",
      "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=1200"
    ],
    variants: [
      { color: "Brushed Nickel", glass: "Clear", price: 149.99, stock: 20 },
      { color: "Gold", glass: "Clear", price: 169.99, stock: 12 },
      { color: "Black", glass: "Smoked", price: 159.99, stock: 15 }
    ],
    features: [
      "Curved corner design",
      "5 tempered glass shelves",
      "Integrated LED lights (battery)",
      "Brushed nickel finish",
      "No assembly required",
      "15 lb capacity per shelf"
    ],
    reviews: [
      { 
        _id: "rev_098", 
        user: "CornerQueen", 
        rating: 5, 
        title: "Perfect for dead space", 
        comment: "That awkward corner finally has purpose. The LED lights make my collectibles pop.", 
        date: "2024-03-28",
        verified: true,
        helpful: 33
      }
    ],
    tags: ["corner-shelf", "glass-shelf", "display-shelf", "LED", "space-saving", "living-room"],
    featured: false,
    trending: false,
    bestSeller: false,
    newArrival: true,
    onSale: true,
    createdAt: "2024-03-12T08:00:00.000Z",
    updatedAt: "2024-04-03T10:30:00.000Z"
  },
  {
    _id: "prod_098",
    name: "The Floating Bookshelf Invisible Shelf",
    slug: "floating-bookshelf-invisible",
    description: "Create the illusion of floating books with our Invisible Bookshelf. The L-shaped design hides behind your book, making it appear to float magically on the wall. Each shelf holds up to 15 lbs and installs with two hidden screws. Perfect for creating dramatic and minimalist book displays.",
    shortDescription: "Invisible floating bookshelf that creates magical book displays",
    price: 24.99,
    originalPrice: 39.99,
    category: "Living Room",
    subcategory: "Shelving",
    material: "Steel",
    color: "White",
    style: "Minimalist / Modern",
    dimensions: "5\"W x 6\"D x 2\"H",
    weight: "1 lb each",
    inStock: true,
    stock: 200,
    rating: 4.8,
    numReviews: 1567,
    images: [
      "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=1200",
      "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=1200",
      "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=1200",
      "https://images.unsplash.com/photo-1585779034823-7e9ac8faec70?w=1200"
    ],
    variants: [
      { color: "White", pack: "Single", price: 24.99, stock: 200 },
      { color: "Black", pack: "Single", price: 24.99, stock: 180 },
      { color: "White", pack: "Set of 3", price: 59.99, stock: 120 },
      { color: "Black", pack: "Set of 6", price: 109.99, stock: 80 }
    ],
    features: [
      "Invisible L-shaped design",
      "15 lb weight capacity",
      "Easy 2-screw installation",
      "Works with most book sizes",
      "Mounting hardware included",
      "Creates floating illusion"
    ],
    reviews: [
      { 
        _id: "rev_099", 
        user: "MagicMike", 
        rating: 5, 
        title: "People can't figure it out", 
        comment: "Everyone who visits asks how my books are floating. So simple and so cool.", 
        date: "2024-04-05",
        verified: true,
        helpful: 84
      }
    ],
    tags: ["invisible-shelf", "floating-bookshelf", "minimalist", "wall-shelf", "book-display", "magic"],
    featured: true,
    trending: true,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-01-15T08:00:00.000Z",
    updatedAt: "2024-03-25T10:30:00.000Z"
  },
  {
    _id: "prod_099",
    name: "The Ladder Bookcase with Drawers",
    slug: "ladder-bookcase-with-drawers",
    description: "Combine open display with hidden storage in our Ladder Bookcase with Drawers. The leaning ladder design features four open shelves and two fabric drawers at the base. The natural wood finish and black iron frame fit perfectly in farmhouse, boho, or industrial spaces. The drawers are perfect for hiding clutter.",
    shortDescription: "Leaning ladder bookcase with 2 fabric drawers and 4 open shelves",
    price: 179.99,
    originalPrice: 249.99,
    category: "Living Room",
    subcategory: "Shelving",
    material: "Pine / Iron / Fabric",
    color: "Natural / Black",
    style: "Farmhouse / Industrial",
    dimensions: "30\"W x 16\"D x 66\"H",
    weight: "32 lbs",
    inStock: true,
    stock: 16,
    rating: 4.7,
    numReviews: 112,
    images: [
      "https://images.unsplash.com/photo-1585779034823-7e9ac8faec70?w=1200",
      "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=1200",
      "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=1200",
      "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=1200"
    ],
    variants: [
      { color: "Natural/Black", drawers: "Gray Fabric", price: 179.99, stock: 16 },
      { color: "White/Black", drawers: "Navy Fabric", price: 189.99, stock: 12 },
      { color: "Walnut/Brass", drawers: "Beige Fabric", price: 199.99, stock: 10 }
    ],
    features: [
      "Leaning ladder design",
      "4 open display shelves",
      "2 fabric pull-out drawers",
      "Industrial iron frame",
      "Anti-tip wall strap",
      "Drawers hold 15 lbs each"
    ],
    reviews: [
      { 
        _id: "rev_100", 
        user: "FarmhouseFan", 
        rating: 5, 
        title: "Best of both worlds", 
        comment: "Open shelves for pretty things, drawers for the mess. Perfect for our family room.", 
        date: "2024-03-31",
        verified: true,
        helpful: 41
      }
    ],
    tags: ["ladder-shelf", "bookcase", "drawer-storage", "farmhouse", "leaning-shelf", "living-room"],
    featured: false,
    trending: true,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-02-28T08:00:00.000Z",
    updatedAt: "2024-03-30T10:30:00.000Z"
  },
  {
    _id: "prod_100",
    name: "The Glass Curio Cabinet",
    slug: "glass-curio-cabinet",
    description: "Showcase your treasured collectibles in our Glass Curio Cabinet. The tall, narrow design features five adjustable tempered glass shelves and an interior mirror back that reflects light and doubles the visual space. The locking glass door keeps valuables secure while allowing full visibility.",
    shortDescription: "Tall glass curio cabinet with mirrored back and locking door",
    price: 299.99,
    originalPrice: 399.99,
    category: "Living Room",
    subcategory: "Shelving",
    material: "Tempered Glass / MDF",
    color: "Black / Clear",
    style: "Traditional / Display",
    dimensions: "18\"W x 14\"D x 66\"H",
    weight: "55 lbs",
    inStock: true,
    stock: 12,
    rating: 4.8,
    numReviews: 76,
    images: [
      "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=1200",
      "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=1200",
      "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=1200",
      "https://images.unsplash.com/photo-1585779034823-7e9ac8faec70?w=1200"
    ],
    variants: [
      { color: "Black", glass: "Clear", price: 299.99, stock: 12 },
      { color: "White", glass: "Clear", price: 299.99, stock: 10 },
      { color: "Espresso", glass: "Clear", price: 319.99, stock: 8 }
    ],
    features: [
      "5 adjustable tempered glass shelves",
      "Interior mirrored back",
      "Locking glass door (keys included)",
      "Interior LED light strip (battery)",
      "Compact footprint",
      "Pre-assembled frame"
    ],
    reviews: [
      { 
        _id: "rev_101", 
        user: "CollectorChris", 
        rating: 5, 
        title: "Makes my collection shine", 
        comment: "The mirror back and light make everything look museum-quality. Very secure too.", 
        date: "2024-04-02",
        verified: true,
        helpful: 47
      }
    ],
    tags: ["curio-cabinet", "display-cabinet", "glass-cabinet", "collectibles", "mirror-back", "living-room"],
    featured: true,
    trending: false,
    bestSeller: false,
    newArrival: true,
    onSale: true,
    createdAt: "2024-03-15T08:00:00.000Z",
    updatedAt: "2024-04-05T10:30:00.000Z"
  },
  {
    _id: "prod_101",
    name: "Serenity Memory Foam Mattress",
    slug: "serenity-memory-foam-mattress",
    description: "Experience the ultimate sleep with our Serenity Memory Foam Mattress. Featuring a 5-layer construction including cooling gel memory foam, responsive transition foam, and a supportive base layer. The breathable organic cotton cover is removable and washable. Designed to provide pressure relief and spinal alignment for all sleep positions.",
    shortDescription: "5-layer cooling gel memory foam mattress with organic cover",
    price: 999.99,
    originalPrice: 1399.99,
    category: "Bedroom",
    subcategory: "Mattresses",
    material: "Memory Foam",
    color: "White",
    style: "Modern",
    dimensions: "Queen: 60\"W x 80\"L x 12\"H",
    weight: "85 lbs",
    inStock: true,
    stock: 30,
    rating: 4.8,
    numReviews: 427,
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200",
      "https://images.unsplash.com/photo-1505692952047-1a78307da8f2?w=1200",
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=1200",
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=1200"
    ],
    variants: [
      { size: "Twin", price: 699.99, stock: 20 },
      { size: "Full", price: 849.99, stock: 25 },
      { size: "Queen", price: 999.99, stock: 30 },
      { size: "King", price: 1299.99, stock: 15 },
      { size: "Cal King", price: 1299.99, stock: 12 }
    ],
    features: [
      "5-layer foam construction",
      "Cooling gel memory foam",
      "Organic cotton cover",
      "Removable & washable cover",
      "Pressure-relieving design",
      "100-night sleep trial"
    ],
    reviews: [
      { 
        _id: "rev_013", 
        user: "Michael S.", 
        rating: 5, 
        title: "Best sleep in decades",
        comment: "I've struggled with back pain for years. After sleeping on this mattress for just one week, my morning back pain is gone. The cooling gel really works - no more night sweats!", 
        date: "2024-03-20",
        verified: true,
        helpful: 89
      },
      { 
        _id: "rev_014", 
        user: "Lisa M.", 
        rating: 5, 
        title: "Perfect medium-firm feel",
        comment: "It's hard to find a mattress that's not too firm or too soft. This one is perfect - supportive yet plush. The organic cover is so soft and breathable.", 
        date: "2024-03-15",
        verified: true,
        helpful: 62
      }
    ],
    tags: ["mattress", "memory-foam", "cooling", "organic", "bedroom", "sleep"],
    featured: false,
    trending: true,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-01-01T06:00:00.000Z",
    updatedAt: "2024-03-20T08:00:00.000Z"
  },
  {
    _id: "prod_102",
    name: "Industrial Bar Cart",
    slug: "industrial-bar-cart",
    description: "Entertain in style with our Industrial Bar Cart. Featuring a solid mango wood top and shelves paired with a black powder-coated steel frame. The caster wheels make it easy to move from room to room, while the built-in wine rack and stemware holders keep everything organized for your next gathering.",
    shortDescription: "Rolling bar cart with wood shelves and wine storage",
    price: 449.99,
    originalPrice: 599.99,
    category: "Dining Room",
    subcategory: "Bar Carts",
    material: "Mango Wood & Steel",
    color: "Rustic Brown/Black",
    style: "Industrial",
    dimensions: "36\"W x 18\"D x 36\"H",
    weight: "48 lbs",
    inStock: true,
    stock: 18,
    rating: 4.4,
    numReviews: 56,
    images: [
      "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=1200",
      "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=1200",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200",
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1200"
    ],
    variants: [
      { color: "Rustic Brown/Black", material: "Mango Wood & Steel", price: 449.99, stock: 18 },
      { color: "Natural/Gold", material: "Acacia & Brass", price: 549.99, stock: 8 },
      { color: "Matte Black", material: "Steel & Glass", price: 399.99, stock: 15 }
    ],
    features: [
      "Solid mango wood shelves",
      "Built-in wine rack (holds 8 bottles)",
      "Stemware holders (8 glasses)",
      "Locking caster wheels",
      "Powder-coated steel frame",
      "Easy assembly"
    ],
    reviews: [
      { 
        _id: "rev_015", 
        user: "Catherine D.", 
        rating: 4, 
        title: "Stylish and functional",
        comment: "Love this bar cart! It looks great in our dining room and is perfect for entertaining. The wheels make it easy to move around. Only wish the wine rack held a few more bottles.", 
        date: "2024-02-25",
        verified: true,
        helpful: 18
      }
    ],
    tags: ["bar-cart", "industrial", "entertaining", "dining-room", "wine"],
    featured: false,
    trending: false,
    bestSeller: false,
    newArrival: true,
    onSale: true,
    createdAt: "2024-02-05T10:00:00.000Z",
    updatedAt: "2024-03-10T12:00:00.000Z"
  },
    {
    _id: "prod_104",
    name: "The Macrame Wall Hanging",
    slug: "macrame-wall-hanging",
    description: "Add bohemian texture to any wall with our handcrafted Macrame Wall Hanging. Woven from 100% natural cotton cord by skilled artisans, this 36-inch piece features intricate knot patterns and cascading fringe. The wooden dowel and brass hanging hardware are included for easy installation.",
    shortDescription: "Handcrafted cotton macrame wall hanging with wooden dowel",
    price: 79.99,
    originalPrice: 119.99,
    category: "Decor",
    subcategory: "Wall Art",
    material: "Cotton / Wood",
    color: "Natural White",
    style: "Bohemian / Scandinavian",
    dimensions: "36\"W x 42\"H (including fringe)",
    weight: "3 lbs",
    inStock: true,
    stock: 25,
    rating: 4.9,
    numReviews: 178,
    images: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200",
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1200",
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=1200",
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=1200"
    ],
    variants: [
      { size: "36\"", color: "Natural White", price: 79.99, stock: 25 },
      { size: "48\"", color: "Natural White", price: 109.99, stock: 15 },
      { size: "36\"", color: "Cream/Beige", price: 89.99, stock: 20 }
    ],
    features: [
      "Handcrafted by artisans",
      "100% natural cotton cord",
      "Intricate knot patterns",
      "Cascading fringe detail",
      "Solid wood hanging dowel",
      "Brass hanging hardware included"
    ],
    reviews: [
      { 
        _id: "rev_102", 
        user: "BohoBabe", 
        rating: 5, 
        title: "Stunning craftsmanship", 
        comment: "So much detail! This piece completely transformed my bedroom wall. Very well made.", 
        date: "2024-04-03",
        verified: true,
        helpful: 42
      }
    ],
    tags: ["macrame", "wall-hanging", "boho", "cotton", "handmade", "decor"],
    featured: true,
    trending: true,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-02-15T08:00:00.000Z",
    updatedAt: "2024-03-28T10:30:00.000Z"
  },
  {
    _id: "prod_105",
    name: "The Abstract Canvas Set (3-Piece)",
    slug: "abstract-canvas-set",
    description: "Bring contemporary energy to your walls with our Abstract Canvas Set. This triptych of hand-painted canvases features sweeping brushstrokes in muted earth tones of terracotta, sage, and ochre. Each canvas is stretched on a solid pine frame and arrives ready to hang.",
    shortDescription: "3-piece hand-painted abstract canvas art set in earth tones",
    price: 249.99,
    originalPrice: 349.99,
    category: "Decor",
    subcategory: "Wall Art",
    material: "Canvas / Pine",
    color: "Terracotta / Sage / Ochre",
    style: "Abstract / Contemporary",
    dimensions: "Overall: 60\"W x 30\"H (each: 20\"W x 30\"H)",
    weight: "12 lbs (set)",
    inStock: true,
    stock: 18,
    rating: 4.8,
    numReviews: 92,
    images: [
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=1200",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200",
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1200",
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=1200"
    ],
    variants: [
      { color: "Terracotta/Sage/Ochre", size: "20\"x30\" each", price: 249.99, stock: 18 },
      { color: "Navy/Blush/Gold", size: "20\"x30\" each", price: 269.99, stock: 12 },
      { color: "Monochrome Gray", size: "24\"x36\" each", price: 299.99, stock: 10 }
    ],
    features: [
      "Hand-painted abstract design",
      "3-piece triptych format",
      "Stretched on solid pine frames",
      "Sawtooth hangers included",
      "Ready to hang",
      "Protective UV coating"
    ],
    reviews: [
      { 
        _id: "rev_103", 
        user: "ArtLoverAnna", 
        rating: 5, 
        title: "Looks so expensive", 
        comment: "Quality is amazing for the price. The colors are exactly as pictured and it really elevated our living room.", 
        date: "2024-03-30",
        verified: true,
        helpful: 38
      }
    ],
    tags: ["canvas-art", "abstract", "wall-art", "triptych", "contemporary", "living-room"],
    featured: true,
    trending: true,
    bestSeller: false,
    newArrival: true,
    onSale: true,
    createdAt: "2024-03-01T08:00:00.000Z",
    updatedAt: "2024-04-01T10:30:00.000Z"
  },
  {
    _id: "prod_106",
    name: "The Moroccan Wool Rug",
    slug: "moroccan-wool-rug",
    description: "Bring timeless Moroccan craftsmanship to your floor with our handwoven Wool Rug. Each rug is hand-knotted by Berber artisans using undyed, natural sheep's wool in a classic diamond pattern. The plush 0.75-inch pile feels luxurious underfoot and adds warmth to any room.",
    shortDescription: "Hand-knotted Moroccan Berber rug in natural undyed wool",
    price: 399.99,
    originalPrice: 599.99,
    category: "Decor",
    subcategory: "Rugs",
    material: "Natural Sheep's Wool",
    color: "Cream / Brown",
    style: "Bohemian / Traditional",
    dimensions: "5' x 8'",
    weight: "28 lbs",
    inStock: true,
    stock: 14,
    rating: 4.9,
    numReviews: 156,
    images: [
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=1200",
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=1200",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200",
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1200"
    ],
    variants: [
      { size: "5' x 8'", color: "Cream/Brown", price: 399.99, stock: 14 },
      { size: "6' x 9'", color: "Cream/Brown", price: 549.99, stock: 10 },
      { size: "8' x 10'", color: "Cream/Brown", price: 799.99, stock: 6 },
      { size: "5' x 8'", color: "Gray/Charcoal", price: 429.99, stock: 8 }
    ],
    features: [
      "Hand-knotted by Berber artisans",
      "100% natural undyed sheep's wool",
      "Classic diamond pattern",
      "0.75-inch plush pile",
      "Fair trade certified",
      "Non-slip backing recommended"
    ],
    reviews: [
      { 
        _id: "rev_104", 
        user: "RugCollector", 
        rating: 5, 
        title: "Heirloom quality", 
        comment: "This rug is stunning. The wool is so soft and the craftsmanship is incredible. Worth every penny.", 
        date: "2024-04-04",
        verified: true,
        helpful: 56
      }
    ],
    tags: ["moroccan-rug", "berber", "wool-rug", "handknotted", "boho", "living-room"],
    featured: true,
    trending: true,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-02-10T08:00:00.000Z",
    updatedAt: "2024-03-27T10:30:00.000Z"
  },
  {
    _id: "prod_107",
    name: "The Terrazzo Decorative Trays (Set of 3)",
    slug: "terrazzo-decorative-trays",
    description: "Organize and style with our Terrazzo Decorative Trays. Each tray is hand-cast from Jesmonite in a speckled terrazzo pattern, creating a unique marbled look. The set includes nesting sizes perfect for coffee tables, dressers, or vanities. Use them to corral jewelry, catchall items, or display candles.",
    shortDescription: "Set of 3 hand-cast terrazzo nesting trays",
    price: 49.99,
    originalPrice: 69.99,
    category: "Decor",
    subcategory: "Decorative Objects",
    material: "Jesmonite",
    color: "Speckled Cream",
    style: "Modern / Minimalist",
    dimensions: "Large: 12\"x8\", Medium: 10\"x6\", Small: 8\"x5\"",
    weight: "4 lbs (set)",
    inStock: true,
    stock: 45,
    rating: 4.9,
    numReviews: 234,
    images: [
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1200",
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=1200",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200",
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=1200"
    ],
    variants: [
      { color: "Speckled Cream", pattern: "Terrazzo", price: 49.99, stock: 45 },
      { color: "Speckled Gray", pattern: "Terrazzo", price: 49.99, stock: 38 },
      { color: "Speckled Blush", pattern: "Terrazzo", price: 54.99, stock: 30 }
    ],
    features: [
      "Hand-cast Jesmonite construction",
      "Unique terrazzo speckle pattern",
      "Nesting design for storage",
      "Non-slip felt bottom",
      "Water-resistant finish",
      "Eco-friendly materials"
    ],
    reviews: [
      { 
        _id: "rev_105", 
        user: "TrayQueen", 
        rating: 5, 
        title: "So chic", 
        comment: "I use these everywhere — coffee table, nightstand, bathroom. They look so high-end.", 
        date: "2024-04-02",
        verified: true,
        helpful: 47
      }
    ],
    tags: ["decorative-trays", "terrazzo", "nesting", "modern", "organization", "living-room"],
    featured: false,
    trending: true,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-03-05T08:00:00.000Z",
    updatedAt: "2024-04-01T10:30:00.000Z"
  },
  {
    _id: "prod_108",
    name: "The Fluted Ceramic Vase Set",
    slug: "fluted-ceramic-vase-set",
    description: "Add sculptural elegance with our Fluted Ceramic Vase Set. Each vase features a ribbed, fluted texture and a matte reactive glaze that creates subtle color variations. The set includes three graduating sizes perfect for dried pampas grass, fresh flowers, or as standalone art objects on shelves and mantels.",
    shortDescription: "Set of 3 fluted ceramic vases with matte reactive glaze",
    price: 79.99,
    originalPrice: 119.99,
    category: "Decor",
    subcategory: "Vases",
    material: "Ceramic",
    color: "Matte Taupe",
    style: "Contemporary / Organic",
    dimensions: "Large: 10\"H, Medium: 8\"H, Small: 6\"H",
    weight: "6 lbs (set)",
    inStock: true,
    stock: 32,
    rating: 4.8,
    numReviews: 145,
    images: [
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=1200",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200",
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=1200",
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1200"
    ],
    variants: [
      { color: "Matte Taupe", finish: "Reactive Glaze", price: 79.99, stock: 32 },
      { color: "Sage Green", finish: "Reactive Glaze", price: 84.99, stock: 25 },
      { color: "Terracotta", finish: "Matte", price: 79.99, stock: 28 },
      { color: "Matte Black", finish: "Reactive Glaze", price: 89.99, stock: 20 }
    ],
    features: [
      "Fluted ribbed texture",
      "Matte reactive glaze finish",
      "Each piece is unique",
      "Watertight interior",
      "Graduating sizes",
      "Hand-finished"
    ],
    reviews: [
      { 
        _id: "rev_106", 
        user: "VaseCollector", 
        rating: 5, 
        title: "Beautiful texture", 
        comment: "The ribbed detail is so elegant. Look amazing with dried eucalyptus.", 
        date: "2024-03-31",
        verified: true,
        helpful: 34
      }
    ],
    tags: ["vases", "ceramic", "fluted", "set", "decor", "shelving"],
    featured: true,
    trending: true,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-02-20T08:00:00.000Z",
    updatedAt: "2024-03-29T10:30:00.000Z"
  },
  {
    _id: "prod_109",
    name: "The Faux Potted Olive Tree",
    slug: "faux-potted-olive-tree",
    description: "Bring Mediterranean charm indoors with our Faux Potted Olive Tree. Standing 5 feet tall, this artificial tree features lifelike silkscreened leaves and real wood trunk segments. The tree comes potted in a woven basket and requires zero maintenance — no watering, no sunlight, no dropped leaves.",
    shortDescription: "5ft lifelike faux olive tree with woven basket pot",
    price: 149.99,
    originalPrice: 199.99,
    category: "Decor",
    subcategory: "Artificial Plants",
    material: "Silk / Plastic / Wood",
    color: "Green / Brown",
    style: "Mediterranean / Modern",
    dimensions: "60\"H x 32\"W (canopy)",
    weight: "15 lbs",
    inStock: true,
    stock: 22,
    rating: 4.7,
    numReviews: 312,
    images: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200",
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=1200",
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=1200",
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1200"
    ],
    variants: [
      { size: "5ft", pot: "Woven Basket", price: 149.99, stock: 22 },
      { size: "6ft", pot: "Woven Basket", price: 199.99, stock: 12 },
      { size: "5ft", pot: "Ceramic White", price: 159.99, stock: 15 }
    ],
    features: [
      "Lifelike silkscreened leaves",
      "Real wood trunk segments",
      "No maintenance required",
      "Woven basket included",
      "Sturdy weighted base",
      "Bendable branches for shaping"
    ],
    reviews: [
      { 
        _id: "rev_107", 
        user: "PlantKillerKaren", 
        rating: 5, 
        title: "Fooled my mother-in-law", 
        comment: "She tried to water it! Looks incredibly real. Perfect for my dark living room.", 
        date: "2024-04-04",
        verified: true,
        helpful: 63
      }
    ],
    tags: ["faux-tree", "olive-tree", "artificial-plant", "low-maintenance", "living-room", "decor"],
    featured: true,
    trending: true,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-02-01T08:00:00.000Z",
    updatedAt: "2024-03-25T10:30:00.000Z"
  },
  {
    _id: "prod_110",
    name: "The LED Flameless Candles (Set of 3)",
    slug: "led-flameless-candles-set",
    description: "Ambiance without the fire hazard. Our LED Flameless Candles feature real wax exteriors and flickering bulbs that mimic actual flames. Each candle operates on a timer (5 hours on, 19 hours off) and includes a remote control for dimming and color temperature adjustment. Batteries included.",
    shortDescription: "Set of 3 real wax flameless candles with remote and timer",
    price: 39.99,
    originalPrice: 59.99,
    category: "Decor",
    subcategory: "Candles",
    material: "Real Wax",
    color: "Ivory",
    style: "Traditional / Modern",
    dimensions: "4\"H, 6\"H, 8\"H",
    weight: "3 lbs",
    inStock: true,
    stock: 85,
    rating: 4.9,
    numReviews: 892,
    images: [
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=1200",
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1200",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200",
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=1200"
    ],
    variants: [
      { size: "4/6/8\"", color: "Ivory", price: 39.99, stock: 85 },
      { size: "6/8/10\"", color: "Ivory", price: 49.99, stock: 60 },
      { size: "4/6/8\"", color: "Warm White", price: 39.99, stock: 70 }
    ],
    features: [
      "Real wax exterior",
      "Flickering flame effect",
      "Timer function (5H on, 19H off)",
      "Remote control included",
      "Dimmable brightness",
      "Adjustable color temp (2700K-3000K)"
    ],
    reviews: [
      { 
        _id: "rev_108", 
        user: "SafetyFirstSophie", 
        rating: 5, 
        title: "Perfect for rental apartments", 
        comment: "No fire worries and they look completely real. The remote is a nice touch.", 
        date: "2024-04-03",
        verified: true,
        helpful: 71
      }
    ],
    tags: ["flameless-candles", "led-candles", "timer", "remote-control", "ambiance", "decor"],
    featured: false,
    trending: true,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-03-10T08:00:00.000Z",
    updatedAt: "2024-04-02T10:30:00.000Z"
  },
  {
    _id: "prod_111",
    name: "The Gold Geometric Wall Mirror",
    slug: "gold-geometric-wall-mirror",
    description: "Reflect light and style with our Gold Geometric Wall Mirror. The irregular arched shape features a brushed gold leaf frame with faceted edges that catch light from every angle. Perfect for entryways, above consoles, or as a bathroom statement piece.",
    shortDescription: "Irregular arched gold leaf geometric wall mirror",
    price: 179.99,
    originalPrice: 249.99,
    category: "Decor",
    subcategory: "Mirrors",
    material: "Glass / Gold Leaf",
    color: "Gold",
    style: "Art Deco / Glam",
    dimensions: "32\"W x 48\"H",
    weight: "18 lbs",
    inStock: true,
    stock: 12,
    rating: 4.8,
    numReviews: 67,
    images: [
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=1200",
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1200",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200",
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=1200"
    ],
    variants: [
      { shape: "Arched", finish: "Gold Leaf", price: 179.99, stock: 12 },
      { shape: "Arched", finish: "Silver Leaf", price: 179.99, stock: 10 },
      { shape: "Hexagon", finish: "Gold Leaf", price: 149.99, stock: 15 }
    ],
    features: [
      "Irregular arched shape",
      "Hand-applied gold leaf finish",
      "Faceted edging detail",
      "Beveled mirror glass",
      "D-rings for hanging",
      "Tempered safety glass"
    ],
    reviews: [
      { 
        _id: "rev_109", 
        user: "GlamGina", 
        rating: 5, 
        title: "Stunning statement piece", 
        comment: "This mirror completely transformed my entryway. The gold leaf is so rich.", 
        date: "2024-04-01",
        verified: true,
        helpful: 44
      }
    ],
    tags: ["wall-mirror", "gold-leaf", "arched", "art-deco", "glam", "decor"],
    featured: true,
    trending: true,
    bestSeller: false,
    newArrival: true,
    onSale: true,
    createdAt: "2024-03-12T08:00:00.000Z",
    updatedAt: "2024-04-05T10:30:00.000Z"
  },
  {
    _id: "prod_112",
    name: "The Velvet Throw Pillow Set (Set of 4)",
    slug: "velvet-throw-pillow-set",
    description: "Add instant luxury and comfort with our Velvet Throw Pillow Set. Each 18x18 pillow features a plush velvet cover, hidden zipper, and a premium down-alternative insert. The set includes two matching colors and two complementary patterns, curated to work harmoniously together on sofas or beds.",
    shortDescription: "Set of 4 velvet throw pillows with down-alternative inserts",
    price: 89.99,
    originalPrice: 149.99,
    category: "Decor",
    subcategory: "Throw Pillows",
    material: "Velvet / Polyester",
    color: "Mixed (Sage & Cream)",
    style: "Modern / Luxe",
    dimensions: "18\" x 18\" each",
    weight: "8 lbs (set)",
    inStock: true,
    stock: 40,
    rating: 4.8,
    numReviews: 234,
    images: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200",
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=1200",
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1200",
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=1200"
    ],
    variants: [
      { color: "Sage & Cream", pattern: "Mixed", price: 89.99, stock: 40 },
      { color: "Blush & Gray", pattern: "Mixed", price: 89.99, stock: 35 },
      { color: "Navy & Gold", pattern: "Mixed", price: 99.99, stock: 28 },
      { color: "Terracotta & Cream", pattern: "Mixed", price: 89.99, stock: 30 }
    ],
    features: [
      "4 pillows included",
      "Premium velvet fabric",
      "Hidden zipper closures",
      "Down-alternative inserts",
      "Machine washable covers",
      "Curated color combinations"
    ],
    reviews: [
      { 
        _id: "rev_110", 
        user: "PillowPerfectionist", 
        rating: 5, 
        title: "Finally, matching pillows done right", 
        comment: "Love that they coordinate without being matchy-matchy. Super soft velvet.", 
        date: "2024-04-04",
        verified: true,
        helpful: 52
      }
    ],
    tags: ["throw-pillows", "velvet", "set", "decor", "couch", "living-room"],
    featured: true,
    trending: true,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-02-18T08:00:00.000Z",
    updatedAt: "2024-03-30T10:30:00.000Z"
  }
];

export const categories = [
  {
    _id: "cat_001",
    name: "Living Room",
    slug: "living-room",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600",
    description: "Create your perfect living space with our curated collection",
    itemCount: 245,
    featured: true,
    icon: "🛋️"
  },
  {
    _id: "cat_002",
    name: "Bedroom",
    slug: "bedroom",
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600",
    description: "Transform your bedroom into a peaceful retreat",
    itemCount: 189,
    featured: true,
    icon: "🛏️"
  },
  {
    _id: "cat_003",
    name: "Dining Room",
    slug: "dining-room",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600",
    description: "Gather around beautiful dining furniture",
    itemCount: 156,
    featured: true,
    icon: "🍽️"
  },
  {
    _id: "cat_004",
    name: "Office",
    slug: "office",
    image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=600",
    description: "Create a productive and stylish workspace",
    itemCount: 134,
    featured: true,
    icon: "💼"
  },
  {
    _id: "cat_005",
    name: "Outdoor",
    slug: "outdoor",
    image: "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=600",
    description: "Beautiful outdoor living starts here",
    itemCount: 98,
    featured: true,
    icon: "🌿"
  },
  {
    _id: "cat_006",
    name: "Lighting",
    slug: "lighting",
    image: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=600",
    description: "Illuminate your space with style",
    itemCount: 167,
    featured: true,
    icon: "💡"
  },
  {
    _id: "cat_007",
    name: "Decor",
    slug: "decor",
    image: "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=600",
    description: "Add personality with decorative accents",
    itemCount: 312,
    featured: false,
    icon: "🎨"
  },
  {
    _id: "cat_008",
    name: "Storage",
    slug: "storage",
    image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600",
    description: "Smart storage solutions for every room",
    itemCount: 178,
    featured: false,
    icon: "📦"
  }
];

export const testimonials = [
  {
    _id: "test_001",
    name: "Alexandra Mitchell",
    role: "Interior Designer",
    location: "New York, NY",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    content: "Furniqo has become my go-to source for client projects. The quality and design aesthetic are consistently outstanding. My clients are always thrilled with the pieces, and the delivery experience is seamless. Their custom furniture service is a game-changer for bespoke projects.",
    rating: 5,
    verified: true
  },
  {
    _id: "test_002",
    name: "Marcus Chen",
    role: "Homeowner",
    location: "San Francisco, CA",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    content: "I furnished my entire apartment with Furniqo and couldn't be happier. Every piece from the sofa to the dining table exceeded my expectations in terms of quality and design. The customer service team was incredibly helpful when I needed to modify my order.",
    rating: 5,
    verified: true
  },
  {
    _id: "test_003",
    name: "Emily Rodriguez",
    role: "Architect",
    location: "Austin, TX",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
    content: "As an architect, I appreciate the attention to detail and craftsmanship in Furniqo's pieces. The clean lines and quality materials perfectly complement modern architectural spaces. Their room inspiration section is incredibly helpful for visualizing complete spaces.",
    rating: 5,
    verified: true
  },
  {
    _id: "test_004",
    name: "James & Sarah Thompson",
    role: "New Homeowners",
    location: "Portland, OR",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
    content: "We discovered Furniqo while furnishing our first home, and it was the best find ever! The furniture is not only beautiful but incredibly durable - even with two kids and a dog. The free design consultation helped us create a cohesive look throughout our home.",
    rating: 5,
    verified: true
  }
];

export const blogPosts = [
  {
    _id: "blog_001",
    title: "10 Expert Tips for Choosing the Perfect Sofa",
    slug: "choosing-perfect-sofa-guide",
    excerpt: "From measuring your space to selecting the right fabric, our comprehensive guide helps you find the sofa that's perfect for your home and lifestyle.",
    content: "Full blog post content would go here...",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
    author: "Isabella Design",
    authorRole: "Senior Interior Designer",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    category: "Design Tips",
    date: "2024-03-20",
    readTime: "8 min read",
    tags: ["sofa", "living-room", "design-tips", "furniture-guide"],
    featured: true
  },
  {
    _id: "blog_002",
    title: "2024 Furniture Trends: What's Hot This Year",
    slug: "furniture-trends-2024",
    excerpt: "Discover the top furniture trends defining interior design in 2024, from sustainable materials to bold color choices and multifunctional pieces.",
    content: "Full blog post content would go here...",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800",
    author: "Marcus Style",
    authorRole: "Trend Analyst",
    authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    category: "Trends",
    date: "2024-03-18",
    readTime: "6 min read",
    tags: ["trends", "2024", "interior-design", "furniture"],
    featured: true
  },
  {
    _id: "blog_003",
    title: "Creating the Ultimate Home Office Setup",
    slug: "ultimate-home-office-setup",
    excerpt: "Transform your home office into a productivity powerhouse with our guide to ergonomic furniture, lighting, and organization.",
    content: "Full blog post content would go here...",
    image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800",
    author: "David Productivity",
    authorRole: "Workspace Consultant",
    authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    category: "Home Office",
    date: "2024-03-15",
    readTime: "10 min read",
    tags: ["home-office", "ergonomics", "productivity", "workspace"],
    featured: true
  },
  {
    _id: "blog_004",
    title: "Sustainable Furniture: A Guide to Eco-Friendly Living",
    slug: "sustainable-furniture-guide",
    excerpt: "Learn how to make environmentally conscious furniture choices without compromising on style or quality.",
    content: "Full blog post content would go here...",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800",
    author: "Elena Green",
    authorRole: "Sustainability Expert",
    authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    category: "Sustainability",
    date: "2024-03-10",
    readTime: "7 min read",
    tags: ["sustainable", "eco-friendly", "green-living", "furniture"],
    featured: false
  },
  {
    _id: "blog_005",
    title: "Small Space Solutions: Furniture for Compact Living",
    slug: "small-space-furniture-solutions",
    excerpt: "Maximize every square foot with our clever furniture picks and layout tips for apartments and small homes.",
    content: "Full blog post content would go here...",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    author: "Sophia Space",
    authorRole: "Small Space Specialist",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    category: "Design Tips",
    date: "2024-03-05",
    readTime: "5 min read",
    tags: ["small-spaces", "apartment", "space-saving", "furniture"],
    featured: false
  },
  {
    _id: "blog_006",
    title: "Mixing Modern and Vintage: A Style Guide",
    slug: "mixing-modern-vintage-style",
    excerpt: "Create a unique, curated look by blending contemporary furniture with vintage finds. Our guide shows you how to get the perfect mix.",
    content: "Full blog post content would go here...",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    author: "Isabella Design",
    authorRole: "Senior Interior Designer",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    category: "Style Guide",
    date: "2024-02-28",
    readTime: "9 min read",
    tags: ["vintage", "modern", "style-guide", "interior-design"],
    featured: false
  },
  {
    _id: "blog_007",
    title: "The Ultimate Guide to Choosing the Right Dining Table",
    slug: "choosing-right-dining-table",
    excerpt: "From size and shape to material and style, learn everything you need to know about selecting the perfect dining table for your home.",
    content: "Full blog post content would go here...",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800",
    author: "Marcus Style",
    authorRole: "Furniture Expert",
    authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    category: "Buying Guides",
    date: "2024-04-01",
    readTime: "7 min read",
    tags: ["dining-table", "buying-guide", "furniture", "dining-room"],
    featured: true
  },
  {
    _id: "blog_008",
    title: "Maximizing Natural Light in Your Living Space",
    slug: "maximize-natural-light-home",
    excerpt: "Expert tips on using mirrors, window treatments, and furniture placement to brighten your home with natural light.",
    content: "Full blog post content would go here...",
    image: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800",
    author: "Sophia Space",
    authorRole: "Lighting Specialist",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    category: "Design Tips",
    date: "2024-03-25",
    readTime: "6 min read",
    tags: ["natural-light", "lighting", "home-design", "mirrors"],
    featured: false
  },
  {
    _id: "blog_009",
    title: "Children's Room Furniture: Safety Meets Style",
    slug: "childrens-room-furniture-safety-style",
    excerpt: "Create a safe, functional, and stylish space for your little ones with our guide to children's furniture.",
    content: "Full blog post content would go here...",
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?w=800",
    author: "Isabella Design",
    authorRole: "Children's Interior Designer",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    category: "Kids Room",
    date: "2024-03-22",
    readTime: "8 min read",
    tags: ["kids-room", "children-furniture", "safety", "nursery"],
    featured: false
  },
  {
    _id: "blog_010",
    title: "The Art of Layering Textures in Interior Design",
    slug: "layering-textures-interior-design",
    excerpt: "Master the art of combining different textures to create depth, warmth, and visual interest in any room.",
    content: "Full blog post content would go here...",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800",
    author: "Marcus Style",
    authorRole: "Texture Expert",
    authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    category: "Design Tips",
    date: "2024-03-19",
    readTime: "5 min read",
    tags: ["textures", "interior-design", "layering", "home-styling"],
    featured: false
  },
  {
    _id: "blog_011",
    title: "Outdoor Furniture: Creating Your Perfect Patio",
    slug: "outdoor-furniture-perfect-patio",
    excerpt: "Transform your outdoor space with durable, stylish furniture that withstands the elements and creates a relaxing retreat.",
    content: "Full blog post content would go here...",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
    author: "Elena Green",
    authorRole: "Outdoor Living Expert",
    authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    category: "Outdoor Living",
    date: "2024-03-14",
    readTime: "9 min read",
    tags: ["outdoor-furniture", "patio", "garden", "outdoor-living"],
    featured: true
  },
  {
    _id: "blog_012",
    title: "Budget-Friendly Furniture Makeovers",
    slug: "budget-friendly-furniture-makeovers",
    excerpt: "Breathe new life into old furniture with these creative DIY makeover ideas that won't break the bank.",
    content: "Full blog post content would go here...",
    image: "https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?w=800",
    author: "David Productivity",
    authorRole: "DIY Expert",
    authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    category: "DIY",
    date: "2024-03-12",
    readTime: "10 min read",
    tags: ["diy", "budget-friendly", "furniture-makeover", "upcycling"],
    featured: false
  },
  {
    _id: "blog_013",
    title: "Choosing the Perfect Bedroom Furniture Set",
    slug: "perfect-bedroom-furniture-set",
    excerpt: "Create your dream bedroom with our guide to selecting cohesive furniture sets that maximize comfort and storage.",
    content: "Full blog post content would go here...",
    image: "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800",
    author: "Sophia Space",
    authorRole: "Bedroom Designer",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    category: "Bedroom",
    date: "2024-03-08",
    readTime: "7 min read",
    tags: ["bedroom", "furniture-set", "mattress", "storage"],
    featured: false
  },
  {
    _id: "blog_014",
    title: "The Psychology of Color in Furniture Selection",
    slug: "psychology-color-furniture-selection",
    excerpt: "Learn how different colors affect mood and energy levels, and choose the perfect hues for each room in your home.",
    content: "Full blog post content would go here...",
    image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800",
    author: "Isabella Design",
    authorRole: "Color Psychology Expert",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    category: "Color Theory",
    date: "2024-03-04",
    readTime: "8 min read",
    tags: ["color-psychology", "color-theory", "interior-design", "mood"],
    featured: true
  },
  {
    _id: "blog_015",
    title: "Space-Saving Furniture Ideas for Studios",
    slug: "space-saving-furniture-studio-apartments",
    excerpt: "Discover innovative furniture solutions designed specifically for studio apartments and small living spaces.",
    content: "Full blog post content would go here...",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
    author: "Marcus Style",
    authorRole: "Small Space Expert",
    authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    category: "Small Spaces",
    date: "2024-02-25",
    readTime: "6 min read",
    tags: ["studio-apartment", "space-saving", "multi-functional", "furniture"],
    featured: false
  },
  {
    _id: "blog_016",
    title: "Luxury Furniture on a Budget: How to Get the Look",
    slug: "luxury-furniture-budget-friendly",
    excerpt: "Achieve a high-end look without the designer price tag with our expert tips and affordable alternatives.",
    content: "Full blog post content would go here...",
    image: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=800",
    author: "Elena Green",
    authorRole: "Budget Design Expert",
    authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    category: "Budget Design",
    date: "2024-02-20",
    readTime: "9 min read",
    tags: ["luxury-look", "budget-design", "affordable", "dupes"],
    featured: false
  },
  {
    _id: "blog_017",
    title: "The Ultimate Home Library: Bookshelf Styling Guide",
    slug: "home-library-bookshelf-styling",
    excerpt: "Create a stunning home library with our guide to bookshelf styling, organization, and furniture selection.",
    content: "Full blog post content would go here...",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800",
    author: "David Productivity",
    authorRole: "Home Library Curator",
    authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    category: "Home Library",
    date: "2024-02-18",
    readTime: "7 min read",
    tags: ["bookshelf", "home-library", "styling", "books"],
    featured: false
  },
  {
    _id: "blog_018",
    title: "Pet-Friendly Furniture: Style Meets Durability",
    slug: "pet-friendly-furniture-guide",
    excerpt: "Find furniture that stands up to scratches, stains, and fur without sacrificing style or comfort.",
    content: "Full blog post content would go here...",
    image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=800",
    author: "Sophia Space",
    authorRole: "Pet-Friendly Design Expert",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    category: "Pet-Friendly",
    date: "2024-02-15",
    readTime: "6 min read",
    tags: ["pet-friendly", "durable-fabrics", "stain-resistant", "pets"],
    featured: true
  },
  {
    _id: "blog_019",
    title: "Smart Furniture: Tech-Integrated Pieces",
    slug: "smart-furniture-tech-integrated",
    excerpt: "Explore the future of home furnishing with smart furniture that charges devices, adjusts to your needs, and enhances connectivity.",
    content: "Full blog post content would go here...",
    image: "https://images.pexels.com/photos/7534846/pexels-photo-7534846.jpeg",
    author: "Marcus Style",
    authorRole: "Smart Home Expert",
    authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    category: "Smart Furniture",
    date: "2024-02-10",
    readTime: "8 min read",
    tags: ["smart-furniture", "tech-integrated", "smart-home", "innovation"],
    featured: false
  },
  {
    _id: "blog_020",
    title: "Seasonal Furniture Care and Maintenance",
    slug: "seasonal-furniture-care-maintenance",
    excerpt: "Extend the life of your furniture with our comprehensive seasonal maintenance guide for every material type.",
    content: "Full blog post content would go here...",
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800",
    author: "Isabella Design",
    authorRole: "Furniture Care Specialist",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    category: "Maintenance",
    date: "2024-02-05",
    readTime: "10 min read",
    tags: ["furniture-care", "maintenance", "cleaning", "longevity"],
    featured: false
  },
  {
    _id: "blog_021",
    title: "Minimalist Furniture: Less is More",
    slug: "minimalist-furniture-design-guide",
    excerpt: "Embrace the minimalist aesthetic with our guide to clean lines, functional pieces, and clutter-free living.",
    content: "Full blog post content would go here...",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800",
    author: "Sophia Space",
    authorRole: "Minimalist Designer",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    category: "Minimalism",
    date: "2024-01-30",
    readTime: "5 min read",
    tags: ["minimalist", "simple-design", "clutter-free", "functional"],
    featured: false
  },
  {
    _id: "blog_022",
    title: "Rustic Farmhouse Style: A Complete Guide",
    slug: "rustic-farmhouse-style-guide",
    excerpt: "Create a warm, inviting farmhouse aesthetic with our guide to rustic furniture, distressed finishes, and cozy accents.",
    content: "Full blog post content would go here...",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800",
    author: "Marcus Style",
    authorRole: "Farmhouse Style Expert",
    authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    category: "Style Guide",
    date: "2024-01-25",
    readTime: "7 min read",
    tags: ["farmhouse", "rustic", "country-style", "shabby-chic"],
    featured: true
  },
  {
    "_id": "blog_023",
    "title": "Ergonomic Furniture for Health and Wellness",
    "slug": "ergonomic-furniture-health-wellness",
    "excerpt": "Invest in your health with ergonomic furniture designed to support proper posture, reduce pain, and enhance well-being.",
    "content": "Full blog post content would go here...",
    "image": "https://images.pexels.com/photos/6782589/pexels-photo-6782589.jpeg",
    "author": "David Productivity",
    "authorRole": "Ergonomics Specialist",
    "authorImage": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    "category": "Home Office",
    "date": "2024-01-20",
    "readTime": "9 min read",
    "tags": ["ergonomic", "health", "wellness", "posture"],
    "featured": true
  },
  {
    "_id": "blog_024",
    "title": "Art Deco Revival: Glamorous Furniture Trends",
    "slug": "art-deco-revival-furniture",
    "excerpt": "Bring the glamour of the 1920s into your home with our guide to Art Deco-inspired furniture and accessories.",
    "content": "Full blog post content would go here...",
    "image": "https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg",
    "author": "Elena Green",
    "authorRole": "Vintage Style Expert",
    "authorImage": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    "category": "Style Guide",
    "date": "2024-01-15",
    "readTime": "6 min read",
    "tags": ["art-deco", "vintage-style", "glamour", "retro"],
    "featured": false
  },
  {
    "_id": "blog_025",
    "title": "Sustainable Wood Furniture: Types and Benefits",
    "slug": "sustainable-wood-furniture-guide",
    "excerpt": "Learn about different types of sustainable wood and why they're the best choice for eco-conscious furniture buyers.",
    "content": "Full blog post content would go here...",
    "image": "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800",
    "author": "Isabella Design",
    "authorRole": "Sustainable Design Expert",
    "authorImage": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    "category": "Sustainability",
    "date": "2024-01-10",
    "readTime": "8 min read",
    "tags": ["sustainable-wood", "eco-friendly", "bamboo", "reclaimed-wood"],
    "featured": true
  }
];

export const rooms = [
  {
    _id: "room_001",
    name: "Modern Loft Living",
    style: "Contemporary Industrial",
    roomType: "Living Room",
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
    description: "Open concept living with industrial accents and modern furnishings, perfect for urban dwellers who appreciate raw materials and spacious layouts.",
    features: "Exposed brick walls, metal fixtures, leather sofa, reclaimed wood coffee table",
    tips: "Balance industrial elements with soft textiles like rugs and curtains to warm up the space",
    products: ["prod_001", "prod_009"],
    tags: ["loft", "industrial", "open-concept"]
  },
  {
    _id: "room_002",
    name: "Serene Minimalist Bedroom",
    style: "Japanese Minimalism",
    roomType: "Bedroom",
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800",
    description: "Peaceful bedroom retreat with clean lines, natural materials, and a calming neutral palette.",
    features: "Low platform bed, shoji screens, natural wood accents, soft linen bedding",
    tips: "Keep surfaces clutter-free and let natural light be the main feature",
    products: ["prod_002", "prod_010"],
    tags: ["minimalist", "bedroom", "zen"]
  },
  {
    _id: "room_003",
    name: "Scandinavian Dining Room",
    style: "Nordic Modern",
    roomType: "Dining",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800",
    description: "Bright, airy dining space with warm wood tones, simple elegance, and hygge-inspired comfort.",
    features: "Solid wood dining table, wishbone chairs, pendant lighting, minimal decor",
    tips: "Layer different textures like wood, wool, and ceramics for a cozy feel",
    products: ["prod_003", "prod_011"],
    tags: ["scandinavian", "dining", "bright"]
  },
  {
    _id: "room_004",
    name: "Glamorous Living Space",
    style: "Art Deco Luxury",
    roomType: "Living Room",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
    description: "Opulent living room featuring rich velvets, gold accents, geometric patterns, and statement pieces.",
    features: "Velvet sofa, brass coffee table, geometric rug, statement chandelier",
    tips: "Mix metals and add mirrored surfaces to enhance the luxurious feel",
    products: ["prod_005", "prod_007"],
    tags: ["luxury", "art-deco", "glamorous"]
  },
  {
    _id: "room_005",
    name: "Coastal Outdoor Oasis",
    style: "Coastal Contemporary",
    roomType: "Outdoor",
    image: "https://images.pexels.com/photos/1458457/pexels-photo-1458457.jpeg",
    description: "Relaxed outdoor living with weather-resistant furniture and ocean-inspired palette for ultimate summer vibes.",
    features: "Rattan seating, weather-proof cushions, outdoor rug, string lighting",
    tips: "Add potted palms and lanterns to enhance the coastal atmosphere",
    products: ["prod_008"],
    tags: ["outdoor", "coastal", "patio"]
  },
  {
    _id: "room_006",
    name: "Productive Home Office",
    style: "Modern Professional",
    roomType: "Office",
    image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800",
    description: "Efficient and stylish workspace designed for focus, creativity, and maximum productivity.",
    features: "Ergonomic chair, adjustable desk, task lighting, acoustic panels",
    tips: "Position desk facing natural light and add plants for improved focus",
    products: ["prod_004"],
    tags: ["office", "productive", "ergonomic"]
  },
  {
    _id: "room_007",
    name: "Bohemian Bedroom Retreat",
    style: "Eclectic Bohemian",
    roomType: "Bedroom",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",
    description: "Vibrant and artistic bedroom with layered textiles, global accents, and free-spirited charm.",
    features: "Macrame wall hanging, floor cushions, patterned rug, hanging plants",
    tips: "Mix patterns and textures freely, but keep a cohesive color palette",
    products: ["prod_012", "prod_013"],
    tags: ["bohemian", "eclectic", "artistic"]
  },
  {
    _id: "room_008",
    name: "Modern Farmhouse Kitchen",
    style: "Rustic Modern",
    roomType: "Living Room",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800",
    description: "Warm and inviting kitchen blending rustic charm with modern amenities and open shelving.",
    features: "Shaker cabinets, butcher block countertops, farmhouse sink, pendant lights",
    tips: "Display everyday dishes on open shelves for easy access and visual interest",
    products: ["prod_014", "prod_015"],
    tags: ["farmhouse", "rustic", "kitchen"]
  },
  {
    _id: "room_009",
    name: "Mediterranean Patio",
    style: "Mediterranean Villa",
    roomType: "Outdoor",
    image: "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800",
    description: "Sun-drenched outdoor space with terracotta accents, lush plants, and relaxed entertaining areas.",
    features: "Terracotta tiles, wrought iron furniture, climbing vines, clay pots",
    tips: "Use lavender and rosemary for fragrance and Mediterranean authenticity",
    products: ["prod_016"],
    tags: ["mediterranean", "patio", "courtyard"]
  },
  {
    _id: "room_010",
    name: "Tech-Savvy Gaming Room",
    style: "Futuristic Gaming",
    roomType: "Office",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800",
    description: "Ultimate gaming setup with RGB lighting, ergonomic seating, and immersive audio experience.",
    features: "RGB lighting strips, racing chair, multi-monitor setup, soundproofing panels",
    tips: "Proper cable management and bias lighting reduce eye strain during long sessions",
    products: ["prod_017", "prod_018"],
    tags: ["gaming", "tech", "immersive"]
  },
  {
    _id: "room_011",
    name: "Luxury Walk-In Closet",
    style: "Boutique Luxury",
    roomType: "Storage",
    image: "data:image/webp;base64,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",
    description: "Dream closet with custom cabinetry, island display, and elegant lighting for your wardrobe collection.",
    features: "Glass-front cabinets, central island, chandelier, valet rods",
    tips: "Group clothing by color and season for Instagram-worthy organization",
    products: ["prod_019"],
    tags: ["closet", "storage", "luxury"]
  },
  {
    _id: "room_012",
    name: "Statement Lighting Gallery",
    style: "Modern Art Deco",
    roomType: "Lighting",
    image: "https://images.pexels.com/photos/1123262/pexels-photo-1123262.jpeg",
    description: "Showcase of artistic lighting fixtures that serve as functional art pieces in your space.",
    features: "Sputnik chandelier, arc floor lamp, sculptural sconces, dimmable LEDs",
    tips: "Layer ambient, task, and accent lighting for depth and drama",
    products: ["prod_020", "prod_021"],
    tags: ["lighting", "artistic", "dramatic"]
  }
];

export const coupons = [
  {
    code: "WELCOME25",
    discount: 25,
    type: "percentage",
    minPurchase: 500,
    maxDiscount: 500,
    validFrom: "2024-01-01",
    validUntil: "2026-12-31",
    description: "25% off your first order (up to $500 off)",
    usageLimit: 1,
    usedCount: 0,
    isActive: true,
    forNewUsers: true
  },
  {
    code: "FURNIQO100",
    discount: 100,
    type: "fixed",
    minPurchase: 1000,
    validFrom: "2024-01-01",
    validUntil: "2026-06-30",
    description: "$100 off orders over $1,000",
    usageLimit: null,
    usedCount: 0,
    isActive: true,
    forNewUsers: false
  },
  {
    code: "FREESHIP200",
    discount: 0,
    type: "freeShipping",
    minPurchase: 200,
    validFrom: "2024-01-01",
    validUntil: "2026-12-31",
    description: "Free shipping on orders over $200",
    usageLimit: 3,
    usedCount: 0,
    isActive: true,
    forNewUsers: false
  },
  {
    code: "AUTUMN30",
    discount: 30,
    type: "percentage",
    minPurchase: 750,
    maxDiscount: 750,
    validFrom: "2024-09-01",
    validUntil: "2026-11-30",
    description: "30% off fall collection (up to $750 off)",
    usageLimit: 1,
    usedCount: 0,
    isActive: false,
    forNewUsers: false
  },
  {
    code: "VIP15",
    discount: 15,
    type: "percentage",
    minPurchase: 0,
    maxDiscount: 300,
    validFrom: "2024-01-01",
    validUntil: "2026-12-31",
    description: "15% off for VIP members (up to $300 off)",
    usageLimit: null,
    usedCount: 0,
    isActive: true,
    forNewUsers: false
  }
];

export const faqs = [
  {
    question: "What is Furniqo's return policy?",
    answer: "We offer a 30-day return policy on all furniture items. Products must be in original condition with all tags and packaging. Return shipping is free for defective or damaged items. For change-of-mind returns, a small restocking fee may apply. Custom orders are final sale unless defective.",
    category: "Returns & Refunds"
  },
  {
    question: "How long does shipping take?",
    answer: "Standard shipping takes 5-7 business days for in-stock items. Express shipping (2-3 business days) and overnight shipping (next business day) are available for an additional fee. White Glove delivery with assembly takes 5-10 business days. Custom and made-to-order items may take 4-6 weeks.",
    category: "Shipping"
  },
  {
    question: "Do you offer assembly services?",
    answer: "Yes! Our White Glove delivery service includes professional assembly, packaging removal, and furniture placement in your desired room. This service is available for $99.99 on most furniture items. Some items come with easy assembly instructions if you prefer DIY.",
    category: "Shipping"
  },
  {
    question: "What warranty does Furniqo provide?",
    answer: "All furniture comes with a comprehensive warranty: 10 years on frames and structural components, 5 years on mechanisms (recliners, adjustable bases), 2 years on upholstery and finishes, and 1 year on electronics. Extended warranty options are available for purchase.",
    category: "Product Information"
  },
  {
    question: "How do I care for my furniture?",
    answer: "Care instructions vary by material. Leather furniture should be conditioned every 6 months. Fabric upholstery can be cleaned with mild soap and water. Wood furniture benefits from regular dusting and occasional polishing. Detailed care guides are included with every purchase.",
    category: "Product Information"
  },
  {
    question: "Can I cancel or modify my order?",
    answer: "Orders can be cancelled or modified within 24 hours of placement at no charge. After 24 hours but before shipping, cancellations may incur a 10% processing fee. Once shipped, our standard return policy applies. Contact our customer service team immediately for any changes.",
    category: "Orders"
  },
  {
    question: "Do you offer financing options?",
    answer: "Yes, we offer flexible financing through Affirm and Klarna. Options include 0% APR for 6 months on orders over $500, or extended terms of up to 36 months. Approval is instant and doesn't affect your credit score. Look for the financing option at checkout.",
    category: "Payment"
  },
  {
    question: "Is international shipping available?",
    answer: "Currently, we ship within the United States (including Alaska and Hawaii) and Canada. International shipping to select countries in Europe and Asia is available for certain items. International orders may be subject to customs duties and import taxes.",
    category: "Shipping"
  },
  {
    question: "How can I track my order?",
    answer: "Once your order ships, you'll receive a confirmation email with tracking information. You can also track your order by logging into your Furniqo account. For White Glove deliveries, our team will contact you to schedule a convenient delivery window.",
    category: "Orders"
  },
  {
    question: "Do you offer trade discounts for designers?",
    answer: "Yes! Our Trade Program offers exclusive benefits for interior designers, architects, and developers. Benefits include 15% off all orders, dedicated account management, early access to new collections, and complimentary fabric samples. Apply for our Trade Program on our website.",
    category: "Account"
  }
];

export const policies = {
  privacy: {
    title: "Privacy Policy",
    lastUpdated: "March 1, 2024",
    sections: [
      {
        heading: "Information We Collect",
        content: "We collect information you provide when creating an account, making a purchase, or contacting us. This includes your name, email address, shipping address, billing information, and phone number. We also automatically collect certain data about your device and browsing behavior to improve our services."
      },
      {
        heading: "How We Use Your Information",
        content: "Your information is used to process orders, provide customer service, send order updates and promotional communications (with your consent), improve our website and services, prevent fraud, and comply with legal obligations. We do not sell your personal information to third parties."
      },
      {
        heading: "Data Security",
        content: "We implement industry-standard security measures including SSL encryption, secure servers, and regular security audits. Payment information is processed through PCI-compliant payment processors and is never stored on our servers."
      },
      {
        heading: "Your Rights",
        content: "You have the right to access, correct, or delete your personal information. You can opt out of marketing communications at any time. You may also request a copy of your data or ask us to restrict processing. Contact our privacy team to exercise these rights."
      }
    ]
  },
  terms: {
    title: "Terms of Service",
    lastUpdated: "March 1, 2024",
    sections: [
      {
        heading: "Acceptance of Terms",
        content: "By accessing and using the Furniqo website, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our services."
      },
      {
        heading: "Product Information & Pricing",
        content: "We strive to display accurate product information, including pricing, dimensions, and availability. However, we reserve the right to correct any errors and to change or update information at any time without prior notice."
      },
      {
        heading: "Order Acceptance",
        content: "Your receipt of an order confirmation does not constitute our acceptance of your order. We reserve the right to refuse or cancel any order for any reason, including product availability, errors in pricing, or suspicion of fraudulent activity."
      },
      {
        heading: "Intellectual Property",
        content: "All content on this website, including text, graphics, logos, images, and software, is the property of Furniqo and is protected by copyright and intellectual property laws. You may not reproduce, distribute, or create derivative works without our express permission."
      }
    ]
  },
  shipping: {
    title: "Shipping Policy",
    lastUpdated: "March 1, 2024",
    sections: [
      {
        heading: "Processing Time",
        content: "In-stock items typically process within 1-2 business days. Made-to-order and custom items require 4-6 weeks for production before shipping. You'll receive email updates at each stage of your order."
      },
      {
        heading: "Shipping Methods & Rates",
        content: "We offer Standard (5-7 days, free over $200), Express (2-3 days, $29.99), Overnight (next day, $49.99), and White Glove delivery (5-10 days, $99.99). Rates are calculated at checkout based on your location and selected method."
      },
      {
        heading: "Delivery Areas",
        content: "We deliver to all 50 US states, including Alaska and Hawaii (additional charges may apply for remote areas). We also ship to Canada. International shipping to select countries is available - contact us for a quote."
      },
      {
        heading: "Delivery Issues",
        content: "Inspect all packages upon delivery. If you notice any damage, note it on the delivery receipt and contact us within 48 hours. We'll arrange a replacement or repair at no cost to you."
      }
    ]
  },
  returns: {
    title: "Return Policy",
    lastUpdated: "March 1, 2024",
    sections: [
      {
        heading: "30-Day Return Window",
        content: "You may return most items within 30 days of delivery for a full refund or exchange. Items must be in original condition with all tags, hardware, and packaging. Custom orders and clearance items are final sale."
      },
      {
        heading: "Return Shipping",
        content: "Return shipping is free for defective, damaged, or incorrect items. For change-of-mind returns, return shipping costs are deducted from your refund unless you choose store credit."
      },
      {
        heading: "Refund Processing",
        content: "Refunds are processed within 5-10 business days after we receive and inspect the returned item. Refunds are issued to the original payment method. Store credit is available immediately upon return processing."
      }
    ]
  }
};

export const heroSlides = [
  {
    id: 1,
    title: "Elevate Your Living Space",
    subtitle: "Discover our new spring collection of premium furniture",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920",
    cta: "Shop Collection",
    link: "/products?sort=newest",
    textColor: "light"
  },
  {
    id: 2,
    title: "Up to 40% Off",
    subtitle: "Transform your home with incredible savings on selected pieces",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1920",
    cta: "View Offers",
    link: "/offers",
    textColor: "light"
  },
  {
    id: 3,
    title: "Sustainable Luxury",
    subtitle: "Eco-friendly furniture that doesn't compromise on style",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1920",
    cta: "Explore Sustainable",
    link: "/products?style=Scandinavian",
    textColor: "dark"
  }
];