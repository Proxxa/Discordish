const DMChannel = require("./DMChannel")

class GroupChannel extends DMChannel {

    constructor(client, data) {
        super(client, data)

        /**
         * The hash of the Group DM icon.
         * @readonly
         * @private
         */
        this._icon = data.icon

        /**
         * The id of the owner of this group DM
         * @readonly
         * @private
         */
        this._owner = data.owner_id
    }

    get owner() {
        return this.client.users.fetch(this._owner)
    }
}

module.exports = GroupChannel


/**
 * Data that describes a Group DM channel.
 * @typedef {DMChannelData} GroupChannelData
 * @property {String} icon The hash of the Group DM's icon
 * @property {String} owner_id The ID of the owner of this channel.
 */
