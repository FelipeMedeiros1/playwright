import { Locator, Page } from '@playwright/test';
import { PaginaBase, LeitorDeArquivo, DadosTeste, Cenario } from 'playwright-core';

interface Credenciais { matricula: string; senha: string; }

const dados =
    LeitorDeArquivo.lerDados<DadosTeste<Credenciais>>('e2e/dados/credenciais/dadosUsuario.json');

export default class PaginaDeLogin extends PaginaBase {

    private readonly userName: Locator;
    private readonly password: Locator;
    private readonly botaoLogin: Locator;
    private readonly botaoFechar: Locator;

    constructor(pagina: Page) {
        super(pagina);
        this.userName    = pagina.getByRole('textbox', { name: 'Usuário' });
        this.password    = pagina.getByRole('textbox', { name: 'Senha' });
        this.botaoLogin  = pagina.getByRole('button',  { name: 'LOGIN' });
        this.botaoFechar = pagina.getByRole('button',  { name: 'Fechar' });
    }

    async acessar() {
        await this.acessarUrl('/');
    }

    async preencherDados(cenario: Cenario): Promise<void> {
        const { matricula, senha } = dados[cenario];
        await this.caixaTexto.preencherCampo(this.userName, matricula);
        await this.caixaTexto.preencherCampo(this.password, senha);
    }

    async executar(cenario: Cenario = 'sucesso') {
        await this.acessar();
        await this.preencherDados(cenario);
        await this.botao.clicar(this.botaoLogin);
        await this.botao.clicar(this.botaoFechar);
        await this.assertiva.urlContem('telainicial');
    }
}
