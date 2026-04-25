import {LightApiBuilder, LightApiConfig, Method } from './index.d'

const defaultConfig:LightApiConfig = {
    baseUrl: '',
    body: '',
    headers: {'content-type':'application/json'},
    isCredentialWith: false,
    isDebugMode: false,
    method:Method.GET ,
    uri: ''
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

            const response = await fetch(requestUrl?requestUrl:'', fetchOptions);

            if(!response.ok) throw { status: response.status }

            const data:T = await response.json().catch((reason) => { throw {reason} });

            return data
        })();

        return promise
    }

    const builder: LightApiBuilder<T> = {
        baseUrl(val) {
            config.baseUrl = val;
            return builder;
        },
        header(key,value){
            config.headers[key] = value;
            return builder;
        },

        contentType(type) {
            config.headers['Content-Type'] = type;
            return builder;
        },

        body(data) {
            config.body = JSON.stringify(data);
            return builder;
        },

        params(p) {
            const sp = new URLSearchParams(p as any).toString();
            if(config.uri){
                config.uri += (config.uri.includes('?') ? '&' : '?') + sp;
            }else{
                config.uri = sp
            }
            return builder;
        },

        cookies(c) {
            config.headers['Cookie'] = Object.entries(c).map(([k, v]) => `${k}=${v}`).join('; ');
            return builder;
        },

        isCredentialRequest(withCredential) {
            config.isCredentialWith = withCredential
            return builder;
        },

        isDebugMode(isDebug) {
            config.isDebugMode = isDebug; return builder;
        },

        then(onfulfilled, rejected) { return execute().then(onfulfilled, rejected); },
        catch(rejected) { return execute().catch(rejected); },
        finally(fin) { return execute().finally(fin); },
        [Symbol.toStringTag]: 'Promise'
    }

    return builder;
}
