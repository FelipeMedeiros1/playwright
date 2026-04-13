import { test as base, Page, BrowserContext } from '@playwright/test';

type TestFixtures = {
  pagina: Page;
  contexto: BrowserContext;
};

export const test = base.extend<TestFixtures>({
  pagina:   async ({ page },    use) => { await use(page);    },
  contexto: async ({ context }, use) => { await use(context); },
});

export { expect } from '@playwright/test';
