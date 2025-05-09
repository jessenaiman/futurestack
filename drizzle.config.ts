import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config({ path: '.env' });

export default defineConfig({
    schema: "./src/db/schema.ts",
    out: "./migrations",
    driver: "pg",
    dbCredentials: {
        connectionString: process.env.DATABASE_URL!,
    },
    // Specific tables for our stack
    verbose: true,
    strict: true,
});