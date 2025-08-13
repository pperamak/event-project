import { rollbackMigration } from "./db";

rollbackMigration()
  .then(() => console.log("Rollback done"))
  .catch(err => {
    console.error("Rollback failed:", err);
    process.exit(1);
  });

