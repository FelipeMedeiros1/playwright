import { Page } from '@playwright/test';

export class Dialog {
    constructor(private page: Page) { }

    escutarConfirmacao(aceitar = true) {
        this.page.on('dialog', async dialog => {
            if (aceitar) {
                await dialog.accept();
            } else {
                await dialog.dismiss();
            }
        });
    }
}
