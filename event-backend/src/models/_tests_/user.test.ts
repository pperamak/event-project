import { beforeAll, afterAll, beforeEach, describe, expect, test } from "vitest";
import bcrypt from "bcrypt";
import { sequelize } from "../../util/db.js";
import User from "../user.js";
import { UniqueConstraintError } from "sequelize";

describe("User model", () => {
  beforeAll(async () => {
    await sequelize.authenticate();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    // Truncate all tables between tests
    const tables = Object.keys(sequelize.models);
    for (const table of tables) {
      await sequelize.models[table].destroy({
        where: {},
        truncate: true,
        restartIdentity: true,
        cascade: true,
      });
    }
  });

  test("toSafeJSON should remove passwordHash", async () => {
    const user = await User.create({
      name: "Alice",
      email: "alice@example.com",
      passwordHash: "secret-hash",
    });

    const safe = user.toSafeJSON();
    expect(safe).not.toHaveProperty("passwordHash");
    expect(safe.email).toBe("alice@example.com");
  });

  test("creation should fail when email is not unique", async () => {
    await User.create({
      name: "Bob",
      email: "bob@example.com",
      passwordHash: "hash1",
    });

    await expect(
      User.create({
        name: "Duplicate",
        email: "bob@example.com",
        passwordHash: "hash2",
      })
    ).rejects.toBeInstanceOf(UniqueConstraintError);
  });

  test("passwordHash is stored and not the raw password", async () => {
    const rawPassword = "my-plain-password";
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    const user = await User.create({
      name: "Charlie",
      email: "charlie@example.com",
      passwordHash,
    });
    
    // Check DB persistence
    const stored = await User.findByPk(user.id);
    
    expect(stored).not.toBeNull();

    // Should not store raw password
    expect(stored!.passwordHash).not.toBe(rawPassword);

    // Hash should verify correctly
    const match = await bcrypt.compare(rawPassword, stored!.passwordHash);
    expect(match).toBe(true);
  });
});