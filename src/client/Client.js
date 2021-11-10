const EventEmitter = require("events")
const GatewayManager = require('../websockets/GatewayManager.js')
const GuildManager = require('../managers/GuildManager.js')
const UserManager = require('../managers/UserManager.js')
const Message = require("../channel/Message.js")
const ChannelManager = require("../managers/ChannelManager.js")
const Guild = require('../guild/Guild')

class Client extends EventEmitter {
    /**
     * Create a new Discord client.
     * @param {ClientOptions} ClientOptions The options for the client. 
     * @extends EventEmitter 
     * @emits ready Emitted when the client is logged in
     * @emits message Emitted when a message is received
     * @emits debug Emitted for general debug messages. Heavily cluttered.
     */
    constructor(ClientOptions = defaultClientOptions) {
        super()

        /**
         * @member {ClientOptions} clientOptions The options the client was instantiated with
         * @memberof Client
         * @instance
         */
        this.clientOptions = ClientOptions

        /**
         * @member {GatewayManager} gateway The inner gateway manager of the client
         * @memberof Client
         * @instance
         */
        this.gateway = new GatewayManager(this)
    }
    /**
     * Logs in to Discord
     * @param {String} token The bot token
     */
    async login(token = this.token) {
        this.token = token
        await this.gateway.connect()
        
        this.gateway.on("READY", (readyData) => {
            this.guilds = new GuildManager(this, readyData.d.guilds)
            this.users = new UserManager(this)
            this.channels = new ChannelManager(this)
            this.users.updateCache(readyData.d.user)

            /**
             * Emitted whenever the client is connected to Discord
             * @event Client#event:ready
             */
            this.emit("ready")
        })

        this.gateway.on("GUILD_CREATE", (data) => {
            this.guilds.updateCache(Guild.resolve(data.d, this))
            for (const channel of data.d.channels) this.channels.updateCache(channel)
        })

        this.gateway.on("MESSAGE_CREATE", (data) => {
            let messageData = data.d
            let message = new Message(this, messageData)
            /**
             * Emitted whenever the client receives a message
             * @event Client#event:message
             * @type {Message}
             */
            setTimeout(() => this.emit("message", message), 1)
            // Wait to allow for setting of guild and channel.
        })

        /**
         * Emitted constantly for nearly any reason.<br>
         * Used for testing purposes.
         * @event Client#event:debug
         * @type {any}
         */
    }
}


/**
 * The options to use when instantiating an object
 * @typedef {Object} ClientOptions
 * @property {GatewayOptions} gateway The options for a gateway
 * @property {Number} intents An integer representing the bitfield for gateway intents
 * @property {Number|Boolean} cacheLifetime The number of milliseconds to cache an object for in a manager. "False" if forever.
 * */

/**
 * The options for the gateway between the client and Discord
 * @typedef {Object} GatewayOptions
 * @property {Number} version The version number of the gateway to use
 * @property {String} encoding The encoding type to use with discord
 */


const defaultClientOptions = {
    gateway: {
        version: 8,
        encoding: 'json'
    },
    intents: (1 << 0) + (1 << 6) +(1 << 9) + (1 << 12),
    cacheLifetime: false
}

module.exports = Client

