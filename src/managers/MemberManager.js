const GuildMember = require('../user/GuildMember')
const fetch = require('node-fetch')
const Manager = require('./Manager')

class MemberManager extends Manager {
    /**
     * A Manager for managing the members of a guild
     * @param {Client} client
     * @param {Guild} guild
     * @param {Array<Object>} members 
     */
    constructor(client, guild, members = []) {
        super(client, GuildMember, members)

        this.guild = guild
    }

    /**
     * Searches for a guild member.
     * @param {any} memberIdentifiable "The ID of a user, or tag of a guild member."
     * @param {Boolean} forceApi "Whether or not to skip the cache"
     * @returns {Promise<User>} "The User instance."
     */
    fetch(memberIdentifiable, forceApi = false) {
        return new Promise((resolve, reject) => {
            if (typeof memberIdentifiable === 'number') memberIdentifiable = memberIdentifiable.toString()
            if (this.cache.has(memberIdentifiable) && !forceApi) resolve(this.cache.get(memberIdentifiable))
            else {
                for (const user of this.cache) if (user[1].tag === memberIdentifiable && !forceApi) resolve(user)
                fetch('https://discord.com/api/guilds/' + this.guild.id + '/members/' + memberIdentifiable, { method: 'GET', 'headers': { 'Authorization': 'Bot ' + this.client.token } })
                    .then(res => res.json())
                    .then(res => {
                        this.updateCache(res, this.guild)
                        resolve(this.cache.get(res.id))
                    }).catch(reject)
            }
        }
        )}

    /**
     * Lists members of the guild.
     * @param {Number} limit The maximum number of members to list, from 1 to 1000. 
     * @param {Number} after The user ID to start after
     * @returns {Promise<Array<GuildMember>>}
     */
    listMembers(limit = 1, after = 0) {
        return new Promise((resolve, reject) => {
            fetch('https://discord.com/api/guilds/' + this.guild.id + '/members?limit=' + limit + '&after=' + after, { method: 'GET', 'headers': { 'Authorization': 'Bot ' + this.client.token } })
                .then(res => res.json())
                .then(res => {
                    this.updateCache(res, this.guild)
                    let toRet = []
                    for (let memb of res) toRet.push(this.cache.get(memb.id))
                    resolve(toRet)
                }).catch(reject)
        })
    }

    /**
     * Search for members of the guild whose names match a query.
     * @param {String} query A string to compare usernames and nicknames against 
     * @param {Number} limit The maximum number of members to search for, from 1 to 1000.
     * @returns {Promise<Array<GuildMember>>}
     */
    searchMembers(query, limit = 1) {
        return new Promise((resolve, reject) => {
            fetch('https://discord.com/api/guilds/' + this.guild.id + '/members/search?query=' + encodeURIComponent(query) + '&limit=' + limit, { method: 'GET', 'headers': { 'Authorization': 'Bot ' + this.client.token } })
                .then(res => res.json())
                .then(res => {
                    this.updateCache(res, this.guild)
                    let toRet = []
                    for (let memb of res) toRet.push(this.cache.get(memb.id))
                    resolve(toRet)
                }).catch(reject)
        })
    }
}

module.exports = MemberManager
