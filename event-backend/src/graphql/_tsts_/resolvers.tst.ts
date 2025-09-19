
import { beforeAll, afterAll, beforeEach, describe, expect, test  } from "vitest";
import { ApolloServer } from "@apollo/server";
import { sequelize } from "../../util/db.js";
import User from "../../models/user.js";
import resolvers from "../resolvers.js";
import { typeDefs } from "../typeDefs.js";
import { makeExecutableSchema } from "@graphql-tools/schema";
import bcrypt from "bcrypt";
import { formatGraphQLError } from "../../util/errorFormatter.js";

// Create a typed schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create server instance (not listening, just for executeOperation)
let server: ApolloServer;

beforeAll(async () => {
  server = new ApolloServer({
     schema,
     formatError: formatGraphQLError 
    });
  await server.start();
});

afterAll(async () => {
  await server.stop();
});

beforeEach(async () => {
  const tables = Object.keys(sequelize.models);
  for (const table of tables) {
    await sequelize.models[table].destroy({ where: {}, truncate: true, restartIdentity: true });
  }
});


// Helper to unwrap executeOperation result safely
function getData<T>(
  result: Awaited<ReturnType<ApolloServer["executeOperation"]>>
): T {
  if ("body" in result) {
    const body = result.body;

    if (body.kind === "single") {
      const { data, errors } = body.singleResult as {
        data?: T;
        errors?: readonly { message: string }[];
      };

      if (errors && errors.length > 0) {
        throw new Error(errors[0].message);
        
      }
      return data as T;
    }
  }
  throw new Error("Unexpected result from executeOperation");
}

describe.skip("GraphQL resolvers: User flow", () => {
  test("createUser happy path", async () => {
    const mutation = `
      mutation {
        createUser(name: "Alice", email: "alice@example.com", password: "password123") {
          id
          name
          email
        }
      }
    `;
    const data = getData<{ createUser: { id: string; name: string; email: string } }>(
      await server.executeOperation({ query: mutation })
    );
    expect(data.createUser.name).toBe("Alice");
    expect(data.createUser.email).toBe("alice@example.com");
  });

  test("createUser uniqueness violation", async () => {
    await User.create({
      name: "Bob",
      email: "bob@example.com",
      passwordHash: "hashed",
    });

    const mutation = `
      mutation {
        createUser(name: "Bob", email: "bob@example.com", password: "anotherpass") {
          id
          name
          email
        }
      }
    `;

    await expect(async () => {
      getData(await server.executeOperation({ query: mutation }));
    }).rejects.toThrow(/unique/i);
  });

  test("login successful", async () => {
    //const u = await User.create({ name: "Test", email: "t@t.com", passwordHash: "xxx" });
    const password = "secret123";
    const passwordHash = await bcrypt.hash(password, 10);
    
    await User.create({
      name: "Charlie",
      email: "charlie@example.com",
      passwordHash,
    });

    const mutation = `
      mutation {
        login(email: "charlie@example.com", password: "secret123") {
          value
          user {
            id
            email
          }
        }
      }
    `;

    const data = getData<{
      login: { value: string; user: { id: string; email: string } };
    }>(await server.executeOperation({ query: mutation }));
    
    expect(data.login.user.email).toBe("charlie@example.com");
    expect(typeof data.login.value).toBe("string");
  });

  test("login failure: wrong password", async () => {
    const passwordHash = await bcrypt.hash("correctpass", 10);
    await User.create({
      name: "Dana",
      email: "dana@example.com",
      passwordHash,
    });

    const mutation = `
      mutation {
        login(email: "dana@example.com", password: "wrongpass") {
          value
          user { id email }
        }
      }
    `;

    await expect(async () => {
      getData(await server.executeOperation({ query: mutation }));
    }).rejects.toThrow(/wrong credentials/i);
  });

  test("login failure: unknown email", async () => {
    const mutation = `
      mutation {
        login(email: "ghost@example.com", password: "whatever") {
          value
          user { id email }
        }
      }
    `;

    await expect(async () => {
      getData(await server.executeOperation({ query: mutation }));
    }).rejects.toThrow(/wrong credentials/i);
  });

  test("allUsers returns the correct users", async () => {
    const users = [
      { name: "Eva", email: "eva@example.com", passwordHash: "hash1" },
      { name: "Frank", email: "frank@example.com", passwordHash: "hash2" },
    ];
    await User.bulkCreate(users);

    const query = `
      query {
        allUsers {
          id
          name
          email
        }
      }
    `;

    const data = getData<{ allUsers: { id: string; name: string; email: string }[] }>(
      await server.executeOperation({ query })
    );

    expect(data.allUsers).toHaveLength(2);
    const emails = data.allUsers.map(u => u.email);
    expect(emails).toContain("eva@example.com");
    expect(emails).toContain("frank@example.com");
  });
});



