export class Validador {
    static emailValido(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    static cpfValido(cpf: string): boolean {
        return /^\d{11}$/.test(cpf);
    }

    static dataValida(data: string): boolean {
        return /^\d{2}\/\d{2}\/\d{4}$/.test(data);
    }
}
