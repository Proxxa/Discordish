const Channel = require("./Channel")

class GuildChannel extends Channel {

    /**
     * 
     * @param {Client} client The client that instantiated this channel.
     * @param {Object} data The data for this channel
     */
    constructor(client, data) {
        super(client, data)

        /**
         * The permission overwrites of this channel.
         * @readonly
         */
        this.permissionOverwrites = data.permission_overwrites

        /**
         * The channel name.
         * @readonly
         */
        this.name = data.name

        /**
         * The channel's position
         * @readonly
         */
        this.position = data.position

        /**
         * The id of the guild this channel is from.
         * @readonly
         * @private
         */
        this._guild = data.guild_id

        /**
         * The id of the parent category.
         * @readonly
         */
        this.parent = data.parent_id
    }

    /**
     * The guild this channel is from
     * @type {Promise<Guild>}
     */
    get guild() {
        return this.client.guilds.fetch(this._guild)
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
