import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

// @FIXME: the ParseIntPipe pipe is already available out-of-the-box, so it is just an example
// for any other pipes implementation in the future

@Injectable()
export class ParseIntPipe implements PipeTransform<string> {
    async transform(value: string, metadata: ArgumentMetadata): Promise<number> {
        const targetNumber = parseInt(value, 10);

        if (isNaN(targetNumber)) {
            throw new BadRequestException("Number validation failed");
        }

        return targetNumber;
    }
}