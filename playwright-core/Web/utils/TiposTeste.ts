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

