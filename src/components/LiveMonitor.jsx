import React, { Component } from 'react';
import YoutubeEmbedPlayer from './youtube/YoutubeEmbedPlayer';
import withRoot from '../withRoot';
import { withStyles } from '@material-ui/core/styles';

const electron = window.require('electron');

const styles = theme => ({
    liveMonitor: {
        background: 'black',
        height: '100vh',
        width: '100%',
        position: 'relative'
    },
    videoWrapper: {
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        position: 'absolute'
    },
    videoWrapperDisplayed: {
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        position: 'absolute',
        visibility: 'hidden'
    }
});

class LiveMonitor extends Component
{
    constructor(props) {
        super(props);
        this.state = {
            plateform: 'yt',
            currentContainer: null,
            nextContainer: null
        };
        this.videoId = null;
        this.videoCued = false;

        this.currentPlayer = null;
        this.nextPlayer = null;

        this.videoPlayerA = null;
        this.videoPlayerB = null;
        this.videoContainerA = React.createRef();
        this.videoContainerB = React.createRef();

        this.onVideoPlaying = this.onVideoPlaying.bind(this);
    }

    componentDidMount() {
        electron.ipcRenderer.on('video-cued', this.onVideoCued.bind(this));
        this.currentPlayer = this.videoPlayerA;
        this.nextPlayer = this.videoPlayerB;
        this.setState({
            currentContainer: this.videoContainerB.current,
            nextContainer: this.videoContainerA.current
        });
    }

    onVideoCued(event, videoId) {
        this.nextPlayer.loadVideo(videoId);
        this.videoCued = true;
    }

    onVideoPlaying() {
        if (this.videoCued) {
            this.nextPlayer.unmute();
            this.currentPlayer.mute();
            this.currentPlayer = this.nextPlayer;
            this.nextPlayer = (this.currentPlayer === this.videoPlayerA) ? this.videoPlayerB : this.videoPlayerA;
            this.videoCued = false;
    
            this.setState((oldState) => {
                return {
                    currentContainer: oldState.nextContainer,
                    nextContainer: oldState.currentContainer
                }
            });
        }
    }

    render() {
        let classesA = (this.state.currentContainer === this.videoContainerA.current) ? this.props.classes.videoWrapperDisplayed : this.props.classes.videoWrapper;
        let classesB = (this.state.currentContainer === this.videoContainerB.current) ? this.props.classes.videoWrapperDisplayed : this.props.classes.videoWrapper;

        return (
            <div className={this.props.classes.liveMonitor}>
                <div ref={this.videoContainerA} className={classesA}>
                    <YoutubeEmbedPlayer onRef={ref => {this.videoPlayerA = ref}} options={{height: '100%', width: '100%'}} startVolume={100} quality="default" onVideoPlaying={this.onVideoPlaying}/>
                </div>
                <div ref={this.videoContainerB} className={classesB}>
                    <YoutubeEmbedPlayer onRef={ref => {this.videoPlayerB = ref}} options={{height: '100%', width: '100%'}} startVolume={100} quality="default"  onVideoPlaying={this.onVideoPlaying}/>
                </div>
            </div>
        );
    }
}

export default withRoot(withStyles(styles)(LiveMonitor), 'studio');
