const User = require("./User");

class GuildMember extends User {
    /**
     * A user with extra methods for guilds
     * @extends User
     * @param {User} user "The user object of this member." 
     * @param {Guild} guild "The guild this user is a member of."
     */
    constructor(user, guild) {
        super(user)
        this.user = user
        this.guild = guild
    }
}

module.exports = GuildMember