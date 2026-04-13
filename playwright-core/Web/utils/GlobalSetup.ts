import fs   from 'fs';
import path from 'path';
import type { FullConfig } from '@playwright/test';

interface OpcoesGlobalSetup {
    url?:      string;
    ambiente?: string;
}

/**
 * Configura o ambiente de teste antes da execução.
 * Grava `environment.properties` em `reports/allure-results/` para o widget ENVIRONMENT do Allure.
 *
 * @example
 * // e2e/config/globalSetup.ts
 * import { configurarAmbiente } from 'playwright-core';
 * export default configurarAmbiente({ url: 'https://meu-sistema.com' });
 */
export function configurarAmbiente(opcoes: OpcoesGlobalSetup = {}) {
    return async function globalSetup(config: FullConfig) {
        // config.rootDir = pasta do playwright.config.ts do projeto — nunca muda
        const resultsDir = path.resolve(config.rootDir, 'reports', 'allure-results');
        fs.mkdirSync(resultsDir, { recursive: true });

        const agora = new Date();
        const data  = agora.toLocaleDateString('pt-BR');
        const hora  = agora.toLocaleTimeString('pt-BR');

        const conteudo = [
            `Data_Execucao=${data}`,
            `Hora_Execucao=${hora}`,
            `Ambiente=${opcoes.ambiente ?? 'Homologacao'}`,
            `URL=${opcoes.url ?? ''}`,
        ].join('\n');

        fs.writeFileSync(path.join(resultsDir, 'environment.properties'), conteudo, 'utf8');
    };
}
