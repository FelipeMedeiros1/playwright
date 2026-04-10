import { test } from '../../config/BaseTeste';

test.describe("Sessão Licenciamento", () => {

    test("Deve licenciar ferramenta para o usuario", async ({ licenciar }) => {
        await licenciar.executar('sucesso');
    });

    test("Não deve licenciar ferramenta com dados inválidos", async ({ licenciar }) => {
        await licenciar.executar('falha');
    });
});



