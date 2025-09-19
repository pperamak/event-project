import { Sequelize, QueryInterface } from "sequelize";
import { DATABASE_URL } from "./config.js";
import { Umzug, SequelizeStorage, MigrationParams } from "umzug";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sequelize = new Sequelize(DATABASE_URL);

interface MigrationModule {
  up: (context: QueryInterface, SequelizeLib: typeof Sequelize) => Promise<unknown>;
  down: (context: QueryInterface, SequelizeLib: typeof Sequelize) => Promise<unknown>;
};

const migrationConf = {
  migrations: {
    glob: path.join(__dirname, "../migrations/*.{ts,js}"),
    resolve: ({ name, path: migrationPath, context }: MigrationParams<QueryInterface>) => {
      if (!migrationPath) {
        throw new Error(`No path found for migration ${name}`);
      }

      return {
        name,
        up: async () => {
          const migration = (await import(migrationPath)) as MigrationModule;
          return migration.up(context, Sequelize);
        },
        down: async () => {
          const migration = (await import(migrationPath)) as MigrationModule;
          return migration.down(context, Sequelize);
        },
      };
    },
  },
  storage: new SequelizeStorage({ sequelize, tableName: "migrations" }),
  context: sequelize.getQueryInterface(),
  logger: console,
};


export const getMigrator = () => new Umzug(migrationConf);

export const runMigrations = async () => {
  const migrator = getMigrator();
  const migrations = await migrator.up();
  console.log("Migrations up to date", {
    files: migrations.map((mig) => mig.name),
  });
};

export const rollbackMigration = async () => {
  const migrator = getMigrator();
  await migrator.down();
};

export const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    if (process.env.NODE_ENV !== "test") {
      await runMigrations();
    }
    console.log("connected to the database");
  } catch (err) {
    console.error("failed to connect to the database:", err);
    process.exit(1);
  }
};

//export type Migration = typeof getMigrator._types.migration