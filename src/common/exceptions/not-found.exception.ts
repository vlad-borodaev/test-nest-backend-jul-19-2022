import { capitalizeFirstLetter } from "../utils";

export class NotFoundException extends Error {
    constructor(entityName?: string) {
        const entityNameCapitalized = capitalizeFirstLetter(entityName || "Entity");
        super(`${entityNameCapitalized} not found`);
    }
}