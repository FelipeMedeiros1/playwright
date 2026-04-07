export class TextoUtils {
  
  static removerAcentos(texto: string): string {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  static gerarTextoAleatorio(tamanho: number): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length: tamanho }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  static limparEspacos(texto: string): string {
    return texto.trim().replace(/\s+/g, ' ');
  }
}
