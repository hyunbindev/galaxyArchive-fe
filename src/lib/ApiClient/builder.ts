import { LightApiBuilder, LightApiConfig, Method, ResponseType } from './types'
import { LightApiError } from "@/lib/ApiClient/LightApiError";

// 구조 분해 할당을 위해 함수 내부나 매 요청마다 새로 생성되도록 처리하는 것이 안전함
const createDefaultConfig = (): LightApiConfig => ({
    baseUrl: '',
    body: '',
    headers: { 'content-type': 'application/json' },
    isCredentialWith: false,
    isDebugMode: false,
    method: Method.GET,
    uri: '',
    responseType: ResponseType.JSON
});

function lightApiBuilder<T>(customConfig?: Partial<LightApiConfig>): LightApiBuilder<T> {
    const defaultCfg = createDefaultConfig();

    const config: LightApiConfig = {
        ...defaultCfg,
        ...customConfig,
        headers: {
            ...defaultCfg.headers,
            ...(customConfig?.headers || {})
        }
    };

    let promise: Promise<T> | null = null;

    const execute = async (): Promise<T> => {
        if (promise) return promise;

        promise = (async () => {
            const requestUrl = config.baseUrl ? config.baseUrl + config.uri : config.uri;

            const fetchOptions: RequestInit = {
                method: config.method,
                headers: config.headers,
                body: ['GET', 'HEAD'].includes(config.method) ? undefined : config.body,
                credentials: config.isCredentialWith ? 'include' : 'same-origin'
            };

            const response = await fetch(requestUrl || '', fetchOptions);

            if (!response.ok) {
                const rawTextBody = await response.text().catch(() => {
                    throw new LightApiError("Fail to Read Body", response.status, response, "");
                });

                let body;
                if (rawTextBody && rawTextBody.trim().length > 0) {
                    try {
                        body = JSON.parse(rawTextBody);
                    } catch (e) {
                        body = rawTextBody;
                    }
                } else {
                    body = { message: response.statusText || "No response body" };
                }

                const finalMessage = (typeof body === 'object' && body !== null)
                    ? (body.message || body.error || JSON.stringify(body))
                    : (body || response.statusText || `HTTP Error ${response.status}`);

                throw new LightApiError(finalMessage, response.status, response, body);
            }

            const rawText = await response.text().catch(() => "");

            switch (config.responseType) {
                case ResponseType.JSON: {
                    if (!rawText || rawText.trim().length === 0) {
                        return {} as T;
                    }
                    return JSON.parse(rawText) as T;
                }
                case ResponseType.TEXT:
                    return rawText as any;

                case ResponseType.BLOB: {

                    return new Blob([rawText]) as any;
                }

                default: {
                    if (rawText.length === 0) return undefined as any;
                    try {
                        return JSON.parse(rawText);
                    } catch {
                        return rawText as any;
                    }
                }
            }
        })();
        return promise;
    };

    const builder: LightApiBuilder<T> = {
        baseUrl(val) {
            config.baseUrl = val || "";
            return builder;
        },
        header(key, value) {
            config.headers[key] = value;
            return builder;
        },
        contentType(type) {
            delete config.headers['content-type'];
            config.headers['Content-Type'] = type;
            return builder;
        },
        body(data) {
            config.body = JSON.stringify(data);
            return builder;
        },
        params(p) {
            const sp = new URLSearchParams(p as any).toString();
            if (config.uri) {
                config.uri += (config.uri.includes('?') ? '&' : '?') + sp;
            } else {
                config.uri = sp;
            }
            return builder;
        },
        cookies(c) {
            config.headers['Cookie'] = Object.entries(c).map(([k, v]) => `${k}=${v}`).join('; ');
            return builder;
        },
        isCredentialRequest(withCredential) {
            config.isCredentialWith = withCredential;
            return builder;
        },
        isDebugMode(isDebug) {
            config.isDebugMode = isDebug;
            return builder;
        },
        responseType(type) {
            config.responseType = type;
            return builder;
        },

        then(onfulfilled, rejected) { return execute().then(onfulfilled, rejected); },
        catch(rejected) { return execute().catch(rejected); },
        finally(fin) { return execute().finally(fin); },
        [Symbol.toStringTag]: 'Promise'
    };

    return builder;
}

export default lightApiBuilder;