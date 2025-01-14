import { defineConfig } from "playwright/test";

export default defineConfig({
  name: "quackprep-tests",
  testDir: "./tests/",
  webServer: {
    reuseExistingServer: true,
    command: "npm run dev",
    url: "http://localhost:3001/",
    timeout: 120000,
  },
  use: {
    baseURL: "http://localhost:3001/",
  },
});
