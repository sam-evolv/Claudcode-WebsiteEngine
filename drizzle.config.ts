import { defineConfig } from "drizzle-kit";

const DATABASE_URL = process.env.DATABASE_URL || "./data/database.db";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: DATABASE_URL,
  },
});
