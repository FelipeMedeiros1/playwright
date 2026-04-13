import { defineConfig, devices } from '@playwright/test';

const isCI    = !!process.env.CI;
const isDebug = process.env.DEBUG === 'true';
const showBrowser = !isCI;

export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/config/globalSetup.ts',
  outputDir: './reports/test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: isCI ? 1 : undefined,
  reporter: [
    ['html',              { outputFolder: 'reports/playwright-report', open: 'never' }],
    ['allure-playwright', { resultsDir: 'reports/allure-results', suiteTitle: true }],
  ],
  use: {
    headless: !showBrowser,
    viewport: { width: 1280, height: 720 },
    screenshot: 'on',
    video: isCI ? 'retain-on-failure' : 'on',
    baseURL: 'https://sua-url-aqui.com',
    trace: isCI ? 'on-first-retry' : 'off',
    launchOptions: { slowMo: isDebug ? 500 : 0 },
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'edge',     use: { ...devices['Desktop Edge'], channel: 'msedge' } },
  ],
});
