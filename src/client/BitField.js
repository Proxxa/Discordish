
/*
    All of this code is repurposed from DiscordJS (https://discord.js.org)
    This is simply much too easy to not use.
    Any recreation of it would entirely be expanding the code and renaming variables.
    
    As such, it's necessary to provide the proper licensing that this file should
    be under, which can be found at http://www.apache.org/licenses/LICENSE-2.0

    It's a rather large license, but it's quite necessary to give proper acknowledgement
    to the creators of this file.
*/

/**
 * Data structure that makes it easy to interact with a bitfield.
 * @author DiscordJS <discord.js.org>
 */
class BitField {
    /**
   * @param {BitFieldResolvable} [bits=0] Bit(s) to read from
   */
    constructor(bits) {
    /**
     * Bitfield of the packed bits
     * @type {number}
     */
        this.bitfield = this.constructor.resolve(bits)
    }

    /**
   * Checks whether the bitfield has a bit, or any of multiple bits.
   * @param {BitFieldResolvable} bit Bit(s) to check for
   * @returns {boolean}
   */
    any(bit) {
        return (this.bitfield & this.constructor.resolve(bit)) !== 0
    }

    /**
   * Checks if this bitfield equals another
   * @param {BitFieldResolvable} bit Bit(s) to check for
   * @returns {boolean}
   */
    equals(bit) {
        return this.bitfield === this.constructor.resolve(bit)
    }

    /**
   * Checks whether the bitfield has a bit, or multiple bits.
   * @param {BitFieldResolvable} bit Bit(s) to check for
   * @returns {boolean}
   */
    has(bit) {
        if (Array.isArray(bit)) return bit.every(p => this.has(p))
        bit = this.constructor.resolve(bit)
        return (this.bitfield & bit) === bit
    }

    /**
   * Gets all given bits that are missing from the bitfield.
   * @param {BitFieldResolvable} bits Bit(s) to check for
   * @param {...*} hasParams Additional parameters for the has method, if any
   * @returns {string[]}
   */
    missing(bits, ...hasParams) {
        if (!Array.isArray(bits)) bits = new this.constructor(bits).toArray(false)
        return bits.filter(p => !this.has(p, ...hasParams))
    }

    /**
   * Freezes these bits, making them immutable.
   * @returns {Readonly<BitField>} These bits
   */
    freeze() {
        return Object.freeze(this)
    }

    /**
   * Adds bits to these ones.
   * @param {...BitFieldResolvable} [bits] Bits to add
   * @returns {BitField} These bits or new BitField if the instance is frozen.
   */
    add(...bits) {
        let total = 0
        for (const bit of bits) 
            total |= this.constructor.resolve(bit)
    
        if (Object.isFrozen(this)) return new this.constructor(this.bitfield | total)
        this.bitfield |= total
        return this
    }

    /**
   * Removes bits from these.
   * @param {...BitFieldResolvable} [bits] Bits to remove
   * @returns {BitField} These bits or new BitField if the instance is frozen.
   */
    remove(...bits) {
        let total = 0
        for (const bit of bits) 
            total |= this.constructor.resolve(bit)
    
        if (Object.isFrozen(this)) return new this.constructor(this.bitfield & ~total)
        this.bitfield &= ~total
        return this
    }

    /**
   * Gets an object mapping field names to a {@link boolean} indicating whether the
   * bit is available.
   * @param {...*} hasParams Additional parameters for the has method, if any
   * @returns {Object}
   */
    serialize(...hasParams) {
        const serialized = {}
        for (const [flag, bit] of Object.entries(this.constructor.FLAGS)) serialized[flag] = this.has(bit, ...hasParams)
        return serialized
    }

    /**
   * Gets an {@link Array} of bitfield names based on the bits available.
   * @param {...*} hasParams Additional parameters for the has method, if any
   * @returns {string[]}
   */
    toArray(...hasParams) {
        return Object.keys(this.constructor.FLAGS).filter(bit => this.has(bit, ...hasParams))
    }

    toJSON() {
        return this.bitfield
    }

    valueOf() {
        return this.bitfield
    }

    *[Symbol.iterator]() {
        yield* this.toArray()
    }

    /**
     * Data that can be resolved to give a bitfield. This can be:<ul>
     * <li>A string (see {@link BitField.FLAGS})</li>
     * <li>A bit number</li>
     * <li>An instance of BitField</li>
     * <li>An Array of BitFieldResolvable</li><ul>
     * @typedef {string|number|BitField|BitFieldResolvable[]} BitFieldResolvable
     */

    /**
     * Resolves bitfields to their numeric form.
     * @param {BitFieldResolvable} [bit=0] - bit(s) to resolve
     * @returns {number}
     */
    static resolve(bit = 0) {
        if (typeof bit === 'number' && bit >= 0) return bit
        if (bit instanceof BitField) return bit.bitfield
        if (Array.isArray(bit)) return bit.map(p => this.resolve(p)).reduce((prev, p) => prev | p, 0)
        if (typeof bit === 'string' && typeof this.FLAGS[bit] !== 'undefined') return this.FLAGS[bit]
        const error = new RangeError('BITFIELD_INVALID')
        error.bit = bit
        throw error
    }
}

/**
 * 
 */

/**
 * Numeric bitfield flags.
 * <info>Defined by extensions</info>
 * @type {Object}
 * @abstract
 */
BitField.FLAGS = {}

module.exports = BitField
