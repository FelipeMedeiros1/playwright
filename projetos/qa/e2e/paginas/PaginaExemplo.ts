import { Locator, Page } from '@playwright/test';
import { PaginaBase as pb } from 'playwright-core';


export default class PaginaExemplo extends pb {

    private readonly botaoAjuda:  Locator;
    private readonly modBibliotecas: Locator;
    private readonly subCalendario: Locator;
    private readonly itemLista: Locator;
    private readonly msgSucesso:   Locator;

    constructor(pagina: Page) {
        super(pagina);
        this.botaoAjuda  = pagina.getByRole('button', { name: 'Ajuda' });
        this.modBibliotecas  = pagina.getByRole('listitem').filter({ hasText: 'Bibliotecas' }).nth(1);
        this.subCalendario   = pagina.getByRole('button', { name: 'Expandir conteúdo da pasta' }).nth(5);
        this.itemLista   = pagina.getByRole('listitem').filter({ hasText: 'DIA_SEXTA_FEIRA' });
        this.msgSucesso   = pagina.getByText('Descrição: constante que');
    }

    async acessar() {
        await this.page.goto('/');
       await this.assertiva.urlContem('dev/');
    }

    async executar(cenario: pb.Cenario = 'sucesso') {
        this.cenario = cenario;
       await this.acessar();
       await this.botao.clicar(this.botaoAjuda);
       await this.botao.clicar(this.modBibliotecas);
       await this.botao.clicar(this.subCalendario);
       await this.botao.clicar(this.itemLista);
       await this.assertiva.estaVisivel(this.msgSucesso);
       await this.assertiva.textoExato(this.msgSucesso,"Descrição: constante que representa a 'Sexta-Feira'");
    }
}