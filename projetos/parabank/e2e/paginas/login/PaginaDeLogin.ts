import { Locator, Page } from '@playwright/test';
import { PaginaBase } from 'playwright-core';
import { obterSessao } from '../../utils/SessaoDeUsuario';

export default class PaginaDeLogin extends PaginaBase {
    private readonly paginaPrincipal: Locator;
    private readonly userName: Locator;
    private readonly password: Locator;
    private readonly button: Locator;
    private readonly message: Locator;
    private readonly messageErr: Locator;

    constructor(pagina: Page) {
        super(pagina);
        this.paginaPrincipal = pagina.getByRole('link', { name: 'home', exact: true });
        this.userName = pagina.locator('input[name="username"]');
        this.password = pagina.locator('input[name="password"]');
        this.button = pagina.getByRole('button', { name: 'Log In' });
        this.message = pagina.getByRole('heading', { name: 'Accounts Overview' });
        this.messageErr = pagina.getByRole('heading', { name: 'Error!' });
    }

    async acessar() {
        await this.acessarUrl('/');
    }

    async preencherDados(): Promise<void> {
        const { usuario, senha } = obterSessao();
        await this.caixaTexto.preencherCampo(this.userName, usuario);
        await this.caixaTexto.preencherCampo(this.password, senha);
    }

    async mensagem(texto: string) {
        await this.assertiva.contemTexto(this.messageErr, texto);
    }

    async executar() {
        await this.acessar();
        await this.preencherDados();
        await this.botao.duploClique(this.button);
        await this.assertiva.contemTexto(this.message, 'Accounts Overview');
    }
}

