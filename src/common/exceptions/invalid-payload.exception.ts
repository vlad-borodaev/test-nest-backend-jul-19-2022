export class InvalidPayloadException extends Error {
    constructor() {
        super("Invalid payload");
    }
}