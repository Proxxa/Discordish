const GuildMember = require('../user/GuildMember.js')
class Message {
    /**
     * 
     * @param {Client} client The Client this message was instantiated from
     * @param {Object} data The data for the message
     */
    constructor(client, data) {
        /**
         * The client this message was instantiated from
         * @type {Client}
         * @readonly
         */
        this.client = client

        /**
         * The content of the message.
         * @type {String}
         * @readonly
         */
        this.content = data.content

        /**
         * The message's ID
         * @type {String}
         * @readonly
         */
        this.id = data.id

        /**
         * The id of the message's guild.
         * @type {String}
         * @readonly
         * @private
         */
        this._guild = data.guild_id

        /**
         * The id of the message's channel.
         * @type {Object}
         * @readonly
         */
        this._channel = data.channel_id

        /**
         * Whether or not the message is a TTS message
         * @type {Boolean}
         * @readonly
         */
        this.tts = data.tts

        /**
         * The date the message was created
         * @type {String}
         * @readonly
         */
        this.createdTimestamp = data.timestamp

        /**
         * The raw data of the message replied to
         * @readonly
         */
        this._repliedMessage = data.referenced_message

        /**
         * The id of the author of the message
         * @readonly
         * @type {String}
         * @private
         */
        this._author = data.author.id

        /**
         * An array of raw mention data
         * @type {Array<GuildMember>}
         * @readonly
         * @private
         */
        this._mentions = data.mentions
    }

    /**
     * The message this message has replied to.
     * @readonly
     */
    get repliedMessage() {
        return new Message(this.client, this._repliedMessage)
    }

    /**
     * The message this channel was sent in.
     * @readonly
     */
    get channel() {
        return this.guild.channels.get(this._channel)
    }

    /**
     * An array of Guild Member mentions
     * @readonly
     */
    get mentions() {
        let mentioned = []
        for (const user of this._mentions) 
            mentioned.push(new GuildMember(this.client.users.fetch(user.id), this.guild))
        
        return mentioned
    }

    /**
     * The guild this message originates from.
     * @type {Promise<Guild>}
     * @readonly
     */
    get guild() {
        return this.client.guilds.fetch(this._guild)
    }
}

module.exports = Message
