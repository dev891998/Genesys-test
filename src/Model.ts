
export class ServiceError implements Error{
    name = "ServiceError";
    message="Unknown Service Error";
    code:number;
    stack:string | undefined;
    constructor(message:string, code=500, stack?:string) {
        this.message = message;
        this.code = code;
        this.stack = stack
    }
}