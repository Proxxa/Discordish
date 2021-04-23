class User {
    /**
     * The object from which all users are derived from.
     * @param {Client} client "The client from which this user originates"
     * @param {*} user 
     * @param {Boolean} cache "Whether or not to cache the user"
     */
    constructor(client, user = {}, cache = true) {
        this.client = client
        this.username = user.username
        Object.defineProperty(this, 'id', { value: user.id })
        this.discriminator = user.discriminator
        Object.defineProperty(this, 'bot', { value: user.bot })
        this.flags = user.flags
    }
}

module.exports = User