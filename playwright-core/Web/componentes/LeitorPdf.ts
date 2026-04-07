import fs from 'fs';
import pdfParse from 'pdf-parse';

export class LeitorPdf {
    static async lerConteudo(caminho: string): Promise<string> {
        const buffer = fs.readFileSync(caminho);
        const data = await pdfParse(buffer);
        return data.text;
    }
}
