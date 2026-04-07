export type SessaoDeUsuario = {
    usuario: string;
    senha: string;
};

let sessao: SessaoDeUsuario;

export const definirSessao = (dados: SessaoDeUsuario) => {
    sessao = dados;
};

export const obterSessao = (): SessaoDeUsuario => {
    return sessao;
};

