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
# Todo o conteudo de e2e/dados/ deve permanecer fora do repositorio.
# Nao armazene arquivos de exemplo com credenciais nesta pasta.
e2e/dados/

# Relatorios gerados automaticamente
reports/allure-results/
reports/allure-report/
reports/playwright-report/
reports/test-results/

# Manter a estrutura da pasta reports no repositorio
!reports/.gitkeep
"@
$gitignoreContent | Set-Content (Join-Path $destino ".gitignore") -Encoding UTF8

# ── package.json ─────────────────────────────────────────────
$pkgContent = @"
{
  "name": "$Nome",
  "version": "1.0.0",
  "description": "Testes E2E $pascal - depende de playwright-core",
  "main": "index.js",
  "type": "commonjs",
  "scripts": {
    "test":               "npx rimraf reports/allure-results && playwright test",
    "test:headed":        "npx rimraf reports/allure-results && playwright test --headed",
    "test:ui":            "playwright test --ui",
    "report:html":        "playwright show-report reports/playwright-report",
    "report:allure":      "allure generate reports/allure-results -c -o reports/allure-report",
    "report:allure:open": "allure serve reports/allure-results"
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
    "ts-node":            "^10.9.2",
    "typescript":         "^5.9.2"
  }
}
"@
$pkgContent | Set-Content (Join-Path $destino "package.json") -Encoding UTF8

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
    "skipLibCheck": true
  },
  "include": ["e2e/**/*.ts", "playwright.config.ts"],
  "exclude": ["node_modules"]
}
"@
$tsContent | Set-Content (Join-Path $destino "tsconfig.json") -Encoding UTF8

# ── playwright.config.ts ─────────────────────────────────────
$configContent = @"
import { defineConfig, devices } from '@playwright/test';

const isCI    = !!process.env.CI;
const isDebug = process.env.DEBUG === 'true';
const showBrowser = !isCI;

export default defineConfig({
  testDir: './e2e',
  outputDir: './reports/test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: [
    ['html',              { outputFolder: 'reports/playwright-report' }],
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
$configContent | Set-Content (Join-Path $destino "playwright.config.ts") -Encoding UTF8

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
$baseTesteContent | Set-Content (Join-Path $destino "e2e\config\BaseTeste.ts") -Encoding UTF8

# ── ExemploTest.spec.ts ───────────────────────────────────────
$specContent = @"
import { test, expect } from '../config/BaseTeste';

test.describe('$pascal', () => {

  test('Deve acessar a pagina inicial', async ({ pagina }) => {
    await pagina.goto('/');
    await expect(pagina).toHaveTitle(/.*/);
  });

});
"@
$specContent | Set-Content (Join-Path $destino "e2e\testes\ExemploTest.spec.ts") -Encoding UTF8

# ── Registrar script no workspace raiz ───────────────────────
Write-Host " Registrando no workspace..." -ForegroundColor Cyan
$pkgRaiz = Join-Path $raiz "package.json"
$json = Get-Content $pkgRaiz -Raw | ConvertFrom-Json

$json.scripts | Add-Member -NotePropertyName "test:$Nome" `
    -NotePropertyValue "npm test --workspace=$Nome" -Force

$json | ConvertTo-Json -Depth 10 | Set-Content $pkgRaiz -Encoding UTF8

# ── npm install ───────────────────────────────────────────────
Write-Host " Instalando dependencias..." -ForegroundColor Cyan
Push-Location $raiz
npm install --ignore-scripts
Pop-Location

# ── Resultado ────────────────────────────────────────────────
Write-Host "`n Projeto '$Nome' criado com sucesso!" -ForegroundColor Green
Write-Host "   Pasta    : $destino"
Write-Host "   Core     : $coreUrl"
Write-Host "   Testar   : cd projetos\$Nome ; npx playwright test --list"
Write-Host "   Da raiz  : npm run test:$Nome"
