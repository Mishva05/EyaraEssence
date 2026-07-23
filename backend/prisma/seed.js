import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "@prisma/client";
import bcrypt from "bcryptjs";

const { PrismaClient } = pkg;

const connectionString = process.env.DATABASE_URL;

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const categories = [
  { name: "Amigurumis", slug: "amigurumis", description: "Handcrafted crochet stuffed toys and plushies." },
  { name: "Keychains", slug: "keychains", description: "Cute and durable handmade crochet keychains." },
  { name: "Bookmarks", slug: "bookmarks", description: "Charming crochet bookmarks for book lovers." },
  { name: "Earphone Cases", slug: "earphone-cases", description: "Protective and stylish crochet earphone sleeves." },
  { name: "Mini Card Holders", slug: "mini-card-holders", description: "Compact crochet card holders for daily essentials." },
  { name: "Bracelets", slug: "bracelets", description: "Beautifully woven handmade crochet bracelets." },
  { name: "Headbands", slug: "headbands", description: "Soft and comfortable crochet hair headbands." },
  { name: "Bandanas", slug: "bandanas", description: "Trendy crochet bandanas and hair kerchiefs." },
  { name: "Car Hangers", slug: "car-hangers", description: "Charming crochet accessories for your car rearview mirror." },
  { name: "Small Organizers", slug: "small-organizers", description: "Handy crochet baskets and pouches for small items." }
];

async function main() {
  // 1. Seed Categories
  console.log("Seeding database categories...");
  const seededCategories = {};
  for (const cat of categories) {
    const upserted = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: { name: cat.name, slug: cat.slug, description: cat.description }
    });
    seededCategories[cat.slug] = upserted.id;
    console.log(`Upserted category: ${upserted.name}`);
  }

  // 2. Seed Admin User
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    console.log(`Seeding admin account: ${adminEmail}...`);
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    const adminUser = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        name: "Administrator",
        passwordHash,
        role: "ADMIN",
        isActive: true
      },
      create: {
        name: "Administrator",
        email: adminEmail,
        passwordHash,
        role: "ADMIN",
        isActive: true
      }
    });
    console.log(`Upserted admin: ${adminUser.email}`);
  } else {
    console.log("Skipping admin seeding (ADMIN_EMAIL or ADMIN_PASSWORD not configured in environment)");
  }

  // 3. Seed Sample Products with Variants
  console.log("Seeding sample products with variants...");
  
  const bunnyCategoryId = seededCategories["amigurumis"];
  const keychainCategoryId = seededCategories["keychains"];

  if (bunnyCategoryId) {
    // Bunny Plush
    const bunnySlug = "cozy-crochet-bunny-plush";
    const existingBunny = await prisma.product.findUnique({
      where: { slug: bunnySlug }
    });

    if (!existingBunny) {
      const bunny = await prisma.product.create({
        data: {
          name: "Cozy Crochet Bunny Plush",
          slug: bunnySlug,
          description: "An adorable, ultra-soft handmade bunny plushie. Lovingly crocheted with premium velvet-soft yarn, making it the perfect cuddle companion or nursery decor piece.",
          price: 899.00,
          compareAtPrice: 1099.00,
          sku: "SKU-BUNNY-01",
          stock: 22, // sum of variants
          categoryId: bunnyCategoryId,
          isActive: true,
          isFeatured: true,
          isBestseller: true,
          details: [
            "100% premium polyester velvet yarn",
            "Safety eyes securely attached",
            "Height: approximately 25cm (including ears)",
            "Hypoallergenic poly-fill stuffing"
          ],
          careInstructions: "Gently hand wash in cold water with mild detergent. Lay flat on a dry towel to air dry. Do not wring or tumble dry.",
          variants: {
            create: [
              { color: "Off-white", stock: 8, sku: "SKU-BUNNY-WH", isActive: true },
              { color: "Blush Pink", stock: 4, sku: "SKU-BUNNY-PK", isActive: true },
              { color: "Sage Green", stock: 10, sku: "SKU-BUNNY-GR", isActive: true }
            ]
          },
          images: {
            create: [
              { url: "https://images.unsplash.com/photo-1608889174653-81c9b6b3e1d6?w=600&auto=format&fit=crop&q=80", altText: "White Bunny Front View", sortOrder: 1, isPrimary: true },
              { url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80", altText: "Bunny Side Profile", sortOrder: 2 }
            ]
          }
        }
      });
      console.log(`Seeded product: ${bunny.name}`);
    } else {
      console.log(`Product already exists: ${bunnySlug}`);
    }
  }

  if (keychainCategoryId) {
    // Daisy Keychain
    const daisySlug = "blooming-daisy-keychain";
    const existingDaisy = await prisma.product.findUnique({
      where: { slug: daisySlug }
    });

    if (!existingDaisy) {
      const daisy = await prisma.product.create({
        data: {
          name: "Blooming Daisy Keychain",
          slug: daisySlug,
          description: "A delightful crocheted daisy flower charm with a golden key ring. Add a touch of natural, handmade spring aesthetic to your keys, bags, or backpack.",
          price: 249.00,
          compareAtPrice: 299.00,
          sku: "SKU-DAISY-01",
          stock: 17,
          categoryId: keychainCategoryId,
          isActive: true,
          isFeatured: true,
          isBestseller: true,
          details: [
            "Combed milk cotton yarn",
            "Sturdy gold-toned swivel clasp",
            "Diameter: 6cm",
            "Lightweight and stylish"
          ],
          careInstructions: "Spot clean with warm water and soap. Gently reshape the petals while damp.",
          variants: {
            create: [
              { color: "Classic Yellow", stock: 12, sku: "SKU-DAISY-YL", isActive: true },
              { color: "Soft Lavender", stock: 0, sku: "SKU-DAISY-LV", isActive: true },
              { color: "Sky Blue", stock: 5, sku: "SKU-DAISY-BL", isActive: true }
            ]
          },
          images: {
            create: [
              { url: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80", altText: "Yellow Daisy Keychain", sortOrder: 1, isPrimary: true }
            ]
          }
        }
      });
      console.log(`Seeded product: ${daisy.name}`);
    } else {
      console.log(`Product already exists: ${daisySlug}`);
    }
  }

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("Error during database seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
