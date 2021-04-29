
// Fairly similar to Discord.JS's BaseManager.

class Manager {

    /**
     * The base manager. All managers extend from this.
     * @param {Client} client The client that instantiated this
     * @param {Object[]} content The content to begin with
     * @param {Class} type The type of object this class holds
     */
    constructor(client, type = Object, content = null) {

        /**
         * The client that instantiated this manager
         * @readonly
         * @type {Client}
         */
        Object.defineProperty(this, 'client', { value: client })


        /**
         * The type of item this manager's cache holds.
         * @readonly
         * @type {Object}
         */
        Object.defineProperty(this, 'cacheType', { value: type, enumerable: true })

        this.cache = new Map()
        if (content) for (const o of content) {
            const resolved = this.resolve(o)
            if (!(resolved instanceof Promise)) this.updateCache(resolved)
        }
    }


    /**
     * Updates the cache with this object.
     * @param {Object} appending The object to append
     * @param {Boolean} cache Whether or not to cache this object
     * @param  {...any} extra Additional options for building of the object
     * @returns 
     */
    updateCache(appending) {
        appending = this.cacheType ? this.cacheType.resolve(appending, this.client) : appending
        this.cache.set(appending.id, appending)
        return appending
    }

    /**
     * Resolves for an object this cache could or does hold
     * @param {string|object} resolvable The id or value of the object to receive.
     */
    resolve(resolvable) {
        if (resolvable instanceof String && this.cache.has(resolvable)) return this.cache.get(resolvable)
        if (this.cacheType !== Object) if (resolvable instanceof this.cacheType) return resolvable
        return this.cacheType.resolve(resolvable, this.client)
    }
}

module.exports = Manager
