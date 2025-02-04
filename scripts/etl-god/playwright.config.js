import { defineConfig } from "playwright/test";

export default defineConfig({
  name: "quackprep-tests",
  testDir: "./tests/",
  outputDir: "test-results/",
});
