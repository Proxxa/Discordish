const Base = require('../Base')
const ChannelManager = require('../managers/ChannelManager')
const fetch = require('node-fetch')
const VoiceChannel = require('../channel/VoiceChannel')
const TextChannel = require('../channel/TextChannel')
const BitField = require('../client/BitField')
class Guild extends Base {
    /**
     * 
     * @param {Object} guild "The data for the guild." 
     */
    constructor(client, guild) {
        super(client)

        if (!('unavailable' in guild)) throw new RangeError("Invalid guild object.")

        /**
         * The availability of the guild.
         * @readonly
         */
        this.available = !guild.unavailable
        if (this.available) {
            this.some = "AAAAAAAAAAA"
            /**
             * The guild's system channel. Used for built-in join
             * and boost messages.
             */
            this.systemChannel = guild.system_channel_id

            /**
             * If the guild is marked as NSFW
             */
            this.nsfw = guild.nsfw

            /**
             * Lazy guilds have this set to true
             */
            this.lazy = guild.lazy

            /**
             * If the guild is identified as "large"
             */
            this.large = guild.large

            /**
             * A set of cached channels.
             */
            this.channels = new ChannelManager(this.client, guild.channels)

            /**
             * The preferred voice channel location of this guild
             */
            this.locale = guild.preferred_locale

            /**
             * This guild's splash image
             */
            this.splash = guild.splash

            /**
             * The name of the guild
             */
            this.name = guild.name
            /**
             * The owner's id.
             * @readonly
             * @private
             */
            Object.defineProperty(this, '_owner', {value: guild.owner_id})
            
            /**
             * The timestamp at which the user joined the guild.
             * @readonly
             */
            this.joinedTimestamp = guild.joined_at
            
            /**
             * The guild's channels.
             * @readonly
             */
            Object.defineProperty(this, 'channels', { value: new ChannelManager(this.client, guild.channels) })

            /**
             * The guild's enabled features.
             * @readonly
             */
            Object.defineProperty(this, 'features', { value: guild.features })

        }
        /**
         * The guild id.
         * @readonly
         */
        Object.defineProperty(this, 'id', {value: guild.id, enumerable:true})
    }

    /**
     * The guild's owner.
     * @returns {Promise<GuildMember>} Promises the GuildMember object of the guild owner.
     * @readonly
     */
    get owner() {
        return this.client.users.fetch(this._owner)
    }

    fetch(cache = true, forceApi = false) {
        return new Promise((resolve, reject) => {
            if (this.client.guilds.has(this.id) && !forceApi)
                if (this.client.guilds.get(this.id).instantiated >= this.instantiated && !forceApi) resolve(this.client.guilds.get(this.id))
                else if (this.instantiated > this.client.guilds.get(this.id) && !forceApi) {
                    if (cache) this.client.guilds.updateCache(this)
                    resolve(this)
                } else fetch('https://discord.com/api/guilds/' + new URLSearchParams(this.id))
                    .then(res => res.json())
                    .then(res => {
                        if (cache) {
                            this.client.guilds.updateCache(res)
                            resolve(this.client.guilds.cache.get(res.id))
                        } else resolve(Guild.resolve(res))
                    }).catch(reject)
            reject(new Error("Could not fetch?"))
        })
    }

    /**
     * Edits the guild using the api.
     * @param {Object} content The parts to update
     * @private
     * @returns {Promise<Guild>} The new guild
     */
    edit(content = {}) {
        return new Promise((resolve, reject) => {
            fetch('https://discord.com/api/guilds/' + this.id, { method: 'PATCH', body: JSON.stringify(content), 'headers': { 'Authorization': 'Bot ' + this.client.token, 'Content-Type': 'application/json' } })
                .then(res => res.json())
                .then(body => {
                    resolve(this.client.guilds.cache.get(body.id))
                }).catch(reject)
        })
    }

    /**
     * Sets the name of the guild.
     * @param {string} name The new name of the guild
     * @returns {Promise<Guild>} The updated guild.
     */
    setName(name) {
        return this.edit({ 'name': name })
    }

    /**
     * Sets the verification level of the guild.
     * * 0: Unrestricted
     * * 1: Verified Email
     * * 2: Registered Discord user for 5+ minutes
     * * 3: Server member for 10+ minutes
     * * 4: Verified phone number
     * @param {string|number} level The level of verification.
     * @returns {Promise<Guild>} The updated guild.
     */
    setVerification(level) {
        let lev = level
        if (lev instanceof String) lev = Number(lev)
        if (isNaN(lev)) {
            const error = new RangeError("Non-number input. Expected number or stringified number.")
            error.input = level
            throw error
        }
        if (lev > 4 || lev < 0) throw new RangeError("Expected input to be between zero and four. Was " + lev)
        if (lev % 1 !== 0) throw new RangeError("Expected input to be an integer. Was " + lev)
        return this.edit({ 'verification_level': lev })
    }

