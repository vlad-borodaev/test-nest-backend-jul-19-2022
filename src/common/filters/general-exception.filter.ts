import { ArgumentsHost, Catch, InternalServerErrorException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class GeneralExceptionFilter extends BaseExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        super.catch(new InternalServerErrorException(exception.message), host);
    }
}