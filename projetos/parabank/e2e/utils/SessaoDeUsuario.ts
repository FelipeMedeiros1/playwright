/**
 * Módulo de sessão do usuário autenticado.
 *
 * Funciona como um singleton em memória: o `globalSetup` grava os dados
 * uma única vez antes de qualquer teste, e qualquer página ou fixture
 * os consome via `obterSessao()` sem precisar reler o arquivo de dados.
 *
 * Fluxo:
 *   globalSetup.ts
 *     └─ definirSessao({ usuario, senha })   ← grava uma vez
 *
 *   PaginaDeLogin.ts / qualquer fixture
 *     └─ obterSessao().usuario               ← lê em qualquer ponto
 */

/**
 * Formato dos dados do usuário mantidos em sessão durante a execução.
 */
export type SessaoDeUsuario = {
    usuario: string;
    senha: string;
};

/** Armazenamento interno da sessão — inicializado pelo globalSetup. */
let sessao: SessaoDeUsuario;

/**
 * Grava os dados do usuário na sessão.
 * Deve ser chamado no `globalSetup`, antes de qualquer teste ser executado.
 *
 * @param dados Credenciais do usuário que será usado nos testes.
 */
export const definirSessao = (dados: SessaoDeUsuario) => {
    sessao = dados;
};

/**
 * Retorna os dados do usuário gravados na sessão.
 * Disponível em qualquer Page Object, fixture ou utilitário.
 *
 * @returns Credenciais definidas pelo globalSetup.
 */
export const obterSessao = (): SessaoDeUsuario => {
    return sessao;
};