    /**
     * Sets the explicit content filter level of the guild.
     * * 0: Unfiltered
     * * 1: Filter content from role-less members
     * * 2: Filter content from anyone
     * @param {string|number} level The level of the filter.
     * @returns {Promise<Guild>} The updated guild.
     */
    setFilter(level) {
        let lev = level
        if (lev instanceof String) lev = Number(lev)
        if (isNaN(lev)) {
            const error = new RangeError("Non-number input. Expected number or stringified number.")
            error.input = level
            throw error
        }
        if (lev > 2 || lev < 0) throw new RangeError("Expected input to be between zero and two. Was " + lev)
        if (lev % 1 !== 0) throw new RangeError("Expected input to be an integer. Was " + lev)
        return this.edit({ 'explicit_content_filter': lev })
    }

    /**
     * Sets the afk timeout of this guild's voice channels.
     * @param {string|number} timeout The new timeout.
     * @returns {Promise<Guild>} The updated guild.
     */
    setTimeout(timeout) {
        let seconds = timeout
        if (seconds instanceof String) seconds = Number(seconds)
        if (isNaN(seconds)) {
            const error = new RangeError("Non-number input. Expected number or stringified number.")
            error.input = timeout
            throw error
        }
        if (seconds < 0) throw new RangeError("Expected input to be positive. Was " + seconds)
        if (seconds % 1 !== 0) throw new RangeError("Expected input to be an integer. Was " + seconds)
        return this.edit({ 'afk_timeout': seconds })
    }

    /**
     * Sets the guild's afk channel.
     * @param {string|number} channel The id of the new channel.
     * @returns {Promise<Guild>} The updated guild.
     */
    setIdleChannel(channel) {
        if (!this.channels.cache.has(channel.toString())) {
            const error = new RangeError("Invalid/uncached channel ID. Try refreshing cache first.")
            error.id = channel
            throw error
        }
        if (!(this.channels.cache.get(channel.toString()) instanceof VoiceChannel)) {
            const error = new RangeError("Invalid channel ID. Must be a voice channel.")
            error.id = channel
            throw error
        }
        return this.edit({ 'afk_channel_id': channel })
    }

    /**
     * Sets the default notification level of the guild.
     * @param {string|number} level The default notification level.
     * @returns {Promise<Guild>} The updated guild.
     */
    setDefaultNotifications(level) {
        let lev = Number(level)
        if (lev !== 0 && lev !== 1) throw new RangeError("Expected input to be 0 or 1. Got " + level)
        return this.edit({ 'default_message_notifications': lev })
    }
    
    /**
     * Sets the icon of the guild.
     * @param {Buffer|String} imageData A buffer of image data or Base64 encryption of it.
     * @returns {Promise<Guild>} The updated guild.
     */
    setIcon(imageData) {
        let dat = imageData
        if (typeof dat !== 'string') dat = dat.toString('base64')
        return this.edit({ 'icon': 'data:image/jpeg;base64,' + dat })
    }

    /**
     * Sets the splash image of the guild.
     * @param {Buffer|String} imageData A buffer of image data or Base64 encryption of it.
     * @returns {Promise<Guild>} The updated guild.
     */
    setSplash(imageData) {
        let dat = imageData
        if (typeof dat !== 'string') dat = dat.toString('base64')
        return this.edit({ 'splash': 'data:image/jpeg;base64,' + dat })
    }

    /**
     * Sets the discovery splash image of the guild.
     * @param {Buffer|String} imageData A buffer of image data or Base64 encryption of it.
     * @returns {Promise<Guild>} The updated guild.
     */
    setDiscoverySplash(imageData) {
        let dat = imageData
        if (typeof dat !== 'string') dat = dat.toString('base64')
        return this.edit({ 'discovery_splash': 'data:image/jpeg;base64,' + dat })
    }
    
    /**
     * Sets the banner image of the guild.
     * @param {Buffer|String} imageData A buffer of JPEG image data or Base64 encryption of it.
     * @returns {Promise<Guild>} The updated guild.
     */
    setBanner(imageData) {
        let dat = imageData
        if (typeof dat !== 'string') dat = dat.toString('base64')
        return this.edit({ 'banner': 'data:image/jpeg;base64,' + dat })
    }

    /**
     * Sets the owner of the guild. Must be the owner of the guild to do this.
     * @param {String|Number} snowflake The id of the new owner.
     * @returns {Promise<Guild>} The updated guild.
     */
    setOwner(snowflake) {
        if (this.owner.id !== this.client.user.id) throw Error("Must be the guild owner to transfer ownership.")
        return this.edit({ 'owner': snowflake })
    }

