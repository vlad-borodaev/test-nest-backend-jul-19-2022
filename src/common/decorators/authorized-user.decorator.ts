import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GetUserDto } from 'src/modules/repositories';

export const AuthorizedUser = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest();
		return request.user as GetUserDto;
	},
);
