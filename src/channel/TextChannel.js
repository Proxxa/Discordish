const GuildChannel = require("./GuildChannel");

class TextChannel extends GuildChannel {

    /**
     * 
     * @param {Client} client The client that instantiated this channel.
     * @param {Object} data The data for this channel
     */
    constructor(client, data) {
        super(client, data)

        /**
         * The topic of the channel.
         * @readonly
         */
        this.topic = data.topic

        /**
         * Whether or not the channel is NSFW
         * @readonly
         */
        this.nsfw = data.nsfw

        /**
         * When the last message was pinned.
         * @readonly
         */
        this.lastPinned = data.last_pinned_timestamp

        /**
         * The time to wait between sending messages.
         * @readonly
         */
        this.rateLimit = (data.rate_limit_per_user ? data.rate_limit_per_user : 0)
    }
}

module.exports = TextChannel