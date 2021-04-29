const EventEmitter = require("events")
const GatewayManager = require('../websockets/GatewayManager.js')
const GuildManager = require('../managers/GuildManager.js')
const UserManager = require('../managers/UserManager.js')
const Message = require("../channel/Message.js")
const ChannelManager = require("../managers/ChannelManager.js")

class Client extends EventEmitter {
    /**
     * Create a new Discord client.
     * @param {ClientOptions} ClientOptions "The options for the client." 
     */
    constructor(ClientOptions = defaultClientOptions) {
        super()
        this.clientOptions = ClientOptions
        this.gateway = new GatewayManager(this)
    }
    /**
     * Logs in to Discord
     * @param {String} token "The Bot Token"
     */
    async login(token = this.token) {
        this.token = token
        await this.gateway.connect()
        
        this.gateway.on("READY", (readyData) => {
            this.guilds = new GuildManager(this, readyData.d.guilds)
            this.users = new UserManager(this)
            this.channels = new ChannelManager(this)
            this.users.updateCache(readyData.d.user)
            this.emit("ready")
        })

        this.gateway.on("GUILD_CREATE", (data) => {
            this.guilds.updateCache(data.d)
            for (const channel of data.d.channels) this.channels.updateCache(channel)
        })

        this.gateway.on("MESSAGE_CREATE", (data) => {
            let messageData = data.d
            let message = new Message(this, messageData)
            setTimeout(() => this.emit("message", message), 1)
            // Wait to allow for setting of guild and channel.
        })
    }
}



const defaultClientOptions = {
    gateway: {
        version: 8,
        encoding: 'json'
    },
    intents: (1 << 0) + (1 << 6) +(1 << 9) + (1 << 12),
    cacheLifetime: false
}

module.exports = Client

