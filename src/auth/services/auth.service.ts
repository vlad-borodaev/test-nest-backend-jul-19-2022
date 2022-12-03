import { Injectable, Logger } from '@nestjs/common';
import {
	InvalidPasswordException,
	InvalidPayloadException,
	UnprocessibleException,
	UserAlreadyExistsException,
} from '../../../common/exceptions';
import { JwtManagmentService } from './jwt-managment.service';
import {
	CreateEntityPayload,
	CreateUserDto,
	RegisterPayloadDto,
	User,
	UsersRepository
} from 'src/modules/repositories';
import {
	GetUserDto,
	LoginPayloadDto,
	JwtResponseDto,
} from 'src/modules/repositories';
import { hashPassword, verifyPassword } from 'src/common/utils';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name);

	constructor(
		private usersRepository: UsersRepository,
		private jwtManagmentService: JwtManagmentService,
		@InjectMapper() private mapper: Mapper,
	) { }

	async validateUser(payload: LoginPayloadDto): Promise<GetUserDto> {
		console.log("payload", payload);

		if (!payload || !payload.email?.trim() || !payload.password?.trim()) {
			throw new InvalidPayloadException();
		}

		try {
			const { email, password } = payload;

			const user = await this.usersRepository.findByEmailAsync(email);

			const isPasswordVerified = await verifyPassword(
				user.pwd_hash,
				password,
			);

			console.log("isPasswordVerified", isPasswordVerified);

			if (!isPasswordVerified) {
				throw new InvalidPasswordException();
			}

			const result = this.mapper.map(user, User, GetUserDto);
			return result;
		} catch (err) {
			throw err;
		}
	}

	async login(userDto: GetUserDto): Promise<JwtResponseDto> {
		try {
			const {
				accessToken,
				refreshToken
			} = await this.jwtManagmentService.generateTokens(userDto);

			return new JwtResponseDto(userDto, accessToken, refreshToken);
		} catch (err) {
			throw new UnprocessibleException(err.message);
		}
	}

	async register(payload: RegisterPayloadDto): Promise<JwtResponseDto> {
		try {
			const alreadyExistingUser = await this.usersRepository
				.findByEmailAsync(payload.email);

			if (alreadyExistingUser) {
				throw new UserAlreadyExistsException(payload.email);
			}

			if (!payload.password) {
				throw new InvalidPayloadException();
			}

			const createUserDto = this.mapper.map(payload, RegisterPayloadDto, CreateUserDto);

			const passwordHash = await hashPassword(payload.password);
			createUserDto.pwd_hash = passwordHash;

			const user = await this.usersRepository
				.createAsync(createUserDto as unknown as CreateEntityPayload<User>);

			const getUserDto = this.mapper.map(user, User, GetUserDto);

			const {
				accessToken,
				refreshToken
			} = await this.jwtManagmentService.generateTokens(getUserDto);

			return new JwtResponseDto(getUserDto, accessToken, refreshToken);
		} catch (err) {
			throw new UnprocessibleException(err.message);
		}
	}

	async logout(accessToken: string, refreshToken: string): Promise<void> {
		if (!accessToken || !refreshToken) {
			return;
		}

		try {
			const decodedAccessToken =
				await this.jwtManagmentService.decodeToken(accessToken);

			if (decodedAccessToken?.jti) {
				await this.jwtManagmentService.removeAuthTokenEntityById(
					decodedAccessToken.jti,
				);
			}
		} catch (err) {
			throw err;
		}
	}

	async updateSession(
		userId: string,
		refreshToken: string,
	): Promise<JwtResponseDto> {
		if (!userId) {
			this.logger.warn(
				`Cannot perform the action for an user with id ${userId}`,
			);
			throw new InvalidPayloadException();
		}

		try {
			const user = await this.usersRepository.findByIdAsync(userId);
			const {
				accessToken,
			} = await this.jwtManagmentService.createAccessTokenFromRefreshToken(
				refreshToken,
			);

			const userDto = this.mapper.map(user, User, GetUserDto);
			return new JwtResponseDto(userDto, accessToken, refreshToken);
		} catch (err) {
			this.logger.error(err);
			throw err;
		}
	}
}
