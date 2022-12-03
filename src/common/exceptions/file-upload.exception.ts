export class FileUploadException extends Error {
    constructor() {
        super("An error occurred when uploading the file");
    }
}