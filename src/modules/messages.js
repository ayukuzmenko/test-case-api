const bodyParser = require("koa-bodyparser");
const Router = require("koa-router");
const { isNil, omitBy, isUndefined } = require("lodash");
const { list, find, update } = require("../services/messages");
const { parseBooleans } = require("../utils/parse-booleans");

const router = new Router();

router.get("/", async ctx => {
    const {
        isRead,
        isNew,
        reaction,
        platformCode,
        dateFrom,
        dateTo,
        search,
        sortingField,
        sortingDirection,
        pageSize,
        pageNumber,
    } = ctx.request.query;

    const query = {
        isRead: parseBooleans(isRead),
        isNew: parseBooleans(isNew),
        search: search?.trim(),
        reaction,
        platformCode,
        dateFrom,
        dateTo,
    };

    const sorting = { sortingField, sortingDirection };

    const pagination = { pageSize: Number(pageSize), pageNumber: Number(pageNumber) };

    try {
        const data = await list(omitBy(query, isNil), sorting, pagination);
        ctx.body = data;
    } catch (error) {
        error.status = 400;
        throw error;
    }
});

router.get("/:id", async ctx => {
    const { id } = ctx.params;

    const message = await find({
        id: Number(id),
    });

    if (message) {
        ctx.body = message;
    }
});

router.patch("/:id", bodyParser(), async ctx => {
    const { id } = ctx.params;

    const { isNew } = ctx.request.body;

    if (isUndefined(isNew)) {
        const error = new Error();
        error.status = 400;
        throw error;
    }
    const values = { isNew };

    await update(
        {
            id: Number(id),
        },
        omitBy(values, isNil)
    );

    const data = await find({
        id: Number(id),
    });
    ctx.body = data;
});

module.exports = router;
