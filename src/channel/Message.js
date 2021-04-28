const GuildMember = require('../user/GuildMember.js')
const User = require('../user/User.js')
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
        Object.defineProperty(this, 'client', {value: client})

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
        Object.defineProperty(this, 'guild', {value: this.client.guilds.fetch(data.guild_id, true, true), enumerable: true })
        this._guild = data.guild_id

        /**
         * The channel this message originates from.
         * @type {Channel}
         * @readonly
         */
        Object.defineProperty(this, 'channel', { value: this.guild.channels.fetch(data.channel_id, true, true), enumerable: true })

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
        Object.defineProperty(this, 'repliedMessage', { value: Object.freeze(new Message(this.client, data.referenced_message)), enumerable: true })

        /**
         * The author of the message
         * @readonly
         * @type {User}
         * @private
         */
        Object.defineProperty(this, 'author', { value: User.resolve(this.client.users.fetch(data.author.id, true, true)), enumerable: true})

        /**
         * An array of raw mention data
         * @type {Array<GuildMember>}
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
}

module.exports = Message
