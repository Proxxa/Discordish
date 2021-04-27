const Base = require('../Base')
const ChannelManager = require('../managers/ChannelManager')
class Guild extends Base {
    /**
     * 
     * @param {Object} guild "The data for the guild." 
     */
    constructor(client, guild) {
        super(client)

        if (!('unavailable' in guild)) throw new RangeError("Invalid guild object.")

        /**
         * The availability of the guild.
         * @readonly
         */
        this.available = !guild.unavailable
        if (this.available) {
            this.some = "AAAAAAAAAAA"
            /**
             * The guild's system channel. Used for built-in join
             * and boost messages.
             */
            this.systemChannel = guild.system_channel_id

            /**
             * If the guild is marked as NSFW
             */
            this.nsfw = guild.nsfw

            /**
             * Lazy guilds have this set to true
             */
            this.lazy = guild.lazy

            /**
             * If the guild is identified as "large"
             */
            this.large = guild.large

            /**
             * A set of cached channels.
             */
            this.channels = new ChannelManager(this.client, guild.channels)

            /**
             * The preferred voice channel location of this guild
             */
            this.locale = guild.preferred_locale

            /**
             * This guild's splash image
             */
            this.splash = guild.splash

            /**
             * The name of the guild
             */
            this.name = guild.name
            /**
             * The owner's id.
             * @readonly
             * @private
             */
            Object.defineProperty(this, '_owner', {value: guild.owner_id})
            this._owner = guild.owner_id
            
            /**
             * The timestamp at which the user joined the guild.
             * @readonly
             */
            this.joinedTimestamp = guild.joined_at
            
            /**
             * The guild's channels.
             * @readonly
             */
            this.channels = new ChannelManager()
            
        }
        /**
         * The guild id.
         * @readonly
         */
        this.id = guild.id
    }

    /**
     * The guild's owner.
     * @returns {Promise<GuildMember>} Promises the GuildMember object of the guild owner.
     * @readonly
     */
    get owner() {
        return this.client.users.fetch(this._owner)
    }

}

module.exports = Guild
