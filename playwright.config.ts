import { defineConfig, devices } from "@playwright/test";
import { existsSync } from "node:fs";

if (existsSync(".env")) {
  process.loadEnvFile();
}

const UI_BASE_URL = process.env.UI_BASE_URL ?? "https://www.saucedemo.com";
const API_BASE_URL = process.env.API_BASE_URL ?? "https://jsonplaceholder.typicode.com";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",

  use: {
    trace: "on-first-retry",
    testIdAttribute: "data-test",
  },

  projects: [
    {
      name: "api",
      testDir: "./tests/api/specs",
      use: { baseURL: API_BASE_URL },
    },
    {
      name: "ui",
      testDir: "./tests/ui/specs",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
        baseURL: UI_BASE_URL,
      },
    },
  ],
});
