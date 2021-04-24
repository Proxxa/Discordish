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
}

module.exports = GuildChannel
