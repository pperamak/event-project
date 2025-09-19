import { rollbackMigration } from "./db.js";

rollbackMigration()
  .then(() => console.log("Rollback done"))
  .catch(err => {
    console.error("Rollback failed:", err);
    process.exit(1);
  });

