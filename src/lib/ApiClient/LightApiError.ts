
export class LightApiError extends Error{
    constructor(
        public message:string,
        public status:number,
        public response:Response,
        public data?:any,
    ) {
        super(message);
        this.name = 'LightApiError'
    }
}