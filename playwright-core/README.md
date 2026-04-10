# playwright-core

Biblioteca base de automacao com Playwright + TypeScript, com componentes reutilizaveis de UI, utilitarios e suporte a relatorios HTML/Allure.

## Objetivo

O projeto `playwright-core` centraliza classes e utilitarios compartilhados, como `PaginaBase`, componentes de interacao (`Botao`, `CaixaTexto`, `Assertiva`, etc.) e helpers de dados/arquivos.

Esse core pode ser consumido por suites E2E, como o projeto `parabank` no mesmo workspace.

## Pre-requisitos

- Node.js 18+
- npm 9+

## Instalacao

No workspace raiz (`C:\bradesco\proj-aut\playwright`):

```bash
npm run install:all
```

Ou apenas para o projeto:

```bash
cd playwright-core
npm install
```

## Scripts disponiveis

No `playwright-core/package.json`:

- `npm run build`: compila TypeScript para `dist`
- `npm test`: executa testes Playwright
- `npm run test:headed`: executa testes com navegador visivel
- `npm run report:html`: abre o relatorio HTML do Playwright
- `npm run report:allure`: gera relatorio Allure em `allure-report`
- `npm run report:allure:open`: sobe servidor local do Allure
- `npm run prepare`: instala navegadores do Playwright

## Executando testes

```bash
cd playwright-core
npm test
```

Rodar um arquivo especifico:

```bash
npx playwright test e2e/Parabank/testes/login/LicenciarTest.spec.ts
```

## Relatorios

Relatorio HTML (Playwright):

```bash
npm run report:html
```

Relatorio Allure:

```bash
npm run report:allure
npm run report:allure:open
```

## Estrutura principal

```text
playwright-core/
  index.ts                  # Exportacoes publicas do core
  Web/
    base/                   # Classe base de pagina
    componentes/            # Wrappers de componentes de UI
    utils/                  # Helpers utilitarios
  e2e/                      # Suite de testes exemplo
  playwright.config.ts
  tsconfig.json
```

## Consumo por outros projetos

O consumo tipico e via import do pacote local:

```ts
import { PaginaBase, GeradorDeDados } from 'playwright-core';
```

No projeto consumidor, o `tsconfig.json` pode mapear o path para `../playwright-core/index.ts`.

## Workspace (raiz)

Da pasta raiz do workspace:

```bash
npm run test:core
npm run test:parabank
```
