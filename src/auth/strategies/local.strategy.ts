import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { mapHttpError } from 'src/common/utils';
import { GetUserDto } from 'src/modules/repositories';
import { AuthService } from '../services';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private authService: AuthService) {
		super({
			usernameField: 'email',
			passwordField: 'password',
		});
	}

	async validate(email: string, password: string): Promise<GetUserDto> {
		try {
			const user = await this.authService.validateUser({
				email,
				password,
			});
			return user;
		} catch (err) {
			const httpError = mapHttpError(err);
			throw httpError;
		}
	}
}
