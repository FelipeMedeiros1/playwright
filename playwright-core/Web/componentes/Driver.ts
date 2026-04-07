import { Browser, BrowserContext, chromium, Page } from "@playwright/test";

export class Driver {
  private static browser: Browser;
  private static context: BrowserContext;
  private static page: Page;

  public static async getPage(): Promise<Page> {
    if (!this.browser) this.browser = await chromium.launch();
    if (!this.context) this.context = await this.browser.newContext();
    if (!this.page) this.page = await this.context.newPage();
    return this.page;
  }

  public static async close(): Promise<void> {
    await this.page?.close();
    await this.context?.close();
    await this.browser?.close();
  }
}
