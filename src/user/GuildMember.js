const User = require("./User")

class GuildMember extends User {
    /**
     * A user with extra methods for guilds
     * @extends User
     * @param {User} user "The user object of this member." 
     * @param {Guild} guild "The guild this user is a member of."
     */
    constructor(client, user, guild) {
        super(client, user)

        /**
         * The underlying user object.
         * @private
         * @readonly
         */
        Object.defineProperty(this, '_user', { value: user })


        this.guild = guild
    }

    get user() {
        return new User(this.client, this._user)
    }

    fetch(cache = true, forceApi = false) {
        return new Promise((resolve, reject) => {
            if (this.client.users.has(this.id) && !forceApi)
                if (this.client.users.get(this.id).instantiated >= this.instantiated && !forceApi) resolve(this.client.users.get(this.id))
                else if (this.instantiated > this.client.users.get(this.id) && !forceApi) {
                    this.client.users.updateCache(this)
                    resolve(this)
                } else fetch('https://discord.com/api/guilds/' + this.guild.id + '/users/' + new URLSearchParams(this.id))
                    .then(res => res.json())
                    .then(res => {
                        if (cache) {
                            this.client.users.updateCache(res)
                            resolve(this.cache.get(res.id))
                        } else resolve(this.cache.type.resolve(res))
                    }).catch(reject)
            reject(new Error("Could not fetch?"))
        })
    }

}

module.exports = GuildMember
