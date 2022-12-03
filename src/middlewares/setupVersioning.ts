import { INestApplication, VersioningType } from "@nestjs/common";

export const setupVersioning = (app: INestApplication): void => {
    app.setGlobalPrefix("api");
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1'
    });
};