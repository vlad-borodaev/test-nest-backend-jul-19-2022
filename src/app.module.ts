import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from './users/users.module';
import { SharedModule } from "./shared/shared.module";
import { HealthModule } from "./health/health.module";
import { UsersController } from "./users/users.controller";
import { CoreModule } from "./core";

@Module({
	imports: [
		CoreModule,
		UsersModule,
		HealthModule,
		SharedModule,
	],
	controllers: [AppController, UsersController],
	providers: [AppService]
})
export class AppModule { }
