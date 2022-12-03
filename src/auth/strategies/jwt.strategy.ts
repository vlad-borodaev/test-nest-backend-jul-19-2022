import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

export const jwt = {
	secret: process.env.JWT_SECRET,
	signOptions: {
		expiresIn: process.env.JWT_EXPIRES_IN,
		issuer: process.env.JWT_ISSUER,
	},
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: jwt.secret,
		});
	}

	async validate(payload: any) {
		return payload;
	}
}
