import { Page } from '@playwright/test';
import { Botao } from '../componentes/Botao';
import { CaixaTexto } from '../componentes/CaixaTexto';
import { CheckkBox } from '../componentes/CheckkBox';
import { ComboBox } from '../componentes/ComboBox';
import { Espera } from '../componentes/Espera';
import { Assertiva } from '../componentes/Assertiva';
import { Calendario } from '../componentes/Calendario';
import { Tabela } from '../componentes/Tabela';
import { Cenario } from '../utils/TiposTeste';


export abstract class PaginaBase {


    protected readonly page: Page;
    protected readonly botao: Botao;
    protected readonly caixaTexto: CaixaTexto;
    protected readonly checkbox: CheckkBox;
    protected readonly comboBox: ComboBox;
    protected readonly espera: Espera;
    protected readonly assertiva: Assertiva;
    protected readonly tabela: Tabela;
    protected readonly calendario: Calendario;


    constructor(page: Page) {
        this.page = page;
        this.botao = new Botao(page);
        this.caixaTexto = new CaixaTexto(page);
        this.checkbox = new CheckkBox(page);
        this.comboBox = new ComboBox(page);
        this.espera = new Espera(page);
        this.assertiva = new Assertiva(page);
        this.calendario = new Calendario(page);
        this.tabela = new Tabela(page);
        this.assertiva = new Assertiva(page);
    }

    async acessarUrl(url: string) {
        await this.page.goto(url);
    }

    abstract acessar(): Promise<void>;
    abstract preencherDados(cenario: Cenario): Promise<void>;
    abstract executar(cenario: Cenario): Promise<void>;

}
