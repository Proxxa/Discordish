const GuildChannel = require("./GuildChannel")

class VoiceChannel extends GuildChannel {

    /**
     * A voice channel found in a guild
     * @param {Client} client The client that instantiated this channel.
     * @param {Object} data The data for this channel
     * @extends GuildChannel
     * @todo Anything related to connecting to voice channels.
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
        this.region = data.rtc_region === null ? "automatic" : data.rtc_region

        /**
         * The video quality for the channel.
         * @readonly
         */
        this.videoQuality = data.video_quality_mode ? data.video_quality_mode : 1
    }


    // Voice channel interactions soon.
}

module.exports = VoiceChannel

/**
 * Data that describes a voice channel in a guild
 * @typedef {GuildChannelData} VoiceChannelData
 * @property {Number} bitrate The bitrate of the channel
 * @property {Number} user_limit The maximum number of users that may be in a channel. 0 if no limit.
 * @property {String?} rtc_region The server region this channel defaults to. Null if automatic.
 * @property {Number?} video_quality_mode The mode of video quality for this channel.
 * */
