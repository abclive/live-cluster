import React, { Component } from 'react';
import withRoot from '../../withRoot';
import { Typography, Grid, Button, CircularProgress } from '@material-ui/core';
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
    },
    videoListContainer: {
        backgroundColor: theme.palette.background.paper,
        position: 'fixed',
        bottom: '0',
        width: '100%'
    },
    videoListHeading: {
        padding: '20px 30px',
        position: 'relative'
    },
    videoListTitle: {
        display: 'inline'
    },
    refreshBtn: {
        display: 'inline-block',
        position: 'absolute',
        right: '30px'
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
        this.onRefresh = this.onRefresh.bind(this);
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

    onRefresh() {
        electron.ipcRenderer.send('yt-list-lives', this.props.plateformInfo);
        this.setState({
            isLoading: true
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
                    <div className={this.props.classes.videoListHeading}>
                        <Typography className={this.props.classes.videoListTitle} variant="display1">Live Videos <Typography className={this.props.classes.videoListTitle} variant="body1">matching {this.props.plateformInfo}</Typography></Typography>
                        <Button className={this.props.classes.refreshBtn} onClick={this.onRefresh} variant="contained" size="small" color="primary">Refresh</Button>
                    </div>
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
