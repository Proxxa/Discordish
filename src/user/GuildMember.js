const User = require("./User");

class GuildMember extends User {
    /**
     * A user with extra methods for guilds
     * @extends User
     * @param {User} user "The user object of this member." 
     * @param {Guild} guild "The guild this user is a member of."
     */
    constructor(user, guild) {
        super(user.client, user)

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
}

module.exports = GuildMember