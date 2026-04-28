import { PaginaBase as pb } from 'playwright-core';
import { Credenciais } from 'modelo/Credenciais';

export default class PaginaLicenciarUsuario extends pb {

    private readonly dados = this.carregarDados<Credenciais>('e2e/dados/credenciais/dadosUsuario.json');
    private readonly campoMatricula = this.pagina.locator('#matricula');
    private readonly campoSenha = this.pagina.locator('#senha');
    private readonly linkLicenciarUsuario = this.pagina.locator('nav').getByRole('link', { name: 'Licenciar Usuário DevOps' });
    private readonly cbxFerramentas = this.pagina.locator('#ferramentas');
    private readonly botaoEnviar = this.pagina.getByRole('button', { name: 'Enviar' });
    private readonly msgSucesso = this.pagina.getByText('Sucesso!');
    private readonly msgFalha = this.pagina.getByText('Falha.');

    async acessar() {
        await this.link.clicar(this.linkLicenciarUsuario);
        await this.assertiva.urlContem('/licenciar-usuario');
    }

    async preencherDados(): Promise<void> {
        pb.evidencia.parameter('matricula', this.dados.matricula);
        await this.caixaTexto.preencherCampo(this.campoMatricula, this.dados.matricula);
        await this.caixaTexto.preencherCampo(this.campoSenha, this.dados.senha);
    }

    async executar(cenario: pb.Cenario = 'sucesso') {
        this.cenario = cenario;
        pb.evidencia.parameter('cenario', cenario);

        await pb.evidencia.step('Acessando pagina: licenciar-usuario', async () => {
            await this.acessar();
        });

        await pb.evidencia.step('Preencher dados', async () => {
            await this.preencherDados();
        });

        await pb.evidencia.step('Selecionar ferramenta e enviar', async () => {
            await this.comboBox.selecionar(this.cbxFerramentas, "Confluence");//Confluence,Jira,GitHub
            await this.botao.clicar(this.botaoEnviar);
        });

        await pb.evidencia.step('Validar resultado', async () => {
            if (cenario === 'sucesso') await this.assertiva.estaVisivel(this.msgSucesso);
            if (cenario === 'falha') await this.assertiva.estaVisivel(this.msgFalha);
        });
    }
}

