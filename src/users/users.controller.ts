import { MapInterceptor } from "@automapper/nestjs";
import {
	Body,
	Catch,
	Controller,
	Delete,
	Get,
	Param,
	Put,
	UseFilters,
	UseGuards,
	UseInterceptors
} from "@nestjs/common";
import {
	ApiTags,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiForbiddenResponse,
	ApiUnauthorizedResponse,
	ApiOkResponse,
	ApiBearerAuth,
} from "@nestjs/swagger";
import { AllowAny, AuthorizedUser, Roles } from "src/common/decorators";
import { UserRole } from "src/common/enums";
import { HttpExceptionFilter } from "src/common/filters";
import { mapHttpError } from "src/common/utils";
import { JwtAuthGuard } from "../auth";
import {
	GetUserDto,
	UpdateUserDto,
	User
} from "../repositories";
import { UsersService } from "./users.service";

@ApiTags('users')
@Catch()
@UseFilters(HttpExceptionFilter)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiInternalServerErrorResponse()
@ApiNotFoundResponse()
@ApiForbiddenResponse()
@ApiUnauthorizedResponse()
@Controller('users')
export class UsersController {
	constructor(
		private usersService: UsersService
	) { }

	// @FIXME: for filters we could use later
	// async getAll(@Query(MapPipe(UsersFilter, UsersFilterDto)) filters: UsersFilterDto)
	@Get()
	@AllowAny()
	@ApiOkResponse({ type: [GetUserDto] })
	@UseInterceptors(MapInterceptor(User, GetUserDto, { isArray: true }))
	async getAll() {
		try {
			const result = await this.usersService.getAll();
			return result;
		} catch (err) {
			const httpError = mapHttpError(err);
			throw httpError;
		}
	}

	@Get("by/:id")
	@AllowAny()
	@ApiOkResponse({ type: GetUserDto })
	@UseInterceptors(MapInterceptor(User, GetUserDto))
	async getById(@Param("id") userId: string) {
		try {
			const result = await this.usersService.getById(userId);
			return result;
		} catch (err) {
			const httpError = mapHttpError(err);
			throw httpError;
		}
	}

	@Put("by/:id")
	@ApiOkResponse({ type: GetUserDto })
	@UseInterceptors(MapInterceptor(User, GetUserDto))
	async update(
		@Body() payload: UpdateUserDto,
		@Param("id") userId: string,
		@AuthorizedUser() user: GetUserDto,
	) {
		try {
			const result = await this.usersService.update(userId, payload);
			return result;
		} catch (err) {
			const httpError = mapHttpError(err);
			throw httpError;
		}
	}

	@Delete("by/:id")
	@Roles(UserRole.Admin)
	@ApiOkResponse({ type: null })
	async delete(@Param("id") userId: string) {
		try {
			const result = await this.usersService.delete(userId);
			return result;
		} catch (err) {
			const httpError = mapHttpError(err);
			throw httpError;
		}
	}
}