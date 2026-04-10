import { test as base, Page, BrowserContext, TestInfo } from '@playwright/test';
import { AllureHelper as evidencia } from '../utils/AllureHelper';

export type BaseFixtures = {
    pagina: Page;
    contexto: BrowserContext;
};

async function anexarScreenshot(page: Page, testInfo: TestInfo) {
    try {
        const screenshot = await page.screenshot({ fullPage: true });
        await testInfo.attach('screenshot', { body: screenshot, contentType: 'image/png' });
    } catch { /* página pode ter fechado */ }
}

export const test = base.extend<BaseFixtures>({

    pagina: async ({ page }, use, testInfo) => {
        await use(page);
        await evidencia.step('Screenshot final', async () => {
            await anexarScreenshot(page, testInfo);
        });
    },

    contexto: async ({ context }, use) => {
        await use(context);
    },

});

export { expect } from '@playwright/test';

