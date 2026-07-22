// Mock data for Eyara Essence
// Centralized product image URLs for easy updates later.
export const CATEGORIES = [
  "Amigurumis",
  "Keychains",
  "Bookmarks",
  "Earphone Cases",
  "Mini Card Holders",
  "Bracelets",
  "Headbands",
  "Bandanas",
  "Car Hangers",
  "Small Organizers"
];

export const PRODUCTS = [
  {
    id: "amig-01",
    name: "Cozy Crochet Bunny Plush",
    category: "Amigurumis",
    price: 899,
    originalPrice: 1099,
    description: "An adorable, ultra-soft handmade bunny plushie. Lovingly crocheted with premium velvet-soft yarn, making it the perfect cuddle companion or nursery decor piece.",
    images: [
      "https://images.unsplash.com/photo-1608889174653-81c9b6b3e1d6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80"
    ],
    colors: ["Off-white", "Blush Pink", "Sage Green"],
    stockStatus: "in-stock",
    featured: true,
    bestseller: true,
    rating: 4.9,
    reviewsCount: 24,
    details: [
      "100% premium polyester velvet yarn",
      "Safety eyes securely attached",
      "Height: approximately 25cm (including ears)",
      "Hypoallergenic poly-fill stuffing"
    ],
    careInstructions: "Gently hand wash in cold water with mild detergent. Lay flat on a dry towel to air dry. Do not wring or tumble dry."
  },
  {
    id: "amig-02",
    name: "Tiny Turtle Amigurumi",
    category: "Amigurumis",
    price: 499,
    originalPrice: null,
    description: "Meet Bubbles! This cute palm-sized crochet turtle features a beautiful textured shell. Perfect for desk decoration, room aesthetics, or a cute token of friendship.",
    images: [
      "https://images.unsplash.com/photo-1559251606-c623743a6d76?w=600&auto=format&fit=crop&q=80"
    ],
    colors: ["Sage Green", "Warm Beige", "Dusty Rose"],
    stockStatus: "in-stock",
    featured: false,
    bestseller: false,
    rating: 4.8,
    reviewsCount: 12,
    details: [
      "Organic combed cotton yarn",
      "Safety eyes attached",
      "Dimensions: 8cm x 7cm",
      "Compact and portable"
    ],
    careInstructions: "Spot clean only using a damp cloth and mild soap. Air dry away from direct sunlight."
  },
  {
    id: "key-01",
    name: "Blooming Daisy Keychain",
    category: "Keychains",
    price: 249,
    originalPrice: 299,
    description: "A delightful crocheted daisy flower charm with a golden key ring. Add a touch of natural, handmade spring aesthetic to your keys, bags, or backpack.",
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80"
    ],
    colors: ["Classic Yellow", "Soft Lavender", "Sky Blue"],
    stockStatus: "in-stock",
    featured: true,
    bestseller: true,
    rating: 4.7,
    reviewsCount: 48,
    details: [
      "Combed milk cotton yarn",
      "Sturdy gold-toned swivel clasp",
      "Diameter: 6cm",
      "Lightweight and stylish"
    ],
    careInstructions: "Spot clean with warm water and soap. Gently reshape the petals while damp."
  },
  {
    id: "key-02",
    name: "Sweet Strawberry Bag Charm",
    category: "Keychains",
    price: 229,
    originalPrice: null,
    description: "Add a pop of sweetness to your daily routine with this handcrafted crochet strawberry. Comes with green leaf accents and a sturdy clasp.",
    images: [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop&q=80"
    ],
    colors: ["Crimson Red", "Blush Pink"],
    stockStatus: "low-stock",
    featured: false,
    bestseller: false,
    rating: 4.6,
    reviewsCount: 18,
    details: [
      "100% cotton thread",
      "Filled with soft fiberfill",
      "Rust-proof silver lobster clasp",
      "Size: 5cm height"
    ],
    careInstructions: "Hand wash gently in cold water and air dry."
  },
  {
    id: "book-01",
    name: "Autumn Leaf Booksprout",
    category: "Bookmarks",
    price: 199,
    originalPrice: 249,
    description: "For the cozy bookworms. This unique bookmark features a long stem with a beautifully detailed maple leaf that hangs out of your closed book.",
    images: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80"
    ],
    colors: ["Terracotta", "Forest Green", "Mustard Yellow"],
    stockStatus: "in-stock",
    featured: true,
    bestseller: true,
    rating: 5.0,
    reviewsCount: 32,
    details: [
      "Fine cotton crochet thread",
      "Highly flexible and ultra-thin stem",
      "Total length: 30cm",
      "Perfect gift for avid readers"
    ],
    careInstructions: "Iron on low heat setting (under a protective cloth) to straighten out any folds or curls."
  },
  {
    id: "case-01",
    name: "Bear Earphone Cozy Sleeve",
    category: "Earphone Cases",
    price: 349,
    originalPrice: 399,
    description: "Keep your AirPods safe and stylish. This thick, shock-absorbing crochet sleeve features cute bear ears and a small opening at the bottom for easy charging.",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
    ],
    colors: ["Cocoa Brown", "Cream", "Warm Gray"],
    stockStatus: "in-stock",
    featured: true,
    bestseller: false,
    rating: 4.8,
    reviewsCount: 19,
    details: [
      "Double-stranded cotton yarn for impact protection",
      "Elastic band closure with a wooden button",
      "Charging port cutout at base",
      "Compatible with AirPods 1/2/Pro/3"
    ],
    careInstructions: "Wash by hand inside out. Dry flat to maintain shape."
  },
  {
    id: "card-01",
    name: "Woven Pastel Card Holder",
    category: "Mini Card Holders",
    price: 399,
    originalPrice: 499,
    description: "Ditch the bulky wallet. This compact card holder has a tight, woven stitch that securely holds up to 6 credit cards, folded cash, or business cards.",
    images: [
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&auto=format&fit=crop&q=80"
    ],
    colors: ["Sage Green", "Lavender", "Dusty Rose", "Oatmeal"],
    stockStatus: "in-stock",
    featured: true,
    bestseller: true,
    rating: 4.9,
    reviewsCount: 27,
    details: [
      "Heavyweight cotton-acrylic blend",
      "Tight non-stretch stitch pattern",
      "Size: 10.5cm x 7.5cm",
      "Handmade vintage pearl button latch"
    ],
    careInstructions: "Hand wash in cold water. Lay flat to dry."
  },
  {
    id: "brace-01",
    name: "Boho Daisy Chain Wristlet",
    category: "Bracelets",
    price: 180,
    originalPrice: null,
    description: "A delicate, vintage-inspired daisy chain bracelet. Adjustable slip-knot ties make it a perfect fit for any wrist, adding a touch of cottagecore aesthetic.",
    images: [
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&auto=format&fit=crop&q=80"
    ],
    colors: ["Classic Daisy", "Pastel Rainbow", "Vintage Earth"],
    stockStatus: "in-stock",
    featured: false,
    bestseller: true,
    rating: 4.7,
    reviewsCount: 39,
    details: [
      "Mercerized lace cotton thread",
      "Hypoallergenic skin-friendly fibers",
      "Adjustable length: 15cm to 22cm",
      "Tassel tie ends"
    ],
    careInstructions: "Avoid wearing while showering or swimming to prevent fading and fiber wear."
  },
  {
    id: "head-01",
    name: "Vintage Cable Knit Headband",
    category: "Headbands",
    price: 349,
    originalPrice: 449,
    description: "Keep your ears cozy and hair styled. This wide, stretch-fit headband features a beautiful cable pattern and a twist detail at the front.",
    images: [
      "https://images.unsplash.com/photo-1606744824163-985d376605aa?w=600&auto=format&fit=crop&q=80"
    ],
    colors: ["Cream", "Dusty Rose", "Oatmeal", "Forest Sage"],
    stockStatus: "in-stock",
    featured: false,
    bestseller: false,
    rating: 4.5,
    reviewsCount: 15,
    details: [
      "Soft premium acrylic yarn",
      "Highly elastic knit pattern",
      "Width: 10cm",
      "One size fits most adults"
    ],
    careInstructions: "Machine wash cold in a delicates laundry bag. Lay flat to dry."
  },
  {
    id: "band-01",
    name: "Retro Mesh Hair Bandana",
    category: "Bandanas",
    price: 499,
    originalPrice: 599,
    description: "The ultimate cottagecore accessory. This mesh bandana features a triangular design with beautiful scalloped borders and long straps for a perfect tie-back.",
    images: [
      "https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&auto=format&fit=crop&q=80"
    ],
    colors: ["Cream", "Tangerine Rust", "Sage Green"],
    stockStatus: "in-stock",
    featured: true,
    bestseller: true,
    rating: 4.9,
    reviewsCount: 31,
    details: [
      "100% organic cotton thread",
      "Lightweight, breathable lace mesh",
      "Triangular base width: 45cm",
      "Long ties for secure fitting"
    ],
    careInstructions: "Hand wash in cool water. Reshape and iron on low setting to straighten borders."
  },
  {
    id: "hang-01",
    name: "Mini Potted Plant Hanger",
    category: "Car Hangers",
    price: 299,
    originalPrice: 349,
    description: "Brighten up your drive! This cute crochet hanger features a mini potted trailing ivy plant that hangs gracefully from your car's rearview mirror.",
    images: [
      "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&auto=format&fit=crop&q=80"
    ],
    colors: ["Emerald Leaf", "Sage Leaf"],
    stockStatus: "in-stock",
    featured: true,
    bestseller: true,
    rating: 5.0,
    reviewsCount: 52,
    details: [
      "Fine cotton thread",
      "Adjustable hanging loop",
      "Total length: 22cm (loop included)",
      "Stuffed pot base to prevent swinging damage"
    ],
    careInstructions: "Gently dust occasionally. Spot clean if needed."
  },
  {
    id: "org-01",
    name: "Artisanal Desktop Nesting Basket",
    category: "Small Organizers",
    price: 449,
    originalPrice: 549,
    description: "A set of sturdy, double-walled crochet storage baskets. Perfect for organizing keys, jewelry, sewing supplies, or cosmetics on your vanity.",
    images: [
      "https://images.unsplash.com/photo-1531835551805-16d864c8d311?w=600&auto=format&fit=crop&q=80"
    ],
    colors: ["Warm Beige", "Oatmeal Combo", "Dusty Rose"],
    stockStatus: "in-stock",
    featured: false,
    bestseller: false,
    rating: 4.8,
    reviewsCount: 16,
    details: [
      "100% thick cotton rope-yarn",
      "Rigid double-walled construction",
      "Dimensions: Small (12cm dia), Medium (15cm dia)",
      "Stackable and space-saving"
    ],
    careInstructions: "Machine washable on gentle cycle. Shape while damp and let air dry."
  },
  {
    id: "org-02",
    name: "Cozy Trinket Tray Set",
    category: "Small Organizers",
    price: 379,
    originalPrice: null,
    description: "Add handmade elegance to your bedside table with these soft, flat-stitched circular trinket trays, perfect for rings, bracelets, and hairpins.",
    images: [
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80"
    ],
    colors: ["Cream & Gold", "Blush Pink & Brown"],
    stockStatus: "out-of-stock",
    featured: false,
    bestseller: false,
    rating: 4.6,
    reviewsCount: 8,
    details: [
      "Mercerized cotton with metallic highlight threads",
      "Firm, low-profile edges",
      "Set includes 2 matching sizes",
      "10cm and 13cm diameters"
    ],
    careInstructions: "Spot clean with a damp cloth. Dry flat."
  },
  {
    id: "amig-03",
    name: "Chubby Bee Amigurumi",
    category: "Amigurumis",
    price: 399,
    originalPrice: 449,
    description: "Bring a buzz of happiness to your day with this incredibly squishy, chubby bee amigurumi. Crocheted in bright cheerful stripes with soft white wings.",
    images: [
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80"
    ],
    colors: ["Classic Yellow", "Soft Peach"],
    stockStatus: "in-stock",
    featured: true,
    bestseller: true,
    rating: 4.9,
    reviewsCount: 38,
    details: [
      "Thick velvet chenille yarn",
      "Safety eyes and cheeks details",
      "Dimensions: 12cm length x 9cm width",
      "Comes with small hanging loop (optional)"
    ],
    careInstructions: "Hand wash with cold water. Squeeze out excess water gently. Do not wring."
  },
  {
    id: "hang-02",
    name: "Cute Sunflower Rearview Hanger",
    category: "Car Hangers",
    price: 279,
    originalPrice: null,
    description: "Keep the sun shining inside your car with this cheerful, bright crochet sunflower hanger. Lovingly hand-knitted with detailed petals and fuzzy seed center.",
    images: [
      "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=600&auto=format&fit=crop&q=80"
    ],
    colors: ["Sunny Yellow", "Sunset Orange"],
    stockStatus: "in-stock",
    featured: false,
    bestseller: true,
    rating: 4.8,
    reviewsCount: 22,
    details: [
      "Cotton-acrylic blended yarn",
      "Fadeproof colors",
      "Sunflower diameter: 8.5cm",
      "Total cord length: 25cm"
    ],
    careInstructions: "Dust regularly. Wash by hand in cold water if needed."
  }
];
