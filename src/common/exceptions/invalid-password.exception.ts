export class InvalidPasswordException extends Error {
    constructor() {
        super("Invalid password");
    }
}