import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./database.module";
import { APP_INTERCEPTOR, APP_GUARD, Reflector } from '@nestjs/core';
import { TransformInterceptor, TimeoutInterceptor } from '../../common/interceptors';
import { JwtAuthGuard } from "src/modules/auth";
import { AutoMappingModule } from "./auto-mapping.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			cache: true,
		}),
		DatabaseModule,
		AutoMappingModule,
	],
	exports: [
		ConfigModule,
		DatabaseModule,
		AutoMappingModule,
	],
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: TransformInterceptor,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: TimeoutInterceptor,
		},
		{
			provide: APP_GUARD,
			useFactory: ref => new JwtAuthGuard(ref),
			inject: [Reflector],
		},
	],
})
export class CoreModule { }