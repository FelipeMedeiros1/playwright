export class GeradorDeCPF {
    static gerarCPFValido(): string {
        const random = (): number => Math.floor(Math.random() * 9);
        const cpf = Array.from({ length: 9 }, () => random());

        const calcDV = (digitos: number[]): number => {
            const soma = digitos.reduce((acc, val, idx) => acc + val * ((digitos.length + 1) - idx), 0);
            const resto = soma % 11;
            return resto < 2 ? 0 : 11 - resto;
        };

        cpf.push(calcDV(cpf));
        cpf.push(calcDV(cpf));

        return cpf.join('');
    }
}
