import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const databaseUrl = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_pay1mTgz2qSi@ep-fancy-voice-b52wvbws-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require';
const sql = neon(databaseUrl);

async function seed() {
  console.log("🌱 Seeding Neon PostgreSQL Database...");
  const superAdminPassword = await bcrypt.hash('admin123', 10);

  try {
    await sql`
      INSERT INTO users (id, email, phone, password_hash, full_name, role)
      VALUES ('usr-admin-01', 'admin@ggllive.in', '+919876543210', ${superAdminPassword}, 'Executive Admin', 'SUPER_ADMIN')
      ON CONFLICT (id) DO NOTHING;
    `;
    console.log("🎉 Database seed completed!");
  } catch (err) {
    console.error("Seed error:", err);
  }
}

seed();
