

export interface LightApiBuilder<T> extends Promise<T>{
    contentType(type:string):this;
    header(key:string, value: string):this;
    body(data: any):this;
    //timeout(term:number):this;
    cookies(cookie: Record<string, string | number>): this;
    isCredentialRequest(value:boolean):this;
    params(param:Record<string, string|number>):this;
    isDebugMode(val:booelan):this;
    baseUrl(baseUrl:string):this;

    then<Response = T, Reject = never>(
        onfulfilled?: ((value: T)=> TResult1 | PromiseLike<Response>) | null,
        rejected?: ((reason: any) => TResult2 | PromiseLike<Reject>) | null
    ):Promise<Response|Reject>

    catch<Reject = never>(
        rejected?: ((reason: any) => Reject | PromiseLike<Reject>) | null
    ): Promise<T | Reject>;

    finally(fin?: (() => void) | null): Promise<T>;
}

interface LightApi {
    get<T=unknown>(url: string):LightApiBuilder<T>
    post<T=unknown>(url: string):LightApiBuilder<T>
    put<T=unknown>(url: string):LightApiBuilder<T>
    patch<T=unknown>(url: string):LightApiBuilder<T>
    delete<T=unknown>(url: string):LightApiBuilder<T>
}

export interface LightApiConfig {
    method:Method;
    headers:Record<string, string>;
    baseUrl:string|null;
    body:string|Blob;
    uri:string|null;
    isCredentialWith:boolean;
    isDebugMode:boolean;
}

export const Method = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
} as const;


declare const LightApi: LightApi;
export default api;