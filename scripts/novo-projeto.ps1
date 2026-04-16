# ============================================================
#  novo-projeto.ps1
#  Uso: .\novo-projeto.ps1 -Nome "nome-do-projeto"
#       .\novo-projeto.ps1 -Nome "nome-do-projeto" -BaseURL "https://app.com"
# ============================================================
param(
    [Parameter(Mandatory = $true)]
    [string]$Nome,
    [string]$BaseURL = "https://sua-url-aqui.com"
)

# Escreve arquivo sem BOM (PowerShell 5.1 Set-Content -Encoding UTF8 adiciona BOM)
function Write-FileNoBom {
    param([string]$Path, [string]$Content)
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($Path, $Content, $utf8NoBom)
}

$raiz     = Split-Path $PSScriptRoot -Parent
$projetos = Join-Path $raiz "projetos"
$destino  = Join-Path $projetos $Nome
$pascal   = (Get-Culture).TextInfo.ToTitleCase($Nome.ToLower()) -replace '[-_\s]',''

# ── Ler URL do core (GitHub ou local via workspace) ──────────
$corercPath = Join-Path $raiz ".corerc.json"
$coreUrl    = "*"   # fallback: workspace local resolve automaticamente

if (Test-Path $corercPath) {
    $configured = (Get-Content $corercPath -Raw | ConvertFrom-Json).coreUrl
    if ($configured -and $configured -notlike "*SEU-USUARIO*") {
        $coreUrl = $configured
        Write-Host " Core: $coreUrl (GitHub)" -ForegroundColor DarkGray
    } else {
        Write-Host " Core: workspace local (GitHub ainda nao configurado)" -ForegroundColor DarkGray
    }
} else {
    Write-Host " Core: workspace local (.corerc.json nao encontrado)" -ForegroundColor DarkGray
}

# ── Validacao ─────────────────────────────────────────────────
if (Test-Path $destino) {
    Write-Error "Projeto '$Nome' ja existe em: $destino"
    exit 1
}

# ── Pastas ───────────────────────────────────────────────────
Write-Host "`n Criando estrutura..." -ForegroundColor Cyan
foreach ($p in @(
    "e2e\config",
    "e2e\paginas",
    "e2e\testes",
    "e2e\utils",
    "e2e\dados",
    "e2e\modelo",
    ".githooks",
    "reports\allure-results",
    "reports\allure-report",
    "reports\playwright-report",
    "reports\test-results"
)) {
    New-Item -ItemType Directory -Path (Join-Path $destino $p) -Force | Out-Null
}
New-Item -ItemType File -Force -Path (Join-Path $destino "reports\.gitkeep") | Out-Null

# ── .gitignore ────────────────────────────────────────────────
$gitignoreContent = @"
node_modules/

# Dados sensíveis - credenciais
# Arquivos reais sao ignorados. Versione apenas *.example.json como template.
e2e/dados/
!e2e/dados/**/*.example.json

# Relatorios gerados automaticamente
reports/allure-results/
reports/allure-report/
reports/playwright-report/
reports/test-results/

# Manter a estrutura da pasta reports no repositorio
!reports/.gitkeep
"@
Write-FileNoBom (Join-Path $destino ".gitignore") $gitignoreContent

# ── package.json ─────────────────────────────────────────────
$pkgContent = @"
{
  "name": "$Nome",
  "version": "1.0.0",
  "description": "Testes E2E $pascal - depende de playwright-core",
  "main": "index.js",
  "type": "commonjs",
  "scripts": {
    "prepare":            "git config core.hooksPath .githooks",
    "test":               "npx rimraf reports/allure-results reports/playwright-report reports/test-results && playwright test",
    "test:headed":        "npx rimraf reports/allure-results reports/playwright-report reports/test-results && playwright test --headed",
    "test:ui":            "playwright test --ui",
    "report:html":        "playwright show-report reports/playwright-report",
    "report:allure":       "allure generate reports/allure-results -c -o reports/allure-report",
    "report:allure:open":  "allure open reports/allure-report",
    "report:allure:reset": "npx rimraf reports/allure-results reports/allure-report && echo Historico e resultados limpos. Execute npm test para uma nova execucao."
  },
  "dependencies": {
    "playwright-core": "$coreUrl"
  },
  "devDependencies": {
    "@playwright/test":   "^1.54.2",
    "@types/node":        "^24.2.1",
    "allure-commandline": "^2.34.1",
    "allure-playwright":  "^3.3.3",
    "playwright":         "^1.54.2",
    "rimraf":             "^6.1.3",
    "ts-node":            "^10.9.2",
    "typescript":         "^5.9.2"
  }
}
"@
Write-FileNoBom (Join-Path $destino "package.json") $pkgContent

