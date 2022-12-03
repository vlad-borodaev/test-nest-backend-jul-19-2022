import { ALLOW_ANY_KEY } from '../../../common/decorators';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	private readonly logger = new Logger(JwtAuthGuard.name);

	constructor(private readonly reflector: Reflector) {
		super();
	}

	handleRequest(err: unknown, user: any, info: any, context: any) {
		if (user) {
			return user;
		}

		const allowAny = this.reflector.get<string[]>(
			ALLOW_ANY_KEY,
			context.getHandler(),
		);
		if (allowAny) {
			return true;
		}

		if (err || info || !user) {
			this.logger.error(err || info);
			throw err || info || new UnauthorizedException();
		}

		return user;
	}
}
