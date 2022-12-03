import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    Logger
} from "@nestjs/common";
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: any, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();
        const request = context.getRequest<Request>();

        const errorMessage = exception.message;
        const status = exception.getStatus();

        this.logger.error(exception);

        response
            .status(status)
            .json({
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
                message: errorMessage
            });
    }
}