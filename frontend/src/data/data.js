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
    name: "Artisan Dining Table",
    slug: "artisan-dining-table",
    description: "Gather around our Artisan Dining Table, a masterpiece of craftsmanship. The live-edge acacia wood top showcases the natural beauty of the tree, while the geometric black steel base adds a contemporary edge. Seats 8-10 comfortably and becomes the focal point of any dining room.",
    shortDescription: "Live-edge acacia wood table with geometric steel base",
    price: 2499.99,
    originalPrice: 3199.99,
    category: "Dining Room",
    subcategory: "Tables",
    material: "Acacia Wood & Steel",
    color: "Natural/Black",
    style: "Industrial Modern",
    dimensions: "96\"L x 42\"W x 30\"H",
    weight: "220 lbs",
    inStock: true,
    stock: 5,
    rating: 4.9,
    numReviews: 89,
    images: [
      "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=1200",
      "https://images.unsplash.com/photo-1554295405-cd86f33c90b1?w=1200",
      "https://images.unsplash.com/photo-1523865236455-cbbdb07c25a1?w=1200",
      "https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=1200"
    ],
    variants: [
      { color: "Natural/Black", material: "Acacia Wood & Steel", price: 2499.99, stock: 5 },
      { color: "Walnut/Gold", material: "Walnut & Brass", price: 2999.99, stock: 3 },
      { color: "White/Gray", material: "Oak & Concrete", price: 2799.99, stock: 4 }
    ],
    features: [
      "Live-edge acacia wood top",
      "Geometric steel base",
      "Seats 8-10 people",
      "Food-safe finish",
      "Unique natural grain patterns",
      "Floor protectors included"
    ],
    reviews: [
      { 
        _id: "rev_006", 
        user: "Emily R.", 
        rating: 5, 
        title: "Absolutely stunning centerpiece",
        comment: "This table is even more beautiful in person. The live edge is spectacular and each table is truly unique. We've received countless compliments from dinner guests.", 
        date: "2024-03-08",
        verified: true,
        helpful: 47
      }
    ],
    tags: ["dining-table", "live-edge", "acacia", "industrial", "dining-room", "artisan"],
    featured: true,
    trending: false,
    bestSeller: false,
    newArrival: true,
    onSale: true,
    createdAt: "2024-02-01T10:00:00.000Z",
    updatedAt: "2024-03-15T14:00:00.000Z"
  },
  {
    _id: "prod_004",
    name: "ErgoPro Executive Office Chair",
    slug: "ergopro-executive-office-chair",
    description: "Work in absolute comfort with the ErgoPro Executive Office Chair. Engineered with orthopedic specialists, this chair features 4D adjustable armrests, dynamic lumbar support, and a breathable mesh back. The memory foam seat cushion adapts to your body, while the synchronized tilt mechanism promotes healthy movement throughout the day.",
    shortDescription: "Professional ergonomic chair with 4D armrests and lumbar support",
    price: 899.99,
    originalPrice: 1199.99,
    category: "Office",
    subcategory: "Chairs",
    material: "Mesh & Aluminum",
    color: "Graphite Black",
    style: "Modern Ergonomic",
    dimensions: "27\"W x 27\"D x 42\"H (adjustable)",
    weight: "55 lbs",
    inStock: true,
    stock: 25,
    rating: 4.8,
    numReviews: 312,
    images: [
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=1200",
      "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=1200",
      "https://images.unsplash.com/photo-1567532939604-b6f5b5a2bfcd?w=1200",
      "https://images.unsplash.com/photo-1505843490701-5cc4a83b0009?w=1200"
    ],
    variants: [
      { color: "Graphite Black", material: "Mesh & Aluminum", price: 899.99, stock: 25 },
      { color: "Arctic White", material: "Mesh & Chrome", price: 899.99, stock: 15 },
      { color: "Merlot Red", material: "Fabric & Aluminum", price: 949.99, stock: 10 }
    ],
    features: [
      "4D adjustable armrests",
      "Dynamic lumbar support system",
      "Breathable mesh backrest",
      "Memory foam seat cushion",
      "Synchronized tilt mechanism",
      "10-year warranty"
    ],
    reviews: [
      { 
        _id: "rev_007", 
        user: "David C.", 
        rating: 5, 
        title: "Best investment for my home office",
        comment: "After years of back pain from cheap office chairs, this ErgoPro has been life-changing. The lumbar support is incredible and the mesh back keeps me cool during long work sessions.", 
        date: "2024-03-18",
        verified: true,
        helpful: 56
      }
    ],
    tags: ["office-chair", "ergonomic", "executive", "home-office", "lumbar-support"],
    featured: false,
    trending: true,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-01-10T07:00:00.000Z",
    updatedAt: "2024-03-10T09:00:00.000Z"
  },
  {
    _id: "prod_005",
    name: "Luna Velvet Accent Chair",
    slug: "luna-velvet-accent-chair",
    description: "Add a touch of glamour to any room with our Luna Velvet Accent Chair. Upholstered in sumptuous emerald green velvet with hand-applied gold leaf legs, this chair is a statement piece. The curved back provides ergonomic support while the deep seat invites you to curl up with a good book.",
    shortDescription: "Emerald velvet accent chair with gold leaf legs",
    price: 649.99,
    originalPrice: 899.99,
    category: "Living Room",
    subcategory: "Accent Chairs",
    material: "Velvet & Gold Leaf",
    color: "Emerald Green",
    style: "Art Deco",
    dimensions: "30\"W x 32\"D x 36\"H",
    weight: "42 lbs",
    inStock: true,
    stock: 12,
    rating: 4.6,
    numReviews: 78,
    images: [
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1200",
      "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=1200",
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=1200",
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1200"
    ],
    variants: [
      { color: "Emerald Green", material: "Velvet", price: 649.99, stock: 12 },
      { color: "Sapphire Blue", material: "Velvet", price: 649.99, stock: 8 },
      { color: "Blush Pink", material: "Velvet", price: 699.99, stock: 10 },
      { color: "Midnight Black", material: "Velvet", price: 599.99, stock: 15 }
    ],
    features: [
      "Premium velvet upholstery",
      "Hand-applied gold leaf legs",
      "Ergonomic curved back",
      "Deep seat for comfort",
      "Art Deco inspired design",
      "No assembly required"
    ],
    reviews: [
      { 
        _id: "rev_008", 
        user: "Sophia L.", 
        rating: 5, 
        title: "Gorgeous statement piece!",
        comment: "This chair is absolutely stunning. The emerald green is rich and luxurious, and the gold legs add such an elegant touch. It's also surprisingly comfortable!", 
        date: "2024-03-05",
        verified: true,
        helpful: 31
      }
    ],
    tags: ["accent-chair", "velvet", "gold", "art-deco", "living-room", "luxury"],
    featured: true,
    trending: true,
    bestSeller: false,
    newArrival: true,
    onSale: true,
    createdAt: "2024-02-15T11:00:00.000Z",
    updatedAt: "2024-03-12T13:00:00.000Z"
  },
  {
    _id: "prod_006",
    name: "Aurora Platform Storage Bed",
    slug: "aurora-platform-storage-bed",
    description: "Maximize your bedroom space with the Aurora Platform Storage Bed. This ingenious design features four spacious drawers integrated into the base, perfect for storing linens, clothing, or seasonal items. The upholstered headboard with channel tufting adds a touch of elegance, while the solid wood frame ensures lasting durability.",
    shortDescription: "Upholstered storage bed with 4 drawers and tufted headboard",
    price: 1599.99,
    originalPrice: 2099.99,
    category: "Bedroom",
    subcategory: "Storage Beds",
    material: "Fabric & Solid Wood",
    color: "Dove Gray",
    style: "Contemporary",
    dimensions: "King: 80\"W x 88\"L x 48\"H",
    weight: "210 lbs",
    inStock: true,
    stock: 10,
    rating: 4.6,
    numReviews: 145,
    images: [
      "https://images.unsplash.com/photo-1588046130717-0eb0c9c3bf4c?w=1200",
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=1200",
      "https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=1200",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200"
    ],
    variants: [
      { size: "Queen", color: "Dove Gray", price: 1399.99, stock: 12 },
      { size: "King", color: "Dove Gray", price: 1599.99, stock: 10 },
      { size: "Queen", color: "Ivory", price: 1399.99, stock: 8 },
      { size: "King", color: "Charcoal", price: 1699.99, stock: 6 }
    ],
    features: [
      "4 integrated storage drawers",
      "Channel-tufted upholstered headboard",
      "Solid wood frame construction",
      "No box spring required",
      "Soft-close drawer mechanism",
      "Fits standard mattress sizes"
    ],
    reviews: [
      { 
        _id: "rev_009", 
        user: "Michelle P.", 
        rating: 5, 
        title: "Perfect solution for small spaces",
        comment: "The storage drawers are a game-changer! We were able to get rid of a dresser and free up so much floor space. The bed is sturdy and the headboard looks very high-end.", 
        date: "2024-02-20",
        verified: true,
        helpful: 38
      }
    ],
    tags: ["storage-bed", "platform", "upholstered", "bedroom", "space-saving"],
    featured: false,
    trending: true,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    createdAt: "2024-01-05T08:30:00.000Z",
    updatedAt: "2024-03-01T10:00:00.000Z"
  },
  {
    _id: "prod_007",
    name: "Prism Crystal Chandelier",
    slug: "prism-crystal-chandelier",
    description: "Illuminate your space with the breathtaking Prism Crystal Chandelier. Featuring hundreds of hand-cut crystal prisms suspended from a polished chrome frame, this chandelier creates mesmerizing light patterns throughout your room. The integrated LED system offers adjustable color temperature from warm to cool white.",
    shortDescription: "Hand-cut crystal chandelier with adjustable LED lighting",
    price: 1299.99,
    originalPrice: 1799.99,
    category: "Lighting",
    subcategory: "Chandeliers",
    material: "Crystal & Chrome",
    color: "Silver",
    style: "Glamorous",
    dimensions: "36\"W x 36\"D x 24\"H",
    weight: "45 lbs",
    inStock: true,
    stock: 6,
    rating: 4.7,
    numReviews: 67,
    images: [
      "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=1200",
      "https://images.unsplash.com/photo-1517440803732-f7fe64f7b7d9?w=1200",
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=1200",
      "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=1200"
    ],
    variants: [
      { color: "Polished Chrome", size: "Medium (36\")", price: 1299.99, stock: 6 },
      { color: "Brushed Gold", size: "Medium (36\")", price: 1499.99, stock: 4 },
      { color: "Polished Chrome", size: "Large (48\")", price: 1999.99, stock: 3 }
    ],
    features: [
      "Hand-cut crystal prisms",
      "Adjustable color temperature (2700K-5000K)",
      "Integrated LED system",
      "Dimmable via remote control",
      "Polished chrome frame",
      "Professional installation recommended"
    ],
    reviews: [
      { 
        _id: "rev_010", 
        user: "Patricia W.", 
        rating: 5, 
        title: "Absolutely magnificent!",
        comment: "This chandelier transformed our dining room. The crystals catch the light beautifully and the dimming feature is perfect for setting different moods. Worth every penny!", 
        date: "2024-03-10",
        verified: true,
        helpful: 44
      }
    ],
    tags: ["chandelier", "crystal", "lighting", "LED", "luxury", "dining-room"],
    featured: true,
    trending: false,
    bestSeller: false,
    newArrival: true,
    onSale: true,
    createdAt: "2024-02-10T12:00:00.000Z",
    updatedAt: "2024-03-15T15:00:00.000Z"
  },
  {
    _id: "prod_008",
    name: "Aero Outdoor Lounge Set",
    slug: "aero-outdoor-lounge-set",
    description: "Create your outdoor oasis with the Aero Outdoor Lounge Set. This 5-piece set includes a spacious sofa, two armchairs, and an oversized coffee table, all crafted from weather-resistant aluminum with plush Sunbrella cushions. The modular design allows endless configuration options for your patio or poolside.",
    shortDescription: "5-piece aluminum outdoor set with Sunbrella cushions",
    price: 3299.99,
    originalPrice: 4299.99,
    category: "Outdoor",
    subcategory: "Lounge Sets",
    material: "Aluminum & Sunbrella",
    color: "Charcoal",
    style: "Contemporary",
    dimensions: "Sofa: 84\"W x 36\"D, Chairs: 32\"W x 34\"D, Table: 48\"W x 28\"D",
    weight: "195 lbs",
    inStock: true,
    stock: 4,
    rating: 4.5,
    numReviews: 42,
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200"
    ],
    variants: [
      { color: "Charcoal", material: "Aluminum & Sunbrella", price: 3299.99, stock: 4 },
      { color: "Sand", material: "Aluminum & Sunbrella", price: 3299.99, stock: 6 },
      { color: "Navy", material: "Aluminum & Sunbrella", price: 3499.99, stock: 3 }
    ],
    features: [
      "Weather-resistant aluminum frame",
      "Sunbrella fabric cushions",
      "Modular configuration options",
      "UV-resistant powder coating",
      "Quick-dry foam cushions",
      "10-year frame warranty"
    ],
    reviews: [
      { 
        _id: "rev_011", 
        user: "Thomas B.", 
        rating: 5, 
        title: "Resort-quality outdoor furniture",
        comment: "This set completely elevated our backyard. The cushions are incredibly comfortable and have held up beautifully through rain and sun. It feels like having a luxury resort at home.", 
        date: "2024-03-01",
        verified: true,
        helpful: 29
      }
    ],
    tags: ["outdoor", "patio", "lounge-set", "aluminum", "weather-resistant"],
    featured: false,
    trending: false,
    bestSeller: false,
    newArrival: true,
    onSale: true,
    createdAt: "2024-02-20T14:00:00.000Z",
    updatedAt: "2024-03-18T16:00:00.000Z"
  },
  {
    _id: "prod_009",
    name: "Modernist Bookshelf",
    slug: "modernist-bookshelf",
    description: "Display your literary collection in style with the Modernist Bookshelf. This architectural piece features an asymmetrical design with open shelving and concealed cabinets. Crafted from walnut veneer with a matte lacquer finish, it's both a functional storage solution and a sculptural work of art.",
    shortDescription: "Asymmetrical walnut bookshelf with concealed storage",
    price: 1199.99,
    originalPrice: 1499.99,
    category: "Living Room",
    subcategory: "Shelving",
    material: "Walnut Veneer",
    color: "Walnut",
    style: "Mid-Century Modern",
    dimensions: "72\"W x 16\"D x 78\"H",
    weight: "160 lbs",
    inStock: true,
    stock: 7,
    rating: 4.5,
    numReviews: 93,
    images: [
      "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=1200",
      "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=1200",
      "https://images.unsplash.com/photo-1585779034823-7e9ac8faec70?w=1200",
      "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=1200"
    ],
    variants: [
      { color: "Walnut", material: "Walnut Veneer", price: 1199.99, stock: 7 },
      { color: "White", material: "Lacquered MDF", price: 999.99, stock: 12 },
      { color: "Black", material: "Matte Lacquer", price: 1099.99, stock: 9 }
    ],
    features: [
      "Asymmetrical architectural design",
      "Walnut veneer construction",
      "Concealed storage cabinets",
      "Adjustable shelf heights",
      "Anti-tip hardware included",
      "Cable management openings"
    ],
    reviews: [
      { 
        _id: "rev_012", 
        user: "Rachel G.", 
        rating: 5, 
        title: "Functional art piece",
        comment: "This bookshelf is absolutely gorgeous. It's like having a piece of modern art that also stores all my books and collectibles. The walnut finish is rich and beautiful.", 
        date: "2024-02-15",
        verified: true,
        helpful: 33
      }
    ],
    tags: ["bookshelf", "walnut", "mid-century", "storage", "living-room", "display"],
    featured: true,
    trending: false,
    bestSeller: false,
    newArrival: false,
    onSale: true,
    createdAt: "2024-01-25T09:30:00.000Z",
    updatedAt: "2024-03-05T11:30:00.000Z"
  },
  {
    _id: "prod_010",
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
      "https://images.unsplash.com/photo-1584269600464-37a1b40bfb3c?w=1200",
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
    _id: "prod_011",
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
      "https://images.unsplash.com/photo-1594226711609-6be2dce5a1e8?w=1200",
      "https://images.unsplash.com/photo-1567606430628-fbeb6e5e4b4b?w=1200"
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
    _id: "prod_012",
    name: "Zen Meditation Floor Cushion Set",
    slug: "zen-meditation-floor-cushion-set",
    description: "Create your peaceful sanctuary with our Zen Meditation Floor Cushion Set. This 4-piece set includes a large round floor cushion, two rectangular zabutons, and a supportive zafu meditation pillow. Filled with organic buckwheat hulls and covered in soft organic cotton, these cushions provide the perfect foundation for your practice.",
    shortDescription: "4-piece organic meditation cushion set with buckwheat filling",
    price: 199.99,
    originalPrice: 279.99,
    category: "Decor",
    subcategory: "Cushions",
    material: "Organic Cotton",
    color: "Natural",
    style: "Bohemian",
    dimensions: "Large: 36\"D, Zabutons: 28\"W x 28\"D, Zafu: 14\"D x 6\"H",
    weight: "22 lbs",
    inStock: true,
    stock: 20,
    rating: 4.6,
    numReviews: 84,
    images: [
      "https://images.unsplash.com/photo-1600618528240-fb9fc964b7b4?w=1200",
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1200",
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=1200",
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=1200"
    ],
    variants: [
      { color: "Natural", material: "Organic Cotton", price: 199.99, stock: 20 },
      { color: "Sage Green", material: "Organic Cotton", price: 219.99, stock: 12 },
      { color: "Indigo", material: "Hemp Blend", price: 249.99, stock: 8 }
    ],
    features: [
      "Organic buckwheat hull filling",
      "GOTS certified organic cotton",
      "Removable, washable covers",
      "4-piece complete set",
      "Carry handles on large cushion",
      "Plastic-free packaging"
    ],
    reviews: [
      { 
        _id: "rev_016", 
        user: "David O.", 
        rating: 5, 
        title: "Perfect for home meditation",
        comment: "These cushions have made my meditation practice so much more comfortable. The buckwheat filling provides great support without being too firm. The organic materials are a big plus.", 
        date: "2024-03-05",
        verified: true,
        helpful: 25
      }
    ],
    tags: ["meditation", "cushions", "organic", "bohemian", "decor", "wellness"],
    featured: false,
    trending: false,
    bestSeller: false,
    newArrival: true,
    onSale: true,
    createdAt: "2024-02-28T15:00:00.000Z",
    updatedAt: "2024-03-15T17:00:00.000Z"
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
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=600",
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
  }
];

