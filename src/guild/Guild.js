const { GuildMember } = require("../user/GuildMember");

class Guild {
    /**
     * 
     * @param {Object} guild "The data for the guild." 
     */
    constructor(client, guild) {
        super()
        /**
         * The availability of the guild.
         * @readonly
         */
        this.available = !guild.unavailable
        if (this.available) {
            /**
             * The guild's system channel. Used for built-in join
             * and boost messages.
             * @readonly
             */
            Object.defineProperty(this, 'systemChannel', { value: guild.system_channel_id })

            /**
             * If the guild is marked as NSFW
             * @readonly
             */
            this.nsfw = guild.nsfw

            /**
             * Lazy guilds have this set to true
             * @readonly
             */
            Object.defineProperties(this, 'lazy', { value: guild.lazy })

            /**
             * If the guild is identified as "large"
             * @readonly
             */
            this.large = guild.large

            // /**
            //  * A set of cached channels.
            //  */
            // for (const channel of guild.channels) {
            // create channel class
            // }

            /**
             * The preferred voice channel location of this guild
             * @readonly
             */
            this.locale = guild.preferred_locale

            /**
             * This guild's splash image
             * @readonly
             */
            this.splash = guild.splash

            /**
             * The name of the guild
             * @readonly
             */
            this.name = guild.name
            /**
             * The owner's id.
             * @readonly
             * @private
             */
            this._owner = guild.owner_id
            
            /**
             * The timestamp at which the user joined the guild.
             * @readonly
             */
            Object.defineProperty(this, 'joinedTimestamp', { value: guild.joined_at })
            
        }
        /**
         * The guild id.
         * @readonly
         */
        Object.defineProperty(this, '_id', { value: guild.id })
        /**
         * The client this guild comes from.
         * @readonly
         */
        Object.defineProperty(this, 'client', { value: client })
    }


    /**
     * The guild's owner.
     * @returns {Promise<GuildMember>} Promises the GuildMember object of the guild owner.
     * @readonly
     */
    get owner() {
        return this.client.users.fetch(new GuildMember(this._owner))
    }

    /**
     * The guild's ID
     * @readonly
     */
    get id() {
        return this._id
    }
}

module.exports = Guild