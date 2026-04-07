import { Page, expect } from '@playwright/test';

export class PainelMensagem {
    constructor(private page: Page) { }

    async esperarMensagemVisivel(texto: string) {
        const toast = this.page.locator(`text=${texto}`);
        await expect(toast).toBeVisible({ timeout: 5000 });
    }

    async fecharMensagem(texto: string) {
        const closeBtn = this.page.locator(`text=${texto} >> button.close`);
        if (await closeBtn.isVisible()) {
            await closeBtn.click();
        }
    }
}
