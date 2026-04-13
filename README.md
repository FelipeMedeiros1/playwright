# Workspace de Automação E2E

Playwright + TypeScript com relatórios Allure, organizado em workspace npm.

---

## Estrutura

```
playwright/
├── playwright-core/     ← biblioteca base compartilhada (PaginaBase, componentes, utils)
├── projetos/
│   ├── parabank/        ← projeto E2E parabank
│   └── .../             ← novos projetos criados com new:project
└── scripts/
    └── novo-projeto.ps1 ← gerador de projetos
```

---

## Instalação

```bash
npm run install:all
```

---

## Criar novo projeto

```bash
npm run novo-projeto -- -Nome nome-do-projeto
npm run novo-projeto -- -Nome nome-do-projeto -BaseURL https://url-do-sistema.com
```

Gera toda a estrutura em `projetos/nome-do-projeto/` com:
- `playwright.config.ts` já configurado
- `PaginaExemplo.ts` com o padrão do core
- `ExemploTest.spec.ts` com os dois cenários (sucesso/falha)
- `DadosExemplo.json` com estrutura de dados de teste
- `globalSetup.ts` que registra data/hora no relatório Allure

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
npm test --workspace=meu-projeto
```

---

## Relatório Allure

### Fluxo padrão — mantém histórico de tendência (TREND)
```bash
# 1. Rodar os testes
cd projetos/meu-projeto && npm test

# 2. Gerar relatório
npm run report:allure

# 3. Abrir no browser
npm run report:allure:open
```

Cada vez que `report:allure` é executado **sem reset**, o TREND acumula as runs anteriores.

---

### Zerar tudo — histórico + resultados
```bash
# Na raiz — zera TODOS os projetos
npm run report:allure:reset

# Ou dentro do projeto específico
cd projetos/meu-projeto
npm run report:allure:reset
```

Após o reset, rode os testes novamente para gerar dados frescos.

---

## Scripts da raiz

| Comando | O que faz |
|---|---|
| `npm run install:all` | Instala dependências de todos os projetos |
| `npm run novo-projeto -- -Nome <nome>` | Cria novo projeto |
| `npm run report:allure` | Gera relatório Allure em **todos** os projetos |
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

Todo projeto segue o mesmo padrão herdado do `playwright-core`:

```typescript
import { PaginaBase as pb } from 'playwright-core';

// dados carregados uma vez, fora da classe
const dados = pb.carregarDados<MeusDados>('e2e/dados/meusDados.json');

export default class MinhaPagina extends pb {

    async acessar() { ... }

    async preencherDados(): Promise<void> {
        const { campo } = dados.obter(this.cenario);
    }

    async executar(cenario: pb.Cenario = 'sucesso') {
        this.cenario = cenario;           // ← define o cenário no core
        await this.acessar();
        await this.preencherDados();      // ← sem parâmetro
        await this.botao.clicar(...);
    }
}
```

---

## Ambiente no relatório Allure

O `globalSetup.ts` de cada projeto grava automaticamente data, hora e URL no widget **ENVIRONMENT** do Allure a cada execução.

