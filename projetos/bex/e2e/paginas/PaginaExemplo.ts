import { Locator, Page } from '@playwright/test';
import { PaginaBase as pb } from 'playwright-core';

// ── 1. Interface dos dados ────────────────────────────────────────────────────
// Defina os campos que serão lidos do arquivo JSON/YAML.
// Se a página não usa dados, remova a interface, o carregarDados e o preencherDados.
interface DadosExemplo {
    usuario: string;
    senha:   string;
}

// ── 2. Carregamento dos dados (executado uma vez, fora da classe) ─────────────
const dados = pb.carregarDados<DadosExemplo>('e2e/dados/DadosExemplo.json');

export default class PaginaExemplo extends pb {

    // ── 3. Locators ──────────────────────────────────────────────────────────
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
        this.msgErro      = pagina.getByText('Credenciais inválidas');
    }

    // ── 4. Navegar até a página ───────────────────────────────────────────────
    async acessar() {
        await this.page.goto('/');
        await this.assertiva.urlContem('/login');
    }

    // ── 5. Preencher dados ────────────────────────────────────────────────────
    // Sobrescreva somente se a página preenche campos.
    // Remova este método inteiro se a página só clica/valida.
    async preencherDados(): Promise<void> {
        const { usuario, senha } = dados.obter(this.cenario);
        pb.evidencia.parameter('usuario', usuario);
        await this.caixaTexto.preencherCampo(this.campoUsuario, usuario);
        await this.caixaTexto.preencherCampo(this.campoSenha,   senha);
    }

    // ── 6. Orquestrar o fluxo completo ────────────────────────────────────────
    async executar(cenario: pb.Cenario = 'sucesso') {
        this.cenario = cenario;
        pb.evidencia.parameter('cenario', cenario);

        await pb.evidencia.step('Acessar página', async () => {
            await this.acessar();
        });

        await pb.evidencia.step('Preencher dados', async () => {
            await this.preencherDados();
        });

        await pb.evidencia.step('Confirmar ação', async () => {
            await this.botao.clicar(this.botaoEntrar);
        });

        await pb.evidencia.step('Validar resultado', async () => {
            if (this.cenario === 'sucesso') await this.assertiva.estaVisivel(this.msgSucesso);
            if (this.cenario === 'falha')   await this.assertiva.estaVisivel(this.msgErro);
        });
    }
}

