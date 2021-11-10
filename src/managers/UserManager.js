const User = require('../user/User')
const fetch = require('node-fetch')
const Manager = require('./Manager')

class UserManager extends Manager {
    /**
     * A Manager for managing users cached in the client
     * @param {Client} client The client this manager is attached to
     * @param {Array<UserResolvable>} [users=[]] An array of user resolvables
     */
    constructor(client, users = []) {
        super(client, User, users)
    }

    /**
     * Searches for a user.
     * @param {any} userIdentifiable The ID of a user, or tag of a cached user.
     * @param {Boolean} forceApi Whether or not to skip the cache
     * @returns {Promise<User>} The User instance.
     */
    fetch(userIdentifiable, forceApi = false) {
        return new Promise((resolve, reject) => {
            if (typeof userIdentifiable === 'number') userIdentifiable = userIdentifiable.toString()
            if (this.cache.has(userIdentifiable) && !forceApi) resolve(this.cache.get(userIdentifiable))
            else {
                for (const user of this.cache) if (user[1].tag === userIdentifiable && !forceApi) resolve(user)
                fetch('https://discord.com/api/users/' + userIdentifiable)
                    .then(res => res.json())
                    .then(res => {
                        this.updateCache(res)
                        resolve(this.cache.get(res.id))
                    }).catch(reject)
            }
        }
        )}
}

module.exports = UserManager

/**
 * An object which can be resolved to a user
 * @typedef {Object} UserResolvable
 */
