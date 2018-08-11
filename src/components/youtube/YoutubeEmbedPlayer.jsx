import React, {Component} from 'react';
import YoutubePlayer from 'youtube-player';

const PlayerState = {
    UNSTARTED: -1,
    ENDED: 0,
    PLAYING: 1,
    PAUSED: 2,
    BUFFERING: 3,
    VIDEO_CUED: 5,
    getStateName(value) {
        return Object.keys(this).find(key => this[key] === value);
    }
};

const PlayerError = {
    INVALID_PARAMETERS: 2,
    NO_HTML5: 5,
    UNAVAILABLE: 100,
    UNAUTHORIZED: 101,
    UNAUTHORIZED_150: 150,
    getErrorName(value) {
        return Object.keys(this).find(key => this[key] === value);
    }
}

class YoutubeEmbedPlayer extends Component
{
    constructor(props) {
        super(props);
        this.ytPlayerState = PlayerState.UNSTARTED;
        this.YTPlayer = null;
        this.currentDuration = 0;
        this.isMuted = false;
        this.currentVolume = 0;
        this.updateTimecodeTimer = null;

        this.updateTimecode = this.updateTimecode.bind(this);
    }

    componentDidMount() {
        const defaultOptions = {
            playerVars: {
                controls: 0,
                showinfo: 0
            }
        };
        const options = Object.assign(defaultOptions, this.props.options) || defaultOptions;
        this.YTPlayer = new YoutubePlayer(this.refs.player, options);
        this.YTPlayer.on('stateChange', this.handlePlayerStateChange.bind(this));
        this.YTPlayer.on('error', this.handlePlayerError.bind(this));
        if (this.props.startVolume !== undefined) {
            this.setVolume(this.props.startVolume);
        }
        if (this.props.quality) {
            this.YTPlayer.setPlaybackQuality(this.props.quality);
        }
        if (this.props.videoId) {
            this.loadVideo(this.props.videoId);
        }
        if (this.props.onRef)
            this.props.onRef(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.videoId !== this.props.videoId) {
            this.loadVideo(this.props.videoId);
        }
    }

    updateTimecode() {
        if (this.ytPlayerState === PlayerState.PLAYING) {
            this.YTPlayer.getCurrentTime().then(result => {
                if (this.props.handleTimecodeChange) {
                    this.props.handleTimecodeChange(result);
                }
            });
        }
    }

    loadVideo(videoId) {
        console.log('Loading videoId: ' + videoId);
        this.YTPlayer.loadVideoById(videoId);
        this.YTPlayer.playVideo();
        if (!this.updateTimecodeTimer) 
            this.updateTimecodeTimer = setInterval(this.updateTimecode, 100);
    }

    getDuration() {
        return this.currentDuration;
    }

    isMuted() {
        return this.isMuted;
    }

    unmute() {
        this.YTPlayer.unMute().then(() => {this.isMuted = false});
    }

    mute() {
        this.YTPlayer.mute().then(() => {this.isMuted = true});
    }

    getVolume() {
        return this.currentVolume;
    }

    setVolume(volume) {
        this.YTPlayer.setVolume(volume).then(() => {this.currentVolume = volume});
    }

    play() {
        const state = this.ytPlayerState
        if (state === PlayerState.PAUSED || state === PlayerState.ENDED) {
            this.YTPlayer.playVideo();
            if (state === PlayerState.ENDED) // To restart the video you have to play twice
                this.YTPlayer.playVideo();
        }
    }

    pause() {
        if (this.ytPlayerState === PlayerState.PLAYING || this.ytPlayerState === PlayerState.BUFFERING)
            this.YTPlayer.pauseVideo();
    }

    seek(time) {
        const duration = this.currentDuration;
        if (this.ytPlayerState === PlayerState.PLAYING || this.ytPlayerState === PlayerState.BUFFERING) {
            if (time <= duration) {
                this.YTPlayer.seekTo(time, true);
            }
        } else if (this.ytPlayerState === PlayerState.ENDED || this.ytPlayerState === PlayerState.PAUSED) {
            if (time <= duration) {
                this.YTPlayer.seekTo(time, true).then(() => {
                    this.YTPlayer.playVideo();
                });
            }
        }
    }

    handlePlayerError(error) {
        console.error(PlayerError.getErrorName(error.data));
    }

    handlePlayerStateChange(eventInfo) {
        console.log(PlayerState.getStateName(eventInfo.data));
        const oldState = this.ytPlayerState;
        switch (eventInfo.data) {
            case PlayerState.PLAYING: {
                if (oldState === PlayerState.BUFFERING) {           // The things youtube makes you do...
                    this.YTPlayer.getDuration().then(result => {
                        this.currentDuration = result;
                    });
                }
                break;
            }
            case PlayerState.ENDED: {
                this.props.handleVideoEnd();
                break;
            }
        }
        this.ytPlayerState = eventInfo.data;
    }

    componentWillUnmount() {
        this.YTPlayer.destroy();
        if (this.props.onRef)
            this.props.onRef(undefined);
    }

    render() {
        return <div className="Player-Embed-Youtube"><div ref="player"></div></div>;
    }
}

export default YoutubeEmbedPlayer;