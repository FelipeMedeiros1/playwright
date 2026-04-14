# Workspace de Automação E2E

Playwright + TypeScript com relatórios Allure, organizado em workspace npm.

---

## Estrutura

```
playwright/
├── playwright-core/     ← biblioteca base compartilhada (PaginaBase, componentes, utils)
├── projetos/
│   ├── parabank/        ← projeto E2E parabank
│   └── .../             ← novos projetos criados com novo-projeto
└── scripts/
    ├── novo-projeto.ps1 ← gerador de projetos
    └── novo-projeto.cmd ← atalho para rodar direto no terminal
```

---

## Instalação

```bash
npm run install:all
```

---

## Criar novo projeto

```bash
# Direto no terminal (PATH configurado)
novo-projeto meu-sistema
novo-projeto meu-sistema https://url-do-sistema.com

# Via npm
npm run novo-projeto -- -Nome meu-sistema
npm run novo-projeto -- -Nome meu-sistema -BaseURL https://url-do-sistema.com
```

Gera toda a estrutura em `projetos/meu-sistema/` com:
- `playwright.config.ts` já configurado com `baseURL` e `globalSetup`
- `PaginaExemplo.ts` com o padrão completo do core
- `ExemploTest.spec.ts` com cenários sucesso e falha
- `DadosExemplo.json` com estrutura de dados de teste
- `globalSetup.ts` que registra data, hora e ambiente no Allure

---

## Rodar testes

### De dentro do projeto
```bash
cd projetos/bex
npm test                   # limpa resultados anteriores + roda
npm run test:headed        # com navegador visível
npm run test:ui            # modo interativo Playwright UI
```

### Da raiz (workspace)
```bash
npm test --workspace=bex
```

---

## Relatório Allure

### Fluxo padrão — mantém histórico de tendência (TREND)
```bash
# 1. Rodar os testes
cd projetos/bex && npm test

# 2. Gerar relatório (mantém TREND)
npm run report:allure

# 3. Abrir no browser
npm run report:allure:open
```

### Zerar tudo — histórico + resultados
```bash
# Na raiz — zera TODOS os projetos
npm run report:allure:reset

# Ou dentro do projeto
cd projetos/bex && npm run report:allure:reset
```

---

## Scripts da raiz

| Comando | O que faz |
|---|---|
| `npm run install:all` | Instala dependências de todos os projetos |
| `novo-projeto <nome>` | Cria novo projeto |
| `npm run report:allure` | Gera relatório em **todos** os projetos |
| `npm run report:allure:reset` | Zera histórico e resultados em **todos** os projetos |

---

## Scripts de cada projeto

| Comando | O que faz |
|---|---|
| `npm test` | Limpa resultados antigos e roda os testes |
| `npm run test:headed` | Roda com navegador visível |
| `npm run test:ui` | Abre Playwright UI mode |
| `npm run report:allure` | Gera relatório Allure (mantém TREND) |
| `npm run report:allure:open` | Abre o relatório no browser |
| `npm run report:allure:reset` | Apaga `allure-results` e `allure-report` — começa do zero |

---

## Padrão de página

```typescript
import { PaginaBase as pb } from 'playwright-core';

const dados = pb.carregarDados<MeusDados>('e2e/dados/meusDados.json');

export default class MinhaPagina extends pb {

    async acessar() { ... }

    // sobrescreva apenas se a página preenche campos
    async preencherDados(): Promise<void> {
        const { campo } = dados.obter(this.cenario);
        await this.caixaTexto.preencherCampo(this.meuCampo, campo);
    }

    async executar(cenario: pb.Cenario = 'sucesso') {
        this.cenario = cenario;
        await this.acessar();
        await this.preencherDados();
        await this.botao.clicar(this.btnConfirmar);
    }
}
```

---

## Ambiente no relatório Allure

Cada projeto tem um `globalSetup.ts` mínimo que usa o core:

```typescript
import { configurarAmbiente } from 'playwright-core';

export default configurarAmbiente({
    url:      'https://meu-sistema.com',
    ambiente: process.env.AMBIENTE ?? 'Desenvolvimento',
});
```

Controle do ambiente na execução:

```bash
npm test                            # Ambiente=Desenvolvimento (padrão)
$env:AMBIENTE="Homologacao"; npm test
$env:AMBIENTE="Producao";    npm test
```

Aparece no widget **ENVIRONMENT** do Allure com data, hora, ambiente e URL.
