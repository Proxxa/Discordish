
const enumerify = function(arr) {
    let obj = {}
    let i = 0
    for (const it of arr) {
        obj[it] = it
        obj[i] = it
    }
    return Object.freeze(obj)
}

module.exports = enumerify([
    "GUILD_TEXT",
    "DM",
    "GUILD_VOICE",
    "GROUP_DM",
    "GUILD_CATEGORY",
    "GUILD_NEWS",
    "GUILD_STORE",
    "null",
    "null",
    "null",
    "null",
    "null",
    "null",
    "null",
    "GUILD_STAGE_VOICE"
])
