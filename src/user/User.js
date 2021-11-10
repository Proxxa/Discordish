const Base = require('../Base')
class User extends Base {
    /**
     * The object from which all users are derived from.
     * @extends Base
     * @param {Client} client The client from which this user originates
     * @param {UserData} user The data describing this user
     */
    constructor(client, user = {}) {
        super(client)

        /**
         * The username of the user
         * @type {String}
         */
        this.username = user.username

        /**
         * The ID of the user
         * @member {String} id
         * @memberof User
         * @instance
         * @readonly
         */
        Object.defineProperty(this, 'id', { value: user.id })

        /**
         * The discriminator of the user
         * @type {String}
         */
        this.discriminator = user.discriminator

        /**
         * Whether or not the user is a bot user
         * @member {Boolean} bot
         * @memberof User
         * @instance
         * @readonly
         */
        Object.defineProperty(this, 'bot', { value: user.bot })

        /**
         * Flags set on the user
         * @type {Array<String>}
         */
        this.flags = user.flags
    }
    /**
     * Fetch this user from the Discord API
     * @param {Boolean} cache Whether or not to cache the resulting user
     * @param {Boolean} forceApi Whether or not to skip checking the cache and call the Discord API immediately.
     * @returns {Promise<UnderlyingSourcePullCallback>}
     */
    fetch(cache = true, forceApi = false) {
        return new Promise((resolve, reject) => {
            if (this.client.users.has(this.id) && !forceApi)
                if (this.client.users.get(this.id).instantiated >= this.instantiated && !forceApi) resolve(this.client.users.get(this.id))
                else if (this.instantiated > this.client.users.get(this.id) && !forceApi) {
                    if (cache) this.client.users.updateCache(this)
                    resolve(this)
                } else fetch('https://discord.com/api/users/' + new URLSearchParams(this.id))
                    .then(res => res.json())
                    .then(res => {
                        if (cache) {
                            this.client.users.updateCache(res)
                            resolve(this.client.users.cache.get(res.id))
                        } else resolve(User.resolve(res))
                    }).catch(reject)
            reject(new Error("Could not fetch?"))
        })
    }

}

module.exports = User

/**
 * @typedef {Object} UserData
 * @property {String} username The username of the user
 * @property {String} discriminator The discriminator of the user
 * @property {String} id The id of the user
 * @property {Boolean} bot Whether or not the user is a bot user
 */
