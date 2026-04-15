import { Locator, Page } from '@playwright/test';
import { PaginaBase as pb } from 'playwright-core';
import { DadosExemplo } from 'modelo/DadosExemplo'; // ← crie e2e/modelo/DadosExemplo.ts

export default class PaginaExemplo extends pb {

    // ── 1. Dados ──────────────────────────────────────────────────────────────
    // Campo ligado ao cenário ativo: this.dados.campo resolve automaticamente
    // a partir do cenario definido em executar().
    private readonly dados = this.carregarDados<DadosExemplo>('e2e/dados/DadosExemplo.json');

    // ── 2. Locators ──────────────────────────────────────────────────────────
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

    // ── 3. Navegar até a página ───────────────────────────────────────────────
    async acessar() {
        await this.page.goto('/');
        await this.assertiva.urlContem('/login');
    }

    // ── 4. Preencher dados ────────────────────────────────────────────────────
    // Sobrescreva somente se a página preenche campos.
    // Remova este método inteiro se a página só clica/valida.
    async preencherDados(): Promise<void> {
        pb.evidencia.parameter('usuario', this.dados.usuario);
        await this.caixaTexto.preencherCampo(this.campoUsuario, this.dados.usuario);
        await this.caixaTexto.preencherCampo(this.campoSenha,   this.dados.senha);
    }

    // ── 5. Orquestrar o fluxo completo ────────────────────────────────────────
    async executar(cenario: pb.Cenario = 'sucesso') {
        this.cenario = cenario;   // ← Proxy lê este valor em cada this.dados.campo
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
