import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { Dialect } from "sequelize/types";

@Module({
	imports: [
		SequelizeModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				username: config.get<string>("DB_USER"),
				password: config.get<string>("DB_PASS"),
				database: config.get<string>("DB_NAME"),
				host: config.get<string>("DB_HOST", "localhost"),
				port: parseInt(config.get("DB_PORT"), 10),

				dialect: config.get<Dialect>("DB_DIALECT", "postgres"),
				dialectOptions: {
					application_name: `RR ${config.get<string>("NODE_ENV")}`,
				},

				autoLoadModels: true,
				synchronize: false,

				pool: {
					max: 5,
					min: 1,
					idle: 10000
				},
				retryDelay: 5000,
			})
		}),
	],
	exports: [SequelizeModule],
	providers: [],
})
export class DatabaseModule { }