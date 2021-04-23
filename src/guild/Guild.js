const EventEmitter = require("events");

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
            /**
             * A set of cached channels.
             */
            for (const channel of guild.channels) {
                // create channel class
            }
            this.locale = guild.preferred_locale
            this.splash = guild.splash
            /**
             * The name of the guild
             */
            this.name = guild.name
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
    }

    get id() {
        return this._id
    }

    defineReality() {
        console.log("what")
    }
}

module.exports = Guild