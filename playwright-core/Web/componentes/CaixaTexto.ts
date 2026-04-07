import { Locator, Page, expect } from '@playwright/test';

export class CaixaTexto {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Preenche um campo com tentativas até garantir que foi persistido
   */
  async preencherCampo(locator: Locator, valor: string, tentativas = 5) {
    if (!valor || valor.trim() === '') return;

    await expect(locator).toBeVisible();
    await expect(locator).toBeEnabled();

    let sucesso = false;
    let tentativaAtual = 0;

    while (!sucesso && tentativaAtual < tentativas) {
      await locator.fill('');
      await locator.fill(valor);

      const valorAtual = await locator.inputValue();
      sucesso = valorAtual.trim() === valor.trim();

      tentativaAtual++;
    }

    if (!sucesso) {
      throw new Error(`Erro ao tentar preencher o valor "${valor}" no campo.`);
    }
  }

  /**
   * Preenche devagar, simulando digitação char a char
   */
  async preencherDevagar(locator: Locator, valor: string) {
    if (!valor || valor.trim() === '') return;

    await expect(locator).toBeVisible();
    await locator.fill('');

    for (let char of valor) {
      await locator.type(char);
    }

    await expect(locator).toHaveValue(valor);
  }

  /**
   * Preenche duas vezes (tipo workaround de flake)
   */
  async preencherDuplicado(locator: Locator, valor: string) {
    if (!valor || valor.trim() === '') return;

    for (let i = 0; i < 2; i++) {
      await locator.fill('');
      await locator.fill(valor);

      const preenchido = await locator.inputValue();
      if (preenchido === valor) return;

      await this.page.waitForTimeout(1000);
    }

    throw new Error(`Falha ao preencher o valor duplicado "${valor}"`);
  }

  /**
   * Obtém o valor atual de um campo
   */
  async obterValor(locator: Locator): Promise<string> {
    return await locator.inputValue();
  }
}
