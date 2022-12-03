export class UnsupportedFileTypeException extends Error {
    constructor(fileType: string) {
        super(`Unsupported file type: ${fileType}`);
    }
}