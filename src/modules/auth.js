const Router = require("koa-router");
const jwtMiddleware = require("koa-jwt");
const bodyParser = require("koa-bodyparser");
const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");
const userService = require("../services/user");
const refreshTokenService = require("../services/refresh-token");
const config = require("../config");

const router = new Router();

async function createToken(userId) {
    const newRefreshToken = uuid();
    await refreshTokenService.add({
        accessToken: newRefreshToken,
        userId,
    });

    return {
        accessToken: jwt.sign({ id: userId }, config.secret, {
            expiresIn: 900,
        }),
        refreshToken: newRefreshToken,
    };
}

router.post("/sign-in", bodyParser(), async ctx => {
    const { email, password } = ctx.request.body;
    const user = await userService.find({ email });

    if (!user || !(user.password === password)) {
        const error = new Error();
        error.status = 403;
        throw error;
    }

    ctx.body = await createToken(user.id);
});

router.post("/refresh", bodyParser(), async ctx => {
    const { refreshToken } = ctx.request.body;

    const dbToken = await refreshTokenService.find({
        accessToken: refreshToken,
    });
    if (!dbToken) {
        return;
    }
    await refreshTokenService.remove({
        accessToken: refreshToken,
    });
    ctx.body = await createToken(dbToken.userId);
});

router.post(
    "/sign-out",
    jwtMiddleware({ secret: config.secret }),
    async ctx => {
        const { id: userId } = ctx.state.user;
        await refreshTokenService.remove({
            userId,
        });
        ctx.body = { success: true };
    }
);

module.exports = router;
