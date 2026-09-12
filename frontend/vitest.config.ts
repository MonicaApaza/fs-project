import { defineConfig, configDefaults } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    exclude: [...configDefaults.exclude, "e2e/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/TaskUtil.tsx", "src/components/TaskInput.tsx"],
      exclude: [
        "src/main.tsx",
        "src/vite-env.d.ts",
        "src/test/**",
        "**/*.test.{ts,tsx}",
      ],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 75,
        statements: 90,
      },
    },
  },
});
