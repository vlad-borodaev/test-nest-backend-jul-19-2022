export class UserUnauthorizedException extends Error {
    constructor() {
        super("User unauthorized");
    }
}