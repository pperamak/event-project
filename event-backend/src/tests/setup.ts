import { beforeAll, afterAll } from "vitest";
import { sequelize } from "../util/db.js";

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  await sequelize.authenticate();

  // Run migrations **once for the whole test suite**
  /*const migrator = getMigrator();
  await migrator.up();
  */
});

afterAll(async () => {
  
  await sequelize.close();
});