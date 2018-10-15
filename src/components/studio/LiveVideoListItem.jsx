import React, { Component } from 'react';
import withRoot from '../../withRoot';
import { Typography, Grid, Paper, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import LiveVideo from './LiveVideo';

const electron = window.require('electron');

const styles = theme => ({
    container: {
        width: '265px',
        height: '150px',
        overflow: 'hidden',
        boxShadow: '0 0 0 1px ' + grey[700],
        borderRadius: '5px',
        transition: 'all ease 0.2s',
        '&:hover': {
            boxShadow: '0 0 0 2px ' +  theme.palette.primary.main + ', 0 10px 20px rgba(0, 0, 0, 0.3)',
        },
        '&:hover [class*="overlayBackground"]': {
            backgroundColor: 'rgba(0, 0, 0, 0.6)'
        },
        '&:hover [class*="overlayButton"]': {
            opacity: '1'
        }
    },
    videoWrapper: {
        width: '100%',
        height: '100%',
        overflow:'hidden'
    },
    overlay: {
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow:'hidden',
        borderRadius: '5px'
    },
    overlayBackground: {
        position: 'absolute',
        width: '265px',
        height: '150px',
        transition: 'all ease 0.2s',
        borderRadius: '5px',
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.6)'
        }
    },
    actions: {
        position: 'relative',
        bottom: '45px',
        left: '5px'
    },
    overlayButton: {
        opacity: '0',
        padding: '3px',
        marginLeft: '10px',
        transition: 'opacity ease 0.2s'
    }
});

class LiveVideoListItem extends Component {

    constructor(props) {
        super(props);

        this.handleCueLive = this.handleCueLive.bind(this);
    }

    handleCueLive() {
        electron.ipcRenderer.send('cue-video', this.props.videoInfo);
    }

    render() {
        return (
            <div className={this.props.classes.container}>
                <div className={this.props.classes.videoWrapper}>
                    <div className={this.props.classes.overlayBackground}>
                    </div>
                    <div className={this.props.classes.overlay}>
                        <LiveVideo plateform={this.props.plateform} videoInfo={this.props.videoInfo} width={265} height={150}/>
                    </div>
                </div>
                <div className={this.props.classes.actions}>
                    <Button size="small" className={this.props.classes.overlayButton} variant="contained" color="primary">PREVIEW</Button>
                    <Button size="small" onClick={this.handleCueLive} className={this.props.classes.overlayButton} variant="contained" color="secondary">LIVE</Button>                    
                </div>
            </div>
        );
    }
}

export default withRoot(withStyles(styles)(LiveVideoListItem), 'studio');