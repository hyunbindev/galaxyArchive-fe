

export interface LightApiBuilder<T> extends Promise<T>{
    contentType(type:string):this;
    header(key:string, value: string):this;
    body(data: any):this;
    //timeout(term:number):this;
    cookies(cookie: Record<string, string | number>): this;
    isCredentialRequest(value:boolean):this;
    params(param:Record<string, string|number>):this;
    isDebugMode(val:boolean):this;
    baseUrl(baseUrl:string|undefined):this;
    responseType(type:ResponseType):this;

    then<Response = T, Reject = never>(
        onfulfilled?: ((value: T)=> Response | PromiseLike<Response>) | null,
        rejected?: ((reason: any) => Reject | PromiseLike<Reject>) | null
    ):Promise<Response|Reject>

    catch<Reject = never>(
        rejected?: ((reason: any) => Reject | PromiseLike<Reject>) | null
    ): Promise<T | Reject>;

    finally(fin?: (() => void) | null): Promise<T>;
}

export interface LightApi {
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
    responseType:ResponseType
}



export enum Method{
    GET= 'GET',
    POST= 'POST',
    PUT= 'PUT',
    PATCH= 'PATCH',
    DELETE= 'DELETE',
}

export enum ResponseType{
    TEXT = 'TEXT',
    JSON = 'JSON',
    BLOB = 'BLOB',
    DEFAULT = 'DEFAULT'
}