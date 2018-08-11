import React, { Component } from 'react';
import withRoot from '../../withRoot';
import {  } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import YoutubeEmbedPlayer from '../youtube/YoutubeEmbedPlayer';

const styles = theme => ({

});

class LiveVideo extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return <YoutubeEmbedPlayer videoId={this.props.videoInfo.id} startVolume={0} options={{height: this.props.height, width: this.props.width}} quality="small"/>
    }
}

export default withRoot(withStyles(styles)(LiveVideo), 'studio');