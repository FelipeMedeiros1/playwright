import { Locator, Page, expect } from '@playwright/test';

export class Link {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async clicar(locator: Locator) {
    await expect(locator).toBeVisible();
    await expect(locator).toBeEnabled();
    await locator.scrollIntoViewIfNeeded();
    await locator.click();
  }

  async clicarPorTexto(texto: string) {
    const containers = ['header', 'footer', 'aside', 'main', 'nav'];
    for (const seletor of containers) {
      const locator = this.page.locator(seletor).getByRole('link', { name: texto, exact: true }).filter({ visible: true });
      if (await locator.count() === 1) {
        await this.clicar(locator);
        return;
      }
    }
    await this.clicar(this.page.getByRole('link', { name: texto, exact: true }));
  }

  async clicarPorTextoEm(seletor: string, texto: string) {
    const locator = this.page.locator(seletor).getByRole('link', { name: texto });
    await this.clicar(locator);
  }

  async clicarPorHref(href: string) {
    const locator = this.page.locator(`a[href="${href}"]`);
    await this.clicar(locator);
  }

  async clicarPorId(id: string) {
    const locator = this.page.locator(`#${id}`);
    await this.clicar(locator);
  }

  async clicarEmNovaAba(locator: Locator): Promise<Page> {
    await expect(locator).toBeVisible();
    await expect(locator).toBeEnabled();
    const [novaAba] = await Promise.all([
      this.page.context().waitForEvent('page'),
      locator.click(),
    ]);
    await novaAba.waitForLoadState('networkidle');
    await novaAba.bringToFront();
    return novaAba;
  }

  async clicarPorTextoEmNovaAba(texto: string): Promise<Page> {
    const containers = ['header', 'footer', 'aside', 'main', 'nav'];
    for (const seletor of containers) {
      const locator = this.page.locator(seletor).getByRole('link', { name: texto, exact: true }).filter({ visible: true });
      if (await locator.count() === 1) {
        return await this.clicarEmNovaAba(locator);
      }
    }
    return await this.clicarEmNovaAba(this.page.getByRole('link', { name: texto, exact: true }));
  }

  async obterHref(locator: Locator): Promise<string | null> {
    return await locator.getAttribute('href');
  }

  async obterHrefPorTexto(texto: string): Promise<string | null> {
    const locator = this.page.getByRole('link', { name: texto });
    return await locator.getAttribute('href');
  }
}
