const ChannelTypes = require('./ChannelTypes.js')
class Channel {
    /**
     * 
     * @param {Client} client The client that instantiated this channel
     * @param {ChannelData} data The data for this channel
     */
    constructor(client, data) {
        this.client = client
        
        /**
         * The channel type.
         * @readonly
         */
        this.type = ChannelTypes[data.type]

        /**
         * The channel id.
         * @readonly
         */
        this.id = data.id
    }
}

module.exports = Channel
