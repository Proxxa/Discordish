const GuildChannel = require("./GuildChannel")

class TextChannel extends GuildChannel {

    /**
     * A text channel found within a guild.
     * @param {Client} client The client that instantiated this channel.
     * @param {Object} data The data for this channel
     * @extends GuildChannel
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
        this.rateLimit = data.rate_limit_per_user ? data.rate_limit_per_user : 0
    }

    /**
     * Sends a message to the channel. Triggers {@link Client#event:message} if successful and this gateway intent is provided.
     * @param {String|Object|Message} content The message to send. Objects resolve to {@link Message}s.
     */
    send(content) {
        this.client.emit("debug", `Sending to ${this.id} with ${content}`)
    }
}

module.exports = TextChannel

/**
 * Data that describes a text channel in a guild
 * @typedef {GuildChannelData} TextChannelData
 * @property {String} topic The topic of the channel
 * @property {Boolean} nsfw Whether or not the channel is NSFW
 * @property {Number} last_pinned_timestamp The timestamp at which the last message was pinned
 * @property {Number?} rate_limit_per_user The time users must wait before sending another message. Null if none.
 */
