import { defineConfig } from "playwright/test";

export default defineConfig({
  name: "etl-god-tests",
  testDir: "./tests/",
  outputDir: "test-results/",
});
