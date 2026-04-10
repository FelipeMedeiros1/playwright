import { Locator, Page } from '@playwright/test';
import { PaginaBase as pb } from 'playwright-core';

interface Credenciais {
    matricula: string;
    senha: string;
}

const dados =
    pb.LeitorDeArquivo.lerDados<pb.DadosTeste<Credenciais>>('e2e/dados/credenciais/dadosUsuario.json');


export default class PaginaLicenciarUsuario extends pb {

    private readonly matricula: Locator;
    private readonly senha: Locator;
    private readonly linkLicenciarUsuario: Locator;
    private readonly cbxFerramentas: Locator;
    private readonly botaoEnviar: Locator;
    private readonly msgSucesso: Locator;
    private readonly msgFalha: Locator;

    constructor(pagina: Page) {
        super(pagina);
        this.linkLicenciarUsuario = pagina.locator('nav').getByRole('link', { name: 'Licenciar Usuário DevOps' });
        this.matricula = pagina.locator('#matricula');
        this.senha = pagina.locator('#senha');
        this.cbxFerramentas = pagina.locator('#ferramentas');
        this.botaoEnviar = pagina.getByRole('button', { name: 'Enviar' });
        this.msgSucesso = pagina.getByText('Sucesso!');
        this.msgFalha   = pagina.getByText('Falha.');
    }

    async acessar() {
        await this.botao.clicar(this.linkLicenciarUsuario);
        await this.assertiva.urlContem('/licenciar-usuario');
    }

    async preencherDados(cenario: pb.Cenario): Promise<void> {
        const { matricula, senha } = dados[cenario];
        pb.evidencia.parameter('matricula', matricula);
        await this.caixaTexto.preencherCampo(this.matricula, matricula);
        await this.caixaTexto.preencherCampo(this.senha, senha);
    }

    async executar(cenario: pb.Cenario = 'sucesso') {
        pb.evidencia.parameter('cenario', cenario);

        await pb.evidencia.step('Acessando pagina: licenciar-usuario', async () => {
            await this.acessar();
        });

        await pb.evidencia.step('Preencher dados', async () => {
            await this.preencherDados(cenario);
        });

        await pb.evidencia.step('Selecionar ferramenta e enviar', async () => {
            await this.comboBox.selecionar(this.cbxFerramentas, "Confluence");
            await this.botao.clicar(this.botaoEnviar);
        });

        await pb.evidencia.step('Validar resultado', async () => {
            if (cenario === 'sucesso') await this.assertiva.estaVisivel(this.msgSucesso);
            if (cenario === 'falha')   await this.assertiva.estaVisivel(this.msgFalha);
        });
    }
}


