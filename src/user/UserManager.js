const User = require('./User')
const fetch = require('node-fetch')

class UserManager {
    /**
     * 
     * @param {Client} client
     * @param {Array<Object>} users 
     */
    constructor(client, users = []) {
        Object.defineProperty(this, 'client', { value: client })
        this.cache = new Map()
        for (const user of users) {
            if (user instanceof User) this.cache.set(user.id, user)
            else this.cache.set(user.id, new User(user))
            console.log(`\nMade a user. ${user.id}\n`)
        }
    }

    /**
     * Searches for a user.
     * @param {any} userIdentifiable "The ID of a user."
     * @param {Boolean} forceApi "Whether or not to skip the cache"
     * @returns {Promise<User>} "The User instance."
     */
     async fetch(userIdentifiable, forceApi = false) {
        return new Promise((resolve, reject) => {
            if (typeof userIdentifiable === 'number') userIdentifiable = userIdentifiable.toString()
            if (this.cache.has(userIdentifiable) && !forceApi) resolve(this.cache.get(userIdentifiable))
            else {
                for (const user of this.cache) {
                    if (user[1].name === userIdentifiable && !forceApi) resolve(user)
                }
                fetch('https://discord.com/api/users/' + new URLSearchParams(userIdentifiable))
                    .then(res => res.json())
                    .then(res => {
                        this.cache.set(res.id, new User(res))
                        resolve(this.cache.get(res.id))
                    }).catch(reject)
            }
        }
    )}

    /**
     * Ensures that the input guild is up-to-date and exists.
     * If the guild is fetched and not cached, emits "guildCreate" from this.client
     * @param {UserResolvable} guild "A User, user ID, or object that may be turned into a User"
     * @returns {Promise<User>} "The User instance."
     * @private "Should only be called internally."
     */
     async updateCache(user) {
        return new Promise(async (resolve, reject) => {
            try {
                if (typeof user === "string" || typeof user === "number") user = await this.fetch(user)
                if (user instanceof User) this.cache.set(user.id, user)
                else this.cache.set(user.id, new User(this.client, user))
                resolve(this.cache.get(user.id))
            } catch (error) {
                reject(error)
            }
        })
    }
}

module.exports = UserManager