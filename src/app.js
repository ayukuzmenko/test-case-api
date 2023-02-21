const Koa = require("koa");
const Router = require("koa-router");
const jwtMiddleware = require("koa-jwt");
const yamljs = require("yamljs");
const { koaSwagger } = require("koa2-swagger-ui");
const config = require("./config");
const usersModule = require("./modules/users");
const messagesModule = require("./modules/messages");
const authModule = require("./modules/auth");

function createApp() {
    const app = new Koa();
    const router = new Router();
    router.get("/", ctx => {
        ctx.body = "ok";
    });

    const spec = yamljs.load("./openapi.yaml");
    router.get(
        "/docs",
        koaSwagger({ routePrefix: false, swaggerOptions: { spec } })
    );

    router.use("/auth", authModule.routes());
    router.use(
        jwtMiddleware({
            secret: config.secret,
        })
    );
    router.use("/messages", messagesModule.routes());
    router.use("/users", usersModule.routes());

    app.use(router.allowedMethods());
    app.use(router.routes());

    return app;
}

if (!module.parent) {
    createApp().listen(config.port);
}

module.exports = createApp;
