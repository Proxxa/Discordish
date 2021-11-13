const { Buffer } = require("buffer")
const Base = require('./Base.js')
const Guild = require('./Guild')
const Permissions = require('./Permissions')

class Role extends Base {

    /**
     * A Role within a guild
     * @param {Client} client The client that instantiated this
     * @param {RoleData} data The data from which to build the role
     * @param {Guild} guild The guild from which this role originates
     */
    constructor(client, data, guild) {
        super(client)

        /**
         * @member {Guild} guild The guild this role belongs to
         * @memberof Role
         * @instance
         */
        Object.defineProperty(this, 'guild', { value: Guild.resolve(guild) })

        /**
         * @member {String} id The ID of the role
         * @memberof Role
         * @instance
         */
        Object.defineProperty(this, 'id', { value: data.id })

        /**
         * The name of the role
         * @type {String}
         */
        this.name = data.name

        /**
         * The color of the role, as represented by a base-10 integer
         * @type {Number}
         */
        this.color = data.color

        /**
         * Whether or not this role's users are displayed separately from other users
         * @type {Boolean}
         */
        this.hoisted = data.hoist

        /**
         * The hash of the role icon. <br>Not a link to or buffer containing the icon
         * @type {String?}
         */
        this.icon = data.icon

        /**
         * A unicode emoji associated with the role
         * @type {String?}
         */
        this.emoji = data.unicode_emoji

        /**
         * The position of the role in its role hierarchy
         * @type {Number}
         */
        this.position = data.position

        /**
         * The permissions this role provides by default
         * @type {Permissions}
         */
        this.permissions = new Permissions(Number(data.permissions))

        /**
         * Whether or not this role is managed by an integration (bot)
         * @type {Boolean}
         */
        this.managed = data.managed

        /**
         * Whether or not this role can be mentioned by all users
         * @type {Boolean}
         */
        this.mentionable = data.mentionable

        if (data.tags !== null) {
            /**
             * The id of the bot user to which this role belongs
             * @type {String?}
             */
            this.bot = data.bot_id

            /**
             * The id of the integration which manages this role
             * @type {String?}
             */
            this.integration = data.integration_id

            /**
             * Whether or not this role is automatically assigned to server boosters
             */
            this.boosterRole = data.premium_subscriber
        }
    }

    /**
     * Edits the role using the api.
     * @param {Object} content The parts to update
     * @private
     * @returns {Promise<Role>} The new role
     */
    edit(content = {}) {
        return new Promise((resolve, reject) => {
            fetch('https://discord.com/api/guilds/' + this.guild.id + '/roles/' + this.id, { method: 'PATCH', body: JSON.stringify(content), 'headers': { 'Authorization': 'Bot ' + this.client.token, 'Content-Type': 'application/json' } })
                .then(res => res.json())
                .then(body => {
                    this.guild.roles.updateCache(body)
                    resolve(this.guild.roles.cache.get(body.id))
                }).catch(reject)
        })
    }

    /**
     * Edit the role's name
     * @param {any} name The new role name
     * @returns {Promise<Role>} The new role
     */
    setName(name) {
        // eslint-disable-next-line no-promise-executor-return
        return new Promise((resolve, reject) => this.edit({ 'name': name.toString() }).then(resolve).catch(reject))
    }

    /**
     * Edit the role's permissions
     * @param {Permissions} permissions The new role permissions
     * @returns {Promise<Role>} The new role
     */
    setPermissions(permissions) {
        // eslint-disable-next-line no-promise-executor-return
        return new Promise((resolve, reject) => this.edit({ 'permissions': permissions.bitfield }).then(resolve).catch(reject))
    }

    /**
     * Edit the role's color
     * @param {Number} [color=0] The new role color. Defaults to no color
     * @returns {Promise<Role>} The new role
     */
    setColor(color = 0) {
        if (Number(color).isNaN()) {
            let err = new RangeError("Cannot cast type " + typeof color + " to number.")
            err.uncastable = color
            throw err
        }
        // eslint-disable-next-line no-promise-executor-return
        return new Promise((resolve, reject) => this.edit({ 'color': Number(color) }).then(resolve).catch(reject))
    }

    /**
     * Edit the role's position
     * @param {Number} [position=0] The new role position. Defaults to zero and rounds down
     * @returns {Promise<Role>} The new role
     */
    setPosition(position = 0) {
        if (Number(position).isNaN()) {
            let err = new RangeError("Cannot cast type " + typeof position + " to number.")
            err.uncastable = position
            throw err
        }
        return new Promise((resolve, reject) => {
            fetch('https://discord.com/api/guilds/' + this.guild.id + '/roles/', { method: 'PATCH', body: { id: this.id, position: Number(Math.floor(position))}, 'headers': { 'Authorization': 'Bot ' + this.client.token, 'Content-Type': 'application/json' } })
                .then(res => res.json())
                .then(body => {
                    this.guild.roles.updateCache(body)
                    resolve(this.guild.roles.cache.get(body.id))
                }).catch(reject)
        })
    }

    /**
     * Set the "hoisted" value of the role
     * @param {Boolean} bool The new value
     * @returns {Promise<Role>} The new role
     */
    setHoisted(bool) {
        if ((typeof bool).toLowerCase() === "boolean") {
            let err = new TypeError("Expected type Boolean. Received " + typeof bool + ".")
            err[typeof bool] = bool
            throw err
        }
        // eslint-disable-next-line no-promise-executor-return
        return new Promise((resolve, reject) => this.edit({ 'hoisted': bool }).then(resolve).catch(reject))
    }

    /**
     * Set the role's image, if possible
     * @param {ImageData} iconData The new role image, as jpeg
     * @returns {Promise<Role>} The new role
     */
    setIcon(iconData) {
        // eslint-disable-next-line no-promise-executor-return
        return new Promise((resolve, reject) => this.edit({ 'icon': 'data:image/jpeg;base64,' + Buffer.from(iconData).toString("base64") }).then(resolve).catch(reject))
    }
    
    /**
     * Set the role's emoji icon, if possible
     * @param {String} emoji The new emoji, as unicode
     * @returns {Promise<Role>} The new role
     */
    setEmoji(emoji) {
        // eslint-disable-next-line no-promise-executor-return
        return new Promise((resolve, reject) => this.edit({ 'unicode_emoji': emoji }).then(resolve).catch(reject))
    }
    
    /**
     * Set whether or not all users can mention a role
     * @param {Boolean} bool The new value
     * @returns {Promise<Role>} The new role
     */
    setMentionable(bool) {
        if ((typeof bool).toLowerCase() === "boolean") {
            let err = new TypeError("Expected type Boolean. Received " + typeof bool + ".")
            err[typeof bool] = bool
            throw err
        }
        // eslint-disable-next-line no-promise-executor-return
        return new Promise((resolve, reject) => this.edit({ 'mentionable': bool }).then(resolve).catch(reject))
    }

    /**
     * Deletes the role using the API
     * @param {String} reason Why the role was deleted
     * @returns {Promise<true|Error>}
     */
    delete(reason = "No reason.") {
        return new Promise((resolve, reject) => {
            fetch('https://discord.com/api/guilds/' + this.guild.id + '/roles/' + this.id, { method: 'DELETE', 'headers': { 'Authorization': 'Bot ' + this.client.token, 'Content-Type': 'application/json', 'X-Audit-Log-Reason': reason } })
                .then(res => res.json())
                .then(body => {
                    this.guild.roles.updateCache(body)
                    resolve(this.guild.roles.cache.get(body.id))
                }).catch(reject)
        })
    }
}

module.exports = Role

