import { Locator, Page } from '@playwright/test';
import { PaginaBase as pb } from 'playwright-core';

// â”€â”€ 1. Interface dos dados â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Defina os campos que serao lidos do arquivo JSON/YAML.
// Se a pagina nao usa dados, remova a interface, o carregarDados e o preencherDados.
interface DadosExemplo {
    usuario: string;
    senha:   string;
}

// â”€â”€ 2. Carregamento dos dados (executado uma vez, fora da classe) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const dados = pb.carregarDados<DadosExemplo>('e2e/dados/DadosExemplo.json');

export default class PaginaExemplo extends pb {

    // â”€â”€ 3. Locators â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    private readonly campoUsuario: Locator;
    private readonly campoSenha:   Locator;
    private readonly botaoEntrar:  Locator;
    private readonly msgSucesso:   Locator;
    private readonly msgErro:      Locator;

    constructor(pagina: Page) {
        super(pagina);
        this.campoUsuario = pagina.locator('#usuario');
        this.campoSenha   = pagina.locator('#senha');
        this.botaoEntrar  = pagina.getByRole('button', { name: 'Entrar' });
        this.msgSucesso   = pagina.getByText('Bem-vindo!');
        this.msgErro      = pagina.getByText('Credenciais invalidas');
    }

    // â”€â”€ 4. Navegar ate a pagina â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    async acessar() {
        await this.page.goto('/');
        await this.assertiva.urlContem('/login');
    }

    // â”€â”€ 5. Preencher dados â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // Sobrescreva somente se a pagina preenche campos.
    // Remova este metodo inteiro se a pagina so clica/valida.
    async preencherDados(): Promise<void> {
        const { usuario, senha } = dados.obter(this.cenario);
        pb.evidencia.parameter('usuario', usuario);
        await this.caixaTexto.preencherCampo(this.campoUsuario, usuario);
        await this.caixaTexto.preencherCampo(this.campoSenha,   senha);
    }

    // â”€â”€ 6. Orquestrar o fluxo completo â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    async executar(cenario: pb.Cenario = 'sucesso') {
        this.cenario = cenario;
        pb.evidencia.parameter('cenario', cenario);

        await pb.evidencia.step('Acessar pagina', async () => {
            await this.acessar();
        });

        await pb.evidencia.step('Preencher dados', async () => {
            await this.preencherDados();
        });

        await pb.evidencia.step('Confirmar acao', async () => {
            await this.botao.clicar(this.botaoEntrar);
        });

        await pb.evidencia.step('Validar resultado', async () => {
            if (this.cenario === 'sucesso') await this.assertiva.estaVisivel(this.msgSucesso);
            if (this.cenario === 'falha')   await this.assertiva.estaVisivel(this.msgErro);
        });
    }
}
