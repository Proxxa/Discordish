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
     * @emits Client#ready OKAY
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
            /**
             * @member {GuildManager} guilds The {@link Manager manager} which holds all cached guilds for the client
             * @memberof Client
             * @instance
             */
            this.guilds = new GuildManager(this, readyData.d.guilds)
            /**
             * @member {UserManager} users The {@link Manager manager} which holds all cached users for the client
             * @memberof Client
             * @instance
             */
            this.users = new UserManager(this)
            /**
             * @member {ChannelManager} channels The {@link Manager manager} which holds all cached channels for the client<br>Using {@link Client#guilds} is much preferred.
             * @memberof Client
             * @instance
             */
            this.channels = new ChannelManager(this)
            this.users.updateCache(readyData.d.user)

            
            /**
             * Emitted when the client is logged in
             * @event Client#ready
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
             * Emitted when a message is received
             * @event Client#message
             * @type {Message}
             */
            setTimeout(() => this.emit("message", message), 1)
            // Wait to allow for setting of guild and channel.
        })
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

