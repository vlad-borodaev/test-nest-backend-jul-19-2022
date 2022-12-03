import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { GeneralExceptionFilter } from "./common/filters";

import {
	setupSwagger,
	setupModuleHotReload,
	setupVersioning,
	setupCors,
} from "./middlewares";

declare const module: any;

const PORT = 4000;

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		logger: ['error', 'warn'],
	});
	const { httpAdapter } = app.get(HttpAdapterHost);
	app.useGlobalFilters(new GeneralExceptionFilter(httpAdapter));

	app.useGlobalPipes(new ValidationPipe());

	setupCors(app);

	setupVersioning(app);
	setupSwagger(app);

	setupModuleHotReload(module, app);

	await app.listen(PORT);
}
