const Router = require("koa-router");
const { decode } = require("jsonwebtoken");
const bodyParser = require("koa-bodyparser");
const { omitBy, isNil } = require("lodash");
const { find, update } = require("../services/user");

const router = new Router();

router.patch("/:id", bodyParser(), async ctx => {
    const { id: userId } = ctx.params;
    const { id } = ctx.state.user;

    if (Number(userId) !== id) {
        const error = new Error();
        error.status = 400;
        throw error;
    }

    const { firstName, lastName, email, password, avatarUrl } =
        ctx.request.body;

    const values = { firstName, lastName, email, password, avatarUrl };

    await update({ id }, omitBy(values, isNil));

    const data = await find({ id });
    ctx.body = data;
});

router.get("/current", async ctx => {
    const token = ctx.headers.authorization.split(" ")[1];

    const { id } = decode(token);

    const user = await find({
        id,
    });
    if (user) {
        ctx.body = user;
    }
});

module.exports = router;
