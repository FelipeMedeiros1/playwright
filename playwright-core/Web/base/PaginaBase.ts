import { Page } from '@playwright/test';
import { Botao } from '../componentes/Botao';
import { CaixaTexto } from '../componentes/CaixaTexto';
import { CheckkBox } from '../componentes/CheckkBox';
import { ComboBox } from '../componentes/ComboBox';
import { Espera } from '../componentes/Espera';
import { Assertiva } from '../componentes/Assertiva';
import { Calendario } from '../componentes/Calendario';
import { Tabela } from '../componentes/Tabela';
import { AllureHelper } from '../utils/AllureHelper';
import { LeitorDeArquivo } from '../utils/LeitorDeArquivo';
import { Cenario, DadosCenario } from '../utils/TiposTeste';
import type { DadosTeste } from '../utils/TiposTeste';


export abstract class PaginaBase {

    /** Utilitário de evidências Allure — acessível via `PaginaBase.evidencia` */
    static readonly evidencia = AllureHelper;
    /** Leitor de arquivos JSON — acessível via `PaginaBase.LeitorDeArquivo` */
    static readonly LeitorDeArquivo = LeitorDeArquivo;

    /**
     * Carrega dados de teste a partir de um arquivo JSON ou YAML.
     * O wrapper `DadosTeste<T>` é aplicado automaticamente pelo core.
     *
     * @example
     * const dados = pb.carregarDados<Credenciais>('e2e/dados/credenciais/dadosUsuario.json');
     * dados['sucesso'].matricula
     */
    static carregarDados<T>(caminho: string): DadosCenario<T> {
        return new DadosCenario<T>(LeitorDeArquivo.lerDados<DadosTeste_<T>>(caminho));
    }

    /**
     * Versão de instância — retorna um Proxy<T> que resolve as propriedades
     * automaticamente a partir do cenário ativo (`this.cenario`).
     * Deve ser usado como campo da classe para que `this` esteja disponível.
     *
     * @example
     * private readonly dados = this.carregarDados<Credenciais>('e2e/dados/credenciais/dadosUsuario.json');
     * // dentro de qualquer método:
     * this.dados.matricula   // usa o cenario definido em executar()
     */
    protected carregarDados<T extends object>(caminho: string): T {
        const mapa = LeitorDeArquivo.lerDados<DadosTeste_<T>>(caminho);
        return new Proxy({} as T, {
            get: (_target, prop: string | symbol) => {
                if (typeof prop !== 'string') return undefined;
                const item = mapa[this.cenario];
                if (!item) throw new Error(`Cenário "${this.cenario}" não encontrado nos dados de teste.`);
                return item[prop as keyof T];
            }
        });
    }

    protected readonly page: Page;
    protected readonly botao: Botao;
    protected readonly caixaTexto: CaixaTexto;
    protected readonly checkbox: CheckkBox;
    protected readonly comboBox: ComboBox;
    protected readonly espera: Espera;
    protected readonly assertiva: Assertiva;
    protected readonly tabela: Tabela;
    protected readonly calendario: Calendario;

    /** Cenário ativo — definido por `executar(cenario)` e lido por `preencherDados()` */
    protected cenario: Cenario = 'sucesso';


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
    /** Sobrescreva apenas se a página precisar preencher dados antes de executar. */
    async preencherDados(): Promise<void> {}
    abstract executar(cenario?: Cenario): Promise<void>;

}

/**
 * Namespace merging — expõe tipos sem imports adicionais:
 * `PaginaBase.Cenario` e `PaginaBase.DadosTeste<T>`
 */
export namespace PaginaBase {
    export type Cenario = 'sucesso' | 'falha' | 'alteracao' | (string & {});
    export type DadosTeste<T> = DadosTeste_<T>;
}

// alias interno para o tipo genérico (namespace não permite re-export de genéricos diretamente)
type DadosTeste_<T> = { sucesso: T; falha: T } & { [cenario: string]: T };

