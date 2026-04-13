import { expect, Locator, Page } from '@playwright/test';

export class Assertiva {
    constructor(private readonly page: Page) { }

    /**
     * Verifica se o elemento está visível.
     * Retorna boolean — pode ser usado como assertiva ou em condicionais (if).
     * @example
     * await this.assertiva.estaVisivel(this.msg);             // assertiva
     * if (await this.assertiva.estaVisivel(this.botaoFechar)) // condicional
     */
    async estaVisivel(locator: Locator): Promise<boolean> {
        try {
            await expect(locator).toBeVisible({ timeout: 2000 });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Verifica se o elemento está invisível/oculto.
     * Retorna boolean — pode ser usado como assertiva ou em condicionais (if).
     * @example
     * await this.assertiva.estaInvisivel(this.modal);             // assertiva
     * if (await this.assertiva.estaInvisivel(this.modal)) { ... } // condicional
     */
    async estaInvisivel(locator: Locator): Promise<boolean> {
        try {
            await expect(locator).toBeHidden({ timeout: 2000 });
            return true;
        } catch {
            return false;
        }
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

    /**
     * Verifica se o texto do elemento começa com o valor informado
     */
    async comecaCom(locator: Locator, texto: string) {
        await expect(locator).toBeVisible({ timeout: 10000 });
        await expect(locator).toHaveText(new RegExp(`^${texto}`));
    }

    /**
     * Verifica se o texto do elemento termina com o valor informado
     */
    async terminaCom(locator: Locator, texto: string) {
        await expect(locator).toBeVisible({ timeout: 10000 });
        await expect(locator).toHaveText(new RegExp(`${texto}$`));
    }
}
