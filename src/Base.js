
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
         * @private
         */
        Object.defineProperty(this, 'instantiated', { value: Date.now() })
    }

    /**
     * Resolves an object, promise, or array of "Resolvables" into an instance of this class.
     * @param {any} resolvable The object to resolve
     */
    static resolve(resolvable) {
        if (Array.isArray(resolvable)) return resolvable.map(r => this.resolve(r))
        if (resolvable instanceof this) return resolvable
        if (resolvable instanceof Promise) resolvable.then(body => {
            return this.resolve(body)
        })
        return new this(this.client, resolvable)
        // Does not error. Must attempt to create an instance.
    }
}

module.exports = Base
