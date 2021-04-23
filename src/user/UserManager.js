const User = require('./User')

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
}

module.exports = UserManager