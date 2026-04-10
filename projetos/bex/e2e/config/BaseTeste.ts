import { test as base } from 'playwright-core';
import PaginaDeLogin from '../paginas/login/PaginaDeLogin';
import PaginaLicenciarUsuario from '../paginas/licenciar/PaginaLicenciarUsuario';
import { Assertiva } from 'playwright-core';

type TestFixtures = {
    login: PaginaDeLogin;
    licenciar: PaginaLicenciarUsuario;
    assertiva: Assertiva;
};

export const test = base.extend<TestFixtures>({

    login: async ({ page }, use) => {
        await use(new PaginaDeLogin(page));
    },

    licenciar: async ({ page }, use) => {
        await new PaginaDeLogin(page).executar();
        await use(new PaginaLicenciarUsuario(page));
    },

    assertiva: async ({ page }, use) => {
        await use(new Assertiva(page));
    },

});

export { expect } from 'playwright-core';
