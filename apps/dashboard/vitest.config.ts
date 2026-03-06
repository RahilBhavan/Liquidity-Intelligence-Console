import { defineConfig } from "vitest/config";
import path from "path";

/**
 * Vitest config for API route and unit tests.
 * Node environment for server/API code; path alias matches tsconfig.
 */
export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
