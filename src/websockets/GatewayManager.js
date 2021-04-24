const WebSocket = require('./Websocket')
const fetch = require('node-fetch')
const EventEmitter = require('events')

class GatewayManager extends EventEmitter {
    /**
     * Manages the Discord API WebSocket Gateway
     * @param {Client} client 
     */
    constructor(client) {
        super()
        Object.defineProperty(this, 'client', { value: client })
        Object.defineProperty(this, '_gateway', { value: null, writable: true })
        this.connected = false
        this.lonelyHeartbeats = 0
        this.lastSeq = null
    }

    get gateway() {
        this.client.emit("debug", `[GW] Gateway requested.`)
        return new Promise((res, rej) => { 
        if (this._gateway == null || this._gateway == undefined) {
            fetch('https://discord.com/api/gateway/bot', { method: 'GET', headers: { 'Authorization': "Bot " + this.client.token } })
                .then(response => response.json())
                .then(body => {
                    this.client.emit("debug", `[GW] Gateway response acquired`)
                    this.client.emit("debug", body)
                    if (body.url) {
                        body.url = body.url + '/'
                        this._gateway = body
                        res(body)
                    }
                    else rej(new Error("Unknown error when getting gateway link."))
                })
                .catch(e => {
                    rej("Whoops. " + e)
                })
        } else res(this._gateway)
        })
    }

    /**
     * Sends an OPCode 2 identifying payload once the websocket is connected.
     * @private 
     */
    identify(token = this.client.token) {
        let identifying = {
            "op": 2,
            "d": {
                "token": token,
                "intents": this.client.clientOptions.intents,
                "properties": {
                    "$os": "linux",
                    "$browser": "Discord-API",
                    "$device": "Discord-API"
                }
            },
            s: null,
            t: null
        }
        if (this.connected) {
            identifying = JSON.stringify(identifying)
            this.client.emit('debug', `[WS] Identifying.\n${identifying}`)
            this.client.ws.send(identifying)
        } else {
            this.client.ws.once('message', data => { // eslint-disable-line no-unused-vars
                identifying = JSON.stringify(identifying)
                this.client.emit('debug', `[WS] Identifying.\n${identifying}`)
                this.client.ws.send(identifying)
            })
        }
    }


    /**
     * Sends a heartbeat.
     * @private
     */
    heartbeat() {
        this.lonelyHeartbeats++
        if (this.lonelyHeartbeats < 2) {
            this.client.ws.send(JSON.stringify({ op: 1, d: this.lastSeq }))
            this.client.emit('debug', '[WS] Sent heartbeat.')
        } else {
            this.client.ws.close("[GW] Heartbeats have not received ACKs")
        }
    }

    /**
     * Connects to the Discord API gateway
     * @returns {WebSocket} "The WebSocket connected to the Discord gateway"
     */
    async connect() {
        if (!this.client.token) throw new Error("No user token.")
        await this.gateway
        let gatewayURL = await this.gateway
        gatewayURL = gatewayURL.url + '?v=' + this.client.clientOptions.gateway.version + '&encoding=' + this.client.clientOptions.gateway.encoding
        const ws = WebSocket.create(gatewayURL)

        ws.once("open", () => this.client.emit("debug", `[WS] WebSocket opened to ${gatewayURL}`))
        

        ws.on("error", ev => {
            const error = ev && ev.error ? ev.error : ev
            throw new Error(error)
        })
        ws.on("message", dat => {
            this.client.emit("debug", `[WS] WebSocket received a message.`, JSON.parse(dat).op == 0 ? JSON.parse(dat) : dat)
            dat = JSON.parse(dat)
            if (dat.op === 11) {
                this.lonelyHeartbeats--
                this.client.emit('debug', `[WS] WebSocket received a heartbeat ACK`)
            }
            if (dat.s !== null) this.lastSeq = dat.s
            if (dat.op == 0) this.emit(dat.t, dat)
        })
        ws.once('message', data => {
            data = JSON.parse(data)
            this.client.emit("debug", `[WS] WebSocket received initial message\n${JSON.stringify(data)}\n`)
            if (data.op != 10) throw Error("Discord OPCode did not respond 10.")
            this.connected = true
            this.identify(this.client.token)
            setTimeout(() => {
                this.heartbeat()
            }, data.d.heartbeat_interval * Math.random() * 0.5)
            this.heartbeatInterval = setInterval(() => {
                this.heartbeat()
            }, data.d.heartbeat_interval)
        })
        ws.on("close", reas => {
            this.client.emit("disconnect", reas)
        })

        this.client.ws = ws

        return ws
    }

}

module.exports = GatewayManager