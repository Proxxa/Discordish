const TextChannel = require("./TextChannel");


class NewsChannel extends TextChannel {

    constructor(client, data) {
        super(client, data)
    }
}

module.exports = NewsChannel