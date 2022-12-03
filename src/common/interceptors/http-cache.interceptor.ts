import { CacheInterceptor, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
    trackBy(context: ExecutionContext): string | undefined {
        const request = context.switchToHttp().getRequest();
        const { httpAdapter } = this.httpAdapterHost;

        const isGetRequest = httpAdapter.getRequestMethod(request) === 'GET';
        const excludePaths = [
            // Routes to be excluded
        ];

        const isCacheDisabled = (
            !isGetRequest ||
            isGetRequest && excludePaths.includes(httpAdapter.getRequestUrl(request))
        );

        if (isCacheDisabled) {
            return undefined;
        }

        return httpAdapter.getRequestUrl(request);
    }
}