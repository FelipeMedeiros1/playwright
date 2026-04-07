import { test } from '../../config/BaseTeste';

test.describe("Sessão Login", () => {

    test("Deve fazer login com sucesso", async ({ Login }) => {
        await Login.executar();
    });
});

test.describe('Pagina Inicial', () => {

    test('Deve acessar a pagina inicial', async ({ pagina, assertiva }) => {
        await pagina.goto('/');
        await assertiva.estaVisivel(pagina.getByRole('heading', { name: 'Entre na sua conta' }));
    });
});
