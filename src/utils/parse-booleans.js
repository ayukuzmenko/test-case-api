const parseBooleans = value => {
    if (value?.toLowerCase() === "true" || value?.toLowerCase() === "false") {
        return value.toLowerCase() === "true";
    }
    return undefined;
};

module.exports = { parseBooleans };
