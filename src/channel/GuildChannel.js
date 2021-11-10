const Channel = require("./Channel")

class GuildChannel extends Channel {

    /**
     * A channel found in a guild<br>
     * Contains many "readonly" values that can be changed.<p style="text-decoration: underline;">Do not change their values.</p>
     * @param {Client} client The client that instantiated this channel.
     * @param {GuildChannelData} data The data for this channel
     * @extends Channel
     */
    constructor(client, data) {
        super(client, data)

        /**
         * The permission overwrites of this channel.
         * @member {Object} permissionOverwrites
         * @memberof GuildChannel
         * @insta
         * @readonly
         */
        Object.defineProperty(this, 'permissionOverwrites', {value: data.permission_overwrites})

        /**
         * The channel name.<br>
         * Setting this value invokes {@link GuildChannel#setName}
         * @readonly
         */
        this.name = data.name

        /**
         * The channel's position<br>
         * Setting this value invokes {@link GuildChannel#setPosition}
         */
        this.position = data.position

        /**
         * The id of the guild this channel is from.
         * @readonly
         * @member {Guild} guild
         * @memberof GuildChannel
         * @instance
         */
        this.client.guilds.fetch(this._guild).then(g => Object.defineProperty(this, 'guild', {value:g}))

        /**
         * The id of the channel's parent category.
         * @readonly
         */
        this.parent = data.parent_id
    }

    set position(pos) {
        this.setPosition(pos)
    }

    set name(name) {
        this.setName(name)
    }

    /**
     * Change the location of the channel on the channel list
     * @param {Number|String} pos The new position of the channel
     */
    setPosition(pos) {
        this.edit({
            position: Number(pos)
        })
    }

    /**
     * Change the channel category the channel is in. Null if no category.
     * @param {String|Number|null} [snowflake=null] The ID of the new parent category.
     */
    setParent(snowflake = null) {
        this.edit({
            parent_id: String(snowflake)
        })
    }

    /**
     * Change the name of the channel
     * @param {String} name The new position of the channel
     */
    setName(name) {
        this.edit({
            name: name
        })
    }
}

module.exports = GuildChannel

/**
 * Data that describes a channel in a guild.
 * @typedef {ChannelData} GuildChannelData
 * @property {Object} permission_overwrites The permission overwrites for this channel
 * @property {String} name The name of the channel
 * @property {Number} position The position of the channel in its parent category
 * @property {Number} parent_id The ID of the parent category this channel is found in.
 * @property {Number} guild_id The ID of the guild this channel is found in
 */
