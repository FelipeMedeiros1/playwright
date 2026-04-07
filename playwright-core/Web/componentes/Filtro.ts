import { Locator, Page, expect } from '@playwright/test';
import { CaixaTexto } from './CaixaTexto';
import { ComboBox } from './ComboBox';
import { Espera } from './Espera';

export class Filtro {
  private readonly page: Page;
  private readonly caixaTexto: CaixaTexto;
  private readonly comboBox: ComboBox;
  private readonly espera: Espera;

  constructor(page: Page) {
    this.page = page;
    this.caixaTexto = new CaixaTexto(page);
    this.comboBox = new ComboBox(page);
    this.espera = new Espera(page);
  }

  /**
   * Preenche um campo de filtro com input de texto
   */
  async filtroPesquisaPreenche(nomeDoCampo: string, valor: string) {
    const criterio = this.page.locator(`xpath=(//span[text()='${nomeDoCampo}']/following-sibling::*//select)[1]`);
    await this.comboBox.selecionar(criterio, 'Igual');

    await this.espera.esperarPor(500);
    await this.espera.esperarAjaxTerminar();

    const campoTexto = this.page.locator(`xpath=(//span[text()='${nomeDoCampo}']/following-sibling::*//input)[1]`);
    await this.caixaTexto.preencherCampo(campoTexto, valor);
  }

  /**
   * Preenche um campo de filtro com um combobox (select)
   */
  async filtroPesquisaSeleciona(nomeDoCampo: string, valor: string) {
    const criterio = this.page.locator(`xpath=(//span[text()='${nomeDoCampo}']/following-sibling::*//select)[1]`);
    await this.comboBox.selecionar(criterio, 'Igual');

    await this.espera.esperarPor(500);
    await this.espera.esperarAjaxTerminar();

    const selectValor = this.page.locator(`xpath=(//span[text()='${nomeDoCampo}']/following-sibling::*//select)[2]`);
    await this.comboBox.selecionar(selectValor, valor);
  }
}
