import { Page, Locator, expect } from '@playwright/test';

export class CheckkBox {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Marca ou desmarca o checkbox com base no valor booleano.
   */
  async selecionar(locator: Locator, estado: boolean): Promise<void> {
    const isChecked = await locator.isChecked();

    if (estado && !isChecked) {
      await locator.check();
    }

    if (!estado && isChecked) {
      await locator.uncheck();
    }

    // Espera para simular AJAX ou evento de binding
    await this.page.waitForTimeout(1000);
  }

  /**
   * Marca ou desmarca checkbox pelo ID.
   */
  async selecionarPorId(id: string, estado: boolean): Promise<void> {
    const locator = this.page.locator(`#${id}`);
    await this.selecionar(locator, estado);
  }

  /**
   * Clica no checkbox sem verificar estado atual.
   */
  async alternar(id: string): Promise<void> {
    await this.page.locator(`#${id}`).click();
  }

  /**
   * Verifica se um checkbox está selecionado.
   */
  async estaSelecionado(locator: Locator): Promise<boolean> {
    return await locator.isChecked();
  }

  async estaSelecionadoPorId(id: string): Promise<boolean> {
    return await this.page.locator(`#${id}`).isChecked();
  }

  /**
   * Seleciona um item de select pelo índice (não é comum pra checkbox, mas mantendo conforme seu Java)
   */
  async selecionarIndexEmSelect(locator: Locator, index: number): Promise<void> {
    await locator.selectOption({ index });
  }
}
