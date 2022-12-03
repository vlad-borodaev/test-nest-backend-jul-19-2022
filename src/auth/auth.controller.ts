import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UseGuards,
	Catch,
	UseFilters,
} from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiBody,
	ApiForbiddenResponse,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AllowAny, AuthorizedUser } from 'src/common/decorators';
import { HttpExceptionFilter } from 'src/common/filters';
import { mapHttpError } from 'src/common/utils';
import {
	GetUserDto,
	JwtResponseDto,
	LoginPayloadDto,
	LogoutRequestDto,
	RefreshTokenRequestDto,
	RegisterPayloadDto
} from 'src/modules/repositories';
import { LocalAuthGuard, JwtAuthGuard } from './guards';
import { AuthService } from './services';

@ApiTags('auth')
@Catch()
@UseFilters(HttpExceptionFilter)
@ApiInternalServerErrorResponse()
@ApiNotFoundResponse()
@ApiForbiddenResponse()
@ApiUnauthorizedResponse()
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) { }

	@ApiOkResponse({ type: JwtResponseDto })
	@ApiBody({ type: LoginPayloadDto })
	@HttpCode(HttpStatus.OK)
	@AllowAny()
	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@AuthorizedUser() userDto: GetUserDto): Promise<JwtResponseDto> {
		try {
			const result = await this.authService.login(userDto);
			return result;
		} catch (err) {
			const httpError = mapHttpError(err);
			throw httpError;
		}
	}

	@ApiOkResponse({ type: JwtResponseDto })
	@ApiBody({ type: RegisterPayloadDto })
	@HttpCode(HttpStatus.OK)
	@AllowAny()
	@Post('register')
	async register(
		@Body() payload: RegisterPayloadDto
	): Promise<JwtResponseDto> {
		try {
			const result = await this.authService.register(payload);
			return result;
		} catch (err) {
			const httpError = mapHttpError(err);
			throw httpError;
		}
	}

	@ApiOkResponse()
	@ApiBody({ type: LogoutRequestDto })
	@HttpCode(HttpStatus.OK)
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@Post('logout')
	async logout(@Body() payload: LogoutRequestDto): Promise<void> {
		try {
			await this.authService.logout(
				payload.access_token,
				payload.refresh_token,
			);
		} catch (err) {
			const httpError = mapHttpError(err);
			throw httpError;
		}
	}

	@ApiOkResponse({ type: JwtResponseDto })
	@HttpCode(HttpStatus.OK)
	@AllowAny()
	@Post('refresh-auth-token')
	async updateAccessToken(
		@Body() payload: RefreshTokenRequestDto,
	): Promise<JwtResponseDto> {
		try {
			const result = await this.authService.updateSession(
				payload.user_id,
				payload.refresh_token,
			);
			return result;
		} catch (err) {
			const httpError = mapHttpError(err);
			throw httpError;
		}
	}
}
