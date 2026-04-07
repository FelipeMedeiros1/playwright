import { defineConfig, devices } from '@playwright/test';

// Detecta se está rodando em CI
const isCI = !!process.env.CI;

// Flag de debug para desacelerar execução
const isDebug = process.env.DEBUG === 'true';

// Se estiver local, mostra browser
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
    screenshot: 'only-on-failure',//'only-on-failure'
    video: isCI ? 'retain-on-failure' : 'on',
    baseURL: 'http://parabank.parasoft.com/parabank',
    trace: isCI ? 'on-first-retry' : 'off',
    launchOptions: {
      slowMo: isDebug ? 500 : 0, // Só desacelera se DEBUG=true
    },
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
