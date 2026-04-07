export class NumeroUtils {

    static formatarMoeda(valor: number, locale: string = 'pt-BR', moeda: string = 'BRL'): string {
        return new Intl.NumberFormat(locale, { style: 'currency', currency: moeda }).format(valor);
    }

    static formatarPorcentagem(valor: number): string {
        return `${(valor * 100).toFixed(2)}%`;

    }
}