import { Page } from '@playwright/test';

export class AtalhoHelper {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
    * Pressiona Enter
    */
    async pressionarEnter(tentativas = 3) {
        let sucesso = false;

        for (let i = 0; i < tentativas; i++) {
            try {
                await this.page.keyboard.press('Enter');
                sucesso = true;
                break;
            } catch (e) {
                await this.page.waitForTimeout(500);
            }
        }

        if (!sucesso) {
            throw new Error(`Não foi possível pressionar Enter após ${tentativas} tentativas.`);
        }
    }

    /**
     * Pressiona Tab
     */
    async pressionarTab(tentativas = 3) {
        let sucesso = false;

        for (let i = 0; i < tentativas; i++) {
            try {
                await this.page.keyboard.press('Tab');
                sucesso = true;
                break;
            } catch (e) {
                await this.page.waitForTimeout(500);
            }
        }

        if (!sucesso) {
            throw new Error(`Não foi possível pressionar Tab após ${tentativas} tentativas.`);
        }
    }



    /**
     * Pressiona Ctrl + letra
     */
    async pressionarCtrlMais(letra: string, tentativas = 10) {
        await this._pressionarComTeclaModificadora('Control', letra, tentativas);
    }

    /**
     * Pressiona Alt + letra
     */
    async pressionarAltMais(letra: string, tentativas = 10) {
        await this._pressionarComTeclaModificadora('Alt', letra, tentativas);
    }

    /**
     * Pressiona uma combinação com modificador (Ctrl ou Alt)
     */
    private async _pressionarComTeclaModificadora(modKey: 'Control' | 'Alt', letra: string, tentativas: number) {
        let sucesso = false;
        for (let i = 0; i < tentativas; i++) {
            try {
                const body = this.page.locator('body');
                await body.waitFor({ state: 'visible', timeout: 3000 });

                await this.page.keyboard.down(modKey);
                await this.page.keyboard.press(letra);
                await this.page.keyboard.up(modKey);

                sucesso = true;
                break;
            } catch (e) {
                await this.page.waitForTimeout(1000);
            }
        }

        if (!sucesso) {
            throw new Error(`Não foi possível pressionar ${modKey} + ${letra} após ${tentativas} tentativas.`);
        }
    }
}
