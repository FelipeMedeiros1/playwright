import { test }        from '../config/BaseTeste';
import PaginaExemplo   from '../paginas/PaginaExemplo';

test.describe('Qa - Exemplo', () => {

    test('Deve executar o cenario de sucesso', async ({ pagina }) => {
        const tela = new PaginaExemplo(pagina);
        await tela.executar('sucesso');
    });

    test('Deve executar o cenario de falha', async ({ pagina }) => {
        const tela = new PaginaExemplo(pagina);
        await tela.executar('falha');
    });

});
