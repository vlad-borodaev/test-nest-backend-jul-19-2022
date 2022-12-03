export class UserAlreadyExistsException extends Error {
	constructor(email: string) {
		super(`Cannot take the following email: ${email}`);
	}
}