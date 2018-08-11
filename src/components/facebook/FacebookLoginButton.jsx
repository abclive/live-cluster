import React, { Component } from 'react';
import withRoot from '../../withRoot';
import { withStyles } from '@material-ui/core/styles';
import { Button, Icon } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';

const electron = window.require('electron');

const styles = theme => ({
    fbButton: {
        color: theme.palette.getContrastText(blue[900]),
        backgroundColor: blue[900],
        '&:hover': {
            backgroundColor: blue[800],
        }
    },
    icon: {
        marginRight: '10px'
    }
})

class FacebookLoginButton extends Component
{
    constructor(props) {
        super(props);
    }

    handleOnClick() {
        electron.ipcRenderer.send('fb-auth-request');
    }

    render() {
        return (
            <Button className={this.props.classes.fbButton} variant="contained" color="primary" onClick={this.handleOnClick}><Icon className={this.props.classes.icon}>person_add</Icon>Login with Facebook</Button>
        );
    }
}

export default withRoot(withStyles(styles)(FacebookLoginButton));