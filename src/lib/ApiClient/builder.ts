import {LightApiBuilder, LightApiConfig, Method, ResponseType} from './types'
import {LightApiError} from "@/lib/ApiClient/LightApiError";

const defaultConfig:LightApiConfig = {
    baseUrl: '',
    body: '',
    headers: {'content-type':'application/json'},
    isCredentialWith: false,
    isDebugMode: false,
    method:Method.GET ,
    uri: '',
    responseType:ResponseType.JSON
}

export function lightApiBuilder<T>(customConfig?: Partial<LightApiConfig>):LightApiBuilder<T>{
    const h = customConfig?.headers || {};
    const config = {
        ...defaultConfig,
        ...customConfig,
        headers: { ...defaultConfig.headers, ...(h || {}) }
    }

    let promise:Promise<T> | null = null;

    const execute = async():Promise<T>=>{
        if(promise) return promise;

        promise = (async ()=>{
            const requestUrl = config.baseUrl? config.baseUrl + config.uri :config.uri;

            const fetchOptions: RequestInit = {
                method: config.method,
                headers: config.headers,
                body: ['GET', 'HEAD'].includes(config.method) ? undefined : config.body,
                credentials: config.isCredentialWith ? 'include' : 'same-origin'
            };

            const response:Response = await fetch(requestUrl?requestUrl:'', fetchOptions);

            if(!response.ok){
                const statusMessage = response.statusText || 'Unknown Error';

                let body;

                const rawTextBody = await response.text().catch((e)=> {
                    throw new LightApiError("Fail to Read Body", response.status, response,"")
                })

                try{
                    body = JSON.parse(rawTextBody)
                }catch (e){
                    body = rawTextBody;
                }

                const finalMessage = (typeof body === 'object' && body !== null)
                    ? (body.message || body.error || JSON.stringify(body))
                    : (body || response.statusText || `HTTP Error ${response.status}`);

                throw new LightApiError(finalMessage,response.status,response,body);
            }
            let data: any;

            try {
                switch (config.responseType) {
                    case ResponseType.JSON:
                        data = await response.json();
                        break;
                    case ResponseType.TEXT:
                        data = await response.text();
                        break;
                    case ResponseType.BLOB:
                        data = await response.blob();
                        break;
                    default: {
                        const rawText = await response.text().catch(() => "");
                        try {
                            data = JSON.parse(rawText);
                        } catch {
                            data = rawText;
                        }
                        break;
                    }
                }
            } catch (e: any) {
                throw new LightApiError(
                    `Parsing Failed: ${JSON.parse(e.message) || response.statusText}`,
                    response.status,
                    response,
                    "Check responseType or body format"
                );
            }
            return data as T;
        })();
        return promise
    }

    const builder: LightApiBuilder<T> = {
        baseUrl(val) {
            config.baseUrl = val ? val : "";
            return proxy;
        },
        header(key,value){
            config.headers[key] = value;
            return proxy;
        },

        contentType(type) {
            config.headers['Content-Type'] = type;
            return proxy;
        },

        body(data) {
            config.body = JSON.stringify(data);
            return proxy;
        },

        params(p) {
            const sp = new URLSearchParams(p as any).toString();
            if(config.uri){
                config.uri += (config.uri.includes('?') ? '&' : '?') + sp;
            }else{
                config.uri = sp
            }
            return proxy;
        },

        cookies(c) {
            config.headers['Cookie'] = Object.entries(c).map(([k, v]) => `${k}=${v}`).join('; ');
            return proxy;
        },

        isCredentialRequest(withCredential) {
            config.isCredentialWith = withCredential
            return proxy;
        },

        isDebugMode(isDebug) {
            config.isDebugMode = isDebug;
            return proxy;
        },

        responseType(type){
            config.responseType = type;
            return proxy;
        },
        then(onfulfilled, rejected) { return execute().then(onfulfilled, rejected); },
        catch(rejected) { return execute().catch(rejected); },
        finally(fin) { return execute().finally(fin); },
        [Symbol.toStringTag]: 'Promise'
    }

    const proxy = new Proxy(builder, {
        get(target, prop, receiver) {
            if (prop in target || prop === 'then') {
                return Reflect.get(target, prop, receiver);
            }
        }
    });

    return proxy as unknown as LightApiBuilder<T>;
}
