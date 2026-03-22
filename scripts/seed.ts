import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import bcrypt from "bcryptjs";
import { users } from "../src/lib/db/schema";

async function seed() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
  });
  const db = drizzle(pool);

  const seedUsers = [
    { name: "Andri", username: "andri", password: "changeme1" },
    { name: "Panpan", username: "panpan", password: "changeme2" },
    { name: "Amma Lulu", username: "lulu", password: "changeme3" },
  ];

  for (const user of seedUsers) {
    const passwordHash = await bcrypt.hash(user.password, 10);
    await db
      .insert(users)
      .values({
        name: user.name,
        username: user.username,
        passwordHash,
      })
      .onConflictDoNothing({ target: users.username });

    console.log(`Seeded user: ${user.name} (${user.username})`);
  }

  console.log("Seeding complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
