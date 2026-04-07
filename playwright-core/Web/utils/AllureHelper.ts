// e2e/utils/AllureHelper.ts
import type { Page, BrowserContext, TestInfo } from '@playwright/test';
import {
    allure,
    LabelName,
    Severity,
    LinkType,
} from 'allure-commandline';

/**
 * Wrapper utilitário para Allure.
 * - Concentra labels, links, severidades, anexos, parâmetros e steps.
 * - Se a API do Allure mudar, altere apenas aqui.
 */
export class AllureHelper {
    /** Marca o dono/responsável do teste */
    static owner(name: string) {
        try { allure.label(LabelName.OWNER, name); } catch { /* noop */ }
    }

    /** Define severidade do caso de teste */
    static severity(level: Severity) {
        try { allure.severity(level); } catch { /* noop */ }
    }

    /** Adiciona uma label arbitrária */
    static label(name: LabelName | string, value: string) {
        try { allure.label(name as LabelName, value); } catch { /* noop */ }
    }

    /** Funcionais comuns */
    static epic(name: string) { this.label(LabelName.EPIC, name); }
    static feature(name: string) { this.label(LabelName.FEATURE, name); }
    static story(name: string) { this.label(LabelName.STORY, name); }
    static tag(tag: string) { this.label(LabelName.TAG, tag); }
    static suite(name: string) { this.label(LabelName.SUITE, name); }
    static subSuite(name: string) { this.label(LabelName.SUB_SUITE, name); }
    static parentSuite(name: string) { this.label(LabelName.PARENT_SUITE, name); }
    // static environment(env: string) { this.label(LabelName.ENVIRONMENT, env); }

    /** Links */
    static tms(name: string, url: string) { this.link(name, url, LinkType.TMS); }
    static issue(name: string, url: string) { this.link(name, url, LinkType.ISSUE); }
    static link(name: string, url: string, type?: LinkType) {
        try { allure.link(url, name, type); } catch { /* noop */ }
    }

    /** Descrições */
    static description(text: string) { try { allure.description(text); } catch { } }
    static descriptionHtml(html: string) { try { allure.descriptionHtml(html); } catch { } }

    /** Parâmetros visíveis no relatório */
    static parameter(name: string, value: unknown) {
        try { allure.parameter(name, String(value)); } catch { /* noop */ }
    }

    /** Step genérico com medida de tempo e aninhamento no Allure */
    static async step<T>(title: string, body: () => Promise<T> | T): Promise<T> {
        try {
            return await allure.step(title, async () => await body());
        } catch {
            // Mesmo que Allure quebre/esteja ausente, ainda executa o corpo
            return await body();
        }
    }

    /** --------- Anexos (attachments) --------- */

    /** Anexa texto simples */
    static attachText(name: string, content: string) {
        try { allure.attachment(name, content, 'text/plain'); } catch { /* noop */ }
    }

    /** Anexa JSON */
    static attachJSON(name: string, obj: unknown, pretty = true) {
        const text = pretty ? JSON.stringify(obj, null, 2) : JSON.stringify(obj);
        try { allure.attachment(name, text, 'application/json'); } catch { /* noop */ }
    }

    /** Anexa buffer/base64 com mime type específico */
    static attachBuffer(name: string, buffer: Buffer | Uint8Array, mime: string) {
        try { allure.attachment(name, Buffer.from(buffer), mime); } catch { /* noop */ }
    }

    /** Screenshot direto da página e anexa ao Allure */
    static async attachScreenshot(page: Page, name = 'screenshot') {
        const buf = await page.screenshot({ fullPage: false });
        this.attachBuffer(name, buf, 'image/png');
    }

    /** HTML da página atual (útil para debug) */
    static async attachPageSource(page: Page, name = 'page-source.html') {
        const html = await page.content();
        this.attachText(name, html);
    }

    /** Cookies + storage */
    static async attachStorage(context: BrowserContext, name = 'storage-state.json') {
        const state = await context.storageState();
        this.attachJSON(name, state);
    }

    /** Anexa qualquer arquivo já existente no disco (ex.: HAR, logs) */
    static async attachFileFromDisk(fsPath: string, displayName?: string, mime = 'application/octet-stream') {
        try {
            const { readFile } = await import('fs/promises');
            const data = await readFile(fsPath);
            this.attachBuffer(displayName ?? fsPath, data, mime);
        } catch { /* noop */ }
    }

    /** Marca a execução como “bloqueante”/crítica rapidamente */
    static critical(owner?: string, featureName?: string) {
        if (owner) this.owner(owner);
        if (featureName) this.feature(featureName);
        this.severity(Severity.CRITICAL);
    }

    /** Facilita o uso com Playwright `test.info()` – por ex. salvar anexos adicionais do runner */
    static attachFromTestInfo(info: TestInfo, name: string, pathOrBuffer: string | Buffer, mime?: string) {
        // Playwright já envia para o reporter; mantenha para compatibilidade com outros reporters
        if (typeof pathOrBuffer === 'string') {
            info.attachments.push({ name, path: pathOrBuffer, contentType: mime ?? 'application/octet-stream' });
        } else {
            info.attachments.push({ name, body: Buffer.from(pathOrBuffer), contentType: mime ?? 'application/octet-stream' });
        }
    }
}
