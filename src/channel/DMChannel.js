const User = require("../user/User")
const Message = require("./Message")
const Channel = require("./Channel")
const fetch = require('node-fetch')

class DMChannel extends Channel {

    constructor(client, data) {
        super(client, data)

        /**
         * A map of users who can see this channel.
         * @type {Map<User>}
         */
        this.recipients = new Map()
        for (const recip of data.recipients) {
            this.recipients.set(recip.id, new User(recip))
        }
    }

    /**
     * The last message sent to the channel.
     * @type {Promise<Message>}
     */
    get lastMessage() {
        return new Promise((resolve, reject) => {
            fetch(`https://discord.com/api/channels/${this.id}/messages?limit=1`)
                .then(res => res.json())
                .then(res => {
                    if (res) resolve(new Message(res[0]))
                    else reject(Error("No messages received from server."))
                })
                .catch(reject)
        })
    }
}

module.exports = DMChannel