import fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';

export class LeitorDeArquivo {

    private static resolver(caminho: string): string {
        return path.isAbsolute(caminho) ? caminho : path.resolve(process.cwd(), caminho);
    }

    static lerJSON<T = unknown>(caminho: string): T {
        const conteudo = fs.readFileSync(LeitorDeArquivo.resolver(caminho), 'utf8').replace(/^\uFEFF/, '');
        return JSON.parse(conteudo) as T;
    }

    static lerYAML<T = unknown>(caminho: string): T {
        const conteudo = fs.readFileSync(LeitorDeArquivo.resolver(caminho), 'utf8').replace(/^\uFEFF/, '');
        return yaml.load(conteudo) as T;
    }

    static lerDados<T = unknown>(caminho: string): T {
        const ext = path.extname(caminho).toLowerCase();
        if (ext === '.yaml' || ext === '.yml') return LeitorDeArquivo.lerYAML<T>(caminho);
        if (ext === '.json')                   return LeitorDeArquivo.lerJSON<T>(caminho);
        throw new Error(`Formato não suportado: "${ext}". Use .json, .yaml ou .yml`);
    }

    static lerTexto(caminho: string): string {
        return fs.readFileSync(LeitorDeArquivo.resolver(caminho), 'utf8');
    }
}
