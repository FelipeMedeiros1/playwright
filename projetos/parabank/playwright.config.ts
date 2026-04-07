import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;
const isDebug = process.env.DEBUG === 'true';
const showBrowser = !isCI;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: 'html',

  use: {
    headless: !showBrowser,
    viewport: { width: 1280, height: 720 },
    screenshot: 'only-on-failure',
    video: isCI ? 'retain-on-failure' : 'on',
    baseURL: 'http://parabank.parasoft.com/parabank',
    trace: isCI ? 'on-first-retry' : 'off',
    launchOptions: {
      slowMo: isDebug ? 500 : 0,
    },
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'edge', use: { ...devices['Desktop Edge'], channel: 'msedge' } },
  ],
});

