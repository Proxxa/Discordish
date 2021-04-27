
// Similar in concept to Discord.JS' Base.
// Key difference in Base.resolve. Base.resolve works properly
// Even for extending classes.

class Base {

    /**
     * The base class that most objects extend off of.
     * @abstract
     * @param {Client} client The client that instantiated this
     */
    constructor(client) {
        /**
         * The client that instantiated this object.
         * @type {Client}
         */
        Object.defineProperty(this, 'client', { value: client })

        /**
         * The time at which this object was instantiated.
         * @type {Number}
         */
        Object.defineProperty(this, 'instantiated', { value: Date.now() })
    }

    /**
     * Resolves an object, promise, or array of "Resolvables" into an instance of this class.
     * @param {any} resolvable The object to resolve
     */
    static async resolve(resolvable) {
        if (Array.isArray(resolvable)) return resolvable.map(r => this.constructor.resolve(r))
        if (resolvable instanceof this.constructor) return resolvable
        if (resolvable instanceof Promise) return this.constructor.resolve(await resolvable)
        if ('id' in resolvable) return new this(this.client, resolvable)
        let error = new RangeError("Invalid resolvable object")
        error.object = resolvable
        throw error
    }
}

module.exports = Base