# ── tsconfig.json ────────────────────────────────────────────
$tsContent = @"
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "strict": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "modelo":   ["e2e/modelo/index.ts"],
      "modelo/*": ["e2e/modelo/*/index.ts", "e2e/modelo/*.ts"]
    }
  },
  "include": ["e2e/**/*.ts", "playwright.config.ts"],
  "exclude": ["node_modules"]
}
"@
Write-FileNoBom (Join-Path $destino "tsconfig.json") $tsContent

# ── playwright.config.ts ─────────────────────────────────────
$configContent = @"
import { defineConfig, devices } from '@playwright/test';

const isCI    = !!process.env.CI;
const isDebug = process.env.DEBUG === 'true';
const showBrowser = !isCI;

export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/config/globalSetup.ts',
  outputDir: './reports/test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: isCI ? 1 : undefined,
  reporter: [
    ['html',              { outputFolder: 'reports/playwright-report', open: 'never' }],
    ['allure-playwright', { resultsDir: 'reports/allure-results', suiteTitle: true }],
  ],
  use: {
    headless: !showBrowser,
    viewport: { width: 1280, height: 720 },
    screenshot: 'on',
    video: isCI ? 'retain-on-failure' : 'on',
    baseURL: '$BaseURL',
    trace: isCI ? 'on-first-retry' : 'off',
    launchOptions: { slowMo: isDebug ? 500 : 0 },
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'edge',     use: { ...devices['Desktop Edge'], channel: 'msedge' } },
  ],
});
"@
Write-FileNoBom (Join-Path $destino "playwright.config.ts") $configContent

# ── globalSetup.ts ───────────────────────────────────────────
$globalSetupContent = @"
import { configurarAmbiente } from 'playwright-core';

export default configurarAmbiente({
    url:      '$BaseURL',
    ambiente: process.env.AMBIENTE ?? 'Desenvolvimento',
});
"@
Write-FileNoBom (Join-Path $destino "e2e\config\globalSetup.ts") $globalSetupContent

# ── BaseTeste.ts ──────────────────────────────────────────────
$baseTesteContent = @"
import { test as base, Page, BrowserContext } from '@playwright/test';

type TestFixtures = {
  pagina: Page;
  contexto: BrowserContext;
};

export const test = base.extend<TestFixtures>({
  pagina:   async ({ page },    use) => { await use(page);    },
  contexto: async ({ context }, use) => { await use(context); },
});

export { expect } from '@playwright/test';
"@
Write-FileNoBom (Join-Path $destino "e2e\config\BaseTeste.ts") $baseTesteContent

# ── DadosExemplo.example.json ────────────────────────────────
$dadosExemploContent = @"
{
  "sucesso": {
    "usuario": "SEU_USUARIO",
    "senha":   "SUA_SENHA"
  },
  "falha": {
    "usuario": "SEU_USUARIO_INVALIDO",
    "senha":   "SUA_SENHA_INVALIDA"
  }
}
"@
Write-FileNoBom (Join-Path $destino "e2e\dados\DadosExemplo.example.json") $dadosExemploContent

# ── modelo/DadosExemplo.ts ────────────────────────────────────
$modeloDadosExemploContent = @"
export interface DadosExemplo {
    usuario: string;
    senha:   string;
}
"@
Write-FileNoBom (Join-Path $destino "e2e\modelo\DadosExemplo.ts") $modeloDadosExemploContent

# ── modelo/index.ts (barrel) ──────────────────────────────────
$modeloIndexContent = @"
// Barrel — re-exporta todos os modelos por dominio de pagina
// Para usar: import { DadosExemplo } from 'modelo/DadosExemplo'
export * from './DadosExemplo';
"@
Write-FileNoBom (Join-Path $destino "e2e\modelo\index.ts") $modeloIndexContent

# ── PaginaExemplo.ts ──────────────────────────────────────────
$paginaExemploContent = @"
import { Locator, Page } from '@playwright/test';
import { PaginaBase as pb } from 'playwright-core';
import { DadosExemplo } from 'modelo/DadosExemplo';

