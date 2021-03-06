const Base = require('../Base')
const fetch = require('node-fetch')
class Channel extends Base {
    /**
     * The base form of a Discord channel. All channel types extend from this.
     * @param {Client} client The client that instantiated this channel
     * @param {ChannelData} data The data for this channel
     * @extends Base
     */
    constructor(client, data) {
        super(client)
        
        /**
         * The channel type.
         * @readonly
         * @member {String} Type
         * @memberof Channel
         * @instance
         */
        Object.defineProperty(this, 'type', {value: ChannelTypes[data.type]})

        /**
         * The channel id.
         * @readonly
         * @member {String} id
         * @memberof channel
         * @instance
         */
        Object.defineProperty(this, 'id', {value: data.id, enumerable: true})
    }
    /**
     * Takes a Channel or ChannelResolvable object and uses it to return a Channel filled
     * to the highest possible extension.
     * @param {ChannelResolvable} completable Some object to fill out into a full channel
     * @param {Client} client The client to attach to this channel
     * @returns {Channel}
     */
    static compelete(completable, client) {
        if (!client) throw new RangeError("Attached client required.")
        if ('type' in completable)
            switch (completable.type) {
            default: return Channel.resolve(completable,client)
            case 0: return TextChannel.resolve(completable,client)
            case 1: return DMChannel.resolve(completable,client)
            case 2: return VoiceChannel.resolve(completable,client)
            case 3: return GroupChannel.resolve(completable,client)
            case 5: return NewsChannel.resolve(completable,client)
            }
        else {
            const err = new RangeError("Invalid completable object")
            err.completable = completable
            throw err
        }
    }

    /**
     * @param {Channel|string|number} identifiable The name, id, or object of a channel.
     * @param {Boolean} cache Whether or not to cache the object.
     * @param {Boolean} forceApi Whether or not to skip checking the cache and immediately call the API.
     * @returns {Promise}
     */
    fetch(cache = true, forceApi = false) {
        return new Promise((resolve, reject) => {
            if (this.client.channels.has(this.id) && !forceApi) 
                if (this.client.channels.get(this.id).instantiated >= this.instantiated && !forceApi) resolve(this.client.channels.get(this.id))
                else if (this.instantiated > this.client.channels.get(this.id) && !forceApi) {
                    if (cache) this.client.channels.updateCache(this)
                    resolve(this)
                } else 
                    fetch('https://discord.com/api/channels/' + new URLSearchParams(this.id))
                        .then(res => res.json())
                        .then(res => {
                            if (cache) {
                                this.cache.set(res.id, Channel.complete(res))
                                resolve(this.cache.get(res.id))
                            } else resolve(Channel.complete(res))
                        }).catch(reject)
            reject(new Error("Could not fetch?"))
        }
        )}

    /**
     * Edits the guild using the api.
     * @param {Object} content The parts to update
     * @returns {Promise<Channel>} The new guild
     * @private
     */
    edit(content = {}) {
        console.log("EDITING CHANNEL %a, %b", this.id, JSON.stringify(content))
        return new Promise((resolve, reject) => {
            fetch('https://discord.com/api/channels/' + this.id, { method: 'PATCH', body: JSON.stringify(content), 'headers': { 'Authorization': 'Bot ' + this.client.token, 'Content-Type': 'application/json' } })
                .then(res => res.json())
                .then(body => {
                    resolve(this.client.channels.cache.get(body.id))
                }).catch(reject)
        })
    }

}

module.exports = Channel

// Hoisted channel types, played below the declaration of Channel for extension.
const ChannelTypes = require('./ChannelTypes.js')
const DMChannel = require('./DMChannel.js')
const GroupChannel = require('./GroupChannel.js')
const NewsChannel = require('./NewsChannel.js')
const TextChannel = require('./TextChannel.js')
const VoiceChannel = require('./VoiceChannel.js')

/**
 * An object which encompasses the data which describes a channel
 * @typedef {Object} ChannelData
 * @property {Number} type An integer which describes the type of the channel.
 * @property {String} id The ID of the channel
 */

/**
 * Any object that may be resolved into a channel.
 * @typedef {Object|Channel|Promise<Channel>|ChannelResolvable} ChannelResolvable
 */
