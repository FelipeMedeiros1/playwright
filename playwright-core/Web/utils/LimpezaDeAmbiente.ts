import { Page } from '@playwright/test';

export class LimpezaDeAmbiente {
    static async limparTudo(page: Page) {
        await page.context().clearCookies();
        await page.evaluate(() => localStorage.clear());
        await page.evaluate(() => sessionStorage.clear());
    }
}
