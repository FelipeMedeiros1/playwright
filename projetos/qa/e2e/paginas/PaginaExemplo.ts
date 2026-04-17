import { PaginaBase as pb } from 'playwright-core';


export default class PaginaExemplo extends pb {

    private readonly botaoAjuda     = this.pagina.getByRole('button', { name: 'Ajuda' });
    private readonly modBibliotecas = this.pagina.getByRole('listitem').filter({ hasText: 'Bibliotecas' }).nth(1);
    private readonly subCalendario  = this.pagina.getByRole('button', { name: 'Expandir conteúdo da pasta' }).nth(5);
    private readonly itemLista      = this.pagina.getByRole('listitem').filter({ hasText: 'DIA_SEXTA_FEIRA' });
    private readonly msgSucesso     = this.pagina.getByText('Descrição: constante que');

    async acessar() {
        await this.pagina.goto('/');
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