export default class PaginaExemplo extends pb {

    // 1. Dados: campo ligado ao cenario ativo.
    // this.dados.campo resolve automaticamente via executar(cenario).
    // Se a pagina nao usa dados, remova esta linha e o preencherDados.
    private readonly dados = this.carregarDados<DadosExemplo>('e2e/dados/DadosExemplo.json');

    // 2. Locators
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

    // 3. Navegar ate a pagina
    async acessar() {
        await this.page.goto('/');
        await this.assertiva.urlContem('/login');
    }

    // 4. Preencher dados
    // Sobrescreva somente se a pagina preenche campos.
    // Remova este metodo inteiro se a pagina so clica/valida.
    async preencherDados(): Promise<void> {
        pb.evidencia.parameter('usuario', this.dados.usuario);
        await this.caixaTexto.preencherCampo(this.campoUsuario, this.dados.usuario);
        await this.caixaTexto.preencherCampo(this.campoSenha,   this.dados.senha);
    }

    // 5. Orquestrar o fluxo completo
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
"@
Write-FileNoBom (Join-Path $destino "e2e\paginas\PaginaExemplo.ts") $paginaExemploContent

# ── ExemploTest.spec.ts ───────────────────────────────────────
$specContent = @"
import { test }        from '../config/BaseTeste';
import PaginaExemplo   from '../paginas/PaginaExemplo';

test.describe('$pascal - Exemplo', () => {

    test('Deve executar o cenario de sucesso', async ({ pagina }) => {
        const tela = new PaginaExemplo(pagina);
        await tela.executar('sucesso');
    });

    test('Deve executar o cenario de falha', async ({ pagina }) => {
        const tela = new PaginaExemplo(pagina);
        await tela.executar('falha');
    });

});
"@
Write-FileNoBom (Join-Path $destino "e2e\testes\ExemploTest.spec.ts") $specContent


# ── .githooks/pre-commit ─────────────────────────────────────
$preCommitContent = @"
#!/bin/sh
# ──────────────────────────────────────────────────────────────────────────────
#  Pre-commit hook — Protecao de dados sensiveis
#
#  Bloqueia o commit se qualquer arquivo JSON ou YAML staged contiver
#  as palavras abaixo como CHAVE (ex.: "senha": "valor").
#
#  Palavras monitoradas: senha . username . pwd . password . matricula
#
#  Para ignorar pontualmente (nao recomendado):
#    git commit --no-verify
# ──────────────────────────────────────────────────────────────────────────────

KEYWORDS='"(senha|username|pwd|password|matricula)\s*:'
ENCONTROU=0

for ARQUIVO in `$(git diff --cached --name-only --diff-filter=ACM); do
    case "`$ARQUIVO" in
        *.json|*.yaml|*.yml)
            if git show ":`$ARQUIVO" | grep -qiP "`$KEYWORDS"; then
                echo ""
                echo "  BLOQUEADO: dado sensivel detectado"
                echo "  Arquivo : `$ARQUIVO"
                echo "  Palavras: senha, username, pwd, password, matricula"
                echo ""
                echo "  Opcoes:"
                echo "    1) Adicione o arquivo ao .gitignore"
                echo "    2) Use um .example.json com valores ficticios"
                echo "    3) Mova os valores para variaveis de ambiente"
                echo ""
                ENCONTROU=1
            fi
            ;;
    esac
done

if [ "`$ENCONTROU" -eq 1 ]; then
    exit 1
fi

exit 0
"@
Write-FileNoBom (Join-Path $destino ".githooks\pre-commit") $preCommitContent

# ── npm install ───────────────────────────────────────────────
Write-Host " Instalando dependencias..." -ForegroundColor Cyan
Push-Location $raiz
npm install --ignore-scripts
Pop-Location

# ── Resultado ────────────────────────────────────────────────
Write-Host "`n Projeto '$Nome' criado com sucesso!" -ForegroundColor Green
Write-Host "   Pasta          : $destino"
Write-Host "   Core           : $coreUrl"
Write-Host "   Rodar testes   : cd projetos\$Nome && npm test"
Write-Host "   Gerar relatorio: npm run report:allure"
Write-Host "   Zerar tudo     : npm run report:allure:reset"
Write-Host "   Documentacao   : README.md na raiz do workspace" -ForegroundColor DarkGray
