
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
        Object.defineProperty(this, 'client', { value: client, enumerable: true })

        /**
         * The time at which this object was instantiated.
         * @type {Number}
         * @private
         */
        Object.defineProperty(this, 'instantiated', { value: Date.now() })
    }

    /**
     * Resolves an object, promise, or array of "Resolvables" into an instance of this class.
     * @param {any} resolvable The object to resolve
     */
    static resolve(resolvable, client = null, ...args) {
        if (Array.isArray(resolvable)) return resolvable.map(r => this.resolve(r, ...args))
        if (resolvable instanceof this) return resolvable
        if (resolvable instanceof Promise) return resolvable.then(body => this.resolve(body))
        if (client) return new this(client, resolvable, ...args)
        const error = new RangeError("Resolvable was not previously constructed, and client was not passed.")
        error.resolvable = resolvable
        throw error
    }
}

module.exports = Base
