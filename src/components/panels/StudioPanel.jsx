import React, { Component } from 'react';
import withRoot from '../../withRoot';
import { Typography, Grid, Paper, CircularProgress } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import LiveVideoList from '../studio/LiveVideoList';

const electron = window.require('electron');

const styles = theme => ({
    studio: {
        height: '100%'
    },
    monitors: {
        height: "70%"
    },
    loadingContainer: {
        paddingTop: '150px'
    },
    loadingText: {
        textAlign: 'center',
        paddingTop: '10px'
    }
});

class StudioPanel extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            liveVideoList: []
        };
        
        this.onLiveList = this.onLiveList.bind(this);
    }

    componentDidMount() {
        if (this.props.plateform == 'yt') {
            electron.ipcRenderer.on('yt-lives-list', this.onLiveList);
            electron.ipcRenderer.send('yt-list-lives', this.props.plateformInfo);
        }
    }

    onLiveList(event, liveVideoList) {
        this.setState({
            liveVideoList: liveVideoList,
            isLoading: false
        });
    }

    renderInner() {
        if (this.state.isLoading) {
            return (
                <Grid className={this.props.classes.loadingContainer} container alignItems="center" justify="center">
                    <CircularProgress/>
                    <Grid item xs={12}>
                        <Typography className={this.props.classes.loadingText}>Loading live videos ...</Typography>
                    </Grid>
                </Grid>
            );
        } else {
            return (
                <div className={this.props.classes.monitors}>
                </div>,
                <div className={this.props.classes.videoListContainer}>
                    <LiveVideoList plateform={this.props.plateform} videoList={this.state.liveVideoList}/>
                </div>
            );
        }
    }

    render() {
        return (
            <div className={this.props.classes.studio}>
                {this.renderInner()};
            </div>
        );
    }
}

export default withRoot(withStyles(styles)(StudioPanel), 'studio');
