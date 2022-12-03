import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
    RequestTimeoutException
} from "@nestjs/common";
import { catchError, Observable, throwError, timeout, TimeoutError } from "rxjs";

const REQUEST_TIMEOUT = 6000;

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        return next
            .handle()
            .pipe(
                timeout(REQUEST_TIMEOUT),
                catchError(err => {
                    if (err instanceof TimeoutError) {
                        return throwError(() => new RequestTimeoutException());
                    }

                    return throwError(() => err);
                })
            );
    }
}