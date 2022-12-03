export class DeleteFileException extends Error {
    constructor() {
        super("Error while deleting file");
    }
}