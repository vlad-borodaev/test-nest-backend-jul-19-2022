export class EnitityAlreadyExistsException extends Error {
    constructor(entity: string, property: string) {
        super(`${entity.toLowerCase()} with property '${property}' already exists`);
    }
}