import { test as base, Page, BrowserContext } from '@playwright/test';
import PaginaCadastrarUsuario from '../paginas/cadastro/PaginaCadastrarUsuario';
import PaginaAtualizarUsuario from '../paginas/cadastro/PaginaAtualizarUsuario';
import PaginaDeLogin from '../paginas/login/PaginaDeLogin';

type TestFixtures = {
    pagina: Page;
    contexto: BrowserContext;
    Login: PaginaDeLogin;
    CadastrarUsuario: PaginaCadastrarUsuario;
    AtualizarUsuario: PaginaAtualizarUsuario;
};

export const test = base.extend<TestFixtures>({
    pagina: async ({ page }, use) => {
        await use(page);
    },

    contexto: async ({ context }, use) => {
        await use(context);
    },

    Login: async ({ page }, use) => {
        await new PaginaCadastrarUsuario(page).executar();
        await use(new PaginaDeLogin(page));
    },

    CadastrarUsuario: async ({ page }, use) => {
        await use(new PaginaCadastrarUsuario(page));
    },

    AtualizarUsuario: async ({ page }, use) => {
        await new PaginaCadastrarUsuario(page).executar();
        await new PaginaDeLogin(page).executar();
        await use(new PaginaAtualizarUsuario(page));
    }
});

export { expect } from '@playwright/test';

