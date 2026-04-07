import { test } from '../../baseTeste/BaseTeste';

test.describe("Sessão Login", () => {

    test("Deve fazer login com usuário e senha válidos", async ({ Login }) => {
        await Login.executar();
    });
});

