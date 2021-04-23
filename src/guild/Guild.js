const EventEmitter = require("events");
const { GuildMember } = require("../user/GuildMember");

class Guild extends EventEmitter {
    /**
     * 
     * @param {Object} guild "The data for the guild." 
     */
    constructor(client, guild) {
        super()
        /**
         * The availability of the guild.
         */
        this.available = !guild.unavailable
        if (this.available) {
            /**
             * The guild's system channel.
             * @readonly
             */
            Object.defineProperty(this, 'systemChannel', { value: guild.system_channel_id })
            // this.systemChannel = guild.system_channel_id
            /**
             * If the guild is marked as NSFW
             */
            this.nsfw = guild.nsfw
            this.lazy = guild.lazy
            /**
             * If the guild is identified as "large"
             */
            this.large = guild.large
            // /**
            //  * A set of cached channels.
            //  */
            // for (const channel of guild.channels) {
            // create channel class
            // }
            this.locale = guild.preferred_locale
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
            this._owner = guild.owner_id
            
        }
        /**
         * The guild id.
         * @readonly
         */
        Object.defineProperty(this, '_id', { value: guild.id })
        /**
         * The timestamp at which the user joined the guild.
         * @readonly
         */
        Object.defineProperty(this, 'joinedTimestamp', { value: guild.joined_at })
        /**
         * The client this guild comes from.
         * @readonly
         */
        Object.defineProperty(this, 'client', { value: client })
    }


    /**
     * @returns {Promise<GuildMember>} "Promises the GuildMember object of the guild owner."
     */
    get owner() {
        return this.client.users.fetch(new GuildMember(this._owner))
    }

    /**
     * 
     */
    get id() {
        return this._id
    }
}

module.exports = Guild