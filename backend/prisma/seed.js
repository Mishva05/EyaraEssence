import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "@prisma/client";
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
  { name: "Car Hangers", slug: "car-hangers", description: "Charming crochet accessories for your car rear view mirror." },
  { name: "Small Organizers", slug: "small-organizers", description: "Handy crochet baskets and pouches for small items." }
];

async function main() {
  console.log("Seeding database categories...");
  for (const cat of categories) {
    const upserted = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: { name: cat.name, slug: cat.slug, description: cat.description }
    });
    console.log(`Upserted category: ${upserted.name}`);
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
