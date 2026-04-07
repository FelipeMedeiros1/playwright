import { test as base, Page, BrowserContext } from '@playwright/test';
import PaginaDeLogin from '../paginas/login/PaginaDeLogin';
import { Assertiva } from 'playwright-core';

type TestFixtures = {
  pagina: Page;
  contexto: BrowserContext;
  Login: PaginaDeLogin;
  assertiva: Assertiva;
};

export const test = base.extend<TestFixtures>({
  pagina: async ({ page }, use) => {
      await use(page);
  },

  contexto: async ({ context }, use) => {
      await use(context);
  },

  Login: async ({ page }, use) => {
      await use(new PaginaDeLogin(page));
  },

    assertiva: async ({ page }, use) => {
        await use(new Assertiva(page));
    },

});

export { expect } from '@playwright/test';
