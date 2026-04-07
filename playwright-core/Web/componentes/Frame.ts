import { Page, Frame } from '@playwright/test';

export class GerenciadorDeFrames {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Entra em um frame pelo nome ou ID declarado no HTML
   */
  async entrarPorNomeOuId(nomeOuId: string): Promise<Frame> {
    const frame = this.page.frame({ name: nomeOuId });

    if (!frame) {
      throw new Error(`Frame com name/id '${nomeOuId}' não encontrado.`);
    }

    return frame;
  }

  /**
   * Entra em um frame via seletor (ex: iframe#main-frame)
   */
  async entrarPorSeletor(seletor: string): Promise<Frame> {
    const frameElement = await this.page.locator(seletor).elementHandle();
    const frame = await frameElement?.contentFrame();

    if (!frame) {
      throw new Error(`Frame via seletor '${seletor}' não encontrado ou ainda não carregado.`);
    }

    return frame;
  }

  /**
   * Retorna para o conteúdo da página principal
   */
  sairDoFrame(): Page {
    return this.page; // No Playwright, não precisa de "defaultContent"
  }

  /**
   * Troca para a próxima janela (popup ou aba)
   */
  async trocarParaNovaJanela(): Promise<Page> {
    const [novaJanela] = await Promise.all([
      this.page.context().waitForEvent('page'),
      // Aqui você deve disparar o clique que abre a nova aba
    ]);

    await novaJanela.waitForLoadState('load');
    return novaJanela;
  }

  /**
   * Encontra uma aba/janela com base em parte da URL
   */
  async trocarParaJanelaComUrl(parteDaUrl: string): Promise<Page> {
    const paginas = this.page.context().pages();
    const paginaAlvo = paginas.find(p => p.url().includes(parteDaUrl));

    if (!paginaAlvo) {
      throw new Error(`Nenhuma aba com URL contendo '${parteDaUrl}' foi encontrada.`);
    }

    return paginaAlvo;
  }
}
