const GuildChannel = require("./GuildChannel");

class VoiceChannel extends GuildChannel {

    /**
     * 
     * @param {Client} client The client that instantiated this channel.
     * @param {Object} data The data for this channel
     */
    constructor(client, data) {
        super(client, data)

        /**
         * The voice channel's bitrate.
         * @readonly
         */
        this.bitrate = data.bitrate

        /**
         * The maximimum number of users in a voice channel.
         * @readonly
         */
        this.maxUsers = data.user_limit

        /**
         * The region for this voice channel.
         * @readonly
         */
        this.region = (data.rtc_region === null ? "automatic" : data.rtc_region)

        /**
         * The video quality for the channel.
         * @readonly
         */
        this.videoQuality = (data.video_quality_mode ? data.video_quality_mode : 1)
    }


    // Voice channel interactions soon.
}

module.exports = VoiceChannel