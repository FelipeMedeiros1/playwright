# playwright-core

Biblioteca base de automação com Playwright + TypeScript, com componentes reutilizáveis de UI, utilitários e suporte a relatórios Allure.

## Objetivo

Centraliza tudo que é compartilhado entre projetos E2E:
- `PaginaBase` — classe base com componentes, cenário e carregamento de dados
- Componentes de UI (`Botao`, `CaixaTexto`, `Assertiva`, etc.)
- Utilitários (`LeitorDeArquivo`, `GeradorDeDados`, `AllureHelper`, etc.)
- `configurarAmbiente` — globalSetup reutilizável para Allure

## Estrutura

```text
playwright-core/
  index.ts                  ← exportações públicas
  Web/
    base/
      PaginaBase.ts         ← classe base (estende em cada página)
      BaseTeste.ts          ← fixtures Playwright
    componentes/            ← wrappers de UI (Botao, CaixaTexto, Assertiva...)
    utils/                  ← helpers (LeitorDeArquivo, AllureHelper, GlobalSetup...)
```

## Consumo nos projetos

```typescript
import { PaginaBase as pb, configurarAmbiente } from 'playwright-core';
```

## Criar novo projeto

Da raiz do workspace:

```bash
npm run novo-projeto -- -Nome nome-do-projeto
npm run novo-projeto -- -Nome nome-do-projeto -BaseURL https://url-do-sistema.com
```

## Padrão de página

```typescript
import { PaginaBase as pb } from 'playwright-core';

const dados = pb.carregarDados<MeusDados>('e2e/dados/meusDados.json');

export default class MinhaPagina extends pb {

    async acessar() { ... }

    // sobrescreva só se a página preenche campos
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

## globalSetup — ENVIRONMENT no Allure

Cada projeto usa um wrapper mínimo:

```typescript
// e2e/config/globalSetup.ts
import { configurarAmbiente } from 'playwright-core';

export default configurarAmbiente({
    url:      'https://meu-sistema.com',
    ambiente: 'Homologacao',
});
```

Registrado no `playwright.config.ts`:

```typescript
export default defineConfig({
  globalSetup: './e2e/config/globalSetup.ts',
  ...
});
```
