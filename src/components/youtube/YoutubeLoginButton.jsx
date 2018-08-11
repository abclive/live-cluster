import React, { Component } from 'react';
import withRoot from '../../withRoot';
import { withStyles } from '@material-ui/core/styles';
import { Button, Icon } from '@material-ui/core';
import { red } from '@material-ui/core/colors';

const electron = window.require('electron');

const styles = theme => ({
    ytButton: {
        color: theme.palette.getContrastText(red[500]),
        backgroundColor: red[500],
        '&:hover': {
            backgroundColor: red[400],
        }
    },
    icon: {
        marginRight: '10px'
    }
})

class YoutubeLoginButton extends Component
{
    constructor(props) {
        super(props);
    }

    handleOnClick() {
        electron.ipcRenderer.send('yt-auth-request');
    }

    render() {
        return (
            <Button className={this.props.classes.ytButton} variant="contained" color="primary" onClick={this.handleOnClick}><Icon className={this.props.classes.icon}>person_add</Icon>Login with Youtube</Button>
        );
    }
}

export default withRoot(withStyles(styles)(YoutubeLoginButton));