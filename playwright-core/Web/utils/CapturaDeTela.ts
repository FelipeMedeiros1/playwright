import { Page } from '@playwright/test';

export class CapturaDeTela {

    static async capturarTela(page: Page, nome: string) {
        await page.screenshot({ path: `./evidencias/${nome}.png`, fullPage: true });
    }
}
