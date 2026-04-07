import { Page, Locator, expect } from '@playwright/test';

export class ComboBox {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async selecionar(locator: Locator, valor: string): Promise<void> {
    await expect(locator).toBeVisible();
    await locator.selectOption({ label: valor });
    const selected = await locator.inputValue();
    if (!selected) {
      throw new Error(`Valor "${valor}" não foi selecionado com sucesso.`);
    }
  }

  async selecionarPorId(id: string, valor: string): Promise<void> {
    const locator = this.page.locator(`#${id}`);
    await this.selecionar(locator, valor);
  }

  async selecionarVarios(locator: Locator, ...valores: string[]): Promise<void> {
    await expect(locator).toBeVisible();
    await locator.selectOption(valores.map(v => ({ label: v })));
  }

  async obterValor(locator: Locator): Promise<string> {
    return await locator.inputValue();
  }

  async obterValores(locator: Locator): Promise<string[]> {
    const options = await locator.locator('option:checked').allTextContents();
    return options.map(option => option.trim());
  }

  async contemOpcao(locator: Locator, opcao: string): Promise<boolean> {
    const allOptions = await locator.locator('option').allTextContents();
    return allOptions.includes(opcao);
  }

  async contarOpcoes(locator: Locator): Promise<number> {
    return await locator.locator('option').count();
  }

  // Simula pickList (caso use selects duplos e botões de mover itens)
  async pickList(idBase: string, valores: string[]): Promise<void> {
    const seletor = this.page.locator(`#${idBase}\\:firstSelect`);
    const incluirBtn = this.page.locator(`#${idBase}\\:includeSelected`);
    const excluirTodosBtn = this.page.locator(`#${idBase}\\:excludeAll`);

    await expect(seletor).toBeVisible();
    await excluirTodosBtn.click();

    await seletor.selectOption(valores.map(valor => ({ label: valor })));
    await incluirBtn.click();
  }
}
