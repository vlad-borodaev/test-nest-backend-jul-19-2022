import { INestApplication } from "@nestjs/common";

export const setupCors = (app: INestApplication): void => {
	const options = {
		"origin": "*", // @FIXME: later need to change it
		"methods": "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
		"preflightContinue": false,
		"optionsSuccessStatus": 204,
		"credentials": true
	};
	app.enableCors(options);
};