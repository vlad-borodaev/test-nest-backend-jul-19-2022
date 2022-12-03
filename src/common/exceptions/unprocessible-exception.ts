export class UnprocessibleException extends Error {
    constructor(message: string) {
        super(message);
    }
}