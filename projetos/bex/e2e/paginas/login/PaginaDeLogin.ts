import { Locator, Page } from '@playwright/test';
import { PaginaBase as pb } from 'playwright-core';
import { Credenciais } from 'modelo';

const dados = pb.carregarDados<Credenciais>('e2e/dados/credenciais/dadosUsuario.json');

export default class PaginaDeLogin extends pb {

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

    async preencherDados(): Promise<void> {
        const { matricula, senha } = dados.obter(this.cenario);
        await this.caixaTexto.preencherCampo(this.userName, matricula);
        await this.caixaTexto.preencherCampo(this.password, senha);
    }

    async executar(cenario: pb.Cenario = 'sucesso') {
        this.cenario = cenario;
        pb.evidencia.parameter('cenario', cenario);

        await pb.evidencia.step('Acessando pagina: login', async () => {
            await this.acessar();
        });

        await pb.evidencia.step('Preencher dados', async () => {
            await this.preencherDados();
        });

        await pb.evidencia.step('Realizar login', async () => {
            await this.botao.clicar(this.botaoLogin);
            if (await this.assertiva.estaVisivel(this.botaoFechar)) {
                await this.botao.clicar(this.botaoFechar);
            }
        });

        await pb.evidencia.step('Validar resultado', async () => {
            await this.assertiva.urlContem('telainicial');
        });
    }
}
