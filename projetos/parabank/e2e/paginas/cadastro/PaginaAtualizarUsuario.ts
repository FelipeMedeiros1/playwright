import { Locator, Page } from "@playwright/test";
import { GeradorDeDados } from "playwright-core";
import PaginaCadastrarUsuario from "../cadastro/PaginaCadastrarUsuario";

export default class PaginaAtualizarUsuario extends PaginaCadastrarUsuario {
    protected readonly atualizar: Locator;
    protected readonly textoHeading: Locator;
    protected readonly confirmarAtualizacao: Locator;
    protected readonly confirmarTexto: Locator;

    constructor(pagina: Page) {
        super(pagina);
        this.atualizar = pagina.getByRole('link', { name: 'Update Contact Info' });
        this.textoHeading = pagina.getByRole('heading', { name: 'Update Profile' });
        this.confirmarAtualizacao = pagina.getByRole('button', { name: 'Update Profile' });
        this.confirmarTexto = pagina.getByText('Your updated address and');
    }

    async acessar() {
        await this.botao.duploClique(this.atualizar);
        await this.assertiva.contemTexto(this.textoHeading, 'Update Profile');
    }

    async executar(): Promise<void> {
        await this.acessar();
        await this.preencherDadosPerfil(new GeradorDeDados());
        await this.espera.esperarPor(500);
        await this.botao.duploClique(this.confirmarAtualizacao);
        await this.assertiva.contemTexto(this.confirmarTexto, 'Your updated address and');
    }
}

