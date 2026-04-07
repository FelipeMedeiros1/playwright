import { Locator, expect } from '@playwright/test';

export class ValidadorDeMensagem {

    static async sucesso(locator: Locator, textoEsperado: string) {
        if (await locator.isVisible()) {
            await expect(locator).toContainText(textoEsperado);
            console.log("Sucesso: " + textoEsperado);
        } else {
            throw new Error("Mensagem de sucesso não encontrada!");
        }
    }

    static async erro(locator: Locator, textoEsperado: string) {
        if (await locator.isVisible()) {
            await expect(locator).toContainText(textoEsperado);
            console.log("Erro esperado: " + textoEsperado);
        } else {
            throw new Error("Mensagem de erro não encontrada!");
        }
    }
}
