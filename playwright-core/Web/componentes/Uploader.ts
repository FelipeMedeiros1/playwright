import { Page } from '@playwright/test';

export class Uploader {

    constructor(private page: Page) { }

    async fazerUpload(idInput: string, caminhoArquivo: string) {
        const input = this.page.locator(`#${idInput}`);
        await input.setInputFiles(caminhoArquivo);
    }
}
