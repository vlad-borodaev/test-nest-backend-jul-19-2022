export class SessionExpiredException extends Error {
    constructor() {
        super("Session expired");
    }
}