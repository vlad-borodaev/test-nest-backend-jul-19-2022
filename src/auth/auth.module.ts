import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService, JwtManagmentService } from './services';
import { JwtStrategy, LocalStrategy } from './strategies';
import { RepositoriesModule } from '../repositories';

const jwt = {
	secret: process.env.JWT_SECRET,
	signOptions: {
		expiresIn: process.env.JWT_EXPIRES_IN,
		issuer: process.env.JWT_ISSUER,
	},
};

const jwtFactory = {
	useFactory: async () => {
		return {
			secret: jwt.secret,
			signOptions: jwt.signOptions,
		};
	},
};

@Module({
	controllers: [AuthController],
	imports: [
		RepositoriesModule,
		JwtModule.registerAsync(jwtFactory),
		PassportModule.register({
			defaultStrategy: 'jwt',
			property: 'user',
			session: false,
		}),
	],
	exports: [
		JwtModule,
		PassportModule,
		AuthService,
		JwtManagmentService,
	],
	providers: [
		JwtStrategy,
		LocalStrategy,
		AuthService,
		JwtManagmentService,
	],
})
export class AuthModule { }
