import { Page, Locator, expect } from '@playwright/test';

export class Espera {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Espera até que o elemento esteja visível
     */
    async esperarElementoVisivel(locator: Locator) {
        await expect(locator).toBeVisible({ timeout: 10000 });
    }

    /**
     * Espera até que o elemento esteja clicável (visível + habilitado)
     */
    async esperarElementoClicavel(locator: Locator) {
        await this.esperarElementoVisivel;
        await this.esperarElementoHabilitado(locator);
    }

    async esperarConterTexto(locator:Locator, texto: string){
        await expect(locator).toContainText(texto);
    }

    /**
     * Espera até que a página esteja carregada
     */
    async esperarPaginaCarregar() {
        await this.page.waitForLoadState('load');
    }

    /**
     * Espera por X milissegundos
     */
    async esperarPor(ms: number) {
        await this.page.waitForTimeout(ms);
    }

    /**
     * Espera até que o campo contenha o valor esperado
     */
    async esperarTextoNoCampo(locator: Locator, texto: string) {
        await expect(locator).toHaveValue(texto, { timeout: 2000 });
    }
  
    async esperarTextoExato(locator: Locator, texto: string) {
        await expect(locator).toHaveText(texto, { timeout: 2000 });
    }

    /**
     * Espera até que o elemento tenha o atributo com valor esperado
     */
    async esperarAtributoComValor(locator: Locator, atributo: string, valor: string) {
        await expect(locator).toHaveAttribute(atributo, valor, { timeout: 2000 });
    }

    /**
     * Espera até que o elemento esteja habilitado (não disabled e visível)
     */
    async esperarElementoHabilitado(locator: Locator) {
        await expect(locator).toBeEnabled({ timeout: 10000 });
    }

    /**
     * Espera AJAX terminar baseado no jQuery.active
     * (Somente funciona se jQuery está no DOM)
     */
    async esperarAjaxTerminar() {
        await this.page.waitForFunction(() => (window as any).jQuery?.active === 0, null, {
            timeout: 15000,
        });
    }

    /**
     * Espera até que o elemento com classe rf-st-start não esteja visível
     */
    async esperarAjaxLoaderSumir() {
        const loader = this.page.locator('.rf-st-start');
        try {
            await expect(loader).toBeHidden({ timeout: 10000 });
        } catch {
            // Ignora se não existir
        }
    }

    /**
     * Espera até que o painel de "mensagemAguarde" não esteja mais visível
     */
    async esperarMensagemAguardeSumir() {
        const aguarde = this.page.locator('#mensagemAguarde');
        try {
            await expect(aguarde).toBeHidden({ timeout: 10000 });
        } catch {
            // Ignora se não existir
        }
    }

    async esperarAjaxCompleto() {
        await this.esperarAjaxTerminar();
        await this.esperarAjaxLoaderSumir();
        await this.esperarMensagemAguardeSumir();
    }


}
