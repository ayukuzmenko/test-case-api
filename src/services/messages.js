const { isEmpty, omit, isUndefined, find: findEntry } = require("lodash");
const { resolve } = require("path");
const config = require("../config");
// eslint-disable-next-line import/no-dynamic-require
const messages = require(resolve(
    __dirname,
    "..",
    "..",
    config.connection,
    "messages"
));

async function find(query) {
    return findEntry(messages, query);
}

async function list(query, sorting, pagination) {
    let filteringMessages = messages.map(message => omit(message, ["imageUrl"]));

    if (!isEmpty(query)) {
        filteringMessages = filteringMessages.filter(message => {
            let include = false;
            if (
                (!isUndefined(query.isRead) &&
                    message.isRead === query.isRead) ||
                (!isUndefined(query.isNew) && message.isNew === query.isNew) ||
                (query.search && message.content.includes(query.search)) ||
                (query.reaction && query.reaction === message.reaction) ||
                (query.platformCode &&
                    query.platformCode === message.platform.code) ||
                (query.dateFrom &&
                    new Date(query.dateFrom) <= new Date(message.date)) ||
                (query.dateTo &&
                    new Date(query.dateTo) >= new Date(message.date))
            ) {
                include = true;
            }

            return include;
        });
    }

    if (sorting.sortingField) {
        const { sortingField, sortingDirection } = sorting;

        if (sortingField === "title" || sortingField === "content") {
            filteringMessages.sort((a, b) =>
                a[sortingField].localeCompare(b[sortingField], "ru")
            );
        }

        if (sortingField === "date") {
            filteringMessages.sort(
                (a, b) => new Date(b.date) - new Date(a.date)
            );
        }

        if (sortingDirection === "desc") {
            filteringMessages.reverse();
        }
    }

    const { pageSize = 10, pageNumber = 1 } = pagination;

    const count = filteringMessages.length;

    const start = pageSize * pageNumber - pageSize;
    const end = start + pageSize;

    const data = filteringMessages.slice(start, end);

    return {
        meta: {
            pageSize,
            pageNumber,
            count,
        },
        data,
    };
}

async function update(query, values) {
    const entry = await find(query);
    if (entry) {
        Object.assign(entry, values);
    }
}

module.exports = {
    find,
    list,
    update,
};
