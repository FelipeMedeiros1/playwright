import fs from 'fs';

export class LeitorDeArquivo {

    static lerJSON(caminho: string) {
        const data = fs.readFileSync(caminho, 'utf8');
        return JSON.parse(data);
    }

    static lerTexto(caminho: string): string {
        return fs.readFileSync(caminho, 'utf8');
    }
}
