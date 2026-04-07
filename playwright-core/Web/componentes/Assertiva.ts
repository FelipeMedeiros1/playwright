import { expect, Locator, Page } from '@playwright/test';

export class Assertiva {
    constructor(private readonly page: Page) { }

    /**
     * Verifica se o elemento está visível
     */
    async estaVisivel(locator: Locator) {
        await expect(locator).toBeVisible({ timeout: 10000 });
        await expect(locator).toBeVisible();
    }

    /**
     * Verifica se o elemento está invisível
     */
    async estaInvisivel(locator: Locator) {
        await expect(locator).toBeHidden();
    }

    /**
     * Verifica se o texto está presente no elemento
     */
    async contemTexto(locator: Locator, texto: string) {
        await expect(locator).toBeVisible({ timeout: 10000 });
        await expect(locator).toContainText(texto);
    }

    /**
     * Verifica se o texto é exatamente igual
     */
    async textoExato(locator: Locator, texto: string) {
        await expect(locator).toBeVisible({ timeout: 10000 });
        await expect(locator).toHaveText(texto);
    }

    /**
     * Verifica se o campo está preenchido com determinado valor
     */
    async valorDoCampo(locator: Locator, valorEsperado: string) {
        await expect(locator).toBeVisible({ timeout: 10000 });
        await expect(locator).toHaveValue(valorEsperado);
    }

    /**
     * Verifica se o elemento tem determinado atributo com valor
     */
    async temAtributoComValor(locator: Locator, atributo: string, valor: string) {
        await expect(locator).toBeVisible({ timeout: 10000 });
        await expect(locator).toHaveAttribute(atributo, valor);
    }

    /**
     * Verifica se a URL atual contém determinado trecho
     */
    async urlContem(texto: string) {
        await expect(this.page).toHaveURL(new RegExp(texto));
    }

    /**
     * Verifica se a URL atual é exatamente igual à esperada
     */
    async urlExata(urlEsperada: string) {
        await expect(this.page).toHaveURL(urlEsperada);
    }

    /**
     * Verifica se o título da página contém texto
     */
    async tituloContem(texto: string) {
        await expect(this.page).toHaveTitle(new RegExp(texto));
    }

    /**
     * Verifica se o elemento está habilitado
     */
    async estaHabilitado(locator: Locator) {
        await expect(locator).toBeVisible({ timeout: 10000 });
        await expect(locator).toBeEnabled();
    }

    /**
     * Verifica se o elemento está desabilitado
     */
    async estaDesabilitado(locator: Locator) {
        await expect(locator).toBeVisible({ timeout: 10000 });
        await expect(locator).toBeDisabled();
    }

    /**
     * Verifica se checkbox está marcado
     */
    async checkboxMarcado(locator: Locator) {
        await expect(locator).toBeVisible({ timeout: 10000 });
        await expect(locator).toBeChecked();
    }

    /**
     * Verifica se checkbox está desmarcado
     */
    async checkboxDesmarcado(locator: Locator) {
        await expect(locator).toBeVisible({ timeout: 10000 });
        await expect(locator).not.toBeChecked();
    }

    /**
     * Verifica se o número de elementos encontrados é exatamente igual ao esperado
     */
    async quantidadeDeElementos(locator: Locator, quantidadeEsperada: number) {
        await expect(locator).toBeVisible({ timeout: 10000 });
        await expect(locator).toHaveCount(quantidadeEsperada);
    }
}
