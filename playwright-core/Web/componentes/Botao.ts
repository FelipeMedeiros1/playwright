import { Locator, Page, expect, Keyboard } from '@playwright/test';

export class Botao {
  private readonly page: Page;
  private readonly keyboard: Keyboard;

  constructor(page: Page) {
    this.page = page;
    this.keyboard = page.keyboard;
  }


  async clicar(locator: Locator) {
    await expect(locator).toBeVisible();
    await expect(locator).toBeEnabled();

    await locator.scrollIntoViewIfNeeded();
    await locator.click();
  }


  async clicarPorId(id: string) {
    const locator = this.page.locator(`#${id}`);
    await this.clicar(locator);
  }


  async clicarComTeclas(locator: Locator, keys: string[]) {
    await locator.click();
    for (const key of keys) {
      await this.keyboard.down(key);
    }
    for (const key of keys.reverse()) {
      await this.keyboard.up(key);
    }
  }


  async duploClique(locator: Locator) {
    for (let tentativa = 0; tentativa < 10; tentativa++) {
      try {
        await expect(locator).toBeVisible();
        await expect(locator).toBeEnabled();
        await locator.dblclick();
        return;
      } catch (err) {
        console.log(`Tentativa ${tentativa + 1} falhou, tentando novamente...`);
        await this.page.waitForTimeout(1000);
      }
    }
    throw new Error(`Não foi possível realizar o duplo clique no elemento após 10 tentativas`);
  }


  async clickEmMenuComSubmodulo(menu: Locator, modulo: Locator, pagina: Locator) {
    await menu.hover();
    await modulo.hover();
    await pagina.click();
    await this.page.waitForTimeout(1500);
  }

  async obterValor(locator: Locator, atributo: string): Promise<string | null> {
    return await locator.getAttribute(atributo);
  }

  async obterValorPorId(id: string, atributo: string): Promise<string | null> {
    return await this.page.locator(`#${id}`).getAttribute(atributo);
  }
}
