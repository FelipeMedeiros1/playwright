# Como criar um novo projeto

Este workspace possui um comando que cria toda a estrutura de um novo projeto de automação com `playwright-core` instalado diretamente do GitHub.

---

## Configuração inicial (apenas uma vez)

### 1. Publicar o playwright-core no GitHub

Entre na pasta do core e suba para um repositório novo:

```powershell
cd C:\playwright\playwright-core

git init
git add .
git commit -m "feat: playwright-core inicial"
git remote add origin https://github.com/SEU-USUARIO/playwright-core.git
git push -u origin main
```

### 2. Configurar a URL do GitHub no workspace

Edite o arquivo `.corerc.json` na raiz do workspace:

```json
{
  "coreUrl": "github:SEU-USUARIO/playwright-core"
}
```

> Substitua `SEU-USUARIO` pelo seu usuário do GitHub.  
> Este arquivo é lido automaticamente pelo `create-proj` ao criar novos projetos.

### 3. Registrar o comando no PowerShell (apenas uma vez por máquina)

```powershell
$funcao = 'function create-proj { & "C:playwright\create-proj.cmd" @args }'
Add-Content $PROFILE $funcao
. $PROFILE
```

> Após executar, o comando `create-proj` estará disponível em qualquer terminal.

---

## Criar um novo projeto

```bat
create-proj <nome-do-projeto>
```

Ou com a URL do sistema já definida:

```bat
create-proj <nome-do-projeto> <url-do-sistema>
```

---

## Exemplos

```bat
create-proj conta-corrente

create-proj investimentos https://invest.bank.com.br

create-proj cartao-credito https://cartao.bank.com.br
```

---

## O que é criado automaticamente

Dado o comando `create-proj meu-sistema`, o resultado é:

```
playwright/
└── meu-sistema/
    ├── e2e/
    │   ├── config/
    │   │   ├── BaseTeste.ts            ← fixture base pronta para uso
    │   │   └── globalSetup.ts
    │   ├── dados/
    │   │   └── DadosExemplo.example.json  ← template (dados reais no .gitignore)
    │   ├── modelo/
    │   │   ├── index.ts               ← barrel (re-exporta todos os modelos)
    │   │   └── DadosExemplo.ts        ← interface de dados
    │   ├── paginas/
    │   │   └── PaginaExemplo.ts       ← Page Object de exemplo
    │   ├── testes/
    │   │   └── ExemploTest.spec.ts    ← teste de exemplo funcionando
    │   └── utils/
    ├── playwright.config.ts           ← Chromium + Edge configurados
    ├── tsconfig.json                  ← paths wildcard modelo/* configurado
    └── package.json                   ← playwright-core instalado do GitHub
```

O `package.json` da raiz do workspace também é atualizado automaticamente com:
- O novo projeto registrado em `workspaces`
- O script `npm run test:meu-sistema`

---

## Após a criação

### Verificar os testes descobertos

```bat
cd meu-sistema
npx playwright test --list
```

### Rodar os testes

```bat
npx playwright test
```

### Rodar com navegador visível

```bat
npx playwright test --headed
```

### Rodar pela raiz do workspace

```bat
cd C:\playwright
npm run test:meu-sistema
```

---

## Configurar a URL do sistema

Se não informou a URL na criação, edite `playwright.config.ts` no projeto criado:

```ts
use: {
  baseURL: 'https://url-do-seu-sistema.com',
}
```

---

## Usar o playwright-core no projeto

Os componentes do core estão disponíveis via import após o `npm install`:

```ts
import { PaginaBase, GeradorDeDados, AllureHelper } from 'playwright-core';
```

### Exemplo de Page Object

```ts
import { Page } from '@playwright/test';
import { PaginaBase } from 'playwright-core';

export default class PaginaHome extends PaginaBase {
  constructor(pagina: Page) {
    super(pagina);
  }

  async acessar() {
    await this.acessarUrl('/');
  }
}
```

---

## Modelo de dados (e2e/modelo/)

Cada interface que representa um arquivo de dados (`JSON`/`YAML`) fica em um arquivo dentro de `e2e/modelo/`.  
O `tsconfig.json` já possui wildcard configurado — **nenhuma alteração adicional é necessária**.

### 1. Criar o arquivo de modelo

```
e2e/modelo/Credenciais.ts
```

```ts
export interface Credenciais {
    usuario: string;
    senha:   string;
}
```

### 2. Importar na Page Object

```ts
import { Credenciais } from 'modelo/Credenciais';

export default class PaginaDeLogin extends pb {

    private readonly dados = this.carregarDados<Credenciais>('e2e/dados/credenciais/dadosUsuario.json');

    async preencherDados(): Promise<void> {
        await this.caixaTexto.preencherCampo(this.userName, this.dados.usuario);
        await this.caixaTexto.preencherCampo(this.password, this.dados.senha);
    }
}
```

### 3. Criar o arquivo de dados

```
e2e/dados/credenciais/dadosUsuario.json
```

```json
{
  "sucesso": { "usuario": "M000001",  "senha": "senha123" },
  "falha":   { "usuario": "M000001Err", "senha": "errada" }
}
```

> ⚠️ Arquivos de dados reais são ignorados pelo `.gitignore`.  
> Crie um `dadosUsuario.example.json` sanitizado para versionar como template.

### Estrutura resultante

```
e2e/
├── dados/
│   └── credenciais/
│       ├── dadosUsuario.json          ← ignorado pelo git (credenciais reais)
│       └── dadosUsuario.example.json  ← versionado (template sanitizado)
└── modelo/
    └── Credenciais.ts                 ← interface de dados
```



### Exemplo de Fixture

Edite `e2e/MeuSistema/baseTeste/BaseTeste.ts`:

```ts
import { test as base } from '@playwright/test';
import PaginaHome from '../paginas/PaginaHome';

type TestFixtures = {
  Home: PaginaHome;
};

export const test = base.extend<TestFixtures>({
  Home: async ({ page }, use) => {
    await use(new PaginaHome(page));
  },
});

export { expect } from '@playwright/test';
```

### Exemplo de Teste

```ts
import { test, expect } from '../baseTeste/BaseTeste';

test.describe('Home', () => {
  test('Deve acessar a página inicial', async ({ Home }) => {
    await Home.acessar();
  });
});
```

---

## Atualizar o playwright-core

Quando houver mudanças no `playwright-core`, publique no GitHub e atualize nos projetos:

```bash
# No repo playwright-core
git add .
git commit -m "feat: nova funcionalidade"
git push

# Em cada projeto consumidor
npm update playwright-core
```

---

## Componentes disponíveis no playwright-core

| Componente         | Uso                                      |
|--------------------|------------------------------------------|
| `PaginaBase`       | Classe base para Page Objects            |
| `Botao`            | Clique, duplo clique                     |
| `CaixaTexto`       | Preenchimento de campos                  |
| `Assertiva`        | Validações / assertions                  |
| `Espera`           | Waits customizados                       |
| `Tabela`           | Interação com tabelas                    |
| `ComboBox`         | Seleção em dropdowns                     |
| `Dialog`           | Manipulação de diálogos                  |
| `Uploader`         | Upload de arquivos                       |
| `GeradorDeDados`   | Geração de dados fake (Faker.js)         |
| `AllureHelper`     | Steps e anexos no relatório Allure       |
| `DataUtils`        | Utilitários de data                      |
| `TextoUtils`       | Utilitários de texto                     |
| `CapturaDeTela`    | Screenshots manuais                      |
| `LeitorPdf`        | Leitura de arquivos PDF                  |

