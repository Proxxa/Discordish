exports.WebSocket = require('ws')

/**
 * "Creates and returns a new websocket at the given URL."
 * @param {String} gateway "The URL of the gateway."
 * @param  {...any} args "Additional arguments."
 */
exports.create = (gateway, ...args) => {
    ws = new exports.WebSocket(gateway, ...args)
    return ws
}