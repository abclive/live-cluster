import React, { Component } from 'react';
import withRoot from '../../withRoot';
import { Typography, GridList, Paper, CircularProgress } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import LiveVideoListItem from './LiveVideoListItem';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden'
    },
    gridList: {
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    },
    listItem: {
        margin: '5px 10px'
    }
});

class LiveVideoList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            plateform: props.plateform,
            videoList: props.videoList
        };
    }

    render() {
        return (
            <div className={this.props.classes.root}>
                <GridList className={this.props.classes.gridList} cols={2.5}>
                    {this.state.videoList.map(video => (
                        <div className={this.props.classes.listItem}>
                            <LiveVideoListItem key={video.id} plateform={this.state.plateform} videoInfo={video}/>
                        </div>
                    ))}
                </GridList>
            </div>
        );
    }
}

export default withRoot(withStyles(styles)(LiveVideoList), 'studio');