    /**
     * Sets the guild's "system channel."
     * @param {string|number} channel The id of the new channel.
     * @returns {Promise<Guild>} The updated guild.
     */
    setSystemChannel(channel) {
        if (!this.channels.cache.has(channel.toString())) {
            const error = new RangeError("Invalid/uncached channel ID. Try refreshing cache first.")
            error.id = channel
            throw error
        }
        if (!(this.channels.cache.get(channel.toString()) instanceof TextChannel)) {
            const error = new RangeError("Invalid channel ID. Must be a text channel.")
            error.id = channel
            throw error
        }
        return this.edit({ 'system_channel_id': channel })
    }

    /**
     * Sets the guild's system channel settings.
     * @param {BitField|Number} bitfield The flags to set..
     * @returns {Promise<Guild>} The updated guild.
     */
    setSystemFlags(bitfield) {
        let bits = bitfield
        if (bits instanceof Number) bits = new BitField(bits)
        if (bits.bitfield > 7) throw new RangeError("Bitfield cannot have a value greater than 7. Got " + bits.bitfield)
        return this.edit({ 'afk_channel_id': bits.bitfield })
    }

    /**
     * Sets the guild's "rules channel."
     * @param {string|number} channel The id of the new channel.
     * @returns {Promise<Guild>} The updated guild.
     */
    setRulesChannel(channel) {
        if (!this.channels.cache.has(channel.toString())) {
            const error = new RangeError("Invalid/uncached channel ID. Try refreshing cache first.")
            error.id = channel
            throw error
        }
        if (!(this.channels.cache.get(channel.toString()) instanceof TextChannel)) {
            const error = new RangeError("Invalid channel ID. Must be a text channel.")
            error.id = channel
            throw error
        }
        return this.edit({ 'rules_channel_id': channel })
    }

    /**
     * Sets the guild's "updates channel."
     * @param {string|number} channel The id of the new channel.
     * @returns {Promise<Guild>} The updated guild.
     */
    setUpdatesChannel(channel) {
        if (!this.channels.cache.has(channel.toString())) {
            const error = new RangeError("Invalid/uncached channel ID. Try refreshing cache first.")
            error.id = channel
            throw error
        }
        if (!(this.channels.cache.get(channel.toString()) instanceof TextChannel)) {
            const error = new RangeError("Invalid channel ID. Must be a text channel.")
            error.id = channel
            throw error
        }
        return this.edit({ 'public_updates_channel_id': channel })
    }

    /**
     * Sets the guild's discovery description
     * @param {string} description The new description.
     * @returns {Promise<Guild>} The updated guild.
     */
    setDescription(description) {
        description = description.toString()
        return this.edit({ 'description': description })
    }

    /**
     * Sets the guild's features
     * Valid options are ANIMATED_ICON, BANNER, COMMERCE,
     * COMMUNITY, DISCOVERABLE, FEATURABLE, INVITE_SPLASH,
     * MEMBER_VERIFICATION_GATE_ENABLED, NEWS, PARTNERED,
     * PREVIEW_ENABLED, VANITY_URL, VERIFIED, VIP_REGIONS,
     * WELCOME_SCREEN_ENABLED
     * Note that not all of these may be usable in all guilds.
     * @param {String|String[]} features The new list of features.
     * @returns {Promise<Guild>} The updated guild.
     */
    setFeatures(features) {
        if (!Array.isArray(features)) features = [features]
        return this.edit({ 'features': features })
    }

    /**
     * Add to the guild's features
     * Valid options are ANIMATED_ICON, BANNER, COMMERCE,
     * COMMUNITY, DISCOVERABLE, FEATURABLE, INVITE_SPLASH,
     * MEMBER_VERIFICATION_GATE_ENABLED, NEWS, PARTNERED,
     * PREVIEW_ENABLED, VANITY_URL, VERIFIED, VIP_REGIONS,
     * WELCOME_SCREEN_ENABLED
     * Note that not all of these may be usable in all guilds or
     * settable through the API.
     * @param {String|String[]} features The new list of features.
     * @returns {Promise<Guild>} The updated guild.
     */
    addFeatures(features) {
        if (!Array.isArray(features)) features = [features]
        let oldFeats = new Set(this.features)
        features.forEach(oldFeats.add)
        return this.edit({ 'features': Array.from(oldFeats) })
    }

    /**
     * Deletes the guild, as long as you're the guild owner.
     * @returns {Promise<Boolean|Error>} Returns true if successful. Otherwise, rejects with an error.
     */
    delete() {
        if (this.owner.id !== this.client.user.id) throw Error("Must be the guild owner to delete a guild.")
        return new Promise((resolve, reject) => {
            fetch('https://discord.com/api/guilds/' + this.id, { method: 'DELETE', headers: { 'Authorization': 'Bot' + this.client.token }})
                .then(res => res.json())
                .then(res => {
                    if (!JSON.stringify(res).includes('204')) {
                        let error = new Error("Could not delete guild.")
                        error.response = res
                        reject(error)
                    }
                    this.client.guilds.cache.delete(this.id)
                    resolve(true)
                }).catch(reject)
            reject(new Error("Could not delete?"))
        })
    }
}

module.exports = Guild
