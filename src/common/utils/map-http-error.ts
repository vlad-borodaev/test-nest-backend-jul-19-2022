import {
	BadRequestException,
	ConflictException,
	InternalServerErrorException,
	NotFoundException as NotFoundHttpException,
	UnauthorizedException,
	UnprocessableEntityException,
} from "@nestjs/common";
import {
	DeleteFileException,
	EnitityAlreadyExistsException,
	FileUploadException,
	InternalServerException,
	InvalidPasswordException,
	InvalidPayloadException,
	NotFoundException,
	SessionExpiredException,
	UnprocessibleException,
	UnsupportedFileTypeException,
	UserAlreadyExistsException,
	UserUnauthorizedException,
} from "../exceptions";

export const mapHttpError = (error: any) => {
	switch (error.constructor) {
		case EnitityAlreadyExistsException: {
			return new ConflictException(error.message);
		}
		case InternalServerException: {
			return new InternalServerErrorException(error.message);
		}
		case InvalidPayloadException: {
			return new BadRequestException(error.message);
		}
		case NotFoundException: {
			return new NotFoundHttpException(error.message);
		}
		case UserAlreadyExistsException: {
			return new ConflictException(error.message);
		}
		case UnsupportedFileTypeException: {
			return new BadRequestException(error.message);
		}
		case FileUploadException: {
			return new BadRequestException(error.message);
		}
		case DeleteFileException: {
			return new ConflictException(error.message);
		}
		case UnprocessibleException: {
			return new UnprocessableEntityException(error.message);
		}
		case InvalidPasswordException: {
			return new UnprocessableEntityException(error.message);
		}
		case SessionExpiredException: {
			return new UnauthorizedException(error.message);
		}
		case UserUnauthorizedException: {
			return new UnauthorizedException(error.message);
		}
		default: {
			return new InternalServerErrorException(error.message);
		}
	}
};