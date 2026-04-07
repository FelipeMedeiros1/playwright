import { Page, Locator } from '@playwright/test';

export class Calendario {
    constructor(private page: Page) { }

    async selecionarData(locator: Locator, data: string) {
        await locator.click();
        await this.page.locator(`text="${data}"`).click();
    }
}
