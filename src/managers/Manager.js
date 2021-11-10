
// Fairly similar to Discord.JS's BaseManager.

class Manager {

    /**
     * The base manager. All managers extend from this.
     * @param {Client} client The client this manager is attached to
     * @param {Object[]?} content The content to begin with
     * @param {Constructor} [type=Object] The type of object this class holds
     */
    constructor(client, type = Object, content = null) {

        /**
         * The client that instantiated this manager
         * @readonly
         * @member {Client} client
         * @memberof Manager
         * @instance
         */
        Object.defineProperty(this, 'client', { value: client })


        /**
         * The type of item this manager's cache holds.
         * @readonly
         * @member {Constructor} cacheType
         * @memberof Manager
         * @instance
         */
        Object.defineProperty(this, 'cacheType', { value: type, enumerable: true })

        /**
         * A map of the cached content
         * @member {Map<String, Manager#cacheType>} cache
         * @memberof Manager
         * @instance
         * @readonly
         */
        Object.defineProperty(this, 'cache', { value: new Map() })
        if (content) for (const o of content) {
            const resolved = this.resolve(o)
            if (!(resolved instanceof Promise)) this.updateCache(resolved)
        }
    }


    /**
     * Updates the cache with this object.
     * @param {Object|Array<Object>} appending The object to append
     * @param {...any} ...args Additional options
     * @returns {Manager#cacheType} An instance of the managed data structure
     */
    updateCache(appending, ...args) {
        if (Array.isArray(appending)) {
            let toReturn = []
            for (const app of appending) {
                let resolved = this.cacheType.resolve(app, this.client, ...args)
                this.cache.set(resolved.id, resolved)
                toReturn.push(resolved)
            }
            return toReturn
        }
        appending = this.cacheType ? this.cacheType.resolve(appending, this.client, ...args) : appending
        this.cache.set(appending.id, appending)
        return appending
    }

    /**
     * Resolves for an object this cache could or does hold
     * @param {string|object} resolvable The id or value of the object to receive.
     * @param {...any} ...args Additional options
     * @returns {Manager#cacheType} An instance of the managed data structure
     */
    resolve(resolvable, ...args) {
        if (resolvable instanceof String && this.cache.has(resolvable)) return this.cache.get(resolvable)
        if (this.cacheType !== Object) if (resolvable instanceof this.cacheType) return resolvable
        return this.cacheType.resolve(resolvable, this.client, ...args)
    }
}

module.exports = Manager
