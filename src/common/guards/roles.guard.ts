import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GetUserDto } from "src/modules/repositories";
import { ROLES_KEY } from "../decorators";
import { UserRole } from "../enums";

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector
	) { }

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
			ROLES_KEY,
			[
				context.getHandler(),
				context.getClass(),
			]
		);
		if (!requiredRoles) {
			return true;
		}

		const ctx = context.switchToHttp();
		const request = ctx.getRequest();
		const user = request.user as GetUserDto;

		const userHasRole = () => {
			return requiredRoles.find(item => item === user.role) !== undefined;
		};

		return user && user.role && userHasRole();
	}
}