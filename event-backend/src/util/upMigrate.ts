import { runMigrations } from "./db.js";

async function main() {
  process.env.NODE_ENV = process.env.NODE_ENV || "test";

  try {
    await runMigrations();
    console.log("Migrations completed successfully");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Unexpected top-level error:", err);
  process.exit(1);
});