export class DataUtils {
    // Retorna a data atual no formato ISO (YYYY-MM-DD)
    static dataAtualISO(): string {
        return new Date().toISOString().split('T')[0];
    }

    // Retorna a data no formato DD/MM/AAAA
    static formatarParaBR(data: Date): string {
        return `${String(data.getDate()).padStart(2, '0')}/` +
            `${String(data.getMonth() + 1).padStart(2, '0')}/` +
            `${data.getFullYear()}`;
    }

    // Retorna a data no formato MM/DD/AAAA
    static formatarParaEUA(data: Date): string {
        return `${String(data.getMonth() + 1).padStart(2, '0')}/` +
            `${String(data.getDate()).padStart(2, '0')}/` +
            `${data.getFullYear()}`;
    }

    // Retorna data e hora atuais no formato ISO completo
    static dataHoraAtualISO(): string {
        return new Date().toISOString();
    }

    // Retorna somente a hora atual (HH:mm:ss)
    static horaAtual(): string {
        const agora = new Date();
        return `${String(agora.getHours()).padStart(2, '0')}:` +
            `${String(agora.getMinutes()).padStart(2, '0')}:` +
            `${String(agora.getSeconds()).padStart(2, '0')}`;
    }

    // Adiciona dias a uma data
    static adicionarDias(data: Date, dias: number): Date {
        const novaData = new Date(data);
        novaData.setDate(novaData.getDate() + dias);
        return novaData;
    }

    // Subtrai dias de uma data
    static subtrairDias(data: Date, dias: number): Date {
        const novaData = new Date(data);
        novaData.setDate(novaData.getDate() - dias);
        return novaData;
    }
}
