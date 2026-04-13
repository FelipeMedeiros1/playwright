/**
 * Cenários padrão de teste.
 * Além dos fixos (sucesso, falha, alteracao),
 * aceita qualquer string customizada: 'TC01', 'TC02', etc.
 */
export type Cenario = 'sucesso' | 'falha' | 'alteracao' | (string & {});

/**
 * Mapa genérico de cenários → dados T.
 *
 * @example
 * interface Credenciais { matricula: string; senha: string; }
 * const dados = LeitorDeArquivo.lerDados<DadosTeste<Credenciais>>('...');
 * dados['sucesso'].matricula
 * dados['TC01'].senha
 */
export type DadosTeste<T> = { sucesso: T; falha: T } & { [cenario: string]: T };

/**
 * Wrapper de dados de teste com acesso por cenário.
 *
 * @example
 * const dados = pb.carregarDados<Credenciais>('e2e/dados/credenciais/dadosUsuario.json');
 * const { matricula, senha } = dados.obter(cenario);
 */
export class DadosCenario<T> {
    private readonly mapa: DadosTeste<T>;

    constructor(mapa: DadosTeste<T>) {
        this.mapa = mapa;
    }

    obter(cenario: Cenario): T {
        const item = this.mapa[cenario];
        if (!item) throw new Error(`Cenário "${cenario}" não encontrado nos dados de teste.`);
        return item;
    }
}

