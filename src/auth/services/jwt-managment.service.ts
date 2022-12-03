import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { isUUID } from 'class-validator';
import {
	SessionExpiredException,
	UnprocessibleException,
	UserUnauthorizedException,
} from '../../../common/exceptions';
import { getDateInSecs } from '../../../common/utils';
import { TokenExpiredError } from 'jsonwebtoken';
import {
	GetUserDto,
	JwtResponseDto,
	JwtPayloadDto,
	JWTVerifyResultDto,
} from 'src/modules/repositories';
import {
	AuthToken,
	AuthTokensRepository,
	User,
	UsersRepository
} from 'src/modules/repositories';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

export type TJwtTokens = {
	accessToken: string,
	refreshToken: string,
};

@Injectable()
export class JwtManagmentService {
	private readonly logger = new Logger(JwtManagmentService.name);

	constructor(
		private jwtService: JwtService,
		private configService: ConfigService,
		private authTokensRepository: AuthTokensRepository,
		private usersRepository: UsersRepository,
		@InjectMapper() private mapper: Mapper,
	) { }

	async checkIfValidOrThrow(payload: JwtPayloadDto) {
		try {
			if (!payload) {
				throw new UnprocessibleException(
					'Cannot check auth session for the user',
				);
			}

			const { sub: userId, jti, exp: expirationDateInSec } = payload;

			if (!userId || !isUUID(userId, 4) || !jti) {
				throw new UnprocessibleException('Invalid access token');
			}

			const user = await this.usersRepository.findByIdAsync(userId);
			if (!user) {
				throw new UnprocessibleException('Cannot recognize the user');
			}

			const currentAccessToken = await this.authTokensRepository.findByIdAsync(userId);
			if (!currentAccessToken) {
				throw new UserUnauthorizedException();
			}

			// @FIXME: later we could set is_revoked and automatically clear the outdated tokens
			// if (currentAccessToken.is_revoked) {
			// 	throw new SessionExpiredException();
			// }

			const nowInSecs = getDateInSecs(new Date());
			if (expirationDateInSec <= nowInSecs) {
				throw new SessionExpiredException();
			}

			return {
				sub: payload.sub,
				email: payload.email,
			};
		} catch (err) {
			this.logger.error(err);
			throw err;
		}
	}

	async generateTokens(user: GetUserDto, regenerateRefreshToken: boolean = true): Promise<TJwtTokens> {
		const accessTokenParams = {
			secret: this.configService.get('JWT_SECRET'),
			expiresIn: this.configService.get('JWT_EXPIRES_IN'),
			// expirationTimestamp: this.convertDateStringToTimestamp(
			// 	this.configService.get(
			// 		'JWT_REFRESH_EXPIRES_IN_MONTHS',
			// 	)
			// ) 
		};

		const refreshTokenParams = {
			secret: this.configService.get('JWT_SECRET'),
			expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
		};

		const tokenEntity = await this.createAuthTokenEntity(
			user.id,
		);

		const signPayload = new JwtPayloadDto(user, tokenEntity.id);
		const signPayloadAsPlainObject = JSON.parse(JSON.stringify(signPayload));

		const accessTokenSignOptions = {
			secret: accessTokenParams.secret,
			expiresIn: accessTokenParams.expiresIn,
		};
		const refreshTokenSignOptions = {
			secret: refreshTokenParams.secret,
			expiresIn: refreshTokenParams.expiresIn,
		};

		const accessToken = await this.jwtService
			.signAsync(signPayloadAsPlainObject, accessTokenSignOptions);
		const refreshToken = regenerateRefreshToken ?
			await this.jwtService
				.signAsync(signPayloadAsPlainObject, refreshTokenSignOptions)
			: "";

		return {
			accessToken,
			refreshToken
		}
	}

