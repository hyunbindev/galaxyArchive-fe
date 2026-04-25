import { lightApiBuilder } from './builder';
import { Method ,LightApi } from './types';

const createRequest = <T>(uri: string, method: typeof Method[keyof typeof Method]) => {
    return lightApiBuilder<T>({uri:uri,method:method});
};

export const lightApi: LightApi = {
    get: <T = unknown>(url: string) => createRequest<T>(url, Method.GET),
    post: <T = unknown>(url: string) => createRequest<T>(url, Method.POST),
    put: <T = unknown>(url: string) => createRequest<T>(url, Method.PUT),
    patch: <T = unknown>(url: string) => createRequest<T>(url, Method.PATCH),
    delete: <T = unknown>(url: string) => createRequest<T>(url, Method.DELETE),
};

export default lightApi;