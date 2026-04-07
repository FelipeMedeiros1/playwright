import { Page, Locator } from '@playwright/test';

export class Tabela {
    constructor(private page: Page) { }

    async clicarNaLinhaComTexto(tabela: Locator, texto: string, seletorBotao: string) {
        const linha = tabela.locator(`tr:has-text("${texto}")`);
        const botao = linha.locator(seletorBotao);
        await botao.click();
    }

    async contarLinhas(tabela: Locator): Promise<number> {
        return await tabela.locator('tr').count();
    }

    async verificarTextoNaLinha(tabela: Locator, texto: string): Promise<boolean> {
        return await tabela.locator(`tr:has-text("${texto}")`).isVisible();
    }
}
