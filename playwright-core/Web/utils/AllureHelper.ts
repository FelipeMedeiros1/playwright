// e2e/utils/AllureHelper.ts
import {
    label,
    LabelName,
    Severity,
    LinkType,
    severity as setSeverity,
    link as setLink,
    description as setDescription,
    descriptionHtml as setDescriptionHtml,
    parameter as setParameter,
    step as runStep,
    attachment as setAttachment,
    epic as setEpic,
    feature as setFeature,
    story as setStory,
    owner as setOwner,
    suite as setSuite,
    subSuite as setSubSuite,
    parentSuite as setParentSuite,
    tag as setTag,
} from 'allure-js-commons';

export { LabelName, Severity, LinkType };

export class AllureHelper {

    static owner(name: string)               { try { setOwner(name);                   } catch { } }
    static severity(level: Severity)         { try { setSeverity(level);               } catch { } }
    static label(name: string, value: string){ try { label(name, value);               } catch { } }
    static epic(name: string)                { try { setEpic(name);                    } catch { } }
    static feature(name: string)             { try { setFeature(name);                 } catch { } }
    static story(name: string)               { try { setStory(name);                   } catch { } }
    static tag(t: string)                    { try { setTag(t);                        } catch { } }
    static suite(name: string)               { try { setSuite(name);                   } catch { } }
    static subSuite(name: string)            { try { setSubSuite(name);                } catch { } }
    static parentSuite(name: string)         { try { setParentSuite(name);             } catch { } }

    static tms(name: string, url: string)    { try { setLink(url, name, LinkType.TMS); } catch { } }
    static issue(name: string, url: string)  { try { setLink(url, name, 'issue');      } catch { } }
    static link(name: string, url: string, type?: string) {
        try { setLink(url, name, type); } catch { }
    }

    static description(text: string)         { try { setDescription(text);             } catch { } }
    static descriptionHtml(html: string)     { try { setDescriptionHtml(html);         } catch { } }

    static parameter(name: string, value: unknown) {
        try { setParameter(name, String(value)); } catch { }
    }

    static async step<T>(title: string, body: () => Promise<T> | T): Promise<T> {
        try {
            return await runStep(title, async () => await body());
        } catch {
            return await body();
        }
    }

    static attachText(name: string, content: string) {
        try { setAttachment(name, content, { contentType: 'text/plain' }); } catch { }
    }

    static attachJSON(name: string, obj: unknown, pretty = true) {
        const text = pretty ? JSON.stringify(obj, null, 2) : JSON.stringify(obj);
        try { setAttachment(name, text, { contentType: 'application/json' }); } catch { }
    }
}
