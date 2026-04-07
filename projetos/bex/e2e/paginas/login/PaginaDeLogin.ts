import { Locator, Page } from '@playwright/test';
import { PaginaBase } from 'playwright-core';


export default class PaginaDeLogin extends PaginaBase {
    private readonly userName: Locator;
    private readonly password: Locator;
    private readonly button: Locator;

    constructor(pagina: Page) {
        super(pagina);
        this.userName = pagina.getByRole('textbox', { name: 'Usuário' });
        this.password = pagina.getByRole('textbox', { name: 'Senha' });
        this.botaoLogin = pagina.getByRole('button', { name: 'LOGIN' });
        this.botaoFechar = pagina.getByRole('button', { name: 'Fechar' });
        this.linkLicenciarUsuario = pagina.locator('nav').getByRole('link', { name: 'Licenciar Usuário DevOps' });
        this.matricula = pagina.locator('#matricula');
        this.senha = pagina.locator('#senha');
    }

    async acessar() {
        await this.acessarUrl('/');
        //await this.assertiva.contemTexto(this.message, 'Signing up is easy!');
    }

    async preencherDados<T>(dados?: T): Promise<void> {
        const usuario = 'M565868';
        const senha = 'gftfe23';
        //const { usuario, senha } = obterSessao();
        await this.caixaTexto.preencherCampo(this.userName, usuario);
        await this.caixaTexto.preencherCampo(this.password, senha);
    }

    async executar() {
        await this.acessar();
        await this.preencherDados();
        await this.botao.clicar(this.botaoLogin);
        await this.botao.clicar(this.botaoFechar);
        await this.assertiva.urlContem("telainicial");
        //await this.botao.clicar(this.linkLicenciarUsuario);
        //await this.espera.esperarPor(5000);
    }
}
