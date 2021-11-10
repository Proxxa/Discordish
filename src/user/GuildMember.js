const User = require("./User")

class GuildMember extends User {
    /**
     * A {@link User} under the context of a guild
     * @extends User
     * @param {UserData} user The user object of this member. 
     * @param {Guild} guild The guild this user is a member of.
     */
    constructor(client, user, guild) {
        super(client, user)

        /**
         * The underlying user object of this guild member.
         * @member {User} user
         * @memberof GuildMember
         * @instance
         * @readonly
         */
        Object.defineProperty(this, 'user', { value: User.resolve(this.client, user), enumerable: true })

        /**
         * The guild this GuildMember is from.
         * @member {Guild} guild
         * @memberof GuildMember
         * @instance
         * @readonly
         */
        Object.defineProperty(this, 'guild', { value: guild, enumerable: true })
    }

    /**
     * Fetch this guild member from the Discord API
     * @param {Boolean} cache Whether or not to cache the resulting user
     * @param {Boolean} forceApi Whether or not to skip checking the cache and call the Discord API immediately.
     * @returns {Promise<GuildMember>}
     */
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
