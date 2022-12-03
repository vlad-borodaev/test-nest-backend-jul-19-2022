export class InternalServerException extends Error {
    constructor(errMessage?: string) {
        super(errMessage || "Internal server error");
    }
}