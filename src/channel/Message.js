const GuildMember = require('../user/GuildMember.js')
const Base = require('../Base')
class Message extends Base {
    /**
     * A message found within a {@link TextChannel} or {@link DMChannel}
     * @param {Client} client The Client this message was instantiated from
     * @param {MessageData} data The data for the message
     * @extends Base
     */
    constructor(client, data) {
        super(client)

        /**
         * The content of the message.
         * @member {String} content
         * @memberof Message
         * @instance
         * @readonly
         */
        Object.defineProperty(this, 'content', {value: data.content, enumerable: true})

        /**
         * The message's ID
         * @member {String} id
         * @readonly
         * @memberof Message
         * @instance
         */
        Object.defineProperty(this, 'id', {value: data.id, enumerable: true})

        /**
         * The guild this message originates from.
         * @member {Guild} guild
         * @memberof Message
         * @instance
         * @readonly
         */
        this.client.guilds.fetch(data.guild_id).then(g => {
            Object.defineProperty(this, 'guild', {value: g, enumerable: true })
            g.channels.fetch(data.channel_id).then(cha => Object.defineProperty(this, 'channel', { value: cha, enumerable: true}))
        })

        
        /**
         * The channel this message originates from.
         * @member {Channel} channel
         * @memberof Message
         * @instance
         * @readonly
         */

        /**
         * Whether or not the message is a TTS message
         * @member {Boolean} tts
         * @memberof Message
         * @instance
         * @readonly
         */
        Object.defineProperty(this, 'tts', {value: data.tts, enumerable: true})

        /**
         * The date the message was created
         * @member {String} createdTimestamp
         * @memberof Message
         * @instance
         * @readonly
         */
        Object.defineProperty(this, 'createdTimestamp', { value: data.timestamp, enumerable: true})

        /**
         * The raw data of the message replied to
         * @member {Message} repliedMessage
         * @memberof Message
         * @instance
         * @readonly
         */
        Object.defineProperty(this, 'repliedMessage', { value: data.referenced_message ? Object.freeze(new Message(this.client, data.referenced_message)) : null, enumerable: true })

        Object.defineProperty(this, '_author', { value: this.client.users.fetch(data.author.id)})

        /**
         * An array of raw mention data
         * @member {Array<Number>} _mentions
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

/**
 * An object which encompasses the data which describes a message
 * @typedef {Object} MessageData
 * @property {String} content The raw content of the message
 * @property {String} id The ID of the message
 * @property {String} guild_id The ID of the guild this message is from
 * @property {Boolean} tts Whether or not this message has text-to-speech enabled
 * @property {Number} timestamp The unix timestamp of when this message was created
 * @property {MessageData?} referenced_message The message data of the message this message is in response to
 * @property {Object} author Basic data about the user who created this message
 * @property {String} author.id The ID of the user who created this message
 * @property {Array<String>} mentions An array of IDs of users this message mentions
 */
