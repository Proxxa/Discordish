const EventEmitter = require("events")
const GatewayManager = require('../websockets/GatewayManager.js')
const GuildManager = require('../guild/GuildManager.js')
const User = require("../user/User.js")
const UserManager = require('../user/UserManager.js')

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
            this.guildManager = new GuildManager(this, readyData.d.guilds)
            this.users = new UserManager(this)
            this.users.update(readyData.d.user)
            this.emit("ready")
        })

        this.gateway.on("GUILD_CREATE", (data) => {
            this.guildManager.updateCache(data.d)
        })
    }
}



defaultClientOptions = {
    gateway: {
        version: 8,
        encoding: 'json'
    },
    intents: (1 << 0) + (1 << 6) +(1 << 9) + (1 << 12)
}

module.exports = Client