export const rooms = [
  {
    _id: "room_001",
    name: "Modern Loft Living",
    style: "Contemporary Industrial",
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
    description: "Open concept living with industrial accents and modern furnishings",
    products: ["prod_001", "prod_009"],
    tags: ["loft", "industrial", "open-concept"]
  },
  {
    _id: "room_002",
    name: "Serene Minimalist Bedroom",
    style: "Japanese Minimalism",
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800",
    description: "Peaceful bedroom retreat with clean lines and natural materials",
    products: ["prod_002", "prod_010"],
    tags: ["minimalist", "bedroom", "zen"]
  },
  {
    _id: "room_003",
    name: "Scandinavian Dining Room",
    style: "Nordic Modern",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800",
    description: "Bright, airy dining space with warm wood tones and simple elegance",
    products: ["prod_003", "prod_011"],
    tags: ["scandinavian", "dining", "bright"]
  },
  {
    _id: "room_004",
    name: "Glamorous Living Space",
    style: "Art Deco Luxury",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
    description: "Opulent living room featuring rich velvets, gold accents, and statement pieces",
    products: ["prod_005", "prod_007"],
    tags: ["luxury", "art-deco", "glamorous"]
  },
  {
    _id: "room_005",
    name: "Coastal Outdoor Oasis",
    style: "Coastal Contemporary",
    image: "https://images.unsplash.com/photo-1600210492491-094691112712?w=800",
    description: "Relaxed outdoor living with weather-resistant furniture and ocean-inspired palette",
    products: ["prod_008"],
    tags: ["outdoor", "coastal", "patio"]
  },
  {
    _id: "room_006",
    name: "Productive Home Office",
    style: "Modern Professional",
    image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800",
    description: "Efficient and stylish workspace designed for focus and creativity",
    products: ["prod_004"],
    tags: ["office", "productive", "ergonomic"]
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
    validUntil: "2024-12-31",
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
    validUntil: "2024-06-30",
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
    validUntil: "2024-12-31",
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
    validUntil: "2024-11-30",
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
    validUntil: "2024-12-31",
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