	async generateRefreshToken(user: GetUserDto, authTokenId: string): Promise<string> {
		const expiresIn = this.configService.get('JWT_REFRESH_EXPIRES_IN');
		const secret = this.configService.get('JWT_SECRET');

		const tokenEntity = await this.authTokensRepository.findByIdAsync(authTokenId);
		if (!tokenEntity) {
			throw new UnprocessibleException("Authorization error, cannot get refresh token");
		}

		const payload = new JwtPayloadDto(user, tokenEntity.id);

		const signPayload = {
			email: payload.email,
			sub: payload.sub,
			jti: payload.jti,
		};

		const signOptions = {
			secret,
			expiresIn,
		};

		return this.jwtService.signAsync(signPayload, signOptions);
	}

	private async createAuthTokenEntity(
		userId: string
	): Promise<AuthToken> {
		try {
			if (!userId) {
				throw new UnprocessibleException(
					'Cannot create session for the user',
				);
			}

			// const expiration = new Date();
			// expiration.setTime(expiration.getTime() + ttlMillisec);

			const authToken = await this.authTokensRepository.createAsync({
				user_id: userId,
				// is_revoked: false,
				// expires_at: expiration.toString(),
			});
			return authToken;
		} catch (err) {
			throw err;
		}
	}

	async removeAuthTokenEntityById(jti: string): Promise<void> {
		try {
			if (!jti) {
				throw new UnprocessibleException(
					'Cannot detect the sessions for the user',
				);
			}

			const authToken = await this.authTokensRepository.findByIdAsync(jti);
			if (authToken) {
				await this.authTokensRepository.deleteByIdAsync(authToken.id);
			}
		} catch (err) {
			throw err;
		}
	}

	async removeAllAuthTokenEntities(userId: string): Promise<void> {
		try {
			if (!userId) {
				throw new UnprocessibleException(
					'Cannot detect the sessions for the user',
				);
			}

			await this.authTokensRepository.findByUserIdAndDeleteAsync(userId);
		} catch (err) {
			throw err;
		}
	}

	async updateAccessToken(refreshToken: string): Promise<JwtResponseDto> {
		if (!refreshToken) {
			throw new UnprocessibleException('Refresh token malformed');
		}

		const user = await this.resolveRefreshToken(refreshToken);
		const tokens = await this.createAccessTokenFromRefreshToken(
			refreshToken,
		);
		return new JwtResponseDto(user, tokens.accessToken, refreshToken);
	}

	async decodeToken(token: string): Promise<JWTVerifyResultDto> {
		try {
			const result = await this.jwtService.verifyAsync(token);
			return result;
		} catch (err) {
			const message =
				err instanceof TokenExpiredError
					? 'Refresh token expired'
					: 'Refresh token malformed';
			throw new UnprocessibleException(message);
		}
	}

	async createAccessTokenFromRefreshToken(
		refreshToken: string,
	): Promise<TJwtTokens> {
		try {
			if (!refreshToken) {
				throw new UnprocessibleException('Refresh token malformed');
			}

			const user = await this.resolveRefreshToken(refreshToken);
			const regenerateRefreshToken = false;
			const tokens = this.generateTokens(user, regenerateRefreshToken);

			return tokens;
		} catch (err) {
			throw err;
		}
	}

	public async resolveRefreshToken(encodedRefreshToken: string): Promise<GetUserDto> {
		const payload = await this.decodeToken(encodedRefreshToken);
		if (!payload || !payload.jti) {
			throw new UnprocessibleException('Refresh token malformed');
		}

		const token = await this.authTokensRepository.findByIdAsync(payload.jti);
		if (!token) {
			throw new UnprocessibleException('Refresh token not found');
		}

		// if (token.is_revoked) {
		// 	throw new UnprocessibleException('Refresh token revoked');
		// }

		const user = await this.usersRepository.findByIdAsync(payload.sub);
		if (!user) {
			throw new UnprocessibleException('Refresh token malformed');
		}

		return this.mapper.map(user, User, GetUserDto);
	}
}
