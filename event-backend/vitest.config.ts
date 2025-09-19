import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: "./src/tests/setup.ts",
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
    typecheck: {
    tsconfig: "./tsconfig.test.json",
  },
  sequence: {
    concurrent: false
  },
  },
});