import { INestApplication } from "@nestjs/common";

export const setupModuleHotReload = (module: any, app: INestApplication): void => {
    if (module?.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}