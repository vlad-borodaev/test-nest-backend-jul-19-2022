import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from "@nestjs/swagger";

export const setupSwagger = (app: INestApplication): void => {
	const swaggerConfig = new DocumentBuilder()
		.setTitle("Test API")
		.setDescription("Test API docs")
		.setVersion("1.0")
		.addBearerAuth({
			type: 'http',
			scheme: 'bearer',
			bearerFormat: 'JWT',
			name: 'JWT',
			description: 'Enter JWT token',
			in: 'header',
		})
		.build();

	const swaggerOptions: SwaggerDocumentOptions = {
		deepScanRoutes: true,
		operationIdFactory: (
			controllerKey: string,
			methodKey: string
		) => `${controllerKey}#${methodKey}`,
	};

	// downloadable JSON is available under /docs-json
	// downloadable YAML is available under /docs-yaml
	const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig, swaggerOptions);
	SwaggerModule.setup("docs", app, swaggerDocument, {
		explorer: true,
		swaggerOptions: {
			tagsSorter: 'alpha',
			operationsSorter: 'alpha',
		},
	});
};