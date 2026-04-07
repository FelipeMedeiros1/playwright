# parabank

Projeto E2E da aplicacao Parabank usando Playwright + TypeScript, consumindo classes utilitarias do pacote local `playwright-core`.

## Objetivo

A suite cobre fluxos de negocio do Parabank (ex.: login, cadastro e atualizacao de usuario) com Page Objects e fixtures customizadas.

## Pre-requisitos

- Node.js 18+
- npm 9+

## Instalacao

Pela raiz do workspace (`C:\bradesco\proj-aut\playwright`):

```bash
npm run install:all
```

Ou diretamente no projeto:

```bash
cd parabank
npm install
```

## Scripts disponiveis

No `parabank/package.json`:

- `npm test`: executa os testes
- `npm run test:headed`: executa com navegador visivel
- `npm run test:ui`: abre Playwright UI mode
- `npm run report:html`: abre o relatorio HTML do Playwright
- `npm run report:allure`: gera relatorio Allure em `allure-report`
- `npm run report:allure:open`: sobe servidor local do Allure
- `npm run prepare`: instala navegadores do Playwright

## Executando os testes

```bash
cd parabank
npm test
```

Rodar um teste especifico:

```bash
npx playwright test e2e/Parabank/testes/login/LoginTest.spec.ts
```

Rodar com navegador aberto:

```bash
npm run test:headed
```

## Fixtures e organizacao

A base de testes esta em `e2e/Parabank/baseTeste/BaseTeste.ts`, com fixtures como:

- `Login`
- `CadastrarUsuario`
- `AtualizarUsuario`

Exemplo de uso em spec:

```ts
import { test } from '../../baseTeste/BaseTeste';

test('Deve fazer login com usuario e senha validos', async ({ Login }) => {
  await Login.executar();
});
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

## Integracao com playwright-core

O projeto usa importacoes como:

```ts
import { PaginaBase } from 'playwright-core';
```

O mapeamento esta em `parabank/tsconfig.json`:

- `playwright-core` -> `../playwright-core/index.ts`

## Estrutura principal

```text
parabank/
  e2e/Parabank/
    baseTeste/
    paginas/
    testes/
    utils/
  playwright.config.ts
  tsconfig.json
```

## Workspace (raiz)

Da pasta raiz do workspace:

```bash
npm run test:parabank
npm run test:core
```

