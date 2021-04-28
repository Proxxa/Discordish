const Base = require('../Base')
class User extends Base {
    /**
     * The object from which all users are derived from.
     * @param {Client} client "The client from which this user originates"
     * @param {*} user 
     */
    constructor(client, user = {}) {
        super(client)
        this.username = user.username
        Object.defineProperty(this, 'id', { value: user.id })
        this.discriminator = user.discriminator
        Object.defineProperty(this, 'bot', { value: user.bot })
        this.flags = user.flags
    }

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
