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
        Object.defineProperty(this, 'client', {value: client, enumerable: false})

        /**
         * The content of the message.
         * @type {String}
         * @readonly
         */
        Object.defineProperty(this, 'content', {value: data.content, enumerable: true})

        /**
         * The message's ID
         * @type {String}
         * @readonly
         */
        Object.defineProperty(this, 'id', {value: data.id, enumerable: true})

        /**
         * The guild this message originates from.
         * @type {Guild}
         * @readonly
         */
        this.client.guilds.fetch(data.guild_id).then(g => {
            Object.defineProperty(this, 'guild', {value: g, enumerable: true })
            g.channels.fetch(data.channel_id).then(cha => Object.defineProperty(this, 'channel', { value: cha, enumerable: true}))
        })

        /**
         * The channel this message originates from.
         * @name channel
         * @type {Channel}
         * @readonly
         */

        /**
         * Whether or not the message is a TTS message
         * @type {Boolean}
         * @readonly
         */
        Object.defineProperty(this, 'tts', {value: data.tts, enumerable: true})

        /**
         * The date the message was created
         * @type {String}
         * @readonly
         */
        Object.defineProperty(this, 'createdTimestamp', { value: data.timestamp, enumerable: true})

        /**
         * The raw data of the message replied to
         * @readonly
         */
        Object.defineProperty(this, 'repliedMessage', { value: data.referenced_message ? Object.freeze(new Message(this.client, data.referenced_message)) : null, enumerable: true })

        /**
         * The author of the message
         * @readonly
         * @type {User}
         */
        Object.defineProperty(this, '_author', { value: this.client.users.fetch(data.author.id)})

        /**
         * An array of raw mention data
         * @property _mentions
         * @type {Array<GuildMember>}
         * @private
         * @readonly
         */
        Object.defineProperty(this, '_mentions', {value: data.mentions})
    }

    /**
     * An array of Guild Member mentions
     * @readonly
     */
    get mentions() {
        let mentioned = []
        for (const user of this._mentions) mentioned.push(new GuildMember(this.client, this.client.users.fetch(user.id), this.guild))
        return mentioned
    }

    /**
     * The author of the message
     * @readonly
     * @type {User}
     */
    get author() {
        return this._author.then(user => {
            return user
        })
    }
}

module.exports = Message
