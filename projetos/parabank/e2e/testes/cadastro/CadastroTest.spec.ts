import { test } from '../../baseTeste/BaseTeste';

test.describe("Sessão Cadastro", () => {

    test("Deve cadastrar usuário com sucesso", async ({ CadastrarUsuario }) => {
        await CadastrarUsuario.executar();
    });

    test("Deve atualizar usuário com sucesso", async ({ AtualizarUsuario }) => {
        await AtualizarUsuario.executar();
    });